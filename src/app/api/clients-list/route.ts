import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
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
//   return NextResponse.json(res?.intended_parents || []);
//   return NextResponse.json(res.data?.intended_parents || []);
  return NextResponse.json(res.intended_parents || []);
}
