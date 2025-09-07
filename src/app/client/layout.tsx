"use client"

import { ClientLayout } from "@/components/client-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      <div className="min-h-screen p-0 m-0 font-serif bg-[#FBF0DA40] text-[#271F18]">
        {children}
      </div>
    </ClientLayout>
  )
}
