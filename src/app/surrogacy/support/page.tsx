"use client";
import React from "react";

export default function SurrogacySupportPage() {
  const faqs = [
    "What is the surrogacy process?",
    "How long does the entire process take?",
    "Will I need to travel to the US?",
    "Can I choose my surrogate?",
  ];

  return (
    <div
      className="min-h-screen bg-[#FBF0DA40] font-serif text-[#271F18] px-8 py-6 flex flex-col items-center"
      style={{ fontFamily: 'Source Serif 4, serif' }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-1">Support</h1>
        <p className="mb-4 text-base">Get in touch with your dedicated support team or find helpful resources below</p>
        <div className="grid grid-cols-2 gap-8">
          {/* 联系人卡片 */}
          <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 flex gap-4 items-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <svg width="40" height="40" fill="#271F18" className="opacity-40"><circle cx="20" cy="14" r="9"/><ellipse cx="20" cy="30" rx="14" ry="8"/></svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg mb-1">John Doe</div>
              <div className="text-sm mb-1">Surrogate Coordinator</div>
              <div className="text-sm">(123) 456 - 7890</div>
              <div className="text-sm">123456@gmail.com</div>
            </div>
            <button className="px-4 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-sm font-medium shadow hover:bg-[#d0e7db] transition">Contact</button>
          </div>
          {/* FAQ 卡片 */}
          <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 flex flex-col gap-3">
            <div className="font-semibold text-lg mb-2">FAQ</div>
            {faqs.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">{q}</span>
                <button className="px-4 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition">See Detail</button>
              </div>
            ))}
          </div>
          {/* 联系我们卡片 */}
          <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 flex flex-col gap-3">
            <div className="font-semibold text-lg mb-2">Contact Us</div>
            <div className="flex items-center gap-2 text-sm">
              <svg width="20" height="20" fill="#271F18" className="opacity-40"><rect x="4" y="8" width="12" height="8" rx="2"/><rect x="7" y="4" width="6" height="4" rx="1"/></svg>
              yundainfo
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg width="20" height="20" fill="#271F18" className="opacity-40"><circle cx="10" cy="10" r="8"/><rect x="8" y="6" width="4" height="8" rx="2"/></svg>
              (123) 456 - 7890
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg width="20" height="20" fill="#271F18" className="opacity-40"><rect x="2" y="6" width="16" height="8" rx="2"/><rect x="6" y="10" width="8" height="2" rx="1"/></svg>
              123456@gmail.com
            </div>
            <button className="mt-2 px-4 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition self-start">Emergency Support</button>
          </div>
          {/* 提交请求卡片 */}
          <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 flex flex-col gap-3">
            <div className="font-semibold text-lg mb-2">Submit Request</div>
            <label className="text-sm mb-1">Subject <span className="text-red-500">(Required)</span></label>
            <input className="w-full rounded-md border border-[#E6E6E6] p-2 text-base focus:outline-none focus:ring-2 focus:ring-[#271F18] mb-2" placeholder="Subject" />
            <label className="text-sm mb-1">Description</label>
            <textarea className="w-full h-20 rounded-md border border-[#E6E6E6] p-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#271F18] mb-2" placeholder="Description..." />
            <button className="self-end px-5 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-sm font-medium shadow hover:bg-[#d0e7db] transition">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
