"use client"

import { useState, useEffect } from "react"
import { useAppType } from "@/context/app-type-context"
import { useRouter } from "next/navigation"
import { cn } from "../lib/utils"
import '../i18n' 
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import { useSidebar } from "@/context/sidebar-context";

interface CommonHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  isLoggedIn?: boolean;
  theme?: "sage" | "blue" | "purple" | "default"; // 不同端的主题色
  title?: string; // 标题可以自定义
  type?: "admin" | "client" | "surrogacy" | "manager" | "client-manager"; // 标识不同的端（可选，优先用全局）
}

export function CommonHeader({ 
  onMenuClick, 
  showMenuButton = true, 
  isLoggedIn: isLoggedInProp,
  theme = "sage",
  type: propType
}: CommonHeaderProps) {
  const { setSidebarOpen } = useSidebar();
  // 优先用全局 type
  const { appType } = useAppType();
  const type = propType || appType;
  const router = useRouter()
  const { t, i18n } = useTranslation("common")
  // 多端 session 支持，type 传递给 useAuth，'client-manager' 映射为 'manager'
  const normalizedType = type === 'client-manager' ? 'manager' : type
  const authType = normalizedType
  const { isAuthenticated, user, logout, getLoginPath } = useAuth(authType)
  const { toast } = useToast()

  // 强制重新渲染当认证状态改变时 - 必须在所有useEffect之前
  const [, setForceUpdate] = useState({})
  // 本地状态追踪登录状态
  const [localIsLoggedIn, setLocalIsLoggedIn] = useState(false)

  // 直接使用认证系统的状态，不依赖外部传入的prop
  const isLoggedIn = isAuthenticated

  // 只在登录页自动跳转首页，其他页面不自动跳转
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    setLocalIsLoggedIn(isAuthenticated)
    setForceUpdate({})
    // 只在登录页自动跳转
    const loginPaths: Record<string, string> = {
      admin: '/admin/login',
      client: '/client/login',
      manager: '/client-manager/login',
      surrogacy: '/surrogacy/login',
    }
    const currentPath = window.location.pathname
    const isLoginPage = currentPath === loginPaths[normalizedType]
    if (isLoginPage && isAuthenticated) {
      const cookies = document.cookie.split(';').map(c => c.trim())
      const roleCookieKey = `userRole_${normalizedType}`
      const hasRoleCookie = cookies.some(c => c.startsWith(`${roleCookieKey}=`))
      if (hasRoleCookie) {
        let homePath = '/';
        switch (normalizedType) {
          case 'admin': homePath = '/admin/dashboard'; break;
          case 'manager': homePath = '/client-manager/dashboard'; break;
          case 'client': homePath = '/client/dashboard'; break;
          case 'surrogacy': homePath = '/surrogacy/dashboard'; break;
          default: homePath = '/';
        }
        router.replace(homePath)
      }
    }
  }, [isAuthenticated, user, normalizedType, router])

  // 监听全局认证状态变化事件
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const sessionKeyMap = {
          admin: 'admin_user',
          client: 'client_user',
          manager: 'manager_user',
          surrogacy: 'surrogacy_user',
        }
        const sessionKey = sessionKeyMap[normalizedType]
        const raw = localStorage.getItem(sessionKey)
        setLocalIsLoggedIn(!!raw)
        setForceUpdate({})
        console.log(`[CommonHeader] [${normalizedType}] sessionKey: ${sessionKey}, hasSession: ${!!raw}`)
      } catch (e) {
        setLocalIsLoggedIn(false)
      }
    }
    window.addEventListener('authStateChanged', handleAuthChange)
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [normalizedType])

  // 实际使用的登录状态
  const actualIsLoggedIn = localIsLoggedIn

  const toggleLanguage = () => {
    const currentLang = i18n.language as "en" | "zh-CN"
    const newLang = currentLang === "en" ? "zh-CN" : "en"
    if (typeof i18n?.changeLanguage === "function") {
      i18n.changeLanguage(newLang)
    }
  }

  const handleLogin = () => {
    // 打印当前 type 方便调试
    // console.log('[CommonHeader] 当前 type:', type, 'normalizedType:', normalizedType);
    // 登录时统一用normalizedType
    const loginPath = getLoginPath(normalizedType)
    // 获取当前用户信息（如有）
    const email = user?.email || ''
    const id = user?.id || ''
    // 设置所有 SSR/middleware 需要的 cookie
    document.cookie = `userRole=${normalizedType}; path=/`;
    if (email) document.cookie = `userEmail=${email}; path=/`;
    if (id) document.cookie = `userId=${id}; path=/`;
    // 立即刷新页面，确保 cookie 被 SSR 识别
    window.location.href = loginPath
  }

  const handleLogout = () => {
    // 获取角色文本用于提示
    let roleText = '';
    switch(type) {
      case 'admin':
        roleText = t('adminTitle', { defaultValue: '管理员' });
        break;
      case 'client':
        roleText = t('clientTitle', { defaultValue: '准父母' });
        break;
      case 'manager':
      // case 'client-manager':
        roleText = t('managerTitle', { defaultValue: '客户经理' });
        break;
      case 'surrogacy':
        roleText = t('surrogacyTitle', { defaultValue: '代孕母' });
        break;
      default:
        roleText = t('user', { defaultValue: '用户' });
    }
    toast({
      title: t('logOutSuccess', { defaultValue: '退出成功' }),
      description: `${roleText}${t('logOutSuccessDesc', { defaultValue: '已安全退出登录' })}`,
      variant: 'default',
    });
    // 清除相关cookie
    const cookieKeys = [
      `userRole`,
      `userRole_${normalizedType}`,
      `userEmail`,
      `userId`
    ];
    cookieKeys.forEach(key => {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    // 直接登出当前端 session
    logout()
  }

  // ...existing code...

  // 根据主题获取对应的颜色类
  const getThemeClasses = () => {
    switch(theme) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          hover: "hover:text-blue-900"
        }
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          hover: "hover:text-purple-900"
        }
      case "sage":
      default:
        return {
          bg: "bg-sage-50",
          border: "border-sage-200",
          text: "text-sage-700",
          hover: "hover:text-sage-900"
        }
    }
  }

  const themeClasses = getThemeClasses()

  return (
    <header
      className={cn("h-20 md:h-25 border-b flex items-center justify-between px-8 md:px-24 rounded-t-xl shadow-sm", themeClasses.border)}
      style={{ background: "#C3CCC2" }}
    >
      {/* 左侧按钮，固定宽度40px */}
      <div className="flex items-center" style={{ minWidth: 40 }}>
        {showMenuButton && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-sage-400 rounded transition-all duration-100 active:scale-95 hover:bg-sage-100"
            tabIndex={0}
            aria-label={t('menu')}
          >
            <img src="/images/left_icon.svg" alt="Menu" className="w-10 h-10" />
          </button>
        )}
        <span className="ml-2 text-lg font-medium text-sage-800 tracking-widest">{t("menu")}</span>
      </div>

      {/* 中间logo区域，移动端自适应，桌面端内容宽度 */}
      <div className="flex-1 md:flex-none flex flex-col items-center justify-center md:justify-start">
        <button
          className="inline-block focus:outline-none border-none bg-transparent p-0 m-0"
          style={{ cursor: "pointer" }}
          onClick={() => {
            // 判断登录状态和端类型，跳转到对应页面
            let targetPath = "/";
            switch (normalizedType) {
              case "admin":
                targetPath = actualIsLoggedIn ? "/admin/dashboard" : "/admin/login";
                break;
              case "manager":
                targetPath = actualIsLoggedIn ? "/client-manager/dashboard" : "/client-manager/login";
                break;
              case "client":
                targetPath = actualIsLoggedIn ? "/client/dashboard" : "/client/login";
                break;
              case "surrogacy":
                targetPath = actualIsLoggedIn ? "/surrogacy/dashboard" : "/surrogacy/login";
                break;
              default:
                targetPath = "/";
            }
            router.replace(targetPath);
          }}
          tabIndex={0}
          aria-label={t('logo')}
        >
          <img src="/images/logo.png" alt="Yunda Logo" className="w-20 mb-2" />
        </button>
        {/* <span style={{ fontFamily: "var(--font-primary)" }} className="font-serif text-3xl md:text-4xl font-semibold text-[#3C2B1C] tracking-wide">YUNDA</span> */}
      </div>

      {/* 右侧导航/按钮，桌面自适应，移动端固定宽度 */}
      <div className="flex items-center gap-8 md:gap-8" style={{ minWidth: 40 }}>
        {actualIsLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-lg font-medium text-sage-800 cursor-pointer focus:outline-none border-none bg-transparent p-0 m-0 transition-all duration-100 focus:ring-2 focus:ring-sage-400 active:scale-95 hover:bg-sage-100 rounded"
            tabIndex={0}
          >
            {t("logOut")}
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="text-lg font-medium text-sage-800 cursor-pointer focus:outline-none border-none bg-transparent p-0 m-0 transition-all duration-100 focus:ring-2 focus:ring-sage-400 active:scale-95 hover:bg-sage-100 rounded"
            tabIndex={0}
          >
            {t("logIn")}
          </button>
        )}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                if (i18n.language !== "en") toggleLanguage()
              }}
              className={
                `text-lg text-sage-800 focus:outline-none border-none bg-transparent p-0 m-0 transition-all duration-100 ${i18n.language === "en" ? "font-semibold" : "font-medium"} cursor-pointer focus:ring-2 focus:ring-sage-400 active:scale-95 hover:bg-sage-100 rounded`
              }
              style={{ textDecoration: "none" }}
              tabIndex={0}
            >
              EN
            </button>
            <span className="mx-1">/</span>
            <button
              onClick={() => {
                if (i18n.language !== "zh-CN") toggleLanguage()
              }}
              className={
                `text-lg text-sage-800 focus:outline-none border-none bg-transparent p-0 m-0 transition-all duration-100 ${i18n.language === "zh-CN" ? "font-semibold" : "font-medium"} cursor-pointer focus:ring-2 focus:ring-sage-400 active:scale-95 hover:bg-sage-100 rounded`
              }
              style={{ textDecoration: "none" }}
              tabIndex={0}
            >
              CN
            </button>
          </div>
      </div>
    </header>
  )
}
