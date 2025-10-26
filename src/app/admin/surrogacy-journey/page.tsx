"use client"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 文件分类选项
const getCategories = (t: (key: string) => string) => [
  { key: 'EmbryoDocs', label: t('files.categories.embryoDocs') },
  { key: 'SurrogateInfo', label: t('files.categories.surrogateInfo') },
  { key: 'LegalDocs', label: t('files.categories.legalDocs') },
  { key: 'Other', label: t('files.categories.other') },
];

import React, { Suspense, useEffect, useState, useMemo, useCallback } from 'react'
import Modal from '@/components/ui/modal';
import { Card } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/CustomButton'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const staticTimelineData = () => [
  {
    en: {
      stage: 'Application & Initial Screening',
      description: 'Submit application with basic info and family photos; sign medical release form to retrieve pregnancy and delivery records.'
    },
    zh: {
      stage: '申请与初步筛查',
      description: '提交代孕申请，填写基本信息并上传家庭照片；签署医疗记录授权表，用于获取以往的怀孕与分娩记录。'
    }
  },
  {
    en: {
      stage: 'Matching Process',
      description: 'Attend matching meeting with intended parents and confirm match.'
    },
    zh: {
      stage: '匹配流程',
      description: '与预期父母进行匹配会谈，双方确认匹配。'
    }
  },
  {
    en: {
      stage: 'Medical Screening & Clearance',
      description: 'Undergo medical tests at the IVF clinic and receive medical clearance.'
    },
    zh: {
      stage: '医学筛查与通过',
      description: '前往试管婴儿诊所进行全面体检，并获得医疗合格许可。'
    }
  },
  {
    en: {
      stage: 'Legal Clearance',
      description: 'Both parties sign the surrogacy agreement and receive legal clearance.'
    },
    zh: {
      stage: '法律合格确认',
      description: '双方签署代孕协议，完成法律合格确认。'
    }
  },
  {
    en: {
      stage: 'Embryo Transfer Cycle',
      description: 'Begin medication protocol, embryo transfer, and await pregnancy results.'
    },
    zh: {
      stage: '胚胎移植周期',
      description: '开始用药准备，进行胚胎移植并等待妊娠结果。'
    }
  },
  {
    en: {
      stage: 'Pregnancy Monitoring',
      description: 'Confirm pregnancy; complete first and second ultrasounds (heartbeat confirmation, no ectopic pregnancy); complete NIPT at 12 weeks; attend regular OB visits.'
    },
    zh: {
      stage: '妊娠监测阶段',
      description: '确认怀孕后，完成第一次和第二次B超（确认胎心及排除宫外孕），12周进行无创产检（NIPT），并定期进行产检。'
    }
  },
  {
    en: {
      stage: 'Pre-Birth Legal & Delivery Preparation',
      description: 'Pre-Birth Order (PBO) issued; confirm delivery plan with intended parents and hospital.'
    },
    zh: {
      stage: '产前法律与分娩准备',
      description: '产前法律文件（PBO）完成，与预期父母及医院确认生产计划。'
    }
  },
  {
    en: {
      stage: 'Delivery & Postpartum',
      description: 'Delivery and joyful completion of the surrogacy journey.'
    },
    zh: {
      stage: '分娩与产后阶段',
      description: '顺利分娩，圆满完成代孕旅程。'
    }
  },
];

function JourneyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation('common');
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [processStatus, setProcessStatus] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<any[]>([]);

  // 添加 journey 弹窗表单状态
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStage, setAddStage] = useState<number | null>(null);
  const [addTitle, setAddTitle] = useState('');
  const [addFiles, setAddFiles] = useState<Array<{ file?: File; file_url?: string; category?: string; file_type?: string; note?: string }>>([]);
  const [addLoading, setAddLoading] = useState(false);

  const caseId = searchParams.get('caseId');

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

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存国际化进度状态选项
  const statusOptions = useMemo(() => [
    { value: 'pending', label: t('journey.status.pending', '待完成') },
    { value: 'finished', label: t('journey.status.finished', '已完成') },
  ], [t]);

  // 使用 useMemo 缓存分类选项
  const categories = useMemo(() => getCategories(t), [t]);

  // 使用 useMemo 缓存状态映射
  const statusKeyMap = useMemo(() => ({
    'Matching': 'Matching',
    'LegalStage': 'Legal',
    'CyclePrep': 'Medical',
    'Pregnant': 'Pregnancy',
    'Transferred': 'Post-delivery',
  } as Record<string, string>), []);

  // 获取案例数据并设置当前case的process_status和updated_at
  useEffect(() => {
    // 只在认证后才加载数据
    if (!isAuthenticated) return;
    
    const fetchCases = async () => {
      setIsLoading(true);
      // 国际化语言判断，en显示英文，zh显示中文，其他默认中文
      const lang = i18n.language || 'zh';
      const baseTimeline = staticTimelineData().map((stage, idx) => ({
        stage: lang.startsWith('en') ? stage.en.stage : stage.zh.stage,
        description: lang.startsWith('en') ? stage.en.description : stage.zh.description,
  items: [] as { id: any; title: string; process_status?: string }[],
        stageNumber: idx + 1,
      }));
      try {
        // 优先 caseId 查询
        if (caseId) {
          const res = await fetch(`/api/cases-list?caseId=${caseId}`);
          const data = await res.json();
          console.log('data', data);
          // data 总是一个数组，需要根据 caseId 查找匹配的 case
          const casesArray = Array.isArray(data) ? data : [];
          const currentCase = casesArray.find((c: any) => c.id?.toString() === caseId?.toString());
          console.log('currentCase', currentCase);
          if (currentCase) {
            setProcessStatus(currentCase.process_status || '');
            setUpdatedAt(currentCase.updated_at || '');
            if (currentCase.journeys && currentCase.journeys.length > 0) {
              // 只显示 about_role 为 surrogate_mother 的 journey，并渲染 process_status
              const filteredJourneys = currentCase.journeys.filter((journey: any) => journey.about_role === 'surrogate_mother');
              filteredJourneys.forEach((journey: any) => {
                const stageIndex = journey.stage - 1;
                if (stageIndex >= 0 && stageIndex < 7) {
                  baseTimeline[stageIndex].items.push({
                    id: journey.id,
                    title: journey.title,
                    process_status: journey.process_status,
                  });
                }
              });
            }
            setTimeline(baseTimeline);
            setIsLoading(false);
            return;
          }
        }
        // 没有 caseId 或 caseId 查不到时，使用 managerId 查询
        // const managerId = typeof document !== 'undefined' ? getCookie('userId_manager') : null;
        const adminId = typeof document !== 'undefined' ? getCookie('userId_admin') : null;
        if (!adminId) {
          setIsLoading(false);
          setTimeline(baseTimeline);
          return;
        }
        const res = await fetch(`/api/cases-by-admin?adminId=${adminId}`);
        const data = await res.json();
        const casesArr = Array.isArray(data) ? data : (data.cases || data.data || []);
        const currentCase = casesArr.find((c: any) => c.id?.toString() === caseId?.toString());
        if (currentCase) {
          setProcessStatus(currentCase.process_status || '');
          setUpdatedAt(currentCase.updated_at || '');
          if (currentCase.journeys && currentCase.journeys.length > 0) {
            currentCase.journeys.forEach((journey: any) => {
              const stageIndex = journey.stage - 1;
              if (stageIndex >= 0 && stageIndex < 7) {
                baseTimeline[stageIndex].items.push({
                  id: journey.id,
                  title: journey.title,
                });
              }
            });
          }
          setTimeline(baseTimeline);
        } else {
          setProcessStatus('');
          setUpdatedAt('');
          setTimeline(baseTimeline);
        }
      } catch (error) {
        console.error("Failed to fetch case data:", error);
        setProcessStatus('');
        setUpdatedAt('');
        setTimeline(baseTimeline);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [caseId, i18n.language, isAuthenticated]);

  // 使用 useCallback 缓存事件处理函数
  // 切换并保存 journey 状态
  const handleStatusClick = useCallback(async (item: { id: any; process_status?: string }) => {
    if (!item.id) return;
    const newStatus = item.process_status;
    try {
      const res = await fetch('/api/journey-update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId: item.id, process_status: newStatus }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, []);

  // 跳转到 files 页面并携带 journeyId 参数
  const handleViewClick = useCallback((stageNumber: number, itemTitle: string) => {
    // 找到当前阶段下的 journey
    const currentStage = timeline.find((step: any) => step.stageNumber === stageNumber);
    let journeyId = '';
    if (currentStage && currentStage.items && currentStage.items.length > 0) {
      // 精确匹配 title
      const journey = currentStage.items.find((item: any) => item.title === itemTitle);
      if (journey && journey.id) journeyId = journey.id;
    }
    router.push(`/admin/files?caseId=${caseId}&stage=${stageNumber}&title=${encodeURIComponent(itemTitle)}${journeyId ? `&journeyId=${journeyId}` : ''}&about_role=surrogate_mother`);
  }, [timeline, router, caseId]);

  const handleAddJourneyClick = useCallback((stageNumber: number) => {
    setAddStage(stageNumber);
    setAddTitle('');
    setAddFiles([]); // 弹窗初始为空
    setShowAddModal(true);
  }, []);

  // 支持多文件批量添加
  const handleAddFiles = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        file,
        file_url: '',
        category: '',
        file_type: file.type || '',
        note: ''
      }));
      setAddFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleRemoveFileField = useCallback((idx: number) => {
    setAddFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleFileMetaChange = useCallback((idx: number, key: string, value: string) => {
    setAddFiles(prev => prev.map((f, i) => i === idx ? { ...f, [key]: value } : f));
  }, []);

  const handleAddJourneySubmit = useCallback(async () => {
    if (!caseId || !addStage || !addTitle) return;
    setAddLoading(true);
    try {
      // 1. 上传所有文件
      const uploadedFiles = await Promise.all(addFiles.map(async (f) => {
        if (f.file) {
          const formData = new FormData();
          formData.append('file', f.file);
          const uploadRes = await fetch('/api/upload/form', { method: 'POST', body: formData });
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.success) {
            return { ...f, file_url: uploadData.data.url || uploadData.data.path || uploadData.data.fileUrl || uploadData.data };
          } else {
            throw new Error(uploadData.message || t('files.uploadFailed'));
          }
        }
        return f;
      }));
      // 2. 提交 journey + files
      const filesToUpload = uploadedFiles.filter(f => f.file_url).map(f => ({
        file_url: f.file_url,
        category: f.category,
        file_type: f.file_type,
        note: f.note,
      }));
      const res = await fetch('/api/cases-by-manager/add-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, stage: addStage, title: addTitle, files: filesToUpload, about_role: 'surrogate_mother' }),
      });
      if (res.ok) {
        setShowAddModal(false);
        window.location.reload();
        console.log('Journey item added successfully');
      } else {
        console.error('Failed to add journey item');
      }
    } catch (e: any) {
      console.error('Network error:', e.message || e);
    } finally {
      setAddLoading(false);
    }
  }, [caseId, addStage, addTitle, addFiles, t]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAddTitle(e.target.value);
  }, []);

  // 缓存阶段前缀数组
  const zhStages = useMemo(() => ['一','二','三','四','五','六','七','八'], []);

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
    <>
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
        <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('journey.Gestational Carrier Journey')}</h1>
        {/* <p className="text-sage-800 mb-8 font-medium">{t('journey.description')}</p> */}
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-sage-800">{t('journey.currentStatus')}</h2>
            <span className="rounded bg-sage-100 px-4 py-1 text-xs text-sage-700">
              {isLoading ? t('loadingText') : (processStatus ? t(`statusMapping.${statusKeyMap[processStatus as keyof typeof statusKeyMap] || processStatus}`, { defaultValue: processStatus }) : t('journey.noStatus'))}
            </span>
          </div>
          <div className="text-sm text-sage-600">
            {updatedAt ? `${t('journey.updated')} ${updatedAt.slice(0, 10)}` : '-'}
          </div>
        </Card>
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6">
          <h2 className="text-xl text-sage-800 mb-4">{t('journey.statusTimeline')}</h2>
          <div className="relative pl-8">
            {/* 竖线 */}
            {timeline.length > 0 && <div className="absolute left-4 top-0 w-0.5 h-full bg-sage-200" />}
            {timeline.map((step, idx) => {
              // 阶段前缀
              const lang = i18n.language || 'zh';
              const stagePrefix = lang.startsWith('en')
                ? `Stage ${idx + 1}: `
                : `阶段${zhStages[idx] || idx + 1}：`;
              return (
                <div key={idx} className="mb-8 relative">
                  {/* 圆点 */}
                  <div className="absolute -left-4 top-2 w-4 h-4 rounded-full bg-white border-2 border-sage-200" />
                  <h3 className="text-lg mb-2 text-sage-800">{stagePrefix}{step.stage}</h3>
                  <div className="mb-2 text-sage-600 text-sm whitespace-pre-line">{step.description}</div>
                  <ul className="mb-2">
                    {step.items.map((item: { id: any; title: string; process_status?: string }) => (
                      <li key={item.id} className="flex justify-between items-center py-1">
                        <div className="flex flex-col">
                          <span className="text-sage-800">{item.title}</span>
                          <select
                            className="text-xs text-sage-700 mt-1 border border-sage-200 rounded px-2 py-1 w-fit bg-sage-50 cursor-pointer"
                            value={item.process_status || 'pending'}
                            onChange={e => handleStatusClick({ ...item, process_status: e.target.value })}
                            title={t('journey.switchStatus', '切换进度状态')}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <CustomButton
                          className="rounded px-4 py-1 text-xs bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors cursor-pointer"
                          onClick={() => handleViewClick(step.stageNumber, item.title)}
                        >
                          {t('viewDetails')}
                        </CustomButton>
                      </li>
                    ))}
                  </ul>
                  <CustomButton
                    className="rounded-full px-5 py-2 text-sm mt-2 flex items-center gap-2 cursor-pointer"
                    style={{ boxShadow: '0 2px 8px 0 #BFC9BF33' }}
                    onClick={() => handleAddJourneyClick(step.stageNumber)}
                  >
                    <span className="cursor-pointer">+</span>
                  </CustomButton>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      {/* 添加 journey 弹窗表单 */}
      {showAddModal && (
        <Modal open={showAddModal} onClose={handleCloseModal}>
          <div
            className="p-0 w-full max-w-4xl min-w-[700px] rounded-3xl overflow-hidden shadow-2xl border border-[#E3E8E3] bg-gradient-to-br from-[#F8F9FA] to-[#F3F6F3] animate-fadein relative"
            style={{ boxSizing: 'border-box' }}
          >
            {/* 关闭按钮 */}
            <button className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 z-10 cursor-pointer" onClick={handleCloseModal} aria-label={t('close', '关闭')}>
              <svg width="22" height="22" fill="none" stroke="#271F18" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="px-10 pt-10 pb-4 border-b border-[#F0F0F0] flex items-center">
              <h2 className="text-3xl font-extrabold font-serif text-[#271F18] tracking-wide drop-shadow-sm">{t('journey.addItem')}</h2>
            </div>
            <div className="px-10 py-8 flex flex-col gap-10 max-h-[80vh] overflow-y-auto">
              {/* 标题输入 */}
              <div>
                <input
                  className="w-full border border-[#E3E8E3] rounded-2xl px-6 py-3 mb-2 focus:ring-2 focus:ring-[#BFC9BF] focus:outline-none bg-white text-[#271F18] font-serif text-xl shadow-sm transition-all duration-200"
                  value={addTitle}
                  onChange={handleTitleChange}
                  placeholder={t('journey.itemTitlePlaceholder', '请输入事项标题')}
                  style={{ boxShadow: '0 2px 8px 0 #E3E8E355' }}
                />
              </div>
              {/* 文件表格和添加按钮 */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-serif font-semibold text-[#271F18] text-lg">{t('files.fileList', '文件列表')}</span>
                  <CustomButton
                    className="px-4 py-2 rounded-full text-base font-bold cursor-pointer"
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    {t('files.uploadFiles', '上传文件')}
                  </CustomButton>
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => {
                      handleAddFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>
                <div className="rounded-2xl shadow border border-[#E3E8E3] bg-white">
                  <table
                    className="w-full text-sm font-serif table-fixed"
                    style={{ tableLayout: 'fixed', minWidth: 0 }}
                  >
                    <colgroup>
                      <col style={{ width: '40%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '28%' }} />
                      <col style={{ width: '12%' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-[#F8F9FA] text-[#271F18]">
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('files.fileName', 'File Name')}</th>
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('files.category', 'Category')}</th>
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('files.note', 'Description')}</th>
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('operation', 'Operation')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addFiles.length === 0 && (
                        <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('files.noFiles', 'No Files')}</td></tr>
                      )}
                      {addFiles.map((f, idx) => (
                        <tr key={idx} className="hover:bg-[#F8F9FA] transition-all">
                          <td className="px-4 py-2 truncate" title={f.file?.name}>
                            {f.file ? <span className="font-medium text-[#271F18]">{f.file.name}</span> : <span className="text-gray-400">{t('files.noFile', '未选择')}</span>}
                          </td>
                          <td className="px-4 py-2">
                            <select
                              className="border border-[#E3E8E3] rounded-lg px-2 py-1 w-full font-serif text-sm bg-white focus:ring-2 focus:ring-[#BFC9BF] focus:outline-none transition-all"
                              value={f.category || ''}
                              onChange={e => handleFileMetaChange(idx, 'category', e.target.value)}
                            >
                              <option value="" disabled>{t('files.selectCategory', '请选择分类')}</option>
                              {categories.map(cat => (
                                <option key={cat.key} value={cat.key}>{cat.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="border border-[#E3E8E3] rounded-lg px-2 py-1 w-full font-serif text-sm bg-white focus:ring-2 focus:ring-[#BFC9BF] focus:outline-none transition-all"
                              placeholder={t('files.note', '描述')}
                              value={f.note || ''}
                              onChange={e => handleFileMetaChange(idx, 'note', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <CustomButton className="px-3 py-1 text-xs rounded-full w-full cursor-pointer" onClick={() => handleRemoveFileField(idx)}>{t('delete', '删除')}</CustomButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* 底部操作按钮 */}
              <div className="flex justify-end gap-6 mt-4">
                <CustomButton className="px-7 py-2 rounded-full text-lg font-semibold cursor-pointer" onClick={handleCloseModal}>{t('cancel', '取消')}</CustomButton>
                <CustomButton className="px-7 py-2 rounded-full text-lg font-bold cursor-pointer" onClick={handleAddJourneySubmit} disabled={addLoading}>{addLoading ? t('loadingText', '保存中...') : t('save', '保存')}</CustomButton>
              </div>
            </div>
          </div>
        </Modal>
      )}
      </>
  )
}

export default function Journey() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <JourneyInner />
    </Suspense>
  );
}