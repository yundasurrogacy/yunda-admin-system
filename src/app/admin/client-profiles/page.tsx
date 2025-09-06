"use client"

import { useState } from "react"
import { Search, Filter, User, MapPin, Phone, Mail, Plus } from "lucide-react"
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClientProfilesPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")

  const text = {
    en: {
      title: "Client Profiles",
      searchPlaceholder: "Search clients...",
      addNew: "Add New Client",
      filterBy: "Filter by",
      status: "Status",
      service: "Service Type",
      location: "Location",
      active: "Active",
      onHold: "On Hold",
      completed: "Completed",
      surrogacy: "Surrogacy",
      eggDonation: "Egg Donation",
      both: "Both Services",
      viewProfile: "View Profile",
      contact: "Contact",
      lastUpdate: "Last Update",
      caseStatus: "Case Status",
    },
    cn: {
      title: "客户资料",
      searchPlaceholder: "搜索客户...",
      addNew: "添加新客户",
      filterBy: "筛选",
      status: "状态",
      service: "服务类型",
      location: "地区",
      active: "进行中",
      onHold: "暂停",
      completed: "已完成",
      surrogacy: "代孕",
      eggDonation: "捐卵",
      both: "双重服务",
      viewProfile: "查看资料",
      contact: "联系方式",
      lastUpdate: "最后更新",
      caseStatus: "案例状态",
    }
  }

  const clients = [
    {
      id: "CLI-001",
      name: "John & Sarah Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      service: "surrogacy",
      status: "active",
      lastUpdate: "2 hours ago",
      photo: "/avatars/client1.jpg"
    },
    {
      id: "CLI-002",
      name: "Emma Johnson",
      email: "emma.j@email.com",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, USA",
      service: "eggDonation",
      status: "onHold",
      lastUpdate: "1 day ago",
      photo: "/avatars/client2.jpg"
    },
    {
      id: "CLI-003",
      name: "Michael & Lisa Chen",
      email: "chen.family@email.com",
      phone: "+1 (555) 345-6789",
      location: "San Francisco, USA",
      service: "both",
      status: "active",
      lastUpdate: "3 days ago",
      photo: "/avatars/client3.jpg"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "onHold":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-sage-100 text-sage-800"
    }
  }

  const getServiceColor = (service: string) => {
    switch (service) {
      case "surrogacy":
        return "bg-purple-100 text-purple-800"
      case "eggDonation":
        return "bg-pink-100 text-pink-800"
      case "both":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-sage-100 text-sage-800"
    }
  }

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={text[language].title}
          rightContent={
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {}}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250"
              >
                <Plus className="w-4 h-4 mr-2" />
                {text[language].addNew}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Filter className="w-4 h-4 mr-2" />
                    {text[language].filterBy}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    {text[language].status}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].service}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].location}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
        />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-5 h-5" />
          <Input 
            type="text"
            placeholder={text[language].searchPlaceholder}
            className="pl-10 bg-white"
          />
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg border border-sage-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-sage-800 font-medium">{client.name}</h3>
                    <span className="text-sm text-sage-500">{client.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(client.status)}`}>
                    {text[language][client.status as keyof typeof text.en]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getServiceColor(client.service)}`}>
                    {text[language][client.service as keyof typeof text.en]}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-sage-600">
                  <Mail className="w-4 h-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-sage-600">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-sage-600">
                  <MapPin className="w-4 h-4" />
                  <span>{client.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
                <span className="text-sm text-sage-500">
                  {text[language].lastUpdate}: {client.lastUpdate}
                </span>
                <Button variant="link" className="text-sage-600 hover:text-sage-800">
                  {text[language].viewProfile}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PageContent>
    </AdminLayout>
  )
}
