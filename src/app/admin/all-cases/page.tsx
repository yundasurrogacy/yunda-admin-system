"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface AllCaseData {
  id: string
  name: string
  type: "Client" | "Surrogate"
  stage: "Matching" | "Legal Stage" | "In Progress"
  status: "Pending" | "In Progress"
}

export default function AllCasesPage() {
  const [language, setLanguage] = useState<"EN" | "CN">("EN")

  const text = {
    EN: {
      allCases: "All Cases",
      overview: "Overview (Exportable)",
      name: "Name",
      type: "Type",
      stage: "Stage",
      status: "Status",
      viewDetails: "View Details",
      allCase: "All Case",
      client: "Client",
      surrogate: "Surrogate",
      matching: "Matching",
      legalStage: "Legal Stage",
      inProgress: "In Progress",
      pending: "Pending",
    },
    CN: {
      allCases: "所有案例",
      overview: "概览（可导出）",
      name: "姓名",
      type: "类型",
      stage: "阶段",
      status: "状态",
      viewDetails: "查看详情",
      allCase: "所有案例",
      client: "客户",
      surrogate: "代理人",
      matching: "匹配中",
      legalStage: "法律阶段",
      inProgress: "进行中",
      pending: "待处理",
    },
  }

  const sampleAllCases: AllCaseData[] = [
    { id: "1", name: "Michael Zhang", type: "Client", stage: "Matching", status: "Pending" },
    { id: "2", name: "Anna Smith", type: "Client", stage: "Legal Stage", status: "In Progress" },
    { id: "3", name: "Davina Brown", type: "Surrogate", stage: "Matching", status: "Pending" },
    { id: "4", name: "Michael Zhang", type: "Client", stage: "Matching", status: "Pending" },
    { id: "5", name: "Michael Zhang", type: "Client", stage: "Matching", status: "Pending" },
    { id: "6", name: "Anna Smith", type: "Client", stage: "Legal Stage", status: "In Progress" },
    { id: "7", name: "Davina Brown", type: "Surrogate", stage: "Matching", status: "Pending" },
    { id: "8", name: "Michael Zhang", type: "Client", stage: "Matching", status: "Pending" },
    { id: "9", name: "Michael Zhang", type: "Client", stage: "Matching", status: "Pending" },
    { id: "10", name: "Anna Smith", type: "Client", stage: "Legal Stage", status: "In Progress" },
    { id: "11", name: "Davina Brown", type: "Surrogate", stage: "Matching", status: "Pending" },
    { id: "12", name: "Michael Zhang", type: "Client", stage: "Matching", status: "Pending" },
    { id: "13", name: "Anna Smith", type: "Client", stage: "Legal Stage", status: "In Progress" },
  ]

  const getTypeColor = (type: string) => {
    return type === "Client"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200"
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Matching":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Legal Stage":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Pending"
      ? "bg-orange-100 text-orange-800 border-orange-200"
      : "bg-green-100 text-green-800 border-green-200"
  }

  const handleExport = () => {
    // Handle export functionality
    console.log("Exporting cases data...")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-light tracking-wider text-foreground">{text[language].allCases}</h1>
          <Button
            onClick={handleExport}
            variant="outline"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-border"
          >
            <Download className="mr-2 h-4 w-4" />
            {text[language].allCase}
          </Button>
        </div>

        {/* Cases Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
              {text[language].overview}
              <Badge variant="outline" className="bg-accent text-accent-foreground">
                {text[language].allCase}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 pb-3 border-b border-border">
                <div className="text-sm font-medium text-foreground">{text[language].name}</div>
                <div className="text-sm font-medium text-foreground">{text[language].type}</div>
                <div className="text-sm font-medium text-foreground">{text[language].stage}</div>
                <div className="text-sm font-medium text-foreground">{text[language].status}</div>
                <div></div>
              </div>

              {/* Table Rows */}
              <div className="space-y-3">
                {sampleAllCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="grid grid-cols-5 gap-4 items-center py-2 hover:bg-muted/50 rounded-md px-2 transition-colors"
                  >
                    <div className="text-sm text-foreground">{caseItem.name}</div>
                    <div>
                      <Badge variant="outline" className={getTypeColor(caseItem.type)}>
                        {text[language][caseItem.type.toLowerCase() as keyof (typeof text)[typeof language]]}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant="outline" className={getStageColor(caseItem.stage)}>
                        {caseItem.stage === "Legal Stage"
                          ? text[language].legalStage
                          : caseItem.stage === "In Progress"
                            ? text[language].inProgress
                            : text[language].matching}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant="outline" className={getStatusColor(caseItem.status)}>
                        {caseItem.status === "Pending" ? text[language].pending : text[language].inProgress}
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-border"
                      >
                        {text[language].viewDetails}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
