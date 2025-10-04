'use client'
import React, { Suspense } from 'react'
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

const staticTimelineData = (t: (key: string) => string) => [
  {
    stage: t('journey.stage1.title'),
    items: [],
  },
  {
    stage: t('journey.stage2.title'),
    items: [],
  },
  {
    stage: t('journey.stage3.title'),
    items: [],
  },
  {
    stage: t('journey.stage4.title'),
    items: [],
  },
  {
    stage: t('journey.stage5.title'),
    items: [],
  },
  {
    stage: t('journey.stage6.title'),
    items: [],
  },
  {
    stage: t('journey.stage7.title'),
    items: [],
  },
];

function JourneyInner() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [caseId, setCaseId] = React.useState<string | null>(null);
  const [caseStatus, setCaseStatus] = React.useState<{ process_status: string; updated_at: string } | null>(null);
  const [timeline, setTimeline] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const paramCaseId = searchParams.get('caseId');
    if (paramCaseId) {
      setCaseId(paramCaseId);
      return;
    }
    // 没有 caseId 参数时，自动获取 parentId 并请求第一个 caseId
    const parentId = typeof window !== 'undefined' ? localStorage.getItem('parentId') : null;
    if (!parentId) return;
    fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(res => res.json())
      .then(data => {
        // const casesRaw = data.cases || data.data || data;
        // console.log('casesRaw', casesRaw);
        // if (Array.isArray(casesRaw) && casesRaw.length > 0) {
        //   setCaseId(casesRaw[0].id?.toString() || null);
        // }
        const casesRaw = data.cases || data.data || data;
        if (Array.isArray(casesRaw) && casesRaw.length > 0) {
          setCaseId(casesRaw[0].id?.toString() || null);
          // 直接渲染 timeline
          const baseTimeline = staticTimelineData(t).map((stage, idx) => ({
            ...stage,
            items: [] as { id: string | number; title: string }[],
            stageNumber: idx + 1,
          }));
          if (casesRaw[0].journeys && Array.isArray(casesRaw[0].journeys)) {
            casesRaw[0].journeys.forEach((journey: any) => {
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
        }
      });
  }, [searchParams]);

  React.useEffect(() => {
    if (!caseId) return;
    setIsLoading(true);
    // 1. 创建7个阶段的基础结构
    const baseTimeline = staticTimelineData(t).map((stage, idx) => ({
      ...stage,
      items: [] as { id: string | number; title: string }[],
      stageNumber: idx + 1,
    }));
    fetch(`/api/cases/${caseId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCaseStatus({
            process_status: data.process_status,
            updated_at: data.updated_at,
          });
          // 2. journeys 动态填充
          if (data.journeys && Array.isArray(data.journeys)) {
            data.journeys.forEach((journey: any) => {
              const stageIndex = journey.stage - 1;
              if (stageIndex >= 0 && stageIndex < 7) {
                baseTimeline[stageIndex].items.push({
                  id: journey.id,
                  title: journey.title,
                });
              }
            });
          }
        }
        setTimeline(baseTimeline);
      })
      .catch(() => setTimeline(baseTimeline))
      .finally(() => setIsLoading(false));
  }, [caseId, t]);

  // 跳转到 files 页面并携带参数
  const handleViewClick = (stageNumber: number, itemTitle: string) => {
    if (!caseId) return;
    router.push(`/client/files?caseId=${caseId}&stage=${stageNumber}&title=${encodeURIComponent(itemTitle)}`);
  };

  return (

      <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('journey.title')}</h1>
        <p className="text-[#271F18] font-serif mb-8">{t('journey.description')}</p>
        <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif">{t('journey.currentStatus')}</h2>
            <span className="rounded bg-[#D9D9D9] px-4 py-1 text-xs font-serif text-[#271F18]">
              {isLoading ? t('loadingText') : (caseStatus?.process_status ? t(`statusMapping.${caseStatus.process_status}`, { defaultValue: caseStatus.process_status }) : t('journey.noStatus'))}
            </span>
          </div>
          <div className="text-sm">
            {caseStatus?.updated_at ? `${t('journey.updated')} ${caseStatus.updated_at.slice(0, 10)}` : '-'}
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
                        disabled={!caseId}
                      >
                        {t('journey.view')}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
}

export default function Journey() {
  const { t } = useTranslation('common');
  return (
    <Suspense fallback={<div className="p-8">{t('journey.suspenseLoading')}</div>}>
      <JourneyInner />
    </Suspense>
  );
}
