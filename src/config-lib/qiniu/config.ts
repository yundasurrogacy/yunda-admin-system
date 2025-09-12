import { QiniuConfig } from "./QiniuUploader";
export type { QiniuConfig };

/**
 * 七牛云配置
 * @param accessKey 七牛云accessKey
 * @param secretKey 七牛云secretKey
 * @param bucket 七牛云bucket
 * @param zone 七牛云zone，默认auto，自动选择zone
 * @param baseUrl 七牛云baseUrl，拼接url用，默认空
 * @param dirPath 七牛云dirPath，自动生成key用，默认空
 */
export const qiniuConfig: QiniuConfig = {
  accessKey: process.env.QINIU_ACCESS_KEY || "P2M36yN_YwHx3w7e27S7unL77cUVso7Aw1HQkwAi",
  secretKey: process.env.QINIU_SECRET_KEY || "YwPDWUfsH5zVjZ9_BRB8p-k21rjTP5OJq597-yB4",
  bucket: process.env.QINIU_BUCKET || "qiniu-resources",
  baseUrl: process.env.QINIU_BASE_URL || "https://qiniu-resources.weweknow.com",
  dirPath: process.env.QINIU_DIR_PATH || "yundasurrogacy-1/",
};