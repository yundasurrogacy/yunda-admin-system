import { NextRequest, NextResponse } from 'next/server';
import { QiniuUploader } from '@/config-lib/qiniu/QiniuUploader';
import { qiniuConfig } from '@/config-lib/qiniu/config';

const uploader = new QiniuUploader(qiniuConfig);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file');
    if (!files || files.length === 0) {
      return new Response(JSON.stringify({
        error: '没有提供文件',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    const results = [];
    for (const file of files) {
      const result = await uploader.uploadFile(file as File);
      results.push(result);
    }
    return new Response(JSON.stringify({
      success: true,
      message: files.length > 1 ? '多文件上传成功' : '文件上传成功',
      data: files.length > 1 ? results : results[0],
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : '上传失败',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}



// 处理预检请求（OPTIONS 方法）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}