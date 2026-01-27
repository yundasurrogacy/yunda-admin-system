/**
 * 七牛云直传工具函数
 * 用于前端直接上传文件到七牛云，避免经过后端中转
 */

interface QiniuTokenResponse {
  success: boolean;
  data?: {
    token: string;
    bucket: string;
    baseUrl: string;
    dirPath: string;
    uploadUrl: string;
  };
  message?: string;
}

interface QiniuUploadResult {
  url: string;
  path: string;
  key: string;
}

/**
 * 生成文件key（路径）
 */
function generateKey(filename: string, dirPath: string = ""): string {
  const ext = filename.split(".").pop() || "";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${dirPath || ""}${timestamp}-${random}.${ext}`;
}

/**
 * 获取七牛云上传token
 */
async function getQiniuToken(): Promise<NonNullable<QiniuTokenResponse["data"]>> {
  const res = await fetch("/api/upload/qiniu-token");
  const result: QiniuTokenResponse = await res.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || "获取上传token失败");
  }
  
  return result.data;
}

/**
 * 上传单个文件到七牛云（直传）
 * @param file 要上传的文件
 * @param onProgress 上传进度回调（可选）
 * @returns 上传结果，包含文件URL
 */
export async function uploadFileToQiniu(
  file: File,
  onProgress?: (percent: number) => void
): Promise<QiniuUploadResult> {
  try {
    // 1. 获取上传token和配置
    const tokenData = await getQiniuToken();
    
    // 2. 生成文件key
    const key = generateKey(file.name, tokenData.dirPath);
    
    // 3. 构建FormData
    const formData = new FormData();
    formData.append("token", tokenData.token);
    formData.append("key", key);
    formData.append("file", file);
    
    // 4. 使用XMLHttpRequest支持进度监听
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // 监听上传进度
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        });
      }
      
      // 监听完成
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            const url = `${tokenData.baseUrl}/${key}`;
            resolve({
              url,
              path: `/${key}`,
              key,
            });
          } catch (e) {
            reject(new Error("解析上传响应失败"));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error || `上传失败: ${xhr.status}`));
          } catch {
            reject(new Error(`上传失败: ${xhr.status}`));
          }
        }
      });
      
      // 监听错误
      xhr.addEventListener("error", () => {
        reject(new Error("网络错误，上传失败"));
      });
      
      // 监听中止
      xhr.addEventListener("abort", () => {
        reject(new Error("上传已取消"));
      });
      
      // 发送请求
      xhr.open("POST", tokenData.uploadUrl);
      xhr.send(formData);
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error("上传失败");
  }
}

/**
 * 批量上传文件到七牛云（直传）
 * @param files 要上传的文件数组
 * @param onProgress 单个文件上传进度回调（可选），参数为 (fileIndex, percent)
 * @returns 上传结果数组
 */
export async function uploadFilesToQiniu(
  files: File[],
  onProgress?: (fileIndex: number, percent: number) => void
): Promise<QiniuUploadResult[]> {
  const results: QiniuUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await uploadFileToQiniu(
      file,
      onProgress ? (percent) => onProgress(i, percent) : undefined
    );
    results.push(result);
  }
  
  return results;
}
