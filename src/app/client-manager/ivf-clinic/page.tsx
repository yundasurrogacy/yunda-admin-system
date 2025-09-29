'use client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import ManagerLayout from '@/components/manager-layout';

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
  // 新增行状态（美化输入）
  const [newEmbryo, setNewEmbryo] = useState({ grade: '', id: '', status: '' });
  const [newAppointment, setNewAppointment] = useState({ date: '', type: '', doctor: '', medication: '', instructions: '' });
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', start: '', notes: '' });
  const [newNote, setNewNote] = useState({ date: '', doctor: '', note: '' });
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    doctor: { name: '', role: '', email: '', phone: '', desc: '' },
    coordinator: { name: '', role: '', email: '', phone: '', desc: '' },
    timeline: [{ label: '', date: '' }],
    embryos: [{ grade: '', id: '', status: '' }],
  surrogateAppointments: [{ date: '', type: '', doctor: '', medication: '', instructions: [''] }],
    medicationTracker: [{ name: '', dosage: '', frequency: '', start: '', notes: '' }],
    doctorsNotes: [{ date: '', doctor: '', note: '' }],
  });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ivf-clinic-get?caseId=1`)
      .then(res => res.json())
      .then(data => {
        setClinics(data.ivf_clinics || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // 获取各类型数据
  const clinicOverview = clinics.find(c => c.type === 'ClinicOverview')?.data;
  const embryoJourneyData = clinics.find(c => c.type === 'EmbryoJourney')?.data;
  const surrogateAppointmentsData = clinics.find(c => c.type === 'SurrogateAppointments')?.data;
  const medicationTrackerData = clinics.find(c => c.type === 'MedicationTracker')?.data;
  const doctorsNotesData = clinics.find(c => c.type === 'DoctorNotes')?.data;

  // 新增功能
  const caseId = 1;
  // EmbryoJourney合并数据后再提交
  const handleAdd = async (type: string, data: any) => {
    setLoading(true);
    let mergedData = data;
    if (type === 'EmbryoJourney') {
      // 获取当前数据
      const current = clinics.find(c => c.type === 'EmbryoJourney')?.data || { timeline: [], embryos: [] };
      // 合并 timeline
      if (data.timeline && Array.isArray(data.timeline)) {
  mergedData.timeline = [...(current.timeline || []), ...data.timeline.filter((e: { label?: string; date?: string }) => e.label || e.date)];
      } else {
        mergedData.timeline = current.timeline || [];
      }
      // 合并 embryos
      if (data.embryos && Array.isArray(data.embryos)) {
  mergedData.embryos = [...(current.embryos || []), ...data.embryos.filter((e: { grade?: string; id?: string; status?: string }) => e.grade || e.id || e.status)];
      } else {
        mergedData.embryos = current.embryos || [];
      }
    }
    const res = await fetch('/api/ivf-clinic-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ivf_clinic: { type, data: mergedData, case_cases: caseId } }),
    });
    const result = await res.json();
    if (result.ivf_clinic) {
      // 新增成功后重新拉取接口数据，保证 clinics 最新
      const fetchRes = await fetch(`/api/ivf-clinic-get?caseId=${caseId}`);
      const fetchData = await fetchRes.json();
      setClinics(fetchData.ivf_clinics || []);
      setFormData({
        location: '',
        doctor: { name: '', role: '', email: '', phone: '', desc: '' },
        coordinator: { name: '', role: '', email: '', phone: '', desc: '' },
        timeline: [{ label: '', date: '' }],
        embryos: [{ grade: '', id: '', status: '' }],
        surrogateAppointments: [{ date: '', type: '', doctor: '', medication: '', instructions: [''] }],
        medicationTracker: [{ name: '', dosage: '', frequency: '', start: '', notes: '' }],
        doctorsNotes: [{ date: '', doctor: '', note: '' }],
      });
    }
    setLoading(false);
  };

  return (
    <ManagerLayout>
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
          <span className="text-xs">{clinicOverview?.location || ''}</span>
          <span className={`ml-2 transition-transform ${open === 'Clinic Overview' ? 'rotate-90' : ''}`}>▼</span>
        </button>
        {open === 'Clinic Overview' && clinicOverview && (
          <div className="px-6 py-4 flex gap-6">
            {/* Doctor */}
            <div className="rounded-xl bg-white p-4 flex gap-4 items-center flex-1">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">{clinicOverview?.doctor?.name?.slice(0,2) || 'JD'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-serif text-lg">{clinicOverview?.doctor?.name}</div>
                <div className="text-xs mb-1">{clinicOverview?.doctor?.role}</div>
                <div className="text-xs mb-1">{clinicOverview?.doctor?.email}</div>
                <div className="text-xs mb-1">{clinicOverview?.doctor?.phone}</div>
                <div className="text-xs text-[#271F18]">{clinicOverview?.doctor?.desc}</div>
              </div>
            </div>
            {/* Coordinator */}
            <div className="rounded-xl bg-white p-4 flex gap-4 items-center flex-1">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">{clinicOverview?.coordinator?.name?.slice(0,2) || 'JD'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-serif text-lg">{clinicOverview?.coordinator?.name}</div>
                <div className="text-xs mb-1">{clinicOverview?.coordinator?.role}</div>
                <div className="text-xs mb-1">{clinicOverview?.coordinator?.email}</div>
                <div className="text-xs mb-1">{clinicOverview?.coordinator?.phone}</div>
                <div className="text-xs text-[#271F18]">{clinicOverview?.coordinator?.desc}</div>
              </div>
            </div>
          </div>
        )}
        {/* 新增 ClinicOverview */}
        {open === 'Clinic Overview' && (
          <div className="px-6 py-4">
            <h4 className="font-serif mb-2">新增 Clinic Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border p-1 mb-2 w-full" placeholder="诊所地址" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              <input className="border p-1 mb-2 w-full" placeholder="医生姓名" value={formData.doctor.name} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, name: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="医生角色" value={formData.doctor.role} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, role: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="医生邮箱" value={formData.doctor.email} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, email: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="医生电话" value={formData.doctor.phone} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, phone: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="医生描述" value={formData.doctor.desc} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, desc: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="协调员姓名" value={formData.coordinator.name} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, name: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="协调员角色" value={formData.coordinator.role} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, role: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="协调员邮箱" value={formData.coordinator.email} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, email: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="协调员电话" value={formData.coordinator.phone} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, phone: e.target.value } })} />
              <input className="border p-1 mb-2 w-full" placeholder="协调员描述" value={formData.coordinator.desc} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, desc: e.target.value } })} />
            </div>
            <Button className="mt-2" onClick={() => handleAdd('ClinicOverview', formData)}>新增</Button>
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
            {/* 左侧时间线美化+新增事件输入 */}
            <div className="relative flex flex-col items-start">
              <h3 className="font-serif text-lg font-bold mb-4">Timeline</h3>
              <div className="relative pl-8 w-full">
                {/* 竖线 */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#C2A87A]" style={{ minHeight: 40, zIndex: 0 }}></div>
                {embryoJourneyData?.timeline?.map((item: any, i: number) => (
                  <div key={i} className="relative flex items-center mb-6" style={{ zIndex: 1 }}>
                    <span className="absolute left-4 w-4 h-4 rounded-full bg-white border-2 border-[#C2A87A] flex items-center justify-center" style={{ top: 0 }}></span>
                    <div className="ml-8">
                      <div className="font-serif text-base font-semibold text-[#271F18]">{item.label}</div>
                      <div className="text-xs text-[#C2A87A] mt-1">{item.date}</div>
                    </div>
                  </div>
                ))}
                {/* 新增事件输入行 */}
                <div className="flex gap-2 ml-8 mt-2">
                  <input className="border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="事件名称" value={formData.timeline[0]?.label || ''} onChange={e => setFormData({ ...formData, timeline: [{ ...formData.timeline[0], label: e.target.value, date: formData.timeline[0]?.date || '' }] })} />
                  <input className="border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="事件日期" value={formData.timeline[0]?.date || ''} onChange={e => setFormData({ ...formData, timeline: [{ ...formData.timeline[0], date: e.target.value, label: formData.timeline[0]?.label || '' }] })} />
                  <Button className="px-4 py-1 rounded bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition" style={{ minWidth: 80 }} onClick={() => { handleAdd('EmbryoJourney', { timeline: [...(embryoJourneyData?.timeline || []), { label: formData.timeline[0]?.label, date: formData.timeline[0]?.date }], embryos: embryoJourneyData?.embryos || [] }); setFormData(f => ({ ...f, timeline: [{ label: '', date: '' }] })); }}>新增</Button>
                </div>
              </div>
            </div>
            {/* 右侧胚胎表格美化+新增胚胎输入行 */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-serif text-lg font-bold mb-4">Embryos</h3>
              <table className="w-full text-[#271F18] font-serif">
                <thead>
                  <tr className="border-b bg-[#FBF0DA]">
                    <th className="py-2 font-bold">Grade</th>
                    <th className="font-bold">ID</th>
                    <th className="font-bold">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {embryoJourneyData?.embryos?.map((e: any, i: number) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-2">{e.grade}</td>
                      <td>{e.id}</td>
                      <td>{e.status}</td>
                      <td></td>
                    </tr>
                  ))}
                  <tr className="bg-[#F7F3ED]">
                    <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Grade" value={newEmbryo.grade} onChange={e => setNewEmbryo({ ...newEmbryo, grade: e.target.value })} /></td>
                    <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="ID" value={newEmbryo.id} onChange={e => setNewEmbryo({ ...newEmbryo, id: e.target.value })} /></td>
                    <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Status" value={newEmbryo.status} onChange={e => setNewEmbryo({ ...newEmbryo, status: e.target.value })} /></td>
                    <td className="text-right"><Button className="px-4 py-1 rounded bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition" onClick={() => { handleAdd('EmbryoJourney', { timeline: embryoJourneyData?.timeline || [], embryos: [...(embryoJourneyData?.embryos || []), newEmbryo] }); setNewEmbryo({ grade: '', id: '', status: '' }); }}>新增</Button></td>
                  </tr>
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
                {Array.isArray(surrogateAppointmentsData) && surrogateAppointmentsData.map((a: any, i: number) => (
                  <tr key={i}>
                    <td className="py-2">{a.date}</td>
                    <td>{a.type}</td>
                    <td>{a.doctor}</td>
                    <td>{a.medication}</td>
                    <td>
                      <ul className="list-disc pl-4 text-sm">
                        {a.instructions?.map((ins: string, idx: number) => <li key={idx}>{ins}</li>)}
                      </ul>
                    </td>
                    <td><Button className="rounded bg-[#D9D9D9] px-4 py-1 text-[#271F18] text-xs">View</Button></td>
                  </tr>
                ))}
                <tr className="bg-[#F7F3ED]">
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Date" value={newAppointment.date} onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Type" value={newAppointment.type} onChange={e => setNewAppointment({ ...newAppointment, type: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Doctor" value={newAppointment.doctor} onChange={e => setNewAppointment({ ...newAppointment, doctor: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Medication" value={newAppointment.medication} onChange={e => setNewAppointment({ ...newAppointment, medication: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Instructions(逗号分隔)" value={newAppointment.instructions} onChange={e => setNewAppointment({ ...newAppointment, instructions: e.target.value })} /></td>
                  <td><Button className="px-4 py-1 rounded bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition" onClick={() => { handleAdd('SurrogateAppointments', [...(surrogateAppointmentsData || []), { ...newAppointment, instructions: newAppointment.instructions.split(',') }]); setNewAppointment({ date: '', type: '', doctor: '', medication: '', instructions: '' }); }}>新增</Button></td>
                </tr>
              </tbody>
            </table>
            {/* 新增 SurrogateAppointments */}
            <h4 className="font-serif mb-2 mt-4">新增 Surrogate Appointment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border p-1 mb-2 w-full" placeholder="日期" value={formData.surrogateAppointments[0]?.date || ''} onChange={e => setFormData({ ...formData, surrogateAppointments: [{ ...formData.surrogateAppointments[0], date: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="类型" value={formData.surrogateAppointments[0]?.type || ''} onChange={e => setFormData({ ...formData, surrogateAppointments: [{ ...formData.surrogateAppointments[0], type: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="医生" value={formData.surrogateAppointments[0]?.doctor || ''} onChange={e => setFormData({ ...formData, surrogateAppointments: [{ ...formData.surrogateAppointments[0], doctor: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="用药" value={formData.surrogateAppointments[0]?.medication || ''} onChange={e => setFormData({ ...formData, surrogateAppointments: [{ ...formData.surrogateAppointments[0], medication: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="备注（逗号分隔）" value={formData.surrogateAppointments[0]?.instructions?.join(',') || ''} onChange={e => setFormData({ ...formData, surrogateAppointments: [{ ...formData.surrogateAppointments[0], instructions: e.target.value.split(',') }] })} />
            </div>
            <Button className="mt-2" onClick={() => handleAdd('SurrogateAppointments', formData.surrogateAppointments)}>新增</Button>
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
                {Array.isArray(medicationTrackerData) && medicationTrackerData.map((m: any, i: number) => (
                  <tr key={i}>
                    <td className="py-2">{m.name}</td>
                    <td>{m.dosage}</td>
                    <td>{m.frequency}</td>
                    <td>{m.start}</td>
                    <td>{m.notes}</td>
                    <td><Button className="rounded bg-[#D9D9D9] px-4 py-1 text-[#271F18] text-xs">View</Button></td>
                  </tr>
                ))}
                <tr className="bg-[#F7F3ED]">
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Medication" value={newMedication.name} onChange={e => setNewMedication({ ...newMedication, name: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Dosage" value={newMedication.dosage} onChange={e => setNewMedication({ ...newMedication, dosage: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Frequency" value={newMedication.frequency} onChange={e => setNewMedication({ ...newMedication, frequency: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Start Date" value={newMedication.start} onChange={e => setNewMedication({ ...newMedication, start: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="Notes" value={newMedication.notes} onChange={e => setNewMedication({ ...newMedication, notes: e.target.value })} /></td>
                  <td><Button className="px-4 py-1 rounded bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition" onClick={() => { handleAdd('MedicationTracker', [...(medicationTrackerData || []), newMedication]); setNewMedication({ name: '', dosage: '', frequency: '', start: '', notes: '' }); }}>新增</Button></td>
                </tr>
              </tbody>
            </table>
            {/* 新增 MedicationTracker */}
            <h4 className="font-serif mb-2 mt-4">新增 Medication</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border p-1 mb-2 w-full" placeholder="药品名称" value={formData.medicationTracker[0]?.name || ''} onChange={e => setFormData({ ...formData, medicationTracker: [{ ...formData.medicationTracker[0], name: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="剂量" value={formData.medicationTracker[0]?.dosage || ''} onChange={e => setFormData({ ...formData, medicationTracker: [{ ...formData.medicationTracker[0], dosage: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="频率" value={formData.medicationTracker[0]?.frequency || ''} onChange={e => setFormData({ ...formData, medicationTracker: [{ ...formData.medicationTracker[0], frequency: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="开始日期" value={formData.medicationTracker[0]?.start || ''} onChange={e => setFormData({ ...formData, medicationTracker: [{ ...formData.medicationTracker[0], start: e.target.value }] })} />
              <input className="border p-1 mb-2 w-full" placeholder="备注" value={formData.medicationTracker[0]?.notes || ''} onChange={e => setFormData({ ...formData, medicationTracker: [{ ...formData.medicationTracker[0], notes: e.target.value }] })} />
            </div>
            <Button className="mt-2" onClick={() => handleAdd('MedicationTracker', formData.medicationTracker)}>新增</Button>
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
            {/* Doctor's Notes 卡片式一行展示 */}
            <div className="flex flex-col gap-3 mb-4">
              {Array.isArray(doctorsNotesData) && doctorsNotesData.map((note: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-[#E9EDE3] rounded px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-6 w-full">
                    <span className="font-serif text-base min-w-[120px]">{note.date}</span>
                    <span className="font-serif text-base min-w-[120px]">Dr. {note.doctor}:</span>
                    <span className="text-sm text-[#271F18]">{note.note}</span>
                  </div>
                  <Button className="rounded bg-[#A3B2A4] px-4 py-1 text-white text-xs hover:bg-[#7c8c7d] transition">View Details</Button>
                </div>
              ))}
            </div>
            {/* 新增 DoctorNotes 横排一行输入，放最下方 */}
            <div className="flex items-center gap-4 bg-[#F7F3ED] p-2 rounded mt-2">
              <input className="border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="日期" value={newNote.date} onChange={e => setNewNote({ ...newNote, date: e.target.value })} />
              <input className="border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="医生" value={newNote.doctor} onChange={e => setNewNote({ ...newNote, doctor: e.target.value })} />
              <input className="border rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder="备注" value={newNote.note} onChange={e => setNewNote({ ...newNote, note: e.target.value })} />
              <Button className="px-4 py-1 rounded bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition" onClick={() => { handleAdd('DoctorNotes', [...(doctorsNotesData || []), newNote]); setNewNote({ date: '', doctor: '', note: '' }); }}>新增</Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ManagerLayout>
  )
}
