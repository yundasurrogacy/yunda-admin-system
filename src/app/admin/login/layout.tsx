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
    <div className="min-h-screen flex flex-col text-sage-800 font-medium">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        groups={getAdminSidebarConfig()}
        type="admin"
      />
      {/* Header */}
      <CommonHeader 
        showMenuButton={true}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        type="admin"
      />
      {children}
    </div>
  )
}
