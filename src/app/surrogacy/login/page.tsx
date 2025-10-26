"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useSimpleToast } from '@/components/ui/simple-toast'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/enhanced-login-form'
import { apiClient } from '@/lib/api-client-auth'

export default function SurrogacyLoginPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { showToast: simpleToast } = useSimpleToast()
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
      
      // 检查登录是否成功
      if (!response.success) {
        // 始终使用本地化的错误消息
        simpleToast(t("userNameOrPasswordError"), 'error');
        setLoading(false);
        return;
      }

      // 检查 API 返回的数据
      if (!response.data?.surrogate) {
        // 始终使用本地化的错误消息
        simpleToast(t("userNameOrPasswordError"), 'error');
        setLoading(false);
        return;
      }

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
        simpleToast(t("surrogacyLoginSuccess"), 'success');
      }, 100)

    } catch (error) {
      console.error('[SurrogacyLogin] Login error:', error);
      // 始终使用本地化的错误消息
      simpleToast(t("unknownError"), 'error');
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
        <h1 className="text-3xl md:text-5xl font-semibold text-sage-800 tracking-wide">{t('surrogacyTitle')}</h1>
      </div>
      <div
        className="w-full max-w-[1080px] rounded-3xl shadow-xl bg-[rgba(251,240,218,0.2)] flex flex-col items-center justify-center p-8 md:p-12"
        style={{ boxShadow: "0 32px 96px 0 rgba(191,201,191,0.28), 0 0 120px 24px rgba(251,240,218,0.38)" }}
      >
        <h2 className="text-lg md:text-xl font-medium mb-4 text-sage-800">{t('loginSubtitle')}</h2>
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
