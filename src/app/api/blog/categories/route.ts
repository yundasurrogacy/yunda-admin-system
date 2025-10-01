import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const query = `query GetCategories { 
    blogs { 
      category 
    } 
  }`;
  
  const result = await hasuraClient.execute({ query });
  const blogs = result?.blogs || [];
  
  // 统计每个分类的数量
  const categoryCounts: Record<string, number> = {};
  blogs.forEach((blog: any) => {
    categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
  });
  
  // 获取所有分类
  const categories = [...new Set(blogs.map((blog: any) => blog.category))];
  
  return new NextResponse(JSON.stringify({
    categories,
    categoryCounts
  }), { status: 200, headers: corsHeaders });
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
