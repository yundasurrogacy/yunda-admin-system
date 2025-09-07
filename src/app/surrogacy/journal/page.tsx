"use client";
import React, { useState } from "react";

export default function SurrogacyJournalPage() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);

  // 示例日志数据
  const journalEntries = [
    {
      date: "April 15, 2025",
      text:
        "This week I've been feeling good. I can feel the baby kicking a lot now, which is always an exciting feeling.",
      img: null,
    },
    {
      date: "April 15, 2025",
      text:
        "This week I've been feeling good. I can feel the baby kicking a lot now, which is always an exciting feeling.",
      img: null,
    },
    {
      date: "April 15, 2025",
      text:
        "This week I've been feeling good. I can feel the baby kicking a lot now, which is always an exciting feeling.",
      img: null,
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#FBF0DA40] font-serif text-[#271F18] px-8 py-6 flex flex-col items-center"
      style={{ fontFamily: 'Source Serif 4, serif' }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-1">My Journal</h1>
        <p className="mb-6 text-base">Record your experiences and feelings through your journey as a surrogate</p>
        <div className="flex gap-8">
          {/* 左侧日志卡片区 */}
          <div className="flex-1 flex flex-col gap-6">
            {journalEntries.map((entry, idx) => (
              <div
                key={idx}
                className="bg-[#FBF0DA] rounded-xl shadow-md p-4 flex gap-4 items-center"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-md" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="text-lg font-semibold">This week I felt...</div>
                  <div className="text-sm text-[#271F18] opacity-80">{entry.text}</div>
                  <button
                    className="mt-2 px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition"
                  >
                    Share with intended parents
                  </button>
                </div>
                <div className="text-xs text-[#271F18] opacity-60 self-start">{entry.date}</div>
              </div>
            ))}
          </div>
          {/* 右侧填写区 */}
          <div className="w-[420px] flex flex-col gap-4">
            <div className="bg-[#FBF0DA] rounded-xl shadow-md p-4 mb-2">
              <div className="text-lg font-semibold mb-2">This week, I'm feeling...</div>
              <textarea
                className="w-full h-24 rounded-md border border-[#E6E6E6] p-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#271F18]"
                placeholder="Write a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <div className="bg-[#FBF0DA] rounded-xl shadow-md p-4 flex flex-col items-center justify-center h-32">
              <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                <svg width="32" height="32" fill="#271F18" className="mb-2 opacity-40"><path d="M16 4a12 12 0 100 24 12 12 0 000-24zm0 22a10 10 0 110-20 10 10 0 010 20zm-4-8l2.5 3 3.5-4.5 4.5 6H8l4-4.5z"/></svg>
                <span className="text-sm text-[#271F18] opacity-60">Upload a photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
              {photo && (
                <div className="mt-2 text-xs text-[#271F18]">{photo.name}</div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <span>Visible</span>
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={e => setVisible(e.target.checked)}
                  className="accent-[#271F18] w-4 h-4 rounded"
                />
              </label>
              <button
                className="ml-auto px-6 py-2 bg-[#271F18] text-white rounded-full font-semibold shadow hover:bg-[#3a2c1e] transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
