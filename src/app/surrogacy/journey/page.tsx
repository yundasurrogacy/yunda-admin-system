'use client'
import React, { Suspense } from 'react'
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

const timeline = [
  {
    stage: 'Stage 1: Initial Setup',
    items: [
      'Account Created & Form Submitted',
      'Initial Consultation Completed',
      'Service Agreement Signed',
      'IVF Account Established',
    ],
  },
  {
    stage: 'Stage 2: Surrogate Matching & Screening',
    items: [
      'Matching in Progress',
      'Candidate Profile Sent to Client',
      'Client Interview & Insights',
      'Surrogate Screening in Progress',
      'Match Confirmed',
    ],
  },
  {
    stage: 'Stage 3: Medical & Legal Setup',
    items: [
      'Embryo Creation or Transferable ID',
      'Legal agreement(s) prepared',
      'Legal agreement(s) fully signed',
    ],
  },
  {
    stage: 'Stage 4: Embryo Transfer Preparation',
    items: [
      'Cycle synchronization and Medication',
      'Embryo Transfer Completed',
      'Waiting for Pregnancy Test',
      'Positive Pregnancy Received',
    ],
  },
  {
    stage: 'Stage 5: Pregnancy Monitoring',
    items: [
      'First set of monitoring & check-ins',
      'OB Care in Progress',
      'Ultrasound in Progress',
      'Pregnancy Stable',
    ],
  },
  {
    stage: 'Stage 6: Delivery & Handover',
    items: [
      'Birth Plan Confirmed',
      'Baby Delivered & Legal Protocol',
      'Baby Credentials & Legal Protocol',
      'Baby Delivered to Intended Parents',
    ],
  },
  {
    stage: 'Stage 7: Post Journey Support',
    items: [
      'Departure Support Provided',
      'Journey Completed',
    ],
  },
]

function JourneyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [caseId, setCaseId] = React.useState<string | null>(null);

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

  // 跳转到 files 页面并携带参数
  const handleViewClick = (stageIdx: number, itemTitle: string) => {
    if (!caseId) return;
    router.push(`/client/files?caseId=${caseId}&stage=${stageIdx + 1}&title=${encodeURIComponent(itemTitle)}`);
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">Journey</h1>
      <p className="text-[#271F18] font-serif mb-8">Access and track your journey status with a visual roadmap.</p>
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif">Current Status</h2>
          <span className="rounded bg-[#D9D9D9] px-4 py-1 text-xs font-serif text-[#271F18]">IN LEGAL AGREEMENT STAGE</span>
        </div>
        <div className="text-sm">Updated today</div>
      </Card>
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">Status Timeline</h2>
        <div className="relative pl-8">
          {/* 竖线 */}
          <div className="absolute left-4 top-0 w-0.5 h-full bg-[#D9D9D9]" />
          {timeline.map((step, idx) => (
            <div key={step.stage} className="mb-8 relative">
              {/* 圆点 */}
              <div className="absolute -left-4 top-2 w-4 h-4 rounded-full bg-white border-2 border-[#D9D9D9]" />
              <h3 className="font-serif text-lg mb-2">{step.stage}</h3>
              <ul className="mb-2">
                {step.items.map((item, i) => (
                  <li key={item} className="flex justify-between items-center py-1">
                    <span>{item}</span>
                    <Button
                      className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]"
                      onClick={() => handleViewClick(idx, item)}
                      disabled={!caseId}
                    >
                      View
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
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <JourneyInner />
    </Suspense>
  );
}
