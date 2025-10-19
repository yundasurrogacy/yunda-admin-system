"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'
// import { AdminLayout } from '../../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { CustomButton } from '@/components/ui/CustomButton'
import { Badge } from '@/components/ui/badge'
import { getApplicationById, updateApplicationStatus } from '@/lib/graphql/applications'
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

function getServiceName(service: string): string {
  const serviceMap: { [key: string]: string } = {
    'surrogacyOnly': '代孕服务',
    'surrogacyEggDonor': '代孕+捐卵服务',
    'eggDonorOnly': '捐卵服务',
    'thirdPartySurrogate': '第三方代孕',
    'bringYourOwnSurrogate': '自带代孕者',
    'bringYourOwnSurrogateEgg': '自带代孕者+捐卵',
    'notSure': '不确定'
  }
  return serviceMap[service] || service
}

function getTimingName(timing: string): string {
  const timingMap: { [key: string]: string } = {
    'immediately': '立即开始',
    'within-3-months': '3个月内',
    'within-6-months': '6个月内',
    'within-1-year': '1年内',
    'flexible': '灵活安排'
  }
  return timingMap[timing] || timing
}

function getChildrenCountName(count: string): string {
  const countMap: { [key: string]: string } = {
    'one': '1个',
    'two': '2个',
    'three': '3个',
    'four': '4个',
    'open': '开放'
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

  // 使用 useCallback 缓存导航函数
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleApprove = useCallback(() => {
    handleStatusUpdate('approved')
  }, [handleStatusUpdate])

  const handleReject = useCallback(() => {
    handleStatusUpdate('rejected')
  }, [handleStatusUpdate])

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存解析后的应用数据，避免每次渲染重新解析
  const parsedData = useMemo(() => {
    if (!application) return null
    
    const appData = application.application_data as any
    const basicInfo = appData?.basic_information || {}
    const contactInfo = appData?.contact_information || {}
    const familyProfile = appData?.family_profile || {}
    const programInterests = appData?.program_interests || {}
    const referral = appData?.referral || {}
    
    // 格式化多选项
    const languages = Array.isArray(contactInfo.primary_languages) 
      ? contactInfo.primary_languages.join(', ') 
      : (contactInfo.primary_languages || 'N/A')
    const ethnicity = Array.isArray(basicInfo.ethnicity) 
      ? basicInfo.ethnicity.join(', ') 
      : (basicInfo.ethnicity || 'N/A')

    return {
      basicInfo,
      contactInfo,
      familyProfile,
      programInterests,
      referral,
      languages,
      ethnicity
    }
  }, [application])

  // 使用 useMemo 缓存格式化的日期，避免每次渲染重新计算
  const formattedDates = useMemo(() => {
    if (!application) return { createdAt: '', updatedAt: '' }
    
    return {
      createdAt: new Date(application.created_at).toLocaleString('zh-CN'),
      updatedAt: new Date(application.updated_at).toLocaleString('zh-CN')
    }
  }, [application])

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

  const { basicInfo, contactInfo, familyProfile, programInterests, referral, languages, ethnicity } = parsedData

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
                  <span className="text-sage-800">{getServiceName(programInterests.interested_services || 'N/A')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('journeyStartTiming')}:</span>
                  <span className="text-sage-800">{getTimingName(programInterests.journey_start_timing || 'N/A')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('desiredChildrenCount')}:</span>
                  <span className="text-sage-800">{getChildrenCountName(programInterests.desired_children_count || 'N/A')}</span>
                </div>
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
