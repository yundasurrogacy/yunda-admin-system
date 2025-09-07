"use client"

import type React from "react"
import { cn } from "../lib/utils"
import { useState } from "react"
import { CommonHeader } from "./common-header"
import { CommonSidebar } from "./common-sidebar"
import { clientSidebarConfig } from "@/config/sidebar-config"

interface ClientLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  isLoggedIn?: boolean
}

export function ClientLayout({ children, showHeader = true, isLoggedIn = true }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme="sage"
        groups={clientSidebarConfig}
        title="YUNDA CLIENT"
        type="client"
      />
      
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {showHeader && (
          <CommonHeader 
            showMenuButton={true} 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            isLoggedIn={isLoggedIn} 
            theme="sage"
            // title="YUNDA CLIENT"
            type="client"
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
