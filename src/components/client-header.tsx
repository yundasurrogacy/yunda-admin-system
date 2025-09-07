"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface ClientHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
  isLoggedIn?: boolean
}

export function ClientHeader({ onMenuClick, showMenuButton = true, isLoggedIn = false }: ClientHeaderProps) {
  const router = useRouter()
  const [language, setLanguage] = useState<"EN" | "CN">("EN")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "CN" : "EN"))
  }

  const handleLogin = () => {
    router.push("/client/login")
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")

    // Clear authentication cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Redirect to login
    router.push("/client/login")
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

  return (
    <header className="h-16 bg-sage-50 border-b border-sage-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        {showMenuButton && onMenuClick ? (
          <Button
            variant="ghost"
            onClick={onMenuClick}
            className="flex items-center gap-2 p-2 h-auto"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium text-sage-700 tracking-wide">{text[language].menu}</span>
          </Button>
        ) : (
          <button className="flex items-center gap-2 p-2">
            <span className="sr-only">菜单</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium text-sage-700 tracking-wide">MENU</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-wider text-sage-800">
            YUNDA
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="text-sm font-medium text-sage-700"
        >
          {language} / {language === "EN" ? "CN" : "EN"}
        </button>
        
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-sage-700"
          >
            {text[language].logOut}
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            className="text-sm font-medium text-sage-700"
          >
            {text[language].logIn}
          </button>
        )}
      </div>
    </header>
  )
}
