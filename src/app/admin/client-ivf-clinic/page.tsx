'use client'
import React, { useState, Suspense } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
  
  // 新增：检测报告
  const [newTestingReport, setNewTestingReport] = useState({
    category: '', // 报告名称/分类
    reportDate: '',
    expiryDate: '',
    clinicReviewedAt: '',
    remark: '',
    fileUrl: ''
  });
  // 新增：治疗方案与PGT
  const [treatmentTimelineImageUrl, setTreatmentTimelineImageUrl] = useState('');
  const [isUploadingTimeline, setIsUploadingTimeline] = useState(false);
  const [newPGTRecord, setNewPGTRecord] = useState({ subjectType: '', count: '', result: '' });
  // 新增：代母医疗记录与心理评估
  const [newSurrogateMedicalRecord, setNewSurrogateMedicalRecord] = useState({
    date: '',
    category: '',
    summary: '',
    fileUrl: ''
  });
  // 新增：代母医学筛查
  const [newSurrogateScreening, setNewSurrogateScreening] = useState({
    date: '',
    category: '',
    name: '',
    result: '',
    fileUrl: ''
  });
  // 新增：代母怀孕确认与早期B超
  const [newSurrogateEarlyUS, setNewSurrogateEarlyUS] = useState({
    date: '',
    category: '',
    name: '',
    result: '',
    fileUrl: ''
  });
  // 新增：代母产检与生产安排
  const [deliveryBoard, setDeliveryBoard] = useState({
    obHospital: '',
    obDoctor: '',
    pboStatus: '', // 已起草、已递交、已完成
    pboFileUrl: '',
    pboRemark: ''
  });
  const [newPrenatalRecord, setNewPrenatalRecord] = useState({
    status: '', // 已预约、已完成
    date: '',
    name: '',
    remark: '',
    fileUrl: ''
  });
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

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=intended_parent`).then(r=>r.json()),
      fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`).then(r=>r.json())
    ])
      .then(([ip, gc]) => {
        const list = [ ...(ip?.ivf_clinics || []), ...(gc?.ivf_clinics || []) ];
        setClinics(list);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  // 获取各类型数据
  const clinicOverview = clinics.find(c => c.type === 'ClinicOverview')?.data;
  const embryoJourneyData = clinics.find(c => c.type === 'EmbryoJourney')?.data;
  
  const testingReportsData = clinics.find(c => c.type === 'TestingReports')?.data; // array
  const treatmentPlanData = clinics.find(c => c.type === 'TreatmentPlan')?.data; // { timelineImageUrl }
  const pgtResultsData = clinics.find(c => c.type === 'PGTResults')?.data; // array
  const surrogateMedicalRecordsData = clinics.find(c => c.type === 'SurrogateMedicalRecords')?.data; // array
  const surrogateScreeningData = clinics.find(c => c.type === 'SurrogateMedicalScreening')?.data; // array
  const surrogateEarlyUSData = clinics.find(c => c.type === 'SurrogatePregnancyConfirmation')?.data; // array
  const prenatalDeliveryData = clinics.find(c => c.type === 'SurrogatePrenatalDelivery')?.data; // { board, records }

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
          aboutRole: 'intended_parent'
        })
      });
      if (response.ok) {
        // 重新获取IP+GC数据
        const [ip, gc] = await Promise.all([
          fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=intended_parent`).then(r=>r.json()),
          fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`).then(r=>r.json())
        ]);
        setClinics([...(ip?.ivf_clinics||[]), ...(gc?.ivf_clinics||[])]);
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

  // 新增功能
  // EmbryoJourney合并数据后再提交
  const handleAdd = async (type: string, data: any) => {
    setLoading(true);
    let mergedData = data;
    let apiEndpoint = '/api/ivf-clinic-create';
    let apiMethod = 'POST';
    const surrogateTypes = new Set(['SurrogateMedicalRecords','SurrogateMedicalScreening','SurrogatePregnancyConfirmation','SurrogatePrenatalDelivery']);
    const aboutRole = surrogateTypes.has(type) ? 'surrogate_mother' : 'intended_parent';
    
    // 检查是否已存在该类型的数据
    const existingRecord = clinics.find(c => c.type === type);
    
    if (existingRecord) {
      // 如果已存在，使用更新API
      apiEndpoint = '/api/ivf-clinic-update';
      
      if (type === 'EmbryoJourney') {
        // 获取当前数据
        const current = existingRecord.data || { timeline: [], embryos: [] };
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
      } else {
        // 对于其他类型（SurrogateAppointments, MedicationTracker, DoctorNotes），直接使用传入的合并数据
        mergedData = data;
      }
    }
    
    const requestBody = apiEndpoint === '/api/ivf-clinic-update' 
      ? { caseId: caseId, type, data: mergedData, aboutRole }
      : { ivf_clinic: { type, data: mergedData, case_cases: caseId }, aboutRole };
    
    const res = await fetch(apiEndpoint, {
      method: apiMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const result = await res.json();
    if (result.ivf_clinic || res.ok) {
      // 成功后重新拉取接口数据，保证 clinics 最新
      const [ip, gc] = await Promise.all([
        fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=intended_parent`).then(r=>r.json()),
        fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`).then(r=>r.json())
      ]);
      setClinics([...(ip?.ivf_clinics||[]), ...(gc?.ivf_clinics||[])]);
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

  // 删除功能：支持 about_role 作用域
  const handleDelete = async (type: string, index: number) => {
    const surrogateTypes = new Set(['SurrogateMedicalRecords','SurrogateMedicalScreening','SurrogatePregnancyConfirmation','SurrogatePrenatalDelivery']);
    const aboutRole = surrogateTypes.has(type) ? 'surrogate_mother' : 'intended_parent';
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
          body: JSON.stringify({ caseId, type, data: { board: current.board || {}, records: newRecords }, aboutRole })
        });
      } else {
        const currentArray = Array.isArray(existingRecord.data) ? existingRecord.data : [];
        const newArray = currentArray.filter((_: any, i: number) => i !== index);
        await fetch('/api/ivf-clinic-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId, type, data: newArray, aboutRole })
        });
      }
      const [ip, gc] = await Promise.all([
        fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=intended_parent`).then(r=>r.json()),
        fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`).then(r=>r.json())
      ]);
      setClinics([...(ip?.ivf_clinics||[]), ...(gc?.ivf_clinics||[])]);
    } catch (e) {
      console.error('删除失败', e);
    } finally {
      setLoading(false);
    }
  };

  // 文件上传（单文件）
  const uploadSingleFile = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload/form', { method: 'POST', body: form });
    const data = await res.json();
    if (res.ok && data?.data) {
      // 兼容单文件与多文件返回
      const url = Array.isArray(data.data) ? data.data[0]?.url : data.data?.url;
      return url || '';
    }
    return '';
  };

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
        {open === 'Clinic Overview' && clinicOverview && !editingClinic && (
          <div className="px-6 py-4">
            {/* 顶部医院名称和地址，字体统一，简洁分布 */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-[#271F18]">{(clinicOverview.location || '').split(',')[0] || ''}</span>
              <span className="text-lg font-semibold text-[#271F18]">{(clinicOverview.location || '').split(',')[1] || ''}</span>
            </div>
            {/* 医生和协调员卡片，灰色背景，内容严格按设计图，不显示地址 */}
            <div className="flex gap-4">
              {/* Doctor */}
              <div className="flex-1 bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-center cursor-pointer" onClick={() => setEditingClinic(true)}>
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
              <div className="flex-1 bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-center cursor-pointer" onClick={() => setEditingClinic(true)}>
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
        {/* 编辑模式 */}
        {open === 'Clinic Overview' && clinicOverview && editingClinic && (
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-serif text-lg text-[#271F18] font-medium">{t('ivfClinic.editClinicOverview')}</h4>
              <div className="flex gap-2">
                <CustomButton 
                  className="px-4 py-2 text-sm cursor-pointer border border-[#C2A87A] bg-white text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white" 
                  onClick={handleCancelEdit}
                >
                  {t('ivfClinic.cancel')}
                </CustomButton>
                <CustomButton 
                  className="px-4 py-2 bg-[#C2A87A] text-white hover:bg-[#a88a5c] text-sm cursor-pointer" 
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? t('ivfClinic.saving') : t('ivfClinic.save')}
                </CustomButton>
              </div>
            </div>
            
            {/* 医生和协调员信息编辑 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 医生信息编辑 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.doctorInfo')}</h5>
                <div className="space-y-3">
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.doctorName')}
                    value={editData.doctor.name} 
                    onChange={e => setEditData({ ...editData, doctor: { ...editData.doctor, name: e.target.value } })} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.doctorRole')}
                    value={editData.doctor.role} 
                    onChange={e => setEditData({ ...editData, doctor: { ...editData.doctor, role: e.target.value } })} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.doctorEmail')}
                    value={editData.doctor.email} 
                    onChange={e => setEditData({ ...editData, doctor: { ...editData.doctor, email: e.target.value } })} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.doctorPhone')}
                    value={editData.doctor.phone} 
                    onChange={e => setEditData({ ...editData, doctor: { ...editData.doctor, phone: e.target.value } })} 
                  />
                  <textarea 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent resize-none" 
                    placeholder={t('ivfClinic.doctorDesc')}
                    rows={3} 
                    value={editData.doctor.desc} 
                    onChange={e => setEditData({ ...editData, doctor: { ...editData.doctor, desc: e.target.value } })} 
                  />
                </div>
              </div>

              {/* 协调员信息编辑 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.coordinatorInfo')}</h5>
                <div className="space-y-3">
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.coordinatorName')}
                    value={editData.coordinator.name} 
                    onChange={e => setEditData({ ...editData, coordinator: { ...editData.coordinator, name: e.target.value } })} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.coordinatorRole')}
                    value={editData.coordinator.role} 
                    onChange={e => setEditData({ ...editData, coordinator: { ...editData.coordinator, role: e.target.value } })} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.coordinatorEmail')}
                    value={editData.coordinator.email} 
                    onChange={e => setEditData({ ...editData, coordinator: { ...editData.coordinator, email: e.target.value } })} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.coordinatorPhone')}
                    value={editData.coordinator.phone} 
                    onChange={e => setEditData({ ...editData, coordinator: { ...editData.coordinator, phone: e.target.value } })} 
                  />
                  <textarea 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent resize-none" 
                    placeholder={t('ivfClinic.coordinatorDesc')}
                    rows={3} 
                    value={editData.coordinator.desc} 
                    onChange={e => setEditData({ ...editData, coordinator: { ...editData.coordinator, desc: e.target.value } })} 
                  />
                </div>
              </div>
            </div>
            
            {/* 诊所地址编辑 */}
            <div className="mt-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.clinicAddress')}</h5>
                <input 
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                  placeholder={t('ivfClinic.enterClinicAddress')}
                  value={editData.location} 
                  onChange={e => setEditData({ ...editData, location: e.target.value })} 
                />
              </div>
            </div>
          </div>
        )}
        {/* 仅在没有数据时显示新增表单 */}
        {open === 'Clinic Overview' && !clinicOverview && (
          <div className="px-6 py-4">
            <h4 className="font-serif mb-6 text-lg text-[#271F18]">{t('ivfClinic.addClinicOverview')}</h4>
            {/* 诊所地址部分（移到最上面） */}
            <div className="mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.clinicAddress')}</h5>
                <input 
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                  placeholder={t('ivfClinic.clinicAddressHint')}
                  value={formData.location || ''} 
                  onChange={e => setFormData({ ...formData, location: e.target.value })} 
                />
              </div>
            </div>
            {/* 医生和协调员信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 医生信息部分 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.doctorInfo')}</h5>
                <div className="space-y-3">
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorName')} value={formData.doctor.name} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, name: e.target.value } })} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorRole')} value={formData.doctor.role} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, role: e.target.value } })} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorEmail')} value={formData.doctor.email} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, email: e.target.value } })} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorPhone')} value={formData.doctor.phone} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, phone: e.target.value } })} />
                  <textarea className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent resize-none" placeholder={t('ivfClinic.doctorDesc')} rows={3} value={formData.doctor.desc} onChange={e => setFormData({ ...formData, doctor: { ...formData.doctor, desc: e.target.value } })}></textarea>
                </div>
              </div>
              {/* 协调员信息部分 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.coordinatorInfo')}</h5>
                <div className="space-y-3">
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.coordinatorName')} value={formData.coordinator.name} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, name: e.target.value } })} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.coordinatorRole')} value={formData.coordinator.role} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, role: e.target.value } })} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.coordinatorEmail')} value={formData.coordinator.email} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, email: e.target.value } })} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.coordinatorPhone')} value={formData.coordinator.phone} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, phone: e.target.value } })} />
                  <textarea className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent resize-none" placeholder={t('ivfClinic.coordinatorDesc')} rows={3} value={formData.coordinator.desc} onChange={e => setFormData({ ...formData, coordinator: { ...formData.coordinator, desc: e.target.value } })}></textarea>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
                <Button 
                  className="px-8 py-3 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] transition rounded-lg font-medium cursor-pointer" 
                  onClick={() => handleAdd('ClinicOverview', formData)}
                >
                  {t('ivfClinic.addClinicOverview')}
                </Button>
            </div>
          </div>
        )}
      </div>
      {/* Testing Reports / 检测报告 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Testing Reports' ? null : 'Testing Reports')}>
          <span>{t('ivfClinic.testingReports', '检测报告')}</span>
          <span className={`text-xl transition-transform ${open === 'Testing Reports' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Testing Reports' && (
          <div className="px-6 py-4">
            {/* 列表 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sage-800">
                <thead className="bg-[#F8F9FA] border-b">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.reportName','报告名称/类别')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.reportDate','报告时间')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.reportExpiry','有效期')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.clinicReviewedAt','诊所查看时间')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.remark','备注')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                    <th className="py-3 px-6 text-left font-semibold text-base"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(testingReportsData) && testingReportsData.map((r: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-6 text-base">{r.category}</td>
                      <td className="py-3 px-6 text-base">{r.reportDate}</td>
                      <td className="py-3 px-6 text-base">{r.expiryDate}</td>
                      <td className="py-3 px-6 text-base">{r.clinicReviewedAt}</td>
                      <td className="py-3 px-6 text-base">{r.remark}</td>
                      <td className="py-3 px-6 text-base">
                        {r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button className="text-red-500 text-sm" onClick={() => handleDelete('TestingReports', i)}>{t('ivfClinic.delete','删除')}</button>
                      </td>
                    </tr>
                  ))}
                  {/* 新增行 */}
                  <tr>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.reportName','报告名称/类别')} value={newTestingReport.category} onChange={e=>setNewTestingReport({ ...newTestingReport, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.reportDate','报告时间')} value={newTestingReport.reportDate} onChange={e=>setNewTestingReport({ ...newTestingReport, reportDate: e.target.value })} /></td>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.reportExpiry','有效期')} value={newTestingReport.expiryDate} onChange={e=>setNewTestingReport({ ...newTestingReport, expiryDate: e.target.value })} /></td>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.clinicReviewedAt','诊所查看时间')} value={newTestingReport.clinicReviewedAt} onChange={e=>setNewTestingReport({ ...newTestingReport, clinicReviewedAt: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.remark','备注')} value={newTestingReport.remark} onChange={e=>setNewTestingReport({ ...newTestingReport, remark: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await uploadSingleFile(f);
                          setNewTestingReport(prev => ({ ...prev, fileUrl: url }));
                        }
                      }} />
                      <div className="mt-2 flex gap-2">
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const list = Array.isArray(testingReportsData) ? testingReportsData : [];
                          if (newTestingReport.category || newTestingReport.reportDate || newTestingReport.fileUrl) {
                            handleAdd('TestingReports', [...list, newTestingReport]);
                            setNewTestingReport({ category: '', reportDate: '', expiryDate: '', clinicReviewedAt: '', remark: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                        <CustomButton className="px-3 py-1 text-xs rounded" onClick={() => setNewTestingReport({ category: '', reportDate: '', expiryDate: '', clinicReviewedAt: '', remark: '', fileUrl: '' })}>{t('ivfClinic.cancel','取消')}</CustomButton>
              </div>
                    </td>
                  </tr>
                </tbody>
              </table>
                  </div>
                  </div>
        )}
                </div>

      {/* Treatment Plan & IVF Timeline / 治疗方案与时间表 + PGT结果 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Treatment Plan' ? null : 'Treatment Plan')}>
          <span>{t('ivfClinic.treatmentPlan','治疗方案与时间表')}</span>
          <span className={`text-xl transition-transform ${open === 'Treatment Plan' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Treatment Plan' && (
          <div className="px-6 py-4 space-y-6">
            {/* 时间表图片上传/展示 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-sage-800">{t('ivfClinic.timelineImage','时间表图片')}</h3>
              {treatmentPlanData?.timelineImageUrl ? (
                <div className="mb-3">
                  <img src={treatmentPlanData.timelineImageUrl} alt="timeline" className="max-h-80 rounded border" />
                </div>
              ) : null}
              <div className="flex items-center gap-3">
                <input type="file" accept="image/*" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setIsUploadingTimeline(true);
                  const url = await uploadSingleFile(f);
                  setIsUploadingTimeline(false);
                  setTreatmentTimelineImageUrl(url);
                }} />
                <CustomButton disabled={isUploadingTimeline || !treatmentTimelineImageUrl} className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                  const dataToSave = { timelineImageUrl: treatmentTimelineImageUrl };
                  handleAdd('TreatmentPlan', dataToSave);
                  setTreatmentTimelineImageUrl('');
                }}>{isUploadingTimeline ? t('ivfClinic.uploading','上传中...') : t('ivfClinic.save','保存')}</CustomButton>
              </div>
            </div>
            {/* PGT结果 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-sage-800">{t('ivfClinic.pgtResults','PGT结果')}</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sage-800">
                  <thead className="bg-[#F8F9FA] border-b">
                    <tr>
                      <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.subjectType','类型')}</th>
                      <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.count','数量')}</th>
                      <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.result','结果')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(pgtResultsData) && pgtResultsData.map((p: any, i: number) => (
                      <tr key={i} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-3 px-6 text-base">{p.subjectType}</td>
                        <td className="py-3 px-6 text-base">{p.count}</td>
                        <td className="py-3 px-6 text-base">{p.result}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.subjectType','类型（卵子/胚胎）')} value={newPGTRecord.subjectType} onChange={e=>setNewPGTRecord({ ...newPGTRecord, subjectType: e.target.value })} /></td>
                      <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.count','数量')} value={newPGTRecord.count} onChange={e=>setNewPGTRecord({ ...newPGTRecord, count: e.target.value })} /></td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果（简述）')} value={newPGTRecord.result} onChange={e=>setNewPGTRecord({ ...newPGTRecord, result: e.target.value })} />
                          <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                            const list = Array.isArray(pgtResultsData) ? pgtResultsData : [];
                            if (newPGTRecord.subjectType || newPGTRecord.count || newPGTRecord.result) {
                              handleAdd('PGTResults', [...list, newPGTRecord]);
                              setNewPGTRecord({ subjectType: '', count: '', result: '' });
                            }
                          }}>{t('ivfClinic.add','新增')}</CustomButton>
                </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
            {/* 显示已有的 Embryo Journey 数据 */}
            {embryoJourneyData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 左侧时间线展示 */}
                <div className="relative">
                  <h3 className="text-lg font-semibold mb-4 text-sage-800">{t('ivfClinic.timeline')}</h3>
                  <div className="relative pl-8">
                    {/* 竖线 */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-[#C2A87A]"></div>
                    {embryoJourneyData?.timeline?.map((item: any, i: number) => (
                      <React.Fragment key={i}>
                        <div className="relative mb-6 last:mb-0 flex items-start">
                          {/* 圆点 */}
                          <div className="absolute left-0 w-2 h-2 rounded-full bg-white border-2 border-[#C2A87A] mt-2"></div>
                          <div className="ml-6">
                            <div className="text-base font-medium text-sage-800 mb-1">{item.label}</div>
                            <div className="text-sm text-sage-600">{item.date}</div>
                          </div>
                        </div>
                        {/* 只在最后一条下方显示加号和输入区域，且左对齐 */}
                        {i === embryoJourneyData.timeline.length - 1 && (
                          timelineAddIndex === i ? (
                            <div className="flex gap-2 items-center mb-6 ml-6">
                              <input
                                className="border border-gray-200 rounded-lg px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                placeholder={t('ivfClinic.eventName')}
                                value={timelineAddValue.label}
                                onChange={e => setTimelineAddValue({ ...timelineAddValue, label: e.target.value })}
                              />
                              <input
                                className="border border-gray-200 rounded-lg px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                placeholder={t('ivfClinic.eventDate')}
                                value={timelineAddValue.date}
                                onChange={e => setTimelineAddValue({ ...timelineAddValue, date: e.target.value })}
                              />
                                <CustomButton
                                  className="px-3 py-1 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] text-xs rounded transition"
                                  onClick={async () => {
                                    if (timelineAddValue.label || timelineAddValue.date) {
                                      await handleAdd('EmbryoJourney', { timeline: [timelineAddValue], embryos: [] });
                                      setTimelineAddValue({ label: '', date: '' });
                                      setTimelineAddIndex(null);
                                    }
                                  }}
                                >{t('ivfClinic.save')}</CustomButton>
                                <CustomButton
                                  className="px-3 py-1 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] text-xs rounded transition"
                                  onClick={() => {
                                    setTimelineAddValue({ label: '', date: '' });
                                    setTimelineAddIndex(null);
                                  }}
                                >{t('ivfClinic.cancel')}</CustomButton>
                            </div>
                          ) : (
                            <div className="ml-6 mb-6">
                              <button
                                className="text-[#C2A87A] text-lg px-2 py-0 hover:bg-sage-50 rounded-full cursor-pointer"
                                onClick={() => {
                                  setTimelineAddIndex(i);
                                  setTimelineAddValue({ label: '', date: '' });
                                }}
                                title={t('ivfClinic.addTimelineEvent')}
                                style={{cursor:'pointer'}}
                              >＋</button>
                            </div>
                          )
                        )}
                      </React.Fragment>
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
                        {/* 表格最后一行下方加号和输入区，左对齐 */}
                        <tr>
                          <td colSpan={3} className="pt-2 pb-4 px-6">
                            {embryoAddActive ? (
                              <div className="flex gap-2 items-center">
                                <input
                                  className="border border-gray-200 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                  placeholder={t('ivfClinic.grade')}
                                  value={embryoAddValue.grade}
                                  onChange={e => setEmbryoAddValue({ ...embryoAddValue, grade: e.target.value })}
                                />
                                <input
                                  className="border border-gray-200 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                  placeholder={t('ivfClinic.id')}
                                  value={embryoAddValue.id}
                                  onChange={e => setEmbryoAddValue({ ...embryoAddValue, id: e.target.value })}
                                />
                                <input
                                  className="border border-gray-200 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                  placeholder={t('ivfClinic.status')}
                                  value={embryoAddValue.status}
                                  onChange={e => setEmbryoAddValue({ ...embryoAddValue, status: e.target.value })}
                                />
                                <CustomButton
                                  className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded"
                                  onClick={async () => {
                                    if (embryoAddValue.grade || embryoAddValue.id || embryoAddValue.status) {
                                      await handleAdd('EmbryoJourney', { timeline: [], embryos: [embryoAddValue] });
                                      setEmbryoAddValue({ grade: '', id: '', status: '' });
                                      setEmbryoAddActive(false);
                                    }
                                  }}
                                >{t('ivfClinic.save')}</CustomButton>
                                <CustomButton
                                  className="px-3 py-1 text-xs rounded"
                                  onClick={() => {
                                    setEmbryoAddValue({ grade: '', id: '', status: '' });
                                    setEmbryoAddActive(false);
                                  }}
                                >{t('ivfClinic.cancel')}</CustomButton>
                              </div>
                            ) : (
                              <div>
                                <button
                                  className="text-[#C2A87A] text-lg px-2 py-0 hover:bg-sage-50 rounded-full cursor-pointer"
                                  onClick={() => {
                                    setEmbryoAddActive(true);
                                    setEmbryoAddValue({ grade: '', id: '', status: '' });
                                  }}
                                  title={t('ivfClinic.addEmbryoInfo')}
                                  style={{cursor:'pointer'}}
                                >＋</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 新增胚胎旅程表单 - 左右分区独立添加 */}
            {/* 已移除右侧批量新增区域，交互已集成到表格下方加号 */}
          </div>
        )}
      </div>
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
                    <th className="py-3 px-6 text-left font-semibold text-base"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(surrogateMedicalRecordsData) && surrogateMedicalRecordsData.map((r:any, i:number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 px-6">{r.date}</td>
                      <td className="py-3 px-6">{r.category}</td>
                      <td className="py-3 px-6">{r.summary}</td>
                      <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                      <td className="py-3 px-6 text-right"><button className="text-red-500 text-sm" onClick={() => handleDelete('SurrogateMedicalRecords', i)}>{t('ivfClinic.delete','删除')}</button></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateMedicalRecord.date} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateMedicalRecord.category} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.summary','简述')} value={newSurrogateMedicalRecord.summary} onChange={e=>setNewSurrogateMedicalRecord({ ...newSurrogateMedicalRecord, summary: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e)=>{
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await uploadSingleFile(f);
                          setNewSurrogateMedicalRecord(prev=>({ ...prev, fileUrl: url }));
                        }
                      }} />
                      <div className="mt-2 flex gap-2">
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const list = Array.isArray(surrogateMedicalRecordsData) ? surrogateMedicalRecordsData : [];
                          if (newSurrogateMedicalRecord.date || newSurrogateMedicalRecord.category || newSurrogateMedicalRecord.fileUrl) {
                            handleAdd('SurrogateMedicalRecords', [...list, newSurrogateMedicalRecord]);
                            setNewSurrogateMedicalRecord({ date: '', category: '', summary: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                        <CustomButton className="px-3 py-1 text-xs rounded" onClick={() => setNewSurrogateMedicalRecord({ date: '', category: '', summary: '', fileUrl: '' })}>{t('ivfClinic.cancel','取消')}</CustomButton>
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
                    <th className="py-3 px-6 text-left font-semibold text-base"></th>
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
                      <td className="py-3 px-6 text-right"><button className="text-red-500 text-sm" onClick={() => handleDelete('SurrogateMedicalScreening', i)}>{t('ivfClinic.delete','删除')}</button></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateScreening.date} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateScreening.category} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称')} value={newSurrogateScreening.name} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, name: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果')} value={newSurrogateScreening.result} onChange={e=>setNewSurrogateScreening({ ...newSurrogateScreening, result: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e)=>{
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await uploadSingleFile(f);
                          setNewSurrogateScreening(prev=>({ ...prev, fileUrl: url }));
                        }
                      }} />
                      <div className="mt-2 flex gap-2">
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const list = Array.isArray(surrogateScreeningData) ? surrogateScreeningData : [];
                          if (newSurrogateScreening.date || newSurrogateScreening.name || newSurrogateScreening.fileUrl) {
                            handleAdd('SurrogateMedicalScreening', [...list, newSurrogateScreening]);
                            setNewSurrogateScreening({ date: '', category: '', name: '', result: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                        <CustomButton className="px-3 py-1 text-xs rounded" onClick={() => setNewSurrogateScreening({ date: '', category: '', name: '', result: '', fileUrl: '' })}>{t('ivfClinic.cancel','取消')}</CustomButton>
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
                    <th className="py-3 px-6 text-left font-semibold text-base"></th>
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
                      <td className="py-3 px-6 text-right"><button className="text-red-500 text-sm" onClick={() => handleDelete('SurrogatePregnancyConfirmation', i)}>{t('ivfClinic.delete','删除')}</button></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date','时间')} value={newSurrogateEarlyUS.date} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, date: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateEarlyUS.category} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, category: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称（第X周）')} value={newSurrogateEarlyUS.name} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, name: e.target.value })} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果（一句话）')} value={newSurrogateEarlyUS.result} onChange={e=>setNewSurrogateEarlyUS({ ...newSurrogateEarlyUS, result: e.target.value })} /></td>
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e)=>{
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await uploadSingleFile(f);
                          setNewSurrogateEarlyUS(prev=>({ ...prev, fileUrl: url }));
                        }
                      }} />
                      <div className="mt-2 flex gap-2">
                        <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded" onClick={() => {
                          const list = Array.isArray(surrogateEarlyUSData) ? surrogateEarlyUSData : [];
                          if (newSurrogateEarlyUS.date || newSurrogateEarlyUS.name || newSurrogateEarlyUS.fileUrl) {
                            handleAdd('SurrogatePregnancyConfirmation', [...list, newSurrogateEarlyUS]);
                            setNewSurrogateEarlyUS({ date: '', category: '', name: '', result: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                        <CustomButton className="px-3 py-1 text-xs rounded" onClick={() => setNewSurrogateEarlyUS({ date: '', category: '', name: '', result: '', fileUrl: '' })}>{t('ivfClinic.cancel','取消')}</CustomButton>
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
            {/* 看板 */}
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
                    <input type="file" onChange={async (e)=>{
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = await uploadSingleFile(f);
                        setDeliveryBoard(prev=>({ ...prev, pboFileUrl: url }));
                      }
                    }} />
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
            {/* 产检与生产记录列表 */}
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
                    <td className="py-3 px-6">
                      <input type="file" onChange={async (e)=>{
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await uploadSingleFile(f);
                          setNewPrenatalRecord(prev=>({ ...prev, fileUrl: url }));
                        }
                      }} />
                    </td>
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
