"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from "react-i18next"
import i18n from '@/i18n'
import { Search, Filter, User, Heart, Calendar, MapPin, Activity, Plus, Eye, CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react'
// import { AdminLayout } from '../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { CustomButton } from '@/components/ui/CustomButton'
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
  const { t, i18n } = useTranslation("common")
  const [lang, setLang] = useState(i18n.language)
  // 分页相关
  const [allApplications, setAllApplications] = useState<Application[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [pageSize, setPageSize] = useState(10)

  // 自适应每页条数，始终两行，宽度自适应
  useEffect(() => {
    function calcPageSize() {
      const containerWidth = window.innerWidth - 64
      const cardWidth = 340 + 32
      const rowCount = Math.max(1, Math.floor(containerWidth / cardWidth))
      const colCount = 2 // 固定两行
      const newPageSize = rowCount * colCount
      setPageSize(newPageSize)
    }
    calcPageSize()
    window.addEventListener('resize', calcPageSize)
    return () => window.removeEventListener('resize', calcPageSize)
  }, [])

  useEffect(() => {
    const handleLangChange = () => setLang(i18n.language)
    i18n.on("languageChanged", handleLangChange)
    return () => i18n.off("languageChanged", handleLangChange)
  }, [i18n])

  // 获取全部数据
  useEffect(() => {
    loadApplications()
  }, [statusFilter])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const data = await getSurrogatesApplications(10000, 0, status)
      setAllApplications(data)
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

  // 搜索和分页
  useEffect(() => {
    const filtered = allApplications.filter(app => {
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
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
    const start = (page - 1) * pageSize
    const end = start + pageSize
    setApplications(filtered.slice(start, end))
  }, [allApplications, searchTerm, page, pageSize])

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
      // <AdminLayout key={lang}>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">{t('loading', { defaultValue: '加载中...' })}</div>
          </div>
        </PageContent>
      // </AdminLayout>
    )
  }

  return (
    // <AdminLayout key={lang}>
      <PageContent>
        <PageHeader
          title={t('surrogatesApplications')}
          rightContent={
            <div className="flex items-center gap-4">
              <CustomButton
                onClick={() => window.open('https://www.yundasurrogacy.com/be-parents', '_blank')}
                className="bg-sage-200 text-sage-800 hover:bg-sage-250 font-medium cursor-pointer"
              >
                {/* <Plus className="w-4 h-4 mr-2" /> */}
                {t('addNewApplication')}
              </CustomButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CustomButton className="bg-white font-medium cursor-pointer border border-sage-300 text-sage-800">
                    {/* <Filter className="w-4 h-4 mr-2" /> */}
                    {t('filterBy')}
                  </CustomButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white border border-sage-200 shadow-lg"
                  style={{ background: '#fff', opacity: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                >
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('all')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'all' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'all' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('allStatus')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('pending')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'pending' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'pending' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('pending')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('approved')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'approved' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'approved' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('approved')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('rejected')}
                    className={`cursor-pointer text-sage-800 ${statusFilter === 'rejected' ? 'bg-sage-100 font-semibold' : 'bg-white'}`}
                    style={{ background: statusFilter === 'rejected' ? '#F4F3F0' : '#fff', opacity: 1, boxShadow: 'none' }}
                  >
                    {t('rejected')}
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
            placeholder={t('searchApplicants', { defaultValue: '搜索申请人...' })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white font-medium text-sage-800"
          />
        </div>

        {/* Applications Grid - 弹性布局美化 */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
            minHeight: '320px',
          }}
        >
          {applications.map((app) => {
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
                    <div className="text-sage-800 text-sm font-medium truncate">#{app.id} • {age} years</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>{t(app.status, { defaultValue: app.status })}</span>
                </div>
                <div className="mt-2 space-y-1 text-sage-800 text-[15px] font-medium">
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
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <Heart className="w-4 h-4 text-sage-500" />
                    <span className="truncate">{pregnancyHealth.birth_details || 'No births'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <Activity className="w-4 h-4 text-sage-500" />
                    <span className="truncate">BMI: {contactInfo.bmi || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <Calendar className="w-4 h-4 text-sage-500" />
                    <span className="truncate">DOB: {contactInfo.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <User className="w-4 h-4 text-sage-500" />
                    <span className="truncate">{aboutYou.occupation || 'N/A'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <span>{t('ethnicity', { defaultValue: '种族' })}:</span>
                    <span className="truncate">{contactInfo.ethnicity || t('notAvailable', { defaultValue: 'N/A' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <span>{t('education', { defaultValue: '教育' })}:</span>
                    <span className="truncate">{aboutYou.education_level || t('notAvailable', { defaultValue: 'N/A' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <span>{t('heightWeight', { defaultValue: '身高体重' })}:</span>
                    <span className="truncate">{contactInfo.height || t('notAvailable', { defaultValue: 'N/A' })} / {contactInfo.weight || t('notAvailable', { defaultValue: 'N/A' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-sage-800">
                    <span>{t('identity', { defaultValue: '身份' })}:</span>
                    <span className="truncate">{contactInfo.us_citizen_or_visa_status || t('notAvailable', { defaultValue: 'N/A' })}</span>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-sage-50 rounded-lg">
                  <div className="text-sm font-medium text-sage-800">
                    <div className="mb-1">{t('surrogacyExperience', { defaultValue: '代孕经验' })}:</div>
                    <div className="truncate">
                      {aboutYou.is_former_surrogate
                        ? t('experiencedSurrogate', { defaultValue: '有经验' })
                        : t('firstTimeSurrogate', { defaultValue: '首次代孕' })}
                      {contactInfo.surrogacy_experience_count > 0 && ` (${contactInfo.surrogacy_experience_count}${t('times', { defaultValue: '次' })})`}
                    </div>
                    {aboutYou.surrogate_experience && (
                      <div className="text-xs text-sage-800 mt-1 truncate">
                        {aboutYou.surrogate_experience}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
                  <span className="text-sm font-medium text-sage-800">
                    {t('applicationDate', { defaultValue: '申请时间' })}: {new Date(app.created_at).toLocaleDateString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US')}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {app.status === 'pending' && (
                      <>
                        <CustomButton
                          className="bg-green-100 text-green-800 hover:bg-green-200 font-medium cursor-pointer px-3 py-1 text-sm rounded"
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                        >
                          {/* <CheckCircle className="w-3 h-3 mr-1" /> */}
                          {t('approve', { defaultValue: '通过' })}
                        </CustomButton>
                        <CustomButton
                          className="text-red-600 hover:bg-red-50 font-medium cursor-pointer border border-red-200 bg-white px-3 py-1 text-sm rounded"
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        >
                          {/* <XCircle className="w-3 h-3 mr-1" /> */}
                          {t('reject', { defaultValue: '拒绝' })}
                        </CustomButton>
                      </>
                    )}
                    <CustomButton
                      className="text-sage-800 hover:text-sage-900 font-medium cursor-pointer bg-transparent"
                      onClick={() => router.push(`/admin/surrogates-applications/${app.id}`)}
                    >
                      {/* <Eye className="w-4 h-4 mr-1" /> */}
                      {t('viewDetails', { defaultValue: '查看详情' })}
                    </CustomButton>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 分页控件 */}
        <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={page === 1}
            onClick={() => {
              const filtered = allApplications.filter(app => {
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
              const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
              const newPage = Math.max(1, page - 1)
              setPage(newPage)
              setPageInput(String(newPage))
            }}
          >
            {t('pagination.prevPage', { defaultValue: '上一页' })}
          </CustomButton>
          <span className="text-sage-700 text-sm flex items-center gap-2">
            {t('pagination.page', { defaultValue: '第' })}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '')
                setPageInput(val)
              }}
              onBlur={e => {
                const filtered = allApplications.filter(app => {
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
                const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
                let val = Number(e.target.value)
                if (isNaN(val) || val < 1) val = 1
                if (val > totalPages) val = totalPages
                setPage(val)
                setPageInput(String(val))
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const filtered = allApplications.filter(app => {
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
                  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
                  let val = Number((e.target as HTMLInputElement).value)
                  if (isNaN(val) || val < 1) val = 1
                  if (val > totalPages) val = totalPages
                  setPage(val)
                  setPageInput(String(val))
                }
              }}
              className="w-14 px-2 py-1 border border-sage-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-sage-300"
              aria-label={t('pagination.jumpToPage', { defaultValue: '跳转到页码' })}
            />
            {t('pagination.of', { defaultValue: '共' })} {(() => {
              const filtered = allApplications.filter(app => {
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
              return Math.max(1, Math.ceil(filtered.length / pageSize))
            })()} {t('pagination.pages', { defaultValue: '页' })}
          </span>
          <CustomButton
            className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
            disabled={(() => {
              const filtered = allApplications.filter(app => {
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
              const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
              return page >= totalPages
            })()}
            onClick={() => {
              const filtered = allApplications.filter(app => {
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
              const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
              const newPage = Math.min(totalPages, page + 1)
              setPage(newPage)
              setPageInput(String(newPage))
            }}
          >
            {t('pagination.nextPage', { defaultValue: '下一页' })}
          </CustomButton>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-8 text-sage-800 font-medium">
            {t('noApplications', { defaultValue: '暂无申请记录' })}
          </div>
        )}
      </PageContent>
    // </AdminLayout>
  )
}
