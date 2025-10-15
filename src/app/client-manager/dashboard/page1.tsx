'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/CustomButton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

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
  
  // 状态管理
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 统计数据计算
  const stats = React.useMemo(() => {
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

  // 刷新数据
  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchCases()
    setIsRefreshing(false)
  }

  // 处理案例点击
  const handleCaseClick = (caseId: string) => {
    setSelectedCase(caseId)
    router.push(`/client-manager/my-cases`)
  }

  // 获取案例数据
  const fetchCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      function getCookie(name: string) {
        if (typeof document === 'undefined') return undefined;
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : undefined;
      }
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
    } catch (error: any) {
      console.error('Failed to fetch cases:', error);
      setError(error.message || t('dashboard.errors.unknownError', 'Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchCases()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getParentName = (parent: any) => {
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
  };

  const getSurrogateName = (surrogate: any) => {
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
  };

  // 状态颜色映射
  const getStatusColor = (status: string) => {
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
  };

  // 状态标签映射
  const getStatusLabel = (status: string) => {
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
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysTasksCount = cases.filter(c => c.next_appointment_date === today).length;
  const pendingDocumentsCount = cases.reduce((acc, c) => acc + (c.pending_documents_count || 0), 0);
  const pendingContractsCount = cases.filter(c => c.contract_status === 'pending').length;

  const weeklyUpdates = cases.filter(c => c.next_appointment_date && new Date(c.next_appointment_date) > new Date()).slice(0, 5);
  const latestUpdates = cases.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()).slice(0, 5);

  // 错误状态
  if (error) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-xl">
          <div className="text-4xl text-red-400 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">{t('dashboard.errors.title', 'Loading Failed')}</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-4">{error}</p>
          <CustomButton 
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            {t('dashboard.actions.reload', 'Reload')}
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-main-bg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-sage-800">{t('dashboard.title')}</h1>
        <CustomButton 
          className="px-4 py-2 bg-sage-100 hover:bg-sage-200 text-sage-800 rounded-lg transition-colors"
          onClick={refreshData}
          disabled={isRefreshing}
        >
          {isRefreshing ? t('dashboard.refreshing', 'Refreshing...') : t('dashboard.refresh', 'Refresh')}
        </CustomButton>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Cases 统计 */}
        <Card className="p-6 rounded-xl bg-white text-sage-800 font-medium shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">{t('dashboard.totalActiveCases', 'Total Cases')}</h2>
            <div className="text-3xl font-bold text-sage-600">{isLoading ? '...' : stats.totalCases}</div>
          </div>
          {/* 状态分布条形图 */}
          <div className="space-y-2">
            {Object.entries(stats.caseStatusCount).map(([status, count]) => {
              const percentage = stats.totalCases > 0 ? (count / stats.totalCases) * 100 : 0;
              return (
                <div key={status} className="flex items-center space-x-3">
                  <div className="w-24 text-xs text-sage-600">{getStatusLabel(status)}</div>
                  <div className="flex-1 h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%` }} 
                      className={`h-full ${getStatusColor(status)} transition-all duration-300`}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-sage-600 text-right">{count}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Journeys 统计 */}
        <Card className="p-6 rounded-xl bg-white text-sage-800 font-medium shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">{t('dashboard.journeys', 'Journeys')}</h2>
            <div className="text-3xl font-bold text-sage-600">{isLoading ? '...' : stats.totalJourneys}</div>
          </div>
          {/* 状态分布条形图 */}
          <div className="space-y-2">
            {['pending', 'finished'].map((status) => {
              const count = stats.journeyStatusCount[status] || 0;
              const percentage = stats.totalJourneys > 0 ? (count / stats.totalJourneys) * 100 : 0;
              return (
                <div key={status} className="flex items-center space-x-3">
                  <div className="w-24 text-xs text-sage-600">{getStatusLabel(status)}</div>
                  <div className="flex-1 h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%` }} 
                      className={`h-full ${getStatusColor(status)} transition-all duration-300`}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-sage-600 text-right">{count}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Documents 统计 */}
        <Card className="p-6 rounded-xl bg-white text-sage-800 font-medium shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">{t('dashboard.documents', 'Documents')}</h2>
            <div className="text-3xl font-bold text-sage-600">{isLoading ? '...' : stats.totalFiles}</div>
          </div>
          {/* 角色分布条形图 */}
          <div className="space-y-2">
            {Object.entries(stats.fileRoleCount).map(([role, count]) => {
              const percentage = stats.totalFiles > 0 ? (count / stats.totalFiles) * 100 : 0;
              return (
                <div key={role} className="flex items-center space-x-3">
                  <div className="w-24 text-xs text-sage-600">{getStatusLabel(role)}</div>
                  <div className="flex-1 h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%` }} 
                      className={`h-full ${getStatusColor(role)} transition-all duration-300`}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-sage-600 text-right">{count}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Latest Updates */}
      <Card className="rounded-xl bg-white text-sage-800 font-medium shadow-sm mb-8">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-6 text-sage-800">{t('dashboard.latest_update')}</h2>
          <div className="relative">
            {isLoading ? (
              <div className="text-center py-4">{t('loadingText')}</div>
            ) : latestUpdates.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto">
                {latestUpdates.map((update) => (
                  <div key={update.id} className="flex-none w-48">
                    <div className="bg-sage-50 rounded-lg p-4 text-center text-sage-800 font-medium">
                      <Avatar className="w-12 h-12 mx-auto mb-3">
                        <AvatarFallback className="bg-sage-100 text-sage-800 font-medium">
                          {getParentName(update.intended_parent).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sage-800">{getParentName(update.intended_parent)}</p>
                      <p className="text-sm text-sage-800 opacity-60 mb-3">{new Date(update.updated_at || '').toLocaleDateString()}</p>
                      <CustomButton 
                        className="rounded bg-sage-100 text-sage-800 font-medium px-4 py-1 text-sm shadow-none cursor-pointer"
                        onClick={() => handleCaseClick(update.id)}
                      >{t('dashboard.view_details')}</CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">{t('dashboard.no_updates')}</div>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <CustomButton 
          className="rounded bg-sage-100 text-sage-800 font-medium px-6 py-2 text-sm shadow-none cursor-pointer"
          onClick={() => router.push('/client-manager/client-profiles')}
        >
          {t('dashboard.client_portal')}
        </CustomButton>
        <CustomButton 
          className="rounded bg-sage-100 text-sage-800 font-medium px-6 py-2 text-sm shadow-none cursor-pointer"
          onClick={() => router.push('/client-manager/surrogate-profiles')}
        >
          {t('dashboard.surrogate_portal')}
        </CustomButton>
      </div>
    </div>
  )
}
