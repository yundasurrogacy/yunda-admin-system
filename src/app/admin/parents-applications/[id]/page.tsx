"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'
// import { AdminLayout } from '../../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { CustomButton } from '@/components/ui/CustomButton'
import { Badge } from '@/components/ui/badge'
import { getApplicationById, updateApplicationStatus } from '@/lib/graphql/applications'
import { exportDetailToExcel, exportDetailToPdf, type DetailExportRow } from '@/lib/exports/applications'
import type { Application, ApplicationStatus } from '@/types/applications'
import { useTranslation } from 'react-i18next'

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

function getServiceName(service: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  const serviceMap: { [key: string]: string } = {
    surrogacyOnly: t('surrogacyService', { defaultValue: 'Surrogacy Service' }),
    surrogacyEggDonor: t('surrogacyEggDonorService', { defaultValue: 'Surrogacy + Egg Donor Service' }),
    eggDonorOnly: t('eggDonorService', { defaultValue: 'Egg Donor Service' }),
    thirdPartySurrogate: t('thirdPartySurrogate', { defaultValue: 'Third Party Surrogate' }),
    bringYourOwnSurrogate: t('bringYourOwnSurrogate', { defaultValue: 'Bring Your Own Surrogate' }),
    bringYourOwnSurrogateEgg: t('bringYourOwnSurrogateEgg', { defaultValue: 'Bring Your Own Surrogate + Egg Donor' }),
    notSure: t('notSure', { defaultValue: 'Not Sure' }),
  }
  return serviceMap[service] || service
}

function getTimingName(timing: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  const timingMap: { [key: string]: string } = {
    immediately: t('timing.immediately', { defaultValue: 'Immediately' }),
    'within-3-months': t('timing.within3Months', { defaultValue: 'Within 3 months' }),
    'within-6-months': t('timing.within6Months', { defaultValue: 'Within 6 months' }),
    'within-1-year': t('timing.within1Year', { defaultValue: 'Within 1 year' }),
    flexible: t('timing.flexible', { defaultValue: 'Flexible' }),
  }
  return timingMap[timing] || timing
}

function getChildrenCountName(count: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  const countMap: { [key: string]: string } = {
    one: t('childrenCount.one', { defaultValue: '1' }),
    two: t('childrenCount.two', { defaultValue: '2' }),
    three: t('childrenCount.three', { defaultValue: '3' }),
    four: t('childrenCount.four', { defaultValue: '4' }),
    open: t('childrenCount.open', { defaultValue: 'Open' }),
  }
  return countMap[count] || count
}

