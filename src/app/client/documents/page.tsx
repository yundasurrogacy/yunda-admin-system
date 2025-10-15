"use client"

import React, { useState } from "react"
import { Search, Plus } from "lucide-react"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next'

export default function DocumentsPage() {
  const { t } = useTranslation('common');
  
  function getCookie(name: string) {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : undefined;
  }
  
  const parentId = typeof document !== 'undefined' ? getCookie('userId_client') : null;
  const [activeFilter, setActiveFilter] = useState("All")
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 新的过滤器分类
  const filters = [
    { key: "All", label: t('clientDocuments.filters.all', 'All') },
    { key: "EmbryoDocs", label: t('clientDocuments.filters.embryoDocs', 'Embryo Documents') },
    { key: "SurrogateInfo", label: t('clientDocuments.filters.surrogateInfo', 'Surrogate Information') },
    { key: "LegalDocs", label: t('clientDocuments.filters.legalDocs', 'Legal Documents') },
    { key: "Other", label: t('clientDocuments.filters.other', 'Other') }
  ]

  // 类型映射函数 - 返回原始类型用于过滤
  function mapDocType(type: string): { displayType: string; filterType: string } {
    switch (type) {
      case 'Embryo':
      case 'EmbryoDocs':
      case 'Photos':
        return { 
          displayType: t('clientDocuments.types.embryoDocs', 'Embryo Documents'),
          filterType: 'EmbryoDocs'
        }
      case 'Surrogate':
      case 'SurrogateInfo':
        return { 
          displayType: t('clientDocuments.types.surrogateInfo', 'Surrogate Information'),
          filterType: 'SurrogateInfo'
        }
      case 'Legal Document':
      case 'LegalDocs':
        return { 
          displayType: t('clientDocuments.types.legalDocs', 'Legal Documents'),
          filterType: 'LegalDocs'
        }
      default:
        return { 
          displayType: t('clientDocuments.types.other', 'Other'),
          filterType: 'Other'
        }
    }
  }

  // Memoize filtered documents for better performance
  const filteredDocuments = React.useMemo(() => {
    return documents.filter(doc => 
      activeFilter === "All" || doc.filterType === activeFilter
    )
  }, [documents, activeFilter])

  // 获取接口数据并整理文档
  React.useEffect(() => {
    if (!parentId) {
      setDocuments([])
      setError(t('clientDocuments.errors.noParentId', 'No parent ID found'))
      return
    }
    
    setLoading(true)
    setError(null)
    
    fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(res => {
        if (!res.ok) throw new Error(t('clientDocuments.errors.fetchFailed', 'Failed to fetch documents'))
        return res.json()
      })
      .then((cases) => {
        console.log(cases)
        let docs: any[] = []
        cases.forEach((c: any) => {
          // Only keep cases_files where about_role is intended_parent
          if (Array.isArray(c.cases_files)) {
            c.cases_files.forEach((f: any) => {
              if (f.about_role === "intended_parent") {
                const mappedType = mapDocType(f.category)
                docs.push({
                  name: f.file_url ? f.file_url.split("/").pop() : (f.category || f.file_url),
                  file_url: f.file_url,
                  type: mappedType.displayType,
                  filterType: mappedType.filterType,
                  note: f.note || "",
                  journey_journeys: f.journey_journeys || ""
                })
              }
            })
          }
        })
        setDocuments(docs)
        console.log('Documents loaded:', docs)
        console.log('Document types:', docs.map(d => ({ name: d.name, type: d.type, filterType: d.filterType })))
      })
      .catch((err) => {
        console.error('Failed to fetch documents:', err)
        setError(err.message || t('clientDocuments.errors.unknownError', 'Unknown error occurred'))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [parentId, t])

  return (
    <>
      <PageContent>
        <PageHeader 
          title={t('clientDocuments.title', 'Documents')} 
          showSearch
          // rightContent={
          //   <Button
          //     onClick={() => {}}
          //     className="flex items-center gap-2 bg-sage-200 text-sage-800 hover:bg-sage-250"
          //   >
          //     <Plus className="w-4 h-4" />
          //     {t('clientDocuments.addDocument', 'Add Document')}
          //   </Button>
          // }
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-600"></div>
              <span className="text-sage-600">{t('clientDocuments.loading', 'Loading documents...')}</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-400 mr-2">⚠️</div>
                <div className="text-red-800">{error}</div>
              </div>
              <button 
                className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors cursor-pointer"
                onClick={() => window.location.reload()}
              >
                {t('clientDocuments.actions.reload', 'Reload')}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && documents.length === 0 && (
          <div className="bg-white rounded-lg border border-sage-200 p-8 text-center">
            <div className="text-4xl text-gray-400 mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">{t('clientDocuments.empty.title', 'No documents found')}</h3>
            <p className="text-sm text-gray-500">{t('clientDocuments.empty.description', 'No documents have been uploaded yet.')}</p>
          </div>
        )}

        {/* Filters */}
        {!loading && !error && documents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer ${
                  activeFilter === filter.key ? "bg-sage-200 text-sage-800" : "bg-sage-100 text-sage-600 hover:bg-sage-150"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Documents Table */}
        {!loading && !error && documents.length > 0 && (
          <div className="bg-white rounded-lg border border-sage-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sage-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('clientDocuments.table.name', 'Name')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('clientDocuments.table.type', 'Type')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('clientDocuments.table.note', 'Note')}</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('clientDocuments.table.journey', 'Journey')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {filteredDocuments.map((doc, index) => (
                    <tr key={index} className="hover:bg-sage-25 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-sage-800">
                        {doc.file_url ? (
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sage-800 underline hover:text-sage-600 cursor-pointer">
                            {doc.name}
                          </a>
                        ) : doc.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-sage-600">{doc.type}</td>
                      <td className="px-6 py-4 text-sm text-sage-600">{doc.note}</td>
                      <td className="px-6 py-4 text-sm text-sage-600">{doc.journey_journeys}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageContent>
    </>
  )
}
