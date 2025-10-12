"use client"

import type React from "react"
import { cn } from "../lib/utils"
import { useSidebar } from "@/context/sidebar-context"
import { useAppType } from "@/context/app-type-context"
import { useEffect } from "react"
import { CommonHeader } from "./common-header"
import { CommonSidebar } from "./common-sidebar"
import { getAdminSidebarConfig } from "@/config/sidebar-config"
import { useAuth } from "@/hooks/useAuth"

interface AdminLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  isLoggedIn?: boolean
}

export function AdminLayout({ children, showHeader = true, isLoggedIn = true }: AdminLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { user, isAuthenticated } = useAuth();
  const { setAppType } = useAppType();
  useEffect(() => {
    setAppType("admin");
  }, [setAppType]);
  return (
    <div className="min-h-screen bg-background relative text-sage-800 font-medium">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme="sage"
        groups={getAdminSidebarConfig()}
        type="admin"
      />
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {/* {showHeader && (
          <CommonHeader 
            showMenuButton={true} 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            type="admin"
          />
        )} */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out p-4 md:p-6",
          sidebarOpen ? "ml-64" : "ml-0"
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}