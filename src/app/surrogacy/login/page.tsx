"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginCard } from "@/components/common/login-card"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/useToast"
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client"

export default function SurrogacyLoginPage() {
  // 计算header高度
  const [headerHeight, setHeaderHeight] = useState(80)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation('common')
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
    setLoading(true)
    try {
      const res = await fetch("/api/surrogate-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.surrogate) {
        console.log("Surrogate login successful:", data);
        localStorage.setItem('surrogateId', data.surrogate.id);
        localStorage.setItem("userRole", "surrogacy");
        localStorage.setItem("userEmail", username);
        router.push("/surrogacy/dashboard");
        return;
      }
      throw new Error(data.error || t('loginError'));
    } catch (error) {
      toast({
        title: t('loginFailed'),
        description: t('loginErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

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
        width: '100%',
        maxWidth: 1080,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        maxHeight: `calc(100vh - ${headerHeight}px - 80px)`
      }}>
        <LoginCard
          title={t('surrogacyTitle', { defaultValue: 'SURROGACY' })}
          subtitle={t('loginSubtitle')}
          emailLabel={t('emailLabel')}
          passwordLabel={t('passwordLabel')}
          forgotPassword={t('forgotPassword')}
          loginButton={t('loginButton')}
          loggingIn={t('loggingIn')}
          loading={loading}
          onLogin={handleLogin}
        />
      </div>
    </div>
  )
}
