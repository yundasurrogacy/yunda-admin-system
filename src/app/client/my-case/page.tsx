"use client";
import Link from "next/link";
import { CustomButton } from '@/components/ui/CustomButton';
import { useEffect, useState, useRef, useMemo, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 格式化信托余额的辅助函数（移到组件外部）
function formatTrustBalance(balanceChanges?: { balance_after: number | null }[]): string {
  if (!balanceChanges || balanceChanges.length === 0) return '-';
  const balance = balanceChanges[0].balance_after;
  if (balance === null || balance === undefined) return '-';
  return `$${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

interface SurrogateMother {
  id: string;
  email: string;
  name: string;
}

interface IntendedParent {
  id: string;
  email: string;
  name: string;
}

interface CaseFile {
  id: string;
  file_url: string;
  category: string;
  created_at: string;
}

interface IvfClinic {
  id: string;
  type: string;
  created_at: string;
  name: string;
}

interface CaseItem {
  id: string;
  process_status?: string;
  trust_account_balance_changes?: { balance_after: number | null }[];
  surrogate_mother?: SurrogateMother;
  intended_parent?: IntendedParent;
  cases_files?: CaseFile[];
  ivf_clinics?: IvfClinic[];
}

// 提取的案件卡片组件（使用 memo 优化）
const CaseCard = memo(({ 
  item, 
  t 
}: { 
  item: CaseItem; 
  t: any; // 使用 any 避免 TFunction 类型复杂性
}) => {
  // 使用 useMemo 缓存计算值
  const caseIdDisplay = useMemo(() => String(item.id).slice(-2), [item.id]);
  const statusDisplay = useMemo(() => 
    item.process_status ? t(`statusMapping.${item.process_status}`, item.process_status) : '-',
    [item.process_status, t]
  );
  const trustBalanceDisplay = useMemo(() => 
    formatTrustBalance(item.trust_account_balance_changes),
    [item.trust_account_balance_changes]
  );

  return (
    <div className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sage-400 text-xl font-bold">{caseIdDisplay}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg text-sage-800 truncate">
            {t('myCases.caseIdLabel', '案件ID：')}{item.id}
          </div>
          <div className="text-sage-500 text-sm truncate">
            {t('myCases.statusLabel', '状态：')}{statusDisplay}
          </div>
        </div>
      </div>
      <div className="mt-2 text-sage-700 text-[15px] space-y-1">
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono text-xs text-sage-400 whitespace-nowrap">
            {t('myCases.trustBalanceLabel', '信托余额：')}
          </span>
          <Link
            href={`/client/trust-account?caseId=${item.id}`}
            className="font-semibold text-blue-600 hover:underline hover:bg-sage-50 rounded px-1 py-0.5 transition cursor-pointer"
          >
            {trustBalanceDisplay}
          </Link>
        </div>
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono text-xs text-sage-400 whitespace-nowrap">
            {t('surrogateMotherLabel', '代孕母：')}
          </span>
          {item.surrogate_mother ? (
            <Link 
              href={`/client/surrogate-match/`} 
              className="text-blue-600 hover:underline cursor-pointer transition-all"
            >
              {item.surrogate_mother.name}
            </Link>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </div>
      <hr className="my-3 border-sage-100" />
      <div className="flex flex-wrap gap-2 text-sm">
        <CustomButton 
          className="px-3 py-1 rounded border border-sage-200 bg-sage-50 text-sage-700 text-xs hover:bg-sage-100 transition-colors cursor-pointer"
          onClick={() => window.location.href = `/client/journey?caseId=${item.id}`}
        >
          {t('myCases.journey', 'JOURNEY')}
        </CustomButton>
        <CustomButton 
          className="px-3 py-1 rounded border border-sage-200 bg-sage-50 text-sage-700 text-xs hover:bg-sage-100 transition-colors cursor-pointer"
          onClick={() => window.location.href = `/client/ivf-clinic?caseId=${item.id}`}
        >
          {t('myCases.ivfClinic', 'IVF CLINIC')}
        </CustomButton>
        <CustomButton 
          className="px-3 py-1 rounded border border-sage-200 bg-sage-50 text-sage-700 text-xs hover:bg-sage-100 transition-colors cursor-pointer"
          onClick={() => window.location.href = `/client/journal?caseId=${item.id}`}
        >
          {t('myCases.journal', 'JOURNAL')}
        </CustomButton>
      </div>
    </div>
  );
});

CaseCard.displayName = 'CaseCard';

export default function MyCasesPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [allCases, setAllCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 筛选相关 state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSurrogate, setSelectedSurrogate] = useState('');
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [pageSize, setPageSize] = useState(8);
  const containerRef = useRef<HTMLDivElement>(null);

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_client')
      const userEmail = getCookie('userEmail_client')
      const userId = getCookie('userId_client')
      const authed = !!(userRole && userEmail && userId)
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client/login')
      }
    }
  }, [router]);

  // 获取案件数据
  useEffect(() => {
    if (!isAuthenticated) return; // 只在认证后才加载数据
    
    const parentId = getCookie('userId_client');
    if (!parentId) {
      setError(t('myCases.error.noUserId', "未找到用户ID，请重新登录。"));
      setLoading(false);
      return;
    }
    fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(t('myCases.error.fetchFailed', "获取案子失败"));
        const data = await res.json();
        const casesRaw = data;
        setAllCases(
          casesRaw.map((item: any) => ({
            id: item.id,
            process_status: item.process_status,
            trust_account_balance_changes: item.trust_account_balance_changes || [],
            surrogate_mother: item.surrogate_mother
              ? {
                  id: item.surrogate_mother.id,
                  email: item.surrogate_mother.email,
                  name: item.surrogate_mother.contact_information?.name || item.surrogate_mother.contact_information || '',
                }
              : undefined,
            intended_parent: item.intended_parent
              ? {
                  id: item.intended_parent.id,
                  email: item.intended_parent.email,
                  name: item.intended_parent.basic_information?.name || item.intended_parent.basic_information || '',
                }
              : undefined,
            cases_files: item.cases_files?.map((f: any) => ({
              id: f.id,
              file_url: f.file_url,
              category: f.category,
              created_at: f.created_at,
            })) || [],
            ivf_clinics: item.ivf_clinics?.map((c: any) => ({
              id: c.id,
              type: c.type,
              created_at: c.created_at,
              name: c.data?.name || c.data || '',
            })) || [],
          }))
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [t, isAuthenticated]);

  // page 变化时同步 pageInput
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

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

  // 使用 useMemo 缓存过滤选项
  const allStatusOptions = useMemo(() => 
    Array.from(new Set(allCases.map(item => item.process_status).filter(Boolean))),
    [allCases]
  );

  const allSurrogateOptions = useMemo(() => 
    Array.from(new Set(allCases.map(item => item.surrogate_mother?.name).filter(Boolean))),
    [allCases]
  );

  // 使用 useMemo 缓存筛选和分页结果
  const filteredAllCases = useMemo(() => 
    allCases.filter(item => {
      let statusMatch = true;
      let surrogateMatch = true;
      if (selectedStatus) statusMatch = item.process_status === selectedStatus;
      if (selectedSurrogate) surrogateMatch = item.surrogate_mother?.name === selectedSurrogate;
      return statusMatch && surrogateMatch;
    }),
    [allCases, selectedStatus, selectedSurrogate]
  );

  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredAllCases.length / pageSize)),
    [filteredAllCases.length, pageSize]
  );

  const pagedCases = useMemo(() => 
    filteredAllCases.slice((page - 1) * pageSize, page * pageSize),
    [filteredAllCases, page, pageSize]
  );

  // 使用 useCallback 缓存验证函数
  const validatePageInput = useCallback((val: string) => {
    if (!val) return false;
    const num = Number(val);
    if (isNaN(num) || num < 1 || num > totalPages) return false;
    return true;
  }, [totalPages]);

  // 使用 useCallback 缓存事件处理函数
  const handlePrevPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPageInput(val);
  }, []);

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (validatePageInput(val)) {
      setPage(Number(val));
    } else {
      setPageInput(String(page));
    }
  }, [validatePageInput, page]);

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
      if (validatePageInput(val)) {
        setPage(Number(val));
      } else {
        setPageInput(String(page));
      }
    }
  }, [validatePageInput, page]);

  // 页面超出总页数时自动调整
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // 使用 useMemo 缓存是否有案件数据
  const hasCases = useMemo(() => pagedCases.length > 0, [pagedCases.length]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查中
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-sage-700">{t('loading')}</div>
      </div>
    );
  }

  // 未认证
  if (!isAuthenticated) {
    return null;
  }

  // 数据加载中
  if (loading) return <div className="p-8 text-sage-600">{t('loadingText', '加载中...')}</div>;
  
  // 加载错误
  if (error) return <div className="p-8" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('dashboard.myCases', ' My Case')}</h1>
      {/* 筛选控件 */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* 阶段筛选 */}
        {/* <select
          value={selectedStatus}
          onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 min-w-[160px] cursor-pointer"
        >
          <option value="" className="cursor-pointer">{t('allStatuses', '全部阶段')}</option>
          {allStatusOptions.map(status => (
            <option key={status as string} value={status as string} className="cursor-pointer">
              {t(`statusMapping.${String(status)}`, String(status))}
            </option>
          ))}
        </select> */}
        {/* 代孕母筛选 */}
        {/* <select
          value={selectedSurrogate}
          onChange={e => { setSelectedSurrogate(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 min-w-[160px] cursor-pointer"
        >
          <option value="" className="cursor-pointer">{t('allSurrogateMothers', '全部代孕母')}</option>
          {allSurrogateOptions.map(name => (
            <option key={name} value={name} className="cursor-pointer">{name}</option>
          ))}
        </select> */}
      </div>
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
        {!hasCases ? (
          <div className="text-center py-8 col-span-full text-gray-500">
            {t('myCases.noCases', '暂无案子')}
          </div>
        ) : (
          pagedCases.map((item) => (
            <CaseCard key={item.id} item={item} t={t} />
          ))
        )}
      </div>
      {/* 分页控件 */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <CustomButton
          className="border rounded px-3 py-1 cursor-pointer"
          onClick={handlePrevPage}
          disabled={page === 1}
          aria-label={t('pagination.prevPageAria', '上一页')}
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
            className="w-12 border rounded text-center mx-1 cursor-pointer"
            style={{height: 28}}
            aria-label={t('pagination.inputAria', '输入页码')}
          />
          {t('pagination.of', '共')}
          {totalPages}
          {t('pagination.pages', '页')}
        </span>
        <CustomButton
          className="border rounded px-3 py-1 cursor-pointer"
          onClick={handleNextPage}
          disabled={page === totalPages}
          aria-label={t('pagination.nextPageAria', '下一页')}
        >
          {t('pagination.nextPage', '下一页')}
        </CustomButton>
      </div>
    </div>
  );
}
