"use client"
import { cn } from "../lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Files,
  ClipboardList,
  Users,
  UserCircle,
  HeartPulse,
  FolderOpen,
  Stethoscope,
  MessageCircle,
  CalendarCheck,
  Bell
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { label: "DASHBOARD", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "MY CASE", href: "/admin/my-cases", icon: Briefcase },
  { label: "ALL CASES", href: "/admin/all-cases", icon: Files },
  { label: "CASE ASSIGNMENT", href: "/admin/case-assignment", icon: ClipboardList },
  { label: "TEAM OVERVIEW", href: "/admin/team-overview", icon: Users },
]

const profileItems = [
  { label: "CLIENT PROFILES", href: "/admin/client-profiles", icon: UserCircle },
  { label: "SURROGATE PROFILES", href: "/admin/surrogate-profiles", icon: HeartPulse },
  { label: "DOCUMENTS", href: "/admin/documents", icon: FolderOpen },
  { label: "MEDICAL RECORDS", href: "/admin/medical-records", icon: Stethoscope },
  { label: "COMMUNICATION LOGS", href: "/admin/communication-logs", icon: MessageCircle },
]

const taskItems = [
  { label: "DAILY TASKS", href: "/admin/daily-tasks", icon: CalendarCheck },
  { label: "NOTIFICATIONS", href: "/admin/notifications", icon: Bell },
]

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-sage-50 border-r border-sage-200 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-[72px] border-b border-sage-200" />

        <nav className="p-0">
          {/* Main navigation section */}
          <div className="border-b border-sage-200">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-sage-700 hover:bg-sage-100 cursor-pointer transition-colors duration-200 border-b border-sage-100",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-sage-100 text-sage-900",
                  )}
                  onClick={onClose}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Profile management section */}
          <div className="border-b border-sage-200">
            {profileItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-sage-700 hover:bg-sage-100 cursor-pointer transition-colors duration-200 border-b border-sage-100",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-sage-100 text-sage-900",
                  )}
                  onClick={onClose}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Tasks section */}
          <div>
            {taskItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-sage-700 hover:bg-sage-100 cursor-pointer transition-colors duration-200 border-b border-sage-100",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-sage-100 text-sage-900",
                  )}
                  onClick={onClose}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}
