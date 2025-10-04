'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { AdminLayout } from "../../../components/admin-layout"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const staticTimelineData = (t: (key: string) => string) => [
  {
    stage: t('journey.stage1.title'),
    items: [
      t('journey.stage1.item1'),
      t('journey.stage1.item2'),
      t('journey.stage1.item3'),
      t('journey.stage1.item4'),
    ],
  },
  {
    stage: t('journey.stage2.title'),
    items: [
      t('journey.stage2.item1'),
      t('journey.stage2.item2'),
      t('journey.stage2.item3'),
      t('journey.stage2.item4'),
      t('journey.stage2.item5'),
    ],
  },
  {
    stage: t('journey.stage3.title'),
    items: [
      t('journey.stage3.item1'),
      t('journey.stage3.item2'),
      t('journey.stage3.item3'),
    ],
  },
  {
    stage: t('journey.stage4.title'),
    items: [
      t('journey.stage4.item1'),
      t('journey.stage4.item2'),
      t('journey.stage4.item3'),
      t('journey.stage4.item4'),
    ],
  },
  {
    stage: t('journey.stage5.title'),
    items: [
      t('journey.stage5.item1'),
      t('journey.stage5.item2'),
      t('journey.stage5.item3'),
      t('journey.stage5.item4'),
    ],
  },
  {
    stage: t('journey.stage6.title'),
    items: [
      t('journey.stage6.item1'),
      t('journey.stage6.item2'),
      t('journey.stage6.item3'),
      t('journey.stage6.item4'),
    ],
  },
  {
    stage: t('journey.stage7.title'),
    items: [
      t('journey.stage7.item1'),
      t('journey.stage7.item2'),
    ],
  },
];

function JourneyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation('common');
  const caseId = searchParams.get('caseId');

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

  // 获取案例数据并设置当前case的process_status和updated_at
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      // 1. 创建一个包含7个阶段标题和空项目列表的基础结构
      const baseTimeline = staticTimelineData(t).map((stage, idx) => ({
        ...stage,
        items: [] as { id: any; title: string }[],
        stageNumber: idx + 1,
      }));

      try {
        const adminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null;
        if (!adminId || !caseId) {
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

          // 2. 如果后端返回了 journeys 数据
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
          setTimeline(baseTimeline); // 如果找不到 case，也显示空的7个阶段
        }
      } catch (error) {
        console.error("Failed to fetch case data:", error);
        setProcessStatus('');
        setUpdatedAt('');
        setTimeline(baseTimeline); // 出错时也显示空的7个阶段
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [caseId, t]);

  // 跳转到 files 页面并携带参数
  const handleViewClick = (stageNumber: number, itemTitle: string) => {
    router.push(`/client-manager/files?caseId=${caseId}&stage=${stageNumber}&title=${encodeURIComponent(itemTitle)}`);
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('journey.title')}</h1>
        <p className="text-[#271F18] font-serif mb-8">{t('journey.description')}</p>
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
            {timeline.map((step, idx) => (
              <div key={idx} className="mb-8 relative">
                {/* 圆点 */}
                <div className="absolute -left-4 top-2 w-4 h-4 rounded-full bg-white border-2 border-[#D9D9D9]" />
                <h3 className="font-serif text-lg mb-2">{step.stage}</h3>
                <ul className="mb-2">
                  {step.items.map((item: { id: any; title: string }) => (
                    <li key={item.id} className="flex justify-between items-center py-1">
                      <span>{item.title}</span>
                      <Button
                        className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]"
                        onClick={() => handleViewClick(step.stageNumber, item.title)}
                      >
                        {t('viewDetails')}
                      </Button>
                    </li>
                  ))}
                </ul>
                {/* 只读模式：不显示添加按钮 */}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default function Journey() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <JourneyInner />
    </Suspense>
  );
}