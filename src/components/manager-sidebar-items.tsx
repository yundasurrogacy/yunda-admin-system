"use client"

import {
  BarChart,
  Briefcase,
  Users,
  FileText,
  CheckSquare,
  MessageCircle,
  Bell,
  HeartPulse
} from "lucide-react"

// 定义经理端导航菜单项
export const managerMenuItems = [
  { label: "DASHBOARD", href: "/client-manager/dashboard", icon: BarChart },
  { label: "MY CASES", href: "/client-manager/my-cases", icon: Briefcase },
]

export const managerProfileItems = [
  { label: "CLIENT PROFILES", href: "/client-manager/client-profiles", icon: Users },
  { label: "SURROGATE PROFILES", href: "/client-manager/surrogate-profiles", icon: HeartPulse },
  { label: "MEDICAL RECORDS", href: "/client-manager/medical-records", icon: FileText },
  { label: "COMMUNICATION LOGS", href: "/client-manager/communication-logs", icon: MessageCircle },
]

export const managerTaskItems = [
  { label: "DAILY TASKS", href: "/client-manager/daily-tasks", icon: CheckSquare },
  { label: "NOTIFICATIONS", href: "/client-manager/notifications", icon: Bell },
]
