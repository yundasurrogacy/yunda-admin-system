import { NextRequest } from 'next/server';
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 查询 posts 列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const caseId = searchParams.get('caseId');
    const client = getHasuraClient();
    const query = `query Posts($where: posts_bool_exp) {
      posts(where: $where, order_by: {created_at: desc}) {
        id
        case_cases
        content
        created_at
        post_comments {
          id
          content
          comment_role
          created_at
          surrogate_mother_surrogate_mothers
          intended_parent_intended_parents
        }
      }
    }`;
    const variables = { where: caseId ? { case_cases: { _eq: Number(caseId) } } : {} };
    const result = await client.execute({ query, variables });
    return Response.json({ data: result.posts });
  } catch (e) {
    console.error("GraphQL error:", e);
    return Response.json({ error: "获取 posts 失败", detail: String(e) }, { status: 500 });
  }
}

// 新增 posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = getHasuraClient();
    const mutation = `mutation InsertPost($object: posts_insert_input!) {
      insert_posts_one(object: $object) {
        id
        case_cases
        content
        title
        created_at
      }
    }`;
    // 补充 title 字段，前端 message 作为 title
    const variables = { object: {
      content: body.content,
      case_cases: body.case_cases,
      title: body.title || body.content?.slice(0, 20) || "日志"
    }};
    const result = await client.execute({ query: mutation, variables });
    return Response.json({ data: result.insert_posts_one });
  } catch (e) {
    console.error("GraphQL error:", e);
    return Response.json({ error: "新增 post 失败", detail: String(e) }, { status: 500 });
  }
}

// 删除/修改可按需补充
