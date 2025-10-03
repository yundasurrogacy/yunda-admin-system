import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 新增 journey 并同时新增 cases_files
export async function POST(req: NextRequest) {
  const body = await req.json();
  // body 应包含 journey 相关字段和 files 列表
  const { journey, files } = body;
  if (!journey) {
    return NextResponse.json({ error: "缺少 journey 数据" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    // 构造 GraphQL mutation
    const mutation = `
      mutation InsertJourneyWithFiles($case_cases: bigint, $stage: bigint, $title: String, $files: [cases_files_insert_input!]!) {
        insert_journeys_one(object: {
          case_cases: $case_cases,
          stage: $stage,
          title: $title,
          cases_files: { data: $files }
        }) {
          id
          cases_files { id file_url category }
        }
      }
    `;
    const variables = {
      case_cases: journey.case_cases,
      stage: journey.stage,
      title: journey.title,
      files: files || []
    };
    // const variables = {
    //   journey,
    //   files: files || []
    // };
    const result = await client.execute({ query: mutation, variables });
    return NextResponse.json({ journey: result.insert_journeys_one });
  } catch (e) {
    console.error('GraphQL error:', e);
    return NextResponse.json({ error: "新增 journey 失败", detail: String(e) }, { status: 500 });
  }
}
