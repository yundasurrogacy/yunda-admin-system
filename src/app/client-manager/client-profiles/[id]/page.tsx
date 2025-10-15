"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { getIntendedParentById } from "@/lib/graphql/applications"
import type { IntendedParent } from "@/types/intended_parent"
import { ChevronRight, ChevronDown, User, FileText, Search, ArrowLeft } from "lucide-react"
import { CustomButton } from "../../../../components/ui/CustomButton"
import { CommonHeader } from "../../../../components/common-header"
import { useTranslation } from "react-i18next"
import '../../../../i18n'
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
// import ManagerLayout from "@/components/manager-layout"

export default function ClientProfileDetailPage() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const params = useParams<{ id: string }>()
  const [language, setLanguage] = useState<"EN" | "CN">("EN")
  const [client, setClient] = useState<IntendedParent | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    medicalRecords: false,
    medicationTracker: false,
  })

  useEffect(() => {
    async function fetchData() {
      if (params?.id) {
        const data = await getIntendedParentById(Number(params.id))
        setClient(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [params?.id])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const text = {
    EN: {
      title: "Client Profile",
      basicInfo: "Basic Information",
      embryoInfo: "Embryo Information",
      uploadDocs: "Upload Documents",
      trustAccount: "Trust Account",
      clientManager: "Client Manager",
      medicalRecords: "Medical Records",
      doctorInfo: "Doctor Information",
      clinicInfo: "Clinic Information",
      upcomingAppts: "Upcoming Appointments",
      pastAppts: "Past Appointments",
      medicationTracker: "Medication Tracker",
      name: "Name",
      phone: "Phone",
      email: "Email",
      language: "Language",
      trustId: "Trust ID",
      trustBalance: "Trust Balance",
      status: "Status",
      passport: "Passport",
      agreement: "Agreement",
      authentication: "Authorization",
      preBirthOrder: "Pre-Birth Order",
      viewDetails: "View Details",
      edit: "Edit",
      active: "Active",
      complete: "Complete",
      pending: "Pending",
      date: "Date",
      type: "Type",
      doctor: "Doctor",
      clinic: "Clinic",
      time: "Time",
      medication: "Medication",
      instructions: "Instructions",
      dailyReminders: "Daily Reminders",
      october2023: "October 2023",
      unreadMessage: "Unread Message",
      visitReport: "Visit Report",
      doctorsNotes: "Doctor's Notes",
    },
    CN: {
      title: "客户档案",
      basicInfo: "基本信息",
      embryoInfo: "胚胎信息",
      uploadDocs: "上传文件",
      trustAccount: "信托账户",
      clientManager: "客户经理",
      medicalRecords: "医疗记录",
      doctorInfo: "医生信息",
      clinicInfo: "诊所信息",
      upcomingAppts: "即将到来的预约",
      pastAppts: "过往预约",
      medicationTracker: "用药跟踪",
      name: "姓名",
      phone: "电话",
      email: "邮箱",
      language: "语言",
      trustId: "信托ID",
      trustBalance: "信托余额",
      status: "状态",
      passport: "护照",
      agreement: "协议",
      authentication: "授权",
      preBirthOrder: "出生前令",
      viewDetails: "查看详情",
      edit: "编辑",
      active: "活跃",
      complete: "完成",
      pending: "待处理",
      date: "日期",
      type: "类型",
      doctor: "医生",
      clinic: "诊所",
      time: "时间",
      medication: "药物",
      instructions: "说明",
      dailyReminders: "每日提醒",
      october2023: "2023年10月",
      unreadMessage: "未读消息",
      visitReport: "访问报告",
      doctorsNotes: "医生笔记",
    },
  }

  if (loading) {
    return <div className="p-8 text-sage-600 font-medium">加载中...</div>
  }

  if (!client) {
    return <div className="p-8 text-red-600 font-medium">未找到该准父母信息</div>
  }

  const basic = client.basic_information
  const contact = client.contact_information
  const family = client.family_profile
  const program = client.program_interests
  const referral = client.referral


  // 格式化多选和枚举展示
  const formatArray = (arr: string[] | undefined): string => Array.isArray(arr) && arr.length ? arr.join(", ") : "-"
  const formatValue = (val: string | undefined): string => val ? val : "-"

  return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12 font-medium text-sage-800">
        <div className="flex items-center justify-between pt-6 pb-2">
          <h1 className="text-2xl font-medium text-sage-800">{t('clientProfiles.title')}</h1>
          <div className="flex items-center gap-4">
            <CustomButton
              className="bg-white font-medium text-sage-800 border border-sage-200 rounded px-4 py-2 cursor-pointer"
              onClick={() => router.push('/client-manager/client-profiles')}
            >
              {/* <ArrowLeft className="w-4 h-4 mr-2" /> */}
              {t('backToClientProfiles')}
            </CustomButton>
          </div>
        </div>

        {/* 基本信息 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('basicInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm">{t('firstName')} / {t('lastName')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(basic?.firstName)} {formatValue(basic?.lastName)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('pronouns') || '代词'}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(basic?.pronouns)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('genderIdentity')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(basic?.gender_identity)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('dateOfBirth')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(basic?.date_of_birth)}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sage-600 text-sm">{t('ethnicity')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatArray(basic?.ethnicity?.split(","))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('contactInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm">{t('phone')}:</Label>
                <p className="font-medium text-sage-800 break-words">{contact?.cell_phone_country_code ? `+${contact?.cell_phone_country_code} ` : ""}{formatValue(contact?.cell_phone)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('email')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(contact?.email_address)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('languages')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatArray(contact?.primary_languages_selected_keys)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('clientProfileDetail.agreeToReceiveMessages')}:</Label>
                <p className="font-medium text-sage-800 break-words">{contact?.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 家庭资料 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('familyProfile')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm">{t('sexualOrientation')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.sexual_orientation)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('city')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.city)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('country')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.country)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('stateOrProvince')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.state_or_province)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 项目意向 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('programInterests')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm">{t('serviceNeeds')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(program?.interested_services)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('journeyStartTiming')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(program?.journey_start_timing)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('desiredChildrenCount')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(program?.desired_children_count)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 渠道及初步沟通 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('referral')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm">{t('referralSource')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(referral?.referral_source)}</p>
              </div>
              <div>
                <Label className="text-sage-600 text-sm">{t('initialQuestions')}:</Label>
                <p className="font-medium text-sage-800 break-words">{formatValue(referral?.initial_questions)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 同意条款 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('agreement')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm">{t('sharePersonalInfo')}:</Label>
                <p className="font-medium text-sage-800 break-words">{contact?.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 其他区块（原有内容保留） */}
        {/* ...existing code... */}
      </div>
  )
}
