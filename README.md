# nextjs-template

本项目为 Next.js + GraphQL 全栈开发模板，支持服务端渲染、API 路由、类型安全的 GraphQL 客户端，内置缓存、文件上传、第三方服务集成等常用功能，适合企业级应用开发。

---

## 快速启动项目

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd nextjs-template
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   pnpm install
   # 或
   yarn install
   ```

3. **配置 GraphQL 端点**
   - 修改 `goc.config.ts`，填写你的 GraphQL 服务地址和 header。

4. **拉取 schema 并生成类型**
   ```bash
   npm run download:schema
   ```

5. **配置环境变量**
   - 创建 `.env.local` 文件，配置必要的环境变量（如 JWT 密钥、第三方服务密钥等）。

6. **运行开发环境**
```bash
npm run dev
   # 或
   pnpm dev
   # 或
yarn dev
   ```

7. **构建生产版本**
   ```bash
   npm run build
   npm run start
   ```

8. **（可选）代码检查**
   ```bash
   npm run lint
   ```

---

## 目录结构规范

```
nextjs-template/
  src/
    app/                    # Next.js App Router 页面和 API 路由
      api/                  # API 路由，按功能模块分目录
        auth/               # 认证相关 API
          phone-login/
            route.ts        # 手机号登录
          wx-login/
            route.ts        # 微信登录
        upload/             # 文件上传相关 API
          binary/
            route.ts        # 二进制文件上传
          form/
            route.ts        # 表单文件上传
      globals.css           # 全局样式
      layout.tsx            # 根布局组件
      page.tsx              # 首页
      favicon.ico           # 网站图标
    config-lib/             # 配置与工具库
      ali/                  # 阿里云服务
        AliSms.ts           # 短信服务
        config.ts           # 配置
      cache-store/          # 缓存工具
        cache-store.ts      # 缓存实现
        config.ts           # 缓存配置
      hasura/               # Hasura 相关
        config.ts           # Hasura 配置
        HasuraJwtToken.ts   # JWT Token 处理
      hasura-graphql-client/ # GraphQL 客户端
        hasura-graphql-client.ts # 客户端实例
        config.ts           # 客户端配置
      qiniu/                # 七牛云服务
        QiniuUploader.ts    # 文件上传
        config.ts           # 配置
      weixin/               # 微信服务
        config.ts           # 微信配置
        miniprogram/
          WxAuth.ts         # 小程序授权
        pay/
          JsapiPay.ts       # JSAPI 支付
    types/                  # 全局类型定义
      graphql.ts            # GraphQL 自动生成类型
      # 建议可细分 tables/ 目录，按表拆分业务类型
    project-config.ts       # 项目配置（如 endpoint、header）
  graphql/
    schema.graphql          # GraphQL schema 文件（自动生成）
    codegen.ts              # graphql-codegen 配置
  goc.config.ts             # GraphQL 客户端配置
  next.config.ts            # Next.js 配置
  package.json              # 项目依赖与脚本配置
  tsconfig.json             # TypeScript 配置
  eslint.config.mjs         # ESLint 配置
  postcss.config.mjs        # PostCSS 配置
  README.md                 # 项目说明文档
  ...
```

### 目录/文件职责说明

| 目录/文件 | 说明 |
|-----------|------|
| src/app/ | Next.js App Router，包含页面和 API 路由，按功能模块分子目录 |
| src/config-lib/ | 配置与工具库，缓存、GraphQL 客户端、第三方服务等 |
| src/types/ | 全局类型定义，graphql.ts 为自动生成类型，建议 tables/ 拆分业务类型 |
| src/project-config.ts | 项目配置（如 endpoint、header，建议仅工具脚本用） |
| graphql/schema.graphql | GraphQL schema 文件，自动生成 |
| graphql/codegen.ts | graphql-codegen 配置文件 |
| goc.config.ts | GraphQL 客户端配置（endpoint、header） |
| next.config.ts | Next.js 构建配置 |
| package.json | 项目依赖与脚本配置 |
| tsconfig.json | TypeScript 配置 |
| eslint.config.mjs | ESLint 代码检查配置 |

---

## 目录与命名风格规范

- **页面和组件文件**：
  - 统一使用英文小写+中划线（-），如 `user-center/`、`order-list/`、`page.tsx`。
  - 页面文件建议为 `page.tsx`，布局文件为 `layout.tsx`。
- **API 路由文件**：
  - 统一使用英文小写+中划线（-），如 `route.ts`、`user-login/`。
  - API 路由按功能模块分子目录，每个路由目录包含 `route.ts`。
- **工具库文件**：
  - 统一使用英文小写+中划线（-），如 `cache-store.ts`、`hasura-graphql-client.ts`。
  - 现已全部集中在 `config-lib/` 目录下。
- **类型定义文件**：
  - 统一使用英文小写+中划线或下划线，自动生成类型为 `graphql.ts`，业务类型建议细分到 `tables/` 子目录。
- **配置文件**：
  - 统一使用英文小写+中划线，如 `next.config.ts`、`goc.config.ts`。

#### 命名规范小结

| 类型         | 命名风格           | 示例                      |
|--------------|--------------------|---------------------------|
| 页面目录     | 小写+中划线        | user-center/              |
| 页面文件     | 小写+中划线        | page.tsx, layout.tsx      |
| API 路由     | 小写+中划线        | route.ts, user-login/     |
| 工具库文件   | 小写+中划线        | cache-store.ts            |
| 类型定义文件 | 小写+中划线/下划线 | graphql.ts, tables/user.ts|
| 配置文件     | 小写+中划线        | next.config.ts            |

---

## 推荐开发流程

1. 新建页面或 API 路由时，严格按目录规范新建目录和文件。
2. 新增 API 时，在 `app/api/` 下按功能模块创建子目录，每个路由目录包含 `route.ts`。
3. 新增类型时，优先基于自动生成的 graphql.ts，业务类型建议细分 tables/。
4. 工具函数统一放 config-lib/，命名用中划线。
5. 每次后端 schema 变更后，务必 `npm run download:schema` 同步类型。

---

## 典型用例

### 1. API 路由用法

```ts
// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';
import type { Users } from '@/types/graphql';

