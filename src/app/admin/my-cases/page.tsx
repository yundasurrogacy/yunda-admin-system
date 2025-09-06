"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CaseData {
  id: string
  clientName: string
  center: string
  stage: "Matching" | "Legal Stage" | "Cycle Prep" | "Pregnant" | "Transferred"
  status: string
  statusPercentage: number
  review: string
  notice: string
  messages: Array<{
    sender: string
    time: string
    content: string
  }>
}

export default function MyCasesPage() {
  const [language, setLanguage] = useState<"EN" | "CN">("EN")

  const text = {
    EN: {
      myCases: "My Cases",
      matching: "Matching",
      legalStage: "Legal Stage",
      cyclePrep: "Cycle Prep",
      pregnant: "Pregnant",
      transferred: "Transferred",
      status: "STATUS:",
      review: "REVIEW:",
      notice: "NOTICE:",
      messages: "MESSAGES:",
      viewProfile: "View Profile",
      legal: "Legal",
      surrogacyAgreement: "Surrogacy agreement signed/preparing account",
      agreementUploadNeeded: "Agreement upload needed",
      draftPlease: "I have reviewed the draft. Please let me know if...",
      johnMessage: "John - 1 message",
      hoursAgo: "2 hours ago",
    },
    CN: {
      myCases: "我的案例",
      matching: "匹配中",
      legalStage: "法律阶段",
      cyclePrep: "周期准备",
      pregnant: "怀孕期",
      transferred: "已转移",
      status: "状态：",
      review: "审查：",
      notice: "通知：",
      messages: "消息：",
      viewProfile: "查看档案",
      legal: "法律",
      surrogacyAgreement: "代孕协议已签署/准备账户",
      agreementUploadNeeded: "需要上传协议",
      draftPlease: "我已审查草案。请告知是否...",
      johnMessage: "John - 1条消息",
      hoursAgo: "2小时前",
    },
  }

  const sampleCases: CaseData[] = [
    {
      id: "1",
      clientName: "John Doe",
      center: "Lincoln Surrogacy Center",
      stage: "Matching",
      status: "Legal",
      statusPercentage: 20,
      review: text[language].surrogacyAgreement,
      notice: text[language].agreementUploadNeeded,
      messages: [
        {
          sender: text[language].johnMessage,
          time: text[language].hoursAgo,
          content: text[language].draftPlease,
        },
      ],
    },
    {
      id: "2",
      clientName: "John Doe",
      center: "Lincoln Surrogacy Center",
      stage: "Pregnant",
      status: "Legal",
      statusPercentage: 20,
      review: text[language].surrogacyAgreement,
      notice: text[language].agreementUploadNeeded,
      messages: [
        {
          sender: text[language].johnMessage,
          time: text[language].hoursAgo,
          content: text[language].draftPlease,
        },
      ],
    },
    {
      id: "3",
      clientName: "John Doe",
      center: "Lincoln Surrogacy Center",
      stage: "Legal Stage",
      status: "Legal",
      statusPercentage: 20,
      review: text[language].surrogacyAgreement,
      notice: text[language].agreementUploadNeeded,
      messages: [
        {
          sender: text[language].johnMessage,
          time: text[language].hoursAgo,
          content: text[language].draftPlease,
        },
      ],
    },
    {
      id: "4",
      clientName: "John Doe",
      center: "Lincoln Surrogacy Center",
      stage: "Transferred",
      status: "Legal",
      statusPercentage: 20,
      review: text[language].surrogacyAgreement,
      notice: text[language].agreementUploadNeeded,
      messages: [
        {
          sender: text[language].johnMessage,
          time: text[language].hoursAgo,
          content: text[language].draftPlease,
        },
      ],
    },
  ]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Matching":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Legal Stage":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cycle Prep":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Pregnant":
        return "bg-green-100 text-green-800 border-green-200"
      case "Transferred":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const stages = [
    text[language].matching,
    text[language].legalStage,
    text[language].cyclePrep,
    text[language].pregnant,
    text[language].transferred,
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Title */}
        <div className="animate-slide-in-left">
          <h1 className="text-3xl font-light tracking-wider text-foreground">{text[language].myCases}</h1>
        </div>

        {/* Stage Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4 animate-slide-in-right">
          {stages.map((stage, index) => (
            <Badge
              key={stage}
              variant="outline"
              className={`px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-105 hover-glow focus-ring-enhanced animate-fade-in ${
                index === 0 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {stage}
            </Badge>
          ))}
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleCases.map((caseItem, index) => (
            <Card
              key={caseItem.id}
              className="bg-card border-border hover-lift animate-scale-in"
              style={{ animationDelay: `${200 + index * 150}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium text-foreground hover:text-accent transition-colors duration-200">
                      {caseItem.clientName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{caseItem.center}</p>
                  </div>
                  <Badge
                    className={`${getStageColor(caseItem.stage)} transition-all duration-200 hover:scale-105`}
                    variant="outline"
                  >
                    {
                      text[language][
                        caseItem.stage.toLowerCase().replace(" ", "") as keyof (typeof text)[typeof language]
                      ]
                    }
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{text[language].status}</span>
                    <span className="text-sm text-muted-foreground">{caseItem.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{caseItem.statusPercentage}%</span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out animate-bounce-subtle"
                        style={{ width: `${caseItem.statusPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Review */}
                <div>
                  <span className="text-sm font-medium text-foreground">{text[language].review}</span>
                  <p className="text-sm text-muted-foreground mt-1">{caseItem.review}</p>
                </div>

                {/* Notice */}
                <div>
                  <span className="text-sm font-medium text-foreground">{text[language].notice}</span>
                  <p className="text-sm text-muted-foreground mt-1">{caseItem.notice}</p>
                </div>

                {/* Messages */}
                <div>
                  <span className="text-sm font-medium text-foreground">{text[language].messages}</span>
                  <div className="mt-2 space-y-2">
                    {caseItem.messages.map((message, msgIndex) => (
                      <div
                        key={msgIndex}
                        className="bg-muted p-3 rounded-md hover-glow transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{message.sender}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-border hover-glow focus-ring-enhanced transition-all duration-200 hover:scale-105"
                  >
                    {text[language].viewProfile}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
