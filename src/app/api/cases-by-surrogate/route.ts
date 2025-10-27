import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const surrogateId = searchParams.get('surrogateId');
  if (!surrogateId) {
    return NextResponse.json({ error: "缺少 surrogateId 参数" }, { status: 400 });
  }
  const query = `
    query CasesBySurrogate($surrogateId: bigint!) {
      cases(where: { surrogate_mother_surrogate_mothers: { _eq: $surrogateId } }) {
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
          category
          created_at
          about_role
          note
          journey_journeys
        }
        ivf_clinics {
          id
          type
          created_at
          data(path: "name")
        }
        journeys {
          id
          stage
          title
        }
      }
    }
  `;
  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { surrogateId } });
    return NextResponse.json(res.cases || []);
  } catch (e) {
    console.error('Error fetching cases by surrogate:', e);
    return NextResponse.json({ error: "获取代孕母案例失败", detail: String(e) }, { status: 500 });
  }
}
