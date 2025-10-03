import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
  const client = getHasuraClient();
  const query = `
    query ClientManagersList {
      client_managers {
        id
        email
        created_at
        updated_at
      }
    }
  `;
  const res = await client.execute({ query });
  return NextResponse.json(res.client_managers || []);
}
