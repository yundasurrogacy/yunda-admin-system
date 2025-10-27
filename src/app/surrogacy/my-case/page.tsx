"use client";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/ui/CustomButton";

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
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

// 使用 memo 优化的案例卡片组件
const CaseCard = memo(({ item, t, getCaseIdDisplay }: { 
  item: CaseItem; 
  t: (key: string) => string;
  getCaseIdDisplay: (id: string) => string;
}) => (
  <div className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden">
    <div className="flex items-center gap-4 mb-2">
      <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-sage-400 text-xl font-bold">{getCaseIdDisplay(item.id)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg text-sage-800 truncate">{t('myCases.caseIdLabel')}{item.id}</div>
        <div className="text-sage-500 text-sm truncate">{t('myCases.statusLabel')}{item.process_status || '-'}</div>
      </div>
    </div>
    <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
      <div className="flex items-center gap-2 truncate">
        <span className="font-mono text-xs text-sage-400">{t('myCases.intendedParentLabel')}</span>
        {item.intended_parent ? (
          <Link href={`/surrogacy/intended-parents`} className="text-green-600 hover:underline transition-all">
            {item.intended_parent.name}
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
        onClick={() => window.location.href = `/surrogacy/journey?caseId=${item.id}`}
      >
        {t('myCases.journey')}
      </CustomButton>
      <CustomButton 
        className="px-3 py-1 rounded border border-sage-200 bg-sage-50 text-sage-700 text-xs hover:bg-sage-100 transition-colors cursor-pointer"
        onClick={() => window.location.href = `/surrogacy/ivf-clinic?caseId=${item.id}`}
      >
        {t('myCases.ivfClinic')}
      </CustomButton>
      <CustomButton 
        className="px-3 py-1 rounded border border-sage-200 bg-sage-50 text-sage-700 text-xs hover:bg-sage-100 transition-colors cursor-pointer"
        onClick={() => window.location.href = `/surrogacy/journal/?caseId=${item.id}`}
      >
        {t('myCases.journal')}
      </CustomButton>
    </div>
  </div>
));

CaseCard.displayName = 'CaseCard';

export default function SurrogacyMyCasesPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // 数据加载 - 只在认证后执行
  useEffect(() => {
    // 只在认证后才加载数据
    if (!isAuthenticated || dataLoaded) return;
    
    const surrogateId = getCookie('userId_surrogacy');
    if (!surrogateId) {
      setError(t('myCases.error.noUserId'));
      setLoading(false);
      return;
    }
    fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(t('myCases.error.fetchFailed'));
        const data = await res.json();
        // 兼容后端返回结构
        const casesRaw = data.cases || data.data || data || [];
        // 格式化数据
        setCases(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 使用 useMemo 缓存是否有案例
  const hasCases = useMemo(() => cases.length > 0, [cases.length]);

  // 使用 useCallback 缓存获取案例ID后两位的函数
  const getCaseIdDisplay = useCallback((id: string) => String(id).slice(-2), []);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return <div className="p-6">{t('loadingText')}</div>;
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null;
  }

  if (loading) return <div className="p-6">{t('loadingText')}</div>;
  if (error) return <div className="p-6" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('dashboard.myCases', ' My Case')}</h1>
      <div
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px',
          alignItems: 'stretch',
        }}
      >
        {!hasCases ? (
          <div className="flex items-center justify-center col-span-full" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="text-sage-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-xl text-sage-600 font-medium mb-2">{t('myCases.noCases', '暂无案例')}</p>
              <p className="text-sm text-sage-400 mb-6">{t('myCases.noCasesDesc', '目前没有任何案例')}</p>
            </div>
          </div>
        ) : (
          cases.map((item) => (
            <CaseCard 
              key={item.id} 
              item={item} 
              t={t} 
              getCaseIdDisplay={getCaseIdDisplay}
            />
          ))
        )}
      </div>
    </div>
  );
}
