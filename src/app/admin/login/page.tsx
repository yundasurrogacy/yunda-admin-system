"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginCard } from "@/components/common/login-card"
import { LoginForm } from "@/components/common/login-form"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/useToast"
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client"

export default function AdminLoginPage() {
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
  // 国际化文本统一用 t('xxx') 公用字典
  const { t } = useTranslation("common")
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  // const { t, i18n } = useTranslation("common")

  // 管理端登录支持managers表
  const handleManagersLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.manager) {
        localStorage.setItem("adminId", String(data.manager.id));
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", username);
        toast({
          title: t("loginSuccess", { defaultValue: "登录成功" }),
          description: t("loginSuccessDesc", { defaultValue: "欢迎回来，管理员！" }),
          variant: "default",
        });
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 800);
        return;
      }
      throw new Error(data.error || t("loginError"));
    } catch (error) {
      toast({
        title: t("loginFailed"),
        description: t("loginErrorDesc"),
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
        // margin: "0",
        margin: "auto",
        border: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 32px",
        // padding: "32px 32px",
        boxSizing: "border-box",
        // height: 350
      }}>
  <h2 className="text-xl font-serif mb-4 text-[#3C2B1C]">{t('loginSubtitle')}</h2>
        <form
          style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}
          // className="flex flex-col gap-8"
          className="flex flex-col gap-4"
          onSubmit={e => { e.preventDefault(); handleManagersLogin(username, password); }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-base font-serif text-[#3C2B1C] mb-2">{t('emailLabel')}</label>
              <input
                id="email"
                type="email"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  background: "#EAE9D0",
                  border: "none",
                  borderRadius: 18,
                  fontSize: 20,
                  height: 56,
                  width: "100%",
                  padding: "0 20px"
                }}
                className="font-serif text-[#3C2B1C]"
              />
              <div className="text-right mt-2">
                <a href="/admin/forgot-password" className="text-xs text-[#3C2B1C] hover:underline">
                  {t('forgotPassword')}
                </a>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-serif text-[#3C2B1C] mb-2">{t('passwordLabel')}</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  background: "#EAE9D0",
                  border: "none",
                  borderRadius: 18,
                  fontSize: 20,
                  height: 56,
                  width: "100%",
                  padding: "0 20px"
                }}
                className="font-serif text-[#3C2B1C]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#BFC9BF",
              color: "#fff",
              borderRadius: 18,
              padding: "18px 0",
              fontSize: 22,
              fontWeight: 600,
              width: "33.33%",
              alignSelf: "left",
              border: "none",
              boxShadow: loading ? "none" : "0 6px 24px rgba(191,201,191,0.22)",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              // marginTop: "32px"
              margin: "auto 0",
            }}
            className="font-serif"
          >
            {loading ? t('loggingIn') : t('loginButton')}
          </button>
        </form>
      </div>
    </div>
  )
}
