import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { surrogate_mother_surrogate_mothers, intended_parent_intended_parents } = body;
  if (!surrogate_mother_surrogate_mothers || !intended_parent_intended_parents) {
    return NextResponse.json({ error: "参数缺失" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    const mutation = `
      mutation InsertCase($surrogate_mother_surrogate_mothers: bigint!, $intended_parent_intended_parents: bigint!) {
        insert_cases_one(object: { surrogate_mother_surrogate_mothers: $surrogate_mother_surrogate_mothers, intended_parent_intended_parents: $intended_parent_intended_parents }) {
          id
        }
      }
    `;
    const result = await client.execute({
      query: mutation,
      variables: { surrogate_mother_surrogate_mothers, intended_parent_intended_parents }
    });
    return NextResponse.json({ case: result.insert_cases_one });
  } catch (e) {
    return NextResponse.json({ error: "新增案子失败", detail: String(e) }, { status: 500 });
  }
}
