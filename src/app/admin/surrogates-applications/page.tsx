"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, User, Heart, Calendar, MapPin, Activity, Plus, Eye, CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react'
import { AdminLayout } from '../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getSurrogatesApplications, updateApplicationStatus } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'

export default function SurrogatesApplicationsPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "cn">("en")
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')

  const text = {
    en: {
      title: "Surrogates Applications",
      searchPlaceholder: "Search applicants...",
      addNew: "Add New Application",
      filterBy: "Filter by",
      status: "Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      all: "All Status",
      viewProfile: "View Details",
      approve: "Approve",
      reject: "Reject",
      lastUpdate: "Last Update",
      applicationDate: "Application Date",
      noApplications: "No applications found",
      loading: "Loading...",
      age: "Age",
      experience: "Experience",
      healthStatus: "Health Status",
      previousBirths: "Previous Births",
      bmi: "BMI",
      lastMedical: "Last Medical Check",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
    },
    cn: {
      title: "代孕者申请表",
      searchPlaceholder: "搜索申请人...",
      addNew: "添加新申请",
      filterBy: "筛选",
      status: "状态",
      pending: "待审核",
      approved: "已通过",
      rejected: "已拒绝",
      all: "全部状态",
      viewProfile: "查看详情",
      approve: "通过",
      reject: "拒绝",
      lastUpdate: "最后更新",
      applicationDate: "申请时间",
      noApplications: "暂无申请记录",
      loading: "加载中...",
      age: "年龄",
      experience: "经验",
      healthStatus: "健康状况",
      previousBirths: "生育经历",
      bmi: "体重指数",
      lastMedical: "最近体检",
      excellent: "优秀",
      good: "良好",
      fair: "一般",
    }
  }

  useEffect(() => {
    loadApplications()
  }, [statusFilter])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const data = await getSurrogatesApplications(50, 0, status)
      setApplications(data)
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, newStatus)
      await loadApplications() // 重新加载数据
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    const appData = app.application_data as any
    const contactInfo = appData?.contact_information || {}
    
    return (
      contactInfo.first_name?.toLowerCase().includes(searchLower) ||
      contactInfo.last_name?.toLowerCase().includes(searchLower) ||
      contactInfo.email_address?.toLowerCase().includes(searchLower) ||
      contactInfo.cell_phone?.includes(searchTerm)
    )
  })

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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-sage-100 text-sage-800'
    }
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

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={text[language].title}
          rightContent={
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {}}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250"
              >
                <Plus className="w-4 h-4 mr-2" />
                {text[language].addNew}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Filter className="w-4 h-4 mr-2" />
                    {text[language].filterBy}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    {text[language].all}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    {text[language].pending}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                    {text[language].approved}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                    {text[language].rejected}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
        />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-5 h-5" />
          <Input 
            type="text"
            placeholder={text[language].searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Applications Grid - 弹性布局美化 */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {filteredApplications.map((app) => {
            const appData = app.application_data as any
            const contactInfo = appData?.contact_information || {}
            const aboutYou = appData?.about_you || {}
            const pregnancyHealth = appData?.pregnancy_and_health || {}
            // 计算年龄
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
            const age = calculateAge(contactInfo.date_of_birth)
            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-sage-200 p-6 flex flex-col justify-between shadow-sm w-full"
                style={{ minWidth: '0' }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-7 w-7 text-sage-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-sage-800 truncate">{contactInfo.first_name} {contactInfo.last_name}</div>
                    <div className="text-sage-500 text-sm truncate">#{app.id} • {age} years</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>{text[language][app.status]}</span>
                </div>
                <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-sage-400" />
                    <span className="truncate">{contactInfo.email_address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-4 h-4 text-sage-400" />
                    <span className="truncate">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-sage-400" />
                    <span className="truncate">{contactInfo.city}, {contactInfo.state_or_province || 'N/A'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600 truncate">{pregnancyHealth.birth_details || 'No births'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600 truncate">BMI: {contactInfo.bmi || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600 truncate">DOB: {contactInfo.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-sage-500" />
                    <span className="text-sage-600 truncate">{aboutYou.occupation || 'N/A'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">种族:</span>
                    <span className="text-sage-600 truncate">{contactInfo.ethnicity || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">教育:</span>
                    <span className="text-sage-600 truncate">{aboutYou.education_level || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">身高体重:</span>
                    <span className="text-sage-600 truncate">{contactInfo.height} / {contactInfo.weight}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">身份:</span>
                    <span className="text-sage-600 truncate">{contactInfo.us_citizen_or_visa_status || 'N/A'}</span>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-sage-50 rounded-lg">
                  <div className="text-sm text-sage-700">
                    <div className="font-medium mb-1">代孕经验:</div>
                    <div className="text-sage-600 truncate">
                      {aboutYou.is_former_surrogate ? '有经验' : '首次代孕'}
                      {contactInfo.surrogacy_experience_count > 0 && ` (${contactInfo.surrogacy_experience_count}次)`}
                    </div>
                    {aboutYou.surrogate_experience && (
                      <div className="text-xs text-sage-500 mt-1 truncate">
                        {aboutYou.surrogate_experience}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
                  <span className="text-sm text-sage-500">
                    {text[language].applicationDate}: {new Date(app.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {app.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {text[language].approve}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          {text[language].reject}
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="link" 
                      className="text-sage-600 hover:text-sage-800"
                      onClick={() => router.push(`/admin/surrogates-applications/${app.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {text[language].viewProfile}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-sage-500">
            {text[language].noApplications}
          </div>
        )}
      </PageContent>
    </AdminLayout>
  )
}
