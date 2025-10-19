"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

export default function ClientProfileDetailPage() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const params = useParams<{ id: string }>()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [language, setLanguage] = useState<"EN" | "CN">("EN")
  const [client, setClient] = useState<IntendedParent | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    medicalRecords: false,
    medicationTracker: false,
  })

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_manager')
      const userEmail = getCookie('userEmail_manager')
      const userId = getCookie('userId_manager')
      const authed = !!(userRole && userEmail && userId && userRole === 'manager')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client-manager/login')
      }
    }
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      // 只在认证后才加载数据
      if (params?.id && isAuthenticated) {
        setLoading(true);
        const data = await getIntendedParentById(Number(params.id))
        setClient(data)
        setLoading(false);
      }
    }
    fetchData()
  }, [params?.id, isAuthenticated])

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useCallback 缓存区块切换函数
  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, []);

  // 使用 useMemo 缓存静态文本对象
  const text = useMemo(() => ({
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
  }), []);

  // 使用 useMemo 缓存数据源
  const basic = useMemo(() => client?.basic_information, [client]);
  const contact = useMemo(() => client?.contact_information, [client]);
  const family = useMemo(() => client?.family_profile, [client]);
  const program = useMemo(() => client?.program_interests, [client]);
  const referral = useMemo(() => client?.referral, [client]);

  // 使用 useCallback 缓存格式化函数
  const formatArray = useCallback((arr: string[] | undefined): string => 
    Array.isArray(arr) && arr.length ? arr.join(", ") : "-", []
  );
  
  const formatValue = useCallback((val: string | undefined): string => 
    val ? val : "-", []
  );

  // 使用 useCallback 缓存导航函数
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  // 数据加载中（认证后才会设置 loading）
  if (loading || !client) {
    return <div className="p-8 text-sage-600 font-medium">{t('loading')}</div>
  }

  return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12 font-medium text-sage-800">
        {/* 返回按钮 */}
        <CustomButton
          className="mt-6 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
          onClick={handleBack}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton>

        <div className="flex items-center justify-between pb-2">
          <h1 className="text-2xl font-medium text-sage-800">{t('clientProfiles.title')}</h1>
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
