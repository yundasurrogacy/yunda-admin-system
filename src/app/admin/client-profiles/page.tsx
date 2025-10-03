"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getIntendedParents, insertIntendedParent } from "@/lib/graphql/applications"
import { Search, Filter, User, MapPin, Phone, Mail, Plus } from "lucide-react"
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
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
import { useAdminAuth } from "@/hooks/usePageAuth"

export default function ClientProfilesPage() {
  const { t } = useTranslation('common')
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [clients, setClients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetClientId, setResetClientId] = useState<number | null>(null)
  const [resetPassword, setResetPassword] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const router = useRouter()

  useEffect(() => {
    async function fetchClients() {
      const data = await getIntendedParents(10, 0)
      setClients(data)
    }
    fetchClients()
  }, [])

  const getStatusColor = (status: string) => {
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

  const getServiceColor = (service: string) => {
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

  const handleAddNewClient = () => {
    setShowDialog(true)
  }

  const onSubmit = async (formData: any) => {
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
    setShowDialog(false)
    reset()
    // 刷新列表
    const dataList = await getIntendedParents(10, 0)
    setClients(dataList)
  }

  // 重置密码弹窗提交
  const handleResetPassword = async () => {
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
        alert(t('resetPasswordSuccess'))
        setShowResetDialog(false)
        setResetPassword("")
        setResetClientId(null)
      } else {
        alert(t('resetPasswordFailed'))
      }
    } catch (e) {
      alert(t('requestError'))
    }
    setResetLoading(false)
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  // 未认证状态
  if (!isAuthenticated) {
    return null // 会被认证检查重定向
  }

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={t('CLIENT PROFILES')}
          // rightContent={
          //   <div className="flex items-center gap-4">
          //     <Button
          //       onClick={handleAddNewClient}
          //       className="bg-sage-200 text-sage-800 hover:bg-sage-250"
          //     >
          //       <Plus className="w-4 h-4 mr-2" />
          //       {t('addNewClient')}
          //     </Button>
          //     <DropdownMenu>
          //       <DropdownMenuTrigger asChild>
          //         <Button variant="outline" className="bg-white">
          //           <Filter className="w-4 h-4 mr-2" />
          //           {t('filterBy')}
          //         </Button>
          //       </DropdownMenuTrigger>
          //       <DropdownMenuContent align="end" className="w-48">
          //         <DropdownMenuItem>
          //           {t('status')}
          //         </DropdownMenuItem>
          //         <DropdownMenuItem>
          //           {t('serviceType')}
          //         </DropdownMenuItem>
          //         <DropdownMenuItem>
          //           {t('location')}
          //         </DropdownMenuItem>
          //       </DropdownMenuContent>
          //     </DropdownMenu>
          //   </div>
          // }
        />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-5 h-5" />
          <Input 
            type="text"
            placeholder={t('searchClients')}
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Client Grid - 自适应卡片布局 */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {clients
            .filter(client => {
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
            .map((client) => {
              const basic = client.basic_information || {}
              const contact = client.contact_information || {}
              const family = client.family_profile || {}
              const service = client.program_interests?.interested_services_selected_keys || "-"
              return (
                <div
                  key={client.id}
                  className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-7 w-7 text-sage-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg text-sage-800 truncate">{basic.firstName} {basic.lastName}</div>
                      <div className="text-sage-500 text-sm truncate">{client.id}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="bg-sage-100 text-sage-700 px-3 py-1 text-xs rounded-full">{t('active')}</span>
                      <span className={`px-3 py-1 text-xs rounded-full ${getServiceColor(service)}`}>{t(service)}</span>
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
                      <Button
                        variant="link"
                        className="text-sage-700 px-0"
                        onClick={() => router.push(`/admin/client-profiles/${client.id}`)}
                      >
                        {t('viewProfile')}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-sage-700 px-2 py-1 border-sage-300"
                        onClick={() => { setShowResetDialog(true); setResetClientId(client.id); }}
                      >
                        {t('resetPassword')}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* 新建准父母弹窗表单 */}
        {/* 重置密码弹窗 */}
        {showResetDialog && (
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <h2 className="text-xl font-bold text-sage-700 mb-4 text-center">{t('resetClientPassword')}</h2>
            <div className="flex flex-col gap-4">
              <input
                type="password"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
                placeholder={t('pleaseEnterNewPassword')}
                className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" className="px-6 py-2 rounded-lg border-sage-300 hover:bg-sage-50" onClick={() => { setShowResetDialog(false); setResetPassword(""); setResetClientId(null); }}>{t('cancel')}</Button>
              <Button type="button" className="bg-sage-600 text-white px-6 py-2 rounded-lg shadow hover:bg-sage-700 transition" onClick={handleResetPassword} disabled={resetLoading || !resetPassword}>{resetLoading ? t('resetting') : t('confirmReset')}</Button>
            </div>
          </Dialog>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-2xl shadow-2xl border border-sage-200 w-full max-w-lg md:max-w-2xl p-4 md:p-8 relative animate-fade-in overflow-y-auto max-h-[90vh]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold text-sage-700 mb-4 text-center">新建准父母用户</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">名字</label>
                    <input {...register('firstName')} placeholder="请输入名字" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">姓氏</label>
                    <input {...register('lastName')} placeholder="请输入姓氏" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">代词</label>
                    <input {...register('pronouns')} placeholder="请输入代词" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">代词枚举</label>
                    <input {...register('pronouns_selected_key')} placeholder="请输入代词枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">性别认同</label>
                    <input {...register('gender_identity')} placeholder="请输入性别认同" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">性别认同枚举</label>
                    <input {...register('gender_identity_selected_key')} placeholder="请输入性别认同枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">出生日期</label>
                    <input {...register('date_of_birth')} placeholder="请输入出生日期" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">族裔</label>
                    <input {...register('ethnicity')} placeholder="请输入族裔" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">族裔枚举</label>
                    <input {...register('ethnicity_selected_key')} placeholder="请输入族裔枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
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
                    <label className="text-sage-600 text-sm font-medium">主要语言(英文逗号分隔)</label>
                    <input {...register('primary_languages')} placeholder="如: Chinese,English" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">主要语言枚举(英文逗号分隔)</label>
                    <input {...register('primary_languages_selected_keys')} placeholder="如: zh,en" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">性取向</label>
                    <input {...register('sexual_orientation')} placeholder="请输入性取向" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">性取向枚举</label>
                    <input {...register('sexual_orientation_selected_key')} placeholder="请输入性取向枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
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
                    <label className="text-sage-600 text-sm font-medium">感兴趣服务</label>
                    <input {...register('interested_services')} placeholder="请输入感兴趣服务" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">服务枚举</label>
                    <input {...register('interested_services_selected_keys')} placeholder="请输入服务枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">旅程开始时间</label>
                    <input {...register('journey_start_timing')} placeholder="请输入旅程开始时间" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">旅程开始时间枚举</label>
                    <input {...register('journey_start_timing_selected_key')} placeholder="请输入旅程开始时间枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">期望孩子数量</label>
                    <input {...register('desired_children_count')} placeholder="请输入期望孩子数量" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">期望孩子数量枚举</label>
                    <input {...register('desired_children_count_selected_key')} placeholder="请输入期望孩子数量枚举" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">推荐来源</label>
                    <input {...register('referral_source')} placeholder="请输入推荐来源" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sage-600 text-sm font-medium">初步问题</label>
                    <input {...register('initial_questions')} placeholder="请输入初步问题" className="border border-sage-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 transition" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 mt-8">
                  <Button type="button" variant="outline" className="px-6 py-2 rounded-lg border-sage-300 hover:bg-sage-50" onClick={() => { setShowDialog(false); reset(); }}>取消</Button>
                  <Button type="submit" className="bg-sage-600 text-white px-6 py-2 rounded-lg shadow hover:bg-sage-700 transition">保存</Button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      </PageContent>
    </AdminLayout>
  )
}
