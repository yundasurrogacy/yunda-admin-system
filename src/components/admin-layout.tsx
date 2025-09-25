"use client"

import type React from "react"
import { cn } from "../lib/utils"
import { useState } from "react"
import { CommonHeader } from "./common-header"
import { CommonSidebar } from "./common-sidebar"
import { adminSidebarConfig } from "@/config/sidebar-config"

interface AdminLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  isLoggedIn?: boolean
}

export function AdminLayout({ children, showHeader = true, isLoggedIn = true }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme="sage"
        groups={adminSidebarConfig}
        // title="YUNDA ADMIN"
        type="admin"
      />
      
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {showHeader && (
          <CommonHeader 
            showMenuButton={true} 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            isLoggedIn={isLoggedIn} 
            // theme="purple"
            // title="YUNDA ADMIN"
            type="admin"
          />
        )}
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