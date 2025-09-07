"use client"

import React from "react"
import { CommonHeader } from "@/components/common-header"
import { useState } from "react"
import { CommonSidebar } from "@/components/common-sidebar"
import { managerSidebarConfig } from "@/config/sidebar-config"

export default function ManagerLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme="blue"
        groups={managerSidebarConfig}
        title="客户经理"
      />
      
      {/* Header */}
      <CommonHeader 
        showMenuButton={true} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isLoggedIn={false} 
        theme="blue"
        title="YUNDA 客户经理"
        type="client-manager"
      />
      {children}
    </div>
  )
}
