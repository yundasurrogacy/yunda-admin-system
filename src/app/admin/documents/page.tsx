"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Search, Plus } from "lucide-react"
// import { AdminLayout } from "../../../components/admin-layout"
// import ManagerLayout from '@/components/manager-layout';
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"

export default function DocumentsPage() {
  const { t } = useTranslation('common')
  const [activeTab, setActiveTab] = useState<"client" | "surrogate">("client")
  const [activeFilter, setActiveFilter] = useState("All")
  const [documents, setDocuments] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState("")

  // 新的过滤器分类
  const filters = ["All", "EmbryoDocs", "SurrogateInfo", "LegalDocs", "Other"]
  
  // 获取过滤器翻译文本
  const getFilterText = (filter: string) => {
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
  }

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

  // 获取接口数据并整理文档
  React.useEffect(() => {
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
  }, [])


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
            onClick={() => setActiveTab("client")}
            className={`px-6 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
              activeTab === "client"
                ? "bg-sage-200 border-sage-300 text-sage-800"
                : "bg-white border-sage-200 text-sage-600 hover:bg-sage-50"
            }`}
          >
            {t("documents.client", "Client")}
          </button>
          <button
            onClick={() => setActiveTab("surrogate")}
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
              onClick={() => setActiveFilter(filter)}
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t("documents.table.journey", "Journey")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {documents
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
                  .map((doc, index) => (
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
                      <td className="px-6 py-4 text-sm text-sage-600">{doc.journey_journeys}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContent>
  )
}
