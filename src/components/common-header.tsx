"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "../lib/utils"

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
  isLoggedIn = false,
  theme = "sage",
  title = "YUNDA",
  type = "client"
}: CommonHeaderProps) {
  const router = useRouter()
  const [language, setLanguage] = useState<"EN" | "CN">("EN")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "CN" : "EN"))
  }

  const handleLogin = () => {
    router.push(`/${type}/login`)
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")

    // Clear authentication cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Redirect to login
    router.push(`/${type}/login`)
  }

  const text = {
    EN: {
      menu: "MENU",
      logOut: "LOG OUT",
      logOutAction: "Log out",
      logIn: "LOG IN"
    },
    CN: {
      menu: "菜单",
      logOut: "登出",
      logOutAction: "登出",
      logIn: "登录"
    },
  }

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
      className={cn("h-16 border-b flex items-center justify-between px-4 md:px-6", themeClasses.border)}
      style={{ background: "#BFC9BF" }}
    >
      <div className="flex items-center gap-4">
        {showMenuButton && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex items-center gap-2 p-2"
          >
            <span className="sr-only">菜单</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium font-serif text-[#271F18]">{text[language].menu}</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-wider font-serif text-[#271F18] hover:opacity-80">
            {title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium font-serif text-[#271F18]"
          >
            {text[language].logOut}
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            className="text-sm font-medium font-serif text-[#271F18]"
          >
            {text[language].logIn}
          </button>
        )}
        <button
          onClick={toggleLanguage}
          className="text-sm font-medium font-serif text-[#271F18]"
        >
          {language} / {language === "EN" ? "CN" : "EN"}
        </button>
      </div>
    </header>
  )
}
