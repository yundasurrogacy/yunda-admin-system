import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Profile() {
  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">My Account</h1>
      <p className="text-[#271F18] font-serif mb-8">Manage your account details here. Update your personal information, email address, or password to keep your profile up-to-date.</p>
      {/* Basic Information */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col relative">
        <h2 className="text-xl font-serif mb-4">Basic Information</h2>
        <Button className="absolute top-6 right-6 rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Edit</Button>
        <div className="flex gap-6 items-center">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">JD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div><span className="font-medium">Name:</span> John Doe</div>
            <div><span className="font-medium">Date of Birth:</span> March 9, 1980</div>
            <div><span className="font-medium">Phone:</span> (123) 456 - 7890</div>
            <div><span className="font-medium">Email:</span> 12345@gmail.com</div>
            <div><span className="font-medium">Preferred Language:</span> English</div>
          </div>
        </div>
      </Card>
      {/* Address */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 relative">
        <h2 className="text-xl font-serif mb-4">Address</h2>
        <Button className="absolute top-6 right-6 rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Edit</Button>
        <div className="space-y-2 mt-2">
          <div><span className="font-medium">Street:</span> <span className="inline-block w-2/3 h-5 bg-[#E3E8E3] rounded" /></div>
          <div><span className="font-medium">City:</span> <span className="inline-block w-2/3 h-5 bg-[#E3E8E3] rounded" /></div>
          <div><span className="font-medium">State:</span> <span className="inline-block w-2/3 h-5 bg-[#E3E8E3] rounded" /></div>
          <div><span className="font-medium">Country:</span> <span className="inline-block w-2/3 h-5 bg-[#E3E8E3] rounded" /></div>
          <div><span className="font-medium">Zip Code:</span> <span className="inline-block w-2/3 h-5 bg-[#E3E8E3] rounded" /></div>
        </div>
      </Card>
      {/* Login Settings */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Login Settings</h2>
        <div className="flex gap-4">
          <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Change Password</Button>
          <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Manage Devices</Button>
        </div>
      </Card>
    </div>
  )
}
