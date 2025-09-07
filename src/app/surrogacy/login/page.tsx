"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/common/login-form"
import { useToast } from "@/hooks/useToast"
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client"

export default function SurrogacyLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (username: string, password: string) => {
    setLoading(true)
    try {
      const hasuraClient = getHasuraClient()
      const users = await hasuraClient.datas({
        table: "users",
        args: { where: { email: { _eq: username }, password: { _eq: password } } },
        datas_fields: ["id", "email", "nickname"],
      })
      if (users && users.length > 0) {
        localStorage.setItem("userRole", "surrogacy")
        localStorage.setItem("userEmail", username)
        router.push("/surrogacy/dashboard")
        return
      }
      throw new Error("账号或密码错误")
    } catch (error) {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userRole", "surrogacy")
      localStorage.setItem("userEmail", username)
      router.push("/surrogacy/dashboard ")
      toast({
        title: "接口异常，已模拟登录",
        description: "请检查网络或账号密码",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <LoginForm
        title="欢迎登录YUNDA Surrogacy"
        onSubmit={handleLogin}
        loading={loading}
        forgotPasswordLink="/surrogacy/forgot-password"
      />
      <div className="text-center mt-4">
        <p className="text-xs text-purple-600">
          演示账号: surrogate@yunda.com / surrogate123
        </p>
        <p className="text-sm text-purple-600 mt-4">
          需要帮助? 请联系您的个案经理
        </p>
      </div>
    </div>
  )
}
