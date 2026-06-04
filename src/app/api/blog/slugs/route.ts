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

export async function GET(request: NextRequest) {
  try {
    const hasuraClient = getHasuraClient();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const rawLimit = Number.parseInt(searchParams.get('limit') || '2000', 10) || 2000;
    const limit = Math.min(Math.max(rawLimit, 1), 2000);
    const offset = (page - 1) * limit;

    const query = `query GetBlogSlugs($offset: Int!, $limit: Int!) {
      blogs(
        order_by: {created_at: desc}
        offset: $offset
        limit: $limit
      ) {
        id
        route_id
        title
        en_title
        created_at
        updated_at
      }
      blogs_aggregate {
        aggregate {
          count
        }
      }
    }`;

    const result = await hasuraClient.execute({ query, variables: { offset, limit } });
    const blogs = result?.blogs || [];
    const totalCount = result?.blogs_aggregate?.aggregate?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }, { headers: publicCacheHeaders });
  }
  catch (error) {
    console.error('Error in GET /api/blog/slugs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog slugs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function OPTIONS() {
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
