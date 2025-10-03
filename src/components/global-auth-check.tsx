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

export function GlobalAuthCheck({ children }: GlobalAuthCheckProps) {
  const { isAuthenticated, isLoading, user, canAccessPath, getLoginPath } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const redirectingRef = useRef(false) // 防止重复重定向

  useEffect(() => {
    // 如果还在加载中或正在重定向，不做任何处理
    if (isLoading || redirectingRef.current) return

    console.log(`[GlobalAuth] Path: ${pathname}, Authenticated: ${isAuthenticated}, User: ${user?.role}, Loading: ${isLoading}`)

    // 检查是否为公共路径
    const isPublicPath = PUBLIC_PATHS.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    )

    // 特别检查登录页面路径
    const isLoginPage = pathname.includes('/login')

    if (isPublicPath || isLoginPage) {
      // 对于登录页面，不在这里处理重定向，让各个登录页面自己处理
      // 这样避免重复的重定向逻辑造成循环
      console.log(`[GlobalAuth] Public path or login page, skipping auth check`)
      return
    }

    // 对于受保护的路径，检查认证状态
    if (!isAuthenticated) {
      console.log(`[GlobalAuth] User not authenticated, redirecting to login`)
      redirectingRef.current = true
      // 确定需要的角色类型
      let requiredRole: 'admin' | 'client' | 'manager' | 'surrogacy' = 'client'
      
      for (const [pathPrefix, role] of Object.entries(PATH_ROLE_MAP)) {
        if (pathname.startsWith(pathPrefix)) {
          requiredRole = role
          break
        }
      }
      
      // 重定向到对应的登录页面
      const loginPath = getLoginPath(requiredRole)
      console.log(`[GlobalAuth] Redirecting to login: ${loginPath}`)
      router.replace(loginPath) // 使用 replace
      setTimeout(() => {
        redirectingRef.current = false
      }, 100)
      return
    }

    // 检查路径访问权限
    const hasAccess = canAccessPath(pathname)
    console.log(`[GlobalAuth] Access check for ${pathname}: ${hasAccess}`)
    
    if (!hasAccess) {
      console.log(`[GlobalAuth] Access denied, user role: ${user?.role}`)
      redirectingRef.current = true
      // 如果用户有权限但访问错误的路径，重定向到用户对应的首页
      if (user) {
        const homePath = getHomePath(user.role)
        console.log(`[GlobalAuth] Redirecting to user home: ${homePath}`)
        router.replace(homePath) // 使用 replace
      } else {
        // 如果没有用户信息，确定需要的角色类型并重定向到对应登录页
        let requiredRole: 'admin' | 'client' | 'manager' | 'surrogacy' = 'client'
        
        for (const [pathPrefix, role] of Object.entries(PATH_ROLE_MAP)) {
          if (pathname.startsWith(pathPrefix)) {
            requiredRole = role
            break
          }
        }
        
        const loginPath = getLoginPath(requiredRole)
        console.log(`[GlobalAuth] No user info, redirecting to login: ${loginPath}`)
        router.replace(loginPath) // 使用 replace
      }
      setTimeout(() => {
        redirectingRef.current = false
      }, 100)
      return
    }

    console.log(`[GlobalAuth] Access granted for ${pathname}`)

  }, [isAuthenticated, isLoading, user, pathname, router, canAccessPath, getLoginPath])

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

  return <>{children}</>
}

// 用于页面级别的快速认证检查Hook
export function usePageAuth(requiredRole?: 'admin' | 'client' | 'manager' | 'surrogacy') {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

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