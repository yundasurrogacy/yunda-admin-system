'use client'

import * as React from 'react'
import { useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
// import ManagerLayout from '@/components/manager-layout'
import { Input } from '@/components/ui/input'
import { CustomButton } from '@/components/ui/CustomButton'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

interface Surrogate {
  id: string
  name: string
  location: string
  status: 'Matched' | 'In Progress'
}

export default function SurrogateProfiles() {
  const { t } = useTranslation('common')
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null)
  
  const [searchTerm, setSearchTerm] = React.useState('')
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [allSurrogates, setAllSurrogates] = React.useState<Surrogate[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(1)
  const [pageInput, setPageInput] = React.useState('1')
  const [pageSize, setPageSize] = React.useState(8)
  const containerRef = useRef<HTMLDivElement>(null)

  // 认证检查和 cookie 读取
  React.useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_manager')
      const userEmail = getCookie('userEmail_manager')
      const userId = getCookie('userId_manager')
      const authed = !!(userRole && userEmail && userId && userRole === 'manager')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client-manager/login')
      }
    }
  }, [router]);

  // 使用 useCallback 缓存数据获取函数
  const fetchSurrogates = useCallback(async () => {
    // 只在认证后才加载数据
    if (!isAuthenticated) return;
    
    setLoading(true)
    setError(null)
    try {
      const managerId = getCookie('userId_manager');
      const caseRes = await fetch(`/api/cases-by-manager?managerId=${managerId}`)
      if (!caseRes.ok) throw new Error(t('surrogateProfiles.fetchCasesFailed'))
      const caseData = await caseRes.json()
      const casesRaw = caseData.cases || caseData.data || caseData || []
      const surrogateIds = Array.isArray(casesRaw)
        ? casesRaw.map((item: any) => item.surrogate_mother?.id).filter(Boolean)
        : []
      const details: Surrogate[] = []
      for (const surrogateId of surrogateIds) {
        const res = await fetch(`/api/surrogate_mothers-detail?surrogacy=${surrogateId}`)
        if (res.ok) {
          const detail = await res.json()
          details.push({
            id: detail.id,
            name: detail.contact_information?.name || detail.name || '',
            location: detail.location || detail.contact_information?.location || '',
            status: detail.status || 'Matched',
          })
        }
      }
      setAllSurrogates(details)
    } catch (err: any) {
      setError(t('surrogateProfiles.fetchDataFailed'))
    }
    setLoading(false)
  }, [t, isAuthenticated])

  React.useEffect(() => {
    fetchSurrogates()
  }, [fetchSurrogates])

  // 自适应 pageSize
  React.useEffect(() => {
    function calcPageSize() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // 320px 卡片宽度 + 24px 间距
      const cardWidth = 320 + 24;
      const columns = Math.max(1, Math.floor(width / cardWidth));
      setPageSize(columns * 2); // 2 行
    }
    calcPageSize();
    window.addEventListener('resize', calcPageSize);
    return () => window.removeEventListener('resize', calcPageSize);
  }, []);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存过滤后的代孕母列表
  const filteredAllSurrogates = useMemo(() => 
    allSurrogates.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())), 
    [allSurrogates, searchTerm]
  );

  // 使用 useMemo 缓存分页数据
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredAllSurrogates.length / pageSize)), 
    [filteredAllSurrogates.length, pageSize]
  );

  const pagedSurrogates = useMemo(() => 
    filteredAllSurrogates.slice((page - 1) * pageSize, page * pageSize), 
    [filteredAllSurrogates, page, pageSize]
  );

  // 使用 useCallback 缓存搜索处理函数
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // 使用 useCallback 缓存导航函数
  const handleViewProfile = useCallback((id: string) => {
    router.push(`/client-manager/surrogate-profiles/${id}`);
  }, [router]);

  // 使用 useCallback 缓存鼠标悬停处理函数
  const handleMouseEnter = useCallback((id: string) => {
    setHovered(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  // 使用 useCallback 缓存分页处理函数
  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    setPageInput(String(newPage));
  }, [page]);

  const handleNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
    setPageInput(String(newPage));
  }, [page, totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPageInput(val);
  }, []);

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    setPage(val);
    setPageInput(String(val));
  }, [totalPages]);

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let val = Number((e.target as HTMLInputElement).value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > totalPages) val = totalPages;
      setPage(val);
      setPageInput(String(val));
    }
  }, [totalPages]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      setPageInput(String(totalPages));
    }
  }, [totalPages, page]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  return (
    // <ManagerLayout>
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium text-sage-800">{t('surrogateProfiles.title')}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              className="w-[240px] pl-9 bg-white font-medium text-sage-800 border-none shadow rounded-full focus:ring-0 focus:outline-none"
              placeholder={t('surrogateProfiles.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        {loading ? (
          <div className="font-medium text-sage-800">{t('loading')}</div>
        ) : error ? (
          <div className="font-medium text-red-500">{error}</div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              ref={containerRef}
            >
              {pagedSurrogates.map((surrogate, idx) => (
                <div
                  key={`${surrogate.id}-${idx}`}
                  className="rounded-xl bg-sage-50 p-6 shadow text-sage-800 font-medium flex flex-col justify-between min-h-[120px] hover:shadow-lg transition-shadow"
                  onMouseEnter={() => handleMouseEnter(surrogate.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div>
                    <div className="text-lg font-medium mb-1 text-sage-800">{surrogate.name}</div>
                    <div className="text-sm mb-1 text-sage-800">{surrogate.location}</div>
                    <div className="text-sm mb-2 text-sage-800">{t('surrogateProfiles.role')}</div>
                    <div className="text-sm mb-2 text-sage-800">{surrogate.status}</div>
                  </div>
                  <div className="flex justify-end">
                    <CustomButton
                      className={`rounded bg-sage-100 text-sage-800 font-medium px-4 py-1 text-xs shadow-none border border-sage-200 transition-colors cursor-pointer ${hovered === surrogate.id ? 'bg-sage-200 border-sage-800' : ''}`}
                      onClick={() => handleViewProfile(surrogate.id)}
                    >
                      {t('surrogateProfiles.view')}
                    </CustomButton>
                  </div>
                </div>
              ))}
            </div>
            {/* 分页控件 */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <CustomButton 
                className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer" 
                onClick={handlePrevPage} 
                disabled={page === 1}
              >
                {t('pagination.prevPage', '上一页')}
              </CustomButton>
              <span>
                {t('pagination.page', '第')}
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pageInput}
                  onChange={handlePageInputChange}
                  onBlur={handlePageInputBlur}
                  onKeyDown={handlePageInputKeyDown}
                  className="w-12 border rounded text-center mx-1"
                  style={{height: 28}}
                />
                {t('pagination.of', '共')} {totalPages} {t('pagination.pages', '页')}
              </span>
              <CustomButton 
                className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer" 
                onClick={handleNextPage} 
                disabled={page === totalPages}
              >
                {t('pagination.nextPage', '下一页')}
              </CustomButton>
            </div>
          </>
        )}
      </div>
    // </ManagerLayout>
  )
}
