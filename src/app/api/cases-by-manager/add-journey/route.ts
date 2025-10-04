import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
    const { caseId, stage, title } = await req.json();
    if (!caseId || !stage || !title) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }
    const mutation = `
      mutation AddJourney($case_cases: bigint!, $stage: bigint!, $title: String!) {
        insert_journeys_one(object: {case_cases: $case_cases, stage: $stage, title: $title}) {
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
        case_cases: Number(caseId),
        stage: Number(stage),
        title,
      },
    });
    return NextResponse.json(res.insert_journeys_one);
  } catch (e) {
    return NextResponse.json({ error: "添加失败", detail: String(e) }, { status: 500 });
  }
}
