import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

// 新增信托账户变动记录
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { caseId, change_type, change_amount, balance_before, balance_after, remark } = body;
  if (!caseId || !change_type || change_amount === undefined) {
    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
  }
  const mutation = `
    mutation InsertChange($object: trust_account_balance_changes_insert_input!) {
      insert_trust_account_balance_changes_one(object: $object) {
        id
        case_cases
        change_type
        change_amount
        balance_before
        balance_after
        remark
        created_at
      }
    }
  `;
  try {
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        object: {
          case_cases: Number(caseId),
          change_type,
          change_amount: Number(change_amount),
          balance_before: balance_before !== '' ? Number(balance_before) : null,
          balance_after: balance_after !== '' ? Number(balance_after) : null,
          remark: remark ?? null,
        },
      },
    });
    return NextResponse.json(res.insert_trust_account_balance_changes_one);
  } catch (e) {
    return NextResponse.json({ error: '新增失败', detail: String(e) }, { status: 500 });
  }
}

// 修改信托账户变动记录
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, change_type, change_amount, balance_before, balance_after, remark } = body;
  if (!id || !change_type || change_amount === undefined) {
    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
  }
  const mutation = `
    mutation UpdateChange($id: bigint!, $changes: trust_account_balance_changes_set_input!) {
      update_trust_account_balance_changes_by_pk(pk_columns: {id: $id}, _set: $changes) {
        id
        case_cases
        change_type
        change_amount
        balance_before
        balance_after
        remark
        created_at
      }
    }
  `;
  try {
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        id: Number(id),
        changes: {
          change_type,
          change_amount: Number(change_amount),
          balance_before: balance_before !== '' ? Number(balance_before) : null,
          balance_after: balance_after !== '' ? Number(balance_after) : null,
          remark: remark ?? null,
        },
      },
    });
    return NextResponse.json(res.update_trust_account_balance_changes_by_pk);
  } catch (e) {
    return NextResponse.json({ error: '修改失败', detail: String(e) }, { status: 500 });
  }
}

// 删除信托账户变动记录
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: '缺少id' }, { status: 400 });
  }
  const mutation = `
    mutation DeleteChange($id: bigint!) {
      delete_trust_account_balance_changes_by_pk(id: $id) { id }
    }
  `;
  try {
    const client = getHasuraClient();
    await client.execute({ query: mutation, variables: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: '删除失败', detail: String(e) }, { status: 500 });
  }
}
