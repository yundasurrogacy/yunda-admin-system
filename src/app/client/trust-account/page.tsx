'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
// 不再使用全屏 Modal，直接在页面内渲染表单卡片
// import ManagerLayout from '@/components/manager-layout';
// import { AdminLayout } from '../../../components/admin-layout'
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useRouter} from 'next/navigation'

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

interface BalanceChange {
  id: number;
  case_cases: number;
  change_type: string;
  change_amount: number;
  balance_before: number | null;
  balance_after: number | null;
  remark: string | null;
  receiver: string | null;
  created_at: string;
  visibility?: string;
}

function TrustAccountPageInner() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [changes, setChanges] = useState<BalanceChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const pageSize = 10; // 每页显示10条
  const [sortDateDesc, setSortDateDesc] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  // 认证检查和 cookie 读取
  useEffect(() => {
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

  // page变化时同步pageInput
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

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



  // 使用 useCallback 缓存数据刷新方法
  const fetchChanges = React.useCallback(() => {
    if (!caseId || !isAuthenticated) return;
    setLoading(true);
    fetch(`/api/trust-account?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        const sorted = (data.changes ?? []).slice().sort((a: BalanceChange, b: BalanceChange) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setChanges(sorted);
      })
      .finally(() => setLoading(false));
  }, [caseId, isAuthenticated]);

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  // 使用 useMemo 缓存显示的变更记录和分页数据
  const displayedChanges = useMemo(() => {
    // 调试：打印原始数据
    console.log('🔍 Client - Raw changes data:', changes);
    console.log('🔍 Client - Visibility values:', changes.map(c => ({ id: c.id, visibility: c.visibility })));
    
    // Client 只能看到 visibility 为 'all' 或 'intended_parents' 的记录
    // 兼容旧数据：'true' 对应 'all'，'false' 对应 'intended_parents'
    let arr: BalanceChange[] = changes.filter(c => {
      const vis = c.visibility;
      // 新格式：'all' 或 'intended_parents'
      // 旧格式：'true' 对应 'all'，'false' 对应 'intended_parents'
      return vis === 'all' || vis === 'intended_parents' || vis === 'true';
    });
    
    console.log('🔍 Client - Filtered changes:', arr);
    console.log('🔍 Client - Filtered visibility values:', arr.map(c => ({ id: c.id, visibility: c.visibility })));
    
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

  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(displayedChanges.length / pageSize)),
    [displayedChanges.length, pageSize]
  );

  const pagedChanges = useMemo(() => 
    displayedChanges.slice((page - 1) * pageSize, page * pageSize),
    [displayedChanges, page, pageSize]
  );

  // 翻页时如果超出总页数，自动回到最后一页
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);




  // 使用 useCallback 缓存验证函数
  const validatePageInput = useCallback((val: string) => {
    if (!val) return false;
    const num = Number(val);
    if (isNaN(num) || num < 1 || num > totalPages) return false;
    return true;
  }, [totalPages]);

  // 使用 useCallback 缓存事件处理函数（read-only: no add/edit/delete）

  // 使用 useCallback 缓存其他事件处理函数
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // read-only: no modal to close

  const handleSortToggle = useCallback(() => {
    setSortDateDesc(v => !v);
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value || null);
    setPage(1);
  }, []);

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

  // 使用 useMemo 缓存当前余额和唯一变更类型
  const currentBalance = useMemo(() => {
    if (changes.length > 0 && changes[changes.length - 1].balance_after !== null && changes[changes.length - 1].balance_after !== undefined) {
      return `$${Number(changes[changes.length - 1].balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
    return '--';
  }, [changes]);

  const uniqueChangeTypes = useMemo(() => 
    Array.from(new Set(changes.map(c => c.change_type))),
    [changes]
  );

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

  return (
      <div className="p-8 min-h-screen bg-main-bg">
        {/* 返回按钮 */}
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
          onClick={handleBack}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton>
        <h1 className="text-2xl font-bold text-sage-800 mb-2">{t('trustAccount.title', 'Trust Account')}</h1>
        <p className="text-sage-800 mb-8">{t('trustAccount.description', 'View your current account balance and financial transactions related to your trust account')}</p>
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6 border border-sage-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-sage-800">{t('trustAccount.balance', 'Account Balance')}</h2>
            <span className="text-2xl font-bold text-sage-800">
              {currentBalance}
            </span>
          </div>
          <div className="text-xs text-sage-500">{t('trustAccount.updatedToday', 'Updated today')}</div>
        </Card>

        {/* 悬浮表单卡片 */}
        {/* {showForm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
              pointerEvents: 'none',
              background: 'rgba(0,0,0,0.08)',
            }}
          > */}
        {/* read-only: no modal form for client */}
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6 border border-sage-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-sage-800">{t('trustAccount.history', 'Transaction History')}</h2>
            {/* read-only: remove add button */}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-lg text-sage-500 animate-pulse">
              <svg className="mr-2" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="40"/></svg>
              {t('loadingText', 'Loading...')}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-sage-800 border border-sage-200 rounded-lg overflow-hidden">
                  <thead className="bg-sage-50">
                    <tr>
                      <th className="py-2 px-4 font-semibold select-none" style={{ cursor: 'pointer' }} onClick={handleSortToggle} title={t('trustAccount.sortByDate', 'Sort by date')}>
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
                            onChange={handleFilterChange}
                            style={{ marginLeft: 8, fontSize: 12, padding: '2px 6px', borderRadius: 4, border: '1px solid #ddd', background: '#f8f8f8', color: '#333', cursor: 'pointer' }}
                          >
                            <option value="">{t('trustAccount.allTypes', 'All Types')}</option>
                            {uniqueChangeTypes.map(type => (
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
                      {/* <th className="py-2 px-4 font-semibold">{t('trustAccount.visibility', 'Visibility')}</th> */}
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.amount', 'Amount')}</th>
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.receiver', 'Receiver')}</th>
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.remark', 'Remark')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedChanges.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12">
                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-sage-400 mb-4">
                                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="text-xl text-sage-600 font-medium mb-2">{t('trustAccount.noRecords', { defaultValue: '暂无记录' })}</p>
                              <p className="text-sm text-sage-400 mb-6">{t('trustAccount.noRecordsDesc', { defaultValue: '当前筛选条件下没有找到记录' })}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : pagedChanges.map((change: BalanceChange, idx) => (
                      <tr
                        key={change.id}
                        style={{ background: idx % 2 === 0 ? '#FAFAF9' : '#fff', transition: 'background 0.2s' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#F5F7F6';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = idx % 2 === 0 ? '#FAFAF9' : '#fff';
                        }}
                      >
                        <td className="py-2 px-4 whitespace-nowrap">{change.created_at.slice(0, 19).replace('T', ' ')}</td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {change.change_type === 'RECHARGE' && t('trustAccount.typeRecharge', 'Recharge')}
                          {change.change_type === 'CONSUMPTION' && t('trustAccount.typeConsumption', 'Consumption')}
                          {change.change_type === 'OTHER' && t('trustAccount.typeOther', 'Other')}
                          {!['RECHARGE','CONSUMPTION','OTHER'].includes(change.change_type) ? String(t(`trustAccount.type.${change.change_type}`, change.change_type)) : ''}
                        </td>
                        {/* <td className="py-2 px-4 whitespace-nowrap">
                          {change.Visibility === 'true'
                            ? <span className="inline-flex items-center text-green-600 font-medium"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="mr-1"><circle cx="10" cy="10" r="8" fill="#22c55e"/><path d="M7 10l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>{t('trustAccount.visibilityTrue', 'True')}</span>
                            : <span className="inline-flex items-center text-gray-400 font-medium"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="mr-1"><circle cx="10" cy="10" r="8" fill="#d1d5db"/><path d="M7 10l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>{t('trustAccount.visibilityFalse', 'False')}</span>
                          }
                        </td> */}
                        <td className="py-2 px-4 whitespace-nowrap text-left font-mono" style={{color: change.change_amount > 0 ? '#22c55e' : change.change_amount < 0 ? '#ef4444' : '#222'}}>
                          {change.change_amount > 0 ? '+' : ''}{change.change_amount}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">{change.receiver ?? '-'}</td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {change.remark === '余额调整' || change.remark === 'Balance Adjustment' 
                            ? t('trustAccount.balanceAdjustment', 'Balance Adjustment')
                            : (change.remark ?? '-')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 分页控件优化 */}
              <div className="flex items-center justify-center gap-2 mt-6 text-base">
                <CustomButton
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-sage-800 cursor-pointer hover:bg-sage-50"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                >{t('pagination.prevPage', '上一页')}</CustomButton>
                <span className="mx-2">
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
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-sage-800 cursor-pointer hover:bg-sage-50"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >{t('pagination.nextPage', '下一页')}</CustomButton>
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
