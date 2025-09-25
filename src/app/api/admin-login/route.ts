import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "缺少用户名或密码" }, { status: 400 });
    }
    const hasuraClient = getHasuraClient();
    const managers = await hasuraClient.datas({
      table: "managers",
      args: { where: { email: { _eq: username }, password: { _eq: password } } },
      datas_fields: ["id", "email"],
    });
    if (managers && managers.length > 0) {
      return NextResponse.json({ success: true, manager: managers[0] });
    }
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "登录失败", detail: String(error) }, { status: 500 });
  }
}
