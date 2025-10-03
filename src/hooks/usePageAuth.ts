/**
 * 简化的页面认证检查示例
 * 可以在现有页面中快速添加，无需大量修改组件结构
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// 通用认证检查Hook - 可以在任何页面组件中使用
export function useRequireAuth(requiredRole?: 'admin' | 'client' | 'manager' | 'surrogacy') {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 如果还在加载，等待
    if (isLoading) return

    // 如果未认证，重定向到登录页
    if (!isAuthenticated) {
      let loginPath = '/client/login'
      
      if (requiredRole) {
        switch (requiredRole) {
          case 'admin':
            loginPath = '/admin/login'
            break
          case 'manager':
            loginPath = '/client-manager/login'
            break
          case 'client':
            loginPath = '/client/login'
            break
          case 'surrogacy':
            loginPath = '/surrogacy/login'
            break
        }
      }
      
      router.push(loginPath)
      return
    }

    // 如果需要特定角色但用户角色不匹配
    if (requiredRole && !hasRole(requiredRole)) {
      // 重定向到用户对应的首页
      if (user) {
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard')
            break
          case 'manager':
            router.push('/client-manager/dashboard')
            break
          case 'client':
            router.push('/client/dashboard')
            break
          case 'surrogacy':
            router.push('/surrogacy/dashboard')
            break
        }
      }
      return
    }
  }, [isAuthenticated, isLoading, user, requiredRole, hasRole, router])

  return {
    isAuthenticated: isAuthenticated && (!requiredRole || hasRole(requiredRole)),
    isLoading,
    user
  }
}

// 管理员页面认证检查
export function useAdminAuth() {
  return useRequireAuth('admin')
}

// 客户页面认证检查
export function useClientAuth() {
  return useRequireAuth('client')
}

// 客户经理页面认证检查
export function useManagerAuth() {
  return useRequireAuth('manager')
}

// 代孕母页面认证检查
export function useSurrogacyAuth() {
  return useRequireAuth('surrogacy')
}