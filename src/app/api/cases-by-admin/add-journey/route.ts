import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
    const { caseId, stage, title } = await req.json();
    if (!caseId || !stage || !title) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }
    // 管理端适配：自动判断 case_id/case_cases 字段
    // 推荐先用 case_id，如失败再尝试 case_cases
    const mutation = `
      mutation AddJourney($case_id: bigint!, $stage: bigint!, $title: String!) {
        insert_journeys_one(object: {case_id: $case_id, stage: $stage, title: $title}) {
          id
          stage
          title
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        case_id: Number(caseId),
        stage: Number(stage),
        title,
      },
    });
    if (res.insert_journeys_one) {
      return NextResponse.json(res.insert_journeys_one);
    }
    // fallback: case_cases 兼容
    const fallbackMutation = `
      mutation AddJourney($case_cases: bigint!, $stage: bigint!, $title: String!) {
        insert_journeys_one(object: {case_cases: $case_cases, stage: $stage, title: $title}) {
          id
          stage
          title
        }
      }
    `;
    const fallbackRes = await client.execute({
      query: fallbackMutation,
      variables: {
        case_cases: Number(caseId),
        stage: Number(stage),
        title,
      },
    });
    return NextResponse.json(fallbackRes.insert_journeys_one);
  } catch (e) {
    return NextResponse.json({ error: "添加失败", detail: String(e) }, { status: 500 });
  }
}
