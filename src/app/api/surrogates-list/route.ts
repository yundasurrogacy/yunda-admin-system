import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
  const client = getHasuraClient();
    const query = `
      query SurrogatesList {
        surrogate_mothers {
          id
          contact_information
          pregnancy_and_health
          upload_photos
        }
      }
    `;
  const res = await client.execute({ query });
  return NextResponse.json(res.surrogate_mothers || []);
}
