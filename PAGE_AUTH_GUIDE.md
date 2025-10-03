# 页面认证保护实施指南

## 概述

我们已经为登录认证系统实施了多层保护机制，确保未登录用户会自动跳转到相应的登录页面。

## 已实施的保护机制

### 1. 全局认证检查 (最高优先级)
- **位置**: `src/app/layout.tsx`
- **组件**: `GlobalAuthCheck`
- **功能**: 自动检查所有页面的访问权限，无需登录的用户会被自动重定向

### 2. 组件级保护 (推荐用于新页面)
- **组件**: `AuthGuard`
- **使用方法**: 包装需要保护的页面内容

### 3. Hook级保护 (用于现有页面)
- **Hook**: `usePageAuth`系列
- **使用方法**: 在页面组件中调用相应的认证Hook

## 如何为其他页面添加认证保护

### 方法1: 使用AuthGuard组件 (推荐)

```typescript
import { AuthGuard } from '@/components/auth-guard'

export default function MyProtectedPage() {
  return (
    <AuthGuard requiredRole="admin">
      {/* 页面内容 */}
    </AuthGuard>
  )
}
```

### 方法2: 使用认证Hook (适合现有页面)

```typescript
import { useAdminAuth } from '@/hooks/usePageAuth'
// 或者: useClientAuth, useManagerAuth, useSurrogacyAuth

export default function MyPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!isAuthenticated) {
    return null // 会被重定向
  }

  // 页面内容
  return <div>Protected content</div>
}
```

## 已保护的页面

### 管理员页面
- ✅ `/admin/dashboard` - 使用 AuthGuard
- ✅ `/admin/client-profiles` - 使用 useAdminAuth Hook

### 客户页面  
- ✅ `/client/dashboard` - 使用 AuthGuard

### 客户经理页面
- ✅ `/client-manager/my-cases` - 使用 AuthGuard

### 代孕母页面
- ✅ `/surrogacy/dashboard` - 使用 AuthGuard

## 待保护的页面 (建议添加)

### 管理员页面
- `/admin/surrogate-profiles`
- `/admin/parents-applications`
- `/admin/client-manager`
- `/admin/notifications`
- `/admin/blogs`

### 客户页面
- `/client/profile`
- `/client/journey`
- `/client/files`

### 客户经理页面
- `/client-manager/client-profiles`
- `/client-manager/surrogate-profiles`
- `/client-manager/notifications`

### 代孕母页面
- `/surrogacy/journal`
- `/surrogacy/profile`
- `/surrogacy/files`

## 实施建议

### 对于新页面
使用 `AuthGuard` 组件，它提供最完整的保护和最好的用户体验。

### 对于现有页面
使用对应的认证Hook：
- 管理员页面: `useAdminAuth()`
- 客户页面: `useClientAuth()`  
- 客户经理页面: `useManagerAuth()`
- 代孕母页面: `useSurrogacyAuth()`

### 批量实施步骤

1. **确定页面角色**: 确认页面属于哪个用户角色
2. **选择保护方式**: AuthGuard vs Hook
3. **添加import**: 导入相应的组件或Hook
4. **实施保护**: 按照上述示例添加代码
5. **测试**: 确保未登录时正确重定向

## 自动重定向规则

### 未登录用户
- 管理员页面 → `/admin/login`
- 客户页面 → `/client/login`
- 客户经理页面 → `/client-manager/login`
- 代孕母页面 → `/surrogacy/login`

### 角色不匹配
- 自动重定向到用户对应的首页
- 管理员 → `/admin/dashboard`
- 客户 → `/client/dashboard`
- 客户经理 → `/client-manager/my-cases`
- 代孕母 → `/surrogacy/dashboard`

## 注意事项

1. **性能**: 全局认证检查会在每次路由变化时运行
2. **加载状态**: 认证检查期间显示加载指示器
3. **公共页面**: 登录页面、忘记密码页面等不需要保护
4. **类型安全**: 所有Hook和组件都有完整的TypeScript支持

## 快速实施脚本

对于需要快速为多个页面添加保护的情况，可以使用以下模板：

```typescript
// 在页面文件顶部添加
import { useAdminAuth } from '@/hooks/usePageAuth' // 根据角色选择

// 在组件开始处添加
export default function MyPage() {
  const { isAuthenticated, isLoading } = useAdminAuth() // 根据角色选择

  if (isLoading) return <div>加载中...</div>
  if (!isAuthenticated) return null

  // 原有页面内容...
}
```

这样可以最小化对现有代码的修改，同时提供完整的认证保护。