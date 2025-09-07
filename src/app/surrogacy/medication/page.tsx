"use client";
import React from "react";

export default function SurrogacyMedicationTrackerPage() {
  // 示例数据
  const reminders = [
    {
      name: "Progesterone Injection",
      dosage: "50mg - Once Daily",
    },
    {
      name: "Progesterone Injection",
      dosage: "50mg - Once Daily",
    },
  ];
  const medications = [
    {
      name: "XXX Acid",
      dosage: "50mg",
      frequency: "Once Daily",
      start: "March 7, 2025",
      notes: ["Continue Medications", "abds"],
    },
    {
      name: "Vitamin",
      dosage: "200mg",
      frequency: "Twice Daily",
      start: "March 7, 2025",
      notes: ["Continue Medications", "Continue Medications ab", "Medications abds"],
    },
    {
      name: "Acid",
      dosage: "0.4mg",
      frequency: "Once Daily",
      start: "March 7, 2025",
      notes: ["Continue Medications", "Ultrasound abdoef"],
    },
  ];

  // 简易静态日历
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div
      className="min-h-screen bg-[#FBF0DA40] font-serif text-[#271F18] px-8 py-6 flex flex-col items-center"
      style={{ fontFamily: 'Source Serif 4, serif' }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-1">Medication Tracker</h1>
        <p className="mb-4 text-base">Manage your medications and track your doses.</p>
        <div className="grid grid-cols-2 gap-8 mb-4">
          {/* Daily Reminders */}
          <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg mb-2">Daily Reminders</div>
            {reminders.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs opacity-60">{r.dosage}</div>
                </div>
                <button className="p-2 rounded-full hover:bg-[#e6e6e6]">
                  <svg width="20" height="20" fill="#271F18" className="opacity-40"><path d="M10 2v2a6 6 0 016 6c0 3.31-2.69 6-6 6a6 6 0 01-6-6H2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                </button>
              </div>
            ))}
          </div>
          {/* 日历卡片 */}
          <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg mb-2">October 2025</div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#271F18] opacity-80 mb-1">
              {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array(6).fill(0).map((_, week) => (
                days.slice(week*7, week*7+7).map(day => (
                  <div key={day} className="py-1 rounded hover:bg-[#e6e6e6] cursor-pointer">{day}</div>
                ))
              ))}
            </div>
          </div>
        </div>
        {/* Medications 表格卡片 */}
        <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6">
          <div className="font-semibold text-lg mb-4">Medications</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[#271F18] opacity-80 text-sm">
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Start Date</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {medications.map((item, idx) => (
                  <tr key={idx} className="bg-white rounded-md shadow-sm align-top">
                    <td className="py-2 px-3">{item.name}</td>
                    <td className="py-2 px-3">{item.dosage}</td>
                    <td className="py-2 px-3">{item.frequency}</td>
                    <td className="py-2 px-3">{item.start}</td>
                    <td className="py-2 px-3">
                      <ul className="list-disc pl-4 text-xs">
                        {item.notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2 px-3">
                      <button className="px-4 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="px-5 py-2 bg-[#E6F2ED] text-[#271F18] rounded-full font-medium shadow hover:bg-[#d0e7db] transition text-sm">Add Medication</button>
            <button className="px-5 py-2 bg-[#E6F2ED] text-[#271F18] rounded-full font-medium shadow hover:bg-[#d0e7db] transition text-sm">Custom Reminder</button>
          </div>
        </div>
      </div>
    </div>
  );
}
