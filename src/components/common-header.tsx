"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "../lib/utils"
import '../i18n' 
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/useToast"

interface CommonHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
  isLoggedIn?: boolean
  theme?: "sage" | "blue" | "purple" | "default" // 不同端的主题色
  title?: string // 标题可以自定义
  type?: "admin" | "client" | "surrogacy" | "manager" | "client-manager" // 标识不同的端
}

export function CommonHeader({ 
  onMenuClick, 
  showMenuButton = true, 
  isLoggedIn: isLoggedInProp,
  theme = "sage",
  // title = "YUNDA",
  type = "client"
}: CommonHeaderProps) {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")
  // 语言只依赖i18n.language，去除多余useState
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // console.log(i18n.language)

    // const { t, i18n } = useTranslation("common")

  useEffect(() => {
    // 只要localStorage有userRole和userEmail即视为已登录
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")
    setIsLoggedIn(!!role && !!email)
  }, [])

  useEffect(() => {
    // 监听localStorage变化，确保切换后立即刷新状态
    const checkLogin = () => {
      const role = localStorage.getItem("userRole")
      const email = localStorage.getItem("userEmail")
      setIsLoggedIn(!!role && !!email)
    }
    checkLogin()
    window.addEventListener("storage", checkLogin)
    return () => window.removeEventListener("storage", checkLogin)
  }, [])

  const toggleLanguage = () => {
    const currentLang = i18n.language as "en" | "zh-CN"
    const newLang = currentLang === "en" ? "zh-CN" : "en"
    if (typeof i18n?.changeLanguage === "function") {
      i18n.changeLanguage(newLang)
    }
  // }
  }

  const handleLogin = () => {
    router.push(`/${type}/login`)
    setTimeout(() => {
      const role = localStorage.getItem("userRole")
      const email = localStorage.getItem("userEmail")
      setIsLoggedIn(!!role && !!email)
    }, 500)
  }

  const { toast } = useToast();
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    // 针对不同端清除对应 id，并兜底全部清理
    switch(type) {
      case "admin":
        localStorage.removeItem("adminId");
        break;
      case "client":
        localStorage.removeItem("parentId");
        break;
      case "manager":
      case "client-manager":
        localStorage.removeItem("managerId");
        break;
      case "surrogacy":
        localStorage.removeItem("surrogateId");
        break;
      default:
        break;
    }
    // 兜底清理所有 id，防止 type 传递错误导致 id 残留
    localStorage.removeItem("adminId");
    localStorage.removeItem("parentId");
    localStorage.removeItem("managerId");
    localStorage.removeItem("surrogateId");

    // Clear authentication cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    setIsLoggedIn(false)

    // 退出登录反馈
    let roleText = '';
    switch(type) {
      case 'admin':
        roleText = t('adminTitle', { defaultValue: '管理员' });
        break;
      case 'client':
        roleText = t('clientTitle', { defaultValue: '准父母' });
        break;
      case 'manager':
      case 'client-manager':
        roleText = t('managerTitle', { defaultValue: '客户经理' });
        break;
      case 'surrogacy':
        roleText = t('surrogacyTitle', { defaultValue: '代孕母' });
        break;
      default:
        roleText = t('logOut');
    }
    toast({
      title: t('logOutSuccess', { defaultValue: '退出成功' }),
      description: `${roleText}${t('logOutSuccessDesc', { defaultValue: '已安全退出登录' })}`,
      variant: 'default',
    });
    setTimeout(() => {
      router.push(`/${type}/login`)
    }, 800);
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
        {showMenuButton && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center"
          >
            <img src="/images/left_icon.svg" alt="Menu" className="w-10 h-10" />
          </button>
        )}
  <span className="ml-2 font-serif text-lg text-[#3C2B1C] tracking-widest">{t("menu")}</span>
      </div>

      {/* 中间logo区域，移动端自适应，桌面端内容宽度 */}
      <div className="flex-1 md:flex-none flex flex-col items-center justify-center md:justify-start">
        <a href="/" className="inline-block">
          <img src="/images/logo.png" alt="Yunda Logo" className="w-20 mb-2" />
        </a>
        {/* <span style={{ fontFamily: "var(--font-primary)" }} className="font-serif text-3xl md:text-4xl font-semibold text-[#3C2B1C] tracking-wide">YUNDA</span> */}
      </div>

      {/* 右侧导航/按钮，桌面自适应，移动端固定宽度 */}
      <div className="flex items-center gap-8 md:gap-8" style={{ minWidth: 40 }}>
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="text-lg font-serif text-[#3C2B1C]"
          >
            {t("logOut")}
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            className="text-lg font-serif text-[#3C2B1C]"
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
                `text-lg font-serif text-[#3C2B1C] focus:outline-none border-none bg-transparent p-0 m-0 ${i18n.language === "en" ? "font-bold" : "font-normal"}`
              }
              style={{ textDecoration: "none" }}
            >
              EN
            </button>
            <span className="mx-1">/</span>
            <button
              onClick={() => {
                if (i18n.language !== "zh-CN") toggleLanguage()
              }}
              className={
                `text-lg font-serif text-[#3C2B1C] focus:outline-none border-none bg-transparent p-0 m-0 ${i18n.language === "zh-CN" ? "font-bold" : "font-normal"}`
              }
              style={{ textDecoration: "none" }}
            >
              CN
            </button>
          </div>
      </div>
    </header>
  )
}
