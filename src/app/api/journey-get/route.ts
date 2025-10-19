import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 通过 caseId 获取 journey 及其关联文件
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");
  const aboutRole = searchParams.get("about_role"); // 可选的角色参数
  
  if (!caseId) {
    return NextResponse.json({ error: "缺少 caseId 参数" }, { status: 400 });
  }
  const client = getHasuraClient();
  try {
    // 构建动态查询条件
    let whereCondition = `case_cases: { _eq: $case_cases }`;
    const variables: any = { case_cases: Number(caseId) };
    
    // 如果提供了 about_role 参数，添加角色过滤条件
    if (aboutRole) {
      whereCondition += `, about_role: { _eq: $about_role }`;
      variables.about_role = aboutRole;
    }
    
    const query = `
      query GetJourneysWithFiles($case_cases: bigint!${aboutRole ? ', $about_role: String!' : ''}) {
        journeys(where: { ${whereCondition} }) {
          id
          case_cases
          stage
          title
          about_role
          cases_files {
            id
            file_url
            category
            note
            file_type
            created_at
            about_role
          }
        }
      }
    `;
    
    const result = await client.execute({ query, variables });
    return NextResponse.json({ journeys: result.journeys });
  } catch (e) {
    console.error("GraphQL error:", e);
    return NextResponse.json({ error: "获取 journey 失败", detail: String(e) }, { status: 500 });
  }
}
