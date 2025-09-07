"use client"
import { cn } from "../lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  UserCircle,
  HeartPulse,
  FolderOpen,
  Stethoscope,
  MessageCircle,
  Bell,
  PlusCircle,
  Search
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ClientSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { label: "DASHBOARD", href: "/client/dashboard", icon: LayoutDashboard },
  { label: "MY PROFILE", href: "/client/profile", icon: UserCircle },
]

const journeyItems = [
  { label: "JOURNEY", href: "/client/journey", icon: Briefcase },
  { label: "My Files", href: "/client/my-files", icon: FolderOpen },
  { label: "Medical Match", href: "/client/medical-match", icon: HeartPulse },
  { label: "1st Clinic", href: "/client/first-clinic", icon: Stethoscope },
]

const supportItems = [
  { label: "Messages", href: "/client/messages", icon: MessageCircle },
  { label: "Support", href: "/client/support", icon: Bell },
]

export function ClientSidebar({ isOpen, onClose }: ClientSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-sage-50 border-r border-sage-200 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-[64px] border-b border-sage-200 flex items-center justify-center">
          <div className="text-center">
            <span className="font-semibold text-lg tracking-wider text-sage-800">YUNDA</span>
          </div>
        </div>

        <nav className="p-0">
          {/* Main navigation section */}
          <div className="border-b border-sage-200">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-sage-700 hover:bg-sage-100 cursor-pointer transition-colors duration-200",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-sage-100 text-sage-900 font-semibold",
                  )}
                  onClick={onClose}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Journey section */}
          <div className="border-b border-sage-200 pt-2">
            {journeyItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-sage-700 hover:bg-sage-100 cursor-pointer transition-colors duration-200",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-sage-100 text-sage-900 font-semibold",
                  )}
                  onClick={onClose}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Support section */}
          <div className="pt-2">
            {supportItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-sage-700 hover:bg-sage-100 cursor-pointer transition-colors duration-200",
                    "flex items-center gap-3",
                    pathname === item.href && "bg-sage-100 text-sage-900 font-semibold",
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
