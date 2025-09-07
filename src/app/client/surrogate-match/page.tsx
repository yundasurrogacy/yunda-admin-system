import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function SurrogateMatch() {
  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">Surrogate Match</h1>
      <p className="text-[#271F18] font-serif mb-8">Your current surrogate match and their latest updates</p>
      {/* 顶部信息区块 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex items-center gap-6 relative">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-serif mb-1">John Doe <span className="text-xs ml-2">#012345</span></div>
            <div className="text-sm mb-1">Date of Birth: March 19, 1980</div>
            <div className="text-sm mb-1">Age: 35</div>
            <div className="text-sm mb-1">State: New York</div>
          </div>
        </div>
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18]">
          <h2 className="font-serif text-lg mb-2">Recent Updates</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span>Diary entry uploaded</span><span>April 18, 2025</span></div>
            <div className="flex justify-between"><span>Weight: 150lb</span><span>April 18, 2025</span></div>
            <div className="flex justify-between"><span>Ultrasound image uploaded</span><span>April 18, 2025</span></div>
            <div className="flex justify-between"><span>Feeling happy today</span><span>April 18, 2025</span></div>
            <div className="flex justify-between"><span>Feeling happy today</span><span>April 18, 2025</span></div>
          </div>
        </div>
      </div>
      {/* Photo Wall */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="font-serif text-lg mb-2">Photo Wall</h2>
        <div className="flex gap-4">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="w-32 h-32 bg-[#E3E8E3] rounded mb-2 flex items-end justify-center">
              <span className="text-xs text-[#271F18] mb-2">April 18, 2025</span>
            </div>
          ))}
        </div>
      </div>
      {/* Message Board */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="font-serif text-lg mb-2">Message Board</h2>
        <div className="bg-[#E3E8E3] rounded p-2 mb-2 text-[#271F18]">"hi my name is John Doe"</div>
        <div className="flex justify-between items-center">
          <div className="text-[#271F18]">hi my name is John Doe hi my name is John Doe, hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is John Doe hi my name is</div>
          <span className="text-xs text-[#271F18] ml-4">April 18, 2025</span>
        </div>
      </div>
    </div>
  )
}
