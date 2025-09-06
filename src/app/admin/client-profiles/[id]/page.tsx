"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, User, FileText, Search } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { AdminLayout } from "../../../../components/admin-layout"

export default function ClientProfileDetailPage() {
  const [language, setLanguage] = useState<"EN" | "CN">("EN")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    medicalRecords: false,
    medicationTracker: false,
  })

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
                      <p className="font-medium text-sage-800">John Doe</p>
                    </div>
                    <div>
                      <Label className="text-sage-600 text-sm">{text[language].phone}:</Label>
                      <p className="font-medium text-sage-800">(123) 456-7890</p>
                    </div>
                    <div>
                      <Label className="text-sage-600 text-sm">{text[language].email}:</Label>
                      <p className="font-medium text-sage-800">john@email.com</p>
                    </div>
                    <div>
                      <Label className="text-sage-600 text-sm">{text[language].language}:</Label>
                      <p className="font-medium text-sage-800">English</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embryo Information */}
          <Card className="bg-white border-sage-200 animate-slide-in-right">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">{text[language].embryoInfo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 flex items-center justify-center text-sage-500 text-sm">
                No embryo information available
              </div>
            </CardContent>
          </Card>

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
                  <span className="font-medium text-sage-800">123456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sage-600 text-sm">{text[language].trustBalance}:</span>
                  <span className="font-medium text-sage-800">$50,000.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sage-600 text-sm">{text[language].status}:</span>
                  <Badge className="bg-sage-100 text-sage-700 hover:bg-sage-100">{text[language].active}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{text[language].clientManager}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sage-800">David Johns</span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-sage-300 text-sage-700 hover:bg-sage-50 bg-transparent"
                >
                  {text[language].viewDetails}
                </Button>
                <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                  {text[language].edit}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "500ms" }}>
          <CardHeader className="pb-4">
            <CardTitle
              className="text-sage-800 text-lg font-medium flex items-center justify-between cursor-pointer hover:text-sage-600 transition-colors"
              onClick={() => toggleSection("medicalRecords")}
            >
              {text[language].medicalRecords}
              {expandedSections.medicalRecords ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </CardTitle>
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
                        <p className="font-medium text-sage-800">Doctor John Doe</p>
                        <p className="text-sm text-sage-600">(123) 456-7890</p>
                        <p className="text-sm text-sage-600">john@email.com</p>
                        <p className="text-sm text-sage-600">Hope Clinic Center</p>
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
                      <p className="font-medium text-sage-800">Hope Clinic Center</p>
                      <p className="text-sm text-sage-600">(123) 456-7890</p>
                      <p className="text-sm text-sage-600">john@email.com</p>
                      <p className="text-sm text-sage-600">Hope Clinic Center</p>
                    </div>
                    <p className="text-xs text-sage-500 mt-2">
                      Hope Clinic Center is the best clinic in the area. 2024 Best Clinic Award Winner.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "600ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{text[language].upcomingAppts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sage-200">
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].date}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].type}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].doctor}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].clinic}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].time}</th>
                    <th className="text-right py-2 text-sm font-medium text-sage-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: "May 15, 2024",
                      type: "Ultrasound",
                      doctor: "Dr. John Doe",
                      clinic: "Hope IVF Center",
                      time: "9:30 AM",
                    },
                    {
                      date: "May 16, 2024",
                      type: "Ultrasound",
                      doctor: "Dr. Mary Doe",
                      clinic: "Hope IVF Center",
                      time: "9:30 AM",
                    },
                    {
                      date: "May 17, 2024",
                      type: "Ultrasound",
                      doctor: "Dr. Mary Doe",
                      clinic: "Hope IVF Center",
                      time: "9:30 AM",
                    },
                  ].map((appointment, index) => (
                    <tr key={index} className="border-b border-sage-100 hover:bg-sage-50 transition-colors">
                      <td className="py-3 text-sm text-sage-800">{appointment.date}</td>
                      <td className="py-3 text-sm text-sage-800">{appointment.type}</td>
                      <td className="py-3 text-sm text-sage-800">{appointment.doctor}</td>
                      <td className="py-3 text-sm text-sage-800">{appointment.clinic}</td>
                      <td className="py-3 text-sm text-sage-800">{appointment.time}</td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50"
                        >
                          {text[language].viewDetails}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "700ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{text[language].pastAppts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sage-200">
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].date}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].type}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].doctor}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].medication}</th>
                    <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].instructions}</th>
                    <th className="text-right py-2 text-sm font-medium text-sage-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: "May 1, 2024",
                      type: "Consultation",
                      doctor: "Dr. John Doe",
                      medication: "None",
                      instructions: "Continue Medications, Ultrasound needed, Bed rest for 3days",
                    },
                    {
                      date: "May 2, 2024",
                      type: "Evaluation",
                      doctor: "Dr. John Doe",
                      medication: "Med (drug A&B)",
                      instructions: "Continue Medications, Ultrasound needed, Bed rest for 3days",
                    },
                    {
                      date: "May 3, 2024",
                      type: "Ultrasound",
                      doctor: "Dr. John Doe",
                      medication: "None",
                      instructions: "Continue Medications, Ultrasound needed, Bed rest for 3days",
                    },
                  ].map((appointment, index) => (
                    <tr key={index} className="border-b border-sage-100 hover:bg-sage-50 transition-colors">
                      <td className="py-3 text-sm text-sage-800">{appointment.date}</td>
                      <td className="py-3 text-sm text-sage-800">{appointment.type}</td>
                      <td className="py-3 text-sm text-sage-800">{appointment.doctor}</td>
                      <td className="py-3 text-sm text-sage-800">{appointment.medication}</td>
                      <td className="py-3 text-sm text-sage-600 max-w-xs">
                        <div className="space-y-1">
                          {appointment.instructions.split(", ").map((instruction, i) => (
                            <div key={i} className="text-xs">
                              • {instruction}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50"
                        >
                          {text[language].viewDetails}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50">
            {text[language].unreadMessage}
          </Button>
          <Button variant="outline" className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50">
            {text[language].visitReport}
          </Button>
          <Button variant="outline" className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50">
            {text[language].doctorsNotes}
          </Button>
        </div>

        <Card className="bg-white border-sage-200 animate-slide-in-up" style={{ animationDelay: "800ms" }}>
          <CardHeader className="pb-4">
            <CardTitle
              className="text-sage-800 text-lg font-medium flex items-center justify-between cursor-pointer hover:text-sage-600 transition-colors"
              onClick={() => toggleSection("medicationTracker")}
            >
              {text[language].medicationTracker}
              {expandedSections.medicationTracker ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSections.medicationTracker && (
            <CardContent className="space-y-6 animate-slide-in-down">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Reminders */}
                <div>
                  <h4 className="font-medium text-sage-800 mb-3">{text[language].dailyReminders}</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-sage-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Morning</span>
                        <span className="text-xs text-sage-600">8:00 AM</span>
                      </div>
                      <p className="text-xs text-sage-600 mt-1">Take medication A</p>
                    </div>
                    <div className="p-3 bg-sage-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Evening</span>
                        <span className="text-xs text-sage-600">8:00 PM</span>
                      </div>
                      <p className="text-xs text-sage-600 mt-1">Take medication B</p>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <h4 className="font-medium text-sage-800 mb-3">{text[language].october2023}</h4>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                      <div key={day} className="p-2 text-xs font-medium text-sage-600">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <div key={day} className="p-2 text-xs hover:bg-sage-100 rounded cursor-pointer">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medication List */}
              <div>
                <h4 className="font-medium text-sage-800 mb-3">Medications</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sage-200">
                        <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].date}</th>
                        <th className="text-left py-2 text-sm font-medium text-sage-600">
                          {text[language].medication}
                        </th>
                        <th className="text-left py-2 text-sm font-medium text-sage-600">Dosage</th>
                        <th className="text-left py-2 text-sm font-medium text-sage-600">Next Dose</th>
                        <th className="text-left py-2 text-sm font-medium text-sage-600">{text[language].status}</th>
                        <th className="text-right py-2 text-sm font-medium text-sage-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          date: "Oct 1",
                          medication: "Folic Acid",
                          dosage: "400mcg",
                          nextDose: "Next 1 - Oct 1",
                          status: "Continue Medications, Ultrasound needed, Bed rest for 3days",
                        },
                        {
                          date: "Oct 2",
                          medication: "Vitamin",
                          dosage: "Once Daily",
                          nextDose: "Next 1 - Oct 1",
                          status: "Continue Medications, Ultrasound needed, Bed rest for 3days",
                        },
                        {
                          date: "Oct 3",
                          medication: "Folic",
                          dosage: "Once Daily",
                          nextDose: "Next 1 - Oct 1",
                          status: "Continue Medications, Ultrasound needed, Bed rest for 3days",
                        },
                      ].map((med, index) => (
                        <tr key={index} className="border-b border-sage-100 hover:bg-sage-50 transition-colors">
                          <td className="py-3 text-sm text-sage-800">{med.date}</td>
                          <td className="py-3 text-sm text-sage-800">{med.medication}</td>
                          <td className="py-3 text-sm text-sage-800">{med.dosage}</td>
                          <td className="py-3 text-sm text-sage-800">{med.nextDose}</td>
                          <td className="py-3 text-sm text-sage-600 max-w-xs">
                            <div className="space-y-1">
                              {med.status.split(", ").map((instruction, i) => (
                                <div key={i} className="text-xs">
                                  • {instruction}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50"
                            >
                              {text[language].viewDetails}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
