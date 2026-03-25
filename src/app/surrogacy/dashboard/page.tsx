"use client"

import React, { useEffect, useState, useMemo, useCallback, memo } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/CustomButton'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Users, 
  FileText, 
  Activity,
  CalendarDays,
  RefreshCw,
  Settings,
  Shield,
  BookOpen,
  ChevronRight,
  Route
} from "lucide-react"

// 优化的快速操作按钮组件
const QuickActionButton = memo(({ 
  label, 
  IconComponent, 
  bgColor, 
  textColor,
  onClick 
}: { 
  label: string; 
  IconComponent: React.ComponentType<{ className?: string }>; 
  bgColor: string;
  textColor: string;
  onClick: () => void;
}) => (
  <CustomButton 
    className={`w-full justify-start px-4 py-3 ${bgColor} hover:opacity-90 ${textColor} rounded-lg transition-all duration-200 cursor-pointer hover:scale-105`}
    onClick={onClick}
  >
    <IconComponent className="w-4 h-4 mr-3" />
    {label}
  </CustomButton>
));

QuickActionButton.displayName = 'QuickActionButton';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

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
  process_status?: string
  about_role?: string
}

interface CaseRaw {
  id: string
  updated_at: string
  journeys?: JourneyRaw[]
  process_status?: string
  ivf_clinics?: { id: string; type: string; data?: unknown; about_role?: string }[]
  surrogate_mother?: { contact_information?: string }
}

// Next Action 任务状态
type TaskStatus = 'pending' | 'dueSoon' | 'overdue' | 'completed'

interface NextActionItem {
  id: string
  title: string
  dueDate?: string
  status: TaskStatus
  linkTo?: string
  linkLabel?: string
}

// 待提交材料（来自诊所工作流，暂无 API 时用 journey 推导占位）
interface PendingDocItem {
  id: string
  name: string
  requirement?: string
  format?: string
  status: string
  linkTo: string
}

// 预约项
interface AppointmentItem {
  id: string
  date: string
  time?: string
  location: string
  type: string
  related?: string
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
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
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

