import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get('parentId');
  if (!parentId) {
    return NextResponse.json({ error: "缺少 parentId 参数" }, { status: 400 });
  }
  const query = `
    query CasesByParent($parentId: bigint!) {
      cases(where: { intended_parent_intended_parents: { _eq: $parentId } }) {
        id
        process_status
        trust_account_balance
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
      }
    }
  `;
  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { parentId } });
    return NextResponse.json(res.cases || []);
  } catch (e) {
    return NextResponse.json({ error: "获取准父母案例失败", detail: String(e) }, { status: 500 });
  }
}
