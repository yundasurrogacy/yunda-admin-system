"use client"

import React from "react"
import { useState } from "react"
import { CommonHeader } from "@/components/common-header"
import { CommonSidebar } from "@/components/common-sidebar"
import { adminSidebarConfig } from "@/config/sidebar-config"

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        // theme="purple"
        groups={adminSidebarConfig}
        // title="管理员"
      />
      
      {/* Header */}
      <CommonHeader 
        showMenuButton={true}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isLoggedIn={false}
        // theme="purple"
        // title="YUNDA 管理员"
        type="admin"
      />
      {children}
    </div>
  )
}
