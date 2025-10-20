"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/useToast"
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/enhanced-login-form'
import { apiClient } from '@/lib/api-client-auth'

export default function SurrogacyLoginPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  // const { login, isAuthenticated, getHomePath, user } = useAuth()
   const { login, isAuthenticated, getHomePath, user } = useAuth("surrogacy")


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

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.surrogateLogin({ username, password });
      if (response.success && response.data?.surrogate) {
        const surrogacyInfo = {
          id: String(response.data.surrogate.id),
          email: username,
          role: 'surrogacy' as 'surrogacy',
          name: response.data.surrogate.name || '代理妈妈'
        };
        login(surrogacyInfo);

        // 登录成功后写入 surrogacy 专属 cookie，支持多端同时登录
        document.cookie = `userRole_surrogacy=surrogacy; path=/`;
        document.cookie = `userEmail_surrogacy=${surrogacyInfo.email}; path=/`;
        document.cookie = `userId_surrogacy=${surrogacyInfo.id}; path=/`;

        // 立即跳转，提供更丝滑的用户体验
        router.replace('/surrogacy/dashboard')
        
        // 显示成功提示（异步，不阻塞跳转）
        setTimeout(() => {
          toast({
            title: t("loginSuccess", { defaultValue: "登录成功" }),
            description: t("surrogacyLoginSuccess", { defaultValue: "欢迎回来，代理妈妈！" }),
            variant: "default",
          });
        }, 100)
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
        <h1 className="text-3xl md:text-5xl font-semibold text-sage-800 tracking-wide">{t('surrogacyTitle', { defaultValue: 'SURROGACY' })}</h1>
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
