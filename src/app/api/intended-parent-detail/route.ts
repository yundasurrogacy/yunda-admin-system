import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');
    if (!parentId) {
      return NextResponse.json({ error: '缺少parentId参数' }, { status: 400 });
    }
    const query = `
      query IntendedParentDetail($id: bigint!) {
        intended_parents_by_pk(id: $id) {
          id
          basic_information
          contact_information
          family_profile
          program_interests
          referral
          trust_account_balance
          email
          created_at
          updated_at
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { id: Number(parentId) } });
    const parent = res.intended_parents_by_pk;
    if (!parent) {
      return NextResponse.json({ error: '未找到准父母信息' }, { status: 404 });
    }
    return NextResponse.json(parent);
  } catch (e) {
    return NextResponse.json({ error: '查询失败', detail: String(e) }, { status: 500 });
  }
}
