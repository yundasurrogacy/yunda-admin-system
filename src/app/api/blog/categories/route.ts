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

const categoryOptions = [
  { alias: 'surrogate', value: '代孕妈妈相关' },
  { alias: 'parents', value: '准父母相关' },
  { alias: 'brand', value: '孕达品牌相关' },
  { alias: 'process', value: '代孕流程相关' },
  { alias: 'law', value: '法律法规相关' },
  { alias: 'industry', value: '行业动态相关' },
  { alias: 'medical', value: '医学健康相关' },
  { alias: 'education', value: '教育科普相关' },
  { alias: 'success', value: '成功案例相关' },
  { alias: 'psychology', value: '心理情绪相关' },
];

export async function GET(request: NextRequest) {
  try {
    const hasuraClient = getHasuraClient();
    const query = `query GetCategories { 
      total: blogs_aggregate {
        aggregate {
          count
        }
      }
      ${categoryOptions.map(category => `
      ${category.alias}: blogs_aggregate(where: {category: {_eq: "${category.value}"}}) {
        aggregate {
          count
        }
      }`).join('\n')}
    }`;
    
    const result = await hasuraClient.execute({ query });
    const categoryCounts: Record<string, number> = {};
    const categories: string[] = [];

    categoryOptions.forEach((category) => {
      const count = result?.[category.alias]?.aggregate?.count || 0;
      if (count > 0) {
        categoryCounts[category.value] = count;
        categories.push(category.value);
      }
    });
    
    return NextResponse.json({
      categories,
      categoryCounts,
      totalCount: result?.total?.aggregate?.count || 0
    }, { headers: publicCacheHeaders });
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
