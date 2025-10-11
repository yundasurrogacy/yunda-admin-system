
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: '缺少id参数' }, { status: 400 });
    }
    const body = await req.json();
    // 只允许更新主要字段
    const updateFields: any = {};
    if ('basic_information' in body) updateFields.basic_information = body.basic_information;
    if ('contact_information' in body) updateFields.contact_information = body.contact_information;
    if ('family_profile' in body) updateFields.family_profile = body.family_profile;
    if ('program_interests' in body) updateFields.program_interests = body.program_interests;
    if ('referral' in body) updateFields.referral = body.referral;
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: '没有可更新的字段' }, { status: 400 });
    }
    const mutation = `
      mutation UpdateIntendedParent($id: bigint!, $changes: intended_parents_set_input!) {
        update_intended_parents_by_pk(pk_columns: {id: $id}, _set: $changes) {
          id
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        id: Number(id),
        changes: updateFields,
      },
    });
    if (!res.update_intended_parents_by_pk) {
      return NextResponse.json({ error: '更新失败，未找到准父母' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: '更新失败', detail: String(e) }, { status: 500 });
  }
}
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
