"use client"

import React from "react"
import { CommonHeader } from "@/components/common-header"
import { useState } from "react"
import { CommonSidebar } from "@/components/common-sidebar"
import {surrogacySidebarConfig } from "@/config/sidebar-config"

export default function SurrogacyLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme="blue"
        groups={surrogacySidebarConfig}
        // title="代孕母"
        type="surrogacy"
      />
      
      {/* Header */}
      <CommonHeader 
        showMenuButton={true} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isLoggedIn={false} 
        theme="blue"
        title="YUNDA SURROGACY"
        type="surrogacy"
      />
      {children}
    </div>
  )
}
