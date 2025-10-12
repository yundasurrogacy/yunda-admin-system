import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
    const { journeyId, process_status } = await req.json();
    if (!journeyId || !process_status) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }
    const mutation = `
      mutation UpdateJourneyStatus($id: bigint!, $process_status: String!) {
        update_journeys_by_pk(pk_columns: {id: $id}, _set: {process_status: $process_status}) {
          id
          process_status
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        id: Number(journeyId),
        process_status,
      },
    });
    const updated = res.update_journeys_by_pk;
    if (!updated?.id) {
      return NextResponse.json({ error: "更新失败" }, { status: 500 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "更新失败", detail: String(e) }, { status: 500 });
  }
}
