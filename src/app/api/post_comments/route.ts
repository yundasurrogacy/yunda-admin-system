import { NextRequest } from 'next/server';
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 查询 post_comments 列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    const client = getHasuraClient();
    const query = `query PostComments($where: post_comments_bool_exp) {
      post_comments(where: $where, order_by: {created_at: desc}) {
        id
        content
        comment_role
        created_at
        surrogate_mother_surrogate_mothers
        intended_parent_intended_parents
        post_posts
      }
    }`;
    const variables = { where: postId ? { post_posts: { _eq: Number(postId) } } : {} };
    const result = await client.execute({ query, variables });
    return Response.json({ data: result.post_comments });
  } catch (e) {
    console.error("GraphQL error:", e);
    return Response.json({ error: "获取 post_comments 失败", detail: String(e) }, { status: 500 });
  }
}

// 新增 post_comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = getHasuraClient();
    const mutation = `mutation InsertPostComment($object: post_comments_insert_input!) {
      insert_post_comments_one(object: $object) {
        id
        content
        comment_role
        created_at
        post_posts
        surrogate_mother_surrogate_mothers
        intended_parent_intended_parents
      }
    }`;
    const variables = { object: {
      content: body.content,
      comment_role: body.comment_role,
      post_posts: body.post_posts,
      surrogate_mother_surrogate_mothers: body.surrogate_mother_surrogate_mothers,
      intended_parent_intended_parents: body.intended_parent_intended_parents
    }};
    const result = await client.execute({ query: mutation, variables });
    return Response.json({ data: result.insert_post_comments_one });
  } catch (e) {
    console.error("GraphQL error:", e);
    return Response.json({ error: "新增 post_comment 失败", detail: String(e) }, { status: 500 });
  }
}

// 删除/修改可按需补充
