"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart, FileText, CheckCircle, XCircle, Clock, Activity, Baby, Shield, MessageSquare } from 'lucide-react'
// import { AdminLayout } from '../../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { CustomButton } from '@/components/ui/CustomButton'
import { Badge } from '@/components/ui/badge'
import { getApplicationById, updateApplicationStatus } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'
import { useTranslation } from 'react-i18next'

// 简单全屏图片预览组件
function ImagePreviewModal({ open, images, current, onClose, t }: { open: boolean, images: {url: string, name?: string}[], current: number, onClose: () => void, t: any }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <img
        src={images[current]?.url}
        alt={images[current]?.name || `photo-${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-6 right-8 text-white text-3xl font-bold cursor-pointer bg-black bg-opacity-40 rounded-full px-3 py-1 hover:bg-opacity-70"
        onClick={onClose}
        aria-label={t('close', 'Close')}
      >×</button>
    </div>
  );
}

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

function calculateAge(dateOfBirth: string): string | number {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export default function SurrogateApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [language, setLanguage] = useState<"en" | "cn">("cn")
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation('common')
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // 图片预览相关 state
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

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
    const handleLangChange = (lng: string) => {
      setLanguage(lng === 'zh-CN' ? 'cn' : 'en')
    }
    i18n.on('languageChanged', handleLangChange)
    setLanguage(i18n.language === 'zh-CN' ? 'cn' : 'en')
    return () => {
      i18n.off('languageChanged', handleLangChange)
    }
  }, [i18n])

  // 使用 useCallback 缓存数据加载函数
  const loadApplication = useCallback(async (id: number) => {
    try {
      setLoading(true)
      const data = await getApplicationById(id)
      console.log('Loaded application:', data)
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

  // 使用 useCallback 缓存事件处理函数
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleApprove = useCallback(() => {
    handleStatusUpdate('approved')
  }, [handleStatusUpdate])

  const handleReject = useCallback(() => {
    handleStatusUpdate('rejected')
  }, [handleStatusUpdate])

  // 图片预览处理函数
  const handlePreviewOpen = useCallback((index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  // 使用 useMemo 缓存解析后的应用数据，避免每次渲染重新解析
  const parsedData = useMemo(() => {
    if (!application) return null
    
    const appData = application.application_data as any
    const contactInfo = appData?.contact_information || {}
    const aboutYou = appData?.about_you || {}
    const pregnancyHealth = appData?.pregnancy_and_health || {}
    const interview = appData?.gestational_surrogacy_interview || {}
    const pregnancyHistories = pregnancyHealth.pregnancy_histories || []

    return {
      appData,
      contactInfo,
      aboutYou,
      pregnancyHealth,
      interview,
      pregnancyHistories
    }
  }, [application])

  // 使用 useMemo 缓存格式化的日期和年龄
  const formattedData = useMemo(() => {
    if (!application || !parsedData) return { createdAt: '', updatedAt: '', age: 0 }
    
    return {
      createdAt: new Date(application.created_at).toLocaleString('zh-CN'),
      updatedAt: new Date(application.updated_at).toLocaleString('zh-CN'),
      age: calculateAge(parsedData.contactInfo.date_of_birth)
    }
  }, [application, parsedData])

  // 使用 useMemo 缓存身高显示
  const heightDisplay = useMemo(() => {
    if (!parsedData?.contactInfo?.height) return t('notAvailable');
    // 处理 "5'5\"" 格式的身高数据
    if (typeof parsedData.contactInfo.height === 'string' && parsedData.contactInfo.height.includes("'")) {
      return parsedData.contactInfo.height; // 直接显示 "5'5\"" 格式
    }
    // 如果是纯数字，添加英尺单位
    return `${parsedData.contactInfo.height} ${t('ft', '英尺')}`;
  }, [parsedData?.contactInfo?.height, t]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  // 数据加载中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
      </div>
    )
  }

  if (!application || !parsedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-sage-400 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl text-sage-600 font-medium mb-2">{t('applicationNotFound', { defaultValue: '未找到申请' })}</p>
          <p className="text-sm text-sage-400 mb-6">{t('applicationNotFoundDesc', { defaultValue: '该申请可能已被删除或不存在' })}</p>
          <CustomButton
            onClick={() => router.push('/admin/surrogates-applications')}
            className="bg-sage-200 text-sage-800 hover:bg-sage-300 cursor-pointer"
          >
            {t('backToApplications', { defaultValue: '返回申请列表' })}
          </CustomButton>
        </div>
      </div>
    )
  }

  const { appData, contactInfo, aboutYou, pregnancyHealth, interview, pregnancyHistories } = parsedData
  const { createdAt, updatedAt, age } = formattedData

  return (
      <PageContent>
        <PageHeader
          title={t('SurrogateApplicationDetails')}
          rightContent={
            <div className="flex items-center gap-4">
              <CustomButton
                className="bg-white font-medium cursor-pointer border border-sage-300 text-sage-800"
                onClick={handleBack}
              >
                {t('Back To Applications')}
              </CustomButton>
              {application.status === 'pending' && (
                <>
                  <CustomButton
                    className="bg-green-100 text-green-800 hover:bg-green-200 font-medium cursor-pointer px-3 py-1 text-sm rounded"
                    onClick={handleApprove}
                  >
                    {t('approve')}
                  </CustomButton>
                  <CustomButton
                    className="text-red-600 hover:bg-red-50 font-medium cursor-pointer border border-red-200 bg-white px-3 py-1 text-sm rounded"
                    onClick={handleReject}
                  >
                    {t('reject')}
                  </CustomButton>
                </>
              )}
            </div>
          }
        />
        {/* 顶部照片展示区域 */}
        <div className="w-full flex flex-col items-center mb-8">
          <h3 className="text-lg font-medium text-sage-800 mb-3">
            {t('applicationPhotos')}
          </h3>
          {Array.isArray(appData.upload_photos) && appData.upload_photos.length > 0 ? (
            <>
              <div className="flex gap-6 justify-center flex-wrap w-full">
                {appData.upload_photos.map((photo: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative cursor-pointer"
                    onClick={() => handlePreviewOpen(idx)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name || `photo-${idx+1}`}
                      className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                      loading="lazy"
                    />
                    {/* 图片序号标签 */}
                    <span className="absolute top-2 left-2 bg-sage-700 text-white text-xs px-2 py-1 rounded shadow font-medium">
                      {t('photoNumber', { number: idx + 1 })}
                    </span>
                  </div>
                ))}
              </div>
              <ImagePreviewModal
                open={previewOpen}
                images={appData.upload_photos}
                current={previewIndex}
                onClose={handlePreviewClose}
                t={t}
              />
            </>
          ) : (
            <div className="text-sage-800 text-sm font-medium">{t('noPhotosUploaded')}</div>
          )}
        </div>

        <div className="space-y-6">
          {/* 状态和基本信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-sage-800" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-sage-800">
                    {contactInfo.first_name} {contactInfo.last_name}
                  </h2>
                  <p className="text-sage-800 font-medium">{t('applicationNumber')}: #{application.id} • {age}{t('yearsOld')}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {t(application.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('basicInformation')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('occupation')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.occupation || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('education')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.education_level || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('maritalStatus')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.marital_status || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('partnerSupport')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.partner_support || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('householdIncome')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.household_income || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyExperience')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.is_former_surrogate ? t('experienced') : t('firstTime')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogateProfileDetail.surrogateExperience', '代孕经历说明')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.surrogate_experience || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogateProfileDetail.hasHighSchoolDiploma', '有高中毕业证')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.has_high_school_diploma ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogateProfileDetail.contactSourceLabel', '联系来源')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.contact_source ? String(t(`surrogateProfileDetail.contactSource.${aboutYou.contact_source}`, aboutYou.contact_source)) : t('notAvailable')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('contactInformation')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('dateOfBirth')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.date_of_birth || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('phone')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('email')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.email_address || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('city')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.city || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('stateOrProvince')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.state_or_province || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('country')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.country || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('zipCode')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.zip_code || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyProfile.contactInfo.usCitizenOrVisaStatus')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.us_citizen_or_visa_status || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyProfile.contactInfo.agreeToReceiveMessages')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('physicalCharacteristics')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('height')}:</span>
                    <span className="text-sage-800 font-semibold">{heightDisplay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('weight')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.weight ? `${contactInfo.weight} ${t('lbs', '磅')}` : t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('bmi')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.bmi || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('ethnicity')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.ethnicity || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyExperienceCount')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.surrogacy_experience_count || 0} {t('timesCount')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 怀孕与健康 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5" />
              {t('pregnancyHealth')}
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('hasGivenBirth')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.has_given_birth ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('isCurrentlyPregnant')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.is_currently_pregnant ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('isBreastfeeding')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.is_breastfeeding ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('hasStillbirth')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.has_stillbirth ? t('yes') : t('no')}</p>
              </div>
              {pregnancyHealth.birth_details && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.birthDetails')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.birth_details}</p>
                </div>
              )}
              {pregnancyHealth.closest_hospital && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.closestHospital')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.closest_hospital}</p>
                </div>
              )}
              {pregnancyHealth.closest_nicu_iii && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.closestNICUIII')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.closest_nicu_iii}</p>
                </div>
              )}
              {pregnancyHealth.current_birth_control && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.currentBirthControl')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.current_birth_control}</p>
                </div>
              )}
              <div className="space-y-1 col-span-2">
                <span className="text-sage-600 text-sm">{t('medicalConditions')}</span>
                <p className="font-medium text-sage-800">{Array.isArray(pregnancyHealth.medical_conditions) && pregnancyHealth.medical_conditions.length > 0 ? pregnancyHealth.medical_conditions.join(", ") : t('noneValue')}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-sage-600 text-sm">{t('isTakingMedications')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.is_taking_medications ? t('yes') : t('no')}</p>
                {pregnancyHealth.is_taking_medications && pregnancyHealth.medications_list && (
                  <div className="mt-2">
                    <span className="text-sage-600 text-sm">{t('medications')}</span>
                    <p className="font-medium text-sage-800">{pregnancyHealth.medications_list}</p>
                  </div>
                )}
              </div>
              {/* 背景调查相关字段 */}
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.arrests')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.arrests ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.felonyCharges')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.felony_charges ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.substanceAbuse')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.substance_abuse ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.domesticViolence')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.domestic_violence ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.childAbuseNeglect')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.child_abuse_neglect ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.formalProbation', 'Formal Probation')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.formal_probation ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.outstandingWarrant', 'Outstanding Warrant')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.outstanding_warrant ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.childProtectionInvestigation', 'Child Protection Investigation')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.child_protection_investigation ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.seriousPregnancyComplications', 'Serious Pregnancy Complications')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.serious_pregnancy_complications ? t('yes') : t('no')}</p>
              </div>
            </div>

          </div>

          {/* 怀孕历史 - 与代孕母详情页面一致 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" />
              {t('pregnancyHistories')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('backgroundCheckStatus')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.background_check_status || t('notAvailable')}</p>
              </div>
              
              <div className="mt-6">
                <span className="text-sage-600 text-sm">{t('pregnancyHistory')}</span>
                {Array.isArray(pregnancyHistories) && pregnancyHistories.length > 0 ? (
                  <div className="space-y-3 mt-2">
                    {pregnancyHistories.map((history: any, idx: number) => (
                      <div key={idx} className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-sage-500">{t('deliveryDate')}:</span>
                            <div className="text-sage-800">{history.delivery_date || t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('birthWeight')}:</span>
                            <div className="text-sage-800">{history.birth_weight ? `${history.birth_weight} ${t('lbs', '磅')}` : t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('gestationalWeeks')}:</span>
                            <div className="text-sage-800">{history.gestational_weeks || t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('numberOfBabies')}:</span>
                            <div className="text-sage-800">{history.number_of_babies || t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('deliveryMethod')}:</span>
                            <div className="text-sage-800">{history.delivery_method || t('notAvailable')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sage-500 text-sm italic mt-2">{t('noneValue')}</p>
                )}
              </div>
            </div>
          </div>

          {/* 代孕面试 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" />
              {t('interview')}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{t('emotionalSupport')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.emotional_support || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('languagesSpoken')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.languages_spoken || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('motivation')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap">{interview.motivation || t('notAvailable')}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{t('selfIntroduction')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap">{interview.self_introduction || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('contactPreference')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.contact_preference || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('twinsFeeling')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.twins_feeling || t('notAvailable')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('hipaaRelease')}:</span>
                      <span className="text-sage-800">{interview.hipaa_release_willing ? t('yes') : t('no')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('multipleReduction')}:</span>
                      <span className="text-sage-800">{interview.multiple_reduction_willing ? t('yes') : t('no')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('terminationWilling')}:</span>
                      <span className="text-sage-800">{interview.termination_willing ? t('yes') : t('no')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 时间信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex justify-between">
                <span className="text-sage-500">{t('created')}:</span>
                <span className="text-sage-800">{createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-500">{t('updated')}:</span>
                <span className="text-sage-800">{updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
  )
}
