"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { getIntendedParents, insertIntendedParent } from "@/lib/graphql/applications"
import { Search, Filter, User, MapPin, Phone, Mail, Plus } from "lucide-react"
// import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { CustomButton } from "@/components/ui/CustomButton"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { useTranslation } from 'react-i18next'

// 获取 cookie 的辅助函数
  function getCookie(name: string) {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : undefined;
  }

// 提取辅助函数到组件外部，避免每次渲染重新创建
function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "onHold":
      return "bg-yellow-100 text-yellow-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-sage-100 text-sage-800"
  }
}

function getServiceColor(service: string): string {
  switch (service) {
    case "surrogacy":
      return "bg-purple-100 text-purple-800"
    case "eggDonation":
      return "bg-pink-100 text-pink-800"
    case "both":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-sage-100 text-sage-800"
  }
}

// 提取客户卡片为独立组件并使用 memo 优化
const ClientCard = memo(({ 
  client, 
  onViewProfile, 
  onResetPassword,
  t 
}: { 
  client: any
  onViewProfile: (id: number) => void
  onResetPassword: (id: number) => void
  t: any
}) => {
  const basic = client.basic_information || {}
  const contact = client.contact_information || {}
  const family = client.family_profile || {}
  const service = client.program_interests?.interested_services_selected_keys || "-"
  
  return (
    <div className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-7 w-7 text-sage-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg text-sage-800 truncate">{basic.firstName} {basic.lastName}</div>
          <div className="text-sage-500 text-sm truncate">{client.id}</div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {/* <span className="bg-sage-100 text-sage-700 px-3 py-1 text-xs rounded-full">{t('active')}</span> */}
          {/* <span className={`px-3 py-1 text-xs rounded-full ${getServiceColor(service)}`}>{t(service)}</span> */}
        </div>
      </div>
      <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
        <div className="flex items-center gap-2 truncate">
          <Mail className="w-4 h-4 text-sage-400" />
          <span className="truncate">{contact.email_address}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Phone className="w-4 h-4 text-sage-400" />
          <span className="truncate">{contact.cell_phone_country_code ? `+${contact.cell_phone_country_code} ` : ""}{contact.cell_phone}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-sage-400" />
          <span className="truncate">{family.city}, {family.state_or_province}, {family.country}</span>
        </div>
      </div>
      <hr className="my-3 border-sage-100" />
      <div className="flex items-center justify-between text-sage-500 text-sm">
        <span>
          {t('lastUpdate')}:<br />{client.updated_at?.slice(0, 10) || "-"}
        </span>
        <div className="flex gap-2">
          <CustomButton
            className="text-sage-700 px-0 cursor-pointer bg-transparent"
            onClick={() => onViewProfile(client.id)}
          >
            {t('ViewProfile')}
          </CustomButton>
          <CustomButton
            className="text-sage-700 px-2 py-1 border border-sage-300 cursor-pointer bg-white"
            onClick={() => onResetPassword(client.id)}
          >
            {t('resetPassword')}
          </CustomButton>
        </div>
      </div>
    </div>
  )
})

ClientCard.displayName = 'ClientCard'

