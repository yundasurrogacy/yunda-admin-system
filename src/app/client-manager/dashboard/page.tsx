'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/CustomButton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useTranslation } from 'react-i18next'

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Activity,
  UserCheck,
  FileCheck,
  CalendarDays,
  RefreshCw
} from 'lucide-react'

interface Journey {
  id: string;
  created_at: string;
  updated_at: string;
  case_cases?: string;
  stage?: string;
  title?: string;
  process_status: string;
  about_role?: string;
  cases_files?: CaseFile[];
}

interface CaseFile {
  id: string;
  file_url?: string;
  category?: string;
  created_at: string;
  about_role?: string;
  journey_journeys?: string;
  note?: string;
}

interface Case {
  id: string;
  surrogate_mother: { id: string; email?: string; contact_information?: string, name?: string } | null;
  intended_parent: { id: string; email?: string; basic_information?: string, name?: string } | null;
  cases_files: CaseFile[];
  ivf_clinics: { id:string; type?: string; created_at: string; data?: string }[];
  process_status: string;
  trust_account_balance?: number;
  updated_at?: string;
  next_appointment_date?: string;
  pending_documents_count?: number;
  contract_status?: string;
  journeys?: Journey[];
}

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation('common');
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // 状态管理
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_manager')
      const userEmail = getCookie('userEmail_manager')
      const userId = getCookie('userId_manager')
      const authed = !!(userRole && userEmail && userId && userRole === 'manager')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client-manager/login')
      }
    }
  }, [router]);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 统计数据计算 - 使用 useMemo 缓存
  const stats = useMemo(() => {
    if (!cases.length) {
      return {
        totalCases: 0,
        caseStatusCount: {},
        totalJourneys: 0,
        journeyStatusCount: {},
        totalFiles: 0,
        fileRoleCount: {}
      }
    }

    // 1. Cases 按 process_status 分类
    const caseStatusCount = cases.reduce((acc, c) => {
      const status = c.process_status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 2. Journeys 按状态分类
    const allJourneys: Journey[] = cases.flatMap(c => c.journeys || []);
    const journeyStatusCount = allJourneys.reduce((acc, j) => {
      let status = j.process_status;
      if (!status || status === null || status === undefined) status = 'pending';
      if (status !== 'pending' && status !== 'finished') status = 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 3. Documents 按 about_role 分类（GC/IP）
    const allFiles: CaseFile[] = cases.flatMap(c => c.cases_files || []);
    const fileRoleCount = allFiles.reduce((acc, f) => {
      const role = f.about_role || 'Unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCases: cases.length,
      caseStatusCount,
      totalJourneys: allJourneys.length,
      journeyStatusCount,
      totalFiles: allFiles.length,
      fileRoleCount
    }
  }, [cases]);

  // 使用 useCallback 缓存获取案例数据函数
  const fetchCases = useCallback(async (force: boolean = false) => {
    if (!force && dataLoaded) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const managerId = typeof document !== 'undefined' ? getCookie('userId_manager') : null;
      if (!managerId) {
        setError(t('dashboard.errors.noManagerId', 'No manager ID found'));
        setCases([]);
        return;
      }
      
      const res = await fetch(`/api/cases-by-manager?managerId=${managerId}`);
      if (!res.ok) {
        throw new Error(t('dashboard.errors.fetchFailed', 'Failed to fetch cases'));
      }
      
      const data = await res.json();
      console.log('Cases data:', data);
      setCases(Array.isArray(data) ? data : []);
      setDataLoaded(true);
    } catch (error: any) {
      console.error('Failed to fetch cases:', error);
      setError(error.message || t('dashboard.errors.unknownError', 'Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [t, dataLoaded]);

  // 使用 useCallback 缓存刷新数据函数
  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    await fetchCases(true)
    setIsRefreshing(false)
  }, [fetchCases]);

  // 使用 useCallback 缓存处理案例点击函数
  const handleCaseClick = useCallback((caseId: string) => {
    setSelectedCase(caseId)
    router.push(`/client-manager/my-cases`)
  }, [router]);

  // 只在认证后才加载数据
  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      fetchCases(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 将辅助函数移到组件外部，避免每次渲染重新创建
  const getParentName = useCallback((parent: any) => {
    if (!parent) return t('N/A');
    if (parent.name) return parent.name;
    if (parent.basic_information) {
      try {
        const info = typeof parent.basic_information === 'string' ? JSON.parse(parent.basic_information) : parent.basic_information;
        return info.firstName || parent.email;
      } catch {
        return parent.basic_information || parent.email;
      }
    }
    return parent.email;
  }, [t]);

  const getSurrogateName = useCallback((surrogate: any) => {
    if (!surrogate) return t('N/A');
    if (surrogate.name) return surrogate.name;
    if (surrogate.contact_information) {
      try {
        const info = typeof surrogate.contact_information === 'string' ? JSON.parse(surrogate.contact_information) : surrogate.contact_information;
        return info.first_name || surrogate.email;
      } catch {
        return surrogate.contact_information || surrogate.email;
      }
    }
    return surrogate.email;
  }, [t]);

  // 使用 useMemo 缓存状态颜色映射
  const getStatusColor = useMemo(() => (status: string) => {
    const colorMap: Record<string, string> = {
      'Matching': 'bg-blue-400',
      'LegalStage': 'bg-yellow-400',
      'CyclePrep': 'bg-orange-400',
      'Pregnant': 'bg-green-400',
      'Transferred': 'bg-purple-400',
      'pending': 'bg-yellow-400',
      'finished': 'bg-green-400',
      'intended_parent': 'bg-blue-400',
      'surrogate_mother': 'bg-pink-400',
      'Unknown': 'bg-gray-400'
    };
    return colorMap[status] || 'bg-gray-400';
  }, []);

  // 使用 useMemo 缓存状态标签映射
  const getStatusLabel = useMemo(() => (status: string) => {
    const labelMap: Record<string, string> = {
      'Matching': t('statusMapping.Matching', 'Matching'),
      'LegalStage': t('statusMapping.LegalStage', 'Legal Stage'),
      'CyclePrep': t('statusMapping.CyclePrep', 'Cycle Prep'),
      'Pregnant': t('statusMapping.Pregnant', 'Pregnancy'),
      'Transferred': t('statusMapping.Transferred', 'Transferred'),
      'pending': t('journey.status.pending', 'Pending'),
      'finished': t('journey.status.finished', 'Finished'),
      'intended_parent': t('intendedParent', 'Intended Parent'),
      'surrogate_mother': t('surrogateMother', 'Surrogate Mother'),
      'Unknown': t('N/A', 'Unknown')
    };
    return labelMap[status] || status;
  }, [t]);

  // 使用 useMemo 缓存计算值
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const todaysTasksCount = useMemo(() => 
    cases.filter(c => c.next_appointment_date === today).length,
    [cases, today]
  );
  
  const pendingDocumentsCount = useMemo(() => 
    cases.reduce((acc, c) => acc + (c.pending_documents_count || 0), 0),
    [cases]
  );
  
  const pendingContractsCount = useMemo(() => 
    cases.filter(c => c.contract_status === 'pending').length,
    [cases]
  );

  const weeklyUpdates = useMemo(() => 
    cases.filter(c => c.next_appointment_date && new Date(c.next_appointment_date) > new Date()).slice(0, 5),
    [cases]
  );
  
  const latestUpdates = useMemo(() => 
    cases.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()).slice(0, 5),
    [cases]
  );

  // 缓存导航处理函数
  const handleNavigateToCases = useCallback(() => {
    router.push('/client-manager/my-cases');
  }, [router]);

  const handleNavigateToClientProfiles = useCallback(() => {
    router.push('/client-manager/client-profiles');
  }, [router]);

  const handleNavigateToSurrogateProfiles = useCallback(() => {
    router.push('/client-manager/surrogate-profiles');
  }, [router]);

  const handleNavigateToDocuments = useCallback(() => {
    router.push('/client-manager/documents');
  }, [router]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-brand-yellow">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-sage-700">{t('loading')}</div>
          </div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-brand-yellow p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-3">{t('dashboard.errors.title', 'Loading Failed')}</h3>
              <p className="text-sage-600 mb-6 max-w-md">{error}</p>
          <CustomButton 
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={handleReload}
          >
                <RefreshCw className="w-4 h-4 mr-2" />
            {t('dashboard.actions.reload', 'Reload')}
          </CustomButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-brand-yellow">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sage-800 mb-2">{t('dashboard.clientManagerTitle', 'Client Manager Dashboard')}</h1>
            <p className="text-sage-600">{t('dashboard.clientManagerWelcome', 'Welcome back! Here\'s your overview of active cases and activities.')}</p>
          </div>
        <CustomButton 
            className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          onClick={refreshData}
          disabled={isRefreshing}
        >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t('dashboard.refreshing', 'Refreshing...') : t('dashboard.refresh', 'Refresh')}
        </CustomButton>
      </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Cases */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToCases}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.totalCases', 'Total Cases')}</p>
                  <p className="text-3xl font-bold text-sage-800">{isLoading ? '...' : stats.totalCases}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {t('dashboard.activeCasesInProgress', 'Active cases in progress')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Journeys */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.totalJourneys', 'Journeys')}</p>
                  <p className="text-3xl font-bold text-sage-800">{isLoading ? '...' : stats.totalJourneys}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  {t('dashboard.processJourneysTracked', 'Process journeys tracked')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Documents */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToDocuments}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.totalDocuments', 'Documents')}</p>
                  <p className="text-3xl font-bold text-sage-800">{isLoading ? '...' : stats.totalFiles}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <FileCheck className="w-4 h-4 mr-1" />
                  {t('dashboard.filesManaged', 'Files managed')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.todaysTasks', 'Today\'s Tasks')}</p>
                  <p className="text-3xl font-bold text-sage-800">{stats.journeyStatusCount.pending || 0}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {t('dashboard.pendingJourneys', 'Pending journeys')}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Status Distribution */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={handleNavigateToCases}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <BarChart3 className="w-5 h-5" />
                {t('dashboard.caseStatusDistribution', 'Case Status Distribution')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
            {Object.entries(stats.caseStatusCount).map(([status, count]) => {
              const percentage = stats.totalCases > 0 ? (count / stats.totalCases) * 100 : 0;
              return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-sage-700">{getStatusLabel(status)}</span>
                        <span className="text-sm text-sage-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }} 
                    ></div>
                  </div>
                      </div>
                </div>
              );
            })}
          </div>
            </CardContent>
        </Card>

          {/* Journey Progress */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Activity className="w-5 h-5" />
                {t('dashboard.journeyProgress', 'Journey Progress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
            {['pending', 'finished'].map((status) => {
              const count = stats.journeyStatusCount[status] || 0;
              const percentage = stats.totalJourneys > 0 ? (count / stats.totalJourneys) * 100 : 0;
              return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {status === 'finished' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="text-sm font-medium text-sage-700">{getStatusLabel(status)}</span>
                        </div>
                        <span className="text-sm text-sage-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }} 
                    ></div>
                  </div>
                      </div>
                </div>
              );
            })}
          </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <UserCheck className="w-5 h-5" />
                {t('dashboard.quickActions', 'Quick Actions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-sage-100 hover:bg-sage-200 text-sage-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={handleNavigateToCases}
              >
                <Users className="w-4 h-4 mr-3" />
                {t('dashboard.viewAllCases', 'View All Cases')}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={handleNavigateToClientProfiles}
              >
                <UserCheck className="w-4 h-4 mr-3" />
                {t('dashboard.manageClients', 'Manage Clients')}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={handleNavigateToSurrogateProfiles}
              >
                <UserCheck className="w-4 h-4 mr-3" />
                {t('dashboard.manageSurrogates', 'Manage Surrogates')}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={handleNavigateToDocuments}
              >
                <FileText className="w-4 h-4 mr-3" />
                {t('dashboard.documentCenter', 'Document Center')}
              </CustomButton>
            </CardContent>
        </Card>

          {/* Recent Updates */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Activity className="w-5 h-5" />
                {t('dashboard.recentActivity', 'Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestUpdates.length > 0 ? (
                  latestUpdates.map((caseItem, index) => (
                    <div key={caseItem.id} className="flex items-center gap-4 p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md"
                         onClick={() => handleCaseClick(caseItem.id)}>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-sage-200 text-sage-700">
                          {getParentName(caseItem.intended_parent)?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sage-800 truncate">
                          {getParentName(caseItem.intended_parent)} & {getSurrogateName(caseItem.surrogate_mother)}
                        </p>
                        <p className="text-xs text-sage-600">
                          Status: {getStatusLabel(caseItem.process_status)} • 
                          Updated: {new Date(caseItem.updated_at || '').toLocaleDateString()}
                        </p>
          </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(caseItem.process_status)}`}></div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sage-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t('dashboard.noRecentActivity', 'No recent activity')}</p>
                </div>
                )}
          </div>
            </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
