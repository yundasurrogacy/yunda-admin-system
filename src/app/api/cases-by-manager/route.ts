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
        created_at
        updated_at
        process_status
        trust_account_balance_changes(order_by: {created_at: desc}, limit: 1) {
          balance_after
        }
        client_manager {
          id
          email
        }
        journeys {
          id
          created_at
          updated_at
          case_cases
          stage
          title
          process_status
          about_role
          cases_files {
            id
            file_url
            category
            note
            created_at
          }
        }
        surrogate_mother {
          id
          email
          contact_information(path: "first_name")
        }
        intended_parent {
          id
          email
          basic_information(path: "firstName")
        }
        cases_files {
          id
          file_url
          journey_journeys
          category
          note
          created_at
          about_role
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
    console.error('Error fetching cases by manager:', e);
    return NextResponse.json({ error: "获取经理案例失败", detail: String(e) }, { status: 500 });
  }
}
