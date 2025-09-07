'use client'
import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const clinicInfo = {
  name: 'Abc-xyz Fertility Center',
  location: 'Los Angeles, CA',
  doctor: {
    name: 'John Doe',
    role: 'MD',
    email: '123@email.com',
    phone: '(123) 456 - 7890',
    desc: 'Your main IVF clinic lead and main contact for medical questions.'
  },
  coordinator: {
    name: 'John Doe',
    role: 'IVF Coordinator',
    email: '123@email.com',
    phone: '(123) 456 - 7890',
    desc: 'Your main IVF coordinator and main contact for scheduling and logistics.'
  }
}

const embryoJourney = {
  timeline: [
    { label: 'Egg Retrieval', date: 'March 5, 2025' },
    { label: 'Fertilization', date: 'March 6, 2025' },
    { label: 'Day 5 Blastocyst', date: 'March 6, 2025' },
    { label: 'PGT Testing', date: 'March 6, 2025' },
  ],
  embryos: [
    { grade: 'AA', id: '#123', status: 'Transferred' },
    { grade: 'AA', id: '#124', status: 'Frozen' },
    { grade: 'AA', id: '#125', status: 'Frozen' },
  ],
}

const surrogateAppointments = [
  { date: 'May 18, 2025', type: 'Ultrasound', doctor: 'Dr. John Doe', medication: 'None', instructions: ['Continue Medications', 'Ultrasound added'], view: true },
  { date: 'May 19, 2025', type: 'Breakdown', doctor: 'Dr. John Doe', medication: 'Acid Strong daily', instructions: ['Continue Medications', 'Headache for 3 days'], view: true },
  { date: 'May 21, 2025', type: 'Ultrasound', doctor: 'Dr. John Doe', medication: 'None', instructions: ['Continue Medications', 'Ultrasound added'], view: true },
]

const medicationTracker = [
  { name: 'XX Acid', dosage: '80mg', frequency: 'Once Daily', start: 'March 7, 2025', notes: 'Continue Medications', view: true },
  { name: 'Vitamin', dosage: '200mg', frequency: 'Twice Daily', start: 'March 7, 2025', notes: 'Continue Medications, Ultrasound added', view: true },
  { name: 'Acid', dosage: '40mg', frequency: 'Once Daily', start: 'March 7, 2025', notes: 'Continue Medications, Ultrasound added', view: true },
]

const doctorsNotes = [
  { date: 'March 18, 2025', doctor: 'Dr. John Doe', note: 'Advice appointment needed for ultrasound needs; medication needs; awaiting test for more', view: true },
  { date: 'March 6, 2025', doctor: 'Dr. John Doe', note: 'Advice appointment needed for ultrasound needs; medication needs; awaiting test for more', view: true },
  { date: 'March 22, 2025', doctor: 'Dr. John Doe', note: 'Advice appointment needed for ultrasound needs; medication needs; awaiting test for more', view: true },
]

