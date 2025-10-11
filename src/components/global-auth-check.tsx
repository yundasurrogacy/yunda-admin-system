"use client"

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

// 定义不需要认证的公共路径
const PUBLIC_PATHS = [
  '/',
  '/admin/login',
  '/client/login',
  '/client-manager/login',
  '/surrogacy/login',
  '/admin/forgot-password',
  '/client/forgot-password',
  '/client-manager/forgot-password',
  '/surrogacy/forgot-password',
]

// 定义路径与角色的映射关系
const PATH_ROLE_MAP: Record<string, 'admin' | 'client' | 'manager' | 'surrogacy'> = {
  '/admin': 'admin',
  '/client': 'client',
  '/client-manager': 'manager',
  '/surrogacy': 'surrogacy',
}

interface GlobalAuthCheckProps {
  children: React.ReactNode
}

// 获取对应角色的首页路径
const getHomePath = (role: 'admin' | 'client' | 'manager' | 'surrogacy') => {
  switch (role) {
    case 'admin': return '/admin/dashboard'
    case 'manager': return '/client-manager/dashboard'
    case 'client': return '/client/dashboard'
    case 'surrogacy': return '/surrogacy/dashboard'
    default: return '/'
  }
}

export function GlobalAuthCheck({ children }: GlobalAuthCheckProps) {
  // 暂时禁用全局认证检查，避免与登录页面的重定向冲突
  // 让每个页面自己处理认证逻辑
  
  console.log(`[GlobalAuth] Global auth check temporarily disabled to prevent redirect loops`)
  
  return <>{children}</>
}

// 用于页面级别的快速认证检查Hook
export function usePageAuth(requiredRole?: 'admin' | 'client' | 'manager' | 'surrogacy') {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // 登录后自动设置cookie，保证SSR和middleware能识别
    if (isAuthenticated && user) {
      document.cookie = `userRole=${user.role}; path=/`;
      if (user.email) document.cookie = `userEmail=${encodeURIComponent(user.email)}; path=/`;
      if (user.id) document.cookie = `userId=${user.id}; path=/`;
    }

    if (!isAuthenticated) {
      const loginPath = requiredRole ? 
        (requiredRole === 'manager' ? '/client-manager/login' : `/${requiredRole}/login`) :
        '/client/login'
      router.push(loginPath)
      return
    }

    if (requiredRole && !hasRole(requiredRole)) {
      // 用户角色不匹配，重定向到用户对应的首页
      if (user) {
        const homePath = getHomePath(user.role)
        router.push(homePath)
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