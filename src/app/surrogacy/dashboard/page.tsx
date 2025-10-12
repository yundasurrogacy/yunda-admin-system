"use client"

import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { CustomButton } from '@/components/ui/CustomButton'

interface JourneyStage {
  stage: string
  items: string[]
  stageNumber: number
}

interface JourneyRaw {
  id: string
  stage: number
  title: string
  updated_at?: string
}

interface CaseRaw {
  id: string
  updated_at: string
  journeys?: JourneyRaw[]
  process_status?: string
}

export default function SurrogacyDashboard() {
  // 工具函数：格式化 ISO 日期为 YYYY-MM-DD HH:mm
  const formatJournalDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    // 输出格式：YYYY-MM-DD HH:mm
    const pad = (n: number) => n < 10 ? `0${n}` : n;
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const { t } = useTranslation('common');
  const router = useRouter()
  const [journeyStages, setJourneyStages] = useState<JourneyStage[]>([])
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [currentStatusDate, setCurrentStatusDate] = useState<string>("")
  // 新增：保存最新 caseId 和 journal 更新时间
  const [caseId, setCaseId] = useState<string>("");
  const [latestJournalTime, setLatestJournalTime] = useState<string>("");
  const [loadingJournal, setLoadingJournal] = useState(false);
  // 国际化阶段数据
  const gestationalCarrierStagesRaw = t('journey.gestationalCarrierStages', { returnObjects: true, defaultValue: [] });
  // 支持对象结构（{prefix, title}），渲染 prefix+title 字符串
  const gestationalCarrierStages: string[] = Array.isArray(gestationalCarrierStagesRaw)
    ? gestationalCarrierStagesRaw.map((item: any) => typeof item === 'string' ? item : `${item.prefix ?? ''}${item.title ?? ''}`)
    : Object.values(gestationalCarrierStagesRaw ?? {}).map((item: any) => typeof item === 'string' ? item : `${item.prefix ?? ''}${item.title ?? ''}`);

  useEffect(() => {
    async function fetchData() {
      function getCookie(name: string) {
        if (typeof document === 'undefined') return undefined;
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : undefined;
      }
      const surrogateId = typeof document !== 'undefined' ? getCookie('userId_surrogacy') : null;
      if (!surrogateId) return;
      const res = await fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`);
      const data = await res.json();
      // console.log("data: ", data);
      const casesArr: CaseRaw[] = Array.isArray(data) ? data : (data.cases || data.data || []);
      if (!casesArr || casesArr.length === 0) return;
      // 按 updated_at 降序，取最新的case
      const sortedCases = casesArr.slice().sort((a, b) => {
        const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return bTime - aTime;
      });
      const latestCase = sortedCases[0];
      // 状态和时间
      setCurrentStatus(latestCase.process_status || "Matching");
      setCurrentStatusDate(latestCase.updated_at || "");
      setCaseId(latestCase.id?.toString() || "");
      let journeys: JourneyRaw[] = latestCase.journeys || [];
      // 国际化阶段渲染，直接从 i18n gestationalCarrierStages 获取
      const baseTimeline: JourneyStage[] = (gestationalCarrierStages || []).map((stage, idx) => ({
        stage,
        items: [],
        stageNumber: idx + 1,
      }));
      if (journeys && journeys.length > 0) {
        journeys.forEach((journey: JourneyRaw) => {
          const stageIndex = journey.stage - 1;
          if (stageIndex >= 0 && stageIndex < baseTimeline.length) {
            baseTimeline[stageIndex].items.push(journey.title || journey.id || "-");
          }
        });
      }
      setJourneyStages(baseTimeline);
    }
    fetchData();
  }, [t]);

  // caseId变化时获取journal最新更新时间
  useEffect(() => {
    if (!caseId) return;
    setLoadingJournal(true);
    fetch(`/api/posts?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        const posts = data.data || [];
        if (Array.isArray(posts) && posts.length > 0) {
          // 按 updated_at 降序，取最新 journal 时间
          const sorted = posts.slice().sort((a, b) => {
            const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
            const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
            return bTime - aTime;
          });
          setLatestJournalTime(sorted[0].updated_at || "");
        } else {
          setLatestJournalTime("");
        }
        setLoadingJournal(false);
      })
      .catch(() => {
        setLatestJournalTime("");
        setLoadingJournal(false);
      });
  }, [caseId]);

  return (
    <div className="p-8 min-h-screen bg-[rgba(251,240,218,0.25)] text-sage-800 font-medium">
  <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t("dashboard.title", { defaultValue: "DASHBOARD" })}</h1>
  <p className="mb-8 text-sage-800">{t("dashboard.welcome", { defaultValue: "Welcome to your dashboard! Access your priorities, important information, helpful tips, guides, and a variety of resources to support your journey." })}</p>
      {/* Current Status（进度条和状态） */}
      <CustomButton
        className="rounded-xl bg-[rgba(251,240,218,0.25)] p-6 mb-6 text-sage-800 font-medium w-full text-left transition-all hover:shadow-md"
        onClick={() => caseId && router.push(`/surrogacy/my-cases`)}
      >
        <h2 className="text-xl font-medium mb-2 text-sage-800">{t("dashboard.currentStatus", { defaultValue: "Current Status" })}</h2>
        <div className="flex justify-between items-center">
          <span className="font-medium text-sage-800"></span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            {(() => {
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
        <div className="text-sm mt-2 text-sage-800">{currentStatusDate ? t("dashboard.updatedAt", { date: currentStatusDate, defaultValue: `Updated at ${currentStatusDate}` }) : t("dashboard.updatedToday", { defaultValue: "Updated today" })}</div>
      </CustomButton>
      {/* Next Steps */}
      <div className="rounded-xl bg-[rgba(251,240,218,0.25)] p-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sage-800 font-medium">
        {journeyStages.map((stage) => (
          <div key={stage.stageNumber} className="flex flex-col items-center">
            <div
              className="bg-[#E3E8E3] rounded p-4 mb-2 flex flex-col items-center w-full min-w-[120px] cursor-pointer"
              onClick={() => {
                if (stage.items.length > 0 && stage.stage) {
                  router.push(`/surrogacy/files?stage=${stage.stageNumber}&title=${encodeURIComponent(stage.stage)}`)
                } else {
                  router.push('/surrogacy/journey');
                }
              }}
              title={stage.stage}
            >
              {/* 阶段名独占一行，宽度自适应内容长度，居中显示 */}
              <div className="w-full mb-1 flex justify-center">
                <span className="inline-block text-sm font-medium text-sage-800 break-words text-center whitespace-pre-line px-2" style={{maxWidth: '100%'}}>{stage.stage}</span>
              </div>
              {/* 只显示该阶段下所有title，没有title时也允许跳转，不显示内容即可 */}
              {stage.items.length > 0 ? (
                <div className="mt-2 w-full text-xs text-sage-800 flex flex-col items-center">
                  {stage.items.map((title, idx) => (
                    <div key={idx} className="w-full text-center">{title}</div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {/* Quick Access & Support Corner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
          <h2 className="font-serif text-lg mb-4">{t("dashboard.quickAccess", { defaultValue: "Quick Access" })}</h2>
          <div className="flex flex-col gap-4">
            <CustomButton className="flex items-center gap-2 bg-[#E3E8E3] rounded p-2 w-full font-serif text-[#271F18]" onClick={() => router.push('/surrogacy/journal')}>
              <span>📝</span>
              <span>{t("dashboard.uploadJournal", { defaultValue: "Upload Journal" })}</span>
              <span className="text-xs ml-auto">
                {loadingJournal
                  ? t("loadingText", { defaultValue: "Loading..." })
                  : latestJournalTime
                    ? t("dashboard.updatedAt", {
                        date: formatJournalDate(latestJournalTime),
                        defaultValue: `Updated at ${formatJournalDate(latestJournalTime)}`
                      })
                    : t("dashboard.noJournal", { defaultValue: "No journal yet" })}
              </span>
            </CustomButton>
            {/* <div className="flex items-center gap-2">
              <span className="bg-[#E3E8E3] rounded p-2">🖼️</span>
              <span>{t("dashboard.uploadUltrasound", { defaultValue: "Upload Ultrasound Image" })}</span>
              <span className="text-xs ml-auto">{t("dashboard.timeAgo", { time: "2", unit: t("dashboard.hours", { defaultValue: "hours" }), defaultValue: "2 hours ago" })}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#E3E8E3] rounded p-2">📩</span>
              <span>{t("dashboard.checkMessages", { defaultValue: "Check Messages" })}</span>
              <span className="text-xs ml-auto">{t("dashboard.timeAgo", { time: "2", unit: t("dashboard.hours", { defaultValue: "hours" }), defaultValue: "2 hours ago" })}</span>
            </div> */}
          </div>
        </div>
        {/* <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
          <h2 className="font-serif text-lg mb-4">{t("dashboard.supportCorner", { defaultValue: "Support Corner" })}</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#271F18]">
                {t("dashboard.supportQuote1", { defaultValue: "You are stronger than you think." })}
              </span>
              <span className="ml-auto text-xs">{t("dashboard.yesterday", { defaultValue: "yesterday" })}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#271F18]">
                {t("dashboard.supportQuote2", { defaultValue: "Drink plenty of water and rest well this week" })}
              </span>
              <span className="ml-auto text-xs">{t("dashboard.today", { defaultValue: "today" })}</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
