"use client"

import React from "react"
import { CommonHeader } from "@/components/common-header"
import { useState } from "react"
import { CommonSidebar } from "@/components/common-sidebar"
import { clientSidebarConfig } from "@/config/sidebar-config"
import { useAuth } from "@/hooks/useAuth"

export default function ClientLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen relative text-sage-800 font-medium" style={{ background: 'rgba(250,241,224,0.25)' }}>
      {/* Sidebar */}
      <CommonSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        groups={clientSidebarConfig()}
        title="YUNDA CLIENT"
        type="client"
      />
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        <CommonHeader
          showMenuButton={true}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title="YUNDA CLIENT"
          type="client"
        />
        <main
          className={
            `flex-1 transition-all duration-300 ease-in-out p-4 md:p-6 ${sidebarOpen ? 'ml-64' : 'ml-0'}`
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
