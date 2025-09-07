"use client"

import type React from "react"
import { cn } from "../lib/utils"
import { useState } from "react"
import { CommonHeader } from "./common-header"
import { CommonSidebar } from "./common-sidebar"
import { surrogacySidebarConfig } from "@/config/sidebar-config"

interface SurrogacyLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  isLoggedIn?: boolean
}

export function SurrogacyLayout({ children, showHeader = true, isLoggedIn = true }: SurrogacyLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        theme="purple"
        groups={surrogacySidebarConfig}
        // title="YUNDA SURROGACY"
        type="surrogacy"
      />
      
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {showHeader && (
          <CommonHeader 
            showMenuButton={true} 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            isLoggedIn={isLoggedIn} 
            theme="blue"
            title="YUNDA SURROGACY"
            type="surrogacy"
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
