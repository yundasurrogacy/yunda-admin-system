import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const surrogateId = searchParams.get('surrogateId');
  if (!surrogateId) {
    return NextResponse.json({ error: "缺少 surrogateId 参数" }, { status: 400 });
  }
  const query = `
    query CasesBySurrogate($surrogateId: bigint!) {
      cases(where: { surrogate_mother_surrogate_mothers: { _eq: $surrogateId } }) {
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
    const res = await client.execute({ query, variables: { surrogateId } });
    return NextResponse.json(res.cases || []);
  } catch (e) {
    return NextResponse.json({ error: "获取代孕母案例失败", detail: String(e) }, { status: 500 });
  }
}
