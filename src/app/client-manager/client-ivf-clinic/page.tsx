'use client'
import React, { useState, Suspense, useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
  
  // 新增：表单验证状态
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [editingClinic, setEditingClinic] = useState(false);

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

  // 只在认证后才加载数据
  useEffect(() => {
    if (!isAuthenticated) return;
    
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
  }, [caseId, isAuthenticated]);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存派生数据，避免每次渲染都重新查找
  // 前4个板块使用 intended_parent 的数据
  const clinicOverview = useMemo(() => clinics.find(c => c.type === 'ClinicOverview' && c.about_role === 'intended_parent')?.data, [clinics]);
  const embryoJourneyData = useMemo(() => clinics.find(c => c.type === 'EmbryoJourney' && c.about_role === 'intended_parent')?.data, [clinics]);
  const testingReportsData = useMemo(() => clinics.find(c => c.type === 'TestingReports' && c.about_role === 'intended_parent')?.data, [clinics]);
  const treatmentPlanData = useMemo(() => clinics.find(c => c.type === 'TreatmentPlan' && c.about_role === 'intended_parent')?.data, [clinics]);
  const pgtResultsData = useMemo(() => clinics.find(c => c.type === 'PGTResults' && c.about_role === 'intended_parent')?.data, [clinics]);
  // 后4个板块使用 surrogate_mother 的数据
  const surrogateMedicalRecordsData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalRecords' && c.about_role === 'surrogate_mother')?.data, [clinics]);
  const surrogateScreeningData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalScreening' && c.about_role === 'surrogate_mother')?.data, [clinics]);
  const surrogateEarlyUSData = useMemo(() => clinics.find(c => c.type === 'SurrogatePregnancyConfirmation' && c.about_role === 'surrogate_mother')?.data, [clinics]);
  const prenatalDeliveryData = useMemo(() => clinics.find(c => c.type === 'SurrogatePrenatalDelivery' && c.about_role === 'surrogate_mother')?.data, [clinics]);

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
  }, [caseId, editData]);

  // 使用 useCallback 缓存取消编辑函数
  const handleCancelEdit = useCallback(() => {
    setEditingClinic(false);
    initEditData(); // 重置数据
  }, [initEditData]);

  // 使用 useCallback 缓存新增功能
  const handleAdd = useCallback(async (type: string, data: any) => {
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
    
    // 如果 update 返回 404（记录不存在），则尝试 create
    if (res.status === 404 && apiEndpoint === '/api/ivf-clinic-update') {
      console.log('Record not found, creating new record...');
      const createRes = await fetch('/api/ivf-clinic-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ivf_clinic: { type, data: mergedData, case_cases: caseId }, aboutRole }),
      });
      const createResult = await createRes.json();
      if (createResult.ivf_clinic || createRes.ok) {
        // 创建成功后重新拉取数据
        const [ip, gc] = await Promise.all([
          fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=intended_parent`).then(r=>r.json()),
          fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`).then(r=>r.json())
        ]);
        setClinics([...(ip?.ivf_clinics||[]), ...(gc?.ivf_clinics||[])]);
        console.log('Record created successfully');
      }
    } else if (result.ivf_clinic || res.ok) {
      // 成功后重新拉取接口数据，保证 clinics 最新
      const [ip, gc] = await Promise.all([
        fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=intended_parent`).then(r=>r.json()),
        fetch(`/api/ivf-clinic-get?caseId=${caseId}&aboutRole=surrogate_mother`).then(r=>r.json())
      ]);
      setClinics([...(ip?.ivf_clinics||[]), ...(gc?.ivf_clinics||[])]);
      console.log('Record updated successfully');
    } else {
      console.error('Failed to save record:', result);
    }
    
    // 重置表单数据
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
    setLoading(false);
  }, [caseId, clinics]);

  // 使用 useCallback 缓存删除功能
  const handleDelete = useCallback(async (type: string, index: number) => {
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
  }, [caseId]);

  // 使用 useCallback 缓存文件上传函数
  const uploadSingleFile = useCallback(async (file: File): Promise<string> => {
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
  }, []);

  // 使用 useCallback 缓存返回按钮处理函数
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // 使用 useCallback 缓存折叠面板切换函数
  const handleToggleSection = useCallback((section: string) => {
    setOpen(open === section ? null : section);
  }, [open]);

  // 使用 useCallback 缓存开启编辑函数
  const handleStartEdit = useCallback(() => {
    setEditingClinic(true);
    initEditData(); // 初始化编辑数据
  }, [initEditData]);

  // 使用 useCallback 缓存编辑数据变更函数
  const handleEditDataChange = useCallback((field: string, subfield: string, value: string) => {
    if (field === 'doctor' || field === 'coordinator') {
      setEditData(prev => ({ 
        ...prev, 
        [field]: { ...prev[field], [subfield]: value } 
      }));
    } else {
      setEditData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  // 使用 useCallback 缓存表单数据变更函数
  const handleFormDataChange = useCallback((field: string, subfield: string, value: string) => {
    if (field === 'doctor' || field === 'coordinator') {
      setFormData(prev => ({ 
        ...prev, 
        [field]: { ...prev[field], [subfield]: value } 
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  // 使用 useCallback 缓存测试报告变更函数
  const handleTestingReportChange = useCallback((field: string, value: string) => {
    setNewTestingReport(prev => ({ ...prev, [field]: value }));
  }, []);

  // 使用 useCallback 缓存PGT记录变更函数
  const handlePGTRecordChange = useCallback((field: string, value: string) => {
    setNewPGTRecord(prev => ({ ...prev, [field]: value }));
  }, []);

  // 使用 useCallback 缓存代母医疗记录变更函数
  const handleSurrogateMedicalRecordChange = useCallback((field: string, value: string) => {
    setNewSurrogateMedicalRecord(prev => ({ ...prev, [field]: value }));
    // 清除相关错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  // 使用 useCallback 缓存代母筛查变更函数
  const handleSurrogateScreeningChange = useCallback((field: string, value: string) => {
    setNewSurrogateScreening(prev => ({ ...prev, [field]: value }));
    // 清除相关错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  // 使用 useCallback 缓存代母早期B超变更函数
  const handleSurrogateEarlyUSChange = useCallback((field: string, value: string) => {
    setNewSurrogateEarlyUS(prev => ({ ...prev, [field]: value }));
    // 清除相关错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  // 使用 useCallback 缓存生产看板变更函数
  const handleDeliveryBoardChange = useCallback((field: string, value: string) => {
    setDeliveryBoard(prev => ({ ...prev, [field]: value }));
  }, []);

  // 使用 useCallback 缓存产检记录变更函数
  const handlePrenatalRecordChange = useCallback((field: string, value: string) => {
    setNewPrenatalRecord(prev => ({ ...prev, [field]: value }));
    // 清除相关错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  // 使用 useCallback 缓存Timeline添加值变更函数
  const handleTimelineAddValueChange = useCallback((field: string, value: string) => {
    setTimelineAddValue(prev => ({ ...prev, [field]: value }));
  }, []);

  // 使用 useCallback 缓存胚胎添加值变更函数
  const handleEmbryoAddValueChange = useCallback((field: string, value: string) => {
    setEmbryoAddValue(prev => ({ ...prev, [field]: value }));
  }, []);

  // 表单验证函数
  const validateForm = useCallback((type: string, data: any) => {
    const errors: Record<string, string> = {};
    
    switch (type) {
      case 'TestingReports':
        if (!data.category?.trim()) errors.category = '报告名称不能为空';
        if (!data.reportDate) errors.reportDate = '报告时间不能为空';
        break;
      case 'SurrogateMedicalRecords':
        if (!data.date) errors.date = '时间不能为空';
        if (!data.category?.trim()) errors.category = '类别不能为空';
        break;
      case 'SurrogateMedicalScreening':
        if (!data.date) errors.date = '时间不能为空';
        if (!data.name?.trim()) errors.name = '名称不能为空';
        break;
      case 'SurrogatePregnancyConfirmation':
        if (!data.date) errors.date = '时间不能为空';
        if (!data.name?.trim()) errors.name = '名称不能为空';
        break;
      case 'SurrogatePrenatalDelivery':
        if (!data.status?.trim()) errors.status = '状态不能为空';
        if (!data.date) errors.date = '时间不能为空';
        if (!data.name?.trim()) errors.name = '名称不能为空';
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

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
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-main-bg">
      <div className="max-w-7xl mx-auto">
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
        <h1 className="text-2xl sm:text-3xl font-semibold text-sage-800 mb-2">{t('ivfClinic.title')}</h1>
        <p className="text-sage-800 mb-8 font-medium text-sm sm:text-base">{t('ivfClinic.description')}</p>
        
        {/* 全局加载状态 */}
        {/* {loading && (
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 z-50">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#C2A87A]"></div>
            <span className="text-sm text-sage-700">处理中...</span>
          </div>
        )} */}
      {/* Clinic Overview 折叠卡片 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-6">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer"
          style={{cursor:'pointer'}}
          onClick={() => handleToggleSection('Clinic Overview')}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Doctor */}
              <div className="bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-start hover:shadow-md transition-shadow cursor-pointer" onClick={handleStartEdit}>
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#D9D9D9] text-[#271F18] text-lg font-medium">{clinicOverview?.doctor?.name?.slice(0,2) || 'JD'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold text-[#271F18] mb-1 truncate">{clinicOverview?.doctor?.name}</div>
                  <div className="text-sm text-sage-600 mb-1">{clinicOverview?.doctor?.role}</div>
                  <div className="text-sm text-sage-800 mb-1 break-all">{clinicOverview?.doctor?.email}</div>
                  <div className="text-sm text-sage-800 mb-1">{clinicOverview?.doctor?.phone}</div>
                  <div className="text-sm text-sage-800 leading-relaxed">{clinicOverview?.doctor?.desc}</div>
                </div>
              </div>
              {/* Coordinator */}
              <div className="bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-start hover:shadow-md transition-shadow cursor-pointer" onClick={handleStartEdit}>
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-[#D9D9D9] text-[#271F18] text-lg font-medium">{clinicOverview?.coordinator?.name?.slice(0,2) || 'JD'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold text-[#271F18] mb-1 truncate">{clinicOverview?.coordinator?.name}</div>
                  <div className="text-sm text-sage-600 mb-1">{clinicOverview?.coordinator?.role}</div>
                  <div className="text-sm text-sage-800 mb-1 break-all">{clinicOverview?.coordinator?.email}</div>
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
                    onChange={e => handleEditDataChange('doctor', 'name', e.target.value)} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.doctorRole')}
                    value={editData.doctor.role} 
                    onChange={e => handleEditDataChange('doctor', 'role', e.target.value)} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.doctorEmail')}
                    value={editData.doctor.email} 
                    onChange={e => handleEditDataChange('doctor', 'email', e.target.value)} 
                  />
                  <input 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" 
                    placeholder={t('ivfClinic.doctorPhone')}
                    value={editData.doctor.phone} 
                    onChange={e => handleEditDataChange('doctor', 'phone', e.target.value)} 
                  />
                  <textarea 
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent resize-none" 
                    placeholder={t('ivfClinic.doctorDesc')}
                    rows={3} 
                    value={editData.doctor.desc} 
                    onChange={e => handleEditDataChange('doctor', 'desc', e.target.value)} 
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
                  onChange={e => handleEditDataChange('location', '', e.target.value)} 
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
                  onChange={e => handleFormDataChange('location', '', e.target.value)} 
                />
              </div>
            </div>
            {/* 医生和协调员信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 医生信息部分 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h5 className="font-serif mb-4 text-md text-[#271F18] font-medium">{t('ivfClinic.doctorInfo')}</h5>
                <div className="space-y-3">
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorName')} value={formData.doctor.name} onChange={e => handleFormDataChange('doctor', 'name', e.target.value)} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorRole')} value={formData.doctor.role} onChange={e => handleFormDataChange('doctor', 'role', e.target.value)} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorEmail')} value={formData.doctor.email} onChange={e => handleFormDataChange('doctor', 'email', e.target.value)} />
                  <input className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent" placeholder={t('ivfClinic.doctorPhone')} value={formData.doctor.phone} onChange={e => handleFormDataChange('doctor', 'phone', e.target.value)} />
                  <textarea className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent resize-none" placeholder={t('ivfClinic.doctorDesc')} rows={3} value={formData.doctor.desc} onChange={e => handleFormDataChange('doctor', 'desc', e.target.value)}></textarea>
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
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-6 shadow-sm">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer hover:bg-sage-50 transition-colors" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Testing Reports')}>
          <span>{t('ivfClinic.testingReports', '检测报告')}</span>
          <span className={`text-xl transition-transform duration-200 ${open === 'Testing Reports' ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {open === 'Testing Reports' && (
          <div className="px-6 py-4">
            {/* 列表 */}
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full text-sage-800 min-w-[800px]">
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
                        {r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <CustomButton className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" onClick={() => handleDelete('TestingReports', i)}>{t('ivfClinic.delete','删除')}</CustomButton>
                      </td>
                    </tr>
                  ))}
                  {/* 新增行 */}
                  <tr className="bg-gray-50">
                    <td className="py-3 px-6">
                      <div>
                        <input 
                          className={`border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] ${formErrors.category ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder={t('ivfClinic.reportName','报告名称/类别')} 
                          value={newTestingReport.category} 
                          onChange={e=>handleTestingReportChange('category', e.target.value)} 
                        />
                        {formErrors.category && <div className="text-red-500 text-xs mt-1">{formErrors.category}</div>}
                      </div>
                    </td>
                     <td className="py-3 px-6">
                       <div>
                         <input 
                           type="date" 
                           className={`border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] ${formErrors.reportDate ? 'border-red-500' : 'border-gray-200'}`}
                           value={newTestingReport.reportDate} 
                           onChange={e=>handleTestingReportChange('reportDate', e.target.value)} 
                         />
                         {formErrors.reportDate && <div className="text-red-500 text-xs mt-1">{formErrors.reportDate}</div>}
                       </div>
                     </td>
                     <td className="py-3 px-6">
                       <input 
                         type="date" 
                         className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" 
                         value={newTestingReport.expiryDate} 
                         onChange={e=>handleTestingReportChange('expiryDate', e.target.value)} 
                       />
                     </td>
                     <td className="py-3 px-6">
                       <input 
                         type="date" 
                         className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" 
                         value={newTestingReport.clinicReviewedAt} 
                         onChange={e=>handleTestingReportChange('clinicReviewedAt', e.target.value)} 
                       />
                     </td>
                    <td className="py-3 px-6">
                      <input 
                        className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" 
                        placeholder={t('ivfClinic.remark','备注')} 
                        value={newTestingReport.remark} 
                        onChange={e=>handleTestingReportChange('remark', e.target.value)} 
                      />
                    </td>
                    <td className="py-3 px-6">
                      <div className="space-y-2">
                        <FileUpload
                          fileUrl={newTestingReport.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadSingleFile(file);
                          setNewTestingReport(prev => ({ ...prev, fileUrl: url }));
                          }}
                        />
                        <div className="flex gap-2">
                          <CustomButton 
                            className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded hover:bg-[#a88a5c] transition-colors cursor-pointer" 
                            onClick={() => {
                          const list = Array.isArray(testingReportsData) ? testingReportsData : [];
                              if (validateForm('TestingReports', newTestingReport)) {
                            handleAdd('TestingReports', [...list, newTestingReport]);
                            setNewTestingReport({ category: '', reportDate: '', expiryDate: '', clinicReviewedAt: '', remark: '', fileUrl: '' });
                                setFormErrors({});
                              }
                            }}
                          >
                            {t('ivfClinic.add','新增')}
                          </CustomButton>
                          <CustomButton 
                            className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer" 
                            onClick={() => {
                              setNewTestingReport({ category: '', reportDate: '', expiryDate: '', clinicReviewedAt: '', remark: '', fileUrl: '' });
                              setFormErrors({});
                            }}
                          >
                            {t('ivfClinic.cancel','取消')}
                          </CustomButton>
                        </div>
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
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-6 shadow-sm">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer hover:bg-sage-50 transition-colors" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Treatment Plan')}>
          <span>{t('ivfClinic.treatmentPlan','治疗方案与时间表')}</span>
          <span className={`text-xl transition-transform duration-200 ${open === 'Treatment Plan' ? 'rotate-90' : ''}`}>▶</span>
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
                <FileUpload
                  fileUrl={treatmentTimelineImageUrl}
                  onChange={async (file) => {
                  setIsUploadingTimeline(true);
                    const url = await uploadSingleFile(file);
                  setIsUploadingTimeline(false);
                  setTreatmentTimelineImageUrl(url);
                  }}
                  accept="image/*"
                />
                <CustomButton 
                  disabled={isUploadingTimeline || !treatmentTimelineImageUrl} 
                  className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" 
                  onClick={() => {
                  const dataToSave = { timelineImageUrl: treatmentTimelineImageUrl };
                  handleAdd('TreatmentPlan', dataToSave);
                  setTreatmentTimelineImageUrl('');
                  }}
                >
                  {isUploadingTimeline ? t('ivfClinic.uploading','上传中...') : t('ivfClinic.save','保存')}
                </CustomButton>
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
                      <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.subjectType','类型（卵子/胚胎）')} value={newPGTRecord.subjectType} onChange={e=>handlePGTRecordChange('subjectType', e.target.value)} /></td>
                      <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.count','数量')} value={newPGTRecord.count} onChange={e=>handlePGTRecordChange('count', e.target.value)} /></td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果（简述）')} value={newPGTRecord.result} onChange={e=>handlePGTRecordChange('result', e.target.value)} />
                          <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
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
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-6 shadow-sm">
  <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer hover:bg-sage-50 transition-colors" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Embryo Journey')}>
          <span>{t('ivfClinic.embryoJourney')}</span>
          <span className={`text-xl transition-transform duration-200 ${open === 'Embryo Journey' ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {open === 'Embryo Journey' && (
          <div className="px-6 py-4">
            {/* 显示已有的 Embryo Journey 数据或空状态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 左侧时间线展示 */}
              <div className="relative">
                <h3 className="text-lg font-semibold mb-4 text-sage-800">{t('ivfClinic.timeline')}</h3>
                {embryoJourneyData?.timeline && embryoJourneyData.timeline.length > 0 ? (
                  <div className="relative pl-8">
                    {/* 竖线 */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-[#C2A87A]"></div>
                    {embryoJourneyData.timeline.map((item: any, i: number) => (
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
                                onChange={e => handleTimelineAddValueChange('label', e.target.value)}
                              />
                              <input
                                className="border border-gray-200 rounded-lg px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                placeholder={t('ivfClinic.eventDate')}
                                value={timelineAddValue.date}
                                onChange={e => handleTimelineAddValueChange('date', e.target.value)}
                              />
                                <CustomButton
                                  className="px-3 py-1 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] text-xs rounded transition cursor-pointer"
                                  onClick={async () => {
                                    if (timelineAddValue.label || timelineAddValue.date) {
                                      await handleAdd('EmbryoJourney', { timeline: [timelineAddValue], embryos: [] });
                                      setTimelineAddValue({ label: '', date: '' });
                                      setTimelineAddIndex(null);
                                    }
                                  }}
                                >{t('ivfClinic.save')}</CustomButton>
                                <CustomButton
                                  className="px-3 py-1 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] text-xs rounded transition cursor-pointer"
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
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-sage-600 mb-4">{t('ivfClinic.noTimelineData', '暂无时间线数据')}</p>
                    {timelineAddIndex === -1 ? (
                      <div className="flex gap-2 items-center justify-center">
                        <input
                          className="border border-gray-200 rounded-lg px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                          placeholder={t('ivfClinic.eventName')}
                          value={timelineAddValue.label}
                          onChange={e => handleTimelineAddValueChange('label', e.target.value)}
                        />
                        <input
                          className="border border-gray-200 rounded-lg px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                          placeholder={t('ivfClinic.eventDate')}
                          value={timelineAddValue.date}
                          onChange={e => handleTimelineAddValueChange('date', e.target.value)}
                        />
                        <CustomButton
                          className="px-3 py-1 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] text-xs rounded transition cursor-pointer"
                          onClick={async () => {
                            if (timelineAddValue.label || timelineAddValue.date) {
                              await handleAdd('EmbryoJourney', { timeline: [timelineAddValue], embryos: [] });
                              setTimelineAddValue({ label: '', date: '' });
                              setTimelineAddIndex(null);
                            }
                          }}
                        >{t('ivfClinic.save')}</CustomButton>
                        <CustomButton
                          className="px-3 py-1 bg-transparent text-[#C2A87A] hover:bg-[#C2A87A] hover:text-white border border-[#C2A87A] text-xs rounded transition cursor-pointer"
                          onClick={() => {
                            setTimelineAddValue({ label: '', date: '' });
                            setTimelineAddIndex(null);
                          }}
                        >{t('ivfClinic.cancel')}</CustomButton>
                      </div>
                    ) : (
                      <CustomButton
                        className="px-4 py-2 bg-[#C2A87A] text-white rounded-lg cursor-pointer hover:bg-[#a88a5c] transition-colors"
                        onClick={() => {
                          setTimelineAddIndex(-1);
                          setTimelineAddValue({ label: '', date: '' });
                        }}
                      >
                        {t('ivfClinic.addFirstTimeline', '添加第一个时间线事件')}
                      </CustomButton>
                    )}
                  </div>
                )}
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
                      {embryoJourneyData?.embryos && embryoJourneyData.embryos.length > 0 ? (
                        embryoJourneyData.embryos.map((e: any, i: number) => (
                          <tr key={i} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-3 px-6 text-base font-medium">{e.grade}</td>
                            <td className="py-3 px-6 text-base font-medium">{e.id}</td>
                            <td className="py-3 px-6 text-base font-medium">{e.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-sage-600">
                            {t('ivfClinic.noEmbryoData', '暂无胚胎数据')}
                          </td>
                        </tr>
                      )}
                      {/* 表格最后一行下方加号和输入区，左对齐 */}
                      <tr>
                        <td colSpan={3} className="pt-2 pb-4 px-6">
                          {embryoAddActive ? (
                            <div className="flex gap-2 items-center">
                              <input
                                className="border border-gray-200 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                placeholder={t('ivfClinic.grade')}
                                value={embryoAddValue.grade}
                                onChange={e => handleEmbryoAddValueChange('grade', e.target.value)}
                              />
                              <input
                                className="border border-gray-200 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                placeholder={t('ivfClinic.id')}
                                value={embryoAddValue.id}
                                onChange={e => handleEmbryoAddValueChange('id', e.target.value)}
                              />
                              <input
                                className="border border-gray-200 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent"
                                placeholder={t('ivfClinic.status')}
                                value={embryoAddValue.status}
                                onChange={e => handleEmbryoAddValueChange('status', e.target.value)}
                              />
                              <CustomButton
                                className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors"
                                onClick={async () => {
                                  if (embryoAddValue.grade || embryoAddValue.id || embryoAddValue.status) {
                                    await handleAdd('EmbryoJourney', { timeline: [], embryos: [embryoAddValue] });
                                    setEmbryoAddValue({ grade: '', id: '', status: '' });
                                    setEmbryoAddActive(false);
                                  }
                                }}
                              >{t('ivfClinic.save')}</CustomButton>
                              <CustomButton
                                className="px-3 py-1 text-xs rounded cursor-pointer hover:bg-gray-50 transition-colors"
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

            {/* 新增胚胎旅程表单 - 左右分区独立添加 */}
            {/* 已移除右侧批量新增区域，交互已集成到表格下方加号 */}
          </div>
        )}
      </div>
      {/* 代母医疗记录与心理评估 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-6 shadow-sm">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer hover:bg-sage-50 transition-colors" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Medical Records')}>
          <span>{t('ivfClinic.surrogateMedicalRecords','代母医疗记录与心理评估')}</span>
          <span className={`text-xl transition-transform duration-200 ${open === 'Surrogate Medical Records' ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {open === 'Surrogate Medical Records' && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full text-sage-800 min-w-[600px]">
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
                      <td className="py-3 px-6 text-right"><CustomButton className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" onClick={() => handleDelete('SurrogateMedicalRecords', i)}>{t('ivfClinic.delete','删除')}</CustomButton></td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                     <td className="py-3 px-6">
                       <div>
                         <input 
                           type="date" 
                           className={`border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] transition-colors ${formErrors.date ? 'border-red-500' : 'border-gray-200'}`}
                           value={newSurrogateMedicalRecord.date} 
                           onChange={e=>handleSurrogateMedicalRecordChange('date', e.target.value)} 
                         />
                         {formErrors.date && <div className="text-red-500 text-xs mt-1">{formErrors.date}</div>}
                       </div>
                     </td>
                    <td className="py-3 px-6">
                      <div>
                        <input 
                          className={`border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] transition-colors ${formErrors.category ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder={t('ivfClinic.category','类别')} 
                          value={newSurrogateMedicalRecord.category} 
                          onChange={e=>handleSurrogateMedicalRecordChange('category', e.target.value)} 
                        />
                        {formErrors.category && <div className="text-red-500 text-xs mt-1">{formErrors.category}</div>}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <input 
                        className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] transition-colors" 
                        placeholder={t('ivfClinic.summary','简述')} 
                        value={newSurrogateMedicalRecord.summary} 
                        onChange={e=>handleSurrogateMedicalRecordChange('summary', e.target.value)} 
                      />
                    </td>
                    <td className="py-3 px-6">
                      <div className="space-y-2">
                        <FileUpload
                          fileUrl={newSurrogateMedicalRecord.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadSingleFile(file);
                            setNewSurrogateMedicalRecord(prev => ({ ...prev, fileUrl: url }));
                          }}
                        />
                        <div className="flex gap-2">
                          <CustomButton 
                            className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded hover:bg-[#a88a5c] transition-colors cursor-pointer" 
                            onClick={() => {
                          const list = Array.isArray(surrogateMedicalRecordsData) ? surrogateMedicalRecordsData : [];
                              if (validateForm('SurrogateMedicalRecords', newSurrogateMedicalRecord)) {
                            handleAdd('SurrogateMedicalRecords', [...list, newSurrogateMedicalRecord]);
                            setNewSurrogateMedicalRecord({ date: '', category: '', summary: '', fileUrl: '' });
                                setFormErrors({});
                              }
                            }}
                          >
                            {t('ivfClinic.add','新增')}
                          </CustomButton>
                          <CustomButton 
                            className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer" 
                            onClick={() => {
                              setNewSurrogateMedicalRecord({ date: '', category: '', summary: '', fileUrl: '' });
                              setFormErrors({});
                            }}
                          >
                            {t('ivfClinic.cancel','取消')}
                          </CustomButton>
                        </div>
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
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-6 shadow-sm">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer hover:bg-sage-50 transition-colors" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Screening')}>
          <span>{t('ivfClinic.surrogateScreening','代母医学筛查')}</span>
          <span className={`text-xl transition-transform duration-200 ${open === 'Surrogate Screening' ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {open === 'Surrogate Screening' && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full text-sage-800 min-w-[700px]">
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
                      <td className="py-3 px-6 text-right"><CustomButton className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" onClick={() => handleDelete('SurrogateMedicalScreening', i)}>{t('ivfClinic.delete','删除')}</CustomButton></td>
                    </tr>
                  ))}
                  <tr>
                     <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" value={newSurrogateScreening.date} onChange={e=>handleSurrogateScreeningChange('date', e.target.value)} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateScreening.category} onChange={e=>handleSurrogateScreeningChange('category', e.target.value)} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称')} value={newSurrogateScreening.name} onChange={e=>handleSurrogateScreeningChange('name', e.target.value)} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果')} value={newSurrogateScreening.result} onChange={e=>handleSurrogateScreeningChange('result', e.target.value)} /></td>
                    <td className="py-3 px-6">
                      <div className="space-y-2">
                        <FileUpload
                          fileUrl={newSurrogateScreening.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadSingleFile(file);
                            setNewSurrogateScreening(prev => ({ ...prev, fileUrl: url }));
                          }}
                        />
                        <div className="flex gap-2">
                          <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
                          const list = Array.isArray(surrogateScreeningData) ? surrogateScreeningData : [];
                          if (newSurrogateScreening.date || newSurrogateScreening.name || newSurrogateScreening.fileUrl) {
                            handleAdd('SurrogateMedicalScreening', [...list, newSurrogateScreening]);
                            setNewSurrogateScreening({ date: '', category: '', name: '', result: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                          <CustomButton className="px-3 py-1 text-xs rounded cursor-pointer border border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => setNewSurrogateScreening({ date: '', category: '', name: '', result: '', fileUrl: '' })}>{t('ivfClinic.cancel','取消')}</CustomButton>
                        </div>
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
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-6 shadow-sm">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer hover:bg-sage-50 transition-colors" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Early Ultrasound')}>
          <span>{t('ivfClinic.surrogateEarlyUS','代母怀孕确认与早期B超')}</span>
          <span className={`text-xl transition-transform duration-200 ${open === 'Surrogate Early Ultrasound' ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {open === 'Surrogate Early Ultrasound' && (
          <div className="px-6 py-4">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full text-sage-800 min-w-[700px]">
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
                      <td className="py-3 px-6 text-right"><CustomButton className="text-red-500 text-sm hover:text-red-700 cursor-pointer transition-colors" onClick={() => handleDelete('SurrogatePregnancyConfirmation', i)}>{t('ivfClinic.delete','删除')}</CustomButton></td>
                    </tr>
                  ))}
                  <tr>
                     <td className="py-3 px-6"><input type="date" className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" value={newSurrogateEarlyUS.date} onChange={e=>handleSurrogateEarlyUSChange('date', e.target.value)} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.category','类别')} value={newSurrogateEarlyUS.category} onChange={e=>handleSurrogateEarlyUSChange('category', e.target.value)} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.name','名称（第X周）')} value={newSurrogateEarlyUS.name} onChange={e=>handleSurrogateEarlyUSChange('name', e.target.value)} /></td>
                    <td className="py-3 px-6"><input className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A]" placeholder={t('ivfClinic.result','结果（一句话）')} value={newSurrogateEarlyUS.result} onChange={e=>handleSurrogateEarlyUSChange('result', e.target.value)} /></td>
                    <td className="py-3 px-6">
                      <div className="space-y-2">
                        <FileUpload
                          fileUrl={newSurrogateEarlyUS.fileUrl}
                          onChange={async (file) => {
                            const url = await uploadSingleFile(file);
                            setNewSurrogateEarlyUS(prev => ({ ...prev, fileUrl: url }));
                          }}
                        />
                        <div className="flex gap-2">
                          <CustomButton className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded cursor-pointer hover:bg-[#a88a5c] transition-colors" onClick={() => {
                          const list = Array.isArray(surrogateEarlyUSData) ? surrogateEarlyUSData : [];
                          if (newSurrogateEarlyUS.date || newSurrogateEarlyUS.name || newSurrogateEarlyUS.fileUrl) {
                            handleAdd('SurrogatePregnancyConfirmation', [...list, newSurrogateEarlyUS]);
                            setNewSurrogateEarlyUS({ date: '', category: '', name: '', result: '', fileUrl: '' });
                          }
                        }}>{t('ivfClinic.add','新增')}</CustomButton>
                          <CustomButton className="px-3 py-1 text-xs rounded cursor-pointer border border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => setNewSurrogateEarlyUS({ date: '', category: '', name: '', result: '', fileUrl: '' })}>{t('ivfClinic.cancel','取消')}</CustomButton>
                        </div>
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
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-8 shadow-sm">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer hover:bg-sage-50 transition-colors" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Prenatal & Delivery')}>
          <span>{t('ivfClinic.surrogatePrenatalDelivery','代母产检与生产安排')}</span>
          <span className={`text-xl transition-transform duration-200 ${open === 'Surrogate Prenatal & Delivery' ? 'rotate-90' : ''}`}>▶</span>
        </button>
        {open === 'Surrogate Prenatal & Delivery' && (
          <div className="px-6 py-4 space-y-6">
            {/* 看板 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* OB Hospital and Doctor */}
              <div className="bg-gradient-to-br from-[#F5F4ED] to-[#F0F0E8] rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-sage-800 mb-4">{t('ivfClinic.obHospital','生产医院')}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">{t('ivfClinic.obHospital','生产医院')}</label>
                    <input 
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent transition-colors" 
                      placeholder={t('ivfClinic.obHospital','生产医院')} 
                      value={deliveryBoard.obHospital} 
                      onChange={e=>handleDeliveryBoardChange('obHospital', e.target.value)} 
                    />
              </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">{t('ivfClinic.obDoctor','生产医生')}</label>
                    <input 
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent transition-colors" 
                      placeholder={t('ivfClinic.obDoctor','生产医生')} 
                      value={deliveryBoard.obDoctor} 
                      onChange={e=>handleDeliveryBoardChange('obDoctor', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              {/* PBO Progress */}
              <div className="lg:col-span-2 bg-gradient-to-br from-[#F5F4ED] to-[#F0F0E8] rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-sage-800 mb-4">{t('ivfClinic.pboProgress','PBO进程')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">{t('ivfClinic.status','状态')}</label>
                    <select 
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent transition-colors" 
                      value={deliveryBoard.pboStatus} 
                      onChange={e=>handleDeliveryBoardChange('pboStatus', e.target.value)}
                    >
                    <option value="">{t('ivfClinic.select','请选择')}</option>
                    <option value="draft">{t('ivfClinic.pboDraft','已起草')}</option>
                    <option value="submitted">{t('ivfClinic.pboSubmitted','已递交')}</option>
                    <option value="completed">{t('ivfClinic.pboCompleted','已完成')}</option>
                  </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">{t('ivfClinic.file','文件')}</label>
                    <FileUpload
                      fileUrl={deliveryBoard.pboFileUrl}
                      onChange={async (file) => {
                        const url = await uploadSingleFile(file);
                        handleDeliveryBoardChange('pboFileUrl', url);
                      }}
                    />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">{t('ivfClinic.remark','备注')}</label>
                    <input 
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] focus:border-transparent transition-colors" 
                      placeholder={t('ivfClinic.remark','备注')} 
                      value={deliveryBoard.pboRemark} 
                      onChange={e=>handleDeliveryBoardChange('pboRemark', e.target.value)} 
                    />
              </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <CustomButton 
                    className="px-4 py-2 bg-[#C2A87A] text-white text-sm rounded-lg hover:bg-[#a88a5c] transition-colors shadow-sm" 
                    onClick={() => {
                    const toSave = { board: deliveryBoard, records: Array.isArray(prenatalDeliveryData?.records) ? prenatalDeliveryData.records : [] };
                    handleAdd('SurrogatePrenatalDelivery', toSave);
                    }}
                  >
                    {t('ivfClinic.save','保存')}
                  </CustomButton>
                </div>
              </div>
            </div>
            {/* 产检与生产记录列表 */}
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full text-sage-800 min-w-[700px]">
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
                          className="text-red-500 text-sm hover:text-red-700 transition-colors" 
                          onClick={() => handleDelete('SurrogatePrenatalDelivery', i)}
                        >
                          {t('ivfClinic.delete','删除')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="py-3 px-6">
                      <div>
                        <select 
                          className={`border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] transition-colors ${formErrors.status ? 'border-red-500' : 'border-gray-200'}`}
                          value={newPrenatalRecord.status} 
                          onChange={e=>handlePrenatalRecordChange('status', e.target.value)}
                        >
                        <option value="">{t('ivfClinic.select','请选择')}</option>
                        <option value="scheduled">{t('ivfClinic.scheduled','已预约')}</option>
                        <option value="done">{t('ivfClinic.completed','已完成')}</option>
                      </select>
                        {formErrors.status && <div className="text-red-500 text-xs mt-1">{formErrors.status}</div>}
                      </div>
                    </td>
                     <td className="py-3 px-6">
                       <div>
                         <input 
                           type="date" 
                           className={`border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] transition-colors ${formErrors.date ? 'border-red-500' : 'border-gray-200'}`}
                           value={newPrenatalRecord.date} 
                           onChange={e=>handlePrenatalRecordChange('date', e.target.value)} 
                         />
                         {formErrors.date && <div className="text-red-500 text-xs mt-1">{formErrors.date}</div>}
                       </div>
                     </td>
                    <td className="py-3 px-6">
                      <div>
                        <input 
                          className={`border rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] transition-colors ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder={t('ivfClinic.name','名称（如：第10周产检）')} 
                          value={newPrenatalRecord.name} 
                          onChange={e=>handlePrenatalRecordChange('name', e.target.value)} 
                        />
                        {formErrors.name && <div className="text-red-500 text-xs mt-1">{formErrors.name}</div>}
                      </div>
                    </td>
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
                      <div className="space-y-2">
                        <input 
                          className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#C2A87A] transition-colors" 
                          placeholder={t('ivfClinic.remark','备注')} 
                          value={newPrenatalRecord.remark} 
                          onChange={e=>handlePrenatalRecordChange('remark', e.target.value)} 
                        />
                        <div className="flex gap-2">
                          <CustomButton 
                            className="px-3 py-1 bg-[#C2A87A] text-white text-xs rounded hover:bg-[#a88a5c] transition-colors" 
                            onClick={() => {
                          const board = prenatalDeliveryData?.board || deliveryBoard;
                          const records = Array.isArray(prenatalDeliveryData?.records) ? prenatalDeliveryData.records : [];
                              if (validateForm('SurrogatePrenatalDelivery', newPrenatalRecord)) {
                            handleAdd('SurrogatePrenatalDelivery', { board, records: [...records, newPrenatalRecord] });
                            setNewPrenatalRecord({ status: '', date: '', name: '', remark: '', fileUrl: '' });
                                setFormErrors({});
                              }
                            }}
                          >
                            {t('ivfClinic.add','新增')}
                          </CustomButton>
                          <CustomButton 
                            className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 transition-colors" 
                            onClick={() => {
                              setNewPrenatalRecord({ status: '', date: '', name: '', remark: '', fileUrl: '' });
                              setFormErrors({});
                            }}
                          >
                            {t('ivfClinic.cancel','取消')}
                          </CustomButton>
                        </div>
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
