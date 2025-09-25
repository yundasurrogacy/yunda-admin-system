"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'
import { AdminLayout } from '../../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getApplicationById, updateApplicationStatus } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'

export default function ParentApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [language, setLanguage] = useState<"en" | "cn">("cn")
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  const text = {
    en: {
      title: "Parent Application Details",
      back: "Back to Applications",
      basicInfo: "Basic Information",
      contactInfo: "Contact Information",
      familyProfile: "Family Profile",
      programInterests: "Program Interests",
      referral: "Referral Information",
      status: "Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      approve: "Approve",
      reject: "Reject",
      firstName: "First Name",
      lastName: "Last Name",
      pronouns: "Pronouns",
      genderIdentity: "Gender Identity",
      dateOfBirth: "Date of Birth",
      ethnicity: "Ethnicity",
      email: "Email",
      phone: "Phone",
      languages: "Languages",
      sexualOrientation: "Sexual Orientation",
      city: "City",
      country: "Country",
      state: "State/Province",
      interestedServices: "Interested Services",
      journeyStartTiming: "Journey Start Timing",
      desiredChildrenCount: "Desired Children Count",
      referralSource: "Referral Source",
      initialQuestions: "Initial Questions",
      applicationDate: "Application Date",
      lastUpdate: "Last Update",
      loading: "Loading...",
      notFound: "Application not found",
    },
    cn: {
      title: "准父母申请详情",
      back: "返回申请列表",
      basicInfo: "基本信息",
      contactInfo: "联系信息",
      familyProfile: "家庭资料",
      programInterests: "项目意向",
      referral: "推荐信息",
      status: "状态",
      pending: "待审核",
      approved: "已通过",
      rejected: "已拒绝",
      approve: "通过",
      reject: "拒绝",
      firstName: "名字",
      lastName: "姓氏",
      pronouns: "代词",
      genderIdentity: "性别认同",
      dateOfBirth: "出生日期",
      ethnicity: "族裔",
      email: "邮箱",
      phone: "电话",
      languages: "语言",
      sexualOrientation: "性取向",
      city: "城市",
      country: "国家",
      state: "州/省",
      interestedServices: "感兴趣的服务",
      journeyStartTiming: "旅程开始时间",
      desiredChildrenCount: "期望孩子数量",
      referralSource: "推荐来源",
      initialQuestions: "初步问题",
      applicationDate: "申请时间",
      lastUpdate: "最后更新",
      loading: "加载中...",
      notFound: "申请记录未找到",
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

  const getServiceName = (service: string) => {
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

  const getTimingName = (timing: string) => {
    const timingMap: { [key: string]: string } = {
      'immediately': '立即开始',
      'within-3-months': '3个月内',
      'within-6-months': '6个月内',
      'within-1-year': '1年内',
      'flexible': '灵活安排'
    }
    return timingMap[timing] || timing
  }

  const getChildrenCountName = (count: string) => {
    const countMap: { [key: string]: string } = {
      'one': '1个',
      'two': '2个',
      'three': '3个',
      'four': '4个',
      'open': '开放'
    }
    return countMap[count] || count
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
  const basicInfo = appData?.basic_information || {}
  const contactInfo = appData?.contact_information || {}
  const familyProfile = appData?.family_profile || {}
  const programInterests = appData?.program_interests || {}
  const referral = appData?.referral || {}
  // 格式化多选项
  const languages = Array.isArray(contactInfo.primary_languages) ? contactInfo.primary_languages.join(', ') : (contactInfo.primary_languages || 'N/A')
  const ethnicity = Array.isArray(basicInfo.ethnicity) ? basicInfo.ethnicity.join(', ') : (basicInfo.ethnicity || 'N/A')

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
                    {basicInfo.firstName} {basicInfo.lastName}
                  </h2>
                  <p className="text-sage-500">申请编号: #{application.id}</p>
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
                  {text[language].basicInfo}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].firstName}:</span>
                    <span className="text-sage-800">{basicInfo.firstName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].lastName}:</span>
                    <span className="text-sage-800">{basicInfo.lastName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].pronouns}:</span>
                    <span className="text-sage-800">{basicInfo.pronouns || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].genderIdentity}:</span>
                    <span className="text-sage-800">{basicInfo.gender_identity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].dateOfBirth}:</span>
                    <span className="text-sage-800">{basicInfo.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].ethnicity}:</span>
                    <span className="text-sage-800">{ethnicity}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {text[language].contactInfo}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].email}:</span>
                    <span className="text-sage-800">{contactInfo.email_address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].phone}:</span>
                    <span className="text-sage-800">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].languages}:</span>
                    <span className="text-sage-800">{languages}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  {text[language].familyProfile}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].sexualOrientation}:</span>
                    <span className="text-sage-800">{familyProfile.sexual_orientation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].city}:</span>
                    <span className="text-sage-800">{familyProfile.city || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].country}:</span>
                    <span className="text-sage-800">{familyProfile.country || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{text[language].state}:</span>
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
              {text[language].programInterests}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].interestedServices}:</span>
                  <span className="text-sage-800">{getServiceName(programInterests.interested_services || 'N/A')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].journeyStartTiming}:</span>
                  <span className="text-sage-800">{getTimingName(programInterests.journey_start_timing || 'N/A')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].desiredChildrenCount}:</span>
                  <span className="text-sage-800">{getChildrenCountName(programInterests.desired_children_count || 'N/A')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 推荐信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" />
              {text[language].referral}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{text[language].referralSource}:</span>
                  <span className="text-sage-800">{referral.referral_source || 'N/A'}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sage-500">{text[language].initialQuestions}:</span>
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
