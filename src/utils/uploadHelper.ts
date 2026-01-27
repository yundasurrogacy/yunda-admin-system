/**
 * 通用上传辅助函数
 * 提供统一的上传接口，使用七牛云直传
 */
import { uploadFileToQiniu } from './qiniuDirectUpload';

/**
 * 上传文件并返回URL（用于FileUpload组件等）
 * @param file 要上传的文件
 * @returns 文件URL
 */
export async function uploadFile(file: File): Promise<string> {
  const result = await uploadFileToQiniu(file);
  return result.url;
}
