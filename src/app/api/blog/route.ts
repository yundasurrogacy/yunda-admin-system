import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const publicCacheHeaders = {
  ...corsHeaders,
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
};

type BlogRecord = {
  id: number | string;
  route_id?: string | null;
  title?: string | null;
  content?: string | null;
  en_title?: string | null;
  en_content?: string | null;
  category?: string | null;
  cover_img_url?: string | null;
  tags?: string | null;
  reference_author?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type BlogLanguage = 'en' | 'zh' | null;

const BLOG_BASE_FIELDS = 'id route_id title en_title category cover_img_url tags reference_author created_at updated_at';
const BLOG_FULL_FIELDS = `${BLOG_BASE_FIELDS} content en_content`;

function getBlogDetailFields(lang: BlogLanguage) {
  if (lang === 'zh') return `${BLOG_BASE_FIELDS} content`;
  if (lang === 'en') return `${BLOG_BASE_FIELDS} en_content`;
  return BLOG_FULL_FIELDS;
}

function getBlogListFields(includeContent: boolean, lang: BlogLanguage) {
  if (includeContent) return BLOG_FULL_FIELDS;
  if (lang === 'zh') return `${BLOG_BASE_FIELDS} content`;
  if (lang === 'en') return `${BLOG_BASE_FIELDS} en_content`;
  return BLOG_FULL_FIELDS;
}

function stripHtml(value?: string | null) {
  if (!value) return '';

  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function createExcerpt(value?: string | null, maxLength = 180) {
  const plainText = stripHtml(value);
  const chars = Array.from(plainText);

  if (chars.length <= maxLength) return plainText;

  return `${chars.slice(0, maxLength).join('').trim()}...`;
}

function toBlogListItem(blog: BlogRecord) {
  const excerpt = createExcerpt(blog.content);
  const enExcerpt = createExcerpt(blog.en_content);

  return {
    id: blog.id,
    route_id: blog.route_id,
    title: blog.title,
    en_title: blog.en_title,
    category: blog.category,
    cover_img_url: blog.cover_img_url,
    tags: blog.tags,
    reference_author: blog.reference_author,
    created_at: blog.created_at,
    updated_at: blog.updated_at,
    excerpt,
    en_excerpt: enExcerpt,
    meta_description: excerpt,
    en_meta_description: enExcerpt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const hasuraClient = getHasuraClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const route_id = searchParams.get('route_id');
    const search = searchParams.get('search')||"";
    const category = searchParams.get('category')||"";
    const includeContent = searchParams.get('includeContent') === 'true';
    const requestedLang = searchParams.get('lang');
    const lang: BlogLanguage = requestedLang === 'zh' || requestedLang === 'en' ? requestedLang : null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const offset = (page - 1) * limit;

    let query = '';
    let variables = {};

    if (id || route_id) {
      const blogDetailFields = getBlogDetailFields(lang);

      // 获取单个博客 - 支持通过id或route_id查询
      if (route_id) {
        query = `query GetBlogByRouteId($route_id: String!) { 
      blogs(where: {route_id: {_eq: $route_id}}) { 
        ${blogDetailFields} 
      } 
    }`;
        variables = { route_id };
      } else {
        query = `query GetBlog($id: bigint!) { 
      blogs_by_pk(id: $id) { 
        ${blogDetailFields} 
      } 
    }`;
        variables = { id: Number(id) };
      }
    } else {
      const blogListFields = getBlogListFields(includeContent, lang);

      // 获取博客列表，支持筛选、搜索、分页
      let whereClause = '';
      let whereVariables: any = {};

      // 构建where条件
      if (category && category !== '全部' && search && search.trim()) {
        // 同时有分类和搜索条件 - 搜索中文和英文标题
        whereClause = 'where: {_and: [{category: {_eq: $category}}, {_or: [{title: {_ilike: $search}}, {en_title: {_ilike: $search}}]}]}';
        whereVariables = { category, search: `%${search.trim()}%` };
      } else if (category && category !== '全部') {
        // 只有分类条件
        whereClause = 'where: {category: {_eq: $category}}';
        whereVariables = { category };
      } else if (search && search.trim()) {
        // 只有搜索条件 - 搜索中文和英文标题
        whereClause = 'where: {_or: [{title: {_ilike: $search}}, {en_title: {_ilike: $search}}]}';
        whereVariables = { search: `%${search.trim()}%` };
      }

      // 构建查询
      if (whereClause) {
        query = `query GetBlogs($offset: Int!, $limit: Int!, $category: String, $search: String) { 
      blogs(
        order_by: {created_at: desc}
        offset: $offset
        limit: $limit
        ${whereClause}
      ) { 
        ${blogListFields} 
      }
      blogs_aggregate(
        ${whereClause}
      ) {
        aggregate {
          count
        }
      }
    }`;
      } else {
        query = `query GetBlogs($offset: Int!, $limit: Int!) { 
      blogs(
        order_by: {created_at: desc}
        offset: $offset
        limit: $limit
      ) { 
        ${blogListFields} 
      }
      blogs_aggregate {
        aggregate {
          count
        }
      }
    }`;
      }

      if (whereClause) {
        variables = {
          offset,
          limit,
          ...whereVariables
        };
      } else {
        variables = {
          offset,
          limit
        };
      }
    }

    const result = await hasuraClient.execute({ query, variables });

    if (id || route_id) {
      // 处理单个博客查询结果
      if (route_id) {
        const blog = result?.blogs?.[0];
        return NextResponse.json(blog, { headers: publicCacheHeaders });
      } else {
        return NextResponse.json(result?.blogs_by_pk, { headers: publicCacheHeaders });
      }
    }

    // 返回分页数据和总数
    const blogs: BlogRecord[] = result?.blogs || [];
    const totalCount = result?.blogs_aggregate?.aggregate?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      blogs: includeContent ? blogs : blogs.map(toBlogListItem),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { headers: publicCacheHeaders });
  } catch (error) {
    console.error('Error in GET /api/blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const query = `mutation InsertBlog($object: blogs_insert_input!) { insert_blogs_one(object: $object) { id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at } }`;
  const variables = { object: body };
  const result = await hasuraClient.execute({ query, variables });
  return NextResponse.json(result?.insert_blogs_one, { headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: '缺少id' }, { status: 400, headers: corsHeaders });
  const query = `mutation UpdateBlog($id: bigint!, $fields: blogs_set_input!) { update_blogs_by_pk(pk_columns: {id: $id}, _set: $fields) { id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at } }`;
  const variables = { id, fields };
  const result = await hasuraClient.execute({ query, variables });
  return NextResponse.json(result?.update_blogs_by_pk, { headers: corsHeaders });
}

export async function DELETE(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: '缺少id' }, { status: 400, headers: corsHeaders });
  const query = `mutation DeleteBlog($id: bigint!) { delete_blogs_by_pk(id: $id) { id } }`;
  const variables = { id };
  const result = await hasuraClient.execute({ query, variables });
  return NextResponse.json(result?.delete_blogs_by_pk, { headers: corsHeaders });
}


export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
