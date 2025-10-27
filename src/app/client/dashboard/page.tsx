"use client"

import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/CustomButton"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { useTranslation } from "react-i18next"
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
  Shield
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

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

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
    const parentId = getCookie('userId_client');
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
  const [dataLoaded, setDataLoaded] = useState(false);
  // 汇总 about_role 为 intended_parent 的 journey
  const [journeySummary, setJourneySummary] = useState({ total: 0, finished: 0, pending: 0 });
  // IVF CLINIC 和 Trust Balance 数据
  const [ivfClinicData, setIvfClinicData] = useState<any>(null);
  const [trustBalance, setTrustBalance] = useState<number>(0);

  // 获取动态 journey 阶段数据和最新文件/journey
  useEffect(() => {
    if (dataLoaded) return;
    let ignore = false;
    setLoadingTimeline(true);
    getLatestCaseAndTimeline(t).then(data => {
      if (!ignore && data) {
        let latestCase = null;
        if (!Array.isArray(data) && data.timeline && (data.latestFile || data.latestJourney)) {
          setTimeline(data.timeline);
          setLatestFile(data.latestFile);
          setLatestJourney(data.latestJourney);
        } else if (Array.isArray(data)) {
          setTimeline(data);
        }
        // 重新获取最新 case 以获取 process_status 和 updated_at，并统计 intended_parent journey
        (async () => {
          const parentId = getCookie('userId_client');
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
            // 汇总 about_role 为 intended_parent 的 journey
            const journeys = Array.isArray(latestCase.journeys) ? latestCase.journeys : [];
            // console.log('[Dashboard] journeys:', journeys);
            const intendedJourneys = journeys.filter((j: any) => !j.about_role || j.about_role === 'intended_parent');
            const total = intendedJourneys.length;
            const finished = intendedJourneys.filter((j: { process_status?: string }) => j.process_status === 'finished').length;
            const pending = total - finished;
            setJourneySummary({ total, finished, pending });
            
            // 获取 IVF CLINIC 数据
            if (Array.isArray(latestCase.ivf_clinics) && latestCase.ivf_clinics.length > 0) {
              setIvfClinicData(latestCase.ivf_clinics[0]);
            }
            
            // 获取 Trust Balance
            setTrustBalance(latestCase.trust_account_balance || 0);
          }
        })();
      }
      setLoadingTimeline(false);
      setDataLoaded(true);
    });
    return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    router.push('/client/journey');
  }, [router]);

  const handleNavigateToSurrogateProfile = useCallback(() => {
    router.push('/client/surrogate-match');
  }, [router]);

  const handleNavigateToDocuments = useCallback(() => {
    router.push('/client/documents');
  }, [router]);

  const handleNavigateToIvfClinic = useCallback(() => {
    router.push('/client/ivf-clinic');
  }, [router]);

  const handleNavigateToTrustAccount = useCallback(() => {
    router.push('/client/trust-account');
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

  if (isLoading || !isAuthenticated || user?.role !== 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-brand-yellow">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sage-800 mb-2">{t('dashboard.clientTitle', 'DASHBOARD')}</h1>
            <p className="text-sage-600">{t('dashboard.clientWelcome', 'Welcome to your journey! Track your progress and access important information.')}</p>
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
          {/* Total Journeys */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToJourney}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.totalJourneysClient', 'Total Journeys')}</p>
                  <p className="text-3xl font-bold text-sage-800">{journeySummary.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {t('dashboard.intendedParentJourneys', 'Intended parent journeys')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Journeys */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToJourney}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.completedClient', 'Completed')}</p>
                  <p className="text-3xl font-bold text-sage-800">{journeySummary.finished}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {t('dashboard.finishedJourneys', 'Finished journeys')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToJourney}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
      <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.inProgressClient', 'In Progress')}</p>
                  <p className="text-3xl font-bold text-sage-800">{journeySummary.pending}</p>
      </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
        </div>
        </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {t('dashboard.activeJourneys', 'Active journeys')}
        </div>
      </div>
            </CardContent>
          </Card>
      </div>


        {/* Current Status & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Status */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
          onClick={handleNavigateToSurrogateProfile}
        >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Heart className="w-5 h-5" />
                {t('dashboard.currentStatus', 'Current Status')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-sage-700">{t('dashboard.caseStatus', 'Case Status')}</span>
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
                    {t('dashboard.lastUpdated', 'Last updated')}: {lastUpdatedDisplay}
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
                {t('dashboard.journeyProgressClient', 'Journey Progress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sage-700">{t('dashboard.completedProgress', 'Completed')}</span>
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
                    <span className="text-sm font-medium text-sage-700">{t('dashboard.inProgressProgress', 'In Progress')}</span>
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
                    <span className="text-sage-600">{t('dashboard.totalProgress', 'Total Progress')}</span>
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
                {t('dashboard.quickActionsClient', 'Quick Actions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-sage-100 hover:bg-sage-200 text-sage-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={handleNavigateToSurrogateProfile}
              >
                <Heart className="w-4 h-4 mr-3" />
                {t('dashboard.surrogateProfile', 'Surrogate Profile')}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={handleNavigateToJourney}
              >
                <Activity className="w-4 h-4 mr-3" />
                {t('dashboard.myJourney', 'My Journey')}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={handleNavigateToDocuments}
              >
                <FileText className="w-4 h-4 mr-3" />
                {t('dashboard.documentsClient', 'Documents')}
  </CustomButton>
            </CardContent>
          </Card>

          {/* IVF CLINIC & Trust Account */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Shield className="w-5 h-5" />
                {t('dashboard.ivfClinic', 'Ivf Clinic')} & {t('dashboard.trustAccount', 'Trust Account')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* IVF CLINIC */}
                <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer"
                     onClick={handleNavigateToIvfClinic}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-sage-800">{t('dashboard.ivfClinic', 'Ivf Clinic')}</span>
                      <p className="text-xs text-sage-600">{t('dashboard.medicalTeamUpdates', 'Medical team & updates')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-sage-800">
                      {ivfClinicData ? (ivfClinicData.type || t('dashboard.clinicInfo', 'Clinic Info')) : t('dashboard.noData', 'No Data')}
                    </p>
                  </div>
      </div>

                {/* Trust Balance */}
                <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer"
                     onClick={handleNavigateToTrustAccount}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-sage-800">{t('dashboard.trustAccount', 'Trust Account')}</span>
                      <p className="text-xs text-sage-600">{t('dashboard.accountBalance', 'Account balance')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-sage-800">${trustBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
