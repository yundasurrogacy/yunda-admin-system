"use client"

import React from "react"
import { CommonHeader } from "@/components/common-header"
import { useState } from "react"
import { CommonSidebar } from "@/components/common-sidebar"
import { clientSidebarConfig } from "@/config/sidebar-config"

export default function ClientLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
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
          isLoggedIn={false}
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
