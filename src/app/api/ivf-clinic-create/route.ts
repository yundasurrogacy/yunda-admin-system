import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 新增 ivf_clinic
export async function POST(req: NextRequest) {
  const body = await req.json();
  // body 应包含 ivf_clinic 相关字段
  const { ivf_clinic } = body;
  if (!ivf_clinic) {
    return NextResponse.json({ error: "缺少 ivf_clinic 数据" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    // 构造 GraphQL mutation
    const mutation = `
      mutation InsertIvfClinic($object: ivf_clinics_insert_input!) {
        insert_ivf_clinics_one(object: $object) {
          id
          type
          data
          case_cases
          created_at
        }
      }
    `;
    const variables = {
      object: ivf_clinic
    };
    const result = await client.execute({ query: mutation, variables });
    return NextResponse.json({ ivf_clinic: result.insert_ivf_clinics_one });
  } catch (e) {
    return NextResponse.json({ error: "新增 ivf_clinic 失败", detail: String(e) }, { status: 500 });
  }
}
