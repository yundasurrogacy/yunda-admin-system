import { NextRequest, NextResponse } from "next/server";
import { getApplicationById, updateApplicationById } from "@/lib/graphql/applications";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const s = source[key];
    if (s != null && typeof s === "object" && !Array.isArray(s)) {
      const t = out[key];
      out[key] = deepMerge(
        (t != null && typeof t === "object" && !Array.isArray(t)
          ? t
          : {}) as Record<string, unknown>,
        s as Record<string, unknown>
      );
    } else {
      out[key] = s;
    }
  }
  return out;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id) || id < 1) {
    return NextResponse.json(
      { success: false, message: "无效的申请 ID" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  try {
    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "未找到该申请" },
        { status: 404, headers: CORS_HEADERS }
      );
    }
    return NextResponse.json(
      { success: true, data: application },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("获取申请失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "获取申请失败",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id) || id < 1) {
    return NextResponse.json(
      { success: false, message: "无效的申请 ID" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  try {
    const body = await request.json();
    const application_data = body.application_data as Record<string, unknown> | undefined;
    const status = typeof body.status === "string" ? body.status : undefined;

    if (application_data === undefined && status === undefined) {
      return NextResponse.json(
        { success: false, message: "请提供 application_data 或 status" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const existing = await getApplicationById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "未找到该申请" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    let merged_data: Record<string, unknown> | undefined;
    if (application_data !== undefined) {
      const current = (existing.application_data as Record<string, unknown>) || {};
      merged_data = deepMerge(current, application_data);
    }

    const updated = await updateApplicationById(id, {
      ...(merged_data !== undefined && { application_data: merged_data }),
      ...(status !== undefined && { status }),
    });

    return NextResponse.json(
      { success: true, message: "更新成功", data: updated },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("更新申请失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "更新申请失败",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
