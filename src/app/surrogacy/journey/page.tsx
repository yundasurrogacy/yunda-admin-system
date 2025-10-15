"use client"
// 文件分类选项
const getCategories = (t: (key: string) => string) => [
  { key: 'EmbryoDocs', label: t('files.categories.embryoDocs') },
  { key: 'SurrogateInfo', label: t('files.categories.surrogateInfo') },
  { key: 'LegalDocs', label: t('files.categories.legalDocs') },
  { key: 'Other', label: t('files.categories.other') },
];

import React, { Suspense, useEffect, useState } from 'react'
import Modal from '@/components/ui/modal';
// import ManagerLayout from '@/components/manager-layout';
// import { AdminLayout } from "../../../components/admin-layout"
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

import { useTranslation as useTranslationOrigin } from 'react-i18next';

function JourneyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslationOrigin('common');
  const categories = getCategories(t);
  const caseId = searchParams.get('caseId');

  // 国际化进度状态选项
  const statusOptions = [
    { value: 'pending', label: t('journey.status.pending', '待完成') },
    { value: 'finished', label: t('journey.status.finished', '已完成') },
  ];

  const [processStatus, setProcessStatus] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<any[]>([]);

  // 将后端返回的状态映射到翻译文件中的键
  const statusKeyMap: { [key: string]: string } = {
    'Matching': 'Matching',
    'LegalStage': 'Legal',
    'CyclePrep': 'Medical',
    'Pregnant': 'Pregnancy',
    'Transferred': 'Post-delivery',
  };

  // 切换并保存 journey 状态
  const handleStatusClick = async (item: { id: any; process_status?: string }) => {
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
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Network error');
    }
  };

  // 获取案例数据并设置当前case的process_status和updated_at
  useEffect(() => {
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
        function getCookie(name: string) {
          if (typeof document === 'undefined') return undefined;
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? match[2] : undefined;
        }
        // 优先 caseId 查询
        if (caseId) {
          const res = await fetch(`/api/cases-list?caseId=${caseId}`);
          const data = await res.json();
          const currentCase = Array.isArray(data) ? data[0] : (data.cases?.[0] || data.data?.[0] || null);
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
  }, [caseId, i18n.language]);

  // 跳转到 files 页面并携带 journeyId 参数（只读）
  const handleViewClick = (stageNumber: number, itemTitle: string) => {
    const currentStage = timeline.find((step: any) => step.stageNumber === stageNumber);
    let journeyId = '';
    if (currentStage && currentStage.items && currentStage.items.length > 0) {
      const journey = currentStage.items.find((item: any) => item.title === itemTitle);
      if (journey && journey.id) journeyId = journey.id;
    }
    router.push(`/surrogacy/files?caseId=${caseId}&stage=${stageNumber}&title=${encodeURIComponent(itemTitle)}${journeyId ? `&journeyId=${journeyId}` : ''}`);
  };

  // ...只读模式，无添加相关逻辑...

  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
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
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('journey.Gestational Carrier Journey')}</h1>
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif">{t('journey.currentStatus')}</h2>
          <span className="rounded bg-[#D9D9D9] px-4 py-1 text-xs font-serif text-[#271F18]">
            {isLoading ? t('loadingText') : (processStatus ? t(`statusMapping.${statusKeyMap[processStatus] || processStatus}`, { defaultValue: processStatus }) : t('journey.noStatus'))}
          </span>
        </div>
        <div className="text-sm">
          {updatedAt ? `${t('journey.updated')} ${updatedAt.slice(0, 10)}` : '-'}
        </div>
      </Card>
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('journey.statusTimeline')}</h2>
        <div className="relative pl-8">
          {/* 竖线 */}
          {timeline.length > 0 && <div className="absolute left-4 top-0 w-0.5 h-full bg-[#D9D9D9]" />}
          {timeline.map((step, idx) => {
            // 阶段前缀
            const zhStages = ['一','二','三','四','五','六','七','八'];
            const lang = i18n.language || 'zh';
            const stagePrefix = lang.startsWith('en')
              ? `Stage ${idx + 1}: `
              : `阶段${zhStages[idx] || idx + 1}：`;
            return (
              <div key={idx} className="mb-8 relative">
                {/* 圆点 */}
                <div className="absolute -left-4 top-2 w-4 h-4 rounded-full bg-white border-2 border-[#D9D9D9]" />
                <h3 className="font-serif text-lg mb-2">{stagePrefix}{step.stage}</h3>
                <div className="mb-2 text-[#6B5B3A] text-sm whitespace-pre-line">{step.description}</div>
                <ul className="mb-2">
                  {step.items.map((item: { id: any; title: string; process_status?: string }) => (
                    <li key={item.id} className="flex justify-between items-center py-1">
                      <div className="flex flex-col">
                        <span>{item.title}</span>
                        {/* 状态只读展示 */}
                        <span className="text-xs text-gray-700 mt-1 border border-gray-300 rounded px-2 py-1 w-fit bg-white cursor-default">
                          {item.process_status ? statusOptions.find(opt => opt.value === item.process_status)?.label || item.process_status : statusOptions[0].label}
                        </span>
                      </div>
                      <CustomButton
                        className="rounded px-4 py-1 text-xs cursor-pointer"
                        onClick={() => handleViewClick(step.stageNumber, item.title)}
                      >
                        {t('viewDetails')}
                      </CustomButton>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>
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