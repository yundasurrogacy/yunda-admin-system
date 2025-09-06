"use client"

import { useState } from "react"
import { ChevronRight, User, MessageSquare, FileText, Calendar } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { AdminLayout } from "../../../../components/admin-layout"

export default function SurrogateProfileDetailPage() {
  const [language, setLanguage] = useState<"EN" | "CN">("EN")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    medicalRecord: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const text = {
    EN: {
      title: "Surrogate Profile",
      basicInfo: "Basic Information",
      matchingStatus: "Matching Status",
      messages: "Messages",
      journalUpdates: "Journal Updates",
      medicalRecord: "Medical Record",
      name: "Name",
      phone: "Phone",
      email: "Email",
      language: "Language",
      maritalStatus: "Marital Status",
      birthHistory: "Birth History",
      healthCondition: "Health Condition",
      address: "Address",
      matched: "Matched",
      married: "Married",
      kids: "3 Kids",
      underMedicalTreatment: "Under Medical Treatment",
      springfieldAddress: "123 Main Street, Springfield, IL, USA",
      johnAndSarah: "John & Sarah",
      unreadMessages: "You have 2 unread message",
      may12: "May 12",
      addedPhoto: "Added Photo",
      viewAll: "View All",
      passport: "Passport",
      agreement: "Agreement",
      authorization: "Authorization",
      preBirthOrder: "Pre-Birth Order",
      complete: "Complete",
      pending: "Pending",
    },
    CN: {
      title: "代孕者档案",
      basicInfo: "基本信息",
      matchingStatus: "匹配状态",
      messages: "消息",
      journalUpdates: "日志更新",
      medicalRecord: "医疗记录",
      name: "姓名",
      phone: "电话",
      email: "邮箱",
      language: "语言",
      maritalStatus: "婚姻状况",
      birthHistory: "生育史",
      healthCondition: "健康状况",
      address: "地址",
      matched: "已匹配",
      married: "已婚",
      kids: "3个孩子",
      underMedicalTreatment: "医疗治疗中",
      springfieldAddress: "美国伊利诺伊州斯普林菲尔德主街123号",
      johnAndSarah: "约翰和莎拉",
      unreadMessages: "您有2条未读消息",
      may12: "5月12日",
      addedPhoto: "添加了照片",
      viewAll: "查看全部",
      passport: "护照",
      agreement: "协议",
      authorization: "授权",
      preBirthOrder: "出生前令",
      complete: "完成",
      pending: "待处理",
    },
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-light text-sage-800 tracking-wide">{text[language].title}</h1>

        {/* Basic Information */}
        <Card className="bg-white border-sage-200 animate-slide-in-up">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{text[language].basicInfo}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-sage-600" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].name}:</Label>
                    <p className="font-medium text-sage-800">John Doe</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].maritalStatus}:</Label>
                    <p className="font-medium text-sage-800">{text[language].married}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].phone}:</Label>
                    <p className="font-medium text-sage-800">(123) 456-7890</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].birthHistory}:</Label>
                    <p className="font-medium text-sage-800">{text[language].kids}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].email}:</Label>
                    <p className="font-medium text-sage-800">john@email.com</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].healthCondition}:</Label>
                    <p className="font-medium text-sage-800">{text[language].underMedicalTreatment}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].language}:</Label>
                    <p className="font-medium text-sage-800">English</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{text[language].address}:</Label>
                    <p className="font-medium text-sage-800">{text[language].springfieldAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matching Status */}
          <Card className="bg-white border-sage-200 animate-slide-in-left">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">{text[language].matchingStatus}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sage-800">{text[language].johnAndSarah}</span>
                <Badge className="bg-sage-200 text-sage-800 hover:bg-sage-200">{text[language].matched}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].passport}</span>
                  </div>
                  <Badge className="bg-sage-200 text-sage-800 hover:bg-sage-200">{text[language].complete}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].agreement}</span>
                  </div>
                  <Badge className="bg-sage-200 text-sage-800 hover:bg-sage-200">{text[language].complete}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].authorization}</span>
                  </div>
                  <Badge className="bg-sage-200 text-sage-800 hover:bg-sage-200">{text[language].complete}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].preBirthOrder}</span>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                    {text[language].pending}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages and Journal Updates */}
          <div className="space-y-6">
            <Card className="bg-white border-sage-200 animate-slide-in-right">
              <CardHeader className="pb-4">
                <CardTitle className="text-sage-800 text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {text[language].messages}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sage-800">{text[language].unreadMessages}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50"
                  >
                    {text[language].viewAll}
                  </Button>
                </div>
                <p className="text-sm text-sage-600 mt-2">{text[language].may12}</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-sage-200 animate-slide-in-right" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-sage-800 text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {text[language].journalUpdates}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sage-800">{text[language].addedPhoto}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50"
                  >
                    {text[language].viewAll}
                  </Button>
                </div>
                <p className="text-sm text-sage-600 mt-2">{text[language].may12}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical Record */}
        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-4">
            <CardTitle
              className="text-sage-800 text-lg font-medium flex items-center justify-between cursor-pointer hover:text-sage-600 transition-colors"
              onClick={() => toggleSection("medicalRecord")}
            >
              {text[language].medicalRecord}
              <ChevronRight className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </AdminLayout>
  )
}
