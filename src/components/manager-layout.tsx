'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CommonHeader } from './common-header'
import { CommonSidebar } from './common-sidebar'
import { managerSidebarConfig } from '@/config/sidebar-config'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <CommonSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        // theme="blue"
        // groups={managerSidebarConfig as any}
        groups={managerSidebarConfig()}
        // title="YUNDA MANAGER"
        type="manager"
      />
      
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        <CommonHeader 
          showMenuButton={true} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          isLoggedIn={true} 
          // theme="blue"
          // title="YUNDA MANAGER"
          type="client-manager"
        />
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
