"use client"

import React, { useState, useMemo, useCallback, memo } from "react"
import { Search, Plus } from "lucide-react"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 类型映射函数（移到组件外部）
function mapDocType(type: string, t: any): { displayType: string; filterType: string } {
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

// 提取的文档行组件（使用 memo 优化）
const DocumentRow = memo(({ 
  doc, 
  index 
}: { 
  doc: any; 
  index: number;
}) => (
  <tr className="hover:bg-sage-25 transition-colors duration-150">
    <td className="px-6 py-4 text-sm text-sage-800">
      {doc.file_url ? (
        <a 
          href={doc.file_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sage-800 underline hover:text-sage-600 cursor-pointer"
        >
          {doc.name}
        </a>
      ) : doc.name}
    </td>
    <td className="px-6 py-4 text-sm text-sage-600">{doc.type}</td>
    <td className="px-6 py-4 text-sm text-sage-600">{doc.note}</td>
  </tr>
));

DocumentRow.displayName = 'DocumentRow';

export default function DocumentsPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [activeFilter, setActiveFilter] = useState("All")
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 认证检查和 cookie 读取
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_client')
      const userEmail = getCookie('userEmail_client')
      const userId = getCookie('userId_client')
      const authed = !!(userRole && userEmail && userId)
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client/login')
      }
    }
  }, [router]);

  // 使用 useMemo 缓存过滤器分类
  const filters = useMemo(() => [
    { key: "All", label: t('clientDocuments.filters.all', 'All') },
    { key: "EmbryoDocs", label: t('clientDocuments.filters.embryoDocs', 'Embryo Documents') },
    { key: "SurrogateInfo", label: t('clientDocuments.filters.surrogateInfo', 'Surrogate Information') },
    { key: "LegalDocs", label: t('clientDocuments.filters.legalDocs', 'Legal Documents') },
    { key: "Other", label: t('clientDocuments.filters.other', 'Other') }
  ], [t]);

  // 使用 useMemo 缓存过滤后的文档
  const filteredDocuments = React.useMemo(() => {
    return documents.filter(doc => 
      activeFilter === "All" || doc.filterType === activeFilter
    )
  }, [documents, activeFilter])

  // 使用 useCallback 缓存过滤器变化处理
  const handleFilterChange = useCallback((filterKey: string) => {
    setActiveFilter(filterKey);
  }, []);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  // 使用 useMemo 缓存文档数量检查
  const hasDocuments = useMemo(() => documents.length > 0, [documents.length]);
  const hasFilteredDocuments = useMemo(() => filteredDocuments.length > 0, [filteredDocuments.length]);

  // 获取接口数据并整理文档
  React.useEffect(() => {
    if (!isAuthenticated) return; // 只在认证后才加载数据
    
    const parentId = getCookie('userId_client');
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
                const mappedType = mapDocType(f.category, t)
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
  }, [t, isAuthenticated])

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查中
  if (isAuthenticated === null) {
    return (
      <PageContent>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </PageContent>
    );
  }

  // 未认证
  if (!isAuthenticated) {
    return null;
  }

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
                onClick={handleReload}
              >
                {t('clientDocuments.actions.reload', 'Reload')}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && documents.length === 0 && (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="text-sage-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-xl text-sage-600 font-medium mb-2">{t('clientDocuments.empty.title', '暂无文档')}</p>
              <p className="text-sm text-sage-400 mb-6">{t('clientDocuments.empty.description', '目前没有任何文档')}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading && !error && documents.length > 0 && (
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
                    {/* <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">{t('clientDocuments.table.journey', 'Journey')}</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {filteredDocuments.map((doc, index) => (
                    <DocumentRow key={index} doc={doc} index={index} />
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
