"use client"

import { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
// import i18n from '@/i18n'
import i18n from '@/i18n'
import { useRouter } from 'next/navigation'
import { Search, Filter, User, Mail, Phone, MapPin, Plus, Eye, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'
import { AdminLayout } from '../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { Button } from '@/components/ui/button'
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
  useEffect(() => {
    console.log('页面 i18n.language:', i18n.language)
    const handleLangChange = () => {
      console.log('页面监听到语言切换:', i18n.language)
      setLang(i18n.language)
    }
    i18n.on("languageChanged", handleLangChange)
    return () => i18n.off("languageChanged", handleLangChange)
  }, [])

  useEffect(() => {
    loadApplications()
  }, [statusFilter])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const data = await getParentsApplications(50, 0, status)
      setApplications(data)
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

  const filteredApplications = applications.filter(app => {
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
    // console.log('t(loading):', t('loading'));
    return (
      <AdminLayout key={lang}>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">{t('loading', { defaultValue: '加载中...' })}</div>
            {/* <div className="text-lg">{t('loading', { defaultValue: 'Loading...' })}</div> */}
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
              <Button
                onClick={() => window.open('https://www.yundasurrogacy.com/be-parents', '_blank')}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('addNewApplication', { defaultValue: '添加新申请' })}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Filter className="w-4 h-4 mr-2" />
                    {t('filterBy', { defaultValue: '筛选' })}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    {t('allStatus', { defaultValue: '全部状态' })}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    {t('pending', { defaultValue: '待审核' })}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                    {t('approved', { defaultValue: '已通过' })}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                    {t('rejected', { defaultValue: '已拒绝' })}
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
          }}
        >
          {filteredApplications.map((app) => {
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
                        <Button 
                          size="sm" 
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t('approve', { defaultValue: '通过' })}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          {t('reject', { defaultValue: '拒绝' })}
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="link" 
                      className="text-sage-600 hover:text-sage-800"
                      onClick={() => router.push(`/admin/parents-applications/${app.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t('viewDetails', { defaultValue: '查看详情' })}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-sage-500">
            {t('noApplications', { defaultValue: '暂无申请记录' })}
          </div>
        )}
  </PageContent>
  {/* 弹窗已移除 */}
    </AdminLayout>
  )
}
