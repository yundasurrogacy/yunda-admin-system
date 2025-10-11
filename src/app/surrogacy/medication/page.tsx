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
    <div className="min-h-screen bg-main-bg px-4 lg:px-12 py-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-medium text-sage-800 mb-1">Medication Tracker</h1>
        <p className="mb-4 text-base text-sage-800">Manage your medications and track your doses.</p>
        <div className="grid grid-cols-2 gap-8 mb-4">
          {/* Daily Reminders */}
          <div className="bg-main-bg rounded-xl shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg text-sage-800 mb-2">Daily Reminders</div>
            {reminders.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-sage-800">{r.name}</div>
                  <div className="text-xs text-sage-600">{r.dosage}</div>
                </div>
                <button className="p-2 rounded-full hover:bg-sage-100">
                  <svg width="20" height="20" fill="currentColor" className="text-sage-800 opacity-40"><path d="M10 2v2a6 6 0 016 6c0 3.31-2.69 6-6 6a6 6 0 01-6-6H2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                </button>
              </div>
            ))}
          </div>
          {/* 日历卡片 */}
          <div className="bg-main-bg rounded-xl shadow-md p-6 flex flex-col gap-2">
            <div className="font-semibold text-lg text-sage-800 mb-2">October 2025</div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-sage-800 opacity-80 mb-1">
              {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array(6).fill(0).map((_, week) => (
                days.slice(week*7, week*7+7).map(day => (
                  <div key={day} className="py-1 rounded hover:bg-sage-100 cursor-pointer">{day}</div>
                ))
              ))}
            </div>
          </div>
        </div>
        {/* Medications 表格卡片 */}
        <div className="bg-main-bg rounded-xl shadow-md p-6">
          <div className="font-semibold text-lg text-sage-800 mb-4">Medications</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-sage-800 opacity-80 text-sm">
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
                    <td className="py-2 px-3 text-sage-800 font-medium">{item.name}</td>
                    <td className="py-2 px-3 text-sage-800">{item.dosage}</td>
                    <td className="py-2 px-3 text-sage-800">{item.frequency}</td>
                    <td className="py-2 px-3 text-sage-800">{item.start}</td>
                    <td className="py-2 px-3">
                      <ul className="list-disc pl-4 text-xs text-sage-800">
                        {item.notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2 px-3">
                      <button className="px-4 py-1 bg-sage-100 text-sage-800 rounded-full text-xs font-medium shadow hover:bg-sage-200 transition">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="px-5 py-2 bg-sage-100 text-sage-800 rounded-full font-medium shadow hover:bg-sage-200 transition text-sm">Add Medication</button>
            <button className="px-5 py-2 bg-sage-100 text-sage-800 rounded-full font-medium shadow hover:bg-sage-200 transition text-sm">Custom Reminder</button>
          </div>
        </div>
      </div>
    </div>
  );
}
