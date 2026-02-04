"use client"

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { useTranslation } from "react-i18next"
// import i18n from '@/i18n'
import i18n from '@/i18n'
import { useRouter } from 'next/navigation'
import { Search, User, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { CustomButton } from '@/components/ui/CustomButton'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getParentsApplications, updateApplicationStatus } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}


// 提取获取状态颜色的辅助函数到组件外部
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

// 提取 ApplicationCard 组件并使用 memo 优化
interface ApplicationCardProps {
  app: Application;
  currentLang: string;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (id: number) => void;
  onDelete: (id: number) => void;
  t: any;
}

const ApplicationCard = memo(({ app, currentLang, onApprove, onReject, onViewDetails, onDelete, t }: ApplicationCardProps) => {
  // 使用 useMemo 缓存数据处理，避免每次渲染都重新计算
  const processedData = useMemo(() => {
    const appData = app.application_data as any;
    const basicInfo = appData?.basic_information || {};
    const contactInfo = appData?.contact_information || {};
    const familyProfile = appData?.family_profile || {};
    const programInterests = appData?.program_interests || {};
    const referral = appData?.referral || {};
    
    // 格式化多选项
    const languages = Array.isArray(contactInfo.primary_languages) 
      ? contactInfo.primary_languages.join(', ') 
      : (contactInfo.primary_languages || t('notAvailable', { defaultValue: 'N/A' }));
    const ethnicity = Array.isArray(basicInfo.ethnicity) 
      ? basicInfo.ethnicity.join(', ') 
      : (basicInfo.ethnicity || t('notAvailable', { defaultValue: 'N/A' }));

    return {
      basicInfo,
      contactInfo,
      familyProfile,
      programInterests,
      referral,
      languages,
      ethnicity
    };
  }, [app.application_data, t]);

  const { basicInfo, contactInfo, familyProfile, programInterests, referral, languages, ethnicity } = processedData;

  // 使用 useMemo 缓存服务类型文本映射
  const serviceText = useMemo(() => {
    const serviceMap: Record<string, string> = {
      surrogacyOnly: t('surrogacyService', { defaultValue: '代孕服务' }),
      surrogacyEggDonor: t('surrogacyEggDonorService', { defaultValue: '代孕+捐卵服务' }),
      eggDonorOnly: t('eggDonorService', { defaultValue: '捐卵服务' }),
      thirdPartySurrogate: t('thirdPartySurrogate', { defaultValue: '第三方代孕' }),
      bringYourOwnSurrogate: t('bringYourOwnSurrogate', { defaultValue: '自带代孕者' }),
      bringYourOwnSurrogateEgg: t('bringYourOwnSurrogateEgg', { defaultValue: '自带代孕者+捐卵' }),
      notSure: t('notSure', { defaultValue: '不确定' })
    };
    return serviceMap[programInterests.interested_services] || programInterests.interested_services;
  }, [programInterests.interested_services, t]);

  return (
    <div className="bg-white rounded-xl border border-sage-200 p-6 flex flex-col justify-between shadow-sm w-full" style={{minWidth: '0'}}>
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <h3 className="text-sage-800 font-medium text-lg truncate">
                {basicInfo.firstName} {basicInfo.lastName}
              </h3>
              <span className="text-sm text-sage-500">#{app.id}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
            {t(app.status, { defaultValue: app.status })}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-sage-600 truncate">
            <Mail className="w-4 h-4" />
            <span className="truncate">{contactInfo.email_address || t('notAvailable', { defaultValue: 'N/A' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-sage-600">
            <Phone className="w-4 h-4" />
            <span>{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || t('notAvailable', { defaultValue: 'N/A' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-sage-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{familyProfile.city || t('notAvailable', { defaultValue: 'N/A' })}, {familyProfile.state_or_province || t('notAvailable', { defaultValue: 'N/A' })}, {familyProfile.country || t('notAvailable', { defaultValue: 'N/A' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-sage-600">
            <Calendar className="w-4 h-4" />
            <span>{t('dob')}: {basicInfo.date_of_birth || t('notAvailable')}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sage-500">{t('genderIdentity')}:</span>
            <span className="text-sage-600 truncate">{basicInfo.gender_identity || t('notAvailable')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sage-500">{t('ethnicity')}:</span>
            <span className="text-sage-600 truncate">{ethnicity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sage-500">{t('sexualOrientation')}:</span>
            <span className="text-sage-600 truncate">{familyProfile.sexual_orientation || t('notAvailable')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-sage-500">{t('languages')}:</span>
            <span className="text-sage-600 truncate">{languages}</span>
          </div>
        </div>
        <div className="mb-4 p-3 bg-sage-50 rounded-lg">
          <div className="text-sm text-sage-700">
            <div className="font-medium mb-1">{t('serviceNeeds')}:</div>
            <div className="text-sage-600">
              {serviceText}
            </div>
            <div className="text-xs text-sage-500 mt-1">
              {t('desiredChildrenCount')}: {programInterests.desired_children_count || t('notAvailable')} | 
              {t('journeyStartTiming')}: {programInterests.journey_start_timing || t('notAvailable')}
            </div>
          </div>
        </div>
        <div className="mb-2 text-sm text-sage-700">
          {t('referralSource')}: {referral.referral_source || t('notAvailable')}<br />
          {t('initialQuestions')}: {referral.initial_questions || t('notAvailable')}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
        <span className="text-sm text-sage-500">
          {t('applicationDate', { defaultValue: '申请时间' })}: {new Date(app.created_at).toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : 'en-US')}
        </span>
        <div className="flex gap-2 flex-wrap">
          {app.status === 'pending' && (
            <>
              <CustomButton 
                className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer px-3 py-1 text-sm rounded"
                onClick={() => onApprove(app.id)}
              >
                {t('approve', { defaultValue: '通过' })}
              </CustomButton>
              <CustomButton 
                className="text-red-600 hover:bg-red-50 cursor-pointer border border-red-200 bg-white px-3 py-1 text-sm rounded"
                onClick={() => onReject(app.id)}
              >
                {t('reject', { defaultValue: '拒绝' })}
              </CustomButton>
            </>
          )}
          <CustomButton 
            className="text-sage-600 hover:text-sage-800 cursor-pointer bg-transparent"
            onClick={() => onViewDetails(app.id)}
          >
            {t('viewDetails', { defaultValue: '查看详情' })}
          </CustomButton>
          <CustomButton
            className="text-red-600 hover:bg-red-50 cursor-pointer bg-transparent"
            onClick={() => onDelete(app.id)}
          >
            {t('delete', { defaultValue: 'Delete' })}
          </CustomButton>
        </div>
      </div>
    </div>
  );
});
ApplicationCard.displayName = 'ApplicationCard';

export default function ParentsApplicationsPage() {
  const router = useRouter()
  const [lang, setLang] = useState(i18n.language)
  // 每次lang变化都重新获取t
  const { t } = useTranslation("common")
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  // 弹窗逻辑已移除
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // 分页相关
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [pageSize, setPageSize] = useState(10)

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
      // 卡片宽度约340px+gap，左右padding 32px
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
    console.log('页面 i18n.language:', i18n.language)
    const handleLangChange = () => {
      console.log('页面监听到语言切换:', i18n.language)
      setLang(i18n.language)
    }
    i18n.on("languageChanged", handleLangChange)
    return () => i18n.off("languageChanged", handleLangChange)
  }, [])

  // 分页和搜索应在原始数据上进行
  const [allApplications, setAllApplications] = useState<Application[]>([])

  // 使用 useCallback 缓存数据加载函数
  const loadApplications = useCallback(async (forceReload = false) => {
    if (!forceReload && dataLoaded) return;
    
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const allData = await getParentsApplications(10000, 0, status)
      console.log('[ParentsApplications] 加载的数据:', allData?.length || 0, '条记录')
      setAllApplications(allData || []) // 确保数据不为 undefined
      setDataLoaded(true)
    } catch (error) {
      console.error('Failed to load applications:', error)
      setAllApplications([]) // 出错时设置为空数组
    } finally {
      setLoading(false)
      console.log('[ParentsApplications] 加载完成，loading设置为false')
    }
  }, [statusFilter, dataLoaded])

  // 在认证成功后加载数据
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

  // 使用 useMemo 缓存过滤和分页计算，优化搜索性能
  const { filteredApplications, total, totalPages, pagedApplications } = useMemo(() => {
    // 如果没有搜索词，直接返回所有数据
    if (!debouncedSearchTerm.trim()) {
      const totalCount = allApplications.length
      const pages = Math.max(1, Math.ceil(totalCount / pageSize))
      const paged = allApplications.slice((page - 1) * pageSize, page * pageSize)
      
      return {
        filteredApplications: allApplications,
        total: totalCount,
        totalPages: pages,
        pagedApplications: paged
      }
    }

    // 有搜索词时才进行过滤
    const searchLower = debouncedSearchTerm.toLowerCase().trim()
    const filtered = allApplications.filter(app => {
      const appData = app.application_data as any
      const basicInfo = appData?.basic_information || {}
      const contactInfo = appData?.contact_information || {}
      const familyProfile = appData?.family_profile || {}
      const programInterests = appData?.program_interests || {}
      const referral = appData?.referral || {}
      
      // 优化搜索逻辑，减少重复的 toLowerCase 调用
      return (
        basicInfo.firstName?.toLowerCase().includes(searchLower) ||
        basicInfo.lastName?.toLowerCase().includes(searchLower) ||
        contactInfo.email_address?.toLowerCase().includes(searchLower) ||
        contactInfo.cell_phone?.includes(searchTerm) ||
        familyProfile.city?.toLowerCase().includes(searchLower) ||
        familyProfile.country?.toLowerCase().includes(searchLower) ||
        familyProfile.state_or_province?.toLowerCase().includes(searchLower) ||
        basicInfo.gender_identity?.toLowerCase().includes(searchLower) ||
        basicInfo.ethnicity?.toLowerCase().includes(searchLower) ||
        (Array.isArray(contactInfo.primary_languages) 
          ? contactInfo.primary_languages.join(',').toLowerCase().includes(searchLower)
          : contactInfo.primary_languages?.toLowerCase().includes(searchLower)) ||
        programInterests.interested_services?.toLowerCase().includes(searchLower) ||
        referral.referral_source?.toLowerCase().includes(searchLower)
      )
    })

    // 分页计算
    const totalCount = filtered.length
    const pages = Math.max(1, Math.ceil(totalCount / pageSize))
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

    return {
      filteredApplications: filtered,
      total: totalCount,
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
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
  }, [totalPages, page])

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

  // 使用 useCallback 缓存卡片操作函数
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
      if (!response.ok)
        throw new Error(await response.text())
      await loadApplications(true)
      window.alert(t('deleteSuccess', { defaultValue: 'Application deleted successfully.' }))
    }
    catch (error) {
      console.error('Failed to delete application:', error)
      window.alert(t('deleteFailed', { defaultValue: 'Failed to delete application, please try again.' }))
    }
  }, [loadApplications, t])

  const handleViewDetails = useCallback((id: number) => {
    router.push(`/admin/parents-applications/${id}`)
  }, [router])

  const handleAddNewApplication = useCallback(() => {
    window.open('https://www.yundasurrogacy.com/be-parents', '_blank')
  }, [])

  const handleFilterChange = useCallback((key: ApplicationStatus | 'all') => {
    setStatusFilter(key)
    setFilterMenuOpen(false)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

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

  // 数据加载中 - 只在首次加载时显示全屏加载
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
          title={t('parentsApplications', { defaultValue: '意向父母申请表' })}
          rightContent={
            <div className="flex items-center gap-4">
              <CustomButton
                onClick={handleAddNewApplication}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250 cursor-pointer"
              >
                {t('addNewApplication', { defaultValue: '添加新申请' })}
              </CustomButton>
              <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <CustomButton className="bg-white cursor-pointer border border-sage-300 text-sage-800">
                    {t('filterBy', { defaultValue: '筛选' })}
                  </CustomButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white" style={{ background: '#fff', opacity: 1 }}>
                  {[
                    { key: 'all', label: t('allStatus', { defaultValue: '全部状态' }) },
                    { key: 'pending', label: t('pending', { defaultValue: '待审核' }) },
                    { key: 'approved', label: t('approved', { defaultValue: '已通过' }) },
                    { key: 'rejected', label: t('rejected', { defaultValue: '已拒绝' }) },
                  ].map(opt => (
                    <DropdownMenuItem
                      key={opt.key}
                      onClick={() => handleFilterChange(opt.key as ApplicationStatus | 'all')}
                      className={
                        `cursor-pointer px-4 py-2 transition-colors duration-150 rounded-lg bg-white ` +
                        (statusFilter === opt.key
                          ? 'text-sage-900 font-semibold shadow-md'
                          : 'text-sage-700 hover:bg-sage-50')
                      }
                      style={{ background: '#fff', opacity: 1 }}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
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
            className="pl-10 bg-white"
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
            // Applications Grid - 使用优化后的 ApplicationCard 组件
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
              <ApplicationCard
                key={app.id}
                app={app}
                currentLang={i18n.language}
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
