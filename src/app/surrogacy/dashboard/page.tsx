"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export default function SurrogacyDashboard() {
  return (
    <div className="p-8 min-h-screen" style={{ background: "#FBF0DA40" }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">
        DASHBOARD
      </h1>
      <p className="text-[#271F18] font-serif mb-8">
        Welcome to your dashboard! Access your priorities, important information,
        helpful tips, guides, and a variety of resources to support your journey
      </p>
      {/* Current Status */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif mb-2">Current Status</h2>
          <div className="flex gap-2 items-center mt-2">
            <div className="w-16 h-2 rounded bg-[#271F18]" />
            <div className="w-16 h-2 rounded bg-[#D9D9D9]" />
            <div className="w-16 h-2 rounded bg-[#D9D9D9]" />
            <div className="w-16 h-2 rounded bg-[#D9D9D9]" />
            <div className="w-16 h-2 rounded bg-[#D9D9D9]" />
            <div className="w-16 h-2 rounded bg-[#D9D9D9]" />
          </div>
          <div className="text-sm mt-2">Updated today</div>
        </div>
        <span className="rounded bg-[#D9D9D9] px-4 py-1 text-xs font-serif text-[#271F18]">
          Matched
        </span>
      </div>
      {/* Next Steps */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 grid grid-cols-2 md:grid-cols-6 gap-6">
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Upload Identification</span>
          </div>
          <span className="text-xs text-[#271F18]">Action Needed</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Sign Agreement</span>
          </div>
          <span className="text-xs text-[#271F18]">Due in 2 Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Sign Agreement</span>
          </div>
          <span className="text-xs text-[#271F18]">Due in 2 Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Sign Agreement</span>
          </div>
          <span className="text-xs text-[#271F18]">Due in 2 Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Make an Appointment</span>
          </div>
          <span className="text-xs text-[#271F18]">Action Needed</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Upload File</span>
          </div>
          <span className="text-xs text-[#271F18]">Pending</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Upload File</span>
          </div>
          <span className="text-xs text-[#271F18]">Pending</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center">
            <span className="text-sm">Upload File</span>
          </div>
          <span className="text-xs text-[#271F18]">Pending</span>
        </div>
      </div>
      {/* Quick Access & Support Corner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
          <h2 className="font-serif text-lg mb-4">Quick Access</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#E3E8E3] rounded p-2">📝</span>
              <span>Upload Journal</span>
              <span className="text-xs ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#E3E8E3] rounded p-2">🖼️</span>
              <span>Upload Ultrasound Image</span>
              <span className="text-xs ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#E3E8E3] rounded p-2">📩</span>
              <span>Check Messages</span>
              <span className="text-xs ml-auto">2 hours ago</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
          <h2 className="font-serif text-lg mb-4">Support Corner</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#271F18]">
                “You are stronger than you think.”
              </span>
              <span className="ml-auto text-xs">yesterday</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#271F18]">
                “Drink plenty of water and rest well this week”
              </span>
              <span className="ml-auto text-xs">today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
