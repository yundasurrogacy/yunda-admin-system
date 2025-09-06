"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import Link from "next/link"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function ClientManagerLoginPage() {
  const [language, setLanguage] = useState<"EN" | "CN">("EN")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "CN" : "EN"))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Client Manager login attempt:", { email, password })
  }

  const text = {
    EN: {
      title: "CLIENT MANAGER",
      subtitle: "Log in using your email address",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      forgotPassword: "FORGOT PASSWORD?",
      loginButton: "LOG IN",
      logIn: "LOG IN",
    },
    CN: {
      title: "客户经理",
      subtitle: "使用您的邮箱地址登录",
      emailLabel: "邮箱地址",
      passwordLabel: "密码",
      forgotPassword: "忘记密码？",
      loginButton: "登录",
      logIn: "登录",
    },
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-wider">YUNDA</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              {text[language].logIn}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-sm font-medium">
              {language} / {language === "EN" ? "CN" : "EN"}
            </Button>
          </div>
        </header>

        {/* Login Form Content */}
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="w-full max-w-md space-y-8">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-wider text-foreground italic">{text[language].title}</h1>
            </div>

            {/* Login Form */}
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <p className="text-foreground font-light italic text-lg">{text[language].subtitle}</p>
                </div>

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
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium tracking-wide"
                  >
                    {text[language].loginButton}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
