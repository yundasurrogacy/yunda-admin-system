'use client'

import * as React from 'react'
import { useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
// import ManagerLayout from '@/components/manager-layout'
import { Input } from '@/components/ui/input'
import { CustomButton } from '@/components/ui/CustomButton'
import { Search, User, MapPin, Activity, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
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
  country: string
  status: 'Matched' | 'In Progress'
  age?: string
  bmi?: string
  height?: string
  weight?: string
  ethnicity?: string
  education?: string
  maritalStatus?: string
  surrogacyExperience?: string
  updated_at?: string
}

export default function SurrogateProfiles() {
  const { t } = useTranslation('common')
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null)
  
  const [searchTerm, setSearchTerm] = React.useState('')
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const [allSurrogates, setAllSurrogates] = React.useState<Surrogate[]>([])
  const [loading, setLoading] = React.useState(true)
  const [dataLoaded, setDataLoaded] = React.useState(false)
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
    if (!isAuthenticated || dataLoaded) return;
    
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
          const firstName = detail.contact_information?.first_name || ''
          const lastName = detail.contact_information?.last_name || ''
          const fullName = `${firstName} ${lastName}`.trim() || detail.contact_information?.name || detail.name || ''
          
          // 计算年龄
          const birthDate = detail.contact_information?.date_of_birth
          let age = ''
          if (birthDate) {
            const birth = new Date(birthDate)
            const now = new Date()
            const calculatedAge = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0)
            age = String(calculatedAge)
          }
          
          details.push({
            id: detail.id,
            name: fullName,
            location: detail.location || detail.contact_information?.location || '',
            country: detail.contact_information?.country || '',
            status: detail.status || 'Matched',
            age,
            bmi: detail.contact_information?.bmi,
            height: detail.contact_information?.height,
            weight: detail.contact_information?.weight,
            ethnicity: detail.contact_information?.ethnicity_selected_key,
            education: detail.about_you?.education_level_selected_key,
            maritalStatus: detail.about_you?.marital_status_selected_key,
            surrogacyExperience: detail.contact_information?.surrogacy_experience_count,
            updated_at: detail.updated_at,
          })
        }
      }
      setAllSurrogates(details)
      setDataLoaded(true)
    } catch (err: any) {
      setError(t('surrogateProfiles.fetchDataFailed'))
    }
    setLoading(false)
  }, [t, isAuthenticated, dataLoaded])

  React.useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      fetchSurrogates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

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
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
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
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('surrogateProfiles.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 bg-white w-full font-medium text-sage-800 rounded-full"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
              <div className="text-lg text-sage-700">{t('loading')}</div>
            </div>
          </div>
        ) : error ? (
          <div className="font-medium text-red-500">{error}</div>
        ) : pagedSurrogates.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="text-sage-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-xl text-sage-600 font-medium mb-2">
                {searchTerm ? t('surrogateProfiles.noSurrogatesFiltered', { defaultValue: '暂无代孕母' }) : t('surrogateProfiles.noSurrogates', { defaultValue: '暂无代孕母' })}
              </p>
              <p className="text-sm text-sage-400 mb-6">
                {searchTerm ? t('surrogateProfiles.noSurrogatesDescFiltered', { defaultValue: '当前筛选条件下没有找到代孕母' }) : t('surrogateProfiles.noSurrogatesDesc', { defaultValue: '目前没有任何代孕母' })}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-3 gap-6"
              ref={containerRef}
            >
              {pagedSurrogates.map((surrogate) => (
                <Card 
                  key={surrogate.id} 
                  className="relative p-6 rounded-xl bg-white hover:shadow-lg transition-shadow text-sage-800 font-medium"
                  onMouseEnter={() => handleMouseEnter(surrogate.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-sage-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-sage-800 truncate">{surrogate.name}</h3>
                      <p className="text-sm text-sage-600 opacity-60">{t('id')}: {surrogate.id} {surrogate.age ? `• ${t('age')}: ${surrogate.age}` : ''}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-sage-700 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sage-400" />
                      <span>{surrogate.country || surrogate.location || '-'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {surrogate.bmi && (
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-sage-400" />
                          <span>BMI: {surrogate.bmi}</span>
                        </div>
                      )}
                      {surrogate.height && (
                        <div><span>{t('height')}: {surrogate.height}</span></div>
                      )}
                      {surrogate.weight && (
                        <div><span>{t('weight')}: {surrogate.weight} {t('lbs')}</span></div>
                      )}
                      {surrogate.ethnicity && (
                        <div><span>{t('ethnicity')}: {surrogate.ethnicity}</span></div>
                      )}
                      {surrogate.education && (
                        <div><span>{t('education')}: {surrogate.education}</span></div>
                      )}
                      {surrogate.maritalStatus && (
                        <div><span>{t('maritalStatus')}: {surrogate.maritalStatus}</span></div>
                      )}
                      {surrogate.surrogacyExperience && (
                        <div className="col-span-2"><span>{t('surrogacyExperience')}: {surrogate.surrogacyExperience} {t('times')}</span></div>
                      )}
                    </div>
                  </div>
                  <hr className="mb-4 border-sage-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-sage-500">
                      {t('lastUpdate')}: {surrogate.updated_at?.slice(0, 10) || '-'}
                    </span>
                    <CustomButton
                      className={
                        (hoveredId === surrogate.id
                          ? "rounded bg-sage-600 text-white font-medium px-4 py-2 text-sm shadow-none"
                          : "rounded bg-sage-100 text-sage-800 font-medium px-4 py-2 text-sm shadow-none border border-sage-200"
                        ) + " cursor-pointer"
                      }
                      onClick={() => handleViewProfile(surrogate.id)}
                    >
                      {t('surrogateProfiles.view')}
                    </CustomButton>
                  </div>
                </Card>
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
