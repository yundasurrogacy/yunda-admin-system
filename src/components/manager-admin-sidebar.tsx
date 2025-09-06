"use client"

import { cn } from "../lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  managerMenuItems,
  managerProfileItems,
  managerTaskItems
} from "./manager-sidebar-items"

interface ManagerAdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ManagerAdminSidebar({ isOpen, onClose }: ManagerAdminSidebarProps) {
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
            {managerMenuItems.map((item) => (
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
            {managerProfileItems.map((item) => (
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
            {managerTaskItems.map((item) => (
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
