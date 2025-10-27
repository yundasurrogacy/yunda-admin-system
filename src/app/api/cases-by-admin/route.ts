import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
    const { caseId, stage, title } = await req.json();
    if (!caseId || !stage || !title) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }
    const mutation = `
      mutation AddJourney($case_cases: bigint!, $stage: bigint!, $title: String!) {
        insert_journeys_one(object: {case_cases: $case_cases, stage: $stage, title: $title}) {
          id
          stage
          title
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        case_cases: Number(caseId),
        stage: Number(stage),
        title,
      },
    });
    return NextResponse.json(res.insert_journeys_one);
  } catch (e) {
    console.error('Error adding journey:', e);
    return NextResponse.json({ error: "添加失败", detail: String(e) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");
  if (!adminId) {
    return NextResponse.json({ error: "缺少 adminId 参数" }, { status: 400 });
  }
  // 管理员可查看所有案例，无需限制条件
  const query = `
    query AllCasesWithJourneys {
      cases(order_by: { created_at: desc }) {
        id
        created_at
        updated_at
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
        journeys {
          id
          stage
          title
        }
      }
    }
  `;
  try {
    const client = getHasuraClient();
    const res = await client.execute({ query });
    return NextResponse.json(res.cases || []);
  } catch (e) {
    console.error('Error fetching cases:', e);
    return NextResponse.json({ error: "获取全部案例失败", detail: String(e) }, { status: 500 });
  }
}
