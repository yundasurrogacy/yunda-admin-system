import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

export async function GET(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  let query = '';
  let variables = {};
  if (id) {
    query = `query GetBlog($id: bigint!) { blogs_by_pk(id: $id) { id title content category cover_img_url created_at updated_at } }`;
    variables = { id: Number(id) };
  } else {
    query = `query GetBlogs { blogs(order_by: {created_at: desc}) { id title content category cover_img_url created_at updated_at } }`;
  }
  const result = await hasuraClient.execute({ query, variables });
  if (id) {
    return NextResponse.json(result?.blogs_by_pk);
  }
  return NextResponse.json({ blogs: result?.blogs || [] });
}

export async function POST(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const query = `mutation InsertBlog($object: blogs_insert_input!) { insert_blogs_one(object: $object) { id title content category cover_img_url created_at updated_at } }`;
  const variables = { object: body };
  const result = await hasuraClient.execute({ query, variables });
  return NextResponse.json(result?.insert_blogs_one);
}

export async function PUT(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: '缺少id' }, { status: 400 });
  const query = `mutation UpdateBlog($id: bigint!, $fields: blogs_set_input!) { update_blogs_by_pk(pk_columns: {id: $id}, _set: $fields) { id title content category cover_img_url created_at updated_at } }`;
  const variables = { id, fields };
  const result = await hasuraClient.execute({ query, variables });
  return NextResponse.json(result?.update_blogs_by_pk);
}

export async function DELETE(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: '缺少id' }, { status: 400 });
  const query = `mutation DeleteBlog($id: bigint!) { delete_blogs_by_pk(id: $id) { id } }`;
  const variables = { id };
  const result = await hasuraClient.execute({ query, variables });
  return NextResponse.json(result?.delete_blogs_by_pk);
}
