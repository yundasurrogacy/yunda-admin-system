"use client"
import React, { useState, Suspense, useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CustomButton } from '../../../components/ui/CustomButton'
// import ManagerLayout from '@/components/manager-layout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// 提取需要使用 useSearchParams 的逻辑到单独的组件
function IVFClinicContent() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');

  // 新增行状态（美化输入）
  const [newEmbryo, setNewEmbryo] = useState({ grade: '', id: '', status: '' });
  const [newAppointment, setNewAppointment] = useState({ date: '', type: '', doctor: '', medication: '', instructions: '' });
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', start: '', notes: '' });
  const [newNote, setNewNote] = useState({ date: '', doctor: '', note: '' });
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [editingClinic, setEditingClinic] = useState(false);
  const [editData, setEditData] = useState({
    location: '',
    doctor: { name: '', role: '', email: '', phone: '', desc: '' },
    coordinator: { name: '', role: '', email: '', phone: '', desc: '' }
  });
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

  // 新增：用于控制每条 timeline 下方是否显示输入区域
  const [timelineAddIndex, setTimelineAddIndex] = useState<number | null>(null);
  const [timelineAddValue, setTimelineAddValue] = useState({ label: '', date: '' });
  // 新增：右侧胚胎表格下方加号与输入区
  const [embryoAddActive, setEmbryoAddActive] = useState(false);
  const [embryoAddValue, setEmbryoAddValue] = useState({ grade: '', id: '', status: '' });

  // GC sections state
  const [newSurrogateMedicalRecord, setNewSurrogateMedicalRecord] = useState({ date: '', category: '', summary: '', fileUrl: '' });
  const [newSurrogateScreening, setNewSurrogateScreening] = useState({ date: '', category: '', name: '', result: '', fileUrl: '' });
  const [newSurrogateEarlyUS, setNewSurrogateEarlyUS] = useState({ date: '', category: '', name: '', result: '', fileUrl: '' });
  const [deliveryBoard, setDeliveryBoard] = useState({ obHospital: '', obDoctor: '', pboStatus: '', pboFileUrl: '', pboRemark: '' });
  const [newPrenatalRecord, setNewPrenatalRecord] = useState({ status: '', date: '', name: '', remark: '', fileUrl: '' });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`)
      .then(res => res.json())
      .then(data => {
        setClinics(data.ivf_clinics || []);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  // 获取各类型数据（memoized）
  const clinicOverview = useMemo(() => clinics.find(c => c.type === 'ClinicOverview')?.data, [clinics]);
  const embryoJourneyData = useMemo(() => clinics.find(c => c.type === 'EmbryoJourney')?.data, [clinics]);
  const surrogateMedicalRecordsData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalRecords')?.data, [clinics]);
  const surrogateScreeningData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalScreening')?.data, [clinics]);
  const surrogateEarlyUSData = useMemo(() => clinics.find(c => c.type === 'SurrogatePregnancyConfirmation')?.data, [clinics]);
  const prenatalDeliveryData = useMemo(() => clinics.find(c => c.type === 'SurrogatePrenatalDelivery')?.data, [clinics]);

  // 初始化编辑数据
  const initEditData = () => {
    if (clinicOverview) {
      setEditData({
        location: clinicOverview.location || '',
        doctor: {
          name: clinicOverview.doctor?.name || '',
          role: clinicOverview.doctor?.role || '',
          email: clinicOverview.doctor?.email || '',
          phone: clinicOverview.doctor?.phone || '',
          desc: clinicOverview.doctor?.desc || ''
        },
        coordinator: {
          name: clinicOverview.coordinator?.name || '',
          role: clinicOverview.coordinator?.role || '',
          email: clinicOverview.coordinator?.email || '',
          phone: clinicOverview.coordinator?.phone || '',
          desc: clinicOverview.coordinator?.desc || ''
        }
      });
    }
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ivf-clinic-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: caseId,
          type: 'ClinicOverview',
          data: editData,
          aboutRole: 'surrogate_mother'
        })
      });
      if (response.ok) {
        // 重新获取数据
        const updatedResponse = await fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`);
        const updatedData = await updatedResponse.json();
        setClinics(updatedData.ivf_clinics || []);
        setEditingClinic(false);
      }
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingClinic(false);
    initEditData(); // 重置数据
  };

  // 新增功能（memoized）
  const handleAdd = useCallback(async (type: string, data: any) => {
    setLoading(true);
    let mergedData = data;
    let apiEndpoint = '/api/ivf-clinic-create';
    let apiMethod = 'POST';
    
    const existingRecord = clinics.find(c => c.type === type);
    
    if (existingRecord) {
      apiEndpoint = '/api/ivf-clinic-update';
      if (type === 'EmbryoJourney') {
        const current = existingRecord.data || { timeline: [], embryos: [] };
        if (data.timeline && Array.isArray(data.timeline)) {
          mergedData.timeline = [...(current.timeline || []), ...data.timeline.filter((e: { label?: string; date?: string }) => e.label || e.date)];
        } else {
          mergedData.timeline = current.timeline || [];
        }
        if (data.embryos && Array.isArray(data.embryos)) {
          mergedData.embryos = [...(current.embryos || []), ...data.embryos.filter((e: { grade?: string; id?: string; status?: string }) => e.grade || e.id || e.status)];
        } else {
          mergedData.embryos = current.embryos || [];
        }
      } else {
        mergedData = data;
      }
    }
    
    const requestBody = apiEndpoint === '/api/ivf-clinic-update' 
      ? { caseId: caseId, type, data: mergedData, aboutRole: 'surrogate_mother' }
      : { ivf_clinic: { type, data: mergedData, case_cases: caseId }, aboutRole: 'surrogate_mother' };
    
    const res = await fetch(apiEndpoint, {
      method: apiMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const result = await res.json();
    if (result.ivf_clinic || res.ok) {
      // 成功后重新拉取接口数据，保证 clinics 最新
      const fetchRes = await fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`);
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
  }, [clinics, caseId]);

  // 文件上传（单文件） memoized
  const uploadSingleFile = useCallback(async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload/form', { method: 'POST', body: form });
    const data = await res.json();
    if (res.ok && data?.data) {
      const url = Array.isArray(data.data) ? data.data[0]?.url : data.data?.url;
      return url || '';
    }
    return '';
  }, []);

  return (
    <div className="p-8 min-h-screen bg-main-bg">
        {/* 返回按钮 */}
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer"
          onClick={() => router.back()}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton>
      <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('ivfClinic.title')}</h1>
      <p className="text-sage-800 mb-8 font-medium">{t('ivfClinic.description')}</p>
      {/* Clinic Overview 已移除 */}
      {/* Embryo Journey 已移除 */}
      {/* 代母医疗记录与心理评估 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Medical Records' ? null : 'Surrogate Medical Records')}>
          <span>{t('ivfClinic.surrogateMedicalRecords','代母医疗记录与心理评估')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Medical Records' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Medical Records' && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sage-800">
                <thead className="bg-[#F8F9FA] border-b">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.category','类别')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.summary','简述')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(surrogateMedicalRecordsData) && surrogateMedicalRecordsData.map((r:any, i:number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-6">{r.date}</td>
                      <td className="py-3 px-6">{r.category}</td>
                      <td className="py-3 px-6">{r.summary}</td>
                      <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateMedicalRecord.date} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateMedicalRecord.category} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.summary','简述')} value={newSurrogateMedicalRecord.summary} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, summary: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e)=>{ const f=e.target.files?.[0]; if(f){ const url=await uploadSingleFile(f); setNewSurrogateMedicalRecord(prev=>({ ...prev, fileUrl: url })); } }} />
                      <div className="mt-2">
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const list = Array.isArray(surrogateMedicalRecordsData) ? surrogateMedicalRecordsData : [];
                          if (newSurrogateMedicalRecord.date || newSurrogateMedicalRecord.category || newSurrogateMedicalRecord.fileUrl) {
                            handleAdd('SurrogateMedicalRecords', [...list, newSurrogateMedicalRecord]);
                            setNewSurrogateMedicalRecord({ date: '', category: '', summary: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
          </div>
        )}
      </div>

      {/* 代母医学筛查 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Screening' ? null : 'Surrogate Screening')}>
          <span>{t('ivfClinic.surrogateScreening','代母医学筛查')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Screening' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Screening' && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sage-800">
                <thead className="bg-[#F8F9FA] border-b">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.category','类别')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.name','名称')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.result','结果')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(surrogateScreeningData) && surrogateScreeningData.map((r:any, i:number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-6">{r.date}</td>
                      <td className="py-3 px-6">{r.category}</td>
                      <td className="py-3 px-6">{r.name}</td>
                      <td className="py-3 px-6">{r.result}</td>
                      <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateScreening.date} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateScreening.category} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称')} value={newSurrogateScreening.name} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, name: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果')} value={newSurrogateScreening.result} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, result: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e)=>{ const f=e.target.files?.[0]; if(f){ const url=await uploadSingleFile(f); setNewSurrogateScreening(prev=>({ ...prev, fileUrl: url })); } }} />
                      <div className="mt-2">
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const list = Array.isArray(surrogateScreeningData) ? surrogateScreeningData : [];
                          if (newSurrogateScreening.date || newSurrogateScreening.name || newSurrogateScreening.fileUrl) {
                            handleAdd('SurrogateMedicalScreening', [...list, newSurrogateScreening]);
                            setNewSurrogateScreening({ date: '', category: '', name: '', result: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
          </div>
        )}
      </div>

      {/* 代母怀孕确认与早期B超 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Early Ultrasound' ? null : 'Surrogate Early Ultrasound')}>
          <span>{t('ivfClinic.surrogateEarlyUS','代母怀孕确认与早期B超')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Early Ultrasound' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Early Ultrasound' && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sage-800">
                <thead className="bg-[#F8F9FA] border-b">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.category','类别')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.name','名称')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.result','结果')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(surrogateEarlyUSData) && surrogateEarlyUSData.map((r:any, i:number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-6">{r.date}</td>
                      <td className="py-3 px-6">{r.category}</td>
                      <td className="py-3 px-6">{r.name}</td>
                      <td className="py-3 px-6">{r.result}</td>
                      <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateEarlyUS.date} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateEarlyUS.category} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称（第X周）')} value={newSurrogateEarlyUS.name} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, name: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果（一句话）')} value={newSurrogateEarlyUS.result} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, result: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e)=>{ const f=e.target.files?.[0]; if(f){ const url=await uploadSingleFile(f); setNewSurrogateEarlyUS(prev=>({ ...prev, fileUrl: url })); } }} />
                      <div className="mt-2">
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const list = Array.isArray(surrogateEarlyUSData) ? surrogateEarlyUSData : [];
                          if (newSurrogateEarlyUS.date || newSurrogateEarlyUS.name || newSurrogateEarlyUS.fileUrl) {
                            handleAdd('SurrogatePregnancyConfirmation', [...list, newSurrogateEarlyUS]);
                            setNewSurrogateEarlyUS({ date: '', category: '', name: '', result: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                  </div>
                    </td>
                  </tr>
                </tbody>
              </table>
                  </div>
                </div>
        )}
            </div>
            
      {/* 代母产检与生产安排 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-8">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Prenatal & Delivery' ? null : 'Surrogate Prenatal & Delivery')}>
          <span>{t('ivfClinic.surrogatePrenatalDelivery','代母产检与生产安排')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Prenatal & Delivery' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Prenatal & Delivery' && (
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#F5F4ED] rounded-lg p-4">
                <div className="text-sm text-sage-600 mb-2">{t('ivfClinic.obHospital','生产医院')}</div>
                <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.obHospital','生产医院')} value={deliveryBoard.obHospital} onChange={e=>setDeliveryBoard({...deliveryBoard, obHospital: e.target.value})} />
                <div className="text-sm text-sage-600 mt-3 mb-2">{t('ivfClinic.obDoctor','生产医生')}</div>
                <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.obDoctor','生产医生')} value={deliveryBoard.obDoctor} onChange={e=>setDeliveryBoard({...deliveryBoard, obDoctor: e.target.value})} />
              </div>
              <div className="bg-[#F5F4ED] rounded-lg p-4 md:col-span-2">
                <div className="text-sm text-sage-600 mb-2">{t('ivfClinic.pboProgress','PBO进程')}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <select className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" value={deliveryBoard.pboStatus} onChange={e=>setDeliveryBoard({...deliveryBoard, pboStatus: e.target.value})}>
                    <option value="">{t('ivfClinic.select','请选择')}</option>
                    <option value="draft">{t('ivfClinic.pboDraft','已起草')}</option>
                    <option value="submitted">{t('ivfClinic.pboSubmitted','已递交')}</option>
                    <option value="completed">{t('ivfClinic.pboCompleted','已完成')}</option>
                  </select>
                  <div>
                    <input type="file" onChange={async (e)=>{ const f=e.target.files?.[0]; if(f){ const url=await uploadSingleFile(f); setDeliveryBoard(prev=>({ ...prev, pboFileUrl: url })); } }} />
                  </div>
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.remark','备注')} value={deliveryBoard.pboRemark} onChange={e=>setDeliveryBoard({...deliveryBoard, pboRemark: e.target.value})} />
                </div>
                <div className="mt-3">
                  <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                    const toSave = { board: deliveryBoard, records: Array.isArray(prenatalDeliveryData?.records) ? prenatalDeliveryData.records : [] };
                    handleAdd('SurrogatePrenatalDelivery', toSave);
                  }}>{t('ivfClinic.save','保存')}</CustomButton>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sage-800">
                <thead className="bg-[#F8F9FA] border-b">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.status','状态')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.name','名称')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.remark','备注')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(prenatalDeliveryData?.records) && prenatalDeliveryData.records.map((r:any, i:number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-6">{r.status}</td>
                      <td className="py-3 px-6">{r.date}</td>
                      <td className="py-3 px-6">{r.name}</td>
                      <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                      <td className="py-3 px-6">{r.remark}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6">
                      <select className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" value={newPrenatalRecord.status} onChange={e=>setNewPrenatalRecord({ ...newPrenatalRecord, status: e.target.value })}>
                        <option value="">{t('ivfClinic.select','请选择')}</option>
                        <option value="scheduled">{t('ivfClinic.scheduled','已预约')}</option>
                        <option value="done">{t('ivfClinic.completed','已完成')}</option>
                      </select>
                    </td>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newPrenatalRecord.date} onChange={e=>setNewPrenatalRecord({ ...newPrenatalRecord, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称（如：第10周产检）')} value={newPrenatalRecord.name} onChange={e=>setNewPrenatalRecord({ ...newPrenatalRecord, name: e.target.value })} /></td>
                    <td className="py-3 px-6"><input type="file" onChange={async (e)=>{ const f=e.target.files?.[0]; if(f){ const url=await uploadSingleFile(f); setNewPrenatalRecord(prev=>({ ...prev, fileUrl: url })); } }} /></td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.remark','备注')} value={newPrenatalRecord.remark} onChange={e=>setNewPrenatalRecord({ ...newPrenatalRecord, remark: e.target.value })} />
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const board = prenatalDeliveryData?.board || deliveryBoard;
                          const records = Array.isArray(prenatalDeliveryData?.records) ? prenatalDeliveryData.records : [];
                          if (newPrenatalRecord.name || newPrenatalRecord.date || newPrenatalRecord.fileUrl) {
                            handleAdd('SurrogatePrenatalDelivery', { board, records: [...records, newPrenatalRecord] });
                            setNewPrenatalRecord({ status: '', date: '', name: '', remark: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
