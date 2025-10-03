import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();
    // 兼容 email 或 username 字段
    const loginEmail = email || username;
    const query = `
      query IntendedParentLogin($email: String!, $password: String!) {
        intended_parents(where: { email: { _eq: $email }, password: { _eq: $password } }) {
          id
          email
          created_at
          updated_at
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { email: loginEmail, password } });
    const parent = res.intended_parents?.[0];
    if (!parent) {
      return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
    }
    return NextResponse.json({ parent });
  } catch (e) {
    return NextResponse.json({ error: "登录失败", detail: String(e) }, { status: 500 });
  }
}
