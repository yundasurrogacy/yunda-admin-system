"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"

export default function DocumentsPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")
  const [activeTab, setActiveTab] = useState<"client" | "surrogate">("client")
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = ["All", "Legal Documents", "Medical Records", "Identification", "Photos"]

  const documents = [
    {
      name: "Passport",
      type: "Identification",
      status: "Review Needed",
      uploadedBy: "John Doe",
      clientName: "John Doe",
    },
    {
      name: "Agreement",
      type: "Legal Document",
      status: "Awaiting Clients",
      uploadedBy: "John Doe",
      clientName: "John Doe",
    },
    { name: "Medical Records", type: "Medical", status: "Viewed", uploadedBy: "John Doe", clientName: "John Doe" },
    {
      name: "Passport",
      type: "Identification",
      status: "Review Needed",
      uploadedBy: "John Doe",
      clientName: "John Doe",
    },
    {
      name: "Passport",
      type: "Identification",
      status: "Review Needed",
      uploadedBy: "John Doe",
      clientName: "John Doe",
    },
    {
      name: "Passport",
      type: "Identification",
      status: "Review Needed",
      uploadedBy: "John Doe",
      clientName: "John Doe",
    },
    {
      name: "Passport",
      type: "Identification",
      status: "Review Needed",
      uploadedBy: "John Doe",
      clientName: "John Doe",
    },
  ]

  const text = {
    en: {
      title: "Documents",
      search: "Search",
      client: "Client",
      surrogate: "Surrogate",
      addDocument: "Add Document",
      name: "Name",
      type: "Type",
      status: "Status",
      uploadedBy: "Uploaded By",
      clientName: "Client Name",
    },
    cn: {
      title: "文档",
      search: "搜索",
      client: "客户",
      surrogate: "代孕者",
      addDocument: "添加文档",
      name: "名称",
      type: "类型",
      status: "状态",
      uploadedBy: "上传者",
      clientName: "客户姓名",
    },
  }

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={text[language].title} 
          showSearch
          rightContent={
            <Button
              onClick={() => {}}
              className="flex items-center gap-2 bg-sage-200 text-sage-800 hover:bg-sage-250"
            >
              <Plus className="w-4 h-4" />
              {text[language].addDocument}
            </Button>
          }
        />

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("client")}
            className={`px-6 py-2 rounded-full border transition-all duration-200 ${
              activeTab === "client"
                ? "bg-sage-200 border-sage-300 text-sage-800"
                : "bg-white border-sage-200 text-sage-600 hover:bg-sage-50"
            }`}
          >
            {text[language].client}
          </button>
          <button
            onClick={() => setActiveTab("surrogate")}
            className={`ml-4 px-6 py-2 rounded-full border transition-all duration-200 ${
              activeTab === "surrogate"
                ? "bg-sage-200 border-sage-300 text-sage-800"
                : "bg-white border-sage-200 text-sage-600 hover:bg-sage-50"
            }`}
          >
            {text[language].surrogate}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                activeFilter === filter ? "bg-sage-200 text-sage-800" : "bg-sage-100 text-sage-600 hover:bg-sage-150"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg border border-sage-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{text[language].name}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{text[language].type}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{text[language].status}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{text[language].uploadedBy}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{text[language].clientName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {documents.map((doc, index) => (
                  <tr key={index} className="hover:bg-sage-25 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-sage-800">{doc.name}</td>
                    <td className="px-6 py-4 text-sm text-sage-600">{doc.type}</td>
                    <td className="px-6 py-4 text-sm text-sage-600">{doc.status}</td>
                    <td className="px-6 py-4 text-sm text-sage-600">{doc.uploadedBy}</td>
                    <td className="px-6 py-4 text-sm text-sage-600">{doc.clientName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContent>
    </AdminLayout>
  )
}