export default function ParentsApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [language, setLanguage] = useState<"en" | "cn">("cn")
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation('common')
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

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

  // 使用 useCallback 缓存数据加载函数
  const loadApplication = useCallback(async (id: number) => {
    try {
      setLoading(true)
      const data = await getApplicationById(id)
      setApplication(data)
    } catch (error) {
      console.error('Failed to load application:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 只在认证后才加载数据
    if (params.id && isAuthenticated) {
      loadApplication(Number(params.id))
    }
  }, [params.id, isAuthenticated, loadApplication])

  useEffect(() => {
    const handleLangChange = (lng: string) => {
      setLanguage(lng === 'zh-CN' ? 'cn' : 'en')
    }
    i18n.on('languageChanged', handleLangChange)
    setLanguage(i18n.language === 'zh-CN' ? 'cn' : 'en')
    return () => {
      i18n.off('languageChanged', handleLangChange)
    }
  }, [i18n])

  // 使用 useCallback 缓存状态更新函数
  const handleStatusUpdate = useCallback(async (newStatus: ApplicationStatus) => {
    if (!application) return
    
    try {
      await updateApplicationStatus(application.id, newStatus)
      await loadApplication(application.id) // 重新加载数据
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }, [application, loadApplication])

  const searchParams = useSearchParams()
  const fromPage = searchParams.get('fromPage') || '1'
  const getReturnPage = useCallback(() => {
    if (typeof window === 'undefined') return fromPage
    const saved = sessionStorage.getItem('parents-list-return-page')
    if (saved) return saved
    return fromPage
  }, [fromPage])
  const listUrlWithPage = `/admin/parents-applications?page=${getReturnPage()}`

  // 使用 useCallback 缓存导航函数（返回时带上原列表页码，优先 sessionStorage）
  const handleBack = useCallback(() => {
    const page = getReturnPage()
    router.push(`/admin/parents-applications?page=${page}`)
  }, [router, getReturnPage])

  const handleApprove = useCallback(() => {
    handleStatusUpdate('approved')
  }, [handleStatusUpdate])

  const handleReject = useCallback(() => {
    handleStatusUpdate('rejected')
  }, [handleStatusUpdate])

  const handleDelete = useCallback(async () => {
    if (!application)
      return
    const confirmed = window.confirm(t('confirmDeleteApplication', { defaultValue: 'Delete this application?' }))
    if (!confirmed)
      return
    try {
      const response = await fetch(`/api/applications?id=${application.id}`, { method: 'DELETE' })
      if (!response.ok)
        throw new Error(await response.text())
      window.alert(t('deleteSuccess', { defaultValue: 'Application deleted successfully.' }))
      router.push(`/admin/parents-applications?page=${getReturnPage()}`)
    }
    catch (error) {
      console.error('Failed to delete application:', error)
      window.alert(t('deleteFailed', { defaultValue: 'Failed to delete application, please try again.' }))
    }
  }, [application, router, t, getReturnPage])

  const formatYesNoValue = useCallback((value: unknown) => {
    if (value === true || value === 'Yes' || value === 'yes')
      return t('yes', { defaultValue: 'Yes' })
    if (value === false || value === 'No' || value === 'no')
      return t('no', { defaultValue: 'No' })
    if (value === null || value === undefined || value === '')
      return t('notAvailable', { defaultValue: 'N/A' })
    return String(value)
  }, [t])

  // 使用 useMemo 缓存解析后的应用数据，避免每次渲染重新解析（必须在 buildExportRows 之前声明）
  const parsedData = useMemo(() => {
    if (!application) return null

    const appData = application.application_data as any
    const basicInfo = appData?.basic_information || {}
    const contactInfo = appData?.contact_information || {}
    const familyProfile = appData?.family_profile || {}
    const programInterests = appData?.program_interests || {}
    const referral = appData?.referral || {}
    const embryoMedicalStatus = appData?.embryo_medical_status || {}

    const languages = Array.isArray(contactInfo.primary_languages)
      ? contactInfo.primary_languages.join(', ')
      : (contactInfo.primary_languages || 'N/A')
    const ethnicity = Array.isArray(basicInfo.ethnicity)
      ? basicInfo.ethnicity.join(', ')
      : (basicInfo.ethnicity || 'N/A')
    const preferredContactMethod = contactInfo.preferred_contact_method
      ? contactInfo.preferred_contact_method.split(',').join(', ')
      : 'N/A'

    return {
      basicInfo,
      contactInfo,
      familyProfile,
      programInterests,
      referral,
      embryoMedicalStatus,
      languages,
      ethnicity,
      preferredContactMethod
    }
  }, [application])

  const formattedDates = useMemo(() => {
    if (!application) return { createdAt: '', updatedAt: '' }
    return {
      createdAt: new Date(application.created_at).toLocaleString('zh-CN'),
      updatedAt: new Date(application.updated_at).toLocaleString('zh-CN')
    }
  }, [application])

  const buildExportRows = useCallback((): DetailExportRow[] => {
    if (!application || !parsedData)
      return []
    const { basicInfo, contactInfo, familyProfile, programInterests, referral, embryoMedicalStatus, languages, ethnicity, preferredContactMethod } = parsedData
    const rows: DetailExportRow[] = []
    const pushRow = (section: string, label: string, value: string) => {
      rows.push({ section, label, value: value || t('notAvailable', { defaultValue: 'N/A' }) })
    }

    const basicSection = t('basicInformation')
    pushRow(basicSection, t('firstName'), basicInfo.firstName || '')
    pushRow(basicSection, t('lastName'), basicInfo.lastName || '')
    pushRow(basicSection, t('pronouns'), basicInfo.pronouns || '')
    pushRow(basicSection, t('genderIdentity'), basicInfo.gender_identity || '')
    pushRow(basicSection, t('dateOfBirth'), basicInfo.date_of_birth || '')
    pushRow(basicSection, t('ethnicity'), ethnicity || '')

    const contactSection = t('contactInformation')
    pushRow(contactSection, t('email'), contactInfo.email_address || '')
    pushRow(contactSection, t('phone'), `${contactInfo.cell_phone_country_code || ''} ${contactInfo.cell_phone || ''}`.trim())
    pushRow(contactSection, t('languages'), languages || '')
    pushRow(contactSection, t('preferredContactMethod', 'Preferred contact method'), preferredContactMethod || '')

    const familySection = t('familyProfile')
    pushRow(familySection, t('sexualOrientation'), familyProfile.sexual_orientation || '')
    pushRow(familySection, t('relationshipStatus', 'Relationship Status'), familyProfile.relationship_status || '')
    pushRow(familySection, t('city'), familyProfile.city || '')
    pushRow(familySection, t('country'), familyProfile.country || '')
    pushRow(familySection, t('state'), familyProfile.state_or_province || '')

    const programSection = t('programInterests')
    pushRow(programSection, t('interestedServices', 'Interested Services'), getServiceName(programInterests.interested_services || '', t))
    pushRow(programSection, t('journeyStartTiming'), getTimingName(programInterests.journey_start_timing || '', t))
    pushRow(programSection, t('desiredChildrenCount'), getChildrenCountName(programInterests.desired_children_count || '', t))

    const embryoSection = t('embryoMedicalStatus', 'Embryo & Medical Status')
    pushRow(embryoSection, t('hasEmbryos', 'Has Embryos'), formatYesNoValue(embryoMedicalStatus.has_embryos))
    if (embryoMedicalStatus.has_embryos === 'Yes' || embryoMedicalStatus.has_embryos === true) {
      pushRow(embryoSection, t('embryoClinicName', 'Embryo Clinic Name'), embryoMedicalStatus.embryo_clinic_name || '')
      pushRow(embryoSection, t('embryoCount', 'Embryo Count'), embryoMedicalStatus.embryo_count || '')
      pushRow(embryoSection, t('pgtStatus', 'PGT Status'), formatYesNoValue(embryoMedicalStatus.pgt_status))
    }
    pushRow(embryoSection, t('hasFertilityClinic', 'Has Fertility Clinic'), formatYesNoValue(embryoMedicalStatus.has_fertility_clinic))
    if (embryoMedicalStatus.has_fertility_clinic === 'Yes' || embryoMedicalStatus.has_fertility_clinic === true) {
      pushRow(embryoSection, t('fertilityClinicName', 'Fertility Clinic Name'), embryoMedicalStatus.fertility_clinic_name || '')
    }

    const referralSection = t('referral')
    pushRow(referralSection, t('referralSource'), referral.referral_source || '')
    pushRow(referralSection, t('initialQuestions'), referral.initial_questions || '')

    const timeSection = t('applicationDate')
    pushRow(timeSection, t('applicationDate'), formattedDates.createdAt || '')
    pushRow(timeSection, t('lastUpdate'), formattedDates.updatedAt || '')

    return rows
  }, [application, parsedData, t, formattedDates, formatYesNoValue])

  const handleExportDetail = useCallback((format: 'excel' | 'pdf') => {
    const rows = buildExportRows()
    if (!rows.length) {
      window.alert(t('noRecords', { defaultValue: 'No records' }))
      return
    }
    const dateStamp = new Date().toISOString().split('T')[0]
    const baseName = `parent-application-${application?.id || 'detail'}-${dateStamp}`
    const title = `${t('parentsApplications')} #${application?.id || ''}`
    if (format === 'excel')
      exportDetailToExcel(rows, `${baseName}.xlsx`)
    else
      exportDetailToPdf(title, rows, `${baseName}.pdf`)
  }, [application?.id, buildExportRows, t])

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

  // 数据加载中
  if (loading) {
    return (
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">{t('loading')}</div>
          </div>
        </PageContent>
    )
  }

  if (!application || !parsedData) {
    return (
        <PageContent>
          <div className="text-center py-8 text-sage-500">
            {t('applicationNotFound')}
          </div>
        </PageContent>
    )
  }

  const { basicInfo, contactInfo, familyProfile, programInterests, referral, embryoMedicalStatus, languages, ethnicity, preferredContactMethod } = parsedData

  return (
      <PageContent>
        <PageHeader 
          title={t('parentsApplications')}
          rightContent={
            <div className="flex items-center gap-4">
              <CustomButton
                className="bg-white cursor-pointer border border-sage-300 text-sage-800"
                onClick={handleBack}
              >
                {t('Back To Applications')}
              </CustomButton>
              <CustomButton
                className="bg-white cursor-pointer border border-sage-300 text-sage-800"
                onClick={() => handleExportDetail('excel')}
              >
                {t('exportExcel')}
              </CustomButton>
              <CustomButton
                className="bg-white cursor-pointer border border-sage-300 text-sage-800"
                onClick={() => handleExportDetail('pdf')}
              >
                {t('exportPdf')}
              </CustomButton>
              <CustomButton
                className="text-red-600 border border-red-200 bg-white cursor-pointer"
                onClick={handleDelete}
              >
                {t('delete', { defaultValue: 'Delete' })}
              </CustomButton>
              {application.status === 'pending' && (
                <>
                  <CustomButton 
                    className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer px-3 py-1 text-sm rounded"
                    onClick={handleApprove}
                  >
                    {t('approve')}
                  </CustomButton>
                  <CustomButton 
                    className="text-red-600 hover:bg-red-50 cursor-pointer border border-red-200 bg-white px-3 py-1 text-sm rounded"
                    onClick={handleReject}
                  >
                    {t('reject')}
                  </CustomButton>
                </>
              )}
            </div>
          }
        />

        <div className="space-y-6">
          {/* 状态和基本信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-sage-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-sage-800">
                    {basicInfo.firstName} {basicInfo.lastName}
                  </h2>
                  <p className="text-sage-500">{t('applicationNumber')}: #{application.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {t(application.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('basicInformation')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('firstName')}:</span>
                    <span className="text-sage-800">{basicInfo.firstName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('lastName')}:</span>
                    <span className="text-sage-800">{basicInfo.lastName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('pronouns')}:</span>
                    <span className="text-sage-800">{basicInfo.pronouns || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('genderIdentity')}:</span>
                    <span className="text-sage-800">{basicInfo.gender_identity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('dateOfBirth')}:</span>
                    <span className="text-sage-800">{basicInfo.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('ethnicity')}:</span>
                    <span className="text-sage-800">{ethnicity}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t('contactInformation')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('email')}:</span>
                    <span className="text-sage-800">{contactInfo.email_address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('phone')}:</span>
                    <span className="text-sage-800">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('languages')}:</span>
                    <span className="text-sage-800">{languages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('preferredContactMethod', '首选联系方式')}:</span>
                    <span className="text-sage-800">{preferredContactMethod}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  {t('familyProfile')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('sexualOrientation')}:</span>
                    <span className="text-sage-800">{familyProfile.sexual_orientation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('relationshipStatus', '关系状态')}:</span>
                    <span className="text-sage-800">{familyProfile.relationship_status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('city')}:</span>
                    <span className="text-sage-800">{familyProfile.city || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('country')}:</span>
                    <span className="text-sage-800">{familyProfile.country || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('state')}:</span>
                    <span className="text-sage-800">{familyProfile.state_or_province || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 项目意向 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              {t('programInterests')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('interestedServices')}:</span>
                  <span className="text-sage-800">{getServiceName(programInterests.interested_services || 'N/A', t)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('journeyStartTiming')}:</span>
                  <span className="text-sage-800">{getTimingName(programInterests.journey_start_timing || 'N/A', t)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('desiredChildrenCount')}:</span>
                  <span className="text-sage-800">{getChildrenCountName(programInterests.desired_children_count || 'N/A', t)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 胚胎与医疗情况 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              {t('embryoMedicalStatus', '胚胎与医疗情况')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('hasEmbryos', '是否已经有胚胎')}:</span>
                  <span className="text-sage-800">{formatYesNoValue(embryoMedicalStatus.has_embryos)}</span>
                </div>
                {embryoMedicalStatus.has_embryos === 'Yes' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('embryoClinicName', '胚胎所在诊所')}:</span>
                      <span className="text-sage-800">{embryoMedicalStatus.embryo_clinic_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('embryoCount', '胚胎数量')}:</span>
                      <span className="text-sage-800">{embryoMedicalStatus.embryo_count || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('pgtStatus', '是否做过PGT')}:</span>
                  <span className="text-sage-800">{formatYesNoValue(embryoMedicalStatus.pgt_status)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('hasFertilityClinic', '是否已有美国生殖诊所')}:</span>
                  <span className="text-sage-800">{formatYesNoValue(embryoMedicalStatus.has_fertility_clinic)}</span>
                </div>
                {embryoMedicalStatus.has_fertility_clinic === 'Yes' && (
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('fertilityClinicName', '诊所名称')}:</span>
                    <span className="text-sage-800">{embryoMedicalStatus.fertility_clinic_name || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 推荐信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              {t('referral')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('referralSource')}:</span>
                  <span className="text-sage-800">{referral.referral_source || 'N/A'}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sage-500">{t('initialQuestions')}:</span>
                  <div className="p-3 bg-sage-50 rounded-lg">
                    <p className="text-sage-800">{referral.initial_questions || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 时间信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex justify-between">
                <span className="text-sage-500">{t('applicationDate')}:</span>
                <span className="text-sage-800">{formattedDates.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-500">{t('lastUpdate')}:</span>
                <span className="text-sage-800">{formattedDates.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
  )
}