export async function GET(request: NextRequest) {
  try {
    const client = getHasuraClient();
    const users = await client.datas<Users>({
      table: 'users',
      args: { limit: 10 },
      datas_fields: ['id', 'name', 'email'],
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
```

### 2. 类型定义用法

```ts
// src/types/tables/user.ts
import type { Users, Users_Bool_Exp } from '../graphql';

export type User = Users;
export type UserWhere = Users_Bool_Exp;
export type UserField = keyof Users;
export type UserFields = UserField[];
```

### 3. 页面组件用法

```tsx
// src/app/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';
import type { User } from '@/types/tables/user';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const client = getHasuraClient();
      const data = await client.datas<User>({
        table: 'users',
        args: { limit: 10 },
        datas_fields: ['id', 'name', 'email'],
      });
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>用户列表</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. 缓存工具用法

```ts
// src/app/api/cached-data/route.ts
import { NextResponse } from 'next/server';
import cacheStore from '@/config-lib/cache-store/cache-store';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';

const getCachedData = cacheStore.cache(
  async (args: Record<string, any> = {}) => {
    const client = getHasuraClient();
    return await client.datas({
      table: 'some_table',
      args,
      datas_fields: ['id', 'name'],
    });
  },
  { duration: 5 * 60 * 1000 } // 5分钟缓存
);

export async function GET() {
  const data = await getCachedData({ limit: 10 });
  return NextResponse.json({ data });
}
```

---

## 常用脚本

- 拉取 schema 并生成类型：
  ```bash
  npm run download:schema
  ```
- 运行开发服务器：
  ```bash
  npm run dev
  ```
- 构建生产版本：
  ```bash
  npm run build
  ```
- 启动生产服务器：
  ```bash
  npm run start
  ```
- 代码检查：
  ```bash
  npm run lint
  ```

---

## 内置功能特性

### 1. GraphQL 客户端
- 基于 `graphql-ormify-client` 的类型安全 GraphQL 客户端
- 支持查询、变更、订阅等操作
- 内置缓存和请求监听

### 2. 缓存系统
- 基于内存的智能缓存
- 支持自定义缓存时长和强制刷新
- 自动哈希键生成

### 3. 第三方服务集成
- **阿里云短信服务**：支持短信发送
- **七牛云存储**：支持文件上传和管理
- **微信服务**：支持小程序授权和支付
- **JWT 认证**：支持用户认证和授权

### 4. 文件上传
- 支持二进制和表单文件上传
- 集成七牛云存储
- 支持多种文件类型

### 5. 开发工具
- TypeScript 类型检查
- ESLint 代码规范检查
- 自动 GraphQL 类型生成
- 热重载开发服务器

---

## 开发建议

- API 路由、类型、工具、页面结构建议严格按本规范组织，便于团队协作和维护。
- 业务类型建议基于自动生成的 GraphQL 类型二次封装，字段名类型用 `keyof` 自动推导。
- 缓存、请求、GraphQL 客户端等统一用 config-lib/ 目录下工具，API 推荐全部加缓存。
- 每次后端 schema 变更后，务必同步类型。
- 使用 Next.js App Router 的新特性，如服务端组件、流式渲染等。

---

## 环境变量配置

创建 `.env.local` 文件，配置以下环境变量：

```bash
# JWT 配置
JWT_SECRET=your-jwt-secret

# 阿里云短信配置
ALI_ACCESS_KEY_ID=your-access-key-id
ALI_ACCESS_KEY_SECRET=your-access-key-secret

# 七牛云配置
QINIU_ACCESS_KEY=your-qiniu-access-key
QINIU_SECRET_KEY=your-qiniu-secret-key
QINIU_BUCKET=your-bucket-name

# 微信配置
WX_APP_ID=your-wechat-app-id
WX_APP_SECRET=your-wechat-app-secret
WX_MCH_ID=your-merchant-id
WX_MCH_KEY=your-merchant-key
```

---

## 常见目录/文件 FAQ

- **app/ 下可以有多级目录吗？** 可以，Next.js App Router 支持嵌套路由，建议按功能模块组织。
- **types/ 下如何拆分业务类型？** 建议 tables/ 下每个表一个 ts 文件，便于维护和自动补全。
- **API 路由可以有多个方法吗？** 可以，在 route.ts 中导出 GET、POST、PUT、DELETE 等函数。
- **如何配置静态资源？** 在 `next.config.ts` 中配置 `images.domains` 等选项。
- **config-lib/ 和 utils/ 有什么区别？** config-lib/ 是当前主力的配置与工具库目录，包含所有核心功能模块。

---

## 技术栈

- **框架**：Next.js 15.3.4 (App Router)
- **语言**：TypeScript 5
- **样式**：Tailwind CSS 4
- **GraphQL**：graphql-ormify-client 1.0.5
- **认证**：JWT (jsonwebtoken)
- **存储**：七牛云 (qiniu)
- **短信**：阿里云短信服务
- **支付**：微信支付 (wechatpay-node-v3)

---

如有疑问或需补充，请联系项目维护者。