"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'next-i18next';


function IVFClinicContent() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);

  // caseId 获取逻辑：优先 URL 参数，否则用 parentId 请求
  useEffect(() => {
    const paramCaseId = searchParams.get('caseId');
    if (paramCaseId) {
      setCaseId(paramCaseId);
      return;
    }
    const parentId = typeof window !== 'undefined' ? localStorage.getItem('parentId') : null;
    if (!parentId) return;
    fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(res => res.json())
      .then(data => {
        const casesRaw = data.cases || data.data || data;
        if (Array.isArray(casesRaw) && casesRaw.length > 0) {
          setCaseId(casesRaw[0].id?.toString() || null);
        }
      });
  }, [searchParams]);

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/ivf-clinic-get?caseId=${caseId}`)
      .then((res) => res.json())
      .then((data) => {
        setClinics(data.ivf_clinics || []);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  // 获取各类型数据
  const clinicOverview = clinics.find((c) => c.type === "ClinicOverview")?.data;
  const embryoJourneyData = clinics.find((c) => c.type === "EmbryoJourney")?.data;
  const surrogateAppointmentsData = clinics.find((c) => c.type === "SurrogateAppointments")?.data;
  const medicationTrackerData = clinics.find((c) => c.type === "MedicationTracker")?.data;
  const doctorsNotesData = clinics.find((c) => c.type === "DoctorNotes")?.data;

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center" style={{ background: '#FBF0DA40' }}>
        <div className="text-[#271F18] font-serif">{t('ivfClinic.loadingText')}</div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('ivfClinic.title')}</h1>
      <p className="text-[#271F18] font-serif mb-8">{t('ivfClinic.pageDescription')}</p>

      {/* Clinic Overview 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-6">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none"
          onClick={() => setOpen(open === 'Clinic Overview' ? null : 'Clinic Overview')}
        >
          <span>{t('ivfClinic.clinicOverview')}</span>
          <span className="text-xs">{clinicOverview?.location || t('ivfClinic.noDataAvailable')}</span>
          <span className={`ml-2 transition-transform ${open === 'Clinic Overview' ? 'rotate-90' : ''}`}>▼</span>
        </button>
        {open === 'Clinic Overview' && clinicOverview && (
          <div className="px-6 py-4">
            <div className="flex gap-6">
              {/* Doctor */}
              <div className="rounded-xl bg-white p-6 flex gap-4 items-start flex-1 shadow-sm">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#E8F4F8] font-serif text-[#271F18] text-sm font-medium">
                    {clinicOverview?.doctor?.name?.slice(0,2) || 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-serif text-lg font-medium text-[#271F18] mb-1">{clinicOverview?.doctor?.name}</div>
                  <div className="text-sm text-[#666] mb-2">{clinicOverview?.doctor?.role}</div>
                  <div className="text-sm text-[#666] mb-1">{clinicOverview?.doctor?.email}</div>
                  <div className="text-sm text-[#666] mb-3">{clinicOverview?.doctor?.phone}</div>
                  <div className="text-sm text-[#271F18] leading-relaxed">{clinicOverview?.doctor?.desc}</div>
                </div>
              </div>
              {/* Coordinator */}
              <div className="rounded-xl bg-white p-6 flex gap-4 items-start flex-1 shadow-sm">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#E8F4F8] font-serif text-[#271F18] text-sm font-medium">
                    {clinicOverview?.coordinator?.name?.slice(0,2) || 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-serif text-lg font-medium text-[#271F18] mb-1">{clinicOverview?.coordinator?.name}</div>
                  <div className="text-sm text-[#666] mb-2">{clinicOverview?.coordinator?.role}</div>
                  <div className="text-sm text-[#666] mb-1">{clinicOverview?.coordinator?.email}</div>
                  <div className="text-sm text-[#666] mb-3">{clinicOverview?.coordinator?.phone}</div>
                  <div className="text-sm text-[#271F18] leading-relaxed">{clinicOverview?.coordinator?.desc}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {open === 'Clinic Overview' && !clinicOverview && (
          <div className="px-6 py-4">
            <div className="text-center text-[#666] font-serif">{t('ivfClinic.noClinicOverview')}</div>
          </div>
        )}
      </div>

      {/* Embryo Journey 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button 
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" 
          onClick={() => setOpen(open === 'Embryo Journey' ? null : 'Embryo Journey')}
        >
          <span>{t('ivfClinic.embryoJourney')}</span>
          <span className={`text-xl transition-transform ${open === 'Embryo Journey' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Embryo Journey' && embryoJourneyData && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 左侧时间线展示 */}
              <div className="relative">
                <h3 className="font-serif text-lg font-bold mb-4 text-[#271F18]">{t('ivfClinic.timeline')}</h3>
                <div className="relative pl-6">
                  {/* 竖线 */}
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-[#C2A87A]"></div>
                  {embryoJourneyData?.timeline?.map((item: any, i: number) => (
                    <div key={i} className="relative mb-6 last:mb-0">
                      {/* 圆点 */}
                      <div className="absolute -left-1 w-2 h-2 rounded-full bg-white border-2 border-[#C2A87A]"></div>
                      <div className="ml-4">
                        <div className="font-serif text-base font-medium text-[#271F18] mb-1">{item.label}</div>
                        <div className="text-sm text-[#C2A87A]">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 右侧胚胎表格展示 */}
              <div>
                <h3 className="font-serif text-lg font-bold mb-4 text-[#271F18]">{t('ivfClinic.embryos')}</h3>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full text-[#271F18] font-serif">
                    <thead className="bg-[#F8F9FA] border-b">
                      <tr>
                        <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.grade')}</th>
                        <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.id')}</th>
                        <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {embryoJourneyData?.embryos?.map((e: any, i: number) => (
                        <tr key={i} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-3 px-4 text-base">{e.grade}</td>
                          <td className="py-3 px-4 text-base">{e.id}</td>
                          <td className="py-3 px-4 text-base">{e.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {open === 'Embryo Journey' && !embryoJourneyData && (
          <div className="px-6 py-4">
            <div className="text-center text-[#666] font-serif">{t('ivfClinic.noEmbryoJourney')}</div>
          </div>
        )}
      </div>

      {/* Surrogate Appointments 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button 
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" 
          onClick={() => setOpen(open === 'Surrogate Appointments' ? null : 'Surrogate Appointments')}
        >
          <span>{t('ivfClinic.surrogateAppointments')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Appointments' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Appointments' && surrogateAppointmentsData && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-[#271F18] font-serif">
                <thead className="bg-[#F8F9FA] border-b">
                  <tr>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.date')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.type')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.doctor')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.medication')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.instructions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(surrogateAppointmentsData) && surrogateAppointmentsData.map((a: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-base">{a.date}</td>
                      <td className="py-3 px-4 text-base">{a.type}</td>
                      <td className="py-3 px-4 text-base">{a.doctor}</td>
                      <td className="py-3 px-4 text-base">{a.medication}</td>
                      <td className="py-3 px-4 text-base">
                        <ul className="list-disc pl-4 text-sm">
                          {a.instructions?.map((ins: string, idx: number) => <li key={idx}>{ins}</li>)}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {open === 'Surrogate Appointments' && !surrogateAppointmentsData && (
          <div className="px-6 py-4">
            <div className="text-center text-[#666] font-serif">{t('ivfClinic.noSurrogateAppointments')}</div>
          </div>
        )}
      </div>

      {/* Medication Tracker 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button 
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" 
          onClick={() => setOpen(open === 'Medication Tracker' ? null : 'Medication Tracker')}
        >
          <span>{t('ivfClinic.medicationTracker')}</span>
          <span className={`text-xl transition-transform ${open === 'Medication Tracker' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Medication Tracker' && medicationTrackerData && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-[#271F18] font-serif">
                <thead className="bg-[#F8F9FA] border-b">
                  <tr>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.medication')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.dosage')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.frequency')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.startDate')}</th>
                    <th className="py-3 px-4 text-left font-bold text-base">{t('ivfClinic.notes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(medicationTrackerData) && medicationTrackerData.map((m: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-4 text-base">{m.name}</td>
                      <td className="py-3 px-4 text-base">{m.dosage}</td>
                      <td className="py-3 px-4 text-base">{m.frequency}</td>
                      <td className="py-3 px-4 text-base">{m.start}</td>
                      <td className="py-3 px-4 text-base">{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {open === 'Medication Tracker' && !medicationTrackerData && (
          <div className="px-6 py-4">
            <div className="text-center text-[#666] font-serif">{t('ivfClinic.noMedicationTracker')}</div>
          </div>
        )}
      </div>

      {/* Doctor's Notes 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button 
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" 
          onClick={() => setOpen(open === "Doctor's Notes" ? null : "Doctor's Notes")}
        > 
          <span>{t('ivfClinic.doctorsNotes')}</span>
          <span className={`text-xl transition-transform ${open === "Doctor's Notes" ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === "Doctor's Notes" && doctorsNotesData && (
          <div className="px-6 py-4">
            <div className="space-y-3">
              {Array.isArray(doctorsNotesData) && doctorsNotesData.map((note: any, i: number) => (
                <div key={i} className="bg-[#F8F9FA] rounded-lg p-4 border border-[#E5E7EB]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="font-serif text-sm font-medium text-[#271F18] block">{note.date}</span>
                        <span className="font-serif text-sm font-medium text-[#271F18] block">Dr. {note.doctor}</span>
                      </div>
                      <p className="text-sm text-[#271F18] leading-relaxed">{note.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {open === "Doctor's Notes" && !doctorsNotesData && (
          <div className="px-6 py-4">
            <div className="text-center text-[#666] font-serif">{t('ivfClinic.noDoctorsNotes')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IVFClinic() {
  const { t } = useTranslation('common');
  return (
    <Suspense fallback={<div className="p-8 min-h-screen flex items-center justify-center" style={{ background: '#FBF0DA40' }}><div className="text-[#271F18] font-serif">{t('ivfClinic.loadingText')}</div></div>}>
      <IVFClinicContent />
    </Suspense>
  );
}
