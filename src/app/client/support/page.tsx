import React from 'react'
import { Button } from '@/components/ui/button'

const faqs = [
  'What is the surrogacy process?',
  'How long does the entire process take?',
  'Will I need to travel to the US?',
  'Can I choose my surrogate?',
]

export default function Support() {
  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">Support</h1>
      <p className="text-[#271F18] font-serif mb-8">How can we assist you? Search our help articles, contact us for support, or submit a request!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* FAQ 区块 */}
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex flex-col gap-2">
          <h2 className="font-serif text-lg mb-2">FAQ</h2>
          <div className="grid grid-cols-2 gap-4">
            {[0,1].map(col => (
              <div key={col} className="flex flex-col gap-2">
                {faqs.map((q, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{q}</span>
                    <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">See Detail</Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* 联系与提交区块 */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-2 flex flex-col gap-2">
            <h2 className="font-serif text-lg mb-2">Contact Us</h2>
            <div className="flex items-center gap-2"><span>📧</span> yundainfo</div>
            <div className="flex items-center gap-2"><span>📞</span> (123) 456 - 7890</div>
            <div className="flex items-center gap-2"><span>✉️</span> 123456@gmail.com</div>
          </div>
          <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] flex flex-col gap-2">
            <h2 className="font-serif text-lg mb-2">Submit Request</h2>
            <label className="text-sm mb-1">Subject <span className="text-xs text-[#271F18]">(Required)</span></label>
            <input className="rounded bg-[#E3E8E3] px-3 py-2 mb-2 font-serif text-[#271F18]" placeholder="Subject" />
            <label className="text-sm mb-1">Description</label>
            <textarea className="rounded bg-[#E3E8E3] px-3 py-2 h-20 font-serif text-[#271F18] mb-2" placeholder="Description" />
            <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3] self-end">Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
