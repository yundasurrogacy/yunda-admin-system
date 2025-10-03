import { NextRequest } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "缺少用户名或密码" }), { status: 400 });
    }
    const hasuraClient = getHasuraClient();
    const surrogates = await hasuraClient.datas({
      table: "surrogate_mothers",
      args: { where: { email: { _eq: username }, password: { _eq: password } } },
      datas_fields: ["id", "email"],
    });
    if (surrogates && surrogates.length > 0) {
      return new Response(JSON.stringify({ success: true, surrogate: surrogates[0] }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "用户名或密码错误" }), { status: 401 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "服务器错误" }), { status: 500 });
  }
}
