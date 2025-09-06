"use client"

import { useState } from "react"
import { Search, Filter, User, Heart, Calendar, MapPin, Activity, Plus } from "lucide-react"
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

export default function SurrogateProfilesPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")
  const [view, setView] = useState<"grid" | "list">("grid")

  const text = {
    en: {
      title: "Surrogate Profiles",
      searchPlaceholder: "Search surrogates...",
      addNew: "Add New Surrogate",
      filterBy: "Filter by",
      status: "Status",
      age: "Age",
      location: "Location",
      experience: "Experience",
      available: "Available",
      matched: "Matched",
      inProgress: "In Progress",
      completed: "Completed",
      onHold: "On Hold",
      viewProfile: "View Profile",
      healthStatus: "Health Status",
      lastMedical: "Last Medical Check",
      previousBirths: "Previous Births",
      bmi: "BMI",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
    },
    cn: {
      title: "代孕者资料",
      searchPlaceholder: "搜索代孕者...",
      addNew: "添加新代孕者",
      filterBy: "筛选",
      status: "状态",
      age: "年龄",
      location: "地区",
      experience: "经验",
      available: "可匹配",
      matched: "已匹配",
      inProgress: "进行中",
      completed: "已完成",
      onHold: "暂停",
      viewProfile: "查看资料",
      healthStatus: "健康状况",
      lastMedical: "最近体检",
      previousBirths: "生育经历",
      bmi: "体重指数",
      excellent: "优秀",
      good: "良好",
      fair: "一般",
    }
  }

  const surrogates = [
    {
      id: "SUR-001",
      name: "Sarah Williams",
      age: 28,
      location: "California, USA",
      status: "available",
      experience: 1,
      healthStatus: "excellent",
      lastMedical: "2023-08-15",
      bmi: 22.5,
      previousBirths: 2,
      photo: "/avatars/surrogate1.jpg"
    },
    {
      id: "SUR-002",
      name: "Emily Davis",
      age: 32,
      location: "Texas, USA",
      status: "matched",
      experience: 2,
      healthStatus: "good",
      lastMedical: "2023-09-01",
      bmi: 23.1,
      previousBirths: 3,
      photo: "/avatars/surrogate2.jpg"
    },
    {
      id: "SUR-003",
      name: "Jessica Brown",
      age: 30,
      location: "Florida, USA",
      status: "inProgress",
      experience: 1,
      healthStatus: "excellent",
      lastMedical: "2023-08-20",
      bmi: 21.8,
      previousBirths: 2,
      photo: "/avatars/surrogate3.jpg"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "matched":
        return "bg-blue-100 text-blue-800"
      case "inProgress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-sage-100 text-sage-800"
      case "onHold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-sage-100 text-sage-800"
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
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
                    {text[language].age}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].location}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].experience}
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

        {/* Surrogate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surrogates.map((surrogate) => (
            <div key={surrogate.id} className="bg-white rounded-lg border border-sage-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-sage-800 font-medium">{surrogate.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-sage-500">{surrogate.id}</span>
                      <span className="text-sm text-sage-500">•</span>
                      <span className="text-sm text-sage-500">{surrogate.age} years</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(surrogate.status)}`}>
                  {text[language][surrogate.status as keyof typeof text.en]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-sage-500" />
                  <span className="text-sage-600">{surrogate.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-sage-500" />
                  <span className="text-sage-600">{surrogate.previousBirths} births</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-sage-500" />
                  <span className="text-sage-600">{surrogate.lastMedical}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-sage-500" />
                  <span className="text-sage-600">BMI: {surrogate.bmi}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
                <span className={`px-2 py-1 rounded-full text-xs ${getHealthStatusColor(surrogate.healthStatus)}`}>
                  {text[language][surrogate.healthStatus as keyof typeof text.en]}
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
