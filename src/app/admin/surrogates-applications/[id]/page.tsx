"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart, FileText, CheckCircle, XCircle, Clock, Activity, Baby, Shield } from 'lucide-react'
import { AdminLayout } from '../../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getApplicationById, updateApplicationStatus } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'
import { useTranslation } from 'react-i18next'

export default function SurrogateApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [language, setLanguage] = useState<"en" | "cn">("cn")
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation('common')

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

  useEffect(() => {
    if (params.id) {
      loadApplication(Number(params.id))
    }
  }, [params.id])

  const loadApplication = async (id: number) => {
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
  }

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!application) return
    
    try {
      await updateApplicationStatus(application.id, newStatus)
      await loadApplication(application.id) // 重新加载数据
    } catch (error) {
      console.error('Failed to update status:', error)
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

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <AdminLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">{t('loading')}</div>
          </div>
        </PageContent>
      </AdminLayout>
    )
  }

  if (!application) {
    return (
      <AdminLayout>
        <PageContent>
          <div className="text-center py-8 text-sage-500">
            {t('applicationNotFound')}
          </div>
        </PageContent>
      </AdminLayout>
    )
  }

  const appData = application.application_data as any
  const contactInfo = appData?.contact_information || {}
  const aboutYou = appData?.about_you || {}
  const pregnancyHealth = appData?.pregnancy_and_health || {}
  const interview = appData?.gestational_surrogacy_interview || {}
  const pregnancyHistories = pregnancyHealth.pregnancy_histories || []

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={t('surrogateApplicationDetails')}
          rightContent={
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToApplications')}
              </Button>
              {application.status === 'pending' && (
                <>
                  <Button 
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                    onClick={() => handleStatusUpdate('approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('approve')}
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleStatusUpdate('rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {t('reject')}
                  </Button>
                </>
              )}
            </div>
          }
        />
        {/* 顶部照片展示区域 */}
        <div className="w-full flex flex-col items-center mb-8">
          <h3 className="text-lg font-medium text-sage-800 mb-3">
            {language === 'cn' ? '申请照片' : 'Application Photos'}
          </h3>
          {Array.isArray(appData.upload_photos) && appData.upload_photos.length > 0 ? (
            <div className="flex gap-6 justify-center flex-wrap w-full">
              {appData.upload_photos.map((photo: any, idx: number) => (
                <div key={idx} className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative">
                  <img
                    src={photo.url}
                    alt={photo.name || `photo-${idx+1}`}
                    className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                    loading="lazy"
                  />
                  {/* 图片序号标签 */}
                  <span className="absolute top-2 left-2 bg-sage-700 text-white text-xs px-2 py-1 rounded shadow">
                    {language === 'cn' ? `第${idx+1}张` : `Photo ${idx+1}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sage-500 text-sm">{language === 'cn' ? '暂无照片' : 'No photos uploaded.'}</div>
          )}
        </div>

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
                    {contactInfo.first_name} {contactInfo.last_name}
                  </h2>
                  <p className="text-sage-500">{t('applicationNumber')}: #{application.id} • {calculateAge(contactInfo.date_of_birth)}{t('yearsOld')}</p>
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
                  {t('contactInformation')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('firstName')}:</span>
                    <span className="text-sage-800">{contactInfo.first_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('lastName')}:</span>
                    <span className="text-sage-800">{contactInfo.last_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('dateOfBirth')}:</span>
                    <span className="text-sage-800">{contactInfo.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('email')}:</span>
                    <span className="text-sage-800">{contactInfo.email_address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('phone')}:</span>
                    <span className="text-sage-800">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('city')}:</span>
                    <span className="text-sage-800">{contactInfo.city || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('physicalCharacteristics')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('height')}:</span>
                    <span className="text-sage-800">{contactInfo.height || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('weight')}:</span>
                    <span className="text-sage-800">{contactInfo.weight || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('bmi')}:</span>
                    <span className="text-sage-800">{contactInfo.bmi || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('ethnicity')}:</span>
                    <span className="text-sage-800">{contactInfo.ethnicity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('citizenship')}:</span>
                    <span className="text-sage-800">{contactInfo.us_citizen_or_visa_status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">代孕经验次数:</span>
                    <span className="text-sage-800">{contactInfo.surrogacy_experience_count || 0}次</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('aboutYou')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('occupation')}:</span>
                    <span className="text-sage-800">{aboutYou.occupation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('education')}:</span>
                    <span className="text-sage-800">{aboutYou.education_level || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('maritalStatus')}:</span>
                    <span className="text-sage-800">{aboutYou.marital_status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('partnerSupport')}:</span>
                    <span className="text-sage-800">{aboutYou.partner_support || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('householdIncome')}:</span>
                    <span className="text-sage-800">{aboutYou.household_income || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">代孕经验:</span>
                    <span className="text-sage-800">{aboutYou.is_former_surrogate ? '有经验' : '首次代孕'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 怀孕与健康 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5" />
              {t('pregnancyHealth')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sage-700">{t('pregnancyHistory')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('hasGivenBirth')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.has_given_birth ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('isCurrentlyPregnant')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.is_currently_pregnant ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('isBreastfeeding')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.is_breastfeeding ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('hasStillbirth')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.has_stillbirth ? t('yes') : t('no')}</span>
                  </div>
                  {pregnancyHealth.birth_details && (
                    <div className="space-y-1">
                      <span className="text-sage-500">{t('birthDetails')}:</span>
                      <div className="p-2 bg-sage-50 rounded text-sage-800 text-xs">
                        {pregnancyHealth.birth_details}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sage-700">{t('healthInformation')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('medicalConditions')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.medical_conditions?.join(', ') || '无'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('isTakingMedications')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.is_taking_medications ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('seriousComplications')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.serious_pregnancy_complications ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('currentBirthControl')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.current_birth_control || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('closestHospital')}:</span>
                    <span className="text-sage-800">{pregnancyHealth.closest_hospital || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 背景调查 */}
            <div className="mt-6 p-4 bg-sage-50 rounded-lg">
              <h4 className="font-medium text-sage-700 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t('backgroundCheck')}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('domesticViolence')}:</span>
                  <span className="text-sage-800">{pregnancyHealth.domestic_violence ? t('yes') : t('no')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('substanceAbuse')}:</span>
                  <span className="text-sage-800">{pregnancyHealth.substance_abuse ? t('yes') : t('no')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('felonyCharges')}:</span>
                  <span className="text-sage-800">{pregnancyHealth.felony_charges ? t('yes') : t('no')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('arrests')}:</span>
                  <span className="text-sage-800">{pregnancyHealth.arrests ? t('yes') : t('no')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('childAbuseNeglect')}:</span>
                  <span className="text-sage-800">{pregnancyHealth.child_abuse_neglect ? t('yes') : t('no')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('backgroundCheckStatus')}:</span>
                  <span className="text-sage-800">{pregnancyHealth.background_check_status || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* 怀孕历史详情 */}
            {pregnancyHistories.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-sage-700 mb-3">{t('pregnancyHistories')}</h4>
                <div className="space-y-3">
                  {pregnancyHistories.map((history: any, index: number) => (
                    <div key={index} className="p-3 bg-sage-50 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-sage-500">{t('deliveryDate')}:</span>
                          <div className="text-sage-800">{history.delivery_date}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">{t('birthWeight')}:</span>
                          <div className="text-sage-800">{history.birth_weight}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">{t('gestationalWeeks')}:</span>
                          <div className="text-sage-800">{history.gestational_weeks}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">{t('numberOfBabies')}:</span>
                          <div className="text-sage-800">{history.number_of_babies}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">{t('deliveryMethod')}:</span>
                          <div className="text-sage-800">{history.delivery_method}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 代孕面试 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              {t('interview')}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{t('emotionalSupport')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.emotional_support || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('languagesSpoken')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.languages_spoken || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('motivation')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.motivation || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{t('selfIntroduction')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.self_introduction || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('contactPreference')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.contact_preference || 'N/A'}
                    </div>
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
              <div>
                <span className="text-sage-500 text-sm">{t('twinsFeeling')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview.twins_feeling || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* 时间信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex justify-between">
                <span className="text-sage-500">{t('applicationDate')}:</span>
                <span className="text-sage-800">{new Date(application.created_at).toLocaleString('zh-CN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-500">{t('lastUpdate')}:</span>
                <span className="text-sage-800">{new Date(application.updated_at).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </AdminLayout>
  )
}
