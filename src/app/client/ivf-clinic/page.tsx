'use client'
import React, { useState, Suspense } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// 提取需要使用 useSearchParams 的逻辑到单独的组件
function IVFClinicContent() {

  const router = useRouter();
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const [caseId, setCaseId] = useState<string | null>(null);

  // 只读模式，不需要输入相关状态
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
    function getCookie(name: string) {
      if (typeof document === 'undefined') return undefined;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : undefined;
    }
    const parentId = typeof document !== 'undefined' ? getCookie('userId_client') : null;
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
      .then(res => res.json())
      .then(data => {
        setClinics(data.ivf_clinics || []);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  // 获取各类型数据
  const clinicOverview = clinics.find(c => c.type === 'ClinicOverview')?.data;
  const embryoJourneyData = clinics.find(c => c.type === 'EmbryoJourney')?.data;
  const surrogateAppointmentsData = clinics.find(c => c.type === 'SurrogateAppointments')?.data;
  const medicationTrackerData = clinics.find(c => c.type === 'MedicationTracker')?.data;
  const doctorsNotesData = clinics.find(c => c.type === 'DoctorNotes')?.data;

  // 只读模式，无需编辑、新增、保存等逻辑

  return (
    <div className="p-8 min-h-screen bg-main-bg">
      {/* 返回按钮 */}
      <button
        className="mb-4 px-4 py-2 rounded bg-[#F5F4ED] text-[#271F18] font-medium hover:bg-[#C2A87A] hover:text-white transition-colors cursor-pointer"
        style={{cursor:'pointer'}}
        onClick={() => router.back()}
      >
        {t('common.back') || '返回'}
      </button>
      <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('ivfClinic.title')}</h1>
      <p className="text-sage-800 mb-8 font-medium">{t('ivfClinic.description')}</p>
      {/* Clinic Overview 折叠卡片 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-6">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer"
          style={{cursor:'pointer'}}
          onClick={() => setOpen(open === 'Clinic Overview' ? null : 'Clinic Overview')}
        >
          <span>{t('ivfClinic.clinicOverview')}</span>
          {/* <span className="text-xs">{clinicOverview?.location || ''}</span> */}
          <span className={`ml-2 transition-transform ${open === 'Clinic Overview' ? 'rotate-90' : ''}`}>▼</span>
        </button>
  {open === 'Clinic Overview' && clinicOverview && (
          <div className="px-6 py-4">
            {/* 顶部医院名称和地址，字体统一，简洁分布 */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-[#271F18]">{(clinicOverview.location || '').split(',')[0] || ''}</span>
              <span className="text-lg font-semibold text-[#271F18]">{(clinicOverview.location || '').split(',')[1] || ''}</span>
            </div>
            {/* 医生和协调员卡片，灰色背景，内容严格按设计图，不显示地址 */}
            <div className="flex gap-4">
              {/* Doctor */}
              <div className="flex-1 bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-center">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#D9D9D9] text-[#271F18] text-lg font-medium">{clinicOverview?.doctor?.name?.slice(0,2) || 'JD'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-[#271F18] mb-1">{clinicOverview?.doctor?.name}</div>
                  <div className="text-sm text-sage-600 mb-1">{clinicOverview?.doctor?.role}</div>
                  <div className="text-sm text-sage-800 mb-1">{clinicOverview?.doctor?.email}</div>
                  <div className="text-sm text-sage-800 mb-1">{clinicOverview?.doctor?.phone}</div>
                  <div className="text-sm text-sage-800 leading-relaxed">{clinicOverview?.doctor?.desc}</div>
                </div>
              </div>
              {/* Coordinator */}
              <div className="flex-1 bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-center">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#D9D9D9] text-[#271F18] text-lg font-medium">{clinicOverview?.coordinator?.name?.slice(0,2) || 'JD'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-[#271F18] mb-1">{clinicOverview?.coordinator?.name}</div>
                  <div className="text-sm text-sage-600 mb-1">{clinicOverview?.coordinator?.role}</div>
                  <div className="text-sm text-sage-800 mb-1">{clinicOverview?.coordinator?.email}</div>
                  <div className="text-sm text-sage-800 mb-1">{clinicOverview?.coordinator?.phone}</div>
                  <div className="text-sm text-sage-800 leading-relaxed">{clinicOverview?.coordinator?.desc}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 无数据时仅显示提示 */}
        {open === 'Clinic Overview' && !clinicOverview && (
          <div className="px-6 py-4 text-sage-800 opacity-60">{t('ivfClinic.noClinicOverview')}</div>
        )}
      </div>
      {/* Embryo Journey 折叠卡片 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Embryo Journey' ? null : 'Embryo Journey')}>
          <span>{t('ivfClinic.embryoJourney')}</span>
          <span className={`text-xl transition-transform ${open === 'Embryo Journey' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Embryo Journey' && (
          <div className="px-6 py-4">
            {/* 只读展示 Embryo Journey 数据 */}
            {embryoJourneyData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 左侧时间线展示 */}
                <div className="relative">
                  <h3 className="text-lg font-semibold mb-4 text-sage-800">{t('ivfClinic.timeline')}</h3>
                  <div className="relative pl-8">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-[#C2A87A]"></div>
                    {embryoJourneyData?.timeline?.map((item: any, i: number) => (
                      <div key={i} className="relative mb-6 last:mb-0 flex items-start">
                        <div className="absolute left-0 w-2 h-2 rounded-full bg-white border-2 border-[#C2A87A] mt-2"></div>
                        <div className="ml-6">
                          <div className="text-base font-medium text-sage-800 mb-1">{item.label}</div>
                          <div className="text-sm text-sage-600">{item.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 右侧胚胎表格展示 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-sage-800">{t('ivfClinic.embryos')}</h3>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-sage-800">
                      <thead className="bg-[#F8F9FA] border-b">
                        <tr>
                          <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.grade')}</th>
                          <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.id')}</th>
                          <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {embryoJourneyData?.embryos?.map((e: any, i: number) => (
                          <tr key={i} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-3 px-6 text-base font-medium">{e.grade}</td>
                            <td className="py-3 px-6 text-base font-medium">{e.id}</td>
                            <td className="py-3 px-6 text-base font-medium">{e.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Surrogate Appointments 折叠卡片 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
  <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Appointments' ? null : 'Surrogate Appointments')}>
          <span>{t('ivfClinic.surrogateAppointments')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Appointments' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Appointments' && (
          <div className="px-6 py-4">
            <div className="w-full">
              <div className="grid grid-cols-6 border-b border-[#C2A87A] bg-white">
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.date')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.type')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.doctor')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.medication')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.instructions')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800"></div>
              </div>
              {/* 数据区 */}
              {Array.isArray(surrogateAppointmentsData) && surrogateAppointmentsData.map((a: any, i: number) => (
                <div key={i} className="grid grid-cols-6 border-b border-[#F0E6D6] bg-white">
                  <div className="py-2 px-6 text-center text-sage-800">{a.date}</div>
                  <div className="py-2 px-6 text-center text-sage-800">{a.type}</div>
                  <div className="py-2 px-6 text-center text-sage-800">{a.doctor}</div>
                  <div className="py-2 px-6 text-center text-sage-800">{a.medication}</div>
                  <div className="py-2 px-6 text-center text-sage-800">
                    <ul className="list-disc pl-4 text-sm inline-block text-left">
                      {a.instructions?.map((ins: string, idx: number) => <li key={idx}>{ins}</li>)}
                    </ul>
                  </div>
                  <div className="py-2 px-6 flex items-center justify-center">
                    {/* <Button className="w-full rounded bg-[#D9D9D9] px-0 py-2 text-[#271F18] text-xs cursor-pointer text-center">{t('ivfClinic.view')}</Button> */}
                  </div>
                </div>
              ))}
              {/* 只读模式无输入区 */}
            </div>

          </div>
        )}
      </div>
      {/* Medication Tracker 折叠卡片 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
  <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Medication Tracker' ? null : 'Medication Tracker')}>
          <span>{t('ivfClinic.medicationTracker')}</span>
          <span className={`text-xl transition-transform ${open === 'Medication Tracker' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Medication Tracker' && (
          <div className="px-6 py-4">
            <div className="w-full">
              <div className="grid grid-cols-6 border-b border-[#C2A87A] bg-white">
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.medication')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.dosage')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.frequency')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.startDate')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800">{t('ivfClinic.notes')}</div>
                <div className="py-2 px-6 text-center font-semibold text-base text-sage-800"></div>
              </div>
              {/* 数据区 */}
              {Array.isArray(medicationTrackerData) && medicationTrackerData.map((m: any, i: number) => (
                <div key={i} className="grid grid-cols-6 border-b border-[#F0E6D6] bg-white">
                  <div className="py-2 px-6 text-center text-sage-800">{m.name}</div>
                  <div className="py-2 px-6 text-center text-sage-800">{m.dosage}</div>
                  <div className="py-2 px-6 text-center text-sage-800">{m.frequency}</div>
                  <div className="py-2 px-6 text-center text-sage-800">{m.start}</div>
                  <div className="py-2 px-6 text-center text-sage-800">{m.notes}</div>
                  <div className="py-2 px-6 flex items-center justify-center">
                    {/* <Button className="w-full rounded bg-[#D9D9D9] px-0 py-2 text-[#271F18] text-xs cursor-pointer text-center">{t('ivfClinic.view')}</Button> */}
                  </div>
                </div>
              ))}
              {/* 只读模式无输入区 */}
            </div>

          </div>
        )}
      </div>
      {/* Doctor's Notes 折叠卡片 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
  <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === "Doctor's Notes" ? null : "Doctor's Notes")}> 
          <span>{t('ivfClinic.doctorsNotes')}</span>
          <span className={`text-xl transition-transform ${open === "Doctor's Notes" ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === "Doctor's Notes" && (
          <div className="px-6 py-4">
            {/* Doctor's Notes 严格设计图渲染 */}
            <div className="space-y-4 mb-8">
              {Array.isArray(doctorsNotesData) && doctorsNotesData.map((note: any, i: number) => (
                <div key={i} className="bg-[#F5F4ED] rounded-xl px-6 py-4 flex items-center justify-between font-serif border border-[#E5E1D8]">
                  {/* 左侧 日期+医生 */}
                  <div className="flex flex-col min-w-[160px] mr-6">
                    <span className="text-base font-semibold text-[#271F18] mb-1">{note.date}</span>
                    <span className="text-base font-semibold text-[#271F18]">Dr. {note.doctor}</span>
                  </div>
                  {/* 中间内容 单行省略 */}
                  <div className="flex-1 text-base text-[#271F18] font-serif whitespace-nowrap overflow-hidden text-ellipsis px-2">
                    {note.note}
                  </div>
                  {/* 右侧按钮（暂时注释） */}
                  {/* <Button
                    className="ml-6 bg-[#D9D9D9] hover:bg-[#C2A87A] text-[#271F18] hover:text-white px-6 py-2 text-sm rounded-lg font-serif font-medium transition-colors cursor-pointer"
                    style={{cursor:'pointer', minWidth:'110px'}}
                  >
                    {t('ivfClinic.viewDetails') || 'View Details'}
                  </Button> */}
                </div>
              ))}
            </div>
            
            {/* 只读模式无新增输入区 */}
          </div>
        )}
      </div>
    </div>
  )
}

// 主组件使用 Suspense 包装内部组件
export default function IVFClinic() {
  return (
      <Suspense fallback={<div className="p-8 min-h-screen">Loading...</div>}>
        <IVFClinicContent />
      </Suspense>
  )
}
