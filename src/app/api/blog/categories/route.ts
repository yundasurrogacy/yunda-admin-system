import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: NextRequest) {
  try {
    const hasuraClient = getHasuraClient();
    const query = `query GetCategories { 
      blogs (distinct_on:category){ 
        category 
      } 
    }`;
    
    const result = await hasuraClient.execute({ query });
    const blogs = result?.blogs || [];
    
    // 过滤掉没有分类的博客
    const blogsWithCategory = blogs.filter((blog: any) => blog?.category);
    
    // 统计每个分类的数量
    const categoryCounts: Record<string, number> = {};
    blogsWithCategory.forEach((blog: any) => {
      const category = blog.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // 获取所有分类（过滤掉空值）
    const categories = [...new Set(blogsWithCategory.map((blog: any) => blog.category))].filter(Boolean);
    
    return NextResponse.json({
      categories,
      categoryCounts
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in GET /api/blog/categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
