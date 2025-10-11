'use client'
import React, { useEffect, useState, useRef } from 'react';
// 不再使用全屏 Modal，直接在页面内渲染表单卡片
import ManagerLayout from '@/components/manager-layout';
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
  // 统一关闭弹窗并恢复添加按钮
  function closeForm() {
    setShowForm(false);
    setAddBtnDisabled(false);
  }
  // Toast 相关
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }
  // 返回上一页
  function handleBack() {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');
  const [balance, setBalance] = useState<number | null>(null);
  const [changes, setChanges] = useState<BalanceChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [addBtnDisabled, setAddBtnDisabled] = useState(false);
  const [formData, setFormData] = useState<Partial<BalanceChange>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
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
      if (page > totalPages) {
        setPage(totalPages);
        setPageInput(String(totalPages));
      }
    }, [totalPages, page]);
  // ...existing code...

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
  }, [caseId, showForm]);




  // 打开新增/编辑表单
  const handleAdd = () => {
    if (addBtnDisabled) return;
    setAddBtnDisabled(true);
    setEditId(null);
    setFormData({
      change_type: '',
      change_amount: 0,
      remark: '',
    });
    setShowForm(true);
  };
  const handleEdit = (item: BalanceChange) => {
    setEditId(item.id);
    setFormData({
      change_type: item.change_type,
      change_amount: item.change_amount,
      remark: item.remark,
    });
    setShowForm(true);
    setAddBtnDisabled(true);
  };
  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除该记录吗？')) {
      try {
        const res = await fetch(`/api/trust-account/change?id=${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('删除失败');
        closeForm();
        showToast('success', '删除成功');
      } catch (e) {
        showToast('error', '删除失败');
      }
    }
  };

  // 表单字段变更
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'change_amount' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  // 表单提交
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitting) return;
    setFormSubmitting(true);
    if (!caseId) {
      setFormSubmitting(false);
      return;
    }
    try {
      // 自动计算变动前/后余额
      let balance_before = null;
      let balance_after = null;
      if (!editId) {
        // 新增时取当前最新余额
        balance_before = changes.length > 0 && changes[0].balance_after !== null && changes[0].balance_after !== undefined
          ? Number(changes[0].balance_after)
          : 0;
        balance_after = balance_before + (formData.change_amount ?? 0);
      } else {
        // 编辑时用原始变动前余额
        const editing = changes.find(c => c.id === editId);
        balance_before = editing?.balance_before ?? 0;
        balance_after = balance_before + (formData.change_amount ?? 0);
      }
      const method = editId ? 'PUT' : 'POST';
      const payload = editId
        ? { ...formData, id: editId, balance_before, balance_after }
        : { ...formData, caseId, balance_before, balance_after };
      const res = await fetch('/api/trust-account/change', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('保存失败');
      setShowForm(false);
      setAddBtnDisabled(false);
      showToast('success', editId ? '编辑成功' : '新增成功');
    } catch (e) {
      showToast('error', '保存失败');
      setAddBtnDisabled(false);
    } finally {
      setFormSubmitting(false);
    }
  };

  // ESC 键关闭弹窗
  useEffect(() => {
    if (!showForm) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') closeForm();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showForm]);

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen bg-main-bg">
        {/* Toast 提示 */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2000,
              background: toast.type === 'success' ? '#e6ffed' : '#fff1f0',
              color: toast.type === 'success' ? '#2e7d32' : '#d32f2f',
              border: `1px solid ${toast.type === 'success' ? '#b2dfdb' : '#ffcdd2'}`,
              borderRadius: 8,
              padding: '8px 24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              fontWeight: 500,
            }}
          >
            {toast.message}
          </div>
        )}
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 rounded bg-sage-100 text-sage-800 font-medium transition-colors"
          style={{ cursor: 'pointer', background: 'rgb(195,204,194)', transition: 'box-shadow .2s, transform .2s' }}
          onMouseOver={e => { e.currentTarget.style.background = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgb(195,204,194)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
        >
          {t('back', '返回')}
        </button>
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

        {/* 悬浮表单卡片 */}
        {showForm && (
          <>
            {/* 遮罩层，点击关闭弹窗 */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.08)',
                zIndex: 999,
                pointerEvents: 'auto',
              }}
              onClick={closeForm}
            />
            <Card
              className="p-6 bg-white border border-sage-200 shadow-2xl max-w-xl w-full relative text-sage-800 animate-fadein"
              style={{ pointerEvents: 'auto', position: 'fixed', top: '10vh', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, transition: 'opacity .2s' }}
            >
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold text-sage-800">{editId ? t('trustAccount.editRecord', 'Edit Record') : t('trustAccount.addRecord', 'Add Record')}</div>
                  <button type="button" className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer" onClick={closeForm} style={{ cursor: 'pointer' }}>×</button>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sage-800">{t('trustAccount.type', 'Type')}</label>
                  <select
                    name="change_type"
                    value={formData.change_type || ''}
                    onChange={handleFormChange}
                    className="border rounded px-2 py-1 w-full text-sage-800"
                    required
                  >
                    <option value="">{t('pleaseSelect', 'Please select')}</option>
                    <option value="RECHARGE">{t('trustAccount.typeRecharge', 'Recharge')}</option>
                    <option value="CONSUMPTION">{t('trustAccount.typeConsumption', 'Consumption')}</option>
                    <option value="OTHER">{t('trustAccount.typeOther', 'Other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sage-800">{t('trustAccount.amount', 'Amount')}</label>
                  <input
                    type="text"
                    name="change_amount"
                    value={formData.change_amount ?? ''}
                    onChange={handleFormChange}
                    className="border rounded px-2 py-1 w-full text-sage-800"
                    required
                    inputMode="decimal"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sage-800">{t('trustAccount.remark', 'Remark')}</label>
                  <textarea
                    name="remark"
                    value={formData.remark ?? ''}
                    onChange={handleFormChange}
                    className="border rounded px-2 py-1 w-full text-sage-800"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-3 py-1 rounded bg-gray-200 text-sage-800 cursor-pointer" onClick={closeForm} style={{ cursor: 'pointer' }}>{t('cancel', 'Cancel')}</button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-sage-600 text-white cursor-pointer"
                    style={{ cursor: formSubmitting ? 'not-allowed' : 'pointer', opacity: formSubmitting ? 0.5 : 1 }}
                    disabled={formSubmitting}
                  >{t('save', 'Save')}</button>
                </div>
              </form>
            </Card>
          </>
        )}
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6 border border-sage-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-sage-800">{t('trustAccount.history', 'Transaction History')}</h2>
            <button
              className="bg-sage-600 text-white px-3 py-1 rounded cursor-pointer"
              style={{ cursor: addBtnDisabled ? 'not-allowed' : 'pointer', opacity: addBtnDisabled ? 0.5 : 1, background: 'rgb(195,204,194)', transition: 'box-shadow .2s, transform .2s' }}
              onMouseOver={e => { if (!addBtnDisabled) { e.currentTarget.style.background = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'scale(1.04)'; } }}
              onMouseOut={e => { if (!addBtnDisabled) { e.currentTarget.style.background = 'rgb(195,204,194)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; } }}
              onClick={handleAdd}
              disabled={addBtnDisabled}
            >
              {t('add', 'Add')}
            </button>
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
                      <tr key={change.id} className="transition-colors" style={{ cursor: 'pointer' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#f8f8f8'; }}
                        onMouseOut={e => { e.currentTarget.style.background = ''; }}
                      >
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
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                    setPageInput(String(newPage));
                  }}
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
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setPageInput(val);
                    }}
                    onBlur={e => {
                      let val = Number(e.target.value);
                      if (isNaN(val) || val < 1) val = 1;
                      if (val > totalPages) val = totalPages;
                      setPage(val);
                      setPageInput(String(val));
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        let val = Number((e.target as HTMLInputElement).value);
                        if (isNaN(val) || val < 1) val = 1;
                        if (val > totalPages) val = totalPages;
                        setPage(val);
                        setPageInput(String(val));
                      }
                    }}
                    className="w-12 border rounded text-center mx-1"
                    style={{height: 28}}
                  />
                  {t('pagination.of', 'of')} {totalPages} {t('pagination.pages', 'pages')}
                </span>
                <button
                  className="px-3 py-1 rounded border border-gray-300 bg-white text-sage-800 disabled:opacity-50"
                  onClick={() => {
                    const newPage = Math.min(totalPages, page + 1);
                    setPage(newPage);
                    setPageInput(String(newPage));
                  }}
                  disabled={page === totalPages}
                >{t('pagination.nextPage', 'Next')}</button>
              </div>
            </>
          )}
        </Card>
      </div>
    </ManagerLayout>
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
