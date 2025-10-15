"use client"
import React, { useState, Suspense } from 'react'
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

  useEffect(() => {
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
          data: editData
        })
      });
      if (response.ok) {
        // 重新获取数据
        const updatedResponse = await fetch(`/api/ivf-clinic-get?caseId=${caseId}`);
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

  // 新增功能
  // EmbryoJourney合并数据后再提交
  const handleAdd = async (type: string, data: any) => {
    setLoading(true);
    let mergedData = data;
    let apiEndpoint = '/api/ivf-clinic-create';
    let apiMethod = 'POST';
    
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
      ? { caseId: caseId, type, data: mergedData }
      : { ivf_clinic: { type, data: mergedData, case_cases: caseId } };
    
    const res = await fetch(apiEndpoint, {
      method: apiMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const result = await res.json();
    if (result.ivf_clinic || res.ok) {
      // 成功后重新拉取接口数据，保证 clinics 最新
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
                <CustomButton 
                  className="px-8 py-3 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] transition rounded-lg font-medium cursor-pointer" 
                  onClick={() => handleAdd('ClinicOverview', formData)}
                >
                  {t('ivfClinic.addClinicOverview')}
                </CustomButton>
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
              {/* 输入区 */}
              <div className="grid grid-cols-6 border-t border-b border-[#C2A87A] bg-[#F7F3ED] items-center">
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.date')} value={newAppointment.date} onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.type')} value={newAppointment.type} onChange={e => setNewAppointment({ ...newAppointment, type: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.doctor')} value={newAppointment.doctor} onChange={e => setNewAppointment({ ...newAppointment, doctor: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.medication')} value={newAppointment.medication} onChange={e => setNewAppointment({ ...newAppointment, medication: e.target.value })} />
                <input
                  className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400"
                  style={{boxShadow:'none'}}
                  placeholder={t('ivfClinic.instructionsHint')}
                  title={t('ivfClinic.instructionsHint')}
                  value={newAppointment.instructions}
                  onChange={e => setNewAppointment({ ...newAppointment, instructions: e.target.value })}
                  onMouseEnter={e => { e.currentTarget.setAttribute('title', t('ivfClinic.instructionsHint')); }}
                  onMouseLeave={e => { e.currentTarget.removeAttribute('title'); }}
                />
                <div className="flex items-center justify-center px-6 h-full">
                  <CustomButton 
                    className="w-1/2 flex items-center justify-center px-0 py-2 rounded-lg bg-[#B0BEB7] text-white font-bold text-lg shadow hover:bg-[#a3b1a8] transition cursor-pointer h-full mx-auto border-none" 
                    style={{display:'flex'}} 
                    onClick={() => { 
                      if (newAppointment.date || newAppointment.type || newAppointment.doctor || newAppointment.medication || newAppointment.instructions) {
                        handleAdd('SurrogateAppointments', [...(surrogateAppointmentsData || []), { ...newAppointment, instructions: newAppointment.instructions.split(',').filter(i => i.trim()) }]); 
                        setNewAppointment({ date: '', type: '', doctor: '', medication: '', instructions: '' }); 
                      }
                    }}
                  >{t('ivfClinic.add')}</CustomButton>
                </div>
              </div>
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
              {/* 输入区 */}
              <div className="grid grid-cols-6 border-t border-b border-[#C2A87A] bg-[#F7F3ED] items-center">
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.medication')} value={newMedication.name} onChange={e => setNewMedication({ ...newMedication, name: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.dosage')} value={newMedication.dosage} onChange={e => setNewMedication({ ...newMedication, dosage: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.frequency')} value={newMedication.frequency} onChange={e => setNewMedication({ ...newMedication, frequency: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.startDate')} value={newMedication.start} onChange={e => setNewMedication({ ...newMedication, start: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.notes')} value={newMedication.notes} onChange={e => setNewMedication({ ...newMedication, notes: e.target.value })} />
                <div className="flex items-center justify-center px-6 h-full">
                  <CustomButton 
                    className="w-1/2 flex items-center justify-center px-0 py-2 rounded-lg bg-[#B0BEB7] text-white font-bold text-lg shadow hover:bg-[#a3b1a8] transition cursor-pointer h-full mx-auto border-none" 
                    style={{display:'flex'}} 
                    onClick={() => { 
                      if (newMedication.name || newMedication.dosage || newMedication.frequency || newMedication.start || newMedication.notes) {
                        handleAdd('MedicationTracker', [...(medicationTrackerData || []), newMedication]); 
                        setNewMedication({ name: '', dosage: '', frequency: '', start: '', notes: '' }); 
                      }
                    }}
                  >{t('ivfClinic.add')}</CustomButton>
                </div>
              </div>
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
            
            {/* 新增 DoctorNotes 输入区域 */}
            <div className="w-full mt-2">
              <div className="grid grid-cols-4 border-t border-b border-[#C2A87A] bg-[#F7F3ED] items-center">
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.date')} value={newNote.date} onChange={e => setNewNote({ ...newNote, date: e.target.value })} />
                <input className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400" style={{boxShadow:'none'}} placeholder={t('ivfClinic.doctorName')} value={newNote.doctor} onChange={e => setNewNote({ ...newNote, doctor: e.target.value })} />
                <input
                  className="w-full border-0 border-b border-[#C2A87A] bg-[#F7F3ED] px-6 py-2 text-center focus:outline-none focus:border-[#C2A87A] focus:shadow-none placeholder:text-sage-400"
                  style={{boxShadow:'none'}}
                  placeholder={t('ivfClinic.noteContent')}
                  title={t('ivfClinic.noteContent')}
                  value={newNote.note}
                  onChange={e => setNewNote({ ...newNote, note: e.target.value })}
                  onMouseEnter={e => { e.currentTarget.setAttribute('title', t('ivfClinic.noteContent')); }}
                  onMouseLeave={e => { e.currentTarget.removeAttribute('title'); }}
                />
                <div className="flex items-center justify-center px-6 h-full">
                  <CustomButton 
                    className="w-1/2 flex items-center justify-center px-0 py-2 rounded-lg bg-[#B0BEB7] text-white font-bold text-lg shadow hover:bg-[#a3b1a8] transition cursor-pointer h-full mx-auto border-none" 
                    style={{display:'flex'}} 
                    onClick={() => { 
                      if (newNote.date || newNote.doctor || newNote.note) {
                        handleAdd('DoctorNotes', [...(doctorsNotesData || []), newNote]); 
                        setNewNote({ date: '', doctor: '', note: '' }); 
                      }
                    }}
                  >{t('ivfClinic.add')}</CustomButton>
                </div>
              </div>
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
