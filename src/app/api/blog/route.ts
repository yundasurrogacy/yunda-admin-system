import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const route_id = searchParams.get('route_id');
  const search = searchParams.get('search')||"";
  const category = searchParams.get('category')||"";
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '9');
  const offset = (page - 1) * limit;

  let query = '';
  let variables = {};

  if (id || route_id) {
    // 获取单个博客 - 支持通过id或route_id查询
    if (route_id) {
      query = `query GetBlogByRouteId($route_id: String!) { 
        blogs(where: {route_id: {_eq: $route_id}}) { 
          id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at 
        } 
      }`;
      variables = { route_id };
    } else {
      query = `query GetBlog($id: bigint!) { 
        blogs_by_pk(id: $id) { 
          id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at 
        } 
      }`;
      variables = { id: Number(id) };
    }
  } else {
    // 获取博客列表，支持筛选、搜索、分页
    let whereClause = '';
    let whereVariables: any = {};

    // 构建where条件
    if (category && category !== '全部' && search && search.trim()) {
      // 同时有分类和搜索条件
      whereClause = 'where: {_and: [{category: {_eq: $category}}, {title: {_ilike: $search}}]}';
      whereVariables = { category, search: `%${search.trim()}%` };
    } else if (category && category !== '全部') {
      // 只有分类条件
      whereClause = 'where: {category: {_eq: $category}}';
      whereVariables = { category };
    } else if (search && search.trim()) {
      // 只有搜索条件
      whereClause = 'where: {title: {_ilike: $search}}';
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
          id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at 
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
          id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at 
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

  console.log(query, variables);

  const result = await hasuraClient.execute({ query, variables });

  if (id || route_id) {
    // 处理单个博客查询结果
    if (route_id) {
      const blog = result?.blogs?.[0];
      return new NextResponse(JSON.stringify(blog), { status: 200, headers: corsHeaders });
    } else {
      return new NextResponse(JSON.stringify(result?.blogs_by_pk), { status: 200, headers: corsHeaders });
    }
  }

  // 返回分页数据和总数
  const blogs = result?.blogs || [];
  const totalCount = result?.blogs_aggregate?.aggregate?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return new NextResponse(JSON.stringify({
    blogs,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  }), { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const query = `mutation InsertBlog($object: blogs_insert_input!) { insert_blogs_one(object: $object) { id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at } }`;
  const variables = { object: body };
  const result = await hasuraClient.execute({ query, variables });
  return new NextResponse(JSON.stringify(result?.insert_blogs_one), { status: 200, headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return new NextResponse(JSON.stringify({ error: '缺少id' }), { status: 400, headers: corsHeaders });
  const query = `mutation UpdateBlog($id: bigint!, $fields: blogs_set_input!) { update_blogs_by_pk(pk_columns: {id: $id}, _set: $fields) { id route_id title content en_title en_content category cover_img_url tags reference_author created_at updated_at } }`;
  const variables = { id, fields };
  const result = await hasuraClient.execute({ query, variables });
  return new NextResponse(JSON.stringify(result?.update_blogs_by_pk), { status: 200, headers: corsHeaders });
}

export async function DELETE(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const { id } = body;
  if (!id) return new NextResponse(JSON.stringify({ error: '缺少id' }), { status: 400, headers: corsHeaders });
  const query = `mutation DeleteBlog($id: bigint!) { delete_blogs_by_pk(id: $id) { id } }`;
  const variables = { id };
  const result = await hasuraClient.execute({ query, variables });
  return new NextResponse(JSON.stringify(result?.delete_blogs_by_pk), { status: 200, headers: corsHeaders });
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
