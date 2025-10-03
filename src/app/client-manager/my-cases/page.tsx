'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { AuthGuard } from '@/components/auth-guard';
// import { console } from 'inspector';

interface CaseItem {
  id: string;
  surrogate_mother: { id: string; email?: string; contact_information?: string } | null;
  intended_parent: { id: string; email?: string; basic_information?: string } | null;
  cases_files: { id: string; file_url?: string; category?: string; created_at: string }[];
  ivf_clinics: { id: string; type?: string; created_at: string; data?: string }[];
  process_status: string;
  trust_account_balance?: number;
}

const MyCasesPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseItem[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectedSurrogate, setSelectedSurrogate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // 获取案例数据
  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const managerId = localStorage.getItem('managerId');
      if (!managerId) {
        setCases([]);
        setFilteredCases([]);
        setIsLoading(false);
        return;
      }
      const res = await fetch(`/api/cases-by-manager?managerId=${managerId}`);
      const data = await res.json();
      console.log('Cases data:', data);
      setCases(data);
      setFilteredCases(data); // 初始化时显示所有案例
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // 根据选择筛选案例
  useEffect(() => {
    // console.log('筛选条件变化:', { selectedParent, selectedSurrogate, selectedStatus });
    const newFilteredCases = cases.filter(c => {
      // 使用 '==' 来处理字符串和数字ID不匹配的问题
      const parentMatch = !selectedParent || (c.intended_parent && c.intended_parent.id == selectedParent);
      const surrogateMatch = !selectedSurrogate || (c.surrogate_mother && c.surrogate_mother.id == selectedSurrogate);
      const statusMatch = !selectedStatus || c.process_status === selectedStatus;
      return parentMatch && surrogateMatch && statusMatch;
    });
    console.log('筛选结果:', newFilteredCases);
    setFilteredCases(newFilteredCases);
  }, [selectedParent, selectedSurrogate, selectedStatus, cases]);

  const stageMap: Record<string, string> = {
    Matching: t("matching"),
    LegalStage: t("legalStage"),
    CyclePrep: t("cyclePrep"),
    Pregnant: t("pregnancy"),
    Transferred: t("transferred"),
  }

  // 为筛选器获取唯一的准父母和代孕母亲列表
  const uniqueParents = [...new Map(cases.map(c => c.intended_parent).filter(Boolean).map(p => [p!.id, p])).values()];
  const uniqueSurrogates = [...new Map(cases.map(c => c.surrogate_mother).filter(Boolean).map(s => [s!.id, s])).values()];
  const uniqueStatuses = [...new Set(cases.map(c => c.process_status).filter(Boolean))];
  const getParentName = (parent: any) => {
    if (!parent) return '';
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
    if (!surrogate) return '';
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

  // 根据选择筛选案例
  // const filteredCases = cases.filter(c => {
  //   const parentMatch = !selectedParent || (c.intended_parent && c.intended_parent.id === selectedParent);
  //   const surrogateMatch = !selectedSurrogate || (c.surrogate_mother && c.surrogate_mother.id === selectedSurrogate);
  //   const statusMatch = !selectedStatus || c.process_status === selectedStatus;
  //   return parentMatch && surrogateMatch && statusMatch;
  // });

  // 跳转详情页
  const handleViewDetails = (caseId: string) => {
    router.push(`/client-manager/my-cases/${caseId}`);
  };

  // 跳转代孕母详情页
  const handleSurrogateDetail = (id: string) => {
    router.push(`/client-manager/surrogate-profiles/${id}`);
  };


  // 跳转准父母详情页
  const handleParentDetail = (id: string) => {
    router.push(`/client-manager/client-profiles/${id}`);
  };

  // 新增 journey（cases_files）
  const handleAddJourney = (caseId: string) => {
  // 跳转到新增 Journey 页面，带上 caseId（去掉问号前的斜杠）
  // router.push(`/client-manager/my-cases/add-journey?caseId=${caseId}`);
  router.push(`/client-manager/journey?caseId=${caseId}`);
  };

  // 新增 ivf_clinic
  const handleAddIvfClinic = (caseId: string) => {
    // 跳转到新增 IVF Clinic 页面，带上 caseId
    // router.push(`/client-manager/my-cases/add-ivf-clinic?caseId=${caseId}`);
    router.push(`/client-manager/ivf-clinic`);
  };

  return (
    <AuthGuard requiredRole="manager">
      <ManagerLayout>
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('MY CASES')}</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="">{t('allIntendedParents')}</option>
            {uniqueParents.map(p => (
              p && <option key={p.id} value={p.id}>
                {getParentName(p)}
              </option>
            ))}
          </select>

          <select
            value={selectedSurrogate}
            onChange={(e) => setSelectedSurrogate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="">{t('allSurrogateMothers')}</option>
            {uniqueSurrogates.map(s => (
              s && <option key={s.id} value={s.id}>
                {getSurrogateName(s)}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="">{t('allStatuses')}</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>
                {stageMap[status] || status}
              </option>
            ))}
          </select>
        </div>

        <div
          className="w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {isLoading ? (
            <div className="text-center py-8">{t('loadingText')}</div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-8 col-span-full text-gray-500">{t('noCases')}</div>
          ) : (
            filteredCases.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage-400 text-xl font-bold">{String(item.id).slice(-2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-sage-800 truncate">{t('caseIdLabel')}{item.id}</div>
                    <div className="text-sage-500 text-sm truncate">{t('statusLabel')}{stageMap[item.process_status as keyof typeof stageMap] || item.process_status || '-'}</div>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs text-sage-400">{t('trustBalanceLabel')}</span>
                    <span>{item.trust_account_balance ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs text-sage-400">{t('intendedParentLabel')}</span>
                    {item.intended_parent && item.intended_parent.id ? (
                      <span className="text-blue-600 underline cursor-pointer" onClick={() => handleParentDetail(item.intended_parent!.id)}>
                        {(() => {
                          if (item.intended_parent.basic_information) {
                            try {
                              const info = typeof item.intended_parent.basic_information === 'string' ? JSON.parse(item.intended_parent.basic_information) : item.intended_parent.basic_information;
                              return info.firstName || item.intended_parent.email;
                            } catch {
                              return item.intended_parent.basic_information || item.intended_parent.email;
                            }
                          }
                          return item.intended_parent.email;
                        })()}
                        {/* <span className="text-xs text-sage-400">({item.intended_parent.email})</span> */}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs text-sage-400">{t('surrogateMotherLabel')}</span>
                    {item.surrogate_mother && item.surrogate_mother.id ? (
                      <span className="text-blue-600 underline cursor-pointer" onClick={() => handleSurrogateDetail(item.surrogate_mother!.id)}>
                        {(() => {
                          if (item.surrogate_mother.contact_information) {
                            try {
                              const info = typeof item.surrogate_mother.contact_information === 'string' ? JSON.parse(item.surrogate_mother.contact_information) : item.surrogate_mother.contact_information;
                              return info.first_name || item.surrogate_mother.email;
                            } catch {
                              return item.surrogate_mother.contact_information || item.surrogate_mother.email;
                            }
                          }
                          return item.surrogate_mother.email;
                        })()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
                <hr className="my-3 border-sage-100" />
                <div className="flex flex-wrap gap-2 text-sm">
                  {/* <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/journal?caseId=${item.id}`)}>孕母动态</span> */}
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/journey?caseId=${item.id}`)}>{t('journey.title')}</span>
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/ivf-clinic?caseId=${item.id}`)}>{t('ivfClinic.title')}</span>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </ManagerLayout>
    </AuthGuard>
  );
};export default MyCasesPage;
