"use client"

import React, { useState, useEffect, useMemo, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus } from "lucide-react"
// import { AdminLayout } from "../../../components/admin-layout"
// import ManagerLayout from '@/components/manager-layout';
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';

// 优化的文档行组件
const DocumentRow = memo(({ doc }: { doc: any }) => (
  <tr className="hover:bg-sage-25 transition-colors duration-150">
    <td className="px-6 py-4 text-sm text-sage-800">
      {doc.file_url ? (
        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sage-800 underline hover:text-sage-600 cursor-pointer">
          {doc.name}
        </a>
      ) : doc.name}
    </td>
    <td className="px-6 py-4 text-sm text-sage-600">{doc.type}</td>
    <td className="px-6 py-4 text-sm text-sage-600">{doc.note}</td>
  </tr>
));

DocumentRow.displayName = 'DocumentRow';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 类型映射函数 - 移到组件外部
function mapDocType(type: string, t: any): { displayType: string; filterType: string } {
  switch (type) {
    case 'Embryo':
    case 'EmbryoDocs':
    case 'Photos':
      return { 
        displayType: t('documents.types.embryoDocs', 'Embryo Documents'),
        filterType: 'EmbryoDocs'
      }
    case 'Surrogate':
    case 'SurrogateInfo':
      return { 
        displayType: t('documents.types.surrogateInfo', 'Surrogate Information'),
        filterType: 'SurrogateInfo'
      }
    case 'Legal Document':
    case 'LegalDocs':
      return { 
        displayType: t('documents.types.legalDocs', 'Legal Documents'),
        filterType: 'LegalDocs'
      }
    default:
      return { 
        displayType: t('documents.types.other', 'Other'),
        filterType: 'Other'
      }
  }
}

export default function DocumentsPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [activeFilter, setActiveFilter] = useState("All")
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_surrogacy')
      const userEmail = getCookie('userEmail_surrogacy')
      const userId = getCookie('userId_surrogacy')
      const authed = !!(userRole && userEmail && userId)
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/surrogacy/login')
      }
    }
  }, [router]);

  // 使用 useMemo 缓存过滤器分类
  const filters = useMemo(() => [
    { key: "All", label: t('documents.filters.all', 'All') },
    { key: "EmbryoDocs", label: t('documents.filters.embryoDocs', 'Embryo Documents') },
    { key: "SurrogateInfo", label: t('documents.filters.surrogateInfo', 'Surrogate Information') },
    { key: "LegalDocs", label: t('documents.filters.legalDocs', 'Legal Documents') },
    { key: "Other", label: t('documents.filters.other', 'Other') }
  ], [t]);

  // 使用 useMemo 缓存过滤后的文档
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => 
      activeFilter === "All" || doc.filterType === activeFilter
    )
  }, [documents, activeFilter]);

  // 获取接口数据并整理文档
  useEffect(() => {
    // 只在认证后才加载数据
    if (!isAuthenticated) return;

    const surrogateId = getCookie('userId_surrogacy');
    if (!surrogateId) {
      setDocuments([])
      setError(t('documents.errors.noSurrogateId', 'No surrogate ID found'))
      return
    }
    
    setLoading(true)
    setError(null)
    
    fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`)
      .then(res => {
        if (!res.ok) throw new Error(t('documents.errors.fetchFailed', 'Failed to fetch documents'))
        return res.json()
      })
      .then((cases) => {
        // console.log(cases)
        let docs: any[] = []
        cases.forEach((c: any) => {
          // Only keep cases_files where about_role is surrogate_mother
          if (Array.isArray(c.cases_files)) {
            c.cases_files.forEach((f: any) => {
              if (f.about_role === "surrogate_mother") {
                const mappedType = mapDocType(f.category, t)
                docs.push({
                  name: f.file_url ? f.file_url.split("/").pop() : (f.category || f.file_url),
                  file_url: f.file_url,
                  type: mappedType.displayType,
                  filterType: mappedType.filterType,
                  // uploadedBy: c.client_manager?.email || "-",
                  // clientName: c.intended_parent?.basic_information || c.surrogate_mother?.contact_information || "-",
                  // about_role: f.about_role || "surrogate_mother",
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
        setError(err.message || t('documents.errors.unknownError', 'Unknown error occurred'))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [t, isAuthenticated])

  // 使用 useCallback 缓存过滤器切换函数
  const handleFilterChange = useCallback((filterKey: string) => {
    setActiveFilter(filterKey);
  }, []);

  // 使用 useCallback 缓存重新加载函数
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  // 使用 useMemo 缓存是否有文档
  const hasDocuments = useMemo(() => documents.length > 0, [documents.length]);

  // 使用 useMemo 缓存是否有过滤结果
  const hasFilteredDocuments = useMemo(() => filteredDocuments.length > 0, [filteredDocuments.length]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <PageContent>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </PageContent>
    );
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <PageContent>
        <PageHeader 
          title={t('documents.title', 'Documents')} 
          showSearch
          // rightContent={
          //   <Button
          //     onClick={() => {}}
          //     className="flex items-center gap-2 bg-sage-200 text-sage-800 hover:bg-sage-250"
          //   >
          //     <Plus className="w-4 h-4" />
          //     {t('documents.addDocument', 'Add Document')}
          //   </Button>
          // }
        />


        {/* Document Statistics */}
        {/* {!loading && !error && documents.length > 0 && (
          <div className="bg-white rounded-lg border border-sage-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-sage-800">{documents.length}</span> {t('documents.stats.totalDocuments', 'total documents')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('documents.stats.filteredBy', 'Filtered by')}: <span className="font-medium text-sage-800">
                    {filters.find(f => f.key === activeFilter)?.label || activeFilter}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {t('documents.stats.lastUpdated', 'Last updated')}: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        )} */}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer ${
                activeFilter === filter.key ? "bg-sage-200 text-sage-800" : "bg-sage-100 text-sage-600 hover:bg-sage-150"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-600"></div>
              <span className="text-sage-600">{t('documents.loading', 'Loading documents...')}</span>
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
                onClick={handleReload}
              >
                {t('documents.actions.reload', 'Reload')}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !hasDocuments && (
          <div className="bg-white rounded-lg border border-sage-200 p-8 text-center">
            <div className="text-4xl text-gray-400 mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">{t('documents.empty.title', 'No documents found')}</h3>
            <p className="text-sm text-gray-500">{t('documents.empty.description', 'No documents have been uploaded yet.')}</p>
          </div>
        )}

        {/* Documents Table */}
        {!loading && !error && hasDocuments && (
          <div className="bg-white rounded-lg border border-sage-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-sage-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('documents.table.name', 'Name')}</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('documents.table.type', 'Type')}</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('documents.table.status', 'Status')}</th> */}
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('documents.table.uploadedBy', 'Uploaded By')}</th> */}
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('documents.table.clientName', 'Client Name')}</th> */}
                  <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('documents.table.note', 'Note')}</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('documents.table.journey', 'Journey')}</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {filteredDocuments.map((doc, index) => (
                  <DocumentRow key={index} doc={doc} />
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
