"use client"

import { useState, useEffect } from "react"
import { getSurrogateMothers, insertSurrogateMother } from "@/lib/graphql/applications"
import { useRouter } from "next/navigation"
import type { SurrogateMother } from "@/types/surrogate_mother"
import { Search, Filter, User, Heart, Calendar, MapPin, Activity, Plus } from "lucide-react"
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SurrogateProfilesPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showDialog, setShowDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")
  // const [selectedSurrogateId, setSelectedSurrogateId] = useState<bigint | null>(null)
  const [selectedSurrogateId, setSelectedSurrogateId] = useState<number | null>(null)
  const [passwordError, setPasswordError] = useState("")
  const { register, handleSubmit, reset } = useForm()

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

  const [surrogates, setSurrogates] = useState<SurrogateMother[]>([])
  const router = useRouter()
  useEffect(() => {
    async function fetchSurrogates() {
      const data = await getSurrogateMothers(10, 0)
      setSurrogates(data)
    }
    fetchSurrogates()
  }, [])

  const handleAddNewSurrogate = () => {
    setShowDialog(true)
  }

  const onSubmit = async (formData: any) => {
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
    const dataList = await getSurrogateMothers(10, 0)
    setSurrogates(dataList)
  }

  const handleResetPassword = async () => {
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
  }

  const getStatusColor = (status: string) => {
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

  const getHealthStatusColor = (status: string) => {
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

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={text[language].title}
          rightContent={
            <div className="flex items-center gap-4">
              <Button
                onClick={handleAddNewSurrogate}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250"
              >
                <Plus className="w-4 h-4 mr-2" />
                {text[language].addNew}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Filter className="w-4 h-4 mr-2" />
                    {text[language].filterBy}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    {text[language].status}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].age}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].location}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].experience}
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
            placeholder={text[language].searchPlaceholder}
            className="pl-10 bg-white"
          />
        </div>

        {/* Surrogate Grid - 弹性布局美化 */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {surrogates.map((surrogate) => {
            const ci = surrogate.contact_information
            const ph = surrogate.pregnancy_and_health
            // 计算年龄
            let age = "-"
            if (ci?.date_of_birth) {
              const birth = new Date(ci.date_of_birth)
              const now = new Date()
              age = String(now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0))
            }
            // 展示照片
            const photoUrl = surrogate.upload_photos?.[0]?.url
            return (
              <div key={surrogate.id} className="bg-white rounded-lg border border-sage-200 p-6 flex flex-col justify-between shadow-sm w-full" style={{minWidth: '0'}}>
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
                      <h3 className="text-sage-800 font-medium">{ci ? `${ci.first_name || ""} ${ci.last_name || ""}`.trim() : surrogate.id}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-sage-500">ID: {surrogate.id}</span>
                        <span className="text-sm text-sage-500">•</span>
                        <span className="text-sm text-sage-500">{age !== "-" ? `${age}岁` : "年龄未知"}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-sage-500">{ci?.city || "-"}, {ci?.state_or_province || "-"}, {ci?.country || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600">{ci?.country || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600">{ph?.has_given_birth ? "有分娩经历" : "无分娩经历"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600">最近更新: {surrogate.updated_at?.slice(0, 10) || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600">BMI: {ci?.bmi ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-600">身高: {ci?.height ?? "-"}cm</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-600">体重: {ci?.weight ?? "-"}kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-600">种族: {ci?.ethnicity_selected_key ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-600">学历: {surrogate.about_you?.education_level_selected_key ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-600">婚姻: {surrogate.about_you?.marital_status_selected_key ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-600">代孕经验: {ci?.surrogacy_experience_count ?? "-"} 次</span>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-sage-600">健康状况: {ph?.medical_conditions_selected_keys?.join(", ") ?? "-"}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sage-600">背景调查: {ph?.background_check_status_selected_key ?? "-"}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sage-600">分娩历史:</span>
                  <ul className="list-disc ml-6">
                    {ph?.pregnancy_histories?.length ? ph.pregnancy_histories.map((h, idx) => (
                      <li key={idx} className="text-sage-600 text-sm">
                        {h.delivery_date} | {h.delivery_method} | {h.number_of_babies}胎 | {h.birth_weight}kg
                      </li>
                    )) : <li className="text-sage-600 text-sm">-</li>}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
                  <Button
                    variant="link"
                    className="text-sage-600 hover:text-sage-800"
                    onClick={() => router.push(`/admin/surrogate-profiles/${surrogate.id}`)}
                  >
                    {text[language].viewProfile}
                  </Button>
                  <Button
                    variant="outline"
                    className="ml-2 text-sage-600 border-sage-300"
                    onClick={() => {
                      setSelectedSurrogateId(surrogate.id)
                      setShowPasswordDialog(true)
                    }}
                  >
                    设置/重置密码
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      {/* 新建代孕母弹窗表单 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-2xl shadow-2xl border border-sage-200 w-full max-w-lg md:max-w-2xl p-4 md:p-8 relative animate-fade-in overflow-y-auto max-h-[90vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-2xl font-bold text-sage-700 mb-4 text-center">新建代孕母用户</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">名字</label>
                  <input {...register('first_name')} placeholder="请输入名字" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">姓氏</label>
                  <input {...register('last_name')} placeholder="请输入姓氏" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">出生日期</label>
                  <input {...register('date_of_birth')} placeholder="请输入出生日期" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">国际区号</label>
                  <input {...register('cell_phone_country_code')} placeholder="请输入国际区号" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">手机号</label>
                  <input {...register('cell_phone')} placeholder="请输入手机号" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_agree_cell_phone_receive_messages')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">同意接收短信</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">邮箱</label>
                  <input {...register('email_address')} placeholder="请输入邮箱" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">城市</label>
                  <input {...register('city')} placeholder="请输入城市" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">国家</label>
                  <input {...register('country')} placeholder="请输入国家" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">国家枚举</label>
                  <input {...register('country_selected_key')} placeholder="请输入国家枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">州/省</label>
                  <input {...register('state_or_province')} placeholder="请输入州/省" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">州/省枚举</label>
                  <input {...register('state_or_province_selected_key')} placeholder="请输入州/省枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">邮编</label>
                  <input {...register('zip_code')} placeholder="请输入邮编" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">身高</label>
                  <input {...register('height')} placeholder="请输入身高" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">体重</label>
                  <input {...register('weight')} placeholder="请输入体重" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">BMI</label>
                  <input {...register('bmi')} placeholder="请输入BMI" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">种族</label>
                  <input {...register('ethnicity')} placeholder="请输入种族" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">种族枚举</label>
                  <input {...register('ethnicity_selected_key')} placeholder="请输入种族枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">代孕经验次数</label>
                  <input {...register('surrogacy_experience_count')} placeholder="请输入代孕经验次数" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">美国公民或签证身份</label>
                  <input {...register('us_citizen_or_visa_status')} placeholder="请输入身份" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">美国公民或签证身份枚举</label>
                  <input {...register('us_citizen_or_visa_status_selected_key')} placeholder="请输入身份枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                {/* 关于你自己 */}
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">联系来源</label>
                  <input {...register('contact_source')} placeholder="请输入联系来源" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">联系来源枚举</label>
                  <input {...register('contact_source_selected_key')} placeholder="请输入联系来源枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">职业</label>
                  <input {...register('occupation')} placeholder="请输入职业" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">最高学历</label>
                  <input {...register('education_level')} placeholder="请输入最高学历" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">最高学历枚举</label>
                  <input {...register('education_level_selected_key')} placeholder="请输入最高学历枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_former_surrogate')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">是否曾经是代孕母</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">代孕经验描述</label>
                  <input {...register('surrogate_experience')} placeholder="请输入代孕经验描述" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">婚姻状态</label>
                  <input {...register('marital_status')} placeholder="请输入婚姻状态" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">婚姻状态枚举</label>
                  <input {...register('marital_status_selected_key')} placeholder="请输入婚姻状态枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">伴侣支持状态</label>
                  <input {...register('partner_support')} placeholder="请输入伴侣支持状态" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">伴侣支持状态枚举</label>
                  <input {...register('partner_support_selected_key')} placeholder="请输入伴侣支持状态枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('has_high_school_diploma')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">是否有高中文凭</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">家庭收入范围</label>
                  <input {...register('household_income')} placeholder="请输入家庭收入范围" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">家庭收入范围枚举</label>
                  <input {...register('household_income_selected_key')} placeholder="请输入家庭收入范围枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                {/* 怀孕与健康经历 */}
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('has_given_birth')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">是否曾经分娩</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">分娩详情</label>
                  <input {...register('birth_details')} placeholder="请输入分娩详情" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_currently_pregnant')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">是否怀孕</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_breastfeeding')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">是否正在哺乳</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('has_stillbirth')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">是否有死胎经历</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">医疗状况(英文逗号分隔)</label>
                  <input {...register('medical_conditions')} placeholder="如: NONE,DIABETES" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">医疗状况枚举(英文逗号分隔)</label>
                  <input {...register('medical_conditions_selected_keys')} placeholder="如: NONE,DIABETES" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('is_taking_medications')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">是否正在服药</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">药物清单</label>
                  <input {...register('medications_list')} placeholder="请输入药物清单" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                {/* 法律与背景调查 */}
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('domestic_violence')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">家庭暴力</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('substance_abuse')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">药物滥用</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('felony_charges')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">重罪指控</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('outstanding_warrant')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">未执行逮捕令</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('formal_probation')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">正式缓刑</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('arrests')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">逮捕记录</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('child_abuse_neglect')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">虐待/忽视儿童</label>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('child_protection_investigation')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">儿童保护调查</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">背景调查状态</label>
                  <input {...register('background_check_status')} placeholder="请输入背景调查状态" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">背景调查状态枚举</label>
                  <input {...register('background_check_status_selected_key')} placeholder="请输入背景调查状态枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input {...register('serious_pregnancy_complications')} type="checkbox" className="accent-sage-600 w-5 h-5" />
                  <label className="text-sage-600 text-sm font-medium">严重孕期并发症</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">当前避孕方式</label>
                  <input {...register('current_birth_control')} placeholder="请输入当前避孕方式" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">最近的医院</label>
                  <input {...register('closest_hospital')} placeholder="请输入最近的医院" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sage-600 text-sm font-medium">最近的三级NICU</label>
                  <input {...register('closest_nicu_iii')} placeholder="请输入最近的三级NICU" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 mt-8">
                <Button type="button" variant="outline" className="px-6 py-2 rounded-lg border-sage-300 hover:bg-sage-50" onClick={() => { setShowDialog(false); reset(); }}>取消</Button>
                <Button type="submit" className="bg-sage-600 text-white px-6 py-2 rounded-lg shadow hover:bg-sage-700 transition">保存</Button>
              </div>
            </form>
            <button className="absolute top-4 right-4 text-sage-400 hover:text-sage-600 text-xl" onClick={() => { setShowDialog(false); reset(); }}>&times;</button>
          </div>
        </div>
      </Dialog>

      {/* 重置密码弹窗 */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <>
            <h2 className="text-2xl font-bold text-sage-700 mb-6 text-center tracking-wide">设置/重置密码</h2>
            <Input
              type="password"
              placeholder="请输入新密码"
              value={passwordValue}
              onChange={e => setPasswordValue(e.target.value)}
              className="mb-6 px-4 py-3 border-2 border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition w-full text-lg"
            />
            {passwordError && <div className="text-red-500 text-sm mb-2 text-center w-full">{passwordError}</div>}
            <div className="flex justify-end gap-4 w-full mt-2">
              <Button variant="outline" className="px-6 py-2 rounded-lg text-base" onClick={() => { setShowPasswordDialog(false); setPasswordValue(""); setPasswordError(""); }}>
                取消
              </Button>
              <Button className="px-6 py-2 rounded-lg text-base bg-sage-600 text-white hover:bg-sage-700" onClick={handleResetPassword} disabled={passwordLoading}>
                {passwordLoading ? "处理中..." : "确认"}
              </Button>
            </div>
          </>
        </Dialog>
      </PageContent>
    </AdminLayout>
  )
}
