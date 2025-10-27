import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET() {
  try {
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
  } catch (error) {
    console.error('Error fetching client managers:', error);
    return NextResponse.json(
      { error: "获取客户经理列表失败", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
