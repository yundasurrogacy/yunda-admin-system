"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getIntendedParentById } from "@/lib/graphql/applications"
import type { IntendedParent } from "@/types/intended_parent"
import { ChevronRight, ChevronDown, User, FileText, Search } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { AdminLayout } from "../../../../components/admin-layout"

export default function ClientProfileDetailPage() {
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
    return <div className="p-8 text-sage-600">加载中...</div>
  }

  if (!client) {
    return <div className="p-8 text-red-600">未找到该准父母信息</div>
  }

  const basic = client.basic_information
  const contact = client.contact_information
  const family = client.family_profile
  const program = client.program_interests
  const referral = client.referral

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-light text-sage-800 tracking-wide">{text[language].title}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-sage-200 rounded-lg bg-sage-50 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
            />
          </div>
        </div>

        {/* 基本信息+胚胎信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-sage-200 animate-slide-in-left">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">{text[language].basicInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-sage-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <Label className="text-sage-600 text-sm">{text[language].name}:</Label>
                      <p className="font-medium text-sage-800">{basic?.firstName} {basic?.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600 text-sm">代词:</Label>
                      <p className="font-medium text-sage-800">{basic?.pronouns}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600 text-sm">性别认同:</Label>
                      <p className="font-medium text-sage-800">{basic?.gender_identity}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600 text-sm">出生日期:</Label>
                      <p className="font-medium text-sage-800">{basic?.date_of_birth}</p>
                    </div>
                    <div>
                      <Label className="text-sage-600 text-sm">族裔:</Label>
                      <p className="font-medium text-sage-800">{basic?.ethnicity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-sage-200 animate-slide-in-right">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">{text[language].embryoInfo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 flex items-center justify-center text-sage-500 text-sm">暂无胚胎信息</div>
            </CardContent>
          </Card>
        </div>

        {/* 联系信息+家庭资料 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-sage-200 animate-slide-in-left">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">联系信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <Label className="text-sage-600 text-sm">手机号:</Label>
                  <p className="font-medium text-sage-800">{contact?.cell_phone_country_code ? `+${contact?.cell_phone_country_code} ` : ""}{contact?.cell_phone}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">邮箱:</Label>
                  <p className="font-medium text-sage-800">{contact?.email_address}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">主要语言:</Label>
                  <p className="font-medium text-sage-800">{contact?.primary_languages_selected_keys?.join(", ") ?? "-"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">同意短信:</Label>
                  <p className="font-medium text-sage-800">{contact?.is_agree_cell_phone_receive_messages ? "是" : "否"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-sage-200 animate-slide-in-right">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">家庭资料</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <Label className="text-sage-600 text-sm">性取向:</Label>
                  <p className="font-medium text-sage-800">{family?.sexual_orientation}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">城市:</Label>
                  <p className="font-medium text-sage-800">{family?.city}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">国家:</Label>
                  <p className="font-medium text-sage-800">{family?.country}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">省/州:</Label>
                  <p className="font-medium text-sage-800">{family?.state_or_province}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 项目意向+渠道沟通 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-sage-200 animate-slide-in-left">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">项目意向</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <Label className="text-sage-600 text-sm">服务类型:</Label>
                  <p className="font-medium text-sage-800">{program?.interested_services}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">旅程开始时间:</Label>
                  <p className="font-medium text-sage-800">{program?.journey_start_timing}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">期望孩子数量:</Label>
                  <p className="font-medium text-sage-800">{program?.desired_children_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-sage-200 animate-slide-in-right">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">渠道及初步沟通</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <Label className="text-sage-600 text-sm">推荐来源:</Label>
                  <p className="font-medium text-sage-800">{referral?.referral_source}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">初步问题:</Label>
                  <p className="font-medium text-sage-800">{referral?.initial_questions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 上传文件+信托账户 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-sage-200 animate-slide-in-left" style={{ animationDelay: "200ms" }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">{text[language].uploadDocs}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].passport}</span>
                  </div>
                  <Badge className="bg-sage-200 text-sage-800 hover:bg-sage-200">{text[language].complete}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].agreement}</span>
                  </div>
                  <Badge className="bg-sage-200 text-sage-800 hover:bg-sage-200">{text[language].complete}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].authentication}</span>
                  </div>
                  <Badge className="bg-sage-200 text-sage-800 hover:bg-sage-200">{text[language].complete}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium">{text[language].preBirthOrder}</span>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                    {text[language].pending}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-sage-200 animate-slide-in-right" style={{ animationDelay: "200ms" }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">{text[language].trustAccount}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sage-600 text-sm">{text[language].trustId}:</span>
                  <span className="font-medium text-sage-800">{client.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sage-600 text-sm">{text[language].trustBalance}:</span>
                  <span className="font-medium text-sage-800">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sage-600 text-sm">{text[language].status}:</span>
                  <Badge className="bg-sage-100 text-sage-700 hover:bg-sage-100">{text[language].active}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 客户经理 */}
        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{text[language].clientManager}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sage-800">--</span>
              <div className="space-x-2">
                <Button size="sm" variant="outline" className="border-sage-300 text-sage-700 hover:bg-sage-50 bg-transparent">
                  {text[language].viewDetails}
                </Button>
                <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                  {text[language].edit}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 医疗记录区块（医生/诊所信息） */}
        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "500ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium flex items-center justify-between cursor-pointer hover:text-sage-600 transition-colors" onClick={() => toggleSection("medicalRecords")}>{text[language].medicalRecords}{expandedSections.medicalRecords ? (<ChevronDown className="h-5 w-5" />) : (<ChevronRight className="h-5 w-5" />)}</CardTitle>
          </CardHeader>
          {expandedSections.medicalRecords && (
            <CardContent className="space-y-6 animate-slide-in-down">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-sage-50 border-sage-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sage-800 text-base font-medium">{text[language].doctorInfo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-sage-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sage-800">--</p>
                        <p className="text-sm text-sage-600">--</p>
                        <p className="text-sm text-sage-600">--</p>
                        <p className="text-sm text-sage-600">--</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-sage-50 border-sage-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sage-800 text-base font-medium">{text[language].clinicInfo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="font-medium text-sage-800">--</p>
                      <p className="text-sm text-sage-600">--</p>
                      <p className="text-sm text-sage-600">--</p>
                      <p className="text-sm text-sage-600">--</p>
                    </div>
                    <p className="text-xs text-sage-500 mt-2">--</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          )}
        </Card>

        {/* 预约区块（可根据后端补充） */}
        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "600ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{text[language].upcomingAppts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-20 flex items-center justify-center text-sage-500 text-sm">暂无数据</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "700ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{text[language].pastAppts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-20 flex items-center justify-center text-sage-500 text-sm">暂无数据</div>
          </CardContent>
        </Card>

        {/* 快捷按钮区块 */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50">{text[language].unreadMessage}</Button>
          <Button variant="outline" className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50">{text[language].visitReport}</Button>
          <Button variant="outline" className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50">{text[language].doctorsNotes}</Button>
        </div>

        {/* 用药跟踪区块 */}
        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "800ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium flex items-center justify-between cursor-pointer hover:text-sage-600 transition-colors" onClick={() => toggleSection("medicationTracker")}>{text[language].medicationTracker}{expandedSections.medicationTracker ? (<ChevronDown className="h-5 w-5" />) : (<ChevronRight className="h-5 w-5" />)}</CardTitle>
          </CardHeader>
          {expandedSections.medicationTracker && (
            <CardContent className="space-y-6 animate-slide-in-down">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sage-800 mb-3">{text[language].dailyReminders}</h4>
                  <div className="h-20 flex items-center justify-center text-sage-500 text-sm">暂无数据</div>
                </div>
                <div>
                  <h4 className="font-medium text-sage-800 mb-3">{text[language].october2023}</h4>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                      <div key={day} className="p-2 text-xs font-medium text-sage-600">{day}</div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <div key={day} className="p-2 text-xs hover:bg-sage-100 rounded cursor-pointer">{day}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sage-800 mb-3">Medications</h4>
                <div className="h-20 flex items-center justify-center text-sage-500 text-sm">暂无数据</div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
