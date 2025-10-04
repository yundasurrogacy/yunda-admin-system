
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
        { label: t('DASHBOARD'), href: "/client/dashboard", icon: LayoutDashboard },
        { label: t('MY PROFILE'), href: "/client/my-account", icon: UserCircle },
        { label: t('MY CASES'), href: "/client/my-cases", icon: Briefcase },
        // { label: t('JOURNEY'), href: "/client/journey", icon: Briefcase },
        // { label: t('IVF CLINIC'), href: "/client/ivf-clinic", icon: Stethoscope },
      ]
    },
    {
      items: [
        // { label: t('SURROGATE MATCH'), href: "/client/surrogate-match", icon: HeartPulse },
        // { label: t('TRUST ACCOUNT'), href: "/client/trust-account", icon: FolderOpen },
        // { label: t('MESSAGES'), href: "/client/messages", icon: MessageCircle },
        // { label: t('SUPPORT'), href: "/client/support", icon: Bell },
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
        { label: t('DASHBOARD'), href: "/admin/dashboard", icon: LayoutDashboard },
        { label: t('PARENTS APPLICATIONS'), href: "/admin/parents-applications", icon: UserCircle },
        { label: t('SURROGATES APPLICATIONS'), href: "/admin/surrogates-applications", icon: HeartPulse },
        { label: t('CLIENT PROFILES'), href: "/admin/client-profiles", icon: UserCircle },
        { label: t('SURROGATE PROFILES'), href: "/admin/surrogate-profiles", icon: HeartPulse },
        { label: t('ALL CASES'), href: "/admin/all-cases", icon: Briefcase },
        { label: t('CLIENT MANAGERS'), href: "/admin/client-manager", icon: Briefcase },
        { label: t('MANAGERS'), href: "/admin/managers", icon: Briefcase },
        { label: t('BLOGS'), href: "/admin/blogs", icon: FolderOpen },
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
        { label: t('DASHBOARD'), href: "/surrogacy/dashboard", icon: LayoutDashboard },
        { label: t('MY PROFILE'), href: "/surrogacy/profile", icon: UserCircle },
        { label: t('MY CASES'), href: "/surrogacy/my-cases", icon: Briefcase },
        // { label: t('MY INTENDED PARENTS'), href: "/surrogacy/intended-parents", icon: UserCircle },
      ]
    },
    // {
    //   items: [
    //     // { label: t('MY PROFILE'), href: "/surrogacy/profile", icon: UserCircle },
    //     // { label: t('myJourney'), href: "/surrogacy/journey", icon: Briefcase },
    //     // { label: t('MY JOURNAL'), href: "/surrogacy/journal", icon: Briefcase },
    //     // { label: t('LEGAL FILES'), href: "/surrogacy/legal-files", icon: FolderOpen },
    //     // { label: t('MEDICATION TRACKER'), href: "/surrogacy/medication", icon: Stethoscope },
    //     // { label: t('APPOINTMENTS'), href: "/surrogacy/appointments", icon: MessageCircle },
    //   ]
    // },
    {
      items: [
        // { label: t('MY CASES'), href: "/surrogacy/my-cases", icon: Briefcase },
        // { label: t('MESSAGES'), href: "/surrogacy/messages", icon: MessageCircle },
        // { label: t('SUPPORT'), href: "/surrogacy/support", icon: Bell },
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
        { label: t('DASHBOARD'), href: "/client-manager/dashboard", icon: LayoutDashboard },
        { label: t('MY CASES'), href: "/client-manager/my-cases", icon: Briefcase },
        // { label: t('clientProfiles'), href: "/client-manager/client-profiles", icon: UserCircle },
        // { label: t('surrogateProfiles'), href: "/client-manager/surrogate-profiles", icon: HeartPulse },
      ]
    },
    {
      items: [
        { label: t('CLIENT PROFILES'), href: "/client-manager/client-profiles", icon: UserCircle },
        { label: t('SURROGATE PROFILES'), href: "/client-manager/surrogate-profiles", icon: HeartPulse },
        // { label: t('DOCUMENTS'), href: "/client-manager/documents", icon: FolderOpen },
        // { label: t('MEDICAL RECORDS'), href: "/client-manager/medical-records", icon: Stethoscope },
        // { label: t('COMMUNICATION LOGS'), href: "/client-manager/communication-logs", icon: MessageCircle },
      ]
    },
    {
      items: [
        // { label: t('dailyTasks'), href: "/client-manager/daily-tasks", icon: Bell },
        // { label: t('notifications'), href: "/client-manager/notifications", icon: Bell },
      ]
    }
  ]
}
