"use client"

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from "react-i18next"
import i18n from '@/i18n'
import { Search, User, Heart, Calendar, MapPin, Activity, Mail, Phone } from 'lucide-react'
// import { AdminLayout } from '../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { CustomButton } from '@/components/ui/CustomButton'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getSurrogatesApplications, updateApplicationStatus } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取辅助函数到组件外部，避免每次渲染重新创建
function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-sage-100 text-sage-800'
  }
}

function getHealthStatusColor(status: string): string {
  switch (status) {
    case 'excellent':
      return 'bg-green-100 text-green-800'
    case 'good':
      return 'bg-blue-100 text-blue-800'
    case 'fair':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-sage-100 text-sage-800'
  }
}

// 优化年龄计算函数，使用缓存避免重复计算
const calculateAge = (() => {
  const cache = new Map<string, number>()
  
  return (dateOfBirth: string): string | number => {
  if (!dateOfBirth) return 'N/A'
    
    if (cache.has(dateOfBirth)) {
      return cache.get(dateOfBirth)!
    }
    
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
    
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
    
    cache.set(dateOfBirth, age)
  return age
}
})()

// 创建单独的申请卡片组件，避免在 map 中使用 hooks
interface SurrogateApplicationCardProps {
  app: Application;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (id: number) => void;
  t: any;
}

