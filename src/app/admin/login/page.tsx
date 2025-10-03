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
        
        toast({
          title: t("loginSuccess", { defaultValue: "登录成功" }),
          description: t("adminLoginSuccess", { defaultValue: "欢迎回来，管理员！" }),
          variant: "default",
        });
        
        // 直接跳转到管理员dashboard，不依赖认证状态
        console.log(`[AdminLogin] Redirecting to: /admin/dashboard`)
        
        // 立即重定向
        setTimeout(() => {
          router.replace('/admin/dashboard')
        }, 300) // 减少延迟
        
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
    <div style={{
      minHeight: `calc(100vh - ${headerHeight}px)`,
      background: "rgba(251, 240, 218, 0.25)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      boxSizing: "border-box",
      // padding: "auto",
    }}>
      <div style={{
        // height: `calc(100vh - ${headerHeight}px - 400px)`, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        // padding: '20px',
        margin: 'auto',
      }}>
  <h1 className="text-5xl font-serif italic text-[#3C2B1C] tracking-wide">{t('adminTitle')}</h1>
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
        <h2 className="text-xl font-serif mb-4 text-[#3C2B1C]">{t('loginSubtitle')}</h2>
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          <LoginForm 
            onSubmit={handleManagersLogin}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
