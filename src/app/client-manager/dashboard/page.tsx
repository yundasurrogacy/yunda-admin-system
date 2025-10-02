'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface Case {
  id: string;
  surrogate_mother: { id: string; email?: string; contact_information?: string, name?: string } | null;
  intended_parent: { id: string; email?: string; basic_information?: string, name?: string } | null;
  cases_files: { id:string; file_url?: string; category?: string; created_at: string }[];
  ivf_clinics: { id:string; type?: string; created_at: string; data?: string }[];
  process_status: string;
  trust_account_balance?: number;
  updated_at?: string;
  next_appointment_date?: string;
  pending_documents_count?: number;
  contract_status?: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation('common');
  
  // 状态管理
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

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
    // router.push(`/client-manager/my-cases/${caseId}`)
  }

  // 获取案例数据
  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const managerId = localStorage.getItem('managerId');
      if (!managerId) {
        setCases([]);
        setIsLoading(false);
        return;
      }
      const res = await fetch(`/api/cases-by-manager?managerId=${managerId}`);
      const data = await res.json();
      console.log('Cases data:', data);
      setCases(data);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
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

  const today = new Date().toISOString().split('T')[0];
  const todaysTasksCount = cases.filter(c => c.next_appointment_date === today).length;
  const pendingDocumentsCount = cases.reduce((acc, c) => acc + (c.pending_documents_count || 0), 0);
  const pendingContractsCount = cases.filter(c => c.contract_status === 'pending').length;

  const weeklyUpdates = cases.filter(c => c.next_appointment_date && new Date(c.next_appointment_date) > new Date()).slice(0, 5);
  const latestUpdates = cases.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()).slice(0, 5);


  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen" style={{ background: "#FBF0DA40" }}>
        <h1 className="text-2xl font-semibold mb-8 font-serif text-[#271F18]">{t('dashboard.title')}</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow rounded-xl bg-white font-serif text-[#271F18]"
            onClick={() => router.push('/client-manager/my-cases')}
          >
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">{t('dashboard.today_task')}</h2>
            <div className="text-4xl font-bold font-serif text-[#271F18]">
              {isLoading ? '...' : todaysTasksCount}
            </div>
          </Card>
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow rounded-xl bg-white font-serif text-[#271F18]"
            onClick={() => router.push('/client-manager/documents?status=pending')}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-medium font-serif text-[#271F18]">{t('dashboard.pending_documents')}</h2>
              {/* <span className="text-sm font-serif text-[#271F18] opacity-60">1 Due in 2 Days</span> */}
            </div>
            <div className="text-4xl font-bold font-serif text-[#271F18]">{isLoading ? '...' : pendingDocumentsCount}</div>
            <div className="mt-2 text-sm font-serif text-[#271F18] opacity-60">{t('dashboard.action_needed')}</div>
          </Card>
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow rounded-xl bg-white font-serif text-[#271F18]"
            onClick={() => router.push('/client-manager/documents?type=contract')}
          >
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">{t('dashboard.contract_status')}</h2>
            <div className="text-4xl font-bold font-serif text-[#271F18]">
              {isLoading ? '...' : pendingContractsCount}
            </div>
            <div className="mt-2 text-sm font-serif text-[#271F18] opacity-60">{t('dashboard.pending_review')}</div>
          </Card>
        </div>
        {/* Updates Needed Table */}
        <Card className="mb-8 rounded-xl bg-white font-serif text-[#271F18]">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">{t('dashboard.updates_needed')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2 font-serif text-[#271F18]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">{t('dashboard.table.name')}</th>
                    <th className="text-left py-2 px-4 font-semibold">{t('dashboard.table.type')}</th>
                    <th className="text-left py-2 px-4 font-semibold">{t('dashboard.table.due_date')}</th>
                    <th className="text-left py-2 px-4 font-semibold">{t('dashboard.table.notes')}</th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="text-center py-4">{t('loadingText')}</td></tr>
                  ) : weeklyUpdates.length > 0 ? (
                    weeklyUpdates.map((item) => (
                      <tr key={item.id} className="border-b last:border-none">
                        <td className="py-2 px-4">{getParentName(item.intended_parent)} / {getSurrogateName(item.surrogate_mother)}</td>
                        <td className="py-2 px-4">{t('dashboard.table.type_case')}</td>
                        <td className="py-2 px-4">{item.next_appointment_date}</td>
                        <td className="py-2 px-4">{item.process_status}</td>
                        <td className="py-2 px-4">
                          <Button className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-4 py-1 text-sm shadow-none"
                            onClick={() => handleCaseClick(item.id)}
                          >{t('dashboard.view_details')}</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-4">{t('dashboard.no_updates')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        {/* Latest Updates */}
        <Card className="rounded-xl bg-white font-serif text-[#271F18]">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-6 font-serif text-[#271F18]">{t('dashboard.latest_update')}</h2>
            <div className="relative">
              {isLoading ? (
                <div className="text-center py-4">{t('loadingText')}</div>
              ) : latestUpdates.length > 0 ? (
                <div className="flex space-x-4 overflow-x-auto">
                  {latestUpdates.map((update) => (
                    <div key={update.id} className="flex-none w-48">
                      <div className="bg-[#F8F9FC] rounded-lg p-4 text-center font-serif text-[#271F18]">
                        <Avatar className="w-12 h-12 mx-auto mb-3">
                          <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">
                            {getParentName(update.intended_parent).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium font-serif text-[#271F18] truncate">{getParentName(update.intended_parent)}</p>
                        <p className="text-sm font-serif text-[#271F18] opacity-60 mb-3">{new Date(update.updated_at || '').toLocaleDateString()}</p>
                        <Button 
                          className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-4 py-1 text-sm shadow-none"
                          onClick={() => handleCaseClick(update.id)}
                        >{t('dashboard.view_details')}</Button>
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
        <div className="mt-8 flex gap-4">
          {/* <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/client-profiles/new')}
          >
            {t('dashboard.add_new_client')}
          </Button> */}
          {/* <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/documents/upload')}
          >
            {t('dashboard.upload_file')}
          </Button> */}
          {/* <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => alert(t('dashboard.export_soon'))}
          >
            {t('dashboard.export_report')}
          </Button> */}
          {/* <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/notifications')}
          >
            {t('dashboard.notifications')}
          </Button> */}
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/client-profiles')}
          >
            {t('dashboard.client_portal')}
          </Button>
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/surrogate-profiles')}
          >
            {t('dashboard.surrogate_portal')}
          </Button>
        </div>
      </div>
    </ManagerLayout>
  )
}
