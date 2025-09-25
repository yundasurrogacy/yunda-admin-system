import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get('managerId');
  if (!managerId) {
    return NextResponse.json({ error: "缺少 managerId 参数" }, { status: 400 });
  }
  const query = `
    query CasesByManager($managerId: bigint!) {
      cases(where: { client_manager_client_managers: { _eq: $managerId } }) {
        id
        process_status
        trust_account_balance
        surrogate_mother {
          id
          email
          contact_information(path: "name")
        }
        intended_parent {
          id
          email
          contact_information(path: "name")
        }
        cases_files {
          id
          file_url
          category
          created_at
        }
        ivf_clinics {
          id
          type
          created_at
          data(path: "name")
        }
      }
    }
  `;
  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { managerId } });
    return NextResponse.json(res.cases || []);
  } catch (e) {
    return NextResponse.json({ error: "获取经理案例失败", detail: String(e) }, { status: 500 });
  }
}
