"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'client' | 'manager' | 'surrogacy'
  fallbackPath?: string
}

export function AuthGuard({ children, requiredRole, fallbackPath }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, canAccessPath, getLoginPath } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    // 如果未认证
    if (!isAuthenticated) {
      const loginPath = requiredRole ? getLoginPath(requiredRole) : getLoginPath()
      router.push(loginPath)
      return
    }

    // 如果需要特定角色但用户角色不匹配
    if (requiredRole && user?.role !== requiredRole) {
      const userLoginPath = getLoginPath(user?.role)
      router.push(fallbackPath || userLoginPath)
      return
    }

    // 检查路径访问权限
    if (!canAccessPath(pathname)) {
      const userLoginPath = getLoginPath(user?.role)
      router.push(fallbackPath || userLoginPath)
      return
    }
  }, [isAuthenticated, isLoading, user, requiredRole, pathname, router, canAccessPath, getLoginPath, fallbackPath])

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // 如果未认证或角色不匹配，显示加载状态（即将重定向）
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole) || !canAccessPath(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}