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
          gestational_surrogacy_interview
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

// PUT: 更新代孕妈妈信息
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const surrogacyId = searchParams.get("surrogacy") || searchParams.get("id");
    if (!surrogacyId) {
      return NextResponse.json({ error: "缺少 surrogacy/id 参数" }, { status: 400 });
    }
    const body = await req.json();
    // 这里假设所有字段都在 body 中
    const mutation = `
      mutation UpdateSurrogateMother($id: bigint!, $about_you: jsonb, $contact_information: jsonb, $pregnancy_and_health: jsonb, $gestational_surrogacy_interview: jsonb, $upload_photos: jsonb) {
        update_surrogate_mothers_by_pk(
          pk_columns: { id: $id },
          _set: {
            about_you: $about_you,
            contact_information: $contact_information,
            pregnancy_and_health: $pregnancy_and_health,
            gestational_surrogacy_interview: $gestational_surrogacy_interview,
            upload_photos: $upload_photos
          }
        ) {
          id
          about_you
          contact_information
          pregnancy_and_health
          gestational_surrogacy_interview
          upload_photos
          created_at
          updated_at
        }
      }
    `;
    const client = getHasuraClient();
    const res = await client.execute({
      query: mutation,
      variables: {
        id: Number(surrogacyId),
        about_you: body.about_you,
        contact_information: body.contact_information,
        pregnancy_and_health: body.pregnancy_and_health,
        gestational_surrogacy_interview: body.gestational_surrogacy_interview,
        upload_photos: body.upload_photos,
      },
    });
    const updated = res.update_surrogate_mothers_by_pk;
    if (!updated) {
      return NextResponse.json({ error: "未找到代孕妈妈信息，无法更新" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "更新失败", detail: String(e) }, { status: 500 });
  }
}
