import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, password } = body;
  if (!id || !password) {
    return NextResponse.json({ error: "Missing id or password" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    const mutation = `
      mutation ResetIntendedParentPassword($id: bigint!, $password: String!) {
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
    return NextResponse.json({ error: "Failed to reset password", details: error }, { status: 500 });
  }
}
