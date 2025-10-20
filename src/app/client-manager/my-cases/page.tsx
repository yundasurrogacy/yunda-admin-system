'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
// import { console } from 'inspector';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

interface CaseItem {
  id: string;
  surrogate_mother: { id: string; email?: string; contact_information?: string } | null;
  intended_parent: { id: string; email?: string; basic_information?: string } | null;
  cases_files: { id: string; file_url?: string; category?: string; created_at: string }[];
  ivf_clinics: { id: string; type?: string; created_at: string; data?: string }[];
  process_status: string;
  trust_account_balance?: number;
  trust_account_balance_changes?: { balance_after: number | null }[];
}

const MyCasesPage = () => {
  const { t, i18n } = useTranslation("common")
  const router = useRouter();
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // 状态枚举和映射
  const STATUS_ENUM = [
    { value: 'Matching', label: t('matching', { defaultValue: 'Matching' }) },
    { value: 'LegalStage', label: t('legalStage', { defaultValue: 'Legal Stage' }) },
    { value: 'CyclePrep', label: t('cyclePrep', { defaultValue: 'Cycle Prep' }) },
    { value: 'Pregnant', label: t('pregnancy', { defaultValue: 'Pregnancy' }) },
    { value: 'Transferred', label: t('transferred', { defaultValue: 'Transferred' }) },
  ];
  const [statusDropdownCaseId, setStatusDropdownCaseId] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allCases, setAllCases] = useState<CaseItem[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectedSurrogate, setSelectedSurrogate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [pageSize, setPageSize] = useState(8); // 默认 8 条
  const containerRef = useRef<HTMLDivElement>(null);

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
  // 使用 useCallback 缓存数据获取函数
  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const managerId = typeof document !== 'undefined' ? getCookie('userId_manager') : null;
      if (!managerId) {
        setAllCases([]);
        setIsLoading(false);
        return;
      }
      const res = await fetch(`/api/cases-by-manager?managerId=${managerId}`);
      const data = await res.json();
      setAllCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 只在认证后才加载数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchCases();
    }
  }, [isAuthenticated, fetchCases]);

  // 自适应 pageSize
  useEffect(() => {
    function calcPageSize() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // 340px 卡片宽度 + 32px 间距
      const cardWidth = 340 + 32;
      const columns = Math.max(1, Math.floor(width / cardWidth));
      setPageSize(columns * 2); // 2 行
    }
    calcPageSize();
    window.addEventListener('resize', calcPageSize);
    return () => window.removeEventListener('resize', calcPageSize);
  }, []);

  // 使用 useMemo 缓存筛选后的案例
  const filteredAllCases = useMemo(() => allCases.filter(c => {
    const parentMatch = !selectedParent || (c.intended_parent && c.intended_parent.id == selectedParent);
    const surrogateMatch = !selectedSurrogate || (c.surrogate_mother && c.surrogate_mother.id == selectedSurrogate);
    const statusMatch = !selectedStatus || c.process_status === selectedStatus;
    return parentMatch && surrogateMatch && statusMatch;
  }), [allCases, selectedParent, selectedSurrogate, selectedStatus]);

  // 使用 useMemo 缓存分页数据
  const { totalPages, pagedCases } = useMemo(() => {
    const pages = Math.max(1, Math.ceil(filteredAllCases.length / pageSize));
    const paged = filteredAllCases.slice((page - 1) * pageSize, page * pageSize);
    return { totalPages: pages, pagedCases: paged };
  }, [filteredAllCases, page, pageSize]);

  // 翻页时如果超出总页数，自动回到最后一页
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      setPageInput(String(totalPages));
    }
  }, [totalPages, page]);

  // 使用 useMemo 缓存状态映射
  const stageMap = useMemo<Record<string, string>>(() => ({
    Matching: t("matching"),
    LegalStage: t("legalStage"),
    CyclePrep: t("cyclePrep"),
    Pregnant: t("pregnancy"),
    Transferred: t("transferred"),
  }), [t]);

  // 使用 useMemo 缓存唯一列表
  const uniqueParents = useMemo(() => 
    [...new Map(allCases.map(c => c.intended_parent).filter(Boolean).map(p => [p!.id, p])).values()],
    [allCases]
  );

  const uniqueSurrogates = useMemo(() => 
    [...new Map(allCases.map(c => c.surrogate_mother).filter(Boolean).map(s => [s!.id, s])).values()],
    [allCases]
  );

  const uniqueStatuses = useMemo(() => 
    [...new Set(allCases.map(c => c.process_status).filter(Boolean))],
    [allCases]
  );

  // 使用 useCallback 缓存名称解析函数
  const getParentName = useCallback((parent: any) => {
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
  }, []);

  const getSurrogateName = useCallback((surrogate: any) => {
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
  }, []);

  // 使用 useCallback 缓存导航处理函数
  const handleViewDetails = useCallback((caseId: string) => {
    router.push(`/client-manager/my-cases/${caseId}`);
  }, [router]);

  const handleSurrogateDetail = useCallback((id: string) => {
    router.push(`/client-manager/surrogate-profiles/${id}`);
  }, [router]);

  const handleParentDetail = useCallback((id: string) => {
    router.push(`/client-manager/client-profiles/${id}`);
  }, [router]);

  const handleAddJourney = useCallback((caseId: string) => {
    router.push(`/client-manager/journey?caseId=${caseId}`);
  }, [router]);

  const handleAddIvfClinic = useCallback((caseId: string) => {
    router.push(`/client-manager/ivf-clinic`);
  }, [router]);

  // 缓存筛选器变更处理函数
  const handleParentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedParent(e.target.value);
    setPage(1);
  }, []);

  const handleSurrogateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSurrogate(e.target.value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  }, []);

  // 缓存分页处理函数
  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    setPageInput(String(newPage));
  }, [page]);

  const handleNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
    setPageInput(String(newPage));
  }, [page, totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPageInput(val);
  }, []);

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    setPage(val);
    setPageInput(String(val));
  }, [totalPages]);

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let val = Number((e.target as HTMLInputElement).value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > totalPages) val = totalPages;
      setPage(val);
      setPageInput(String(val));
    }
  }, [totalPages]);

  // 缓存状态下拉菜单切换函数
  const handleToggleStatusDropdown = useCallback((caseId: string) => {
    setStatusDropdownCaseId(statusDropdownCaseId === caseId ? null : caseId);
  }, [statusDropdownCaseId]);

  const handleCloseStatusDropdown = useCallback(() => {
    setStatusDropdownCaseId(null);
  }, []);

  const handleStatusUpdate = useCallback(async (caseId: string, newStatus: string) => {
    if (statusUpdating) return;
    setStatusUpdating(true);
    await fetch('/api/cases-update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId, process_status: newStatus })
    });
    setStatusDropdownCaseId(null);
    setStatusUpdating(false);
    await fetchCases();
  }, [statusUpdating, fetchCases]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  // 数据加载中 - 只在首次加载时显示全屏加载
  if (isLoading && allCases.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
      </div>
    )
  }

  return (
    // <ManagerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('myCases.title', 'My Cases')}</h1>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <select
            value={selectedParent}
            onChange={handleParentChange}
            className="border border-sage-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 cursor-pointer hover:border-sage-400 transition-colors duration-200"
          >
            <option value="" className="cursor-pointer">{t('allIntendedParents')}</option>
            {uniqueParents.map(p => (
              p && <option key={p.id} value={p.id} className="cursor-pointer">
                {getParentName(p)}
              </option>
            ))}
          </select>
          <select
            value={selectedSurrogate}
            onChange={handleSurrogateChange}
            className="border border-sage-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 cursor-pointer hover:border-sage-400 transition-colors duration-200"
          >
            <option value="" className="cursor-pointer">{t('allSurrogateMothers')}</option>
            {uniqueSurrogates.map(s => (
              s && <option key={s.id} value={s.id} className="cursor-pointer">
                {getSurrogateName(s)}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border border-sage-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 cursor-pointer hover:border-sage-400 transition-colors duration-200"
          >
            <option value="" className="cursor-pointer">{t('allStatuses')}</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status} className="cursor-pointer">
                {stageMap[status] || status}
              </option>
            ))}
          </select>
        </div>

        {isLoading && allCases.length > 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
              <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
            </div>
          </div>
        ) : pagedCases.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="text-sage-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <p className="text-xl text-sage-600 font-medium mb-2">{t('noCases', { defaultValue: '暂无案例' })}</p>
              <p className="text-sm text-sage-400 mb-6">{t('noCasesDesc', { defaultValue: '当前筛选条件下没有找到案例' })}</p>
            </div>
          </div>
        ) : (
          <div
            className="w-full"
            ref={containerRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '32px',
              alignItems: 'stretch',
            }}
          >
            {pagedCases.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-visible relative"
                style={{ overflow: 'visible', zIndex: 1 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage-400 text-xl font-bold">{String(item.id).slice(-2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-sage-800 truncate">{t('caseIdLabel')}{item.id}</div>
                    <div className="text-sage-500 text-sm truncate font-medium">
                      {t('statusLabel')}
                      <span
                        className="inline-block cursor-pointer px-2 py-1 rounded hover:bg-sage-100 transition-all duration-200 hover:shadow-sm"
                        onClick={() => handleToggleStatusDropdown(item.id)}
                        style={{ minWidth: 80 }}
                      >
                        <span className={statusUpdating ? 'opacity-50' : ''}>{stageMap[item.process_status as keyof typeof stageMap] || item.process_status || '-'}</span>
                        <span className={`ml-1 text-xs text-sage-400 transition-transform duration-200 inline-block ${statusDropdownCaseId === item.id ? 'rotate-180' : ''}`}>▼</span>
                      </span>
                    </div>
                    {/* 状态下拉菜单绝对定位悬浮，不挤压内容 */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      {statusDropdownCaseId === item.id && (
                        <div
                          className="z-[999] mt-2 bg-white border border-sage-200 rounded shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                          style={{ minWidth: 180, position: 'absolute', left: 0, top: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'visible', maxHeight: '320px' }}
                        >
                          <div style={{overflowY: 'auto', maxHeight: '280px'}}>
                            {STATUS_ENUM.map((opt) => (
                              <div
                                key={opt.value}
                                className={`px-4 py-2 cursor-pointer hover:bg-sage-100 text-sage-700 transition-colors duration-150 ${item.process_status === opt.value ? 'font-bold bg-sage-50' : ''} ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !statusUpdating && handleStatusUpdate(item.id, opt.value)}
                              >
                                {opt.label}
                                {item.process_status === opt.value && <span className="ml-2 text-sage-500">✓</span>}
                              </div>
                            ))}
                          </div>
                          <div
                            className="px-4 py-2 cursor-pointer text-sage-400 hover:bg-sage-100 border-t border-sage-100 transition-colors duration-150"
                            onClick={handleCloseStatusDropdown}
                          >{t('cancel')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs text-sage-400">{t('trustBalanceLabel')}</span>
                    <span className="cursor-pointer text-blue-600 underline" onClick={() => router.push(`/client-manager/trust-account?caseId=${item.id}`)}>
                      {item.trust_account_balance_changes && item.trust_account_balance_changes.length > 0 && item.trust_account_balance_changes[0].balance_after !== null && item.trust_account_balance_changes[0].balance_after !== undefined
                        ? `$${Number(item.trust_account_balance_changes[0].balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : '-'}
                    </span>
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
                  {/* <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/journey?caseId=${item.id}`)}>{t('myCases.journey', 'JOURNEY')}</span> */}
                  {/* <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/journey`)}>{t('myCases.journey', 'JOURNEY')}</span> */}
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/client-journey?caseId=${item.id}`)}>{t('myCases.intendedParentsJourney', 'Intended Parents Journey ')}</span>
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/surrogacy-journey?caseId=${item.id}`)}>{t('myCases.gestationalCarrierJourney', 'Gestational Carrier Journey ')}</span>
                  {/* <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/ivf-clinic?caseId=${item.id}`)}>{t('myCases.ivfClinic', 'IVF CLINIC')}</span> */}
                  {/* <span className="text-purple-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/appointments?caseId=${item.id}`)}>{t('myCases.appointments', 'APPOINTMENTS')}</span> */}
                  {/* <span className="text-pink-600 underline cursor-pointer" onClick={() => router.push(`/client-manager/medication?caseId=${item.id}`)}>{t('myCases.medication', 'MEDICATION')}</span> */}
                  <span className="text-blue-600 underline cursor-pointer font-medium" onClick={() => router.push(`/client-manager/client-ivf-clinic?caseId=${item.id}`)}>{t('myCases.intendedParentsIvfClinic')}</span>
                  <span className="text-blue-600 underline cursor-pointer font-medium" onClick={() => router.push(`/client-manager/surrogate-ivf-clinic?caseId=${item.id}`)}>{t('myCases.gestationalCarrierIvfClinic')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页控件 */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <CustomButton
            className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm shadow hover:bg-sage-50 cursor-pointer"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            {t('pagination.prevPage', '上一页')}
          </CustomButton>
          <span>
            {t('pagination.page', '第')}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handlePageInputKeyDown}
              className="w-12 border rounded text-center mx-1"
              style={{height: 28}}
            />
            {t('pagination.of', '共')} {totalPages} {t('pagination.pages', '页')}
          </span>
          <CustomButton
            className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm shadow hover:bg-sage-50 cursor-pointer"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            {t('pagination.nextPage', '下一页')}
          </CustomButton>
        </div>
      </div>
    // </ManagerLayout>
  );
};

export default MyCasesPage;