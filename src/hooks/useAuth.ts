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

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  // 从localStorage恢复用户状态
  const restoreUserSession = useCallback(() => {
    if (typeof window === 'undefined') return

    console.log(`[Auth] Restoring user session...`)
    
    try {
      const userRole = localStorage.getItem('userRole')
      const userEmail = localStorage.getItem('userEmail')
      const userId = localStorage.getItem('adminId') || 
                    localStorage.getItem('parentId') || 
                    localStorage.getItem('managerId') || 
                    localStorage.getItem('surrogateId')

      console.log(`[Auth] Session data - Role: ${userRole}, Email: ${userEmail}, ID: ${userId}`)

      if (userRole && userEmail && userId) {
        const restoredUser = {
          id: userId,
          email: userEmail,
          role: userRole as User['role']
        }
        
        setAuthState({
          user: restoredUser,
          isLoading: false,
          isAuthenticated: true
        })
        
        console.log(`[Auth] Session restored successfully for user:`, restoredUser)
      } else {
        console.log(`[Auth] No valid session found, setting unauthenticated state`)
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        })
      }
    } catch (error) {
      console.error('Error restoring user session:', error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      })
    }
  }, [])

  // 登录
  const login = useCallback((user: User) => {
    console.log(`[Auth] Login called for user:`, user)
    
    // 清除旧的存储
    localStorage.removeItem('adminId')
    localStorage.removeItem('parentId')
    localStorage.removeItem('managerId')
    localStorage.removeItem('surrogateId')

    // 存储新的用户信息
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('userEmail', user.email)
    
    // 根据角色存储对应的ID
    switch (user.role) {
      case 'admin':
        localStorage.setItem('adminId', user.id)
        break
      case 'client':
        localStorage.setItem('parentId', user.id)
        break
      case 'manager':
        localStorage.setItem('managerId', user.id)
        break
      case 'surrogacy':
        localStorage.setItem('surrogateId', user.id)
        break
    }

    // 同步到cookies以支持服务端验证
    document.cookie = `userRole=${user.role}; path=/; max-age=${7 * 24 * 60 * 60}`
    document.cookie = `userEmail=${user.email}; path=/; max-age=${7 * 24 * 60 * 60}`
    document.cookie = `userId=${user.id}; path=/; max-age=${7 * 24 * 60 * 60}`

    // 立即更新状态
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true
    })
    
    console.log(`[Auth] User state updated, authenticated: true, role: ${user.role}`)
  }, [])

  // 登出
  const logout = useCallback(() => {
    // 清除所有存储的用户信息
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('adminId')
    localStorage.removeItem('parentId')
    localStorage.removeItem('managerId')
    localStorage.removeItem('surrogateId')

    // 清除cookies
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    })

    // 重定向到首页
    router.push('/')
  }, [router])

  // 检查用户是否有特定权限
  const hasRole = useCallback((role: User['role']) => {
    return authState.user?.role === role
  }, [authState.user])

  // 检查用户是否有访问特定路径的权限
  const canAccessPath = useCallback((path: string) => {
    if (!authState.isAuthenticated) return false

    const role = authState.user?.role
    if (!role) return false

    // 定义路径权限规则
    if (path.startsWith('/admin')) return role === 'admin'
    if (path.startsWith('/client-manager')) return role === 'manager'
    if (path.startsWith('/client')) return role === 'client'
    if (path.startsWith('/surrogacy')) return role === 'surrogacy'

    return true
  }, [authState])

  // 获取对应角色的登录路径
  const getLoginPath = useCallback((role?: User['role']) => {
    switch (role) {
      case 'admin': return '/admin/login'
      case 'manager': return '/client-manager/login'
      case 'client': return '/client/login'
      case 'surrogacy': return '/surrogacy/login'
      default: return '/client/login'
    }
  }, [])

  // 获取对应角色的首页路径
  const getHomePath = useCallback((role?: User['role']) => {
    switch (role) {
      case 'admin': return '/admin/dashboard'
      case 'manager': return '/client-manager/dashboard'
      case 'client': return '/client/dashboard'
      case 'surrogacy': return '/surrogacy/dashboard'
      default: return '/'
    }
  }, [])

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