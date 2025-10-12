import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
  const { caseId, stage, title, files, about_role = 'intended_parent' } = await req.json();
    if (!caseId || !stage || !title) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }
    const mutation = `
      mutation AddJourneyWithFiles($case_cases: bigint!, $stage: bigint!, $title: String!, $files: [cases_files_insert_input!]!) {
        insert_journeys_one(object: {case_cases: $case_cases, stage: $stage, title: $title}) {
          id
          stage
          title
        }
        insert_cases_files(objects: $files) {
          affected_rows
        }
      }
    `;
    const client = getHasuraClient();
    // 先插入 journey，拿到 id，再插入 files
    // 但为了保证原子性，采用事务式 mutation，先插入 journey，再插入 files（files 需带 journey_journeys 字段）
    // 但 Hasura 事务里不能引用前面插入的 id，只能分两步
    // 所以先插入 journey，再插入 files
    const journeyMutation = `
      mutation AddJourney($case_cases: bigint!, $stage: bigint!, $title: String!, $about_role: String) {
        insert_journeys_one(object: {case_cases: $case_cases, stage: $stage, title: $title, about_role: $about_role}) {
          id
          stage
          title
          about_role
        }
      }
    `;
    const journeyRes = await client.execute({
      query: journeyMutation,
      variables: {
        case_cases: Number(caseId),
        stage: Number(stage),
        title,
        about_role,
      },
    });
    const journey = journeyRes.insert_journeys_one;
    if (!journey?.id) {
      return NextResponse.json({ error: "添加journey失败" }, { status: 500 });
    }
    // 批量插入 files
    let affected_rows = 0;
    if (Array.isArray(files) && files.length > 0) {
      const filesToInsert = files.map((f: any) => ({
        case_cases: Number(caseId),
        journey_journeys: journey.id,
        category: f.category,
        file_type: f.file_type,
        file_url: f.file_url,
        note: f.note,
      }));
      const filesMutation = `
        mutation AddFiles($files: [cases_files_insert_input!]!) {
          insert_cases_files(objects: $files) { affected_rows }
        }
      `;
      const filesRes = await client.execute({
        query: filesMutation,
        variables: { files: filesToInsert },
      });
      affected_rows = filesRes.insert_cases_files?.affected_rows || 0;
    }
    return NextResponse.json({ ...journey, files_affected: affected_rows });
  } catch (e) {
    return NextResponse.json({ error: "添加失败", detail: String(e) }, { status: 500 });
  }
}
