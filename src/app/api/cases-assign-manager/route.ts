import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { case_id, client_manager_id } = body;
  if (!case_id || !client_manager_id) {
    return NextResponse.json({ error: "参数缺失" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    const mutation = `
      mutation AssignManager($case_id: bigint!, $client_manager_client_managers: bigint!) {
        update_cases_by_pk(
          pk_columns: { id: $case_id },
          _set: {
            client_manager_client_managers: $client_manager_client_managers,
            process_status: "LegalStage"
          }
        ) {
          id
          client_manager_client_managers
          process_status
        }
      }
    `;
    const result = await client.execute({
      query: mutation,
      variables: { case_id, client_manager_client_managers: client_manager_id }
    });
    return NextResponse.json({ case: result.update_cases_by_pk });
  } catch (e) {
    return NextResponse.json({ error: "分配客户经理失败", detail: String(e) }, { status: 500 });
  }
}
