"use client"

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
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
import { formatBooleanLabel } from '@/lib/utils'
import { exportSurrogateDetailFixedToExcel } from '@/lib/exports/applications'
import { parseSurrogateApplicationData, buildSurrogateDetailFixedRow } from '@/lib/exports/surrogate-fixed-rows'
import { Dialog } from '@/components/ui/dialog'

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
  onDelete: (id: number) => void;
  t: any;
}

const SurrogateApplicationCard = memo(({ app, onApprove, onReject, onViewDetails, onDelete, t }: SurrogateApplicationCardProps) => {
  const processedData = useMemo(() => {
    const appData = app.application_data as any
    const gc = appData?.gc_intake
    const contactInfo = appData?.contact_information || {}
    const aboutYou = appData?.about_you || {}
    const pregnancyHealth = appData?.pregnancy_and_health || {}
    const g = gc?.general_info || {}
    const dob = g?.dob ?? contactInfo?.date_of_birth
    const age = calculateAge(dob)
    const isGcIntake = !!gc
    const displayName = isGcIntake ? (g?.full_name || '') : `${contactInfo?.first_name || ''} ${contactInfo?.last_name || ''}`.trim() || 'N/A'
    const email = isGcIntake ? (g?.email ?? '') : (contactInfo?.email_address ?? '')
    const gcPhone = [g?.country_code, g?.phone].filter(Boolean).join(' ').trim()
    const legacyPhone = [contactInfo?.cell_phone_country_code, contactInfo?.cell_phone].filter(Boolean).join(' ').trim()
    const phone = isGcIntake ? gcPhone : legacyPhone
    const location = isGcIntake ? (g?.state_of_residence ?? g?.home_address ?? '') : `${contactInfo?.city || ''}, ${contactInfo?.state_or_province || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || ''
    const birthSummary = isGcIntake
      ? (gc?.pregnancy_birth_history?.total_children != null ? `Children: ${gc.pregnancy_birth_history.total_children}` : '')
      : (pregnancyHealth?.birth_details ?? '')
    const bmi = isGcIntake ? (g?.bmi ?? '') : (contactInfo?.bmi ?? '')
    const occupation = isGcIntake ? (g?.occupation_specify || g?.occupation_type || '') : (aboutYou?.occupation ?? '')
    const ethnicityValue = isGcIntake ? (g?.ethnicity || '') : (contactInfo?.ethnicity ?? '')
    const identityLabel = isGcIntake
      ? formatBooleanLabel(typeof g?.us_citizen_or_resident === 'boolean' ? g.us_citizen_or_resident : null, t)
      : (contactInfo?.us_citizen_or_visa_status ?? '')

    return {
      displayName,
      email,
      phone,
      location,
      birthSummary,
      bmi,
      dob,
      occupation,
      age,
      isGcIntake,
      ethnicity: ethnicityValue,
      education: isGcIntake ? '' : (aboutYou?.education_level ?? ''),
      heightWeight: isGcIntake ? (g?.height_feet ? `${g.height_feet}'${g.height_inches || ''}" / ${g.weight} lbs` : '') : (contactInfo?.height ? `${contactInfo.height} ${contactInfo.weight || ''} lbs` : ''),
      identity: identityLabel,
      experienceLabel: isGcIntake ? '' : (aboutYou?.is_former_surrogate ? t('experiencedSurrogate', { defaultValue: '有经验' }) : t('firstTimeSurrogate', { defaultValue: '首次代孕' })),
      experienceDetail: isGcIntake ? '' : (aboutYou?.surrogate_experience ?? ''),
      experienceCount: isGcIntake ? 0 : (contactInfo?.surrogacy_experience_count ?? 0),
    }
  }, [app.application_data, t])

  const d = processedData

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
          <div className="font-semibold text-lg text-sage-800 truncate">{d.displayName || 'N/A'}</div>
          <div className="text-sage-800 text-sm font-medium truncate">#{app.id} • {d.age} years</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>{t(app.status, { defaultValue: app.status })}</span>
      </div>
      <div className="mt-2 space-y-1 text-sage-800 text-[15px] font-medium">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-4 h-4 text-sage-400" />
          <span className="truncate">{d.email || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Phone className="w-4 h-4 text-sage-400" />
          <span className="truncate">{d.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-sage-400" />
          <span className="truncate">{d.location || 'N/A'}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <Heart className="w-4 h-4 text-sage-500" />
          <span className="truncate">{d.birthSummary || t('noBirthRecords', { defaultValue: 'No birth records yet' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <Activity className="w-4 h-4 text-sage-500" />
          <span className="truncate">BMI: {d.bmi || t('notAvailable', { defaultValue: 'N/A' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <Calendar className="w-4 h-4 text-sage-500" />
          <span className="truncate">DOB: {d.dob || t('notAvailable', { defaultValue: 'N/A' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
          <User className="w-4 h-4 text-sage-500" />
          <span className="truncate">{d.occupation || t('notAvailable', { defaultValue: 'N/A' })}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {d.ethnicity && (
          <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
            <span>{t('ethnicity', { defaultValue: '种族' })}:</span>
            <span className="truncate">{d.ethnicity}</span>
          </div>
        )}
        {!d.isGcIntake && d.education && (
          <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
            <span>{t('education', { defaultValue: '教育' })}:</span>
            <span className="truncate">{d.education}</span>
          </div>
        )}
        {d.heightWeight && (
          <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
            <span>{t('heightWeight', { defaultValue: '身高体重' })}:</span>
            <span className="truncate">{d.heightWeight}</span>
          </div>
        )}
        {d.identity && (
          <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
            <span>{t('identity', { defaultValue: '身份' })}:</span>
            <span className="truncate">{d.identity}</span>
          </div>
        )}
      </div>
      {!d.isGcIntake && (d.experienceLabel || d.experienceDetail || d.experienceCount > 0) && (
      <div className="mb-4 p-3 bg-sage-50 rounded-lg">
        <div className="text-sm font-medium text-sage-800">
          <div className="mb-1">{t('surrogacyExperience', { defaultValue: '代孕经验' })}:</div>
          <div className="truncate">
            {d.experienceLabel}
            {d.experienceCount > 0 && ` (${d.experienceCount}${t('times', { defaultValue: '次' })})`}
          </div>
          {d.experienceDetail && <div className="text-xs text-sage-800 mt-1 truncate">{d.experienceDetail}</div>}
        </div>
      </div>
      )}
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
          <CustomButton
            className="text-red-600 hover:bg-red-50 font-medium cursor-pointer bg-transparent"
            onClick={() => onDelete(app.id)}
          >
            {t('delete', { defaultValue: 'Delete' })}
          </CustomButton>
        </div>
      </div>
    </div>
  )
})

SurrogateApplicationCard.displayName = 'SurrogateApplicationCard'

export default function SurrogatesApplicationsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t, i18n } = useTranslation("common")
  const [lang, setLang] = useState(i18n.language)
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  // 分页相关（页码与 URL ?page= 同步，便于从详情返回时保持页码）
  const [allApplications, setAllApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const pageSize = 12 // 每页 12 条（2、3、4 的公倍数）
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 批量导出：按创建时间筛选
  const [batchExportOpen, setBatchExportOpen] = useState(false)
  const [exportDateStart, setExportDateStart] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  })
  const [exportDateEnd, setExportDateEnd] = useState(() => new Date().toISOString().slice(0, 10))

  const LIST_RETURN_PAGE_KEY = 'surrogates-list-return-page'
  const pageFromUrl = searchParams.get('page') || '1'
  const pageFromUrlNum = Math.max(1, parseInt(pageFromUrl, 10) || 1)
  const [restoredPage, setRestoredPage] = useState<number | null>(null)
  const justRestoredRef = useRef(false) // 刚从 sessionStorage 恢复时 URL 尚未更新，不据此清 restoredPage
  const currentPage = restoredPage ?? pageFromUrlNum
  const [pageInput, setPageInput] = useState(String(currentPage))

  // 挂载时：若 sessionStorage 有“从详情返回”的页码，先恢复 URL 并用于展示（解决 router.push 后 searchParams 不更新）
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = sessionStorage.getItem(LIST_RETURN_PAGE_KEY)
    if (saved) {
      sessionStorage.removeItem(LIST_RETURN_PAGE_KEY)
      const p = Math.max(1, parseInt(saved, 10) || 1)
      justRestoredRef.current = true
      setRestoredPage(p)
      setPageInput(String(p))
      router.replace(`${pathname}?page=${p}`, { scroll: false })
    }
  }, [pathname, router])

  // URL 变化后：若并非“刚恢复”且 URL 与 restoredPage 不一致，则以 URL 为准并清掉 restoredPage
  useEffect(() => {
    if (restoredPage !== null && pageFromUrlNum === restoredPage) {
      justRestoredRef.current = false
    }
    if (restoredPage !== null && pageFromUrlNum !== restoredPage && !justRestoredRef.current) {
      setRestoredPage(null)
    }
    setPageInput(String(currentPage))
  }, [pageFromUrlNum, currentPage, restoredPage])

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

  useEffect(() => {
    const handleLangChange = () => setLang(i18n.language)
    i18n.on("languageChanged", handleLangChange)
    return () => i18n.off("languageChanged", handleLangChange)
  }, [i18n])

  // 使用 useCallback 缓存数据加载函数
  const loadApplications = useCallback(async (forceReload = false) => {
    if (!forceReload && dataLoaded) return;
    
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const data = await getSurrogatesApplications(10000, 0, status)
      console.log('[SurrogatesApplications] 加载的数据:', data?.length || 0, '条记录')
      setAllApplications(data || []) // 确保数据不为 undefined
      setDataLoaded(true)
    } catch (error) {
      console.error('Failed to load applications:', error)
      setAllApplications([]) // 出错时设置为空数组
    } finally {
      setLoading(false)
      console.log('[SurrogatesApplications] 加载完成，loading设置为false')
    }
  }, [statusFilter, dataLoaded])

  // 获取全部数据 - 只在认证后才加载
  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      loadApplications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // 当筛选条件改变时重新加载数据
  useEffect(() => {
    if (isAuthenticated && dataLoaded) {
      loadApplications(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  // 使用 useCallback 缓存状态更新函数
  const handleStatusUpdate = useCallback(async (id: number, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, newStatus)
      await loadApplications(true) // 强制重新加载数据
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }, [loadApplications])

  // 使用 useMemo 缓存过滤和分页计算结果（页码用 currentPage，来自 URL）
  const { filteredApplications, totalPages, pagedApplications } = useMemo(() => {
    // 如果没有搜索词，直接返回所有数据
    if (!debouncedSearchTerm.trim()) {
      const total = allApplications.length
      const pages = Math.max(1, Math.ceil(total / pageSize))
      const start = (currentPage - 1) * pageSize
      const end = start + pageSize
      const paged = allApplications.slice(start, end)
      
      return {
        filteredApplications: allApplications,
        totalPages: pages,
        pagedApplications: paged
      }
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim()
    const filtered = allApplications.filter(app => {
      const appData = app.application_data as any
      const gc = appData?.gc_intake
      const g = gc?.general_info || {}
      const contactInfo = appData?.contact_information || {}
      if (gc) {
        return (
          g.full_name?.toLowerCase().includes(searchLower) ||
          g.email?.toLowerCase().includes(searchLower) ||
          (g.phone && String(g.phone).includes(debouncedSearchTerm)) ||
          (g.country_code && String(g.country_code).includes(debouncedSearchTerm))
        )
      }
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
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    const paged = filtered.slice(start, end)

    return {
      filteredApplications: filtered,
      totalPages: pages,
      pagedApplications: paged
    }
  }, [allApplications, debouncedSearchTerm, currentPage, pageSize])

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

  // 页码自动调整（如总页数减少时，通过 URL 跳回最后一页）；仅在数据已加载时执行，避免返回列表时因数据未加载导致 totalPages=1 而误改成 page=1
  useEffect(() => {
    if (!dataLoaded) return
    if (totalPages >= 1 && currentPage > totalPages) {
      setPageInput(String(totalPages))
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(totalPages))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [dataLoaded, currentPage, totalPages, pathname, router, searchParams])

  // 同步页码到 URL，便于从详情返回时保持页码
  const syncPageToUrl = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  // 使用 useCallback 缓存分页处理函数（改 URL 并设 restoredPage，避免 searchParams 滞后）
  const handleFirstPage = useCallback(() => {
    setPageInput('1')
    setRestoredPage(1)
    syncPageToUrl(1)
  }, [syncPageToUrl])

  const handleLastPage = useCallback(() => {
    const newPage = totalPages
    setPageInput(String(newPage))
    setRestoredPage(newPage)
    syncPageToUrl(newPage)
  }, [totalPages, syncPageToUrl])

  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(1, currentPage - 1)
    setPageInput(String(newPage))
    setRestoredPage(newPage)
    syncPageToUrl(newPage)
  }, [currentPage, syncPageToUrl])

  const handleNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, currentPage + 1)
    setPageInput(String(newPage))
    setRestoredPage(newPage)
    syncPageToUrl(newPage)
  }, [currentPage, totalPages, syncPageToUrl])

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setPageInput(val)
  }, [])

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let val = Number(e.target.value)
    if (isNaN(val) || val < 1) val = 1
    if (val > totalPages) val = totalPages
    setPageInput(String(val))
    setRestoredPage(val)
    syncPageToUrl(val)
  }, [totalPages, syncPageToUrl])

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let val = Number((e.target as HTMLInputElement).value)
      if (isNaN(val) || val < 1) val = 1
      if (val > totalPages) val = totalPages
      setPageInput(String(val))
      setRestoredPage(val)
      syncPageToUrl(val)
    }
  }, [totalPages, syncPageToUrl])

  // 使用 useCallback 缓存其他事件处理函数
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleFilterChange = useCallback((filter: ApplicationStatus | 'all') => {
    setStatusFilter(filter)
  }, [])

  const handleAddNewApplication = useCallback(() => {
    window.open('https://www.yundasurrogacy.com/be-surrogate', '_blank')
  }, [])

  const handleBatchExport = useCallback(() => {
    const start = new Date(exportDateStart)
    start.setHours(0, 0, 0, 0)
    const end = new Date(exportDateEnd)
    end.setHours(23, 59, 59, 999)
    const inRange = allApplications.filter((app) => {
      const created = new Date(app.created_at)
      return created >= start && created <= end
    })
    if (inRange.length === 0) {
      window.alert(t('exportNoData', { defaultValue: '该时间区间内无申请记录' }))
      return
    }
    let headers: string[] = []
    const rows: Record<string, string>[] = []
    inRange.forEach((app, i) => {
      const parsed = parseSurrogateApplicationData(app)
      const { headers: h, row: r } = buildSurrogateDetailFixedRow(app, parsed, t)
      if (i === 0) headers = h
      rows.push(r)
    })
    const dateStamp = new Date().toISOString().split('T')[0]
    exportSurrogateDetailFixedToExcel(headers, rows, `surrogates-batch-${exportDateStart}-${exportDateEnd}-${dateStamp}.xlsx`)
    setBatchExportOpen(false)
  }, [allApplications, exportDateStart, exportDateEnd, t])

  const handleViewDetails = useCallback((id: number) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LIST_RETURN_PAGE_KEY, String(currentPage))
    }
    const params = new URLSearchParams()
    params.set('fromPage', String(currentPage))
    router.push(`/admin/surrogates-applications/${id}?${params.toString()}`)
  }, [router, currentPage])

  const handleApprove = useCallback((id: number) => {
    handleStatusUpdate(id, 'approved')
  }, [handleStatusUpdate])

  const handleReject = useCallback((id: number) => {
    handleStatusUpdate(id, 'rejected')
  }, [handleStatusUpdate])

  const handleDelete = useCallback(async (id: number) => {
    const confirmed = window.confirm(t('confirmDeleteApplication', { defaultValue: 'Delete this application?' }))
    if (!confirmed)
      return
    try {
      const response = await fetch(`/api/applications?id=${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      await loadApplications(true)
      window.alert(t('deleteSuccess', { defaultValue: 'Application deleted successfully.' }))
    }
    catch (error) {
      console.error('Failed to delete application:', error)
      window.alert(t('deleteFailed', { defaultValue: 'Failed to delete application, please try again.' }))
    }
  }, [loadApplications, t])

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
                onClick={() => setBatchExportOpen(true)}
                className="bg-white font-medium cursor-pointer border border-sage-300 text-sage-800"
              >
                {t('batchExportExcel', { defaultValue: '批量导出 Excel' })}
              </CustomButton>
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
                <div className="text-sage-400 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-xl text-sage-600 font-medium mb-2">{t('noApplications', { defaultValue: '暂无申请记录' })}</p>
                <p className="text-sm text-sage-400 mb-6">{t('noApplicationsDesc', { defaultValue: '当前筛选条件下没有找到申请记录' })}</p>
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
                onDelete={handleDelete}
                t={t}
              />
            ))}
                      </div>
                    )}

          {/* 分页控件 - 固定在页面底部 */}
          <div className="flex flex-wrap justify-center items-center mt-8 gap-4 pt-4 border-t border-sage-100">
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={currentPage === 1}
            onClick={handleFirstPage}
          >
            {t('pagination.firstPage', { defaultValue: '首页' })}
          </CustomButton>
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={currentPage === 1}
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
            disabled={currentPage >= totalPages}
            onClick={handleNextPage}
          >
            {t('pagination.nextPage', { defaultValue: '下一页' })}
          </CustomButton>
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={currentPage >= totalPages || totalPages <= 0}
            onClick={handleLastPage}
          >
            {t('pagination.lastPage', { defaultValue: '末页' })}
          </CustomButton>
        </div>

        <Dialog open={batchExportOpen} onOpenChange={setBatchExportOpen}>
          <h3 className="text-lg font-semibold text-sage-800 mb-4">{t('batchExportExcel', { defaultValue: '批量导出 Excel' })}</h3>
          <p className="text-sm text-sage-600 mb-3">{t('exportDateRange', { defaultValue: '按创建时间筛选' })}</p>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm text-sage-700">
              {t('startDate', { defaultValue: '开始日期' })}
              <input
                type="date"
                value={exportDateStart}
                onChange={(e) => setExportDateStart(e.target.value)}
                className="border border-sage-200 rounded px-2 py-1"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-sage-700">
              {t('endDate', { defaultValue: '结束日期' })}
              <input
                type="date"
                value={exportDateEnd}
                onChange={(e) => setExportDateEnd(e.target.value)}
                className="border border-sage-200 rounded px-2 py-1"
              />
            </label>
          </div>
          <CustomButton
            onClick={handleBatchExport}
            className="bg-sage-200 text-sage-800 hover:bg-sage-250 cursor-pointer"
          >
            {t('doExport', { defaultValue: '导出' })}
          </CustomButton>
        </Dialog>
          </div>
      </PageContent>
    </div>
  )
}
