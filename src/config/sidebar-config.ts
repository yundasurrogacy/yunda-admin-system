
"use client"
// 兼容旧命名导出，便于老代码导入
export const adminSidebarConfig = getAdminSidebarConfig;
export const clientSidebarConfig = getClientSidebarConfig;
export const surrogacySidebarConfig = getSurrogacySidebarConfig;
export const managerSidebarConfig = getManagerSidebarConfig;
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  FolderOpen,
  HeartPulse,
  Stethoscope,
  MessageCircle,
  Bell,
} from "lucide-react"

// Client侧边栏配置
export function getClientSidebarConfig() {
  const { t } = useTranslation('common')
  return [
    {
      items: [
        { label: t('dashboard'), href: "/client/dashboard", icon: LayoutDashboard },
        { label: t('myProfile'), href: "/client/my-account", icon: UserCircle },
        { label: t('myCases'), href: "/client/my-cases", icon: Briefcase },
        { label: t('journey'), href: "/client/journey", icon: Briefcase },
        { label: t('ivfClinic'), href: "/client/ivf-clinic", icon: Stethoscope },
      ]
    },
    {
      items: [
        { label: t('surrogateMatch'), href: "/client/surrogate-match", icon: HeartPulse },
        { label: t('trustAccount'), href: "/client/trust-account", icon: FolderOpen },
        { label: t('messages'), href: "/client/messages", icon: MessageCircle },
        { label: t('support'), href: "/client/support", icon: Bell },
      ]
    }
  ]
}

// Admin侧边栏配置
export function getAdminSidebarConfig() {
  const { t } = useTranslation('common')
  return [
    {
      items: [
        { label: t('dashboard'), href: "/admin/dashboard", icon: LayoutDashboard },
        { label: t('parentsApplications'), href: "/admin/parents-applications", icon: UserCircle },
        { label: t('surrogatesApplications'), href: "/admin/surrogates-applications", icon: HeartPulse },
        { label: t('clientProfiles'), href: "/admin/client-profiles", icon: UserCircle },
        { label: t('surrogateProfiles'), href: "/admin/surrogate-profiles", icon: HeartPulse },
        { label: t('allCases'), href: "/admin/all-cases", icon: Briefcase },
        { label: t('clientManagers'), href: "/admin/client-manager", icon: Briefcase },
        { label: t('managers'), href: "/admin/managers", icon: Briefcase },
      ]
    }
  ]
}

// Surrogacy侧边栏配置
export function getSurrogacySidebarConfig() {
  const { t } = useTranslation('common')
  return [
    {
      items: [
        { label: t('dashboard'), href: "/surrogacy/dashboard", icon: LayoutDashboard },
        { label: t('myProfile'), href: "/surrogacy/profile", icon: UserCircle },
        { label: t('myCases'), href: "/surrogacy/my-cases", icon: Briefcase },
        { label: t('myIntendedParents'), href: "/surrogacy/intended-parents", icon: UserCircle },
      ]
    },
    {
      items: [
        { label: t('myJournal'), href: "/surrogacy/journal", icon: Briefcase },
        { label: t('legalFiles'), href: "/surrogacy/legal-files", icon: FolderOpen },
        { label: t('medicationTracker'), href: "/surrogacy/medication", icon: Stethoscope },
        { label: t('appointments'), href: "/surrogacy/appointments", icon: MessageCircle },
      ]
    },
    {
      items: [
        { label: t('messages'), href: "/surrogacy/messages", icon: MessageCircle },
        { label: t('support'), href: "/surrogacy/support", icon: Bell },
      ]
    }
  ]
}

// Manager侧边栏配置
export function getManagerSidebarConfig() {
  const { t } = useTranslation('common')
  return [
    {
      items: [
        { label: t('dashboard'), href: "/client-manager/dashboard", icon: LayoutDashboard },
        { label: t('myCases'), href: "/client-manager/my-cases", icon: Briefcase },
        { label: t('clientProfiles'), href: "/client-manager/client-profiles", icon: UserCircle },
        { label: t('surrogateProfiles'), href: "/client-manager/surrogate-profiles", icon: HeartPulse },
      ]
    },
    {
      items: [
        { label: t('documents'), href: "/client-manager/documents", icon: FolderOpen },
        { label: t('medicalRecords'), href: "/client-manager/medical-records", icon: Stethoscope },
        { label: t('communicationLogs'), href: "/client-manager/communication-logs", icon: MessageCircle },
      ]
    },
    {
      items: [
        { label: t('dailyTasks'), href: "/client-manager/daily-tasks", icon: Bell },
        { label: t('notifications'), href: "/client-manager/notifications", icon: Bell },
      ]
    }
  ]
}
