'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CommonHeader } from './common-header'
import { CommonSidebar } from './common-sidebar'
import { managerSidebarConfig } from '@/config/sidebar-config'
import { useAuth } from '@/hooks/useAuth'
import { useAppType } from "@/context/app-type-context"
import { useSidebar } from "@/context/sidebar-context"
export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { isAuthenticated } = useAuth();
  const { setAppType } = useAppType();
  useEffect(() => {
    setAppType("manager");
  }, [setAppType]);
  return (
    <div className="min-h-screen bg-background relative text-sage-800 font-medium">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        groups={managerSidebarConfig()}
        type="manager"
      />
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {/* <CommonHeader 
          showMenuButton={true} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          type="manager"
        /> */}
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
