import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const surrogacyId = searchParams.get("surrogacy");
    if (!surrogacyId) {
      return NextResponse.json({ error: "缺少 surrogacy 参数" }, { status: 400 });
    }
    const query = `
      query SurrogateMotherDetail($id: bigint!) {
        surrogate_mothers_by_pk(id: $id) {
          id
          about_you
          contact_information
          email
          pregnancy_and_health
          upload_photos
          created_at
          updated_at
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({ query, variables: { id: Number(surrogacyId) } });
    const mother = res.surrogate_mothers_by_pk;
    if (!mother) {
      return NextResponse.json({ error: "未找到代孕妈妈信息" }, { status: 404 });
    }
    return NextResponse.json(mother);
  } catch (e) {
    return NextResponse.json({ error: "查询失败", detail: String(e) }, { status: 500 });
  }
}
