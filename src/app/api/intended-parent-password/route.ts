import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;
    if (!id || !password) {
      return NextResponse.json({ error: "Missing id or password" }, { status: 400 });
    }
    const client = getHasuraClient();
    const mutation = `
      mutation ResetIntendedParentPassword($id: Int!, $password: String!) {
        update_intended_parents(
          where: { id: { _eq: $id } },
          _set: { password: $password }
        ) {
          affected_rows
        }
      }
    `;
    const result = await client.execute({
      query: mutation,
      variables: { id, password }
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: "Failed to reset password", details: String(error) }, { status: 500 });
  }
}
