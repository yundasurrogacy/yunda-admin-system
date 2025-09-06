"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, LogOut, Bell } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface ManagerAdminHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
  isLoggedIn?: boolean
}

export function ManagerAdminHeader({ onMenuClick, showMenuButton = true, isLoggedIn = true }: ManagerAdminHeaderProps) {
  const router = useRouter()
  const [language, setLanguage] = useState<"EN" | "CN">("CN")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "CN" : "EN"))
  }

  const handleLogin = () => {
    router.push("/client-manager/login")
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")

    // Clear authentication cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Redirect to login
    router.push("/client-manager/login")
  }

  const handleNotifications = () => {
    router.push("/client-manager/notifications")
  }

  const text = {
    EN: {
      menu: "MENU",
      logOut: "LOG OUT",
      logOutAction: "Log out",
      logIn: "LOG IN",
      notifications: "Notifications"
    },
    CN: {
      menu: "菜单",
      logOut: "登出",
      logOutAction: "登出",
      logIn: "登录",
      notifications: "通知"
    },
  }

  return (
    <header className="h-16 bg-sage-50 border-b border-sage-200 flex items-center justify-between px-4 md:px-6 animate-fade-in">
      <div className="flex items-center gap-4">
        {showMenuButton && onMenuClick && (
          <Button
            variant="ghost"
            onClick={onMenuClick}
            className="flex items-center gap-2 hover-glow focus-ring-enhanced p-2 h-auto"
          >
            <Menu className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
            <span className="text-sm font-medium text-sage-700 tracking-wide">{text[language].menu}</span>
          </Button>
        )}

        <div className="flex items-center gap-2 animate-slide-in-left">
          <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center hover-glow transition-all duration-200 hover:scale-105">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-wider text-sage-800 hover:text-sage-600 transition-colors duration-200">
            经理管理系统
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 animate-slide-in-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-sm font-medium text-sage-700 hover:text-sage-900 hover-glow focus-ring-enhanced transition-all duration-200 hover:scale-105"
        >
          {language} / {language === "EN" ? "CN" : "EN"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNotifications}
          className="text-sm font-medium text-sage-700 hover:text-sage-900 hover-glow focus-ring-enhanced transition-all duration-200 hover:scale-105"
        >
          <Bell className="h-4 w-4 mr-1" />
          {text[language].notifications}
        </Button>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-sage-700 hover:text-sage-900 hover-glow focus-ring-enhanced transition-all duration-200 hover:scale-105"
              >
                {text[language].logOut}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-scale-in">
              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-sage-100 hover:text-sage-900 transition-colors duration-200 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{text[language].logOutAction}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogin}
            className="text-sm font-medium text-sage-700 hover:text-sage-900 hover-glow focus-ring-enhanced transition-all duration-200 hover:scale-105"
          >
            {text[language].logIn}
          </Button>
        )}
      </div>
    </header>
  )
}
