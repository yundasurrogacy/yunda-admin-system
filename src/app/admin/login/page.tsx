"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/enhanced-login-form"
import { apiClient } from "@/lib/api-client-auth"

export default function AdminLoginPage() {
  const { t } = useTranslation("common")
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  // const { login, isAuthenticated, getHomePath, user } = useAuth()
   const { login, isAuthenticated, getHomePath, user } = useAuth("admin")

  // 计算header高度
  const [headerHeight, setHeaderHeight] = useState(80)
  
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (window.innerWidth >= 768) {
        setHeaderHeight(100)
      } else {
        setHeaderHeight(80)
      }
    }
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  // 管理端登录支持managers表
  const handleManagersLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      console.log(`[AdminLogin] Starting login for: ${username}`)
      const response = await apiClient.adminLogin({ username, password });
      
      if (response.success && response.data?.success && response.data.manager) {
        console.log(`[AdminLogin] Login API successful, manager data:`, response.data.manager)

        // 使用新的认证系统
        const userData = {
          id: String(response.data.manager.id),
          email: username,
          role: 'admin' as const,
          name: response.data.manager.name
        }

        console.log(`[AdminLogin] Calling login with user data:`, userData)
        login(userData);

        // 登录成功后写入 admin 专属 cookie，支持多端同时登录
        document.cookie = `userRole_admin=admin; path=/`;
        document.cookie = `userEmail_admin=${userData.email}; path=/`;
        document.cookie = `userId_admin=${userData.id}; path=/`;

        toast({
          title: t("loginSuccess", { defaultValue: "登录成功" }),
          description: t("adminLoginSuccess", { defaultValue: "欢迎回来，管理员！" }),
          variant: "default",
        });

        // 直接跳转到管理员dashboard，不依赖认证状态
        // console.log(`[AdminLogin] Redirecting to: /admin/dashboard`)
        router.replace('/admin/dashboard')
        // 立即重定向
        // setTimeout(() => {
        //   router.replace('/admin/dashboard')
        // }, 300) // 减少延迟

        return;
      }
      
      throw new Error(response.error || response.data?.error || t("loginError"));
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t("loginFailed"),
        description: error instanceof Error ? error.message : t("loginErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }  

  // 设计图1:1还原样式
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-[rgba(251,240,218,0.25)] px-4"
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
    >
      <div className="flex items-center justify-center w-full mt-8 mb-6">
        <h1 className="text-3xl md:text-5xl font-semibold text-sage-800 tracking-wide">{t('adminTitle')}</h1>
      </div>
      <div
        className="w-full max-w-[1080px] rounded-3xl shadow-xl bg-[rgba(251,240,218,0.2)] flex flex-col items-center justify-center p-8 md:p-12"
        style={{ boxShadow: "0 32px 96px 0 rgba(191,201,191,0.28), 0 0 120px 24px rgba(251,240,218,0.38)" }}
      >
        <h2 className="text-lg md:text-xl font-medium mb-4 text-sage-800">{t('loginSubtitle')}</h2>
        <div className="w-full max-w-[600px] mx-auto">
          <LoginForm 
            onSubmit={handleManagersLogin}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
