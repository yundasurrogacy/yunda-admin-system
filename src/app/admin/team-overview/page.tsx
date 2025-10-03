"use client"

import { useState } from "react"
import { User, Search, BarChart2 } from "lucide-react"
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TeamOverviewPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")

  const text = {
    en: {
      title: "Team Overview",
      searchPlaceholder: "Search team members...",
      addMember: "Add Member",
      teamStats: "Team Statistics",
      activeMembers: "Active Members",
      totalCases: "Total Cases",
      completedCases: "Completed Cases",
      role: "Role",
      status: "Status",
      casesHandled: "Cases Handled",
      lastActive: "Last Active",
    },
    cn: {
      title: "团队概览",
      searchPlaceholder: "搜索团队成员...",
      addMember: "添加成员",
      teamStats: "团队统计",
      activeMembers: "活跃成员",
      totalCases: "总案例数",
      completedCases: "已完成案例",
      role: "角色",
      status: "状态",
      casesHandled: "处理案例",
      lastActive: "最后活跃",
    }
  }

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Case Manager",
      status: "Active",
      casesHandled: 15,
      lastActive: "2h ago",
      avatar: "/avatars/sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "Medical Coordinator",
      status: "In Meeting",
      casesHandled: 12,
      lastActive: "5m ago",
      avatar: "/avatars/michael.jpg"
    },
    {
      name: "Emily Davis",
      role: "Legal Advisor",
      status: "Away",
      casesHandled: 8,
      lastActive: "1d ago",
      avatar: "/avatars/emily.jpg"
    }
  ]

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
              {text[language].addMember}
            </Button>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <p className="text-sage-600 text-sm">{text[language].activeMembers}</p>
                <p className="text-2xl font-semibold text-sage-800">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <p className="text-sage-600 text-sm">{text[language].totalCases}</p>
                <p className="text-2xl font-semibold text-sage-800">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <p className="text-sage-600 text-sm">{text[language].completedCases}</p>
                <p className="text-2xl font-semibold text-sage-800">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg border border-sage-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-sage-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">
                  {text[language].title}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">
                  {text[language].role}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">
                  {text[language].status}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">
                  {text[language].casesHandled}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">
                  {text[language].lastActive}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200">
              {teamMembers.map((member, index) => (
                <tr key={index} className="hover:bg-sage-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-sage-400" />
                      </div>
                      <span className="text-sage-800">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sage-600">{member.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${member.status === "Active" ? "bg-green-100 text-green-800" : 
                        member.status === "In Meeting" ? "bg-blue-100 text-blue-800" : 
                        "bg-yellow-100 text-yellow-800"}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sage-600">{member.casesHandled}</td>
                  <td className="px-6 py-4 text-sage-600">{member.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContent>
    </AdminLayout>
  )
}
