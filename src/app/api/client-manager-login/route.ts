import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
  const { username, email, password } = await req.json();
  // 兼容前端传 username 或 email
  const loginEmail = email || username;
    // 根据实际表结构调整字段
    const query = `
    query ManagerLogin($email: String!, $password: String!) {
        client_managers(where: { email: { _eq: $email }, password: { _eq: $password } }) {
        id
        email
        created_at
        updated_at
        }
    }
    `;
    const client = getHasuraClient();
  const res = await client.execute({ query, variables: { email: loginEmail, password } });
    const manager = res.client_managers?.[0];
    if (!manager) {
      return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
    }
    // 可根据需要返回更多信息
    return NextResponse.json({ manager });
  } catch (e) {
    return NextResponse.json({ error: "登录失败", detail: String(e) }, { status: 500 });
  }
}
