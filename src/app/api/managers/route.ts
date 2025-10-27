import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "参数缺失" }, { status: 400 });
    }
    const client = getHasuraClient();
    const mutation = `
      mutation InsertManager($email: String!, $password: String!) {
        insert_managers_one(object: { email: $email, password: $password }) {
          id
          email
          password
          created_at
          updated_at
        }
      }
    `;
    const result = await client.execute({
      query: mutation,
      variables: { email, password }
    });
    return NextResponse.json({ manager: result.insert_managers_one });
  } catch (e) {
    console.error('Error creating manager:', e);
    return NextResponse.json({ error: "新增管理员失败", detail: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = getHasuraClient();
    const query = `
      query ManagersList {
        managers {
          id
          email
          password
          created_at
          updated_at
        }
      }
    `;
    const res = await client.execute({ query });
    return NextResponse.json(res.managers || []);
  } catch (error) {
    console.error('Error fetching managers:', error);
    return NextResponse.json(
      { error: "获取管理员列表失败", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