const SurrogateApplicationCard = memo(({ app, onApprove, onReject, onViewDetails, t }: SurrogateApplicationCardProps) => {
  // 使用 useMemo 缓存数据处理
  const processedData = useMemo(() => {
    const appData = app.application_data as any
    const contactInfo = appData?.contact_information || {}
    const aboutYou = appData?.about_you || {}
    const pregnancyHealth = appData?.pregnancy_and_health || {}
    const age = calculateAge(contactInfo.date_of_birth)
    
    return {
      contactInfo,
      aboutYou,
      pregnancyHealth,
      age
    }
  }, [app.application_data])

  const { contactInfo, aboutYou, pregnancyHealth, age } = processedData

  return (
    <div
      className="bg-white rounded-xl border border-sage-200 p-6 flex flex-col justify-between shadow-sm w-full"
      style={{ minWidth: '0' }}
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-7 w-7 text-sage-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg text-sage-800 truncate">{contactInfo.first_name} {contactInfo.last_name}</div>
          <div className="text-sage-800 text-sm font-medium truncate">#{app.id} • {age} years</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>{t(app.status, { defaultValue: app.status })}</span>
      </div>
      <div className="mt-2 space-y-1 text-sage-800 text-[15px] font-medium">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-4 h-4 text-sage-400" />
          <span className="truncate">{contactInfo.email_address || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Phone className="w-4 h-4 text-sage-400" />
          <span className="truncate">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-sage-400" />
          <span className="truncate">{contactInfo.city}, {contactInfo.state_or_province || 'N/A'}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <Heart className="w-4 h-4 text-sage-500" />
          <span className="truncate">{pregnancyHealth.birth_details || 'No births'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <Activity className="w-4 h-4 text-sage-500" />
          <span className="truncate">BMI: {contactInfo.bmi || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <Calendar className="w-4 h-4 text-sage-500" />
          <span className="truncate">DOB: {contactInfo.date_of_birth || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <User className="w-4 h-4 text-sage-500" />
          <span className="truncate">{aboutYou.occupation || 'N/A'}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <span>{t('ethnicity', { defaultValue: '种族' })}:</span>
          <span className="truncate">{contactInfo.ethnicity || t('notAvailable', { defaultValue: 'N/A' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <span>{t('education', { defaultValue: '教育' })}:</span>
          <span className="truncate">{aboutYou.education_level || t('notAvailable', { defaultValue: 'N/A' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <span>{t('heightWeight', { defaultValue: '身高体重' })}:</span>
          <span className="truncate">
            {contactInfo.height 
              ? (typeof contactInfo.height === 'string' && contactInfo.height.includes("'") 
                  ? contactInfo.height 
                  : `${contactInfo.height} ${t('ft', 'ft')}`)
              : t('notAvailable', { defaultValue: 'N/A' })
            } / {contactInfo.weight ? `${contactInfo.weight} ${t('lbs', 'lbs')}` : t('notAvailable', { defaultValue: 'N/A' })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <span>{t('identity', { defaultValue: '身份' })}:</span>
          <span className="truncate">{contactInfo.us_citizen_or_visa_status || t('notAvailable', { defaultValue: 'N/A' })}</span>
        </div>
      </div>
      <div className="mb-4 p-3 bg-sage-50 rounded-lg">
        <div className="text-sm font-medium text-sage-800">
          <div className="mb-1">{t('surrogacyExperience', { defaultValue: '代孕经验' })}:</div>
          <div className="truncate">
            {aboutYou.is_former_surrogate
              ? t('experiencedSurrogate', { defaultValue: '有经验' })
              : t('firstTimeSurrogate', { defaultValue: '首次代孕' })}
            {contactInfo.surrogacy_experience_count > 0 && ` (${contactInfo.surrogacy_experience_count}${t('times', { defaultValue: '次' })})`}
          </div>
          {aboutYou.surrogate_experience && (
            <div className="text-xs text-sage-800 mt-1 truncate">
              {aboutYou.surrogate_experience}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
        <span className="text-sm font-medium text-sage-800">
          {t('applicationDate', { defaultValue: '申请时间' })}: {new Date(app.created_at).toLocaleDateString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US')}
        </span>
        <div className="flex gap-2 flex-wrap">
          {app.status === 'pending' && (
            <>
              <CustomButton
                className="bg-green-100 text-green-800 hover:bg-green-200 font-medium cursor-pointer px-3 py-1 text-sm rounded"
                onClick={() => onApprove(app.id)}
              >
                {t('approve', { defaultValue: '通过' })}
              </CustomButton>
              <CustomButton
                className="text-red-600 hover:bg-red-50 font-medium cursor-pointer border border-red-200 bg-white px-3 py-1 text-sm rounded"
                onClick={() => onReject(app.id)}
              >
                {t('reject', { defaultValue: '拒绝' })}
              </CustomButton>
            </>
          )}
          <CustomButton
            className="text-sage-800 hover:text-sage-900 font-medium cursor-pointer bg-transparent"
            onClick={() => onViewDetails(app.id)}
          >
            {t('viewDetails', { defaultValue: '查看详情' })}
          </CustomButton>
        </div>
      </div>
    </div>
  )
})

SurrogateApplicationCard.displayName = 'SurrogateApplicationCard'

export default function SurrogatesApplicationsPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")
  const [lang, setLang] = useState(i18n.language)
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  // 分页相关
  const [allApplications, setAllApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [pageSize, setPageSize] = useState(10)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // 自适应每页条数，始终两行，宽度自适应
  useEffect(() => {
    function calcPageSize() {
      const containerWidth = window.innerWidth - 64
      const cardWidth = 340 + 32
      const rowCount = Math.max(1, Math.floor(containerWidth / cardWidth))
      const colCount = 2 // 固定两行
      const newPageSize = rowCount * colCount
      setPageSize(newPageSize)
    }
    calcPageSize()
    window.addEventListener('resize', calcPageSize)
    return () => window.removeEventListener('resize', calcPageSize)
  }, [])

  useEffect(() => {
    const handleLangChange = () => setLang(i18n.language)
    i18n.on("languageChanged", handleLangChange)
    return () => i18n.off("languageChanged", handleLangChange)
  }, [i18n])

  // 使用 useCallback 缓存数据加载函数
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const data = await getSurrogatesApplications(10000, 0, status)
      console.log('[SurrogatesApplications] 加载的数据:', data?.length || 0, '条记录')
      setAllApplications(data || []) // 确保数据不为 undefined
    } catch (error) {
      console.error('Failed to load applications:', error)
      setAllApplications([]) // 出错时设置为空数组
    } finally {
      setLoading(false)
      console.log('[SurrogatesApplications] 加载完成，loading设置为false')
    }
  }, [statusFilter])

  // 获取全部数据 - 只在认证后才加载
  useEffect(() => {
    if (isAuthenticated) {
      loadApplications()
    }
  }, [isAuthenticated, loadApplications])

  // 使用 useCallback 缓存状态更新函数
  const handleStatusUpdate = useCallback(async (id: number, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, newStatus)
      await loadApplications() // 重新加载数据
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }, [loadApplications])

  // 使用 useMemo 缓存过滤和分页计算结果，优化搜索性能
  const { filteredApplications, totalPages, pagedApplications } = useMemo(() => {
    // 如果没有搜索词，直接返回所有数据
    if (!debouncedSearchTerm.trim()) {
      const total = allApplications.length
      const pages = Math.max(1, Math.ceil(total / pageSize))
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paged = allApplications.slice(start, end)
      
      return {
        filteredApplications: allApplications,
        totalPages: pages,
        pagedApplications: paged
      }
    }

    // 有搜索词时才进行过滤
    const searchLower = debouncedSearchTerm.toLowerCase().trim()
    const filtered = allApplications.filter(app => {
      const appData = app.application_data as any
      const contactInfo = appData?.contact_information || {}
      return (
        contactInfo.first_name?.toLowerCase().includes(searchLower) ||
        contactInfo.last_name?.toLowerCase().includes(searchLower) ||
        contactInfo.email_address?.toLowerCase().includes(searchLower) ||
        contactInfo.cell_phone?.includes(debouncedSearchTerm)
      )
    })

    // 分页
    const total = filtered.length
    const pages = Math.max(1, Math.ceil(total / pageSize))
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paged = filtered.slice(start, end)

    return {
      filteredApplications: filtered,
      totalPages: pages,
      pagedApplications: paged
    }
  }, [allApplications, debouncedSearchTerm, page, pageSize])

  // 搜索防抖处理
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms 防抖

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm])

  // 页码自动调整
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
  }, [page, totalPages])

  // 使用 useCallback 缓存分页处理函数
  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(1, page - 1)
    setPage(newPage)
    setPageInput(String(newPage))
  }, [page])

  const handleNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, page + 1)
    setPage(newPage)
    setPageInput(String(newPage))
  }, [page, totalPages])

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setPageInput(val)
  }, [])

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let val = Number(e.target.value)
    if (isNaN(val) || val < 1) val = 1
    if (val > totalPages) val = totalPages
    setPage(val)
    setPageInput(String(val))
  }, [totalPages])

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let val = Number((e.target as HTMLInputElement).value)
      if (isNaN(val) || val < 1) val = 1
      if (val > totalPages) val = totalPages
      setPage(val)
      setPageInput(String(val))
    }
  }, [totalPages])

  // 使用 useCallback 缓存其他事件处理函数
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleFilterChange = useCallback((filter: ApplicationStatus | 'all') => {
    setStatusFilter(filter)
  }, [])

  const handleAddNewApplication = useCallback(() => {
    window.open('https://www.yundasurrogacy.com/be-parents', '_blank')
  }, [])

  const handleViewDetails = useCallback((id: number) => {
    router.push(`/admin/surrogates-applications/${id}`)
  }, [router])

  const handleApprove = useCallback((id: number) => {
    handleStatusUpdate(id, 'approved')
  }, [handleStatusUpdate])

  const handleReject = useCallback((id: number) => {
    handleStatusUpdate(id, 'rejected')
  }, [handleStatusUpdate])

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <PageContent>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
      </PageContent>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  // 数据加载中 - 全屏加载状态（只在真正加载时显示）
  if (loading && allApplications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
          </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageContent className="flex-1 flex flex-col">
        <PageHeader
          title={t('surrogatesApplications')}
          rightContent={
            <div className="flex items-center gap-4">
              <CustomButton
                onClick={handleAddNewApplication}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250 font-medium cursor-pointer"
              >
                {t('addNewApplication')}
              </CustomButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CustomButton className="bg-white font-medium cursor-pointer border border-sage-300 text-sage-800">
                    {t('filterBy')}
                  </CustomButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white border border-sage-200 shadow-lg"
                  style={{ background: '#fff', opacity: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                >
                  <DropdownMenuItem
                    onClick={() => handleFilterChange('all')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'all' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'all' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('allStatus')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange('pending')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'pending' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'pending' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('pending')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange('approved')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'approved' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'approved' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('approved')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange('rejected')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'rejected' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'rejected' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('rejected')}
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
            placeholder={t('searchApplicants', { defaultValue: '搜索申请人...' })}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-white font-medium text-sage-800"
          />
        </div>

        {/* 主要内容区域 - 使用 flex-1 占据剩余空间 */}
        <div className="flex-1 flex flex-col">
          {/* 筛选加载状态 */}
          {loading && allApplications.length > 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
              </div>
            </div>
          ) : pagedApplications.length === 0 && !loading ? (
            // 空状态显示 - 居中显示
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sage-400 mb-2">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-lg text-sage-600 font-medium">{t('noApplications', { defaultValue: '暂无申请记录' })}</p>
                <p className="text-sm text-sage-400 mt-2">{t('noApplicationsDesc', { defaultValue: '当前筛选条件下没有找到申请记录' })}</p>
              </div>
            </div>
          ) : (
            // Applications Grid - 弹性布局美化
            <div
              className="grid w-full flex-1"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
            minHeight: '320px',
          }}
        >
            {pagedApplications.map((app) => (
              <SurrogateApplicationCard
                key={app.id}
                app={app}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={handleViewDetails}
                t={t}
              />
            ))}
                      </div>
                    )}

          {/* 分页控件 - 固定在页面底部 */}
          <div className="flex flex-wrap justify-center items-center mt-8 gap-4 pt-4 border-t border-sage-100">
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            {t('pagination.prevPage', { defaultValue: '上一页' })}
          </CustomButton>
          <span className="text-sage-700 text-sm flex items-center gap-2">
            {t('pagination.page', { defaultValue: '第' })}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handlePageInputKeyDown}
              className="w-14 px-2 py-1 border border-sage-200 rounded text-center focus:outline-none focus:ring-0"
              aria-label={t('pagination.jumpToPage', { defaultValue: '跳转到页码' })}
            />
            {t('pagination.of', { defaultValue: '共' })} {totalPages} {t('pagination.pages', { defaultValue: '页' })}
          </span>
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={page >= totalPages}
            onClick={handleNextPage}
          >
            {t('pagination.nextPage', { defaultValue: '下一页' })}
          </CustomButton>
        </div>
          </div>
      </PageContent>
    </div>
  )
}
