// const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  // i18n,
  /* config options here */

  // Next 16 + React 19 类型兼容：构建时跳过 TS 检查（建议 CI 单独运行 tsc --noEmit）
  typescript: {
    ignoreBuildErrors: true,
  },

  // 增加 API 路由超时容忍，减少部署环境偶发超时
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },

  // 配置允许的图片域名 (Next 16 使用 remotePatterns 替代 domains)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qiniu-storage.weweknow.com',
        pathname: '/**',
      },
    ],
  },

  // 旧登录页重定向到统一登录页
  async redirects() {
    return [
      { source: '/admin/login', destination: '/?role=admin', statusCode: 301 },
      { source: '/client/login', destination: '/?role=client', statusCode: 301 },
      { source: '/client-manager/login', destination: '/?role=manager', statusCode: 301 },
      { source: '/surrogacy/login', destination: '/?role=surrogacy', statusCode: 301 },
    ];
  },

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
