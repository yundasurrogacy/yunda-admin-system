"use client"

import React, { Suspense, useEffect, useState, useMemo, useCallback } from 'react'
import Modal from '@/components/ui/modal';
// import ManagerLayout from '@/components/manager-layout';
// import { AdminLayout } from "../../../components/admin-layout"
import { Card } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/CustomButton'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

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

import { useTranslation as useTranslationOrigin } from 'react-i18next';

// 优化的时间线项目组件
const TimelineItem = React.memo(({ 
  item, 
  stageNumber, 
  statusOptions, 
  handleViewClick,
  t 
}: { 
  item: { id: any; title: string; process_status?: string };
  stageNumber: number;
  statusOptions: { value: string; label: string }[];
  handleViewClick: (stageNumber: number, itemTitle: string) => void;
  t: (key: string) => string;
}) => {
  const statusLabel = item.process_status 
    ? statusOptions.find(opt => opt.value === item.process_status)?.label || item.process_status 
    : statusOptions[0].label;

  return (
    <li className="flex justify-between items-center py-1">
      <div className="flex flex-col">
        <span className="text-sage-800">{item.title}</span>
        {/* 状态只读展示 */}
        <span className="text-xs text-sage-700 mt-1 border border-sage-200 rounded px-2 py-1 w-fit bg-sage-50 cursor-default">
          {statusLabel}
        </span>
      </div>
      <CustomButton
        className="rounded px-4 py-1 text-xs bg-sage-100 text-sage-700 hover:bg-sage-200 transition-colors cursor-pointer"
        onClick={() => handleViewClick(stageNumber, item.title)}
      >
        {t('viewDetails')}
      </CustomButton>
    </li>
  );
});

TimelineItem.displayName = 'TimelineItem';

function JourneyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslationOrigin('common');
  const caseId = searchParams.get('caseId');

  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [processStatus, setProcessStatus] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [actualCaseId, setActualCaseId] = useState<string | null>(caseId); // 实际的 caseId

  // Toast 通知状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  // 显示Toast提示
  const showToastMessage = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_surrogacy')
      const userEmail = getCookie('userEmail_surrogacy')
      const userId = getCookie('userId_surrogacy')
      const authed = !!(userRole && userEmail && userId)
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/surrogacy/login')
      }
    }
  }, [router]);

  // 使用 useMemo 缓存分类选项
  const categories = useMemo(() => getCategories(t), [t]);

  // 使用 useMemo 缓存状态选项
  const statusOptions = useMemo(() => [
    { value: 'pending', label: t('journey.status.pending', '待完成') },
    { value: 'finished', label: t('journey.status.finished', '已完成') },
  ], [t]);

  // 使用 useMemo 缓存状态映射
  const statusKeyMap = useMemo(() => ({
    'Matching': 'Matching',
    'LegalStage': 'Legal',
    'CyclePrep': 'Medical',
    'Pregnant': 'Pregnancy',
    'Transferred': 'Post-delivery',
  }), []);

  // 使用 useCallback 缓存切换状态函数
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
        showToastMessage(t('journey.updateStatusFailed') || '更新状态失败', 'error');
      }
    } catch (error) {
      showToastMessage(t('journey.updateStatusError') || '更新状态时出错', 'error');
    }
  }, [t, showToastMessage]);

  // 使用 useCallback 缓存查看详情函数
  const handleViewClick = useCallback((stageNumber: number, itemTitle: string) => {
    const currentStage = timeline.find((step: any) => step.stageNumber === stageNumber);
    let journeyId = '';
    if (currentStage && currentStage.items && currentStage.items.length > 0) {
      const journey = currentStage.items.find((item: any) => item.title === itemTitle);
      if (journey && journey.id) journeyId = journey.id;
    }
    // 使用 actualCaseId 而不是 caseId，确保有实际值
    router.push(`/surrogacy/files?caseId=${actualCaseId}&stage=${stageNumber}&title=${encodeURIComponent(itemTitle)}${journeyId ? `&journeyId=${journeyId}` : ''}&about_role=surrogate_mother`);
  }, [router, actualCaseId, timeline]);

  // 使用 useCallback 缓存返回函数
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
          const currentCase = Array.isArray(data) ? data[0] : (data.cases?.[0] || data.data?.[0] || null);
          if (currentCase) {
            setActualCaseId(currentCase.id?.toString() || caseId); // 保存实际的 caseId
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
        const surrogacyId = typeof document !== 'undefined' ? getCookie('userId_surrogacy') : null;
        if (!surrogacyId) {
          setIsLoading(false);
          setTimeline(baseTimeline);
          return;
        }
        const res = await fetch(`/api/cases-by-surrogate?surrogateId=${surrogacyId}`);
        const data = await res.json();
        // const casesArr = Array.isArray(data) ? data : (data.cases || data.data || []);
        // const currentCase = casesArr.find((c: any) => c.id?.toString() === caseId?.toString());
        const casesArr = Array.isArray(data) ? data : (data.cases || data.data || []);
        let currentCase = casesArr.find((c: any) => c.id?.toString() === caseId?.toString());
        // 如果没查到，自动 fallback 到第一个有数据的 case
        if (!currentCase && casesArr.length > 0) {
          currentCase = casesArr[0];
        }
        // console.log('currentCase', currentCase);
        if (currentCase) {
          setActualCaseId(currentCase.id?.toString() || null); // 保存实际的 caseId
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
        showToastMessage(t('journey.fetchDataError') || '获取数据失败', 'error');
        setProcessStatus('');
        setUpdatedAt('');
        setTimeline(baseTimeline);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [caseId, i18n.language, isAuthenticated, t, showToastMessage]);

  // 使用 useMemo 缓存中文阶段数组
  const zhStages = useMemo(() => ['一','二','三','四','五','六','七','八'], []);

  // 使用 useMemo 缓存当前语言
  const currentLang = useMemo(() => i18n.language || 'zh', [i18n.language]);

  // 使用 useMemo 缓存是否为英文
  const isEnglish = useMemo(() => currentLang.startsWith('en'), [currentLang]);

  // 使用 useMemo 缓存当前状态显示
  const currentStatusDisplay = useMemo(() => {
    if (isLoading) return t('loadingText');
    if (processStatus) {
      return t(`statusMapping.${(statusKeyMap as any)[processStatus] || processStatus}`, { defaultValue: processStatus });
    }
    return t('journey.noStatus');
  }, [isLoading, processStatus, statusKeyMap, t]);

  // 使用 useMemo 缓存更新时间显示
  const updatedDisplay = useMemo(() => {
    return updatedAt ? `${t('journey.updated')} ${updatedAt.slice(0, 10)}` : '-';
  }, [updatedAt, t]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <div className="text-lg text-sage-700">{t('loading')}</div>
      </div>
    );
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-8 min-h-screen bg-main-bg">
      {/* 返回按钮 */}
      {/* <CustomButton
        className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
        onClick={handleBack}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('back', '返回')}
      </CustomButton> */}
      <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('journey.Gestational Carrier Journey')}</h1>
      <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-sage-800">{t('journey.currentStatus')}</h2>
          <span className="rounded bg-sage-100 px-4 py-1 text-xs text-sage-700">
            {currentStatusDisplay}
          </span>
        </div>
        <div className="text-sm text-sage-600">
          {updatedDisplay}
        </div>
      </Card>
      <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6">
        <h2 className="text-xl text-sage-800 mb-4">{t('journey.statusTimeline')}</h2>
        <div className="relative pl-8">
          {/* 竖线 */}
          {timeline.length > 0 && <div className="absolute left-4 top-0 w-0.5 h-full bg-sage-200" />}
          {timeline.map((step, idx) => {
            // 阶段前缀
            const stagePrefix = isEnglish
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
                    <TimelineItem
                      key={item.id}
                      item={item}
                      stageNumber={step.stageNumber}
                      statusOptions={statusOptions}
                      handleViewClick={handleViewClick}
                      t={t}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Toast 通知组件 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
          <div className={`px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-[300px] max-w-[500px] ${
            toastType === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : toastType === 'error'
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-yellow-50 border-yellow-400 text-yellow-800'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              toastType === 'success' 
                ? 'bg-green-100' 
                : toastType === 'error'
                ? 'bg-red-100'
                : 'bg-yellow-100'
            }`}>
              {toastType === 'success' && (
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toastType === 'error' && (
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toastType === 'warning' && (
                <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium flex-1">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors ${
                toastType === 'success' 
                  ? 'hover:bg-green-600' 
                  : toastType === 'error'
                  ? 'hover:bg-red-600'
                  : 'hover:bg-yellow-600'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Journey() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <JourneyInner />
    </Suspense>
  );
}