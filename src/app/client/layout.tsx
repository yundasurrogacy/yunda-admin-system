"use client"

import React from "react"
import { CommonHeader } from "@/components/common-header"
import { useState } from "react"
import { CommonSidebar } from "@/components/common-sidebar"
import { clientSidebarConfig } from "@/config/sidebar-config"

export default function ClientLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme="blue"
        groups={clientSidebarConfig}
        title="YUNDA CLIENT"
        type="client"
      />
      
      {/* Header */}
      <CommonHeader 
        showMenuButton={true} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isLoggedIn={false} 
        theme="blue"
        title="YUNDA CLIENT"
        type="client"
      />
      {children}
    </div>
  )
}
