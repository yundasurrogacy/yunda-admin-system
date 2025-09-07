'use client'
import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function IntendedParents() {
  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">My Intended Parents</h1>
      <p className="text-[#271F18] font-serif mb-8">Here are some details about the intended parents you are matched with.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex items-center gap-6">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-serif mb-1">John Doe</div>
            <div className="text-sm mb-1">Date of Birth: March 19, 1980</div>
            <div className="text-sm mb-1">Age: 35</div>
            <div className="text-sm mb-1">State: New York</div>
          </div>
        </div>
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18]">
          <h2 className="font-serif text-lg mb-2">Why We Chose You</h2>
          <div className="mb-2">“Thank you for bringing hope to our family. We felt a strong connection from the start.”</div>
          <div>“Thank you for bringing hope to our family. We felt a strong connection from the start.”</div>
        </div>
      </div>
      {/* Message Board */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="font-serif text-lg mb-2">Message Board</h2>
        <div className="bg-[#E3E8E3] rounded p-2 mb-2 text-[#271F18]">John Doe: “hi my name is John Doe”</div>
        <div className="flex justify-between items-center">
          <div className="text-[#271F18]">James West: hi my name is John Doe hi my name is John Doe, hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is</div>
          <span className="text-xs text-[#271F18] ml-4">April 18, 2025</span>
        </div>
      </div>
    </div>
  )
}
