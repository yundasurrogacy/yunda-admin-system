'use client'
import React, { useState, Suspense } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import ManagerLayout from '@/components/manager-layout';
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
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('ivfClinic.title')}</h1>
      <p className="text-[#271F18] font-serif mb-8">{t('ivfClinic.description')}</p>
      {/* Clinic Overview 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-6">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none"
          onClick={() => setOpen(open === 'Clinic Overview' ? null : 'Clinic Overview')}
        >
          <span>{t('ivfClinic.clinicOverview')}</span>
          <span className="text-xs">{clinicOverview?.location || ''}</span>
          <span className={`ml-2 transition-transform ${open === 'Clinic Overview' ? 'rotate-90' : ''}`}>▼</span>
        </button>
        {open === 'Clinic Overview' && clinicOverview && !editingClinic && (
          <div className="px-6 py-4">
            <div 
              className="flex gap-6 group cursor-pointer relative"
              onMouseEnter={() => initEditData()}
              onClick={() => setEditingClinic(true)}
            >
              {/* 悬浮编辑提示 */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#C2A87A] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg z-10">
                {t('ivfClinic.editHint')}
              </div>
              
              {/* Doctor */}
              <div className="rounded-xl bg-white p-6 flex gap-4 items-start flex-1 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#E8F4F8] font-serif text-[#271F18] text-sm font-medium">{clinicOverview?.doctor?.name?.slice(0,2) || 'JD'}</AvatarFallback>
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
              <div className="rounded-xl bg-white p-6 flex gap-4 items-start flex-1 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#E8F4F8] font-serif text-[#271F18] text-sm font-medium">{clinicOverview?.coordinator?.name?.slice(0,2) || 'JD'}</AvatarFallback>
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
        {/* 编辑模式 */}
        {open === 'Clinic Overview' && clinicOverview && editingClinic && (
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-serif text-lg text-[#271F18] font-medium">{t('ivfClinic.editClinicOverview')}</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="px-4 py-2 text-sm"
                  onClick={handleCancelEdit}
                >
                  {t('ivfClinic.cancel')}
                </Button>
                <Button 
                  className="px-4 py-2 bg-[#C2A87A] text-white hover:bg-[#a88a5c] text-sm"
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? t('ivfClinic.saving') : t('ivfClinic.save')}
                </Button>
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
            
            {/* 诊所地址部分 */}
            <div className="mt-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.clinicAddress')}</h5>
                <input 
                  className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                  placeholder={t('ivfClinic.enterClinicAddress')}
                  value={formData.location || ''} 
                  onChange={e => setFormData({ ...formData, location: e.target.value })} 
                />
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                className="px-8 py-3 bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition rounded-lg font-medium" 
                onClick={() => handleAdd('ClinicOverview', formData)}
              >
                {t('ivfClinic.addClinicOverview')}
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Embryo Journey 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === 'Embryo Journey' ? null : 'Embryo Journey')}>
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
            )}

            {/* 新增胚胎旅程表单 - 始终显示 */}
            <div className="border-t border-[#E3E8E3] pt-6">
              <h4 className="font-serif mb-6 text-lg text-[#271F18] font-medium">
                {embryoJourneyData ? t('ivfClinic.continueAddEmbryoJourney') : t('ivfClinic.addEmbryoJourney')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左侧时间线新增 */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.addTimelineEvent')}</h5>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input 
                        className="border border-gray-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                        placeholder={t('ivfClinic.eventName')}
                        value={formData.timeline[0]?.label || ''} 
                        onChange={e => setFormData({ ...formData, timeline: [{ ...formData.timeline[0], label: e.target.value, date: formData.timeline[0]?.date || '' }] })} 
                      />
                      <input 
                        className="border border-gray-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                        placeholder={t('ivfClinic.eventDate')}
                        value={formData.timeline[0]?.date || ''} 
                        onChange={e => setFormData({ ...formData, timeline: [{ ...formData.timeline[0], date: e.target.value, label: formData.timeline[0]?.label || '' }] })} 
                      />
                    </div>
                    <Button 
                      className="w-full py-2 bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition rounded-lg" 
                      onClick={() => {
                        const newTimeline = { label: formData.timeline[0]?.label, date: formData.timeline[0]?.date };
                        if (newTimeline.label || newTimeline.date) {
                          // 获取当前所有有效数据（排除输入项）
                          const currentValidItems = formData.timeline.slice(1).filter((t: any) => t.label || t.date);
                          // 创建新的数组：空输入项 + 新添加项 + 已有有效项 
                          const updatedTimeline = [
                            { label: '', date: '' }, // 新的空输入项
                            newTimeline, // 刚添加的项
                            ...currentValidItems // 之前添加的项
                          ];
                          setFormData({ 
                            ...formData, 
                            timeline: updatedTimeline
                          });
                        }
                      }}
                    >
                      {t('ivfClinic.addToSubmission')}
                    </Button>
                    
                    {/* 显示本次要添加的时间线事件 */}
                    {formData.timeline?.slice(1).filter((t: any) => t.label || t.date).map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <span className="text-sm">{item.label} - {item.date}</span>
                        <button 
                          className="text-red-500 text-xs"
                          onClick={() => {
                            // 基于数据内容删除，而不是索引
                            const newTimeline = formData.timeline.filter(t => 
                              !(t.label === item.label && t.date === item.date)
                            );
                            setFormData({ ...formData, timeline: newTimeline });
                          }}
                        >
                          {t('ivfClinic.delete')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 右侧胚胎信息新增 */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.addEmbryoInfo')}</h5>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input 
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                        placeholder={t('ivfClinic.grade')}
                        value={formData.embryos[0]?.grade || ''} 
                        onChange={e => setFormData({ ...formData, embryos: [{ ...formData.embryos[0], grade: e.target.value, id: formData.embryos[0]?.id || '', status: formData.embryos[0]?.status || '' }] })} 
                      />
                      <input 
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                        placeholder={t('ivfClinic.id')}
                        value={formData.embryos[0]?.id || ''} 
                        onChange={e => setFormData({ ...formData, embryos: [{ ...formData.embryos[0], id: e.target.value, grade: formData.embryos[0]?.grade || '', status: formData.embryos[0]?.status || '' }] })} 
                      />
                      <input 
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                        placeholder={t('ivfClinic.status')}
                        value={formData.embryos[0]?.status || ''} 
                        onChange={e => setFormData({ ...formData, embryos: [{ ...formData.embryos[0], status: e.target.value, grade: formData.embryos[0]?.grade || '', id: formData.embryos[0]?.id || '' }] })} 
                      />
                    </div>
                    <Button 
                      className="w-full py-2 bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition rounded-lg" 
                      onClick={() => {
                        const newEmbryo = { grade: formData.embryos[0]?.grade, id: formData.embryos[0]?.id, status: formData.embryos[0]?.status };
                        if (newEmbryo.grade || newEmbryo.id || newEmbryo.status) {
                          // 获取当前所有有效数据（排除输入项）
                          const currentValidItems = formData.embryos.slice(1).filter((e: any) => e.grade || e.id || e.status);
                          // 创建新的数组：空输入项 + 新添加项 + 已有有效项
                          const updatedEmbryos = [
                            { grade: '', id: '', status: '' }, // 新的空输入项
                            newEmbryo, // 刚添加的项
                            ...currentValidItems // 之前添加的项
                          ];
                          setFormData({ 
                            ...formData, 
                            embryos: updatedEmbryos
                          });
                        }
                      }}
                    >
                      {t('ivfClinic.addToSubmission')}
                    </Button>
                    
                    {/* 显示本次要添加的胚胎信息 */}
                    {formData.embryos?.slice(1).filter((e: any) => e.grade || e.id || e.status).map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <span className="text-sm">{item.grade} - {item.id} - {item.status}</span>
                        <button 
                          className="text-red-500 text-xs"
                          onClick={() => {
                            // 基于数据内容删除，而不是索引
                            const newEmbryos = formData.embryos.filter(e => 
                              !(e.grade === item.grade && e.id === item.id && e.status === item.status)
                            );
                            setFormData({ ...formData, embryos: newEmbryos });
                          }}
                        >
                          {t('ivfClinic.delete')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  className="px-8 py-3 bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition rounded-lg font-medium" 
                  onClick={() => {
                    // 获取待提交的数据（排除第一个输入项）
                    const newTimelineData = formData.timeline.slice(1).filter((t: any) => t.label || t.date);
                    const newEmbryosData = formData.embryos.slice(1).filter((e: any) => e.grade || e.id || e.status);
                    
                    if (newTimelineData.length > 0 || newEmbryosData.length > 0) {
                      const completeData = {
                        timeline: newTimelineData,
                        embryos: newEmbryosData
                      };
                      handleAdd('EmbryoJourney', completeData);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? t('ivfClinic.submitting') : (embryoJourneyData ? t('ivfClinic.addMoreEmbryoJourney') : t('ivfClinic.addEmbryoJourney'))}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Surrogate Appointments 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === 'Surrogate Appointments' ? null : 'Surrogate Appointments')}>
          <span>{t('ivfClinic.surrogateAppointments')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Appointments' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Surrogate Appointments' && (
          <div className="px-6 py-4">
            <table className="w-full text-[#271F18] font-serif">
              <thead>
                <tr className="border-b">
                  <th className="py-2">{t('ivfClinic.date')}</th>
                  <th>{t('ivfClinic.type')}</th>
                  <th>{t('ivfClinic.doctor')}</th>
                  <th>{t('ivfClinic.medication')}</th>
                  <th>{t('ivfClinic.instructions')}</th>
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
                    <td><Button className="rounded bg-[#D9D9D9] px-4 py-1 text-[#271F18] text-xs">{t('ivfClinic.view')}</Button></td>
                  </tr>
                ))}
                <tr className="bg-[#F7F3ED]">
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.date')} value={newAppointment.date} onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.type')} value={newAppointment.type} onChange={e => setNewAppointment({ ...newAppointment, type: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.doctor')} value={newAppointment.doctor} onChange={e => setNewAppointment({ ...newAppointment, doctor: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.medication')} value={newAppointment.medication} onChange={e => setNewAppointment({ ...newAppointment, medication: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.instructionsHint')} value={newAppointment.instructions} onChange={e => setNewAppointment({ ...newAppointment, instructions: e.target.value })} /></td>
                  <td><Button className="px-4 py-1 rounded bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition" onClick={() => { 
                    if (newAppointment.date || newAppointment.type || newAppointment.doctor || newAppointment.medication || newAppointment.instructions) {
                      handleAdd('SurrogateAppointments', [...(surrogateAppointmentsData || []), { ...newAppointment, instructions: newAppointment.instructions.split(',').filter(i => i.trim()) }]); 
                      setNewAppointment({ date: '', type: '', doctor: '', medication: '', instructions: '' }); 
                    }
                  }}>{t('ivfClinic.add')}</Button></td>
                </tr>
              </tbody>
            </table>

          </div>
        )}
      </div>
      {/* Medication Tracker 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === 'Medication Tracker' ? null : 'Medication Tracker')}>
          <span>{t('ivfClinic.medicationTracker')}</span>
          <span className={`text-xl transition-transform ${open === 'Medication Tracker' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === 'Medication Tracker' && (
          <div className="px-6 py-4">
            <table className="w-full text-[#271F18] font-serif mb-4">
              <thead>
                <tr className="border-b">
                  <th className="py-2">{t('ivfClinic.medication')}</th>
                  <th>{t('ivfClinic.dosage')}</th>
                  <th>{t('ivfClinic.frequency')}</th>
                  <th>{t('ivfClinic.startDate')}</th>
                  <th>{t('ivfClinic.notes')}</th>
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
                    <td><Button className="rounded bg-[#D9D9D9] px-4 py-1 text-[#271F18] text-xs">{t('ivfClinic.view')}</Button></td>
                  </tr>
                ))}
                <tr className="bg-[#F7F3ED]">
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.medication')} value={newMedication.name} onChange={e => setNewMedication({ ...newMedication, name: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.dosage')} value={newMedication.dosage} onChange={e => setNewMedication({ ...newMedication, dosage: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.frequency')} value={newMedication.frequency} onChange={e => setNewMedication({ ...newMedication, frequency: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.startDate')} value={newMedication.start} onChange={e => setNewMedication({ ...newMedication, start: e.target.value })} /></td>
                  <td><input className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.notes')} value={newMedication.notes} onChange={e => setNewMedication({ ...newMedication, notes: e.target.value })} /></td>
                  <td><Button className="px-4 py-1 rounded bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition" onClick={() => { 
                    if (newMedication.name || newMedication.dosage || newMedication.frequency || newMedication.start || newMedication.notes) {
                      handleAdd('MedicationTracker', [...(medicationTrackerData || []), newMedication]); 
                      setNewMedication({ name: '', dosage: '', frequency: '', start: '', notes: '' }); 
                    }
                  }}>{t('ivfClinic.add')}</Button></td>
                </tr>
              </tbody>
            </table>

          </div>
        )}
      </div>
      {/* Doctor's Notes 折叠卡片 */}
      <div className="rounded-xl bg-[#FBF0DA40] p-0 font-serif text-[#271F18] mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-serif border-b border-[#E3E8E3] focus:outline-none" onClick={() => setOpen(open === "Doctor's Notes" ? null : "Doctor's Notes")}> 
          <span>{t('ivfClinic.doctorsNotes')}</span>
          <span className={`text-xl transition-transform ${open === "Doctor's Notes" ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
        {open === "Doctor's Notes" && (
          <div className="px-6 py-4">
            {/* Doctor's Notes 卡片式展示 */}
            <div className="space-y-3 mb-6">
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
                    <Button className="ml-4 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#374151] px-3 py-1 text-xs rounded font-medium transition-colors">
                      {t('ivfClinic.view')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 新增 DoctorNotes 输入区域 */}
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-200">
              <h5 className="font-serif text-md font-medium text-[#271F18] mb-3">{t('ivfClinic.addNewNote')}</h5>
              <div className="flex items-center gap-3">
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                  placeholder={t('ivfClinic.date')}
                  value={newNote.date} 
                  onChange={e => setNewNote({ ...newNote, date: e.target.value })} 
                />
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                  placeholder={t('ivfClinic.doctorName')}
                  value={newNote.doctor} 
                  onChange={e => setNewNote({ ...newNote, doctor: e.target.value })} 
                />
                <input 
                  className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                  placeholder={t('ivfClinic.noteContent')}
                  value={newNote.note} 
                  onChange={e => setNewNote({ ...newNote, note: e.target.value })} 
                />
                <Button 
                  className="px-6 py-2 rounded-lg bg-[#C2A87A] text-white hover:bg-[#a88a5c] transition-colors font-medium whitespace-nowrap" 
                  onClick={() => { 
                    if (newNote.date || newNote.doctor || newNote.note) {
                      handleAdd('DoctorNotes', [...(doctorsNotesData || []), newNote]); 
                      setNewNote({ date: '', doctor: '', note: '' }); 
                    }
                  }}
                >
                  {t('ivfClinic.add')}
                </Button>
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
    <ManagerLayout>
      <Suspense fallback={<div className="p-8 min-h-screen">Loading...</div>}>
        <IVFClinicContent />
      </Suspense>
    </ManagerLayout>
  )
}
