"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useSimpleToast } from "@/components/ui/simple-toast"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/enhanced-login-form"
import { apiClient } from "@/lib/api-client-auth"

type RoleType = "admin" | "client" | "manager" | "surrogacy"

const ROLES: { value: RoleType; labelKey: string }[] = [
  { value: "admin", labelKey: "loginRoleAdmin" },
  { value: "surrogacy", labelKey: "loginRoleSurrogacy" },
  { value: "manager", labelKey: "loginRoleManager" },
  { value: "client", labelKey: "loginRoleClient" },
]

const DASHBOARD_PATHS: Record<RoleType, string> = {
  admin: "/admin/dashboard",
  client: "/client/dashboard",
  manager: "/client-manager/dashboard",
  surrogacy: "/surrogacy/dashboard",
}

const SUCCESS_KEYS: Record<RoleType, string> = {
  admin: "adminLoginSuccess",
  client: "clientLoginSuccess",
  manager: "managerLoginSuccess",
  surrogacy: "surrogacyLoginSuccess",
}

/** 读取 cookie 值（仅客户端） */
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined")
    return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  if (!match)
    return undefined
  try {
    return decodeURIComponent(match[1].trim())
  }
  catch {
    return match[1].trim()
  }
}

/** 某一端是否具备完整登录态（与 middleware 一致，三者缺一不可） */
function hasFullSessionForRole(role: RoleType): boolean {
  const r = readCookie(`userRole_${role}`)
  const e = readCookie(`userEmail_${role}`)
  const id = readCookie(`userId_${role}`)
  return !!(r && e && id && r === role)
}

function UnifiedLoginContent() {
  const { t } = useTranslation("common")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(80)
  const { showToast: simpleToast } = useSimpleToast()

  const roleParam = searchParams.get("role") as RoleType | null
  const initialRole =
    roleParam && ROLES.some((r) => r.value === roleParam) ? roleParam : null

  const [selectedRole, setSelectedRole] = useState<RoleType | null>(
    initialRole ?? null,
  )

  const { login } = useAuth(selectedRole ?? "client")

  useEffect(() => {
    if (roleParam && ROLES.some((r) => r.value === roleParam)) {
      setSelectedRole(roleParam)
    }
  }, [roleParam])

  useEffect(() => {
    const updateHeaderHeight = () => {
      setHeaderHeight(window.innerWidth >= 768 ? 100 : 80)
    }
    updateHeaderHeight()
    window.addEventListener("resize", updateHeaderHeight)
    return () => window.removeEventListener("resize", updateHeaderHeight)
  }, [])

  // 仅当用户已明确选择某一端（含 URL ?role= 预选的端），且该端具备完整会话时才进后台；不在进入页时根据「任意端已登录」自动跳转
  useEffect(() => {
    if (typeof document === "undefined" || !selectedRole)
      return
    if (hasFullSessionForRole(selectedRole)) {
      router.replace(DASHBOARD_PATHS[selectedRole])
    }
  }, [router, selectedRole])

  const handleLogin = async (username: string, password: string) => {
    if (!selectedRole) return
    setLoading(true)
    try {
      let response: any
      switch (selectedRole) {
        case "admin":
          response = await apiClient.adminLogin({ username, password })
          break
        case "client":
          response = await apiClient.clientLogin({ username, password })
          break
        case "manager":
          response = await apiClient.managerLogin({ username, password })
          break
        case "surrogacy":
          response = await apiClient.surrogateLogin({ username, password })
          break
        default:
          simpleToast(t("unknownError"), "error")
          setLoading(false)
          return
      }

      if (!response.success) {
        simpleToast(t("userNameOrPasswordError"), "error")
        setLoading(false)
        return
      }

      let userData: { id: string; email: string; role: RoleType; name: string }
      const cookiePrefix = `userRole_${selectedRole}`

      switch (selectedRole) {
        case "admin":
          if (!response.data?.success || !response.data?.manager) {
            simpleToast(t("userNameOrPasswordError"), "error")
            setLoading(false)
            return
          }
          userData = {
            id: String(response.data.manager.id),
            email: username,
            role: "admin",
            name: response.data.manager.name || "",
          }
          break
        case "client":
          if (!response.data?.parent) {
            simpleToast(t("userNameOrPasswordError"), "error")
            setLoading(false)
            return
          }
          userData = {
            id: String(response.data.parent.id),
            email: username,
            role: "client",
            name: response.data.parent.name || "",
          }
          break
        case "manager":
          if (!response.data?.manager) {
            simpleToast(t("userNameOrPasswordError"), "error")
            setLoading(false)
            return
          }
          userData = {
            id: String(response.data.manager.id),
            email: username,
            role: "manager",
            name: response.data.manager.name || "",
          }
          break
        case "surrogacy":
          if (!response.data?.surrogate) {
            simpleToast(t("userNameOrPasswordError"), "error")
            setLoading(false)
            return
          }
          userData = {
            id: String(response.data.surrogate.id),
            email: username,
            role: "surrogacy",
            name: response.data.surrogate.name || "",
          }
          break
        default:
          simpleToast(t("unknownError"), "error")
          setLoading(false)
          return
      }

      login(userData as any)
      document.cookie = `${cookiePrefix}=${selectedRole}; path=/`
      document.cookie = `userEmail_${selectedRole}=${userData.email}; path=/`
      document.cookie = `userId_${selectedRole}=${userData.id}; path=/`

      router.replace(DASHBOARD_PATHS[selectedRole])
      setTimeout(() => {
        simpleToast(t(SUCCESS_KEYS[selectedRole]), "success")
      }, 100)
    }
    catch (error) {
      console.error("[UnifiedLogin] Login error:", error)
      simpleToast(t("unknownError"), "error")
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-[rgba(251,240,218,0.25)] px-4"
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
    >
      <div className="flex items-center justify-center w-full mt-8 mb-6">
        <h1 className="text-3xl md:text-5xl font-semibold text-sage-800 tracking-wide">
          {t("welcome")}
        </h1>
      </div>
      <div
        className="w-full max-w-[1080px] rounded-3xl shadow-xl bg-[rgba(251,240,218,0.2)] flex flex-col items-center justify-center p-8 md:p-12"
        style={{
          boxShadow:
            "0 32px 96px 0 rgba(191,201,191,0.28), 0 0 120px 24px rgba(251,240,218,0.38)",
        }}
      >
        <h2 className="text-lg md:text-xl font-medium mb-6 text-sage-800">
          {t("loginSelectRole")}
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {ROLES.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedRole(value)}
              style={{
                background:
                  selectedRole === value ? "#BFC9BF" : "rgba(234,233,208,0.8)",
                border:
                  selectedRole === value
                    ? "2px solid #8B9A8B"
                    : "2px solid transparent",
                borderRadius: 18,
                padding: "16px 28px",
                fontSize: 18,
                fontWeight: 600,
                color: "#4A5568",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              className="hover:opacity-90"
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {selectedRole && (
          <>
            <h3 className="text-base md:text-lg font-medium mb-4 text-sage-800">
              {t("loginSubtitle")}
            </h3>
            <div className="w-full max-w-[600px] mx-auto">
              <LoginForm onSubmit={handleLogin} loading={loading} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function UnifiedLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <UnifiedLoginContent />
    </Suspense>
  )
}
