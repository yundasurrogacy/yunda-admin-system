import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 获取指定 caseId 下的 ivf_clinics 列表
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");
  const aboutRole = searchParams.get("aboutRole");
  if (!caseId) {
    return NextResponse.json({ error: "缺少 caseId 参数" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    const query = `
    query GetIvfClinics($caseId: bigint!, $aboutRole: String) {
        ivf_clinics(where: { case_cases: { _eq: $caseId }, ${aboutRole ? "about_role: { _eq: $aboutRole }" : ""} }) {
        id
        type
        data
        case_cases
        ${aboutRole ? "about_role" : "about_role"}
        created_at
        updated_at
        }
    }
    `;
    const variables: any = { caseId: Number(caseId) };
    if (aboutRole) variables.aboutRole = aboutRole;
    const result = await client.execute({ query, variables });
    return NextResponse.json({ ivf_clinics: result.ivf_clinics });
  } catch (e) {
    console.error("GraphQL error:", e);
    return NextResponse.json({ error: "获取 ivf_clinics 失败", detail: String(e) }, { status: 500 });
  }
}
