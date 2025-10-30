import type { NextConfig } from "next";
// const { i18n } = require('./next-i18next.config.js');

const nextConfig: NextConfig = {
  // i18n,
  /* config options here */
  
  // 在构建过程中完全禁用ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 配置允许的图片域名
  images: {
    domains: ['qiniu-storage.weweknow.com'],
  },

  // // 永久 301 跳转：/surrogate-journey -> /surrogate-process
  // async redirects() {
  //   return [
  //     {
  //       source: '/surrogate-journey',
  //       destination: '/surrogate-process',
  //       statusCode: 301,
  //     },
  //   ];
  // },

  // 禁用静态资源缓存
  generateEtags: false,

  // 配置缓存控制
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
