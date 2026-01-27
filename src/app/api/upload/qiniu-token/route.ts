import { NextRequest, NextResponse } from "next/server";
import * as qiniu from "qiniu";
import { qiniuConfig } from "@/config-lib/qiniu/config";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

/**
 * 根据zone获取七牛云上传地址
 * 注意：七牛云的上传地址格式是 up-{zone}.qiniup.com
 */
function getUploadUrl(zone?: string): string {
  const zoneMap: Record<string, string> = {
    z0: "https://up-z0.qiniup.com", // 华东
    z1: "https://up-z1.qiniup.com", // 华北
    z2: "https://up-z2.qiniup.com", // 华南
    na0: "https://up-na0.qiniup.com", // 北美
    as0: "https://up-as0.qiniup.com", // 东南亚
  };

  const zoneKey = zone || qiniuConfig.zone || "z2";
  return zoneMap[zoneKey] || zoneMap.z2;
}

/**
 * 获取七牛云上传Token
 * 用于前端直接上传到七牛云，避免经过后端中转
 * 支持大文件上传、后台上传、断点续传
 * 带 CORS 头，供网站端跨域请求。
 */
export async function GET(request: NextRequest) {
  try {
    if (!qiniuConfig.accessKey || !qiniuConfig.secretKey || !qiniuConfig.bucket) {
      return NextResponse.json(
        {
          success: false,
          message: "七牛云配置不完整，请检查环境变量：QINIU_ACCESS_KEY、QINIU_SECRET_KEY、QINIU_BUCKET",
        },
        { status: 500, headers: corsHeaders }
      );
    }

    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: qiniuConfig.bucket,
      expires: 3600,
    });
    const uploadToken = putPolicy.uploadToken(mac);

    if (!uploadToken) {
      return NextResponse.json(
        { success: false, message: "生成上传凭证失败：token 为空" },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          token: uploadToken,
          bucket: qiniuConfig.bucket,
          baseUrl: qiniuConfig.baseUrl,
          dirPath: qiniuConfig.dirPath,
          uploadUrl: getUploadUrl(qiniuConfig.zone),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("生成七牛云token失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "生成token失败",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
