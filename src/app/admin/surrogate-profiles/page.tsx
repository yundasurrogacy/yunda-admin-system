"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { getSurrogateMothers, insertSurrogateMother } from "@/lib/graphql/applications"
import { useRouter } from "next/navigation"
import type { SurrogateMother } from "@/types/surrogate_mother"
import { Search, Filter, User, Heart, Calendar, MapPin, Activity, Plus } from "lucide-react"
// import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { CustomButton } from "@/components/ui/CustomButton"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "react-i18next"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取辅助函数到组件外部，避免每次渲染重新创建
function getStatusColor(status: string): string {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800"
    case "matched":
      return "bg-blue-100 text-blue-800"
    case "inProgress":
      return "bg-purple-100 text-purple-800"
    case "completed":
      return "bg-sage-100 text-sage-800"
    case "onHold":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-sage-100 text-sage-800"
  }
}

function getHealthStatusColor(status: string): string {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800"
    case "good":
      return "bg-blue-100 text-blue-800"
    case "fair":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-sage-100 text-sage-800"
  }
}

// 计算年龄的辅助函数
function calculateAge(dateOfBirth: string | undefined): string {
  if (!dateOfBirth) return "-";
  const birth = new Date(dateOfBirth);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
  return String(age);
}

// 提取代孕母卡片为独立组件并使用 memo 优化
const SurrogateCard = memo(({ 
  surrogate, 
  onViewProfile, 
  onResetPassword,
  t 
}: { 
  surrogate: SurrogateMother
  onViewProfile: (id: number) => void
  onResetPassword: (id: number) => void
  t: any
}) => {
  const ci = surrogate.contact_information
  const ph = surrogate.pregnancy_and_health
  const age = calculateAge(ci?.date_of_birth)
  const photoUrl = surrogate.upload_photos?.[0]?.url
  
  return (
    <div className="bg-white rounded-lg border border-sage-200 p-6 flex flex-col justify-between shadow-sm w-full text-sage-800 font-medium" style={{minWidth: '0'}}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="avatar" className="w-12 h-12 object-cover rounded-full" />
            ) : (
              <User className="w-6 h-6 text-sage-600" />
            )}
          </div>
          <div>
            <h3 className="text-sage-800 font-semibold">{ci ? `${ci.first_name || ""} ${ci.last_name || ""}`.trim() : surrogate.id}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-sage-500 font-normal">ID: {surrogate.id}</span>
              <span className="text-sm text-sage-500 font-normal">•</span>
              <span className="text-sm text-sage-500 font-normal">{age !== "-" ? t('ageWithUnit', { age }) : t('unknownAge')}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-sage-500 font-normal">{ci?.city || "-"}, {ci?.state_or_province || "-"}, {ci?.country || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-normal">
          <MapPin className="w-4 h-4 text-sage-500" />
          <span className="text-sage-600">{t('country')}: {ci?.country || '-'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <Heart className="w-4 h-4 text-sage-500" />
          <span className="text-sage-600">{ph?.has_given_birth ? t('hasBirthHistory') : t('noBirthHistory')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <Calendar className="w-4 h-4 text-sage-500" />
          <span className="text-sage-600">{t('lastUpdate')}: {surrogate.updated_at?.slice(0, 10) || '-'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <Activity className="w-4 h-4 text-sage-500" />
          <span className="text-sage-600">BMI: {ci?.bmi ?? '-'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <span className="text-sage-600">{t('height')}: {ci?.height ?? '-'} {typeof ci?.height === 'string' && ci.height.includes("'") ? '' : t('ft')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <span className="text-sage-600">{t('weight')}: {ci?.weight ?? '-'} {t('lbs')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <span className="text-sage-600">{t('ethnicity')}: {ci?.ethnicity_selected_key ?? '-'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <span className="text-sage-600">{t('education')}: {surrogate.about_you?.education_level_selected_key ?? '-'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <span className="text-sage-600">{t('maritalStatus')}: {surrogate.about_you?.marital_status_selected_key ?? '-'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-normal">
          <span className="text-sage-600">{t('surrogacyExperience')}: {ci?.surrogacy_experience_count ?? '-'} {t('times')}</span>
        </div>
      </div>

      <div className="mb-2 font-normal">
        <span className="text-sage-600">{t('healthStatus')}: {ph?.medical_conditions_selected_keys?.join(', ') ?? '-'}</span>
      </div>
      <div className="mb-2 font-normal">
        <span className="text-sage-600">{t('backgroundCheck')}: {ph?.background_check_status_selected_key ?? '-'}</span>
      </div>
      <div className="mb-2 font-normal">
        <span className="text-sage-600">{t('birthHistory')}:</span>
        <ul className="list-disc ml-6">
          {ph?.pregnancy_histories?.length ? ph.pregnancy_histories.map((h, idx) => (
            <li key={idx} className="text-sage-600 text-sm font-normal">
              {h.delivery_date} | {h.delivery_method} | {h.number_of_babies}胎 | {h.birth_weight}{t('lbs')}
            </li>
          )) : <li className="text-sage-600 text-sm font-normal">-</li>}
        </ul>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
        <CustomButton
          className="text-sage-600 hover:text-sage-800 font-medium cursor-pointer bg-transparent"
          onClick={() => onViewProfile(surrogate.id)}
        >
          {t('ViewProfile')}
        </CustomButton>
        <CustomButton
          className="ml-2 text-sage-600 border border-sage-300 font-medium cursor-pointer bg-white"
          onClick={() => onResetPassword(surrogate.id)}
        >
          {t('resetPassword')}
        </CustomButton>
      </div>
    </div>
  )
})

SurrogateCard.displayName = 'SurrogateCard'

export default function SurrogateProfilesPage() {
  const { t, i18n } = useTranslation("common")
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  const [language, setLanguage] = useState<"en" | "cn">("en")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showDialog, setShowDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")
  const [selectedSurrogateId, setSelectedSurrogateId] = useState<number | null>(null)
  const [passwordError, setPasswordError] = useState("")
  const { register, handleSubmit, reset } = useForm()

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

  const text = {
    en: {
      title: "Surrogate Profiles",
      searchPlaceholder: "Search surrogates...",
      addNew: "Add New Surrogate",
      filterBy: "Filter by",
      status: "Status",
      age: "Age",
      location: "Location",
      experience: "Experience",
      available: "Available",
      matched: "Matched",
      inProgress: "In Progress",
      completed: "Completed",
      onHold: "On Hold",
      viewProfile: "View Profile",
      healthStatus: "Health Status",
      lastMedical: "Last Medical Check",
      previousBirths: "Previous Births",
      bmi: "BMI",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
    },
    cn: {
      title: "代孕者资料",
      searchPlaceholder: "搜索代孕者...",
      addNew: "添加新代孕者",
      filterBy: "筛选",
      status: "状态",
      age: "年龄",
      location: "地区",
      experience: "经验",
      available: "可匹配",
      matched: "已匹配",
      inProgress: "进行中",
      completed: "已完成",
      onHold: "暂停",
      viewProfile: "查看资料",
      healthStatus: "健康状况",
      lastMedical: "最近体检",
      previousBirths: "生育经历",
      bmi: "体重指数",
      excellent: "优秀",
      good: "良好",
      fair: "一般",
    }
  }


  // 分页相关
  const [allSurrogates, setAllSurrogates] = useState<SurrogateMother[]>([])
  const [surrogates, setSurrogates] = useState<SurrogateMother[]>([])
  const [searchValue, setSearchValue] = useState("")
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [pageSize, setPageSize] = useState(10)

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

  // 获取全部数据 - 只在认证后才加载
  useEffect(() => {
    async function fetchSurrogates() {
      if (isAuthenticated) {
      const data = await getSurrogateMothers(10000, 0)
      setAllSurrogates(data)
      }
    }
    fetchSurrogates()
  }, [isAuthenticated])

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存搜索和分页逻辑
  const filteredSurrogates = useMemo(() => {
    return allSurrogates.filter(surrogate => {
      const ci = surrogate.contact_information
      const name = `${ci?.first_name || ''} ${ci?.last_name || ''}`.trim()
      const city = ci?.city || ''
      const country = ci?.country || ''
      const id = String(surrogate.id)
      const keyword = searchValue.trim().toLowerCase()
      return (
        !keyword ||
        name.toLowerCase().includes(keyword) ||
        city.toLowerCase().includes(keyword) ||
        country.toLowerCase().includes(keyword) ||
        id.includes(keyword)
      )
    })
  }, [allSurrogates, searchValue])

  const { totalPages, pagedSurrogates } = useMemo(() => {
    const total = filteredSurrogates.length
    const pages = Math.max(1, Math.ceil(total / pageSize))
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return { totalPages: pages, pagedSurrogates: filteredSurrogates.slice(start, end) }
  }, [filteredSurrogates, page, pageSize])

  // 当总页数变化时，确保当前页不超过总页数
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
  }, [totalPages, page])

  // 使用 useCallback 缓存事件处理函数
  const handleAddNewSurrogate = useCallback(() => {
    setShowDialog(true)
  }, [])

  const handleViewProfile = useCallback((id: number) => {
    router.push(`/admin/surrogate-profiles/${id}`)
  }, [router])

  const handleOpenPasswordDialog = useCallback((id: number) => {
    setSelectedSurrogateId(id)
    setShowPasswordDialog(true)
  }, [])

  const handleClosePasswordDialog = useCallback(() => {
    setShowPasswordDialog(false)
    setPasswordValue("")
    setPasswordError("")
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value)
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

  const handleCancelDialog = useCallback(() => {
    setShowDialog(false)
    reset()
  }, [reset])

  const onSubmit = useCallback(async (formData: any) => {
    // 组装 surrogate_mothers 表结构
    const data = {
      contact_information: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        cell_phone_country_code: formData.cell_phone_country_code,
        cell_phone: formData.cell_phone,
        is_agree_cell_phone_receive_messages: !!formData.is_agree_cell_phone_receive_messages,
        email_address: formData.email_address,
        city: formData.city,
        country: formData.country,
        country_selected_key: formData.country_selected_key,
        state_or_province: formData.state_or_province,
        state_or_province_selected_key: formData.state_or_province_selected_key,
        zip_code: formData.zip_code,
        height: formData.height,
        weight: formData.weight,
        bmi: formData.bmi ? Number(formData.bmi) : undefined,
        ethnicity: formData.ethnicity,
        ethnicity_selected_key: formData.ethnicity_selected_key,
        surrogacy_experience_count: formData.surrogacy_experience_count ? Number(formData.surrogacy_experience_count) : undefined,
        us_citizen_or_visa_status: formData.us_citizen_or_visa_status,
        us_citizen_or_visa_status_selected_key: formData.us_citizen_or_visa_status_selected_key,
      },
      about_you: {
        contact_source: formData.contact_source,
        contact_source_selected_key: formData.contact_source_selected_key,
        occupation: formData.occupation,
        education_level: formData.education_level,
        education_level_selected_key: formData.education_level_selected_key,
        is_former_surrogate: !!formData.is_former_surrogate,
        surrogate_experience: formData.surrogate_experience,
        marital_status: formData.marital_status,
        marital_status_selected_key: formData.marital_status_selected_key,
        partner_support: formData.partner_support,
        partner_support_selected_key: formData.partner_support_selected_key,
        has_high_school_diploma: !!formData.has_high_school_diploma,
        household_income: formData.household_income,
        household_income_selected_key: formData.household_income_selected_key,
      },
      pregnancy_and_health: {
        has_given_birth: !!formData.has_given_birth,
        birth_details: formData.birth_details,
        is_currently_pregnant: !!formData.is_currently_pregnant,
        is_breastfeeding: !!formData.is_breastfeeding,
        has_stillbirth: !!formData.has_stillbirth,
        medical_conditions: formData.medical_conditions ? formData.medical_conditions.split(',') : [],
        medical_conditions_selected_keys: formData.medical_conditions_selected_keys ? formData.medical_conditions_selected_keys.split(',') : [],
        is_taking_medications: !!formData.is_taking_medications,
        medications_list: formData.medications_list,
        domestic_violence: !!formData.domestic_violence,
        substance_abuse: !!formData.substance_abuse,
        felony_charges: !!formData.felony_charges,
        outstanding_warrant: !!formData.outstanding_warrant,
        formal_probation: !!formData.formal_probation,
        arrests: !!formData.arrests,
        child_abuse_neglect: !!formData.child_abuse_neglect,
        child_protection_investigation: !!formData.child_protection_investigation,
        background_check_status: formData.background_check_status,
        background_check_status_selected_key: formData.background_check_status_selected_key,
        pregnancy_histories: [],
        serious_pregnancy_complications: !!formData.serious_pregnancy_complications,
        current_birth_control: formData.current_birth_control,
        closest_hospital: formData.closest_hospital,
        closest_nicu_iii: formData.closest_nicu_iii,
      },
      upload_photos: [],
      email: formData.email_address,
    }
    await insertSurrogateMother(data)
    setShowDialog(false)
    reset()
    // 刷新列表
    const dataList = await getSurrogateMothers(10000, 0)
    setAllSurrogates(dataList)
    setPage(1)
  }, [reset])

  const handleResetPassword = useCallback(async () => {
    if (!selectedSurrogateId || !passwordValue) {
      setPasswordError("请输入新密码")
      return
    }
    setPasswordLoading(true)
    setPasswordError("")
    try {
      const res = await fetch("/api/surrogate-mothers-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedSurrogateId, password: passwordValue })
      })
      const data = await res.json()
      if (res.ok && data?.update_surrogate_mothers?.affected_rows > 0) {
        setShowPasswordDialog(false)
        setPasswordValue("")
        setSelectedSurrogateId(null)
      } else {
        setPasswordError(data.error || "重置失败")
      }
    } catch (e) {
      alert("请求异常")
    } finally {
      setPasswordLoading(false)
    }
  }, [selectedSurrogateId, passwordValue, t])

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
          title={t('SURROGATE PROFILE')}
          className="text-2xl font-semibold text-sage-800"
        />
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-5 h-5" />
          <Input 
            type="text"
            placeholder={t('searchSurrogates')}
            className="pl-10 bg-white font-medium text-sage-800"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        {/* Surrogate Grid - 弹性布局美化 */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
            minHeight: '320px',
          }}
        >
          {pagedSurrogates.map((surrogate) => (
            <SurrogateCard
              key={surrogate.id}
              surrogate={surrogate}
              onViewProfile={handleViewProfile}
              onResetPassword={handleOpenPasswordDialog}
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

        {pagedSurrogates.length === 0 && (
          <div className="text-center py-8 text-sage-500">
            {t('noApplications', { defaultValue: '暂无记录' })}
          </div>
        )}
      {/* 新建代孕母弹窗表单 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-2xl shadow-2xl border border-sage-200 w-full max-w-lg md:max-w-2xl p-4 md:p-8 relative animate-fade-in overflow-y-auto max-h-[90vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-2xl font-bold text-sage-700 mb-4 text-center capitalize">新建代孕母用户</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">名字</label>
                  <input {...register('first_name')} placeholder="请输入名字" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">姓氏</label>
                  <input {...register('last_name')} placeholder="请输入姓氏" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">出生日期</label>
                  <input {...register('date_of_birth')} placeholder="请输入出生日期" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
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
                  <label className="text-sage-600 text-sm font-medium capitalize">邮编</label>
                  <input {...register('zip_code')} placeholder="请输入邮编" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">身高</label>
                  <input {...register('height')} placeholder="请输入身高" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">体重</label>
                  <input {...register('weight')} placeholder="请输入体重" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">BMI</label>
                  <input {...register('bmi')} placeholder="请输入BMI" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">种族</label>
                  <input {...register('ethnicity')} placeholder="请输入种族" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">种族枚举</label>
                  <input {...register('ethnicity_selected_key')} placeholder="请输入种族枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">代孕经验次数</label>
                  <input {...register('surrogacy_experience_count')} placeholder="请输入代孕经验次数" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">美国公民或签证身份</label>
                  <input {...register('us_citizen_or_visa_status')} placeholder="请输入身份" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">美国公民或签证身份枚举</label>
                  <input {...register('us_citizen_or_visa_status_selected_key')} placeholder="请输入身份枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                {/* 关于你自己 */}
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">联系来源</label>
                  <input {...register('contact_source')} placeholder="请输入联系来源" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">联系来源枚举</label>
                  <input {...register('contact_source_selected_key')} placeholder="请输入联系来源枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">职业</label>
                  <input {...register('occupation')} placeholder="请输入职业" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">最高学历</label>
                  <input {...register('education_level')} placeholder="请输入最高学历" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">最高学历枚举</label>
                  <input {...register('education_level_selected_key')} placeholder="请输入最高学历枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_former_surrogate')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">是否曾经是代孕母</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">代孕经验描述</label>
                  <input {...register('surrogate_experience')} placeholder="请输入代孕经验描述" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">婚姻状态</label>
                  <input {...register('marital_status')} placeholder="请输入婚姻状态" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">婚姻状态枚举</label>
                  <input {...register('marital_status_selected_key')} placeholder="请输入婚姻状态枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">伴侣支持状态</label>
                  <input {...register('partner_support')} placeholder="请输入伴侣支持状态" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">伴侣支持状态枚举</label>
                  <input {...register('partner_support_selected_key')} placeholder="请输入伴侣支持状态枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('has_high_school_diploma')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">是否有高中文凭</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">家庭收入范围</label>
                  <input {...register('household_income')} placeholder="请输入家庭收入范围" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">家庭收入范围枚举</label>
                  <input {...register('household_income_selected_key')} placeholder="请输入家庭收入范围枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                {/* 怀孕与健康经历 */}
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('has_given_birth')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">是否曾经分娩</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">分娩详情</label>
                  <input {...register('birth_details')} placeholder="请输入分娩详情" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_currently_pregnant')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">是否怀孕</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_breastfeeding')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">是否正在哺乳</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('has_stillbirth')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">是否有死胎经历</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">医疗状况(英文逗号分隔)</label>
                  <input {...register('medical_conditions')} placeholder="如: NONE,DIABETES" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">医疗状况枚举(英文逗号分隔)</label>
                  <input {...register('medical_conditions_selected_keys')} placeholder="如: NONE,DIABETES" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_taking_medications')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">是否正在服药</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">药物清单</label>
                  <input {...register('medications_list')} placeholder="请输入药物清单" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                {/* 法律与背景调查 */}
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('domestic_violence')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">家庭暴力</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('substance_abuse')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">药物滥用</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('felony_charges')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">重罪指控</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('outstanding_warrant')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">未执行逮捕令</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('formal_probation')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">正式缓刑</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('arrests')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">逮捕记录</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('child_abuse_neglect')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">虐待/忽视儿童</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('child_protection_investigation')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">儿童保护调查</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">背景调查状态</label>
                  <input {...register('background_check_status')} placeholder="请输入背景调查状态" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">背景调查状态枚举</label>
                  <input {...register('background_check_status_selected_key')} placeholder="请输入背景调查状态枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('serious_pregnancy_complications')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium capitalize">严重孕期并发症</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">当前避孕方式</label>
                  <input {...register('current_birth_control')} placeholder="请输入当前避孕方式" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">最近的医院</label>
                  <input {...register('closest_hospital')} placeholder="请输入最近的医院" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium capitalize">最近的三级NICU</label>
                  <input {...register('closest_nicu_iii')} placeholder="请输入最近的三级NICU" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition capitalize" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 mt-8">
                <CustomButton type="button" className="px-6 py-2 rounded-lg border border-sage-300 bg-white hover:bg-sage-50 cursor-pointer capitalize" onClick={handleCancelDialog}>{t('cancel')}</CustomButton>
                <CustomButton type="submit" className="bg-sage-600 text-white px-6 py-2 rounded-lg shadow hover:bg-sage-700 transition cursor-pointer capitalize">{t('save')}</CustomButton>
              </div>
            </form>
            <button className="absolute top-4 right-4 text-sage-400 hover:text-sage-600 text-xl cursor-pointer" onClick={handleCancelDialog}>&times;</button>
          </div>
        </div>
      </Dialog>

      {/* 重置密码弹窗 */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <>
            <h2 className="text-2xl font-bold text-sage-700 mb-6 text-center tracking-wide capitalize">{t('setOrResetPassword')}</h2>
            <Input
              type="password"
              placeholder={t('pleaseEnterNewPassword')}
              value={passwordValue}
              onChange={handlePasswordChange}
              className="mb-6 px-4 py-3 border-2 border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition w-full text-lg capitalize"
            />
            {passwordError && <div className="text-red-500 text-sm mb-2 text-center w-full capitalize">{passwordError}</div>}
            <div className="flex justify-end gap-4 w-full mt-2">
              <CustomButton className="px-6 py-2 rounded-lg text-base border border-sage-300 bg-white cursor-pointer capitalize" onClick={handleClosePasswordDialog}>
                {t('cancel')}
              </CustomButton>
              <CustomButton className="px-6 py-2 rounded-lg text-base bg-sage-600 text-white hover:bg-sage-700 cursor-pointer capitalize" onClick={handleResetPassword} disabled={passwordLoading}>
                {passwordLoading ? t('processing') : t('confirmReset')}
              </CustomButton>
            </div>
          </>
        </Dialog>
      </PageContent>
  )
}
