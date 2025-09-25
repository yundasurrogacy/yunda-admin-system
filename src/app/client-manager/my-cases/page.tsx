'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CaseItem {
  id: string;
  surrogate_mother: { id: string; email?: string; contact_information?: string } | null;
  intended_parent: { id: string; email?: string; contact_information?: string } | null;
  cases_files: { id: string; file_url?: string; category?: string; created_at: string }[];
  ivf_clinics: { id: string; type?: string; created_at: string; data?: string }[];
  process_status: string;
}

const MyCasesPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Matching');

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
      setCases(data);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

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
  // 新增 journey（cases_files）
  const handleAddJourney = (caseId: string) => {
  // 跳转到新增 Journey 页面，带上 caseId（去掉问号前的斜杠）
  router.push(`/client-manager/my-cases/add-journey?caseId=${caseId}`);
  };

  // 新增 ivf_clinic
  const handleAddIvfClinic = (caseId: string) => {
    // 跳转到新增 IVF Clinic 页面，带上 caseId
    router.push(`/client-manager/my-cases/add-ivf-clinic?caseId=${caseId}`);
  };

  return (
    <ManagerLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-8">我的案子</h1>
        {/* 列表 */}
        <div className="grid grid-cols-2 gap-6">
          {isLoading ? (
            <div>加载中...</div>
          ) : cases.length === 0 ? (
            <div>暂无案子</div>
          ) : (
            cases.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-semibold">
                      代孕母：
                      {item.surrogate_mother && item.surrogate_mother.id ? (
                        <Button
                          variant="link"
                          onClick={() => {
                            if (item.surrogate_mother && item.surrogate_mother.id) {
                              handleSurrogateDetail(item.surrogate_mother.id);
                            }
                          }}
                        >
                          {item.surrogate_mother?.contact_information || item.surrogate_mother?.email}
                        </Button>
                      ) : '未分配'}
                    </div>
                    <div className="font-semibold">
                      准父母：
                      {item.intended_parent && item.intended_parent.id ? (
                        <Button
                          variant="link"
                          onClick={() => handleParentDetail(item.intended_parent ? item.intended_parent.id : '')}
                        >
                          {item.intended_parent.contact_information || item.intended_parent.email}
                        </Button>
                      ) : '未分配'}
                    </div>
                  </div>
                  <div>
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(item.id)}>
                      详情
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-sm">状态：</span>
                  <span className="text-sm font-bold">{item.process_status || '-'}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleAddJourney(item.id)}>
                    新增 Journey
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddIvfClinic(item.id)}>
                    新增 IVF Clinic
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="font-medium mb-1">Journey 列表：</div>
                  {item.cases_files.length === 0 ? (
                    <div className="text-sm text-gray-400">暂无 Journey</div>
                  ) : (
                    item.cases_files.map((f) => (
                      <div key={f.id} className="text-sm text-gray-700">
                        {f.file_url ? (
                          <a href={f.file_url} target="_blank" rel="noopener noreferrer">{f.category || f.file_url}</a>
                        ) : (f.category || '未知文件')}
                        {' '}({new Date(f.created_at).toLocaleDateString()})
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4">
                  <div className="font-medium mb-1">IVF Clinics：</div>
                  {item.ivf_clinics.length === 0 ? (
                    <div className="text-sm text-gray-400">暂无 IVF Clinic</div>
                  ) : (
                    item.ivf_clinics.map((c) => (
                      <div key={c.id} className="text-sm text-gray-700">
                        {c.data || c.type || '未知诊所'}
                        {' '}({new Date(c.created_at).toLocaleDateString()})
                      </div>
                    ))
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ManagerLayout>
  );
};

export default MyCasesPage;
