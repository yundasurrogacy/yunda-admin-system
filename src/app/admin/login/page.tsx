"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent } from "../../../components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AdminLayout } from "../../../components/admin-layout"

export default function AdminLoginPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"EN" | "CN">("EN")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "CN" : "EN"))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo credentials validation
      if (email === "admin@yunda.com" && password === "admin123") {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userRole", "admin")
        localStorage.setItem("userEmail", email)

        // Set authentication cookie for middleware
        document.cookie = "auth-token=authenticated; path=/; max-age=86400; SameSite=Lax"

        // Redirect to dashboard
        router.push("/admin/dashboard")
      } else {
        setError(language === "EN" ? "Invalid email or password" : "邮箱或密码错误")
      }
    } catch {
      setError(language === "EN" ? "Login failed. Please try again." : "登录失败，请重试。")
    } finally {
      setIsLoading(false)
    }
  }

  const text = {
    EN: {
      title: "ADMIN",
      subtitle: "Log in using your email address",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      forgotPassword: "FORGOT PASSWORD?",
      loginButton: "LOG IN",
      menu: "MENU",
      logIn: "LOG IN",
      demoCredentials: "Demo: admin@yunda.com / admin123",
    },
    CN: {
      title: "管理员",
      subtitle: "使用您的邮箱地址登录",
      emailLabel: "邮箱地址",
      passwordLabel: "密码",
      forgotPassword: "忘记密码？",
      loginButton: "登录",
      menu: "菜单",
      logIn: "登录",
      demoCredentials: "演示账号: admin@yunda.com / admin123",
    },
  }

  return (
    <AdminLayout showHeader={true} isLoggedIn={false}>
      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-wider text-foreground italic">
              {text[language].title}
            </h1>
          </div>

          {/* Login Form */}
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-foreground font-light italic text-lg">
                  {text[language].subtitle}
                </p>
              </div>

              <div className="text-center p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">
                  {text[language].demoCredentials}
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    {text[language].emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border focus:ring-ring"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      {text[language].passwordLabel}
                    </Label>
                    <Link
                      href="/admin/forgot-password"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {text[language].forgotPassword}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border focus:ring-ring"
                    disabled={isLoading}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium tracking-wide disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === "EN" ? "Logging in..." : "登录中..."}
                    </>
                  ) : (
                    text[language].loginButton
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Language Toggle Button */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
            >
              {language === "EN" ? "切换到中文" : "Switch to English"}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
