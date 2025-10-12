"use client"

import React, { useEffect, useState } from "react"
import { CommonSidebar } from "@/components/common-sidebar"
import { surrogacySidebarConfig } from "@/config/sidebar-config"
import { useAuth } from "@/hooks/useAuth"
import { useAppType } from "@/context/app-type-context"
import { useSidebar } from "@/context/sidebar-context"

export default function SurrogacyLoginLayout({ children }: { children: React.ReactNode }) {
  // const [sidebarOpen, setSidebarOpen] = useState(false);  
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { isAuthenticated } = useAuth();
  const { setAppType } = useAppType();
  useEffect(() => {
    setAppType("surrogacy");
  }, [setAppType]);

  return (
    <div className="min-h-screen bg-background relative text-sage-800 font-medium">
      {/* Sidebar */}
      <CommonSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        groups={surrogacySidebarConfig()}
        type="surrogacy"
      />
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {/* Header 已全局持久化渲染，这里无需重复渲染 */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out p-4 md:p-6 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