export default function ClientProfilesPage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  // 分页相关
  const [allClients, setAllClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [pageSize, setPageSize] = useState(10)
  const [showDialog, setShowDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetClientId, setResetClientId] = useState<number | null>(null)
  const [resetPassword, setResetPassword] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  // Toast 通知状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  // 显示Toast提示
  const showToastMessage = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

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

  // 获取所有数据 - 只在认证后才加载
  useEffect(() => {
    async function fetchClients() {
      if (isAuthenticated) {
        setIsLoading(true)
        try {
          const data = await getIntendedParents(10000, 0)
          setAllClients(data)
        } catch (error) {
          console.error('Failed to fetch clients:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchClients()
  }, [isAuthenticated])

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 搜索和分页逻辑 - 使用 useMemo 缓存
  const filteredAllClients = useMemo(() => {
    return allClients.filter(client => {
      const basic = client.basic_information || {}
      const contact = client.contact_information || {}
      const name = `${basic.firstName || ''} ${basic.lastName || ''}`.toLowerCase()
      const phone = `${contact.cell_phone_country_code || ''}${contact.cell_phone || ''}`.toLowerCase()
      return (
        name.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm.toLowerCase()) ||
        (contact.email_address || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [allClients, searchTerm])

  const { total, totalPages, pagedClients } = useMemo(() => {
    const totalCount = filteredAllClients.length
    const pages = Math.max(1, Math.ceil(totalCount / pageSize))
    const paged = filteredAllClients.slice((page - 1) * pageSize, page * pageSize)
    return { total: totalCount, totalPages: pages, pagedClients: paged }
  }, [filteredAllClients, page, pageSize])

  // 当总页数变化时，确保当前页不超过总页数
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
  }, [totalPages, page])

  // 使用 useCallback 缓存事件处理函数
  const handleAddNewClient = useCallback(() => {
    setShowDialog(true)
  }, [])

  const handleViewProfile = useCallback((id: number) => {
    router.push(`/admin/client-profiles/${id}`)
  }, [router])

  const handleOpenResetDialog = useCallback((id: number) => {
    setShowResetDialog(true)
    setResetClientId(id)
  }, [])

  const handleCloseResetDialog = useCallback(() => {
    setShowResetDialog(false)
    setResetPassword("")
    setResetClientId(null)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }, [])

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

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPassword(e.target.value)
  }, [])

  const handleCancelDialog = useCallback(() => {
    setShowDialog(false)
    reset()
  }, [reset])

  const onSubmit = useCallback(async (formData: any) => {
    // 组装 intended_parents 表结构
    const data = {
      basic_information: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        pronouns: formData.pronouns,
        pronouns_selected_key: formData.pronouns_selected_key,
        gender_identity: formData.gender_identity,
        gender_identity_selected_key: formData.gender_identity_selected_key,
        date_of_birth: formData.date_of_birth,
        ethnicity: formData.ethnicity,
        ethnicity_selected_key: formData.ethnicity_selected_key,
      },
      contact_information: {
        cell_phone_country_code: formData.cell_phone_country_code,
        cell_phone: formData.cell_phone,
        is_agree_cell_phone_receive_messages: !!formData.is_agree_cell_phone_receive_messages,
        email_address: formData.email_address,
        primary_languages: formData.primary_languages ? formData.primary_languages.split(',') : [],
        primary_languages_selected_keys: formData.primary_languages_selected_keys ? formData.primary_languages_selected_keys.split(',') : [],
      },
      family_profile: {
        sexual_orientation: formData.sexual_orientation,
        sexual_orientation_selected_key: formData.sexual_orientation_selected_key,
        city: formData.city,
        country: formData.country,
        country_selected_key: formData.country_selected_key,
        state_or_province: formData.state_or_province,
        state_or_province_selected_key: formData.state_or_province_selected_key,
      },
      program_interests: {
        interested_services: formData.interested_services,
        interested_services_selected_keys: formData.interested_services_selected_keys,
        journey_start_timing: formData.journey_start_timing,
        journey_start_timing_selected_key: formData.journey_start_timing_selected_key,
        desired_children_count: formData.desired_children_count,
        desired_children_count_selected_key: formData.desired_children_count_selected_key,
      },
      referral: {
        referral_source: formData.referral_source,
        initial_questions: formData.initial_questions,
      },
      email: formData.email_address,
    }
    await insertIntendedParent(data)
    showToastMessage(t('clientCreatedSuccessfully') || '准父母创建成功！', 'success')
    setShowDialog(false)
    reset()
    // 刷新列表
    const dataList = await getIntendedParents(10000, 0)
    setAllClients(dataList)
    setPage(1)
  }, [reset, showToastMessage, t])

  // 重置密码弹窗提交
  const handleResetPassword = useCallback(async () => {
    if (!resetClientId || !resetPassword) return
    setResetLoading(true)
    try {
      const res = await fetch("/api/intended-parents-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resetClientId, password: resetPassword })
      })
      const result = await res.json()
      if (res.ok && result?.update_intended_parents?.affected_rows > 0) {
        showToastMessage(t('resetPasswordSuccess') || '密码重置成功！', 'success')
        setShowResetDialog(false)
        setResetPassword("")
        setResetClientId(null)
      } else {
        showToastMessage(t('resetPasswordFailed') || '密码重置失败', 'error')
      }
    } catch (e) {
      showToastMessage(t('requestError') || '请求异常，请稍后重试', 'error')
    }
    setResetLoading(false)
  }, [resetClientId, resetPassword, t, showToastMessage])

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
          title={t('CLIENT PROFILE')}
        />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-5 h-5" />
          <Input 
            type="text"
            placeholder={t('searchClients')}
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
              <div className="text-lg text-sage-700">{t('loading')}</div>
            </div>
          </div>
        ) : pagedClients.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="text-sage-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-xl text-sage-600 font-medium mb-2">{t('noApplications', { defaultValue: '暂无申请记录' })}</p>
              <p className="text-sm text-sage-400 mb-6">{t('noApplicationsDesc', { defaultValue: '当前筛选条件下没有找到记录' })}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Client Grid - 自适应卡片布局 */}
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'stretch',
              }}
            >
              {pagedClients.map((client: any) => (
                <ClientCard
                    key={client.id}
                  client={client}
                  onViewProfile={handleViewProfile}
                  onResetPassword={handleOpenResetDialog}
                  t={t}
                />
              ))}
            </div>

            {/* 分页控件 */}
            <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
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
                  className="w-14 px-2 py-1 border border-sage-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-sage-300"
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
          </>
        )}

        {/* 新建准父母弹窗表单 */}
        {/* 重置密码弹窗 */}
        {showResetDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-sage-200 w-full max-w-md p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-sage-700 mb-6 text-center">{t('resetClientPassword')}</h2>
              <div className="flex flex-col gap-6 mb-6">
                <input
                  type="password"
                  value={resetPassword}
                  onChange={handlePasswordChange}
                  placeholder={t('pleaseEnterNewPassword')}
                  className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition"
                />
              </div>
              <div className="flex justify-end gap-3">
                <CustomButton type="button" className="px-6 py-2 rounded-lg border border-sage-300 bg-white hover:bg-sage-50 cursor-pointer" onClick={handleCloseResetDialog}>{t('cancel')}</CustomButton>
                <CustomButton type="button" className="bg-sage-600 text-white px-6 py-2 rounded-lg shadow hover:bg-sage-700 transition cursor-pointer" onClick={handleResetPassword} disabled={resetLoading || !resetPassword}>{resetLoading ? t('resetting') : t('confirmReset')}</CustomButton>
              </div>
            </div>
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={() => {}}>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-2xl shadow-2xl border border-sage-200 w-full max-w-lg md:max-w-2xl p-4 md:p-8 relative animate-fade-in overflow-y-auto max-h-[90vh]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold text-sage-700 mb-4 text-center capitalize">新建准父母用户</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">名字</label>
                    <input {...register('firstName')} placeholder="请输入名字" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">姓氏</label>
                    <input {...register('lastName')} placeholder="请输入姓氏" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">代词</label>
                    <input {...register('pronouns')} placeholder="请输入代词" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">代词枚举</label>
                    <input {...register('pronouns_selected_key')} placeholder="请输入代词枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">性别认同</label>
                    <input {...register('gender_identity')} placeholder="请输入性别认同" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">性别认同枚举</label>
                    <input {...register('gender_identity_selected_key')} placeholder="请输入性别认同枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">出生日期</label>
                    <input {...register('date_of_birth')} placeholder="请输入出生日期" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">族裔</label>
                    <input {...register('ethnicity')} placeholder="请输入族裔" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">族裔枚举</label>
                    <input {...register('ethnicity_selected_key')} placeholder="请输入族裔枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">国际区号</label>
                    <input {...register('cell_phone_country_code')} placeholder="请输入国际区号" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">手机号</label>
                    <input {...register('cell_phone')} placeholder="请输入手机号" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input {...register('is_agree_cell_phone_receive_messages')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                    <label className="text-sage-600 text-sm font-medium capitalize">同意接收短信</label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">邮箱</label>
                    <input {...register('email_address')} placeholder="请输入邮箱" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">主要语言(英文逗号分隔)</label>
                    <input {...register('primary_languages')} placeholder="如: Chinese,English" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">主要语言枚举(英文逗号分隔)</label>
                    <input {...register('primary_languages_selected_keys')} placeholder="如: zh,en" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">性取向</label>
                    <input {...register('sexual_orientation')} placeholder="请输入性取向" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">性取向枚举</label>
                    <input {...register('sexual_orientation_selected_key')} placeholder="请输入性取向枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">城市</label>
                    <input {...register('city')} placeholder="请输入城市" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">国家</label>
                    <input {...register('country')} placeholder="请输入国家" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">国家枚举</label>
                    <input {...register('country_selected_key')} placeholder="请输入国家枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">州/省</label>
                    <input {...register('state_or_province')} placeholder="请输入州/省" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">州/省枚举</label>
                    <input {...register('state_or_province_selected_key')} placeholder="请输入州/省枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">感兴趣服务</label>
                    <input {...register('interested_services')} placeholder="请输入感兴趣服务" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">服务枚举</label>
                    <input {...register('interested_services_selected_keys')} placeholder="请输入服务枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">旅程开始时间</label>
                    <input {...register('journey_start_timing')} placeholder="请输入旅程开始时间" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">旅程开始时间枚举</label>
                    <input {...register('journey_start_timing_selected_key')} placeholder="请输入旅程开始时间枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">期望孩子数量</label>
                    <input {...register('desired_children_count')} placeholder="请输入期望孩子数量" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">期望孩子数量枚举</label>
                    <input {...register('desired_children_count_selected_key')} placeholder="请输入期望孩子数量枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">推荐来源</label>
                    <input {...register('referral_source')} placeholder="请输入推荐来源" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium capitalize">初步问题</label>
                    <input {...register('initial_questions')} placeholder="请输入初步问题" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 mt-8">
                  <CustomButton type="button" className="px-6 py-2 rounded-lg border border-sage-300 bg-white hover:bg-sage-50 cursor-pointer capitalize" onClick={handleCancelDialog}>取消</CustomButton>
                  <CustomButton type="submit" className="bg-sage-600 text-white px-6 py-2 rounded-lg shadow hover:bg-sage-700 transition cursor-pointer capitalize">保存</CustomButton>
                </div>
              </form>
            </div>
          </div>
        </Dialog>

        {/* Toast 通知组件 */}
        {showToast && (
          <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
            <div className={`px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-[300px] max-w-[500px] ${
              toastType === 'success' 
                ? 'bg-green-50 border-green-400 text-green-800' 
                : toastType === 'error'
                ? 'bg-red-50 border-red-400 text-red-800'
                : 'bg-yellow-50 border-yellow-400 text-yellow-800'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                toastType === 'success' 
                  ? 'bg-green-100' 
                  : toastType === 'error'
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
              }`}>
                {toastType === 'success' && (
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {toastType === 'error' && (
                  <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {toastType === 'warning' && (
                  <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium flex-1">{toastMessage}</span>
              <button
                onClick={() => setShowToast(false)}
                className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors ${
                  toastType === 'success' 
                    ? 'hover:bg-green-600' 
                    : toastType === 'error'
                    ? 'hover:bg-red-600'
                    : 'hover:bg-yellow-600'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </PageContent>
  )
}
