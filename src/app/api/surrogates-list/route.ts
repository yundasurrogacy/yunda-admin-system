import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Error fetching surrogates list:', error);
    return NextResponse.json(
      { error: "获取代孕母列表失败", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
