"use client"

import { useState } from "react"
import { User, FileText } from "lucide-react"
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"

export default function MedicalRecordsPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")

  const text = {
    en: {
      title: "Medical Records",
      basicInfo: "Basic Information",
      name: "Name:",
      phone: "Phone:",
      email: "Email:",
      language: "Language:",
      maritalStatus: "Marital Status:",
      birthHistory: "Birth History:",
      healthCondition: "Health Condition:",
      address: "Address:",
      matchingStatus: "Matching Status",
      messages: "Messages",
      journalUpdates: "Journal Updates",
      passport: "Passport",
      agreement: "Agreement",
      authorization: "Authorization",
      preBirthOrder: "Pre-Birth Order",
      uploaded: "Uploaded",
      unreadMessage: "You have 2 unread message",
      addedPhoto: "Added Photo",
      viewAll: "View All",
    },
    cn: {
      title: "医疗记录",
      basicInfo: "基本信息",
      name: "姓名：",
      phone: "电话：",
      email: "邮箱：",
      language: "语言：",
      maritalStatus: "婚姻状况：",
      birthHistory: "生育史：",
      healthCondition: "健康状况：",
      address: "地址：",
      matchingStatus: "匹配状态",
      messages: "消息",
      journalUpdates: "日志更新",
      passport: "护照",
      agreement: "协议",
      authorization: "授权",
      preBirthOrder: "出生前订单",
      uploaded: "已上传",
      unreadMessage: "您有2条未读消息",
      addedPhoto: "添加照片",
      viewAll: "查看全部",
    },
  }

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={text[language].title}
          rightContent={
            <Button
              onClick={() => {}}
              className="bg-sage-200 text-sage-800 hover:bg-sage-250"
            >
              {text[language].viewAll}
            </Button>
          }
        />

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-sage-200 p-6">
          <h2 className="text-lg font-medium text-sage-800 mb-4">{text[language].basicInfo}</h2>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-sage-400" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-sage-600">{text[language].name}</span>
                <span className="ml-2 text-sage-800">John Doe</span>
              </div>
              <div>
                <span className="text-sm text-sage-600">{text[language].maritalStatus}</span>
                <span className="ml-2 text-sage-800">Married</span>
              </div>
              <div>
                <span className="text-sm text-sage-600">{text[language].phone}</span>
                <span className="ml-2 text-sage-800">(123) 456 - 7890</span>
              </div>
              <div>
                <span className="text-sm text-sage-600">{text[language].birthHistory}</span>
                <span className="ml-2 text-sage-800">2 Kids</span>
              </div>
              <div>
                <span className="text-sm text-sage-600">{text[language].email}</span>
                <span className="ml-2 text-sage-800">12345@gmail.com</span>
              </div>
              <div>
                <span className="text-sm text-sage-600">{text[language].healthCondition}</span>
                <span className="ml-2 text-sage-800">Under Medical Treatment</span>
              </div>
              <div>
                <span className="text-sm text-sage-600">{text[language].language}</span>
                <span className="ml-2 text-sage-800">English</span>
              </div>
              <div>
                <span className="text-sm text-sage-600">{text[language].address}</span>
                <span className="ml-2 text-sage-800">123 Main Street, Springfield, IL, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Matching Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 mb-4">{text[language].matchingStatus}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sage-800">John & Sarah</span>
              <span className="px-3 py-1 bg-sage-200 text-sage-800 rounded-full text-sm">Matched</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 mb-4">{text[language].matchingStatus}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sage-600" />
                <span className="text-sm text-sage-800">{text[language].passport}</span>
                <span className="px-2 py-1 bg-sage-200 text-sage-700 rounded text-xs">{text[language].uploaded}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sage-600" />
                <span className="text-sm text-sage-800">{text[language].agreement}</span>
                <span className="px-2 py-1 bg-sage-200 text-sage-700 rounded text-xs">{text[language].uploaded}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sage-600" />
                <span className="text-sm text-sage-800">{text[language].authorization}</span>
                <span className="px-2 py-1 bg-sage-200 text-sage-700 rounded text-xs">{text[language].uploaded}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sage-600" />
                <span className="text-sm text-sage-800">{text[language].preBirthOrder}</span>
                <span className="px-2 py-1 bg-sage-200 text-sage-700 rounded text-xs">{text[language].uploaded}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages and Journal Updates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 mb-4">{text[language].messages}</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-800">{text[language].unreadMessage}</p>
                <p className="text-sm text-sage-600">May 12</p>
              </div>
              <Button 
                variant="secondary"
                className="bg-sage-200 text-sage-800 hover:bg-sage-250"
              >
                View
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 mb-4">{text[language].journalUpdates}</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-800">{text[language].addedPhoto}</p>
                <p className="text-sm text-sage-600">May 12</p>
              </div>
              <Button 
                variant="secondary"
                className="bg-sage-200 text-sage-800 hover:bg-sage-250"
              >
                {text[language].viewAll}
              </Button>
            </div>
          </div>
        </div>
      </PageContent>
    </AdminLayout>
  )
}
