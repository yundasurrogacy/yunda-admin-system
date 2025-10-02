"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { AdminLayout } from "../../../components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation("common")

  // 真实案例数据
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 获取真实案例数据
  useEffect(() => {
    setLoading(true)
    fetch("/api/cases-list")
      .then(r => r.json())
      .then(data => setCases(Array.isArray(data) ? data : data.data || []))
      .finally(() => setLoading(false))
  }, [])

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
    <AdminLayout>
      <div className="space-y-6 p-8 bg-page-bg font-serif">
        <div>
          <h1 className="text-3xl font-bold text-brand-brown-dark tracking-wider">{t("DASHBOARD")}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Total Active Cases Card */}
          <Card className="bg-card-bg border-none shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-normal text-brand-brown-dark">{t("totalActiveCases")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-light text-brand-brown-dark">{loading ? "..." : totalCases}</div>
            </CardContent>
          </Card>

          {/* Stage Distribution Chart */}
          <Card className="bg-card-bg border-none shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-normal text-brand-brown-dark">{t("stageDistribution")}</CardTitle>
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

              <div className="flex justify-start text-xs text-brand-brown gap-4">
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

        {/* Active Cases By Customer Manager */}
        <Card className="bg-card-bg border-none shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-normal text-brand-brown-dark">{t("activeCasesByManager")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 pb-3 border-b border-brand-brown-light">
                <div className="text-sm font-medium text-brand-brown">{t("name")}</div>
                <div className="text-sm font-medium text-brand-brown">{t("caseNumber")}</div>
                <div></div>
              </div>
              {/* Table Rows */}
              {activeCases.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center py-4 border-b border-brand-brown-light last:border-b-0"
                >
                  <div className="text-base text-brand-brown-dark">{item.name}</div>
                  <div className="text-base text-brand-brown-dark">{item.count}</div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent text-brand-brown border-brand-brown-light hover:bg-brand-yellow hover:text-brand-brown-dark text-xs px-4 py-2 rounded-md"
                      onClick={() => router.push("/admin/client-manager")}
                    >
                      {t("viewDetails")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="bg-card-bg border-none shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-normal text-brand-brown-dark">{t("systemAlerts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-none bg-transparent p-0">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-brand-brown-dark mr-3" />
                <AlertDescription className="text-brand-brown-dark text-base">{t("noUpdatesAlert")}</AlertDescription>
              </div>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
