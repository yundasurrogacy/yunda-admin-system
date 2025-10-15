import { NextRequest, NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 更新 ivf_clinic
export async function POST(req: NextRequest) {
  const body = await req.json();
  // body 应包含 caseId, type, data
  const { caseId, type, data, aboutRole } = body;
  
  if (!caseId || !type || !data) {
    return NextResponse.json({ error: "缺少必要参数: caseId, type, data" }, { status: 400 });
  }
  
  const client = getHasuraClient();
  
  try {
    // 构造 GraphQL mutation 来更新数据
    const mutation = `
      mutation UpdateIvfClinic($where: ivf_clinics_bool_exp!, $set: ivf_clinics_set_input!) {
        update_ivf_clinics(where: $where, _set: $set) {
          affected_rows
          returning {
            id
            type
            data
            case_cases
            about_role
            created_at
            updated_at
          }
        }
      }
    `;
    
    const where: any = {
      case_cases: { _eq: caseId },
      type: { _eq: type }
    };
    if (aboutRole) where.about_role = { _eq: aboutRole };
    
    const variables = {
      where,
      set: {
        data: data,
        updated_at: new Date().toISOString()
      }
    };
    
    const result = await client.execute({ query: mutation, variables });
    
    if (result.update_ivf_clinics.affected_rows === 0) {
      return NextResponse.json({ error: "未找到要更新的记录" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      ivf_clinic: result.update_ivf_clinics.returning[0],
      affected_rows: result.update_ivf_clinics.affected_rows
    });
  } catch (e) {
    return NextResponse.json({ error: "更新 ivf_clinic 失败", detail: String(e) }, { status: 500 });
  }
}