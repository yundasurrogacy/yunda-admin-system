import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function POST(req: Request) {
  try {
    const { file } = await req.json();
    if (!file || !file.case_cases || !file.journey_journeys || !file.file_url) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }
    const mutation = `
      mutation AddFile($object: cases_files_insert_input!) {
        insert_cases_files_one(object: $object) {
          id
          file_url
          category
          file_type
          note
          case_cases
          journey_journeys
          created_at
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        object: file,
      },
    });
    return NextResponse.json(res.insert_cases_files_one);
  } catch (e) {
    return NextResponse.json({ error: "添加文件失败", detail: String(e) }, { status: 500 });
  }
}
