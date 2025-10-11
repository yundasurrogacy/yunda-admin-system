"use client";
import React from "react";

export default function SurrogacyAppointmentsPage() {
  // 示例数据
  const upcoming = [
    {
      date: "May 10, 2025",
      type: "Ultrasound",
      doctor: "Dr. John Doe",
      clinic: "Hope IVF Center",
      time: "9:30 AM",
    },
    {
      date: "May 10, 2025",
      type: "Ultrasound",
      doctor: "Dr. John Doe",
      clinic: "Hope IVF Center",
      time: "9:30 AM",
    },
    {
      date: "May 10, 2025",
      type: "Ultrasound",
      doctor: "Dr. John Doe",
      clinic: "Hope IVF Center",
      time: "9:30 AM",
    },
  ];
  const past = [
    {
      date: "May 10, 2025",
      type: "Ultrasound",
      doctor: "Dr. John Doe",
      medication: "None",
      instructions: ["Continue Medications", "Ultrasound abdoef"],
    },
    {
      date: "May 11, 2025",
      type: "Evaluation",
      doctor: "Dr. John Doe",
      medication: "abed 20mg daily",
      instructions: ["Continue Medications", "Ultrasound abdoef", "Bed rest for 48hrs"],
    },
    {
      date: "May 10, 2025",
      type: "Ultrasound",
      doctor: "Dr. John Doe",
      medication: "None",
      instructions: ["Continue Medications", "Ultrasound abdoef"],
    },
  ];

  return (
    <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-medium text-sage-800">Appointments</h1>
          <button className="px-5 py-2 bg-[#E6F2ED] text-sage-800 rounded-full font-medium shadow hover:bg-[#d0e7db] transition text-sm">Schedule Appointments</button>
        </div>
        {/* Upcoming Appointments */}
        <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 mb-4">
          <div className="text-lg font-semibold text-sage-800 mb-4">Upcoming Appointments</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-sage-800 opacity-80 text-sm">
                  <th>Date</th>
                  <th>Type</th>
                  <th>Doctor</th>
                  <th>Clinic</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((item, idx) => (
                  <tr key={idx} className="bg-white rounded-md shadow-sm text-sage-800">
                    <td className="py-2 px-3">{item.date}</td>
                    <td className="py-2 px-3">{item.type}</td>
                    <td className="py-2 px-3">{item.doctor}</td>
                    <td className="py-2 px-3">{item.clinic}</td>
                    <td className="py-2 px-3">{item.time}</td>
                    <td className="py-2 px-3">
                      <button className="px-4 py-1 bg-[#E6F2ED] text-sage-800 rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Past Appointments */}
        <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6">
          <div className="text-lg font-semibold text-sage-800 mb-4">Past Appointments</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-sage-800 opacity-80 text-sm">
                  <th>Date</th>
                  <th>Type</th>
                  <th>Doctor</th>
                  <th>Medication</th>
                  <th>Instructions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {past.map((item, idx) => (
                  <tr key={idx} className="bg-white rounded-md shadow-sm align-top text-sage-800">
                    <td className="py-2 px-3">{item.date}</td>
                    <td className="py-2 px-3">{item.type}</td>
                    <td className="py-2 px-3">{item.doctor}</td>
                    <td className="py-2 px-3">{item.medication}</td>
                    <td className="py-2 px-3">
                      <ul className="list-disc pl-4 text-xs">
                        {item.instructions.map((ins, i) => (
                          <li key={i}>{ins}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2 px-3">
                      <button className="px-4 py-1 bg-[#E6F2ED] text-sage-800 rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