  // 汇总 about_role 为 surrogate_mother 的 journey
  const [journeySummary, setJourneySummary] = useState({ total: 0, finished: 0, pending: 0 });
  const [dataLoaded, setDataLoaded] = useState(false);
  // Next Action、待提交材料、未来预约
  const [nextActions, setNextActions] = useState<NextActionItem[]>([]);
  const [pendingDocs, setPendingDocs] = useState<PendingDocItem[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentItem[]>([]);
  const [latestCaseRaw, setLatestCaseRaw] = useState<CaseRaw | null>(null);

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

  useEffect(() => {
    // 只在认证后才加载数据
    if (!isAuthenticated || dataLoaded) return;
    
    async function fetchData() {
      const surrogateId = getCookie('userId_surrogacy');
      if (!surrogateId) return;
      const res = await fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`);
      const data = await res.json();
      const casesArr: CaseRaw[] = Array.isArray(data) ? data : (data.cases || data.data || []);
      if (!casesArr || casesArr.length === 0) return;
      // 按 updated_at 降序，取最新的case
      const sortedCases = casesArr.slice().sort((a, b) => {
        const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return bTime - aTime;
      });
      const latestCase = sortedCases[0];
      setLatestCaseRaw(latestCase);
      setCurrentStatus(latestCase.process_status || "Matching");
      setCurrentStatusDate(latestCase.updated_at || "");
      setCaseId(latestCase.id?.toString() || "");
      let journeys: JourneyRaw[] = latestCase.journeys || [];
      // 汇总 about_role 为 surrogate_mother 的 journey
      const surrogateJourneys = journeys.filter((j: any) => !j.about_role || j.about_role === 'surrogate_mother');
      const total = surrogateJourneys.length;
      const finished = surrogateJourneys.filter(j => j.process_status === 'finished').length;
      const pending = total - finished;
      setJourneySummary({ total, finished, pending });

      // Next Action: 从未完成的 journey 推导，按优先级取前几条
      const pendingJourneys = surrogateJourneys.filter((j: any) => j.process_status !== 'finished');
      const now = new Date();
      let nextActionList: NextActionItem[] = pendingJourneys.slice(0, 5).map((j: any) => {
        const dueStr = j.updated_at || j.created_at;
        const dueDate = dueStr ? new Date(dueStr) : null;
        let status: TaskStatus = 'pending';
        if (j.process_status === 'finished') status = 'completed';
        else if (dueDate) {
          const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          if (daysLeft < 0) status = 'overdue';
          else if (daysLeft <= 3) status = 'dueSoon';
        }
        return {
          id: String(j.id),
          title: j.title || t('dashboard.nextActionTitle', 'Next Action'),
          dueDate: dueStr,
          status,
          linkTo: `/surrogacy/journey?caseId=${latestCase.id}`,
          linkLabel: t('dashboard.view_details', 'View'),
        };
      });
      if (nextActionList.length === 0) {
        const done = surrogateJourneys
          .filter((j: any) => j.process_status === 'finished')
          .slice()
          .sort((a: any, b: any) => {
            const ta = new Date(a.updated_at || a.created_at || 0).getTime();
            const tb = new Date(b.updated_at || b.created_at || 0).getTime();
            return tb - ta;
          })
          .slice(0, 3);
        nextActionList = done.map((j: any) => ({
          id: `done-${j.id}`,
          title: j.title || t('dashboard.recentProgress', '最近完成'),
          dueDate: j.updated_at || j.created_at,
          status: 'completed' as TaskStatus,
          linkTo: `/surrogacy/journey?caseId=${latestCase.id}`,
          linkLabel: t('dashboard.viewJourney', '查看'),
        }));
      }
      setNextActions(nextActionList);

      const cliPath = (id: string) =>
        `/surrogacy/ivf-clinic?caseId=${encodeURIComponent(id)}`;

      // Pending Documents：优先 API（缺文件或未完成的旅程任务），并辅关键词匹配
      const docKeywords = ['心理评估', '体检', '报告', '上传', 'psych', 'screening', 'report', 'upload'];
      let pendingDocList: PendingDocItem[] = [];
      try {
        const jr = await fetch(`/api/journey-get?caseId=${latestCase.id}`);
        const jd = await jr.json();
        const jList = (jd.journeys || []).filter(
          (j: any) => !j.about_role || j.about_role === 'surrogate_mother'
        );
        pendingDocList = jList
          .filter((j: any) => {
            if (j.process_status === 'finished') return false;
            const files = j.cases_files || [];
            return !files.some((f: any) => f.file_url);
          })
          .slice(0, 6)
          .map((j: any) => ({
            id: String(j.id),
            name: j.title || t('dashboard.pendingDocTask', '待提交材料'),
            requirement: j.stage ? `${t('journey.stage', '阶段')} ${j.stage}` : '',
            format: 'PDF, JPG, PNG',
            status: t('dashboard.pendingSubmit', '待提交'),
            linkTo: cliPath(String(latestCase.id)),
          }));
      } catch {
        /* ignore */
      }
      if (pendingDocList.length < 3) {
        const docJourneys = surrogateJourneys.filter((j: any) =>
          docKeywords.some(kw => (j.title || '').toLowerCase().includes(kw.toLowerCase()))
        );
        const extra = docJourneys
          .filter((j: any) => !pendingDocList.some((p) => p.id === String(j.id)))
          .slice(0, 3 - pendingDocList.length)
          .map((j: any) => ({
            id: String(j.id),
            name: j.title || t('dashboard.pendingDocumentsTitle', 'Pending Documents'),
            requirement: '',
            format: 'PDF, JPG, PNG',
            status: '待提交',
            linkTo: cliPath(String(latestCase.id)),
          }));
        pendingDocList = [...pendingDocList, ...extra];
      }
      setPendingDocs(pendingDocList.slice(0, 3));

      // 国际化阶段渲染
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
      setDataLoaded(true);

      // 异步获取预约数据
      const caseIdStr = latestCase.id?.toString();
      if (caseIdStr) {
        fetch(`/api/ivf-clinic-get?caseId=${caseIdStr}&aboutRole=surrogate_mother`)
          .then(res => res.json())
          .then(ivfRes => {
            const clinics = ivfRes.ivf_clinics || [];
            const apptClinic = clinics.find((c: any) => c.type === 'SurrogateAppointments');
            const apptData = Array.isArray(apptClinic?.data) ? apptClinic.data : [];
            const horizon = new Date();
            horizon.setDate(horizon.getDate() + 365);
            const apptList: AppointmentItem[] = apptData
              .filter((a: any) => {
                if (!a?.date) return false;
                const d = new Date(a.date);
                return d >= now && d <= horizon;
              })
              .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((a: any, i: number) => ({
                id: `appt-${i}`,
                date: a.date ? new Date(a.date).toLocaleDateString() : '',
                time: a.type || '',
                location: a.doctor ? `${a.doctor}` : 'Online',
                type: a.type || t('ivfClinic.surrogateAppointments', 'Appointment'),
                related: a.medication || '',
              }));
            setUpcomingAppointments(apptList);
          })
          .catch(() => {});
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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

  // 使用 useCallback 缓存格式化日期函数
  const formatJournalDateMemo = useCallback((dateStr: string) => {
    return formatJournalDate(dateStr);
  }, []);

  // 使用 useMemo 缓存状态映射
  const statusMap = useMemo<Record<string, string>>(() => ({
    Matching: t('statusMapping.Matching', 'Matching'),
    LegalStage: t('statusMapping.LegalStage', 'Legal Stage'),
    CyclePrep: t('statusMapping.CyclePrep', 'Cycle Prep'),
    Pregnant: t('statusMapping.Pregnant', 'Pregnant'),
    Transferred: t('statusMapping.Transferred', 'Transferred'),
  }), [t]);

  // 使用 useMemo 缓存完成百分比计算（与旅程页任务完成度一致）
  const completionPercentage = useMemo(() => {
    return journeySummary.total > 0 ? ((journeySummary.finished / journeySummary.total) * 100).toFixed(1) : '0';
  }, [journeySummary.finished, journeySummary.total]);

  const progressPercentage = useMemo(() => {
    return journeySummary.total > 0 ? ((journeySummary.pending / journeySummary.total) * 100).toFixed(1) : '0';
  }, [journeySummary.pending, journeySummary.total]);

  const totalProgressPercentage = useMemo(() => {
    return journeySummary.total > 0 ? ((journeySummary.finished / journeySummary.total) * 100).toFixed(0) : '0';
  }, [journeySummary.finished, journeySummary.total]);

  const displayName = useMemo(() => {
    const fromCase = latestCaseRaw?.surrogate_mother?.contact_information;
    if (fromCase && String(fromCase).trim()) return String(fromCase).trim();
    if (typeof document === 'undefined') return '';
    const email = getCookie('userEmail_surrogacy');
    if (email) return email.split('@')[0];
    return '';
  }, [latestCaseRaw]);

  // 使用 useCallback 缓存导航函数
  const handleNavigateToJourney = useCallback(() => {
    router.push(caseId ? `/surrogacy/journey?caseId=${encodeURIComponent(caseId)}` : '/surrogacy/journey');
  }, [router, caseId]);

  const handleNavigateToClientProfile = useCallback(() => {
    router.push('/surrogacy/intended-parents');
  }, [router]);

  const handleNavigateToDocuments = useCallback(() => {
    router.push('/surrogacy/documents');
  }, [router]);

  const handleNavigateToJournal = useCallback(() => {
    router.push('/surrogacy/journal');
  }, [router]);

  const handleNavigateToIvfClinic = useCallback(() => {
    router.push(caseId ? `/surrogacy/ivf-clinic?caseId=${caseId}` : '/surrogacy/ivf-clinic');
  }, [router, caseId]);

  const handleNavigateToAppointments = useCallback(() => {
    router.push(caseId ? `/surrogacy/ivf-clinic?caseId=${caseId}#appointments` : '/surrogacy/ivf-clinic');
  }, [router, caseId]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // 使用 useMemo 缓存当前状态的索引
  const taskStatusLabel = useCallback((s: TaskStatus) => {
    if (s === 'pending') return t('dashboard.taskStatusPending', 'Pending');
    if (s === 'dueSoon') return t('dashboard.taskStatusDueSoon', 'Due Soon');
    if (s === 'overdue') return t('dashboard.taskStatusOverdue', 'Overdue');
    return t('dashboard.taskStatusCompleted', 'Completed');
  }, [t]);

  // 使用 useMemo 缓存格式化的更新时间
  const lastUpdatedDisplay = useMemo(() => {
    return currentStatusDate ? new Date(currentStatusDate).toLocaleString() : '';
  }, [currentStatusDate]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-brand-yellow flex items-center justify-center">
        <div className="text-lg text-sage-700">{t('loading')}</div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-brand-yellow">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sage-800 mb-2">{t('dashboard.surrogacyTitle', 'DASHBOARD')}</h1>
            <p className="text-sage-600">{t('dashboard.surrogacyWelcome', 'Welcome to your Dashboard! Access your progress, important information, digital signatures, and a variety of references to support your journey.')}</p>
          </div>
          <CustomButton 
            className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            {t('refresh', 'Refresh')}
          </CustomButton>
        </div>

        {/* 顶部旅程总览 — 取代原「统计卡 + 双卡片」，数据与案例 / 旅程 / 诊所同源 */}
        <div className="rounded-2xl border border-sage-200/80 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-sage-900">
                {t('dashboard.welcomeBackName', '欢迎回来')}
                {displayName ? `, ${displayName}` : ''}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sage-800">
                <span className="text-sm font-medium text-sage-600">
                  {t('dashboard.currentStageLabel', '当前阶段')}:
                </span>
                <span className="rounded-full bg-sage-100 px-3 py-1 text-sm font-semibold text-sage-900">
                  {statusMap[currentStatus] || statusMap.Matching}
                </span>
              </div>
              <div className="flex max-w-xl flex-col gap-2 sm:flex-row sm:items-center">
                <Progress value={Number(totalProgressPercentage)} className="h-2.5 flex-1" />
                <span className="text-sm font-semibold text-sage-800 tabular-nums whitespace-nowrap">
                  {totalProgressPercentage}% {t('dashboard.completed', '已完成')}
                </span>
              </div>
              {currentStatusDate && (
                <p className="text-xs text-sage-500">
                  {t('dashboard.lastUpdatedSurrogacy', '最后更新')}: {lastUpdatedDisplay}
                </p>
              )}
            </div>
            <CustomButton
              className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-sage-700 bg-white px-5 py-2.5 text-sage-900 hover:bg-sage-50"
              onClick={handleNavigateToJourney}
            >
              {t('dashboard.viewJourneyCta', '查看旅程')}
              <ChevronRight className="h-4 w-4" />
            </CustomButton>
          </div>
          <div className="mt-6 border-t border-sage-100 pt-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sage-800">
              <Route className="h-4 w-4 text-green-700" />
              {t('dashboard.journeyProgressSurrogacy', '旅程进度')}
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {journeyStages.map((s, idx) => {
                const firstIncomplete = journeyStages.findIndex((st) => {
                  if (st.items.length === 0) return true;
                  const titles = st.items;
                  return titles.some((title) => {
                    const j = (latestCaseRaw?.journeys || []).find(
                      (x) =>
                        (!x.about_role || x.about_role === 'surrogate_mother') &&
                        (x.title === title || String(x.title) === String(title))
                    );
                    return j && j.process_status !== 'finished';
                  });
                });
                const activeIdx = firstIncomplete >= 0 ? firstIncomplete : journeyStages.length - 1;
                const isPast = idx < activeIdx;
                const isCurrent = idx === activeIdx;
                return (
                  <div
                    key={idx}
                    className="flex min-w-[4.5rem] flex-col items-center gap-1"
                    title={s.stage}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                        isPast
                          ? 'border-green-600 bg-green-600 text-white'
                          : isCurrent
                            ? 'border-green-600 bg-white text-green-700 ring-2 ring-green-200'
                            : 'border-sage-200 bg-sage-100 text-sage-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`max-w-[5.5rem] truncate text-center text-[10px] leading-tight ${
                        isCurrent ? 'font-semibold text-sage-900' : 'text-sage-500'
                      }`}
                    >
                      {s.stage}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-sage-600">
              <span>
                {t('dashboard.tasksCompletedLabel', '任务完成')}:{' '}
                <strong className="text-sage-900">
                  {journeySummary.finished}/{Math.max(1, journeySummary.total)}
                </strong>
              </span>
              {pendingDocs.length > 0 && (
                <span className="text-amber-800">
                  {t('dashboard.pendingDocsShort', '待交文件')}: {pendingDocs.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Next Action + Pending Documents + Upcoming Appointments：各展示前 3 条 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Action */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Activity className="w-5 h-5" />
                {t('dashboard.nextAction', 'Next Action')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextActions.length === 0 ? (
                <p className="text-sm text-sage-500">{t('dashboard.no_updates', 'No updates needed.')}</p>
              ) : (
                nextActions.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer"
                    onClick={() => item.linkTo && router.push(item.linkTo)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-sage-800 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          item.status === 'dueSoon' ? 'bg-amber-100 text-amber-700' :
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-sage-200 text-sage-700'
                        }`}>
                          {taskStatusLabel(item.status)}
                        </span>
                        {item.dueDate && (
                          <span className="text-xs text-sage-500">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <CustomButton
                      className="ml-2 px-3 py-1 text-xs bg-sage-600 text-white rounded hover:bg-sage-700"
                      onClick={(e) => { e.stopPropagation(); item.linkTo && router.push(item.linkTo); }}
                    >
                      {item.linkLabel || t('dashboard.view_details', 'View')}
                    </CustomButton>
                  </div>
                ))
              )}
              <CustomButton
                className="w-full justify-center mt-2 bg-sage-100 text-sage-800 hover:bg-sage-200 text-sm"
                onClick={handleNavigateToJourney}
              >
                {t('dashboard.goToJourney', 'My Journey')}
              </CustomButton>
            </CardContent>
          </Card>

          {/* Pending Documents */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <FileText className="w-5 h-5" />
                {t('dashboard.pendingDocumentsTitle', 'Pending Documents')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingDocs.length === 0 ? (
                <p className="text-sm text-sage-500">{t('dashboard.noPendingDocuments', 'No pending documents')}</p>
              ) : (
                pendingDocs.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-amber-50 rounded-lg border border-amber-100"
                  >
                    <p className="text-sm font-medium text-sage-800">{doc.name}</p>
                    {doc.requirement && <p className="text-xs text-sage-600 mt-1">{doc.requirement}</p>}
                    {doc.format && (
                      <p className="text-xs text-sage-500 mt-1">{t('dashboard.requiredFormat', 'Accepted formats')}: {doc.format}</p>
                    )}
                    <CustomButton
                      className="mt-2 px-3 py-1 text-xs bg-sage-600 text-white rounded hover:bg-sage-700"
                      onClick={() => router.push(doc.linkTo)}
                    >
                      {t('dashboard.uploadNow', 'Upload')}
                    </CustomButton>
                  </div>
                ))
              )}
              <CustomButton
                className="w-full justify-center mt-2 bg-sage-100 text-sage-800 hover:bg-sage-200 text-sm"
                onClick={handleNavigateToIvfClinic}
              >
                {t('dashboard.goToClinicWorkflow', 'Clinic Workflow')}
              </CustomButton>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <CalendarDays className="w-5 h-5" />
                {t('dashboard.upcomingAppointmentsTitle', 'Upcoming Appointments')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-sage-500">{t('dashboard.noUpcomingAppointments', 'No upcoming appointments')}</p>
              ) : (
                upcomingAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer"
                    onClick={handleNavigateToAppointments}
                  >
                    <div>
                      <p className="text-sm font-medium text-sage-800">{apt.date} {apt.time}</p>
                      <p className="text-xs text-sage-600">{apt.location} · {apt.type}</p>
                      {apt.related && <p className="text-xs text-sage-500 mt-1">{apt.related}</p>}
                    </div>
                    <span className="text-xs text-sage-500">{t('dashboard.viewAppointmentDetail', 'View detail')}</span>
                  </div>
                ))
              )}
              <CustomButton
                className="w-full justify-center mt-2 bg-sage-100 text-sage-800 hover:bg-sage-200 text-sm"
                onClick={handleNavigateToAppointments}
              >
                {t('dashboard.viewAllAppointments', 'View all')}
              </CustomButton>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Settings className="w-5 h-5" />
{t('dashboard.quickActionsSurrogacy', 'Quick Actions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickActionButton 
                label={t('dashboard.clientProfileSurrogacy', 'Client Profile')}
                IconComponent={Users}
                bgColor="bg-sage-100"
                textColor="text-sage-800"
                onClick={handleNavigateToClientProfile}
              />
              <QuickActionButton 
                label={t('dashboard.myJourneySurrogacy', 'My Journey')}
                IconComponent={Activity}
                bgColor="bg-blue-100"
                textColor="text-blue-800"
                onClick={handleNavigateToJourney}
              />
              <QuickActionButton 
                label={t('dashboard.documentsSurrogacy', 'Documents')}
                IconComponent={FileText}
                bgColor="bg-green-100"
                textColor="text-green-800"
                onClick={handleNavigateToDocuments}
              />
            </CardContent>
          </Card>

          {/* Journal & Communication */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <BookOpen className="w-5 h-5" />
{t('dashboard.journalCommunication', 'Journal & Communication')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer"
                     onClick={handleNavigateToJournal}>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-sage-800">{t('dashboard.uploadJournal', 'Upload Journal')}</span>
                  </div>
                  <span className="text-xs text-sage-600">
                {loadingJournal
                      ? t("loadingText", "Loading...")
                  : latestJournalTime
                        ? formatJournalDateMemo(latestJournalTime)
                        : t("dashboard.noJournal", "No journal yet")}
              </span>
            </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer"
                     onClick={handleNavigateToIvfClinic}>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium text-sage-800">{t('dashboard.ivfClinicSurrogacy', 'Ivf Clinic')}</span>
            </div>
                  <span className="text-xs text-sage-600">{t('dashboard.medicalTeamUpdatesSurrogacy', 'Medical team & updates')}</span>
            </div>
          </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
