import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  const client = getHasuraClient();
  const body = await req.json();
  const { case_id, process_status } = body;
  if (!case_id) {
    return NextResponse.json({ error: "case_id required" }, { status: 400 });
  }
  const mutation = `
    mutation UpdateCaseStatus($id: bigint!, $status: String) {
      update_cases_by_pk(pk_columns: {id: $id}, _set: {process_status: $status}) {
        id
        process_status
      }
    }
  `;
  const variables = { id: case_id, status: process_status ?? null };
  const res = await client.execute({ query: mutation, variables });
  return NextResponse.json(res.update_cases_by_pk);
}
