
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from 'react-i18next'
import { useToast } from "@/hooks/useToast"
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/enhanced-login-form'
import { apiClient } from '@/lib/api-client-auth'

export default function ClientLoginPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  // const { login, isAuthenticated, getHomePath, user } = useAuth()
  const { login, isAuthenticated, getHomePath, user } = useAuth("client")

  // 计算header高度
  const [headerHeight, setHeaderHeight] = useState(80)
  
  // 响应式 header 高度
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

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.clientLogin({ username, password });
      
      if (response.success && response.data?.parent) {
        // 使用新的认证系统
        const clientInfo = {
          id: String(response.data.parent.id),
          email: username,
          role: 'client' as 'client',
          name: response.data.parent.name || '客户'
        };
        login(clientInfo);

        // 登录成功后写入 client 专属 cookie，支持多端同时登录
        document.cookie = `userRole_client=client; path=/`;
        document.cookie = `userEmail_client=${clientInfo.email}; path=/`;
        document.cookie = `userId_client=${clientInfo.id}; path=/`;

        toast({
          title: t("loginSuccess", { defaultValue: "登录成功" }),
          description: t("clientLoginSuccess", { defaultValue: "欢迎回来！" }),
          variant: "default",
        });

        // 直接使用硬编码路径进行重定向
        const homePath = '/client/dashboard'
        // console.log(`[ClientLogin] Redirecting to: ${homePath}`)
        router.replace(homePath)
        // 立即重定向
        // setTimeout(() => {
        //   router.replace(homePath)
        // }, 300) // 减少延迟

        return;
      }
      
      throw new Error(response.error || response.data?.error || t("loginError"));
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('loginFailed'),
        description: error instanceof Error ? error.message : t('loginErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-[rgba(251,240,218,0.25)] px-4"
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
    >
      <div className="flex items-center justify-center w-full mt-8 mb-6">
        <h1 className="text-3xl md:text-5xl font-semibold text-sage-800 tracking-wide">{t('clientTitle', { defaultValue: 'CLIENT' })}</h1>
      </div>
      <div
        className="w-full max-w-[1080px] rounded-3xl shadow-xl bg-[rgba(251,240,218,0.2)] flex flex-col items-center justify-center p-8 md:p-12"
        style={{ boxShadow: "0 32px 96px 0 rgba(191,201,191,0.28), 0 0 120px 24px rgba(251,240,218,0.38)" }}
      >
        <h2 className="text-lg md:text-xl font-medium mb-4 text-sage-800">{t('loginSubtitle', { defaultValue: '使用您的邮箱地址登录' })}</h2>
        <div className="w-full max-w-[600px] mx-auto">
          <LoginForm 
            onSubmit={handleLogin}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
