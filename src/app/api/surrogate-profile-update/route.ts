import { NextResponse } from "next/server";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const surrogateId = searchParams.get("id");
    
    if (!surrogateId) {
      return NextResponse.json({ error: "缺少代孕母ID参数" }, { status: 400 });
    }

    const updateData = await req.json();
    
    // 构建动态的 mutation 和 variables，只更新传入的字段
    const setFields = [];
    const variables: any = { id: Number(surrogateId) };
    
    if (updateData.contact_information) {
      setFields.push('contact_information: $contact_information');
      variables.contact_information = updateData.contact_information;
    }
    
    if (updateData.about_you) {
      setFields.push('about_you: $about_you');
      variables.about_you = updateData.about_you;
    }
    
    if (updateData.pregnancy_and_health) {
      setFields.push('pregnancy_and_health: $pregnancy_and_health');
      variables.pregnancy_and_health = updateData.pregnancy_and_health;
    }
    
    if (updateData.gestational_surrogacy_interview) {
      setFields.push('gestational_surrogacy_interview: $gestational_surrogacy_interview');
      variables.gestational_surrogacy_interview = updateData.gestational_surrogacy_interview;
    }
    
    // 只有在明确传递 upload_photos 时才更新
    if (updateData.upload_photos !== undefined) {
      setFields.push('upload_photos: $upload_photos');
      variables.upload_photos = updateData.upload_photos;
    }
    
    // 总是更新 updated_at
    setFields.push('updated_at: "now()"');
    
    const mutation = `
      mutation UpdateSurrogateMother($id: bigint! ${Object.keys(variables).filter(k => k !== 'id').map(k => `$${k}: jsonb`).join(' ')}) {
        update_surrogate_mothers_by_pk(
          pk_columns: { id: $id }
          _set: {
            ${setFields.join('\n            ')}
          }
        ) {
          id
          contact_information
          about_you
          pregnancy_and_health
          gestational_surrogacy_interview
          upload_photos
          updated_at
        }
      }
    `;

    const client = getHasuraClient();
    const result = await client.execute({
      query: mutation,
      variables
    });

    if (!result.update_surrogate_mothers_by_pk) {
      return NextResponse.json({ error: "更新失败，代孕母信息未找到" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.update_surrogate_mothers_by_pk
    });

  } catch (error) {
    console.error("更新代孕母信息失败:", error);
    return NextResponse.json(
      { error: "更新失败", detail: String(error) }, 
      { status: 500 }
    );
  }
}