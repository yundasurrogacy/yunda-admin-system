"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, User, Mail, Phone, MapPin, Plus, Eye, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'
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
import { getParentsApplications, updateApplicationStatus } from '@/lib/graphql/applications'
import type { Application, ApplicationStatus } from '@/types/applications'

export default function ParentsApplicationsPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "cn">("en")
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')

  const text = {
    en: {
      title: "Parents Applications",
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
    },
    cn: {
      title: "意向父母申请表",
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
    }
  }

  useEffect(() => {
    loadApplications()
  }, [statusFilter])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const data = await getParentsApplications(50, 0, status)
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
    const basicInfo = appData?.basic_information || {}
    const contactInfo = appData?.contact_information || {}
    
    return (
      basicInfo.firstName?.toLowerCase().includes(searchLower) ||
      basicInfo.lastName?.toLowerCase().includes(searchLower) ||
      contactInfo.email_address?.toLowerCase().includes(searchLower) ||
      contactInfo.cell_phone?.includes(searchTerm)
    )
  })

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />{text[language].pending}</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{text[language].approved}</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />{text[language].rejected}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => {
            const appData = app.application_data as any
            const basicInfo = appData?.basic_information || {}
            const contactInfo = appData?.contact_information || {}
            const familyProfile = appData?.family_profile || {}
            const programInterests = appData?.program_interests || {}
            
            return (
              <div key={app.id} className="bg-white rounded-lg border border-sage-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-sage-800 font-medium">
                        {basicInfo.firstName} {basicInfo.lastName}
                      </h3>
                      <span className="text-sm text-sage-500">#{app.id}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                    {text[language][app.status]}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-sage-600">
                    <Mail className="w-4 h-4" />
                    <span>{contactInfo.email_address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-sage-600">
                    <Phone className="w-4 h-4" />
                    <span>{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-sage-600">
                    <MapPin className="w-4 h-4" />
                    <span>{familyProfile.city}, {familyProfile.state_or_province || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-sage-600">
                    <Calendar className="w-4 h-4" />
                    <span>DOB: {basicInfo.date_of_birth || 'N/A'}</span>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-sage-50 rounded-lg">
                  <div className="text-sm text-sage-700">
                    <div className="font-medium mb-1">服务需求:</div>
                    <div className="text-sage-600">
                      {programInterests.interested_services === 'surrogacyOnly' && '代孕服务'}
                      {programInterests.interested_services === 'surrogacyEggDonor' && '代孕+捐卵服务'}
                      {programInterests.interested_services === 'eggDonorOnly' && '捐卵服务'}
                      {programInterests.interested_services === 'thirdPartySurrogate' && '第三方代孕'}
                      {programInterests.interested_services === 'bringYourOwnSurrogate' && '自带代孕者'}
                      {programInterests.interested_services === 'bringYourOwnSurrogateEgg' && '自带代孕者+捐卵'}
                      {programInterests.interested_services === 'notSure' && '不确定'}
                    </div>
                    <div className="text-xs text-sage-500 mt-1">
                      期望孩子数量: {programInterests.desired_children_count || 'N/A'} | 
                      开始时间: {programInterests.journey_start_timing || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">性别认同:</span>
                    <span className="text-sage-600">{basicInfo.gender_identity || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">族裔:</span>
                    <span className="text-sage-600">{basicInfo.ethnicity || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">性取向:</span>
                    <span className="text-sage-600">{familyProfile.sexual_orientation || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-sage-500">语言:</span>
                    <span className="text-sage-600">{contactInfo.primary_languages?.join(', ') || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
                  <span className="text-sm text-sage-500">
                    {text[language].applicationDate}: {new Date(app.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  <div className="flex gap-2">
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
                      onClick={() => router.push(`/admin/parents-applications/${app.id}`)}
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
