import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 推荐用法：通过 context 获取 params，彻底消除类型警告

import type { NextRequest } from "next/server";
// import { console } from "node:inspector";

// Next.js 14+ API 路由推荐写法，context 类型声明
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);
  // Next.js 14+ API 路由，params 同步访问
  console.log('params:', searchParams);
  const params = await context.params;
  const id: string | null = params?.id ?? searchParams.get('id');
  console.log('caseId:', id);
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "参数 id 缺失或非法" }, { status: 400 });
  }
  const client = getHasuraClient();
  const query = `
    query CaseDetail($id: bigint!) {
      cases_by_pk(id: $id) {
        id
        process_status
        surrogate_mother {
          id
          email
          contact_information(path: "name")
        }
        intended_parent {
          id
          email
          contact_information(path: "name")
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
    const res = await client.execute({ query, variables: { id } });
    if (!res.cases_by_pk) {
      return NextResponse.json({ error: "未找到该案子" }, { status: 404 });
    }
    return NextResponse.json(res.cases_by_pk);
  } catch (e) {
    return NextResponse.json({ error: "获取案子详情失败", detail: String(e) }, { status: 500 });
  }
}
