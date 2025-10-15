"use client"

import { useState, useEffect } from "react"
// import {getSurrogatesApplications } from '@/lib/graphql/applications'
import { useTranslation } from "react-i18next"
// import { AdminLayout } from "../../../components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { CustomButton } from "../../../components/ui/CustomButton"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
// import type { Application, ApplicationStatus } from '@/types/applications'
// import { getSurrogatesApplications } from '@/lib/graphql/applications'
import {getSurrogatesApplications, getParentsApplications } from '@/lib/graphql/applications'
export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation("common")
  // 只认 admin cookie，不依赖 useAuth 的 client session
  function getCookie(name: string) {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : undefined;
  }
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)

  // 真实案例数据
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  // 申请表统计
  const [surrogateApplications, setSurrogateApplications] = useState<any[]>([])
  const [parentApplications, setParentApplications] = useState<any[]>([])
  // GC/IP 总数
  const [gcTotal, setGcTotal] = useState(0)
  const [ipTotal, setIpTotal] = useState(0)

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      setUser(authed ? { id: userId, email: userEmail, role: userRole } : null)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router])

  // 获取真实案例数据
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true)
      Promise.all([
        fetch("/api/cases-list").then(r => r.json()),
       getSurrogatesApplications(10000, 0),
        getParentsApplications(10000, 0)
      ]).then(([casesData, surrogates, parents]) => {
        setCases(Array.isArray(casesData) ? casesData : casesData.data || [])
        setSurrogateApplications(surrogates || [])
        setParentApplications(parents || [])
        setGcTotal(surrogates.length)
        setIpTotal(parents.length)
      }).finally(() => setLoading(false))
    }
  }, [isAuthenticated])

  // 首屏只渲染 loading，等 cookie 认证完成后再渲染内容
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  // 阶段统计
  const stageMap: Record<string, string> = {
    Matching: t("matching"),
    LegalStage: t("legalStage"),
    CyclePrep: t("cyclePrep"),
    Pregnant: t("pregnancy"),
    Transferred: t("transferred"),
  }
  // 统计各阶段数量
  const stageCounts: Record<string, number> = {}
  cases.forEach(c => {
    const status = c.process_status || "Unknown"
    stageCounts[status] = (stageCounts[status] || 0) + 1
  })
  // 构造阶段分布数据
  const stageData = Object.entries(stageCounts).map(([key, value]) => ({
    name: stageMap[key as keyof typeof stageMap] || key,
    value,
    count: `(${value})`,
  }))
  // 总案例数
  const totalCases = cases.length

  // 代孕母申请表统计
  const surrogateStats = {
    total: surrogateApplications.length,
    approved: surrogateApplications.filter((a: any) => a.status === 'approved').length,
    rejected: surrogateApplications.filter((a: any) => a.status === 'rejected').length,
    pending: surrogateApplications.filter((a: any) => a.status === 'pending').length,
  }
  // 准父母申请表统计
  const parentStats = {
    total: parentApplications.length,
    approved: parentApplications.filter((a: any) => a.status === 'approved').length,
    rejected: parentApplications.filter((a: any) => a.status === 'rejected').length,
    pending: parentApplications.filter((a: any) => a.status === 'pending').length,
  }

  // 客户经理活跃案例统计
  const managerCases: Record<string, number> = {}
  cases.forEach(c => {
    const manager = c.client_manager?.email || c.client_manager?.id || t("notAssigned")
    managerCases[manager] = (managerCases[manager] || 0) + 1
  })
  const activeCases = Object.entries(managerCases).map(([manager, count]) => ({
    name: manager,
    count,
  }))

  const chartColors = ["#E8E2D5", "#D4C0A8", "#8B6F47", "#6B4F3A", "#A9907E"]

  return (
      <div className="space-y-6 p-8 bg-page-bg">
        <h1 className="text-3xl font-semibold text-sage-800 tracking-wider">{t("DASHBOARD")}</h1>

        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div
            className="cursor-pointer"
            onClick={() => router.push("/admin/parents-applications")}
          >
            <Card className="bg-card-bg border-none shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-sage-800">{t("ParentApplications")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sage-800">{parentStats.total}</div>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="text-green-700">{t('approved')}: {parentStats.approved}</span>
                  <span className="text-yellow-700">{t('pending')}: {parentStats.pending}</span>
                  <span className="text-red-700">{t('rejected')}: {parentStats.rejected}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push("/admin/surrogates-applications")}
          >
            <Card className="bg-card-bg border-none shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-sage-800">{t("SurrogateApplications")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sage-800">{surrogateStats.total}</div>
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="text-green-700">{t('approved')}: {surrogateStats.approved}</span>
                  <span className="text-yellow-700">{t('pending')}: {surrogateStats.pending}</span>
                  <span className="text-red-700">{t('rejected')}: {surrogateStats.rejected}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push("/admin/client-profiles")}
          >
            <Card className="bg-card-bg border-none shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-sage-800">{t("TotalIP")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sage-800">{ipTotal}</div>
              </CardContent>
            </Card>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push("/admin/surrogate-profiles")}
          >
            <Card className="bg-card-bg border-none shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-sage-800">{t("TotalGC")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sage-800">{gcTotal}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cases 状态分布图和总数 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card-bg border-none shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-sage-800">{t("totalActiveCases")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-6xl font-semibold text-sage-800 cursor-pointer"
                onClick={() => router.push("/admin/all-cases")}
                title={t('viewAllCases')}
              >
                {loading ? "..." : totalCases}
              </div>
            </CardContent>
          </Card>

          {/* Stage Distribution Chart 可点击 */}
          <Card
            className="bg-card-bg border-none shadow-lg rounded-xl cursor-pointer"
            onClick={() => router.push("/admin/all-cases")}
            title={t('viewAllCases')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-sage-800">{t("stageDistribution")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-8 w-full bg-brand-yellow rounded-full flex overflow-hidden mb-2">
                {stageData.map((entry, index) => (
                  <div
                    key={`bar-${index}`}
                    style={{
                      width: `${totalCases > 0 ? (entry.value / totalCases) * 100 : 0}%`,
                      backgroundColor: chartColors[index % chartColors.length],
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-start text-xs text-sage-800 gap-4 font-medium">
                {stageData.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <span
                      className="w-3 h-3 inline-block mr-2 rounded-sm"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    ></span>
                    <span>
                      {item.name}
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 客户经理活跃案例统计 */}
        <Card className="bg-card-bg border-none shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-sage-800">{t("activeCasesByManager")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 pb-3 border-b border-brand-brown-light">
                <div className="text-sm font-medium text-sage-800">{t("name")}</div>
                <div className="text-sm font-medium text-sage-800">{t("caseNumber")}</div>
                <div></div>
              </div>
              {/* Table Rows */}
              {activeCases.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center py-4 border-b border-brand-brown-light last:border-b-0"
                >
                  <div
                    className="text-base font-medium text-sage-800 cursor-pointer"
                    onClick={() => {
                      if (item.name && item.name !== t('notAssigned')) {
                        router.push("/admin/client-manager")
                      } else {
                        router.push("/admin/all-cases")
                      }
                    }}
                    title={t('viewDetails')}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-base font-medium text-sage-800 cursor-pointer"
                    onClick={() => router.push("/admin/all-cases")}
                    title={t('viewAllCases')}
                  >
                    {item.count}
                  </div>
                  <div className="flex justify-end">
                    <CustomButton
                      className="bg-transparent text-brand-brown border border-brand-brown-light hover:bg-[#E8E2D5] hover:text-brand-brown text-xs px-4 py-2 rounded-md font-medium cursor-pointer transition-colors duration-200"
                      style={{ textDecoration: 'none' }}
                      onClick={() => router.push("/admin/client-manager")}
                    >
                      {t("viewDetails")}
                    </CustomButton>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}