"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useTranslation } from "react-i18next"


// 动态获取 journey 阶段数据
// 获取最新case及其相关信息
const getLatestCaseAndTimeline = async (t: (key: string) => string) => {
  // 8个阶段标题，使用 journey.gestationalCarrierStages 国际化内容
  const stageTitles = Array.from({ length: 8 }).map((_, idx) =>
    t(`journey.gestationalCarrierStages.stage${idx + 1}.title`)
  );
  const baseTimeline = stageTitles.map((stage, idx) => ({
    stage,
    items: [] as string[],
    stageNumber: idx + 1,
  }));
  let latestFile = null;
  let latestJourney = null;
  try {
    function getCookie(name: string) {
      if (typeof document === 'undefined') return undefined;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : undefined;
    }
    const parentId = typeof document !== 'undefined' ? getCookie('userId_client') : null;
    // console.log('[Dashboard] parentId:', parentId);
    if (!parentId) return baseTimeline;
    const res = await fetch(`/api/cases-by-parent?parentId=${parentId}`);
    const data = await res.json();
    // console.log('[Dashboard] casesRaw:', data);
    const casesArr = Array.isArray(data) ? data : (data.cases || data.data || []);
    // 按 updated_at 降序，取最新的case
    const sortedCases = casesArr.slice().sort((a: any, b: any) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return bTime - aTime;
    });
    const latestCase = sortedCases[0];
    if (latestCase) {
      // 最新文件
      if (Array.isArray(latestCase.files) && latestCase.files.length > 0) {
        latestFile = latestCase.files.slice().sort((a: any, b: any) => {
          const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return bTime - aTime;
        })[0];
      }
      // 最新 journey
      if (Array.isArray(latestCase.journeys) && latestCase.journeys.length > 0) {
        latestJourney = latestCase.journeys.slice().sort((a: any, b: any) => {
          const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return bTime - aTime;
        })[0];
      }
      // 填充阶段数据
      if (latestCase.journeys && latestCase.journeys.length > 0) {
        latestCase.journeys.forEach((journey: any) => {
          const stageIndex = journey.stage - 1;
          if (stageIndex >= 0 && stageIndex < 8) {
            baseTimeline[stageIndex].items.push(journey.title);
          }
        });
      }
    }
    return { timeline: baseTimeline, latestFile, latestJourney };
  } catch {
    return baseTimeline;
  }
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { isAuthenticated, isLoading, user } = useAuth();
  const [timeline, setTimeline] = useState<any[]>([]);
  const [latestFile, setLatestFile] = useState<any>(null);
  const [latestJourney, setLatestJourney] = useState<any>(null);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [currentStatusDate, setCurrentStatusDate] = useState<string>("");

  // 获取动态 journey 阶段数据和最新文件/journey
  useEffect(() => {
    let ignore = false;
    setLoadingTimeline(true);
    getLatestCaseAndTimeline(t).then(data => {
      if (!ignore && data) {
        let latestCase = null;
        if (!Array.isArray(data) && data.timeline && (data.latestFile || data.latestJourney)) {
          // 兼容原有返回结构
          setTimeline(data.timeline);
          setLatestFile(data.latestFile);
          setLatestJourney(data.latestJourney);
          // 需要重新获取最新 case
          // 由于 getLatestCaseAndTimeline 内部有 latestCase，可考虑返回 latestCase
          // 但目前未返回，所以需重新 fetch
        } else if (Array.isArray(data)) {
          setTimeline(data);
        }
        // 重新获取最新 case 以获取 process_status 和 updated_at
        (async () => {
          function getCookie(name: string) {
            if (typeof document === 'undefined') return undefined;
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : undefined;
          }
          const parentId = typeof document !== 'undefined' ? getCookie('userId_client') : null;
          if (!parentId) return;
          const res = await fetch(`/api/cases-by-parent?parentId=${parentId}`);
          const casesData = await res.json();
          const casesArr = Array.isArray(casesData) ? casesData : (casesData.cases || casesData.data || []);
          const sortedCases = casesArr.slice().sort((a: any, b: any) => {
            const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
            const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
            return bTime - aTime;
          });
          latestCase = sortedCases[0];
          if (latestCase) {
            setCurrentStatus(latestCase.process_status || "Matching");
            setCurrentStatusDate(latestCase.updated_at || "");
          }
        })();
      }
      setLoadingTimeline(false);
    });
    return () => { ignore = true; };
  }, [t]);

  // 简单的认证检查
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/client/login');
      return;
    }
    if (!isLoading && isAuthenticated && user?.role !== 'client') {
      router.replace('/client/login');
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('dashboard.title', { defaultValue: 'DASHBOARD' })}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('dashboard.welcome', { defaultValue: 'Welcome to your Dashboard! Access your progress, important information, digital signatures, and a variety of references to support your journey.' })}
        </p>
      </div>

      {/* Current Status Section（可根据实际数据动态渲染） */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.currentStatus', { defaultValue: 'Current Status' })}</h2>
        <div
          className="bg-sage-50 border border-sage-200 rounded-md p-4 cursor-pointer hover:shadow-lg transition"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/client/my-cases')}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 hover:underline">
              {t('dashboard.caseStatus', { defaultValue: 'Case Status' })}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              {(() => {
                // 状态映射，优先国际化
                const statusMap: Record<string, string> = {
                  Matching: t('statusMapping.Matching', { defaultValue: 'Matching' }),
                  LegalStage: t('statusMapping.LegalStage', { defaultValue: 'Legal Stage' }),
                  CyclePrep: t('statusMapping.CyclePrep', { defaultValue: 'Cycle Prep' }),
                  Pregnant: t('statusMapping.Pregnant', { defaultValue: 'Pregnant' }),
                  Transferred: t('statusMapping.Transferred', { defaultValue: 'Transferred' }),
                };
                return statusMap[currentStatus] || t('statusMapping.Matching', { defaultValue: 'Matching' });
              })()}
            </span>
          </div>
          {/* 进度条只渲染5个状态 */}
          <div className="flex gap-2 items-center mt-3">
            {Array.from({ length: 5 }).map((_, idx) => {
              const statusStageMap: Record<string, number> = {
                Matching: 0,
                LegalStage: 1,
                CyclePrep: 2,
                Pregnant: 3,
                Transferred: 4,
              };
              const activeIdx = statusStageMap[currentStatus];
              // 当前状态及之前的都高亮
              const isActive = typeof activeIdx === 'number' && idx <= activeIdx;
              return (
                <div
                  key={idx}
                  className={`w-16 h-2 rounded ${isActive ? "bg-[#271F18]" : "bg-[#D9D9D9]"}`}
                />
              );
            })}
          </div>
          {/* 显示当前case的状态，方便调试 */}
          {/* <div className="text-xs text-red-500 mt-1">case状态(process_status): {currentStatus}</div> */}
          <div className="text-xs text-gray-500 mt-2">
            {currentStatusDate ? t('dashboard.updatedAt', { date: new Date(currentStatusDate).toLocaleString(), defaultValue: `Updated at ${new Date(currentStatusDate).toLocaleString()}` }) : ''}
          </div>
        </div>
      </div>

      {/* Next Steps Section - 动态渲染并可交互 */}
      <div className="space-y-3">
  <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.nextSteps', { defaultValue: 'Next Steps' })}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingTimeline ? (
            <span>Loading...</span>
          ) : (
            timeline.map(stage => (
              <Card key={stage.stage} className="p-4 flex flex-col space-y-2 cursor-pointer hover:shadow-lg transition"
                onClick={() => {
                  if (stage.items.length > 0 && stage.stage) {
                    router.push(`/client/files?stage=${stage.stageNumber}&title=${encodeURIComponent(stage.stage)}`)
                  } else {
                    router.push('/client/journey');
                  }
                }}
              >
                {/* 阶段号和标题居中显示 */}
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200 mb-2">
                    <span className="text-sage-700 text-base font-bold">{stage.stageNumber}</span>
                  </div>
                  <span className="text-xs text-gray-700 font-semibold text-center">{stage.stage}</span>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line flex flex-col items-center justify-center text-center">
                  {stage.items.length > 0 ? stage.items.map((title: string, idx: number) => (
                    <span key={idx} className="block w-full text-center">{title}</span>
                  )) : <span className="block w-full text-center">-</span>}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Recent Updates Section（分为文件和journey两块，可点击跳转） */}
      <div className="space-y-3">
  <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.recentUpdates', { defaultValue: 'Recent Updates' })}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 最新文件块 */}
          <Card
            className="p-4 flex items-start space-x-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              // 跳转到文件页面
              router.push('/client/files');
            }}
          >
            <div className="p-2 bg-sage-50 rounded-md border border-sage-200">
              <svg className="h-5 w-5 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium">{latestFile ? (latestFile.name || latestFile.filename || t('dashboard.newFileUploaded', { defaultValue: 'New File Uploaded' })) : t('dashboard.noFile', { defaultValue: 'No file uploaded yet.' })}</h3>
                <span className="text-xs text-gray-500">{latestFile && latestFile.updated_at ? new Date(latestFile.updated_at).toLocaleDateString() : ''}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{latestFile ? t('dashboard.latestFileTip', { defaultValue: 'A new file has been uploaded to your account.' }) : ''}</p>
            </div>
          </Card>
          {/* 最新 journey 块 */}
          <Card
            className="p-4 flex items-start space-x-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              // 跳转到 journey 页面
              router.push('/client/journey');
            }}
          >
            <div className="p-2 bg-sage-50 rounded-md border border-sage-200">
              <svg className="h-5 w-5 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium">{latestJourney ? (latestJourney.title || t('dashboard.journeyUpdated', { defaultValue: 'Journey Updated' })) : t('dashboard.noJourney', { defaultValue: 'No journey updated yet.' })}</h3>
                <span className="text-xs text-gray-500">{latestJourney && latestJourney.updated_at ? new Date(latestJourney.updated_at).toLocaleDateString() : ''}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{latestJourney ? t('dashboard.latestJourneyTip', { defaultValue: `Stage: ${latestJourney.stage || '-'} updated.` }) : ''}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
