"use client"

import React from "react"
import { useState } from "react"
import { CommonHeader } from "@/components/common-header"
import { CommonSidebar } from "@/components/common-sidebar"
// import { adminSidebarConfig } from "@/config/sidebar-config"
import { getAdminSidebarConfig } from "@/config/sidebar-config";
import { useAuth } from "@/hooks/useAuth"

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        // theme="purple"
        // groups={adminSidebarConfig}
        groups={getAdminSidebarConfig()}
        // title="管理员"
      />
      
      {/* Header */}
      <CommonHeader 
        showMenuButton={true}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        // theme="purple"
        // title="YUNDA 管理员"
        type="admin"
      />
      {children}
    </div>
  )
}
