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

export default function SurrogateApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [language, setLanguage] = useState<"en" | "cn">("cn")
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  const text = {
    en: {
      title: "Surrogate Application Details",
      back: "Back to Applications",
      contactInfo: "Contact Information",
      aboutYou: "About You",
      pregnancyHealth: "Pregnancy & Health",
      interview: "Surrogacy Interview",
      status: "Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      approve: "Approve",
      reject: "Reject",
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
      age: "Age",
      email: "Email",
      phone: "Phone",
      city: "City",
      country: "Country",
      state: "State/Province",
      height: "Height",
      weight: "Weight",
      bmi: "BMI",
      ethnicity: "Ethnicity",
      citizenship: "Citizenship Status",
      surrogacyExperience: "Surrogacy Experience",
      occupation: "Occupation",
      education: "Education Level",
      maritalStatus: "Marital Status",
      partnerSupport: "Partner Support",
      householdIncome: "Household Income",
      hasGivenBirth: "Has Given Birth",
      birthDetails: "Birth Details",
      isCurrentlyPregnant: "Currently Pregnant",
      isBreastfeeding: "Breastfeeding",
      hasStillbirth: "Has Stillbirth",
      medicalConditions: "Medical Conditions",
      isTakingMedications: "Taking Medications",
      medicationsList: "Medications List",
      backgroundCheck: "Background Check",
      domesticViolence: "Domestic Violence",
      substanceAbuse: "Substance Abuse",
      felonyCharges: "Felony Charges",
      arrests: "Arrests",
      childAbuseNeglect: "Child Abuse/Neglect",
      backgroundCheckStatus: "Background Check Status",
      pregnancyHistories: "Pregnancy Histories",
      seriousComplications: "Serious Complications",
      currentBirthControl: "Current Birth Control",
      closestHospital: "Closest Hospital",
      closestNICU: "Closest NICU III",
      emotionalSupport: "Emotional Support",
      languagesSpoken: "Languages Spoken",
      motivation: "Motivation",
      selfIntroduction: "Self Introduction",
      contactPreference: "Contact Preference",
      hipaaRelease: "HIPAA Release Willing",
      twinsFeeling: "Twins Feeling",
      multipleReduction: "Multiple Reduction Willing",
      terminationWilling: "Termination Willing",
      applicationDate: "Application Date",
      lastUpdate: "Last Update",
      loading: "Loading...",
      notFound: "Application not found",
      yes: "Yes",
      no: "No",
      notApplicable: "Not Applicable",
    },
    cn: {
      title: "代孕者申请详情",
      back: "返回申请列表",
      contactInfo: "联系信息",
      aboutYou: "关于你自己",
      pregnancyHealth: "怀孕与健康",
      interview: "代孕面试",
      status: "状态",
      pending: "待审核",
      approved: "已通过",
      rejected: "已拒绝",
      approve: "通过",
      reject: "拒绝",
      firstName: "名字",
      lastName: "姓氏",
      dateOfBirth: "出生日期",
      age: "年龄",
      email: "邮箱",
      phone: "电话",
      city: "城市",
      country: "国家",
      state: "州/省",
      height: "身高",
      weight: "体重",
      bmi: "体重指数",
      ethnicity: "种族",
      citizenship: "公民身份",
      surrogacyExperience: "代孕经验",
      occupation: "职业",
      education: "教育水平",
      maritalStatus: "婚姻状态",
      partnerSupport: "伴侣支持",
      householdIncome: "家庭收入",
      hasGivenBirth: "曾经分娩",
      birthDetails: "分娩详情",
      isCurrentlyPregnant: "目前怀孕",
      isBreastfeeding: "正在哺乳",
      hasStillbirth: "死胎经历",
      medicalConditions: "医疗状况",
      isTakingMedications: "正在服药",
      medicationsList: "药物清单",
      backgroundCheck: "背景调查",
      domesticViolence: "家庭暴力",
      substanceAbuse: "药物滥用",
      felonyCharges: "重罪指控",
      arrests: "逮捕记录",
      childAbuseNeglect: "虐待/忽视儿童",
      backgroundCheckStatus: "背景调查状态",
      pregnancyHistories: "怀孕历史",
      seriousComplications: "严重并发症",
      currentBirthControl: "当前避孕方式",
      closestHospital: "最近医院",
      closestNICU: "最近NICU III",
      emotionalSupport: "情感支持",
      languagesSpoken: "会说的语言",
      motivation: "代孕动机",
      selfIntroduction: "自我介绍",
      contactPreference: "联系偏好",
      hipaaRelease: "HIPAA授权",
      twinsFeeling: "双胞胎态度",
      multipleReduction: "多胎减胎",
      terminationWilling: "终止妊娠",
      applicationDate: "申请时间",
      lastUpdate: "最后更新",
      loading: "加载中...",
      notFound: "申请记录未找到",
      yes: "是",
      no: "否",
      notApplicable: "不适用",
    }
  }

  useEffect(() => {
    if (params.id) {
      loadApplication(Number(params.id))
    }
  }, [params.id])

  const loadApplication = async (id: number) => {
    try {
      setLoading(true)
      const data = await getApplicationById(id)
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
            <div className="text-lg">{text[language].loading}</div>
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
            {text[language].notFound}
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
          title={text[language].title}
          rightContent={
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {text[language].back}
              </Button>
              {application.status === 'pending' && (
                <>
                  <Button 
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                    onClick={() => handleStatusUpdate('approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {text[language].approve}
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleStatusUpdate('rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {text[language].reject}
                  </Button>
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
                    {contactInfo.first_name} {contactInfo.last_name}
                  </h2>
                  <p className="text-sage-500">申请编号: #{application.id} • {calculateAge(contactInfo.date_of_birth)}岁</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {text[language][application.status]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {text[language].contactInfo}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].firstName}:</span>
                    <span className="text-sage-800">{contactInfo.first_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].lastName}:</span>
                    <span className="text-sage-800">{contactInfo.last_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].dateOfBirth}:</span>
                    <span className="text-sage-800">{contactInfo.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].email}:</span>
                    <span className="text-sage-800">{contactInfo.email_address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].phone}:</span>
                    <span className="text-sage-800">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].city}:</span>
                    <span className="text-sage-800">{contactInfo.city || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  身体特征
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].height}:</span>
                    <span className="text-sage-800">{contactInfo.height || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].weight}:</span>
                    <span className="text-sage-800">{contactInfo.weight || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].bmi}:</span>
                    <span className="text-sage-800">{contactInfo.bmi || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].ethnicity}:</span>
                    <span className="text-sage-800">{contactInfo.ethnicity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].citizenship}:</span>
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
                  {text[language].aboutYou}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].occupation}:</span>
                    <span className="text-sage-800">{aboutYou.occupation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].education}:</span>
                    <span className="text-sage-800">{aboutYou.education_level || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].maritalStatus}:</span>
                    <span className="text-sage-800">{aboutYou.marital_status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].partnerSupport}:</span>
                    <span className="text-sage-800">{aboutYou.partner_support || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].householdIncome}:</span>
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
              {text[language].pregnancyHealth}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sage-700">怀孕历史</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].hasGivenBirth}:</span>
                    <span className="text-sage-800">{pregnancyHealth.has_given_birth ? text[language].yes : text[language].no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].isCurrentlyPregnant}:</span>
                    <span className="text-sage-800">{pregnancyHealth.is_currently_pregnant ? text[language].yes : text[language].no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].isBreastfeeding}:</span>
                    <span className="text-sage-800">{pregnancyHealth.is_breastfeeding ? text[language].yes : text[language].no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].hasStillbirth}:</span>
                    <span className="text-sage-800">{pregnancyHealth.has_stillbirth ? text[language].yes : text[language].no}</span>
                  </div>
                  {pregnancyHealth.birth_details && (
                    <div className="space-y-1">
                      <span className="text-sage-500">{text[language].birthDetails}:</span>
                      <div className="p-2 bg-sage-50 rounded text-sage-800 text-xs">
                        {pregnancyHealth.birth_details}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sage-700">健康信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].medicalConditions}:</span>
                    <span className="text-sage-800">{pregnancyHealth.medical_conditions?.join(', ') || '无'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].isTakingMedications}:</span>
                    <span className="text-sage-800">{pregnancyHealth.is_taking_medications ? text[language].yes : text[language].no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].seriousComplications}:</span>
                    <span className="text-sage-800">{pregnancyHealth.serious_pregnancy_complications ? text[language].yes : text[language].no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].currentBirthControl}:</span>
                    <span className="text-sage-800">{pregnancyHealth.current_birth_control || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].closestHospital}:</span>
                    <span className="text-sage-800">{pregnancyHealth.closest_hospital || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 背景调查 */}
            <div className="mt-6 p-4 bg-sage-50 rounded-lg">
              <h4 className="font-medium text-sage-700 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {text[language].backgroundCheck}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].domesticViolence}:</span>
                  <span className="text-sage-800">{pregnancyHealth.domestic_violence ? text[language].yes : text[language].no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].substanceAbuse}:</span>
                  <span className="text-sage-800">{pregnancyHealth.substance_abuse ? text[language].yes : text[language].no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].felonyCharges}:</span>
                  <span className="text-sage-800">{pregnancyHealth.felony_charges ? text[language].yes : text[language].no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].arrests}:</span>
                  <span className="text-sage-800">{pregnancyHealth.arrests ? text[language].yes : text[language].no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].childAbuseNeglect}:</span>
                  <span className="text-sage-800">{pregnancyHealth.child_abuse_neglect ? text[language].yes : text[language].no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].backgroundCheckStatus}:</span>
                  <span className="text-sage-800">{pregnancyHealth.background_check_status || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* 怀孕历史详情 */}
            {pregnancyHistories.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-sage-700 mb-3">{text[language].pregnancyHistories}</h4>
                <div className="space-y-3">
                  {pregnancyHistories.map((history: any, index: number) => (
                    <div key={index} className="p-3 bg-sage-50 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-sage-500">分娩日期:</span>
                          <div className="text-sage-800">{history.delivery_date}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">出生体重:</span>
                          <div className="text-sage-800">{history.birth_weight}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">孕周:</span>
                          <div className="text-sage-800">{history.gestational_weeks}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">胎儿数:</span>
                          <div className="text-sage-800">{history.number_of_babies}</div>
                        </div>
                        <div>
                          <span className="text-sage-500">分娩方式:</span>
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
              {text[language].interview}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{text[language].emotionalSupport}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.emotional_support || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{text[language].languagesSpoken}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.languages_spoken || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{text[language].motivation}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.motivation || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{text[language].selfIntroduction}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.self_introduction || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{text[language].contactPreference}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                      {interview.contact_preference || 'N/A'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-sage-500">{text[language].hipaaRelease}:</span>
                      <span className="text-sage-800">{interview.hipaa_release_willing ? text[language].yes : text[language].no}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{text[language].multipleReduction}:</span>
                      <span className="text-sage-800">{interview.multiple_reduction_willing ? text[language].yes : text[language].no}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{text[language].terminationWilling}:</span>
                      <span className="text-sage-800">{interview.termination_willing ? text[language].yes : text[language].no}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sage-500 text-sm">{text[language].twinsFeeling}:</span>
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
                <span className="text-sage-500">{text[language].applicationDate}:</span>
                <span className="text-sage-800">{new Date(application.created_at).toLocaleString('zh-CN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-500">{text[language].lastUpdate}:</span>
                <span className="text-sage-800">{new Date(application.updated_at).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </AdminLayout>
  )
}
