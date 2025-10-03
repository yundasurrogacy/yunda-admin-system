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
  const { login, isAuthenticated, getHomePath, user } = useAuth()

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
        // 使用新的认证系统
        login({
          id: String(response.data.surrogate.id),
          email: username,
          role: 'surrogacy',
          name: response.data.surrogate.name || '代理妈妈'
        });
        
        toast({
          title: t("loginSuccess", { defaultValue: "登录成功" }),
          description: t("surrogacyLoginSuccess", { defaultValue: "欢迎回来，代理妈妈！" }),
          variant: "default",
        });
        
        // 登录成功后手动重定向
        setTimeout(() => {
          const homePath = getHomePath('surrogacy')
          router.replace(homePath)
        }, 500)
        
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
    <div style={{
      minHeight: `calc(100vh - ${headerHeight}px)`,
      background: 'rgba(251, 240, 218, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: 'auto',
      }}>
        <h1 className="text-5xl font-serif italic text-[#3C2B1C] tracking-wide">{t('surrogacyTitle', { defaultValue: 'SURROGACY' })}</h1>
      </div>
      <div style={{
        width: "100%",
        maxWidth: 1080,
        background: "rgba(251, 240, 218, 0.2)",
        borderRadius: 32,
        boxShadow: "0 32px 96px 0 rgba(191,201,191,0.28), 0 0 120px 24px rgba(251,240,218,0.38)",
        margin: "auto",
        border: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 32px",
        boxSizing: "border-box",
      }}>
        <h2 className="text-xl font-serif mb-4 text-[#3C2B1C]">{t('loginSubtitle', { defaultValue: '使用您的邮箱地址登录' })}</h2>
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          <LoginForm 
            onSubmit={handleLogin}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
