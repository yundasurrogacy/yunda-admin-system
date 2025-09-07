import React from 'react'
import { Button } from '@/components/ui/button'

export default function TrustAccount() {
  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">Trust Account</h1>
      <p className="text-[#271F18] font-serif mb-8">View your current account balance and financial transactions related to your trust account</p>
      {/* Account Balance */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif mb-2">Account Balance</h2>
          <div className="text-sm">Updated today</div>
        </div>
        <div className="text-2xl font-serif">$25,000.00</div>
      </div>
      {/* Expense Summary */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex-1">
          <h2 className="text-xl font-serif mb-4">Expense Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2">Service Fee</div>
              <div className="mb-2">Compensation</div>
              <div className="mb-2">Medical Expenses</div>
              <div className="mb-2">Medical Expenses</div>
            </div>
            <div className="text-right">
              <div className="mb-2">$12,500.00</div>
              <div className="mb-2">$12,500.00</div>
              <div className="mb-2">$12,500.00</div>
              <div className="mb-2">$12,500.00</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex-1 relative">
          <Button className="absolute top-6 right-6 rounded bg-[#D9D9D9] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Download</Button>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2">Service Fee</div>
              <div className="mb-2">Compensation</div>
            </div>
            <div className="text-right">
              <div className="mb-2">$12,500.00</div>
              <div className="mb-2">$12,500.00</div>
            </div>
          </div>
        </div>
      </div>
      {/* Transaction History & Note */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex-1 relative mb-6">
          <h2 className="text-xl font-serif mb-4">Transaction History</h2>
          <Button className="absolute top-6 right-6 rounded bg-[#D9D9D9] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Download</Button>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div>Service Fee <span className="text-xs ml-2">March 6, 2025</span></div>
              <div>$12,500.00</div>
            </div>
            <div className="flex justify-between">
              <div>Service Fee <span className="text-xs ml-2">March 6, 2025</span></div>
              <div>$12,500.00</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex-1 mb-6 flex items-center">
          <div>Your trust account uses careful and transparent financial practices</div>
        </div>
      </div>
    </div>
  )
}
