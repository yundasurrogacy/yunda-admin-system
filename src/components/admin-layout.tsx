"use client"

import type React from "react"
import { cn } from "../lib/utils"
import { useState } from "react"
import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  isLoggedIn?: boolean
}

export function AdminLayout({ children, showHeader = true, isLoggedIn = true }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative">
      {/* Fixed Menu Button */}
      {showHeader && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center",
            "bg-sage-50 hover:bg-sage-100 text-sage-600 rounded-lg",
            "transition-all duration-300 ease-in-out",
            "border border-sage-200 shadow-sm",
            sidebarOpen ? "left-[248px]" : "left-4"
          )}
        >
          <svg
            className={cn(
              "w-6 h-6 transition-transform duration-300",
              sidebarOpen ? "rotate-180" : ""
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {showHeader && (
          <AdminHeader showMenuButton={false} isLoggedIn={isLoggedIn} />
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