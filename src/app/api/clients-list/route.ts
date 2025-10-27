import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
  try {
    const client = getHasuraClient();
    const query = `
      query ClientsList {
        intended_parents {
          id
          basic_information
          contact_information
          family_profile
          program_interests
          updated_at
        }
      }
    `;
    const res = await client.execute({ query });
    console.log('GraphQL response:', res.intended_parents);
    return NextResponse.json(res.intended_parents || []);
  } catch (error) {
    console.error('Error fetching clients list:', error);
    return NextResponse.json(
      { error: "获取客户列表失败", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
