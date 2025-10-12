"use client"

import { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
// import i18n from '@/i18n'
import i18n from '@/i18n'
import { useRouter } from 'next/navigation'
import { Search, Filter, User, Mail, Phone, MapPin, Plus, Eye, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'
import { AdminLayout } from '../../../components/admin-layout'
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
import { getParentsApplications, updateApplicationStatus, insertIntendedParent } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'

import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'

interface AddIntendedParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type FormType = {
  basic_information: {
    firstName: string;
    lastName: string;
    date_of_birth: string;
  };
  contact_information: {
    email_address: string;
    cell_phone: string;
  };
  family_profile: {
    city: string;
    country: string;
  };
  program_interests: {
    interested_services: string;
    journey_start_timing: string;
    desired_children_count: string;
  };
  referral: {
    referral_source: string;
    initial_questions: string;
  };
};

export default function ParentsApplicationsPage() {
  const router = useRouter()
  const [lang, setLang] = useState(i18n.language)
  // 每次lang变化都重新获取t
  const { t } = useTranslation("common")
  // 弹窗逻辑已移除
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  // 分页相关
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [pageSize, setPageSize] = useState(10)

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
  useEffect(() => {
    loadApplications()
  }, [statusFilter])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const allData = await getParentsApplications(10000, 0, status)
      setAllApplications(allData)
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, newStatus)
      await loadApplications() // 重新加载数据
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  // 先过滤再分页
  const filteredAllApplications = allApplications.filter(app => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    const appData = app.application_data as any
    const basicInfo = appData?.basic_information || {}
    const contactInfo = appData?.contact_information || {}
    const familyProfile = appData?.family_profile || {}
    const programInterests = appData?.program_interests || {}
    const referral = appData?.referral || {}
    // 支持更多字段搜索
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
      contactInfo.primary_languages?.join(',').toLowerCase().includes(searchLower) ||
      programInterests.interested_services?.toLowerCase().includes(searchLower) ||
      referral.referral_source?.toLowerCase().includes(searchLower)
    )
  })

  // 分页
  const total = filteredAllApplications.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pagedApplications = filteredAllApplications.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
  }, [totalPages, page])

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />{t('pending', { defaultValue: '待审核' })}</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{t('approved', { defaultValue: '已通过' })}</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />{t('rejected', { defaultValue: '已拒绝' })}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusColor = (status: ApplicationStatus) => {
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

  if (loading) {
    return (
      <AdminLayout key={lang}>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">{t('loading', { defaultValue: '加载中...' })}</div>
          </div>
        </PageContent>
      </AdminLayout>
    )
  }


  return (
    <AdminLayout key={lang}>
      <PageContent>
        <PageHeader 
          title={t('parentsApplications', { defaultValue: '意向父母申请表' })}
          rightContent={
            <div className="flex items-center gap-4">
              <CustomButton
                onClick={() => window.open('https://www.yundasurrogacy.com/be-parents', '_blank')}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250 cursor-pointer"
              >
                {/* <Plus className="w-4 h-4 mr-2" /> */}
                {t('addNewApplication', { defaultValue: '添加新申请' })}
              </CustomButton>
              <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <CustomButton className="bg-white cursor-pointer border border-sage-300 text-sage-800">
                    {/* <Filter className="w-4 h-4 mr-2" /> */}
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
                      onClick={() => {
                        setStatusFilter(opt.key as ApplicationStatus | 'all');
                        setFilterMenuOpen(false);
                      }}
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Applications Grid */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
            minHeight: '320px',
          }}
        >
          {pagedApplications.map((app) => {
            const appData = app.application_data as any
            const basicInfo = appData?.basic_information || {}
            const contactInfo = appData?.contact_information || {}
            const familyProfile = appData?.family_profile || {}
            const programInterests = appData?.program_interests || {}
            const referral = appData?.referral || {}
            // 格式化多选项
            const languages = Array.isArray(contactInfo.primary_languages) ? contactInfo.primary_languages.join(', ') : (contactInfo.primary_languages || t('notAvailable', { defaultValue: 'N/A' }))
            const ethnicity = Array.isArray(basicInfo.ethnicity) ? basicInfo.ethnicity.join(', ') : (basicInfo.ethnicity || t('notAvailable', { defaultValue: 'N/A' }))
            return (
              <div key={app.id} className="bg-white rounded-xl border border-sage-200 p-6 flex flex-col justify-between shadow-sm w-full" style={{minWidth: '0'}}>
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
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>{t(app.status, { defaultValue: app.status })}</span>
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
                        {programInterests.interested_services === 'surrogacyOnly' && t('surrogacyService', { defaultValue: '代孕服务' })}
                        {programInterests.interested_services === 'surrogacyEggDonor' && t('surrogacyEggDonorService', { defaultValue: '代孕+捐卵服务' })}
                        {programInterests.interested_services === 'eggDonorOnly' && t('eggDonorService', { defaultValue: '捐卵服务' })}
                        {programInterests.interested_services === 'thirdPartySurrogate' && t('thirdPartySurrogate', { defaultValue: '第三方代孕' })}
                        {programInterests.interested_services === 'bringYourOwnSurrogate' && t('bringYourOwnSurrogate', { defaultValue: '自带代孕者' })}
                        {programInterests.interested_services === 'bringYourOwnSurrogateEgg' && t('bringYourOwnSurrogateEgg', { defaultValue: '自带代孕者+捐卵' })}
                        {programInterests.interested_services === 'notSure' && t('notSure', { defaultValue: '不确定' })}
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
                    {t('applicationDate', { defaultValue: '申请时间' })}: {new Date(app.created_at).toLocaleDateString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US')}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {app.status === 'pending' && (
                      <>
                        <CustomButton 
                          className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer px-3 py-1 text-sm rounded"
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                        >
                          {/* <CheckCircle className="w-3 h-3 mr-1" /> */}
                          {t('approve', { defaultValue: '通过' })}
                        </CustomButton>
                        <CustomButton 
                          className="text-red-600 hover:bg-red-50 cursor-pointer border border-red-200 bg-white px-3 py-1 text-sm rounded"
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        >
                          {/* <XCircle className="w-3 h-3 mr-1" /> */}
                          {t('reject', { defaultValue: '拒绝' })}
                        </CustomButton>
                      </>
                    )}
                    <CustomButton 
                      className="text-sage-600 hover:text-sage-800 cursor-pointer bg-transparent"
                      onClick={() => router.push(`/admin/parents-applications/${app.id}`)}
                    >
                      {/* <Eye className="w-4 h-4 mr-1" /> */}
                      {t('viewDetails', { defaultValue: '查看详情' })}
                    </CustomButton>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 分页控件 */}
        <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={page === 1}
            onClick={() => {
              const newPage = Math.max(1, page - 1)
              setPage(newPage)
              setPageInput(String(newPage))
            }}
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
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '')
                setPageInput(val)
              }}
              onBlur={e => {
                let val = Number(e.target.value)
                if (isNaN(val) || val < 1) val = 1
                if (val > totalPages) val = totalPages
                setPage(val)
                setPageInput(String(val))
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  let val = Number((e.target as HTMLInputElement).value)
                  if (isNaN(val) || val < 1) val = 1
                  if (val > totalPages) val = totalPages
                  setPage(val)
                  setPageInput(String(val))
                }
              }}
              className="w-14 px-2 py-1 border border-sage-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-sage-300"
              aria-label={t('pagination.jumpToPage', { defaultValue: '跳转到页码' })}
            />
            {t('pagination.of', { defaultValue: '共' })} {totalPages} {t('pagination.pages', { defaultValue: '页' })}
          </span>
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={page >= totalPages}
            onClick={() => {
              const newPage = Math.min(totalPages, page + 1)
              setPage(newPage)
              setPageInput(String(newPage))
            }}
          >
            {t('pagination.nextPage', { defaultValue: '下一页' })}
          </CustomButton>
        </div>

        {pagedApplications.length === 0 && (
          <div className="text-center py-8 text-sage-500">
            {t('noApplications', { defaultValue: '暂无申请记录' })}
          </div>
        )}
  </PageContent>
  {/* 弹窗已移除 */}
    </AdminLayout>
  )
}
