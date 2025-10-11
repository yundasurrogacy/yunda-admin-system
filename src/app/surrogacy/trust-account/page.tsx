'use client'
import React, { useEffect, useState } from 'react';
// 不再使用全屏 Modal，直接在页面内渲染表单卡片
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface BalanceChange {
  id: number;
  case_cases: number;
  change_type: string;
  change_amount: number;
  balance_before: number | null;
  balance_after: number | null;
  remark: string | null;
  created_at: string;
}

function TrustAccountPageInner() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [changes, setChanges] = useState<BalanceChange[]>([]);
  const [loading, setLoading] = useState(false);
  // 只读模式，无需表单相关状态
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  // page变化时同步pageInput
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // 校验输入页码有效性
  const validatePageInput = (val: string) => {
    if (!val) return false;
    const num = Number(val);
    if (isNaN(num) || num < 1 || num > totalPages) return false;
    return true;
  };
  const pageSize = 10; // 每页显示10条
  const [sortDateDesc, setSortDateDesc] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  // const displayedChanges: BalanceChange[] = React.useMemo(() => {
  //   let arr: BalanceChange[] = changes;
  //   if (filterType) {
  //     arr = arr.filter((c: BalanceChange) => c.change_type === filterType);
  //   }
  //   arr = arr.slice().sort((a: BalanceChange, b: BalanceChange) => {
  //     const t1 = new Date(a.created_at).getTime();
  //     const t2 = new Date(b.created_at).getTime();
  //     return sortDateDesc ? t2 - t1 : t1 - t2;
  //   });
  //   return arr;
  // }, [changes, sortDateDesc, filterType]);



    // 必须在 useState(changes) 之后声明分页相关变量
    const displayedChanges: BalanceChange[] = React.useMemo(() => {
      let arr: BalanceChange[] = changes;
      if (filterType) {
        arr = arr.filter((c: BalanceChange) => c.change_type === filterType);
      }
      arr = arr.slice().sort((a: BalanceChange, b: BalanceChange) => {
        const t1 = new Date(a.created_at).getTime();
        const t2 = new Date(b.created_at).getTime();
        return sortDateDesc ? t2 - t1 : t1 - t2;
      });
      return arr;
    }, [changes, sortDateDesc, filterType]);
    const totalPages = Math.max(1, Math.ceil(displayedChanges.length / pageSize));
    const pagedChanges: BalanceChange[] = displayedChanges.slice((page - 1) * pageSize, page * pageSize);

    // 翻页时如果超出总页数，自动回到最后一页
    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);
  // ...existing code...

  // caseId 获取逻辑：优先 URL 参数，否则用 surrogateId 请求
  useEffect(() => {
    const paramCaseId = searchParams.get('caseId');
    if (paramCaseId) {
      setCaseId(paramCaseId);
      return;
    }
    function getCookie(name: string) {
      if (typeof document === 'undefined') return undefined;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : undefined;
    }
    const surrogateId = typeof document !== 'undefined' ? getCookie('userId_surrogacy') : null;
    if (!surrogateId) return;
    fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`)
      .then(res => res.json())
      .then(data => {
        const casesRaw = data.cases || data.data || data;
        if (Array.isArray(casesRaw) && casesRaw.length > 0) {
          // 按 updated_at 字段降序排序，取最新的 case
          const sorted = casesRaw.slice().sort((a, b) => {
            const aTime = new Date(a.updated_at).getTime();
            const bTime = new Date(b.updated_at).getTime();
            return bTime - aTime;
          });
          setCaseId(sorted[0].id?.toString() || null);
        }
      });
  }, [searchParams]);

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/trust-account?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance ?? null);
        // 按时间升序排序（早到晚）
        const sorted = (data.changes ?? []).slice().sort((a: BalanceChange, b: BalanceChange) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setChanges(sorted);
      })
      .finally(() => setLoading(false));
  }, [caseId]);




  // 只读模式，无需新增、编辑、删除、表单相关逻辑

  return (
      <div className="p-8 min-h-screen bg-main-bg">
        <h1 className="text-2xl font-bold text-sage-800 mb-2">{t('trustAccount.title', 'Trust Account')}</h1>
        <p className="text-sage-800 mb-8">{t('trustAccount.description', 'View your current account balance and financial transactions related to your trust account')}</p>
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6 border border-sage-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-sage-800">{t('trustAccount.balance', 'Account Balance')}</h2>
            <span className="text-2xl font-bold text-sage-800">
              {changes.length > 0 && changes[changes.length - 1].balance_after !== null && changes[changes.length - 1].balance_after !== undefined
                ? `$${Number(changes[changes.length - 1].balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                : '--'}
            </span>
          </div>
          <div className="text-xs text-sage-500">{t('trustAccount.updatedToday', 'Updated today')}</div>
        </Card>

        {/* 只读模式无表单卡片 */}
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6 border border-sage-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-sage-800">{t('trustAccount.history', 'Transaction History')}</h2>
            {/* 只读模式无新增按钮 */}
          </div>
          {loading ? <div>{t('loadingText', 'Loading...')}</div> : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-sage-800">
                  <thead>
                    <tr>
                      <th
                        className="py-2 px-4 font-semibold select-none"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSortDateDesc(v => !v)}
                        title={t('trustAccount.sortByDate', 'Sort by date')}
                      >
                        {t('trustAccount.date', 'Date')}
                        <span style={{ marginLeft: 4, fontSize: 12 }}>
                          {sortDateDesc ? t('trustAccount.desc', '▼') : t('trustAccount.asc', '▲')}
                        </span>
                      </th>
                      <th className="py-2 px-4 font-semibold select-none">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {t('trustAccount.type', 'Type')}
                          <select
                            value={filterType ?? ''}
                            onChange={e => { setFilterType(e.target.value || null); setPage(1); }}
                            style={{ marginLeft: 8, fontSize: 12, padding: '2px 6px', borderRadius: 4, border: '1px solid #ddd', background: '#f8f8f8', color: '#333' }}
                          >
                            <option value="">{t('trustAccount.allTypes', 'All Types')}</option>
                            {Array.from(new Set(changes.map(c => c.change_type))).map(type => (
                              <option key={type} value={type}>
                                {type === 'RECHARGE' && t('trustAccount.typeRecharge', 'Recharge')}
                                {type === 'CONSUMPTION' && t('trustAccount.typeConsumption', 'Consumption')}
                                {type === 'OTHER' && t('trustAccount.typeOther', 'Other')}
                                {!['RECHARGE','CONSUMPTION','OTHER'].includes(type) && t(`trustAccount.type.${type}`, type)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </th>
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.amount', 'Amount')}</th>
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.remark', 'Remark')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedChanges.length === 0 ? (
                      <tr><td colSpan={4} className="py-4 text-center text-gray-400">{t('trustAccount.noRecords', 'No records')}</td></tr>
                    ) : pagedChanges.map((change: BalanceChange) => (
                      <tr key={change.id}>
                        <td className="py-2 px-4 whitespace-nowrap">{change.created_at.slice(0, 19).replace('T', ' ')}</td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {change.change_type === 'RECHARGE' && t('trustAccount.typeRecharge', 'Recharge')}
                          {change.change_type === 'CONSUMPTION' && t('trustAccount.typeConsumption', 'Consumption')}
                          {change.change_type === 'OTHER' && t('trustAccount.typeOther', 'Other')}
                          {!['RECHARGE','CONSUMPTION','OTHER'].includes(change.change_type) ? String(t(`trustAccount.type.${change.change_type}`, change.change_type)) : ''}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">{change.change_amount > 0 ? '+' : ''}{change.change_amount}</td>
                        <td className="py-2 px-4 whitespace-nowrap">{change.remark ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 分页控件 */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-sage-800 disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >{t('pagination.prevPage', 'Previous')}</button>
                <span>
                  {t('pagination.page', 'Page')}
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pageInput}
                    onChange={e => {
                      // 只允许数字
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setPageInput(val);
                    }}
                    onBlur={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (validatePageInput(val)) {
                        setPage(Number(val));
                      } else {
                        setPageInput(String(page));
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
                        if (validatePageInput(val)) {
                          setPage(Number(val));
                        } else {
                          setPageInput(String(page));
                        }
                      }
                    }}
                    className="w-12 border rounded text-center mx-1"
                    style={{height: 28}}
                  />
                  {t('pagination.of', 'of')} {totalPages} {t('pagination.pages', 'pages')}
                </span>
                <button
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-sage-800 disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >{t('pagination.nextPage', 'Next')}</button>
              </div>
            </>
          )}
        </Card>
      </div>
  );
}

import { Suspense } from 'react';

export default function TrustAccountPage() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <TrustAccountPageInner />
    </Suspense>
  );
}
