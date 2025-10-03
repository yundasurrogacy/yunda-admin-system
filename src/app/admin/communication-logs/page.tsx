"use client"

import { useState } from "react"
import { Phone, MessageCircle, Mail, Upload } from "lucide-react"
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"

export default function CommunicationLogsPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")

  const communications = [
    {
      type: "phone",
      title: "Phone call with client",
      status: "Important",
      description: "Reviewed recent updates and next steps",
      time: "9:30 AM",
    },
    {
      type: "wechat",
      title: "WeChat with surrogate",
      status: "Replied",
      description: "Reviewed recent updates and next steps",
      time: "10:30 AM",
    },
    {
      type: "email",
      title: "Email to client",
      status: "Follow Up Needed",
      description: "Reviewed recent updates and next steps",
      time: "9:30 AM",
    },
    {
      type: "email",
      title: "Email to client",
      status: "Follow Up Needed",
      description: "Reviewed recent updates and next steps",
      time: "9:30 AM",
    },
    {
      type: "email",
      title: "Email to client",
      status: "Follow Up Needed",
      description: "Reviewed recent updates and next steps",
      time: "9:30 AM",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="w-5 h-5 text-sage-600" />
      case "wechat":
        return <MessageCircle className="w-5 h-5 text-sage-600" />
      case "email":
        return <Mail className="w-5 h-5 text-sage-600" />
      default:
        return <Mail className="w-5 h-5 text-sage-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Important":
        return "bg-orange-100 text-orange-800"
      case "Replied":
        return "bg-green-100 text-green-800"
      case "Follow Up Needed":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-sage-100 text-sage-800"
    }
  }

  const text = {
    en: {
      title: "Communication Log",
      upload: "Upload",
    },
    cn: {
      title: "沟通日志",
      upload: "上传",
    },
  }

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader title={text[language].title} />

        <div className="bg-white rounded-lg border border-sage-200 p-6">
          <div className="space-y-6">
            {communications.map((comm, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                    {getIcon(comm.type)}
                  </div>
                  {index < communications.length - 1 && <div className="w-px h-12 bg-sage-200 mt-2"></div>}
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-sage-800">{comm.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                    </div>
                    <p className="text-sage-600 text-sm">{comm.description}</p>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-sm text-sage-600">{comm.time}</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-sage-100 text-sage-800 rounded-lg hover:bg-sage-200 transition-colors duration-200 text-sm">
                      <Upload className="w-4 h-4" />
                      {text[language].upload}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </AdminLayout>
  )
}
