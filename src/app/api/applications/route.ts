import { NextRequest, NextResponse } from "next/server";
import type { CreateApplicationInput } from "@/types/applications";
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client";

// 提交申请表
export async function POST(request: NextRequest) {
  const hasuraClient = getHasuraClient();
  try {
    const body: CreateApplicationInput = await request.json();

    // 验证必填字段
    if (!body.application_type || !body.application_data) {
      return NextResponse.json(
        {
          success: false,
          message: "申请类型和申请数据为必填项",
        },
        { status: 400 }
      );
    }

    // 验证申请类型
    if (
      !["intended_parent", "surrogate_mother"].includes(body.application_type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "无效的申请类型",
        },
        { status: 400 }
      );
    }

    const mutation = `
      mutation CreateApplication($object: applications_insert_input!) {
        insert_applications_one(object: $object) {
          id
          application_type
          status
          application_data
          created_at
          updated_at
        }
      }
    `;

    const result = await hasuraClient.execute({
      query: mutation,
      variables: {
        object: {
          application_type: body.application_type,
          application_data: body.application_data,
          status: "pending",
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "申请表提交成功",
      data: result?.insert_applications_one,
    });
  } catch (error) {
    console.error("提交申请表失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "提交申请表失败",
      },
      { status: 500 }
    );
  }
}
