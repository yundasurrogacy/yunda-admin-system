/**
 * 认证调试工具
 * 在开发环境中帮助调试认证重定向问题
 */

"use client"

import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AuthDebuggerProps {
  enabled?: boolean
}

export function AuthDebugger({ enabled = false }: AuthDebuggerProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const debugInfo = {
      timestamp: new Date().toISOString(),
      pathname,
      isAuthenticated,
      isLoading,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      localStorage: {
        userRole: localStorage.getItem('userRole'),
        userEmail: localStorage.getItem('userEmail'),
        adminId: localStorage.getItem('adminId'),
        parentId: localStorage.getItem('parentId'),
        managerId: localStorage.getItem('managerId'),
        surrogateId: localStorage.getItem('surrogateId'),
      }
    }

    console.group('🔐 Auth Debug Info')
    console.log('📍 Current Path:', pathname)
    console.log('✅ Is Authenticated:', isAuthenticated)
    console.log('⏳ Is Loading:', isLoading)
    console.log('👤 User:', user)
    console.log('💾 LocalStorage:', debugInfo.localStorage)
    console.groupEnd()

  }, [enabled, pathname, isAuthenticated, isLoading, user])

  // 在开发环境中显示调试信息
  if (!enabled || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}
    >
      <div><strong>Auth Debug</strong></div>
      <div>Path: {pathname}</div>
      <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Loading: {isLoading ? '⏳' : '✅'}</div>
      <div>User: {user?.role || 'None'}</div>
      <div>Email: {user?.email || 'None'}</div>
    </div>
  )
}

// 使用方法：在需要调试的页面中添加
// <AuthDebugger enabled={true} />