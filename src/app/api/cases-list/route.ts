import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
  const client = getHasuraClient();
  const query = `
    query CasesList {
      cases {
        id
        created_at
        updated_at
        trust_account_balance_changes(order_by: {created_at: desc}, limit: 1) {
          balance_after
        }
        journeys {
          id
          stage
          title
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
        client_manager {
          id
          email
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
        process_status
      }
    }
  `;
  const res = await client.execute({ query });
  return NextResponse.json(res.cases || []);
}
