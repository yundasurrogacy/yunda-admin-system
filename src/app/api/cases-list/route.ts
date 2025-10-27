import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
  try {
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
          client_manager {
            id
            email
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
          process_status
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
            note
            category
            created_at
          }
        }
      }
    `;
    const res = await client.execute({ query });
    return NextResponse.json(res.cases || []);
  } catch (error) {
    console.error('Error fetching cases list:', error);
    return NextResponse.json(
      { error: "获取案例列表失败", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
