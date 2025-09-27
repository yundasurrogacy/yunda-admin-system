"use client"

import React from "react"
import { CommonHeader } from "@/components/common-header"
import { useState } from "react"
import { CommonSidebar } from "@/components/common-sidebar"
import {surrogacySidebarConfig } from "@/config/sidebar-config"

export default function SurrogacyLoginLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <CommonSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        groups={surrogacySidebarConfig()}
        type="surrogacy"
      />

      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        <CommonHeader
          showMenuButton={true}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isLoggedIn={false}
          title="YUNDA SURROGACY"
          type="surrogacy"
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
