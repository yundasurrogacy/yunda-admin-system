"use client"
import { cn } from "../lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  UserCircle,
  FileText,
  Calendar,
  FolderOpen,
  Stethoscope,
  MessageCircle,
  Bell,
  Info,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SurrogacySidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { label: "DASHBOARD", href: "/surrogacy/dashboard", icon: LayoutDashboard },
  { label: "MY CASE", href: "/surrogacy/my-case", icon: Briefcase },
  { label: "MY CALENDAR", href: "/surrogacy/calendar", icon: Calendar },
]

const profileItems = [
  { label: "MY PROFILE", href: "/surrogacy/profile", icon: UserCircle },
  { label: "INTENDED PARENTS", href: "/surrogacy/intended-parents", icon: UserCircle },
  { label: "DOCUMENTS", href: "/surrogacy/documents", icon: FolderOpen },
  { label: "MEDICAL RECORDS", href: "/surrogacy/medical-records", icon: Stethoscope },
  { label: "COMMUNICATION", href: "/surrogacy/communication", icon: MessageCircle },
]

const infoItems = [
  { label: "NOTIFICATIONS", href: "/surrogacy/notifications", icon: Bell },
  { label: "PROCESS INFO", href: "/surrogacy/process-info", icon: Info },
  { label: "HELP & SUPPORT", href: "/surrogacy/help", icon: HelpCircle },
]

export function SurrogacySidebar({ isOpen, onClose }: SurrogacySidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-purple-50 border-r border-purple-200 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-[72px] border-b border-purple-200" />

        <nav className="p-0">
          {/* Main navigation section */}
          <div className="border-b border-purple-200">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 cursor-pointer transition-colors duration-200 border-b border-purple-100",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-purple-100 text-purple-900",
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
          <div className="border-b border-purple-200">
            {profileItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 cursor-pointer transition-colors duration-200 border-b border-purple-100",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-purple-100 text-purple-900",
                  )}
                  onClick={onClose}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Information section */}
          <div>
            {infoItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 cursor-pointer transition-colors duration-200 border-b border-purple-100",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-purple-100 text-purple-900",
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
