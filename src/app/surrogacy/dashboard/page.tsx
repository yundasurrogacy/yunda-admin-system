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
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  BarChart3,
  Activity,
  UserCheck,
  FileCheck,
  CalendarDays,
  RefreshCw,
  Heart,
  Baby,
  Home,
  Settings,
  MessageCircle,
  Shield,
  BookOpen,
  Camera,
  Mail
} from "lucide-react"

// 状态阶段映射（移到组件外部，避免每次渲染重新创建）
const STATUS_STAGE_MAP: Record<string, number> = {
  Matching: 0,
  LegalStage: 1,
  CyclePrep: 2,
  Pregnant: 3,
  Transferred: 4,
};

// 状态列表（移到组件外部）
const STATUS_LIST = ['Matching', 'LegalStage', 'CyclePrep', 'Pregnant', 'Transferred'] as const;

// 优化的进度步骤组件
const ProgressStep = memo(({ 
  status, 
  idx, 
  isActive, 
  isCurrent, 
  statusLabel
}: { 
  status: string; 
  idx: number; 
  isActive: boolean; 
  isCurrent: boolean; 
  statusLabel: string;
}) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
      isActive ? 'bg-sage-600 text-white' : 'bg-sage-200 text-sage-600'
    }`}>
      {idx + 1}
    </div>
    <div className="flex-1">
      <div className={`text-sm font-medium ${
        isCurrent ? 'text-sage-800' : isActive ? 'text-sage-700' : 'text-sage-500'
      }`}>
        {statusLabel}
      </div>
    </div>
    {isCurrent && (
      <Clock className="w-4 h-4 text-sage-600" />
    )}
    {isActive && !isCurrent && (
      <CheckCircle className="w-4 h-4 text-green-500" />
    )}
  </div>
));

ProgressStep.displayName = 'ProgressStep';

// 优化的统计卡片组件
const StatCard = memo(({ 
  title, 
  value, 
  IconComponent, 
  iconBgColor, 
  iconColor,
  subtitle,
  SubtitleIcon,
  onClick 
}: { 
  title: string; 
  value: number; 
  IconComponent: React.ComponentType<{ className?: string }>; 
  iconBgColor: string;
  iconColor: string;
  subtitle: string;
  SubtitleIcon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) => (
  <Card 
    className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-sage-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-sage-800">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm text-sage-600">
          <SubtitleIcon className="w-4 h-4 mr-1" />
          {subtitle}
        </div>
      </div>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

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
      setCurrentStatus(latestCase.process_status || "Matching");
      setCurrentStatusDate(latestCase.updated_at || "");
      setCaseId(latestCase.id?.toString() || "");
      let journeys: JourneyRaw[] = latestCase.journeys || [];
      // 汇总 about_role 为 surrogate_mother 的 journey
      // 这里假设 journeyRaw 里有 about_role 字段，若无则全部统计
      const surrogateJourneys = journeys.filter((j: any) => !j.about_role || j.about_role === 'surrogate_mother');
      const total = surrogateJourneys.length;
      const finished = surrogateJourneys.filter(j => j.process_status === 'finished').length;
      const pending = total - finished;
      setJourneySummary({ total, finished, pending });
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
      setDataLoaded(true);
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

  // 使用 useMemo 缓存完成百分比计算
  const completionPercentage = useMemo(() => {
    return journeySummary.total > 0 ? ((journeySummary.finished / journeySummary.total) * 100).toFixed(1) : '0';
  }, [journeySummary.finished, journeySummary.total]);

  const progressPercentage = useMemo(() => {
    return journeySummary.total > 0 ? ((journeySummary.pending / journeySummary.total) * 100).toFixed(1) : '0';
  }, [journeySummary.pending, journeySummary.total]);

  const totalProgressPercentage = useMemo(() => {
    return journeySummary.total > 0 ? ((journeySummary.finished / journeySummary.total) * 100).toFixed(0) : '0';
  }, [journeySummary.finished, journeySummary.total]);

  // 使用 useCallback 缓存导航函数
  const handleNavigateToJourney = useCallback(() => {
    router.push('/surrogacy/journey');
  }, [router]);

  const handleNavigateToMyCase = useCallback(() => {
    if (caseId) {
      router.push('/surrogacy/my-case');
    }
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
    router.push('/surrogacy/ivf-clinic');
  }, [router]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // 使用 useMemo 缓存当前状态的索引
  const currentStatusIdx = useMemo(() => STATUS_STAGE_MAP[currentStatus], [currentStatus]);

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

        {/* Journey Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title={t('dashboard.totalJourneysSurrogacy', 'Total Journeys')}
            value={journeySummary.total}
            IconComponent={Activity}
            iconBgColor="bg-pink-100"
            iconColor="text-pink-600"
            subtitle={t('dashboard.surrogateJourneys', 'Surrogate journeys')}
            SubtitleIcon={TrendingUp}
            onClick={handleNavigateToJourney}
          />
          
          <StatCard 
            title={t('dashboard.completedSurrogacy', 'Completed')}
            value={journeySummary.finished}
            IconComponent={CheckCircle}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            subtitle={t('dashboard.finishedJourneysSurrogacy', 'Finished journeys')}
            SubtitleIcon={CheckCircle}
            onClick={handleNavigateToJourney}
          />
          
          <StatCard 
            title={t('dashboard.inProgressSurrogacy', 'In Progress')}
            value={journeySummary.pending}
            IconComponent={Clock}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
            subtitle={t('dashboard.activeJourneysSurrogacy', 'Active journeys')}
            SubtitleIcon={Clock}
            onClick={handleNavigateToJourney}
          />
        </div>

        {/* Current Status & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Status */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToMyCase}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Baby className="w-5 h-5" />
{t('dashboard.currentStatusSurrogacy', 'Current Status')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-sage-700">{t('dashboard.caseStatusSurrogacy', 'Case Status')}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                    {statusMap[currentStatus] || statusMap.Matching}
                  </span>
        </div>
                
                {/* Progress Steps */}
                <div className="space-y-3">
                  {STATUS_LIST.map((status, idx) => {
                    const isActive = typeof currentStatusIdx === 'number' && idx <= currentStatusIdx;
                    const isCurrent = idx === currentStatusIdx;
                    
                    return (
                      <ProgressStep
                        key={status}
                        status={status}
                        idx={idx}
                        isActive={isActive}
                        isCurrent={isCurrent}
                        statusLabel={t(`statusMapping.${status}`, status)}
                      />
                    );
                  })}
        </div>
                
                {currentStatusDate && (
                  <div className="text-xs text-sage-500 pt-2 border-t">
                    {t('dashboard.lastUpdatedSurrogacy', 'Last updated')}: {lastUpdatedDisplay}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Journey Progress */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToJourney}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <BarChart3 className="w-5 h-5" />
{t('dashboard.journeyProgressSurrogacy', 'Journey Progress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sage-700">{t('dashboard.completedProgressSurrogacy', 'Completed')}</span>
                    <span className="text-sm text-sage-600">{journeySummary.finished} ({completionPercentage}%)</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500 bg-green-500"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sage-700">{t('dashboard.inProgressProgressSurrogacy', 'In Progress')}</span>
                    <span className="text-sm text-sage-600">{journeySummary.pending} ({progressPercentage}%)</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500 bg-orange-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sage-600">{t('dashboard.totalProgressSurrogacy', 'Total Progress')}</span>
                    <span className="font-medium text-sage-800">
                      {totalProgressPercentage}%
                    </span>
            </div>
          </div>
        </div>
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
