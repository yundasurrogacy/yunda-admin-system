"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Search, Plus } from "lucide-react"
// import { AdminLayout } from "../../../components/admin-layout"
// import ManagerLayout from '@/components/manager-layout';
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取辅助函数到组件外部，避免每次渲染重新创建
// 类型映射函数
function mapDocType(type: string): string {
  switch (type) {
    case "Embryo":
    case "EmbryoDocs":
    case "Photos":
      return "EmbryoDocs"
    case "Surrogate":
    case "SurrogateInfo":
      return "SurrogateInfo"
    case "Legal Document":
    case "LegalDocs":
      return "LegalDocs"
    default:
      return "Other"
  }
}

export default function DocumentsPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  const [activeTab, setActiveTab] = useState<"client" | "surrogate">("client")
  const [activeFilter, setActiveFilter] = useState("All")
  const [documents, setDocuments] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState("")

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router])

  // 新的过滤器分类
  const filters = ["All", "EmbryoDocs", "SurrogateInfo", "LegalDocs", "Other"]
  
  // 使用 useCallback 缓存获取过滤器翻译文本函数
  const getFilterText = useCallback((filter: string) => {
    switch (filter) {
      case "All":
        return t("documents.filters.all", "All")
      case "EmbryoDocs":
        return t("documents.filters.embryoDocs", "Embryo Documents")
      case "SurrogateInfo":
        return t("documents.filters.surrogateInfo", "Surrogate Information")
      case "LegalDocs":
        return t("documents.filters.legalDocs", "Legal Documents")
      case "Other":
        return t("documents.filters.other", "Other")
      default:
        return filter
    }
  }, [t])

  // 获取接口数据并整理文档 - 只在认证后才加载
  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetch("/api/cases-list")
      .then(res => res.json())
      .then((cases) => {
        console.log(cases)
        let docs: any[] = []
        cases.forEach((c: any) => {
          // cases_files（无 about_role，归为 intended_parent）
          if (Array.isArray(c.cases_files)) {
            c.cases_files.forEach((f: any) => {
              docs.push({
                name: f.file_url ? f.file_url.split("/").pop() : (f.category || f.file_url),
                file_url: f.file_url,
                type: mapDocType(f.category),
                // status: "-",
                // uploadedBy: c.client_manager?.email || "-",
                // clientName: c.intended_parent?.basic_information || c.surrogate_mother?.contact_information || "-",
                about_role: f.about_role ,
                // about_role: "intended_parent",
                note: f.note || "",
                journey_journeys: f.journey_journeys || ""
              })
            })
          }
          // // journeys 下的 cases_files
          // if (Array.isArray(c.journeys)) {
          //   c.journeys.forEach((j: any) => {
          //     if (Array.isArray(j.cases_files)) {
          //       j.cases_files.forEach((f: any) => {
          //         docs.push({
          //           name: f.file_url ? f.file_url.split("/").pop() : (f.category || f.file_url),
          //           file_url: f.file_url,
          //           type: mapDocType(f.category),
          //           // status: j.process_status || "-",
          //           uploadedBy: c.client_manager?.email || "-",
          //           clientName: c.intended_parent?.basic_information || c.surrogate_mother?.contact_information || "-",
          //           about_role: j.about_role || "intended_parent",
          //           note: f.note || "",
          //           case_cases: j.case_cases || ""
          //         })
          //       })
          //     }
          //   })
          // }
        })
        setDocuments(docs)
      })
  }, [isAuthenticated])

  // 使用 useCallback 缓存事件处理函数
  const handleTabChange = useCallback((tab: "client" | "surrogate") => {
    setActiveTab(tab)
  }, [])

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter)
  }, [])

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存过滤后的文档列表
  const filteredDocuments = useMemo(() => {
    return documents
      .filter(doc =>
        doc.about_role === (activeTab === "client" ? "intended_parent" : "surrogate_mother") &&
        (activeFilter === "All" || doc.type === activeFilter)
      )
      .filter(doc => {
        if (!searchValue.trim()) return true
        const val = searchValue.trim().toLowerCase()
        return (
          (doc.name && doc.name.toLowerCase().includes(val)) ||
          (doc.type && doc.type.toLowerCase().includes(val)) ||
          (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(val)) ||
          (doc.clientName && doc.clientName.toLowerCase().includes(val)) ||
          (doc.note && doc.note.toLowerCase().includes(val))
        )
      })
  }, [documents, activeTab, activeFilter, searchValue])

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <PageContent>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </PageContent>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  return (
      <PageContent>
        <PageHeader 
          title={t("documents.title", "Documents")} 
          showSearch
          onSearch={setSearchValue}
          // rightContent={
          //   <Button
          //     onClick={() => {}}
          //     className="flex items-center gap-2 bg-sage-200 text-sage-800 hover:bg-sage-250"
          //   >
          //     <Plus className="w-4 h-4" />
          //     {t("documents.addDocument", "Add Document")}
          //   </Button>
          // }
        />

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => handleTabChange("client")}
            className={`px-6 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
              activeTab === "client"
                ? "bg-sage-200 border-sage-300 text-sage-800"
                : "bg-white border-sage-200 text-sage-600 hover:bg-sage-50"
            }`}
          >
            {t("documents.client", "Client")}
          </button>
          <button
            onClick={() => handleTabChange("surrogate")}
            className={`ml-4 px-6 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
              activeTab === "surrogate"
                ? "bg-sage-200 border-sage-300 text-sage-800"
                : "bg-white border-sage-200 text-sage-600 hover:bg-sage-50"
            }`}
          >
            {t("documents.surrogate", "Surrogate")}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer ${
                activeFilter === filter ? "bg-sage-200 text-sage-800" : "bg-sage-100 text-sage-600 hover:bg-sage-150"
              }`}
            >
              {getFilterText(filter)}
            </button>
          ))}
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg border border-sage-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.name", "Name")}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.type", "Type")}</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.status", "Status")}</th> */}
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.uploadedBy", "Uploaded By")}</th> */}
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.clientName", "Client Name")}</th> */}
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.note", "Note")}</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.journey", "Journey")}</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12">
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sage-400 mb-4">
                            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                          <p className="text-xl text-sage-600 font-medium mb-2">{t('documents.noDocuments', { defaultValue: '暂无文档' })}</p>
                          <p className="text-sm text-sage-400 mb-6">{t('documents.noDocumentsDesc', { defaultValue: '当前筛选条件下没有找到文档' })}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc, index) => (
                    <tr key={index} className="hover:bg-sage-25 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-sage-800">
                        {doc.file_url ? (
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sage-800 underline hover:text-sage-600 cursor-pointer">
                            {doc.name}
                          </a>
                        ) : doc.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-sage-600">{doc.type}</td>
                      {/* <td className="px-6 py-4 text-sm text-sage-600">{doc.status}</td> */}
                      {/* <td className="px-6 py-4 text-sm text-sage-600">{doc.uploadedBy}</td> */}
                      {/* <td className="px-6 py-4 text-sm text-sage-600">{doc.clientName}</td> */}
                      <td className="px-6 py-4 text-sm text-sage-600">{doc.note}</td>
                      {/* <td className="px-6 py-4 text-sm text-sage-600">{doc.journey_journeys}</td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageContent>
  )
}
