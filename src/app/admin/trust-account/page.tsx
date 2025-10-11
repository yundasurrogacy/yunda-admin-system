'use client'
import React, { useEffect, useState } from 'react';
// 不再使用全屏 Modal，直接在页面内渲染表单卡片
// import ManagerLayout from '@/components/manager-layout';
import { AdminLayout } from '../../../components/admin-layout'
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useRouter} from 'next/navigation'

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
  const router = useRouter();
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
        setShowForm(false);
      } catch (e) {
        alert('删除失败');
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
    } catch (e) {
      alert('保存失败');
      setAddBtnDisabled(false);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen bg-main-bg">
        {/* 返回按钮 */}
        <button
          className="mb-4 px-5 py-2 rounded-full bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] transition-all cursor-pointer flex items-center gap-2"
          onClick={() => router.back()}
        >
          <svg width="18" height="18" fill="none" stroke="#271F18" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
          <div
            style={{
              position: 'fixed',
              top: '10vh',
              left: 0,
              width: '100vw',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Card
              className="p-6 bg-white border border-sage-200 shadow-2xl max-w-xl w-full relative text-sage-800"
              style={{ pointerEvents: 'auto' }}
            >
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold text-sage-800">{editId ? t('trustAccount.editRecord', 'Edit Record') : t('trustAccount.addRecord', 'Add Record')}</div>
                  <button type="button" className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer" onClick={() => setShowForm(false)} style={{ cursor: 'pointer' }}>×</button>
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
                  <button type="button" className="px-3 py-1 rounded bg-gray-200 text-sage-800 cursor-pointer" onClick={() => setShowForm(false)} style={{ cursor: 'pointer' }}>{t('cancel', 'Cancel')}</button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-sage-600 text-white cursor-pointer"
                    style={{ cursor: formSubmitting ? 'not-allowed' : 'pointer', opacity: formSubmitting ? 0.5 : 1 }}
                    disabled={formSubmitting}
                  >{t('save', 'Save')}</button>
                </div>
              </form>
            </Card>
          </div>
        )}
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6 border border-sage-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-sage-800">{t('trustAccount.history', 'Transaction History')}</h2>
            <button
              className="bg-sage-600 text-white px-3 py-1 rounded hover:bg-sage-700 cursor-pointer"
              style={{ cursor: addBtnDisabled ? 'not-allowed' : 'pointer', opacity: addBtnDisabled ? 0.5 : 1 }}
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
                      <tr
                        key={change.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(change)}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F5F7F6')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
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
    </AdminLayout>
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