export default function IVFClinic() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">IVF Clinic</h1>
      <p className="text-[#271F18] font-serif mb-8">View your IVF clinic team and review updates related to your embryo transfer process</p>
      {/* Clinic Overview 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-6">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none"
          onClick={() => setOpen(open === 'Clinic Overview' ? null : 'Clinic Overview')}
        >
          <span>Clinic Overview</span>
          <span className="text-xs">{clinicInfo.location}</span>
          <span className={`ml-2 transition-transform ${open === 'Clinic Overview' ? 'rotate-90' : ''}`}>▼</span>
        </button>
        {open === 'Clinic Overview' && (
          <div className="px-6 py-4 flex gap-6">
            {/* Doctor */}
            <div className="rounded-xl bg-white p-4 flex gap-4 items-center flex-1">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-serif text-lg">{clinicInfo.doctor.name}</div>
                <div className="text-xs mb-1">{clinicInfo.doctor.role}</div>
                <div className="text-xs mb-1">{clinicInfo.doctor.email}</div>
                <div className="text-xs mb-1">{clinicInfo.doctor.phone}</div>
                <div className="text-xs text-[#271F18]">{clinicInfo.doctor.desc}</div>
              </div>
            </div>
            {/* Coordinator */}
            <div className="rounded-xl bg-white p-4 flex gap-4 items-center flex-1">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-serif text-lg">{clinicInfo.coordinator.name}</div>
                <div className="text-xs mb-1">{clinicInfo.coordinator.role}</div>
                <div className="text-xs mb-1">{clinicInfo.coordinator.email}</div>
                <div className="text-xs mb-1">{clinicInfo.coordinator.phone}</div>
                <div className="text-xs text-[#271F18]">{clinicInfo.coordinator.desc}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Embryo Journey 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === 'Embryo Journey' ? null : 'Embryo Journey')}>
          <span>Embryo Journey</span>
          <span className={`text-xl transition-transform ${open === 'Embryo Journey' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Embryo Journey' && (
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 时间线 */}
            <div>
              <h3 className="font-serif text-base mb-2">Timeline</h3>
              <ul className="mb-2">
                {embryoJourney.timeline.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-white border border-[#D9D9D9] mr-2" />
                    <span>{item.label}</span>
                    <span className="text-xs text-[#271F18] ml-2">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Embryos 表格 */}
            <div>
              <h3 className="font-serif text-base mb-2">Embryos</h3>
              <table className="w-full text-[#271F18] font-serif">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Grade</th>
                    <th>ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {embryoJourney.embryos.map((e, i) => (
                    <tr key={i}>
                      <td className="py-2">{e.grade}</td>
                      <td>{e.id}</td>
                      <td>{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Surrogate Appointments 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === 'Surrogate Appointments' ? null : 'Surrogate Appointments')}>
          <span>Surrogate Appointments</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Appointments' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Appointments' && (
          <div className="px-6 py-4">
            <table className="w-full text-[#271F18] font-serif">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Date</th>
                  <th>Type</th>
                  <th>Doctor</th>
                  <th>Medication</th>
                  <th>Instructions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {surrogateAppointments.map((a, i) => (
                  <tr key={i}>
                    <td className="py-2">{a.date}</td>
                    <td>{a.type}</td>
                    <td>{a.doctor}</td>
                    <td>{a.medication}</td>
                    <td>
                      <ul className="list-disc pl-4 text-sm">
                        {a.instructions.map((ins, idx) => <li key={idx}>{ins}</li>)}
                      </ul>
                    </td>
                    <td><Button className="rounded bg-[#D9D9D9] px-4 py-1 text-[#271F18] text-xs">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Medication Tracker 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === 'Medication Tracker' ? null : 'Medication Tracker')}>
          <span>Medication Tracker</span>
          <span className={`text-xl transition-transform ${open === 'Medication Tracker' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Medication Tracker' && (
          <div className="px-6 py-4">
            <table className="w-full text-[#271F18] font-serif mb-4">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Start Date</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {medicationTracker.map((m, i) => (
                  <tr key={i}>
                    <td className="py-2">{m.name}</td>
                    <td>{m.dosage}</td>
                    <td>{m.frequency}</td>
                    <td>{m.start}</td>
                    <td>{m.notes}</td>
                    <td><Button className="rounded bg-[#D9D9D9] px-4 py-1 text-[#271F18] text-xs">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2">
              <Button className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#D9D9D9]">Add Medication</Button>
              <Button className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#D9D9D9]">Create Reminder</Button>
            </div>
          </div>
        )}
      </div>
      {/* Doctor's Notes 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === "Doctor's Notes" ? null : "Doctor's Notes")}> 
          <span>Doctor's Notes</span>
          <span className={`text-xl transition-transform ${open === "Doctor's Notes" ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === "Doctor's Notes" && (
          <div className="px-6 py-4">
            {doctorsNotes.map((note, i) => (
              <div key={i} className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-serif text-base mb-1">{note.date}</div>
                  <div className="text-sm mb-1">{note.doctor}</div>
                  <div className="text-sm text-[#271F18]">{note.note}</div>
                </div>
                <Button className="rounded bg-[#D9D9D9] px-4 py-1 text-[#271F18] text-xs">View</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
