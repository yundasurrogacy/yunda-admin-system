import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get('caseId');
  if (!caseId) {
    return NextResponse.json({ error: 'Missing caseId' }, { status: 400 });
  }
  const query = `
    query TrustAccount($caseId: bigint!) {
      cases_by_pk(id: $caseId) {
        trust_account_balance
      }
      trust_account_balance_changes(where: { case_cases: { _eq: $caseId } }, order_by: { created_at: desc }) {
        id
        case_cases
        change_amount
        change_type
        balance_before
        balance_after
        visibility
        receiver
        remark
        created_at
      }
    }
  `;
  try {
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { caseId: Number(caseId) } });
    // 检查是否有 GraphQL 错误
    if (res.errors) {
      console.error('Hasura GraphQL errors:', res.errors);
      return NextResponse.json({ error: 'Hasura GraphQL errors', detail: res.errors }, { status: 500 });
    }
    return NextResponse.json({
      balance: res.cases_by_pk?.trust_account_balance ?? null,
      changes: res.trust_account_balance_changes ?? [],
    });
  } catch (e) {
    console.error('API Exception:', e);
    return NextResponse.json({ error: '获取信托账户信息失败', detail: String(e) }, { status: 500 });
  }
}
