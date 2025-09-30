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
  let query = '';
  let variables = {};
  if (id) {
    query = `query GetBlog($id: bigint!) { blogs_by_pk(id: $id) { id title content category cover_img_url tags reference_author created_at updated_at } }`;
    variables = { id: Number(id) };
  } else {
    query = `query GetBlogs { blogs(order_by: {created_at: desc}) { id title content category cover_img_url tags reference_author created_at updated_at } }`;
  }
  const result = await hasuraClient.execute({ query, variables });
  if (id) {
    return new NextResponse(JSON.stringify(result?.blogs_by_pk), { status: 200, headers: corsHeaders });
  }
  return new NextResponse(JSON.stringify({ blogs: result?.blogs || [] }), { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const query = `mutation InsertBlog($object: blogs_insert_input!) { insert_blogs_one(object: $object) { id title content category cover_img_url tags reference_author created_at updated_at } }`;
  const variables = { object: body };
  const result = await hasuraClient.execute({ query, variables });
  return new NextResponse(JSON.stringify(result?.insert_blogs_one), { status: 200, headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return new NextResponse(JSON.stringify({ error: '缺少id' }), { status: 400, headers: corsHeaders });
  const query = `mutation UpdateBlog($id: bigint!, $fields: blogs_set_input!) { update_blogs_by_pk(pk_columns: {id: $id}, _set: $fields) { id title content category cover_img_url tags reference_author created_at updated_at } }`;
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
