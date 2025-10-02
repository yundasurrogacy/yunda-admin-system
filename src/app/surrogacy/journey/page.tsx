'use client'
import React, { Suspense } from 'react'
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

const timeline = (t: (key: string) => string) => [
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
]

function JourneyInner() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [caseId, setCaseId] = React.useState<string | null>(null);
  const [caseStatus, setCaseStatus] = React.useState<{ process_status: string; updated_at: string } | null>(null);

  React.useEffect(() => {
    const paramCaseId = searchParams.get('caseId');
    if (paramCaseId) {
      setCaseId(paramCaseId);
      return;
    }
    // 没有 caseId 参数时，自动获取 surrogateId 并请求第一个 caseId
    const surrogateId = typeof window !== 'undefined' ? localStorage.getItem('surrogateId') : null;
    if (!surrogateId) return;
    fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`)
      .then(res => res.json())
      .then(data => {
        const casesRaw = data.cases || data.data || data;
        if (Array.isArray(casesRaw) && casesRaw.length > 0) {
          setCaseId(casesRaw[0].id?.toString() || null);
        }
      });
  }, [searchParams]);

  React.useEffect(() => {
    if (!caseId) return;
    fetch(`/api/cases/${caseId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCaseStatus({
            process_status: data.process_status,
            updated_at: data.updated_at,
          });
        }
      });
  }, [caseId]);

  // 跳转到 files 页面并携带参数
  const handleViewClick = (stageIdx: number, itemTitle: string) => {
    if (!caseId) return;
    router.push(`/surrogacy/files?caseId=${caseId}&stage=${stageIdx + 1}&title=${encodeURIComponent(itemTitle)}`);
  };

  const timelineData = timeline(t);

  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('journey.title')}</h1>
      <p className="text-[#271F18] font-serif mb-8">{t('journey.description')}</p>
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif">{t('journey.currentStatus')}</h2>
          <span className="rounded bg-[#D9D9D9] px-4 py-1 text-xs font-serif text-[#271F18]">
            {caseStatus?.process_status ? t(`statusMapping.${caseStatus.process_status}`, caseStatus.process_status) : t('journey.loading')}
          </span>
        </div>
        <div className="text-sm">
          {caseStatus?.updated_at ? t('journey.updatedAgo', { distance: formatDistanceToNow(parseISO(caseStatus.updated_at)) }) : '...'}
        </div>
      </Card>
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('journey.statusTimeline')}</h2>
        <div className="relative pl-8">
          {/* 竖线 */}
          <div className="absolute left-4 top-0 w-0.5 h-full bg-[#D9D9D9]" />
          {timelineData.map((step, idx) => (
            <div key={step.stage} className="mb-8 relative">
              {/* 圆点 */}
              <div className="absolute -left-4 top-2 w-4 h-4 rounded-full bg-white border-2 border-[#D9D9D9]" />
              <h3 className="font-serif text-lg mb-2">{step.stage}</h3>
              <ul className="mb-2">
                {step.items.map((item) => (
                  <li key={item} className="flex justify-between items-center py-1">
                    <span>{item}</span>
                    <Button
                      className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]"
                      onClick={() => handleViewClick(idx, item)}
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
