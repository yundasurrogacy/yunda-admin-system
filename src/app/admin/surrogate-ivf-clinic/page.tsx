"use client"
import React, { useState, Suspense, useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CustomButton } from '../../../components/ui/CustomButton'
import { FileUpload } from '@/components/ui/FileUpload'
// import ManagerLayout from '@/components/manager-layout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取需要使用 useSearchParams 的逻辑到单独的组件
function IVFClinicContent() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');

  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router]);

  // 只在认证后才加载数据
  useEffect(() => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`)
      .then(res => res.json())
      .then(data => {
        setClinics(data.ivf_clinics || []);
      })
      .finally(() => setLoading(false));
  }, [caseId, isAuthenticated]);

  // 获取各类型数据（memoized）
  const clinicOverview = useMemo(() => clinics.find(c => c.type === 'ClinicOverview')?.data, [clinics]);
  const embryoJourneyData = useMemo(() => clinics.find(c => c.type === 'EmbryoJourney')?.data, [clinics]);
  const surrogateMedicalRecordsData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalRecords')?.data, [clinics]);
  const surrogateScreeningData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalScreening')?.data, [clinics]);
  const surrogateEarlyUSData = useMemo(() => clinics.find(c => c.type === 'SurrogatePregnancyConfirmation')?.data, [clinics]);
  const prenatalDeliveryData = useMemo(() => clinics.find(c => c.type === 'SurrogatePrenatalDelivery')?.data, [clinics]);

  // 使用 useCallback 缓存初始化编辑数据函数
  const initEditData = useCallback(() => {
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
  }, [clinicOverview]);

  // 使用 useEffect 初始化产检与生产安排的看板数据
  useEffect(() => {
    if (prenatalDeliveryData?.board) {
      setDeliveryBoard({
        obHospital: prenatalDeliveryData.board.obHospital || '',
        obDoctor: prenatalDeliveryData.board.obDoctor || '',
        pboStatus: prenatalDeliveryData.board.pboStatus || '',
        pboFileUrl: prenatalDeliveryData.board.pboFileUrl || '',
        pboRemark: prenatalDeliveryData.board.pboRemark || ''
      });
    }
  }, [prenatalDeliveryData]);

  // 使用 useCallback 缓存保存编辑函数
  const handleSaveEdit = useCallback(async () => {
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
  }, [caseId, editData]);

  // 使用 useCallback 缓存取消编辑函数
  const handleCancelEdit = useCallback(() => {
    setEditingClinic(false);
    initEditData(); // 重置数据
  }, [initEditData]);

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
    
    // 如果 update 返回 404（记录不存在），则尝试 create
    if (res.status === 404 && apiEndpoint === '/api/ivf-clinic-update') {
      console.log('Record not found, creating new record...');
      const createRes = await fetch('/api/ivf-clinic-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ivf_clinic: { type, data: mergedData, case_cases: caseId }, aboutRole: 'surrogate_mother' }),
      });
      const createResult = await createRes.json();
      if (createResult.ivf_clinic || createRes.ok) {
        const fetchRes = await fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`);
        const fetchData = await fetchRes.json();
        setClinics(fetchData.ivf_clinics || []);
        console.log('Record created successfully');
      }
    } else if (result.ivf_clinic || res.ok) {
      // 成功后重新拉取接口数据，保证 clinics 最新
      const fetchRes = await fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`);
      const fetchData = await fetchRes.json();
      setClinics(fetchData.ivf_clinics || []);
      console.log('Record updated successfully');
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
    } else {
      console.error('Failed to save record:', result);
    }
    setLoading(false);
  }, [clinics, caseId]);

  // 使用 useCallback 缓存删除功能
  const handleDelete = useCallback(async (type: string, index: number) => {
    const existingRecord = clinics.find(c => c.type === type);
    if (!existingRecord) return;
    setLoading(true);
    try {
      if (type === 'SurrogatePrenatalDelivery') {
        const current = existingRecord.data || { board: {}, records: [] };
        const newRecords = (current.records || []).filter((_: any, i: number) => i !== index);
        await fetch('/api/ivf-clinic-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId, type, data: { board: current.board || {}, records: newRecords }, aboutRole: 'surrogate_mother' })
        });
      } else {
        const currentArray = Array.isArray(existingRecord.data) ? existingRecord.data : [];
        const newArray = currentArray.filter((_: any, i: number) => i !== index);
        await fetch('/api/ivf-clinic-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId, type, data: newArray, aboutRole: 'surrogate_mother' })
        });
      }
      const fetchRes = await fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`);
      const fetchData = await fetchRes.json();
      setClinics(fetchData.ivf_clinics || []);
    } catch (e) {
      console.error('删除失败', e);
    } finally {
      setLoading(false);
    }
  }, [caseId, clinics]);

  // 文件上传（单文件） memoized - 使用七牛云直传
  const uploadSingleFile = useCallback(async (file: File): Promise<string> => {
    try {
      const { uploadFileToQiniu } = await import('@/utils/qiniuDirectUpload');
      const result = await uploadFileToQiniu(file);
      return result.url;
    } catch (error) {
      console.error('File upload failed:', error);
      return '';
    }
  }, []);

  // 使用 useCallback 缓存返回按钮处理函数
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // 使用 useCallback 缓存折叠面板切换函数
  const handleToggleSection = useCallback((section: string) => {
    setOpen(open === section ? null : section);
  }, [open]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-8 min-h-screen bg-main-bg">
        {/* 返回按钮 */}
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer transition-colors"
          onClick={handleBack}
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
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Medical Records')}>
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
                      <td className="py-3 px-6 flex items-center justify-between gap-2">
                        {r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}
                        <button 
                          className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" 
                          onClick={() => handleDelete('SurrogateMedicalRecords', i)}
                        >
                          {t('ivfClinic.delete','删除')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateMedicalRecord.date} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateMedicalRecord.category} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.summary','简述')} value={newSurrogateMedicalRecord.summary} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, summary: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <div className="space-y-2">
                        <FileUpload
                          fileUrl={newSurrogateMedicalRecord.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadSingleFile(file);
                            setNewSurrogateMedicalRecord(prev => ({ ...prev, fileUrl: url }));
                          }}
                        />
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
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
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Screening')}>
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
                      <td className="py-3 px-6 flex items-center justify-between gap-2">
                        {r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}
                        <button 
                          className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" 
                          onClick={() => handleDelete('SurrogateMedicalScreening', i)}
                        >
                          {t('ivfClinic.delete','删除')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateScreening.date} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateScreening.category} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称')} value={newSurrogateScreening.name} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, name: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果')} value={newSurrogateScreening.result} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, result: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <div className="space-y-2">
                        <FileUpload
                          fileUrl={newSurrogateScreening.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadSingleFile(file);
                            setNewSurrogateScreening(prev => ({ ...prev, fileUrl: url }));
                          }}
                        />
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
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
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Early Ultrasound')}>
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
                      <td className="py-3 px-6 flex items-center justify-between gap-2">
                        {r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}
                        <button 
                          className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" 
                          onClick={() => handleDelete('SurrogatePregnancyConfirmation', i)}
                        >
                          {t('ivfClinic.delete','删除')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateEarlyUS.date} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateEarlyUS.category} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称（第X周）')} value={newSurrogateEarlyUS.name} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, name: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果（一句话）')} value={newSurrogateEarlyUS.result} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, result: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <div className="space-y-2">
                        <FileUpload
                          fileUrl={newSurrogateEarlyUS.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadSingleFile(file);
                            setNewSurrogateEarlyUS(prev => ({ ...prev, fileUrl: url }));
                          }}
                        />
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
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
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Prenatal & Delivery')}>
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
                  <FileUpload
                    fileUrl={deliveryBoard.pboFileUrl}
                    onChange={async (file) => {
                      const url = await uploadSingleFile(file);
                      setDeliveryBoard(prev => ({ ...prev, pboFileUrl: url }));
                    }}
                  />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.remark','备注')} value={deliveryBoard.pboRemark} onChange={e=>setDeliveryBoard({...deliveryBoard, pboRemark: e.target.value})} />
                </div>
                <div className="mt-3">
                  <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
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
                      <td className="py-3 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          r.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                          r.status === 'done' ? 'bg-green-100 text-green-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {r.status === 'scheduled' ? t('ivfClinic.scheduled','已预约') : 
                           r.status === 'done' ? t('ivfClinic.completed','已完成') : r.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">{r.date}</td>
                      <td className="py-3 px-6">{r.name}</td>
                      <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                      <td className="py-3 px-6 flex items-center justify-between gap-2">
                        <span>{r.remark}</span>
                        <button 
                          className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" 
                          onClick={() => handleDelete('SurrogatePrenatalDelivery', i)}
                        >
                          {t('ivfClinic.delete','删除')}
                        </button>
                      </td>
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
                    <td className="py-3 px-6">
                      <FileUpload
                        fileUrl={newPrenatalRecord.fileUrl}
                        onChange={async (file) => {
                          const url = await uploadSingleFile(file);
                          setNewPrenatalRecord(prev => ({ ...prev, fileUrl: url }));
                        }}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.remark','备注')} value={newPrenatalRecord.remark} onChange={e=>setNewPrenatalRecord({ ...newPrenatalRecord, remark: e.target.value })} />
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
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
