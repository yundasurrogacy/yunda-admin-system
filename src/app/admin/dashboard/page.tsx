"use client"

import { useState } from "react"
import { AdminLayout } from "../../../components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

export default function DashboardPage() {
  const [language, setLanguage] = useState<"EN" | "CN">("EN")

  const text = {
    EN: {
      dashboard: "DASHBOARD",
      totalActiveCases: "Total Active Cases",
      stageDistribution: "Stage Distribution",
      activeCasesByManager: "Active Cases By Customer Manager",
      systemAlerts: "System Alerts",
      name: "Name",
      caseNumber: "Case Number",
      viewDetails: "View Details",
      matching: "Matching",
      legalStage: "Legal Stage",
      pregnancy: "Pregnancy",
      noUpdatesAlert: "John Doe has no updates for over 3 Days",
    },
    CN: {
      dashboard: "仪表板",
      totalActiveCases: "活跃案例总数",
      stageDistribution: "阶段分布",
      activeCasesByManager: "客户经理活跃案例",
      systemAlerts: "系统警报",
      name: "姓名",
      caseNumber: "案例编号",
      viewDetails: "查看详情",
      matching: "匹配中",
      legalStage: "法律阶段",
      pregnancy: "怀孕期",
      noUpdatesAlert: "John Doe 超过3天没有更新",
    },
  }

  const stageData = [
    { name: text[language].matching, value: 10, count: "(10)" },
    { name: text[language].legalStage, value: 8, count: "(8)" },
    { name: text[language].pregnancy, value: 10, count: "(10)" },
  ]

  // Sample data for active cases
  const activeCases = [
    { name: "John Doe", caseNumber: 3 },
    { name: "Mary Hill", caseNumber: 8 },
    { name: "Siren Far", caseNumber: 3 },
  ]

  const chartColors = ["#e8e2d5", "#c4a484", "#8b6f47"]

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-2xl font-normal tracking-wide text-sage-800 mb-8">{text[language].dashboard}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Total Active Cases Card */}
          <Card className="bg-white border-sage-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-normal text-sage-700">{text[language].totalActiveCases}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-light text-sage-800">28</div>
            </CardContent>
          </Card>

          {/* Stage Distribution Chart */}
          <Card className="bg-white border-sage-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-normal text-sage-700">{text[language].stageDistribution}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <XAxis hide />
                    <YAxis hide />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={60}>
                      {stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between text-xs text-sage-600">
                {stageData.map((item, index) => (
                  <div key={item.name} className="text-center">
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

        <Card className="bg-white border-sage-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-normal text-sage-700">{text[language].activeCasesByManager}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 pb-3 border-b border-sage-200">
                <div className="text-sm font-medium text-sage-700">{text[language].name}</div>
                <div className="text-sm font-medium text-sage-700">{text[language].caseNumber}</div>
                <div></div>
              </div>

              {/* Table Rows */}
              {activeCases.map((caseItem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center py-3 border-b border-sage-100 last:border-b-0"
                >
                  <div className="text-sm text-sage-800">{caseItem.name}</div>
                  <div className="text-sm text-sage-800">{caseItem.caseNumber}</div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-sage-100 text-sage-700 hover:bg-sage-200 border-sage-300 text-xs px-3 py-1 h-7"
                    >
                      {text[language].viewDetails}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-sage-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-normal text-sage-700">{text[language].systemAlerts}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">{text[language].noUpdatesAlert}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
