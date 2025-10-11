"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: string
  email: string
  role: 'admin' | 'client' | 'manager' | 'surrogacy'
  name?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}


// 多端 session key 映射
const SESSION_KEY_MAP = {
  admin: 'admin_user',
  client: 'client_user',
  manager: 'manager_user',
  surrogacy: 'surrogacy_user',
}

// 获取当前端的 session key
function getSessionKey(type: User['role']) {
  return SESSION_KEY_MAP[type]
}

// useAuth 支持传入 type，默认 client
export function useAuth(type: User['role'] = 'client') {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })
  // 强制刷新
  const [, forceUpdate] = useState({})
  const triggerUpdate = useCallback(() => { forceUpdate({}) }, [])

  // 恢复当前端 session
  const restoreUserSession = useCallback(() => {
    if (typeof window === 'undefined') return
    const sessionKey = getSessionKey(type)
    try {
      const raw = localStorage.getItem(sessionKey)
      if (raw) {
        const user: User = JSON.parse(raw)
        setAuthState({ user, isLoading: false, isAuthenticated: true })
        console.log(`[Auth][${type}] Session restored:`, user)
      } else {
        setAuthState({ user: null, isLoading: false, isAuthenticated: false })
        console.log(`[Auth][${type}] No session found.`)
      }
    } catch (e) {
      setAuthState({ user: null, isLoading: false, isAuthenticated: false })
      console.error(`[Auth][${type}] Restore error:`, e)
    }
  }, [type])

  // 登录当前端
  const login = useCallback((user: User) => {
    const sessionKey = getSessionKey(type)
    localStorage.setItem(sessionKey, JSON.stringify(user))
    // 同步到 cookies
    document.cookie = `${sessionKey}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${7 * 24 * 60 * 60}`
    setAuthState({ user, isLoading: false, isAuthenticated: true })
    setTimeout(() => {
      triggerUpdate()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('authStateChanged'))
      }
    }, 10)
    console.log(`[Auth][${type}] Login:`, user)
  }, [type, triggerUpdate])

  // 登出当前端
  const logout = useCallback(() => {
    const sessionKey = getSessionKey(type)
    localStorage.removeItem(sessionKey)
    document.cookie = `${sessionKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    setAuthState({ user: null, isLoading: false, isAuthenticated: false })
    triggerUpdate()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authStateChanged'))
    }
    // 跳转到对应登录页
    router.push(getLoginPath(type))
    console.log(`[Auth][${type}] Logout.`)
  }, [type, router, triggerUpdate])

  // 检查当前端角色
  const hasRole = useCallback((role: User['role']) => {
    return authState.user?.role === role
  }, [authState.user])

  // 检查当前端是否能访问 path
  const canAccessPath = useCallback((path: string) => {
    if (!authState.isAuthenticated) return false
    const role = authState.user?.role
    if (!role) return false
    if (path.startsWith('/admin')) return role === 'admin'
    if (path.startsWith('/client-manager')) return role === 'manager'
    if (path.startsWith('/client')) return role === 'client'
    if (path.startsWith('/surrogacy')) return role === 'surrogacy'
    return true
  }, [authState])

  // 获取登录路径
  const getLoginPath = useCallback((role?: User['role']) => {
    switch (role || type) {
      case 'admin': return '/admin/login'
      case 'manager': return '/client-manager/login'
      case 'client': return '/client/login'
      case 'surrogacy': return '/surrogacy/login'
      default: return '/client/login'
    }
  }, [type])

  // 获取首页路径
  const getHomePath = useCallback((role?: User['role']) => {
    switch (role || type) {
      case 'admin': return '/admin/dashboard'
      case 'manager': return '/client-manager/dashboard'
      case 'client': return '/client/dashboard'
      case 'surrogacy': return '/surrogacy/dashboard'
      default: return '/'
    }
  }, [type])

  useEffect(() => {
    restoreUserSession()
  }, [restoreUserSession])

  return {
    ...authState,
    login,
    logout,
    hasRole,
    canAccessPath,
    getLoginPath,
    getHomePath,
    refreshSession: restoreUserSession
  }
}