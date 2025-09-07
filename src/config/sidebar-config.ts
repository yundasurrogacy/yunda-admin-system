"use client"

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
export const clientSidebarConfig = [
  {
    items: [
      { label: "DASHBOARD", href: "/client/dashboard", icon: LayoutDashboard },
      { label: "MY PROFILE", href: "/client/profile", icon: UserCircle },
      { label: "JOURNEY", href: "/client/journey", icon: Briefcase },
      { label: "IVF clinic", href: "/client/ivf-clinic", icon: Stethoscope },
    ]
  },
  {
    items: [
      { label: "surrogate match", href: "/client/surrogate-match", icon: HeartPulse },
      { label: "trust account", href: "/client/trust-account", icon: FolderOpen },
      { label: "messages", href: "/client/messages", icon: MessageCircle },
      { label: "support", href: "/client/support", icon: Bell },
    ]
  }
]

// Admin侧边栏配置
export const adminSidebarConfig = [
  {
    items: [
      { label: "DASHBOARD", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "MY CASE", href: "/admin/my-cases", icon: Briefcase },
      { label: "ALL CASES", href: "/admin/all-cases", icon: Briefcase },
      { label: "CASE ASSIGNMENT", href: "/admin/case-assignment", icon: Briefcase },
      { label: "TEAM OVERVIEW", href: "/admin/team-overview", icon: UserCircle },
    ]
  },
  {
    items: [
      { label: "CLIENT PROFILES", href: "/admin/client-profiles", icon: UserCircle },
      { label: "SURROGATE PROFILES", href: "/admin/surrogate-profiles", icon: HeartPulse },
      { label: "DOCUMENTS", href: "/admin/documents", icon: FolderOpen },
      { label: "MEDICAL RECORDS", href: "/admin/medical-records", icon: Stethoscope },
      { label: "COMMUNICATION LOGS", href: "/admin/communication-logs", icon: MessageCircle },
    ]
  },
  {
    items: [
      { label: "DAILY TASKS", href: "/admin/daily-tasks", icon: Bell },
      { label: "NOTIFICATIONS", href: "/admin/notifications", icon: Bell },
    ]
  }
]

// Surrogacy侧边栏配置
export const surrogacySidebarConfig = [
  {
    items: [
      { label: "DASHBOARD", href: "/surrogacy/dashboard", icon: LayoutDashboard },
      { label: "MY PROFILE", href: "/surrogacy/profile", icon: UserCircle },
      { label: "MY INTENDED PARENTS", href: "/surrogacy/intended-parents", icon: UserCircle },
    ]
  },
  {
    items: [
      { label: "MY JOURNAL", href: "/surrogacy/journal", icon: Briefcase },
      { label: "LEGAL FILES", href: "/surrogacy/legal-files", icon: FolderOpen },
      { label: "MEDICATION TRACKER", href: "/surrogacy/medication", icon: Stethoscope },
      { label: "APPOINTMENTS", href: "/surrogacy/appointments", icon: MessageCircle },
    ]
  },
  {
    items: [
      { label: "MESSAGES", href: "/surrogacy/messages", icon: MessageCircle },
      { label: "SUPPORT", href: "/surrogacy/support", icon: Bell },
    ]
  }
]

// Manager侧边栏配置
export const managerSidebarConfig = [
  {
    items: [
      { label: "DASHBOARD", href: "/client-manager/dashboard", icon: LayoutDashboard },
      { label: "MY CASES", href: "/client-manager/my-cases", icon: Briefcase },
      { label: "CLIENT PROFILES", href: "/client-manager/client-profiles", icon: UserCircle },
      { label: "SURROGATE PROFILES", href: "/client-manager/surrogate-profiles", icon: HeartPulse },
    ]
  },
  {
    items: [
      { label: "DOCUMENTS", href: "/client-manager/documents", icon: FolderOpen },
      { label: "MEDICAL RECORDS", href: "/client-manager/medical-records", icon: Stethoscope },
      { label: "COMMUNICATION LOGS", href: "/client-manager/communication-logs", icon: MessageCircle },
    ]
  },
  {
    items: [
      { label: "DAILY TASKS", href: "/client-manager/daily-tasks", icon: Bell },
      { label: "NOTIFICATIONS", href: "/client-manager/notifications", icon: Bell },
    ]
  }
]
