import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 通过 caseId 获取 journey 及其关联文件
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");
  if (!caseId) {
    return NextResponse.json({ error: "缺少 caseId 参数" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    const query = `
      query GetJourneysWithFiles($case_cases: bigint!) {
        journeys(where: { case_cases: { _eq: $case_cases } }) {
          id
          case_cases
          stage
          title
          cases_files {
            id
            file_url
            category
            note
            file_type
            created_at
          }
        }
      }
    `;
    const variables = { case_cases: Number(caseId) };
    const result = await client.execute({ query, variables });
    return NextResponse.json({ journeys: result.journeys });
  } catch (e) {
    console.error("GraphQL error:", e);
    return NextResponse.json({ error: "获取 journey 失败", detail: String(e) }, { status: 500 });
  }
}
