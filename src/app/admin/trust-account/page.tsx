'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSidebar } from '@/context/sidebar-context';
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
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [balance, setBalance] = useState<number | null>(null);
  const [changes, setChanges] = useState<BalanceChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  // 菜单栏宽度和展开状态（推荐用 context 获取）
  const sidebarWidth = '16rem'; // 可根据实际侧边栏宽度调整
  const { sidebarOpen } = useSidebar();
  // change_amount 用字符串保存，保证输入负号时受控
  // change_amount 用字符串保存，彻底消除类型警告
  type FormDataType = Omit<Partial<BalanceChange>, 'change_amount'> & { change_amount?: string };
  const [formData, setFormData] = useState<FormDataType>({ visibility: 'all' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router]);
  const [sortDateDesc, setSortDateDesc] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  // page变化时同步pageInput
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const pageSize = 10; // 每页显示10条

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 抽取数据刷新方法 - 使用 useCallback 缓存
  const fetchChanges = useCallback(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/trust-account?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance ?? null);
        const sorted = (data.changes ?? []).slice().sort((a: BalanceChange, b: BalanceChange) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setChanges(sorted);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  // 只在认证后才加载数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchChanges();
    }
  }, [isAuthenticated, fetchChanges]);

  // 使用 useMemo 缓存过滤和排序后的数据
  const displayedChanges = useMemo(() => {
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

  // 使用 useMemo 缓存分页数据
  const { totalPages, pagedChanges } = useMemo(() => {
    const pages = Math.max(1, Math.ceil(displayedChanges.length / pageSize));
    const paged = displayedChanges.slice((page - 1) * pageSize, page * pageSize);
    return { totalPages: pages, pagedChanges: paged };
  }, [displayedChanges, page, pageSize]);

  // 翻页时如果超出总页数，自动回到最后一页
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);




  // 使用 useCallback 缓存事件处理函数
  const handleAdd = useCallback(() => {
    if (showForm) return; // 防止重复点击
    setEditId(null);
    setFormData({
      change_type: '',
      change_amount: '',
      remark: '',
      receiver: '',
      visibility: 'all',
    });
    setShowForm(true);
  }, [showForm]);

  const handleEdit = useCallback((item: BalanceChange) => {
    setEditId(item.id);
    setFormData({
      change_type: item.change_type,
      change_amount: String(item.change_amount ?? ''),
      remark: item.remark,
      receiver: item.receiver,
      visibility: item.visibility ?? 'all',
    });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    // 直接删除，不使用浏览器确认弹窗
    try {
      const res = await fetch(`/api/trust-account/change?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      setShowForm(false);
      fetchChanges(); // 删除后刷新数据
      console.log('Record deleted successfully');
    } catch (e) {
      console.error('删除失败:', e);
    }
  }, [fetchChanges]);

  // 表单字段变更 - 使用 useCallback 缓存
  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'change_amount') {
      // 允许输入负号和小数
      if (/^-?\d*(\.\d*)?$/.test(value) || value === '' || value === '-') {
        setFormData(prev => ({
          ...prev,
          change_amount: value as string
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  // 表单提交 - 使用 useCallback 缓存
  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
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
      // change_amount 字符串转 number，支持负号和小数
      const changeAmountNum = formData.change_amount && formData.change_amount !== '-' ? Number(formData.change_amount) : 0;
      if (!editId) {
        // 新增时取最新一条的 balance_after 作为 balance_before
        let latest = changes.length > 0 ? changes[changes.length - 1] : null;
        balance_before = latest && latest.balance_after !== null && latest.balance_after !== undefined
          ? Number(latest.balance_after)
          : 0;
        balance_after = balance_before + changeAmountNum;
      } else {
        // 编辑时用原始变动前余额
        const editing = changes.find(c => c.id === editId);
        balance_before = editing?.balance_before ?? 0;
        balance_after = balance_before + changeAmountNum;
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
      fetchChanges(); // 新增/编辑后刷新数据
      console.log('Record saved successfully');
    } catch (e) {
      console.error('保存失败:', e);
    } finally {
      setFormSubmitting(false);
    }
  }, [formSubmitting, caseId, formData, editId, changes, fetchChanges]);

  // 缓存排序切换处理函数
  const handleSortToggle = useCallback(() => {
    setSortDateDesc(v => !v);
  }, []);

  // 缓存筛选类型变更处理函数
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value || null);
    setPage(1);
  }, []);

  // 缓存分页处理函数
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
    if (val && !isNaN(Number(val))) {
      const num = Number(val);
      if (num >= 1 && num <= totalPages) {
        setPage(num);
      } else {
        setPageInput(String(page));
      }
    } else {
      setPageInput(String(page));
    }
  }, [page, totalPages]);

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
      if (val && !isNaN(Number(val))) {
        const num = Number(val);
        if (num >= 1 && num <= totalPages) {
          setPage(num);
        } else {
          setPageInput(String(page));
        }
      } else {
        setPageInput(String(page));
      }
    }
  }, [page, totalPages]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // 开始编辑余额
  const handleStartEditBalance = useCallback(() => {
    const currentBalanceNum = changes.length > 0 && changes[changes.length - 1].balance_after !== null 
      ? Number(changes[changes.length - 1].balance_after) 
      : 0;
    setBalanceInput(String(currentBalanceNum));
    setIsEditingBalance(true);
  }, [changes]);

  // 取消编辑余额
  const handleCancelEditBalance = useCallback(() => {
    setIsEditingBalance(false);
    setBalanceInput("");
  }, []);

  // 保存余额
  const handleSaveBalance = useCallback(async () => {
    if (!caseId || !balanceInput) return;
    
    const newBalance = Number(balanceInput);
    if (isNaN(newBalance)) {
      alert(t('trustAccount.invalidAmount', 'Please enter a valid amount'));
      return;
    }
    
    try {
      // 获取当前余额
      const currentBalanceNum = changes.length > 0 && changes[changes.length - 1].balance_after !== null 
        ? Number(changes[changes.length - 1].balance_after) 
        : 0;
      
      // 计算差额
      const changeAmount = newBalance - currentBalanceNum;
      
      // 自动创建一条记录
      const payload = {
        caseId,
        change_type: 'OTHER',
        change_amount: changeAmount,
        balance_before: currentBalanceNum,
        balance_after: newBalance,
        receiver: null,
        remark: t('trustAccount.balanceAdjustment', 'Balance Adjustment'),
        visibility: 'all',
      };
      
      const res = await fetch('/api/trust-account/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error('修改失败');
      
      setIsEditingBalance(false);
      setBalanceInput("");
      await fetchChanges(); // 刷新数据
      console.log('Balance updated successfully');
    } catch (e) {
      console.error('修改余额失败:', e);
      alert(t('trustAccount.balanceEditFailed', 'Failed to edit balance, please try again'));
    }
  }, [caseId, balanceInput, changes, fetchChanges, t]);

  // 缓存最新余额计算
  const currentBalance = useMemo(() => {
    if (changes.length > 0 && changes[changes.length - 1].balance_after !== null && changes[changes.length - 1].balance_after !== undefined) {
      return `$${Number(changes[changes.length - 1].balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
    return '--';
  }, [changes]);

  // 缓存唯一的交易类型列表
  const uniqueChangeTypes = useMemo(() => {
    return Array.from(new Set(changes.map(c => c.change_type)));
  }, [changes]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
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
            {!isEditingBalance ? (
              <span 
                className="text-2xl font-bold text-sage-800 cursor-pointer hover:text-sage-600 transition-colors duration-200 px-2 py-1 rounded hover:bg-sage-50"
                onClick={handleStartEditBalance}
                title={t('trustAccount.clickToEdit', 'Click to edit')}
              >
                {currentBalance}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={balanceInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^-?\d*\.?\d*$/.test(value) || value === '' || value === '-') {
                      setBalanceInput(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveBalance();
                    } else if (e.key === 'Escape') {
                      handleCancelEditBalance();
                    }
                  }}
                  className="text-2xl font-bold text-sage-800 border-2 border-sage-400 rounded px-2 py-1 w-48 focus:outline-none focus:border-sage-600"
                  autoFocus
                  inputMode="decimal"
                />
                <CustomButton
                  onClick={handleSaveBalance}
                  className="px-3 py-1 text-sm bg-sage-600 text-white hover:bg-sage-700 cursor-pointer rounded"
                >
                  {t('save', 'Save')}
                </CustomButton>
                <CustomButton
                  onClick={handleCancelEditBalance}
                  className="px-3 py-1 text-sm bg-gray-200 text-sage-800 hover:bg-gray-300 cursor-pointer rounded"
                >
                  {t('cancel', 'Cancel')}
                </CustomButton>
              </div>
            )}
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
        {showForm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000,
              display: 'flex',
              pointerEvents: 'none',
              background: 'rgba(0,0,0,0.08)',
              transition: 'left 0.3s,width 0.3s',
            }}
          >
            <Card
              className="p-6 bg-white border border-sage-200 shadow-2xl max-w-xl w-full relative text-sage-800"
              style={{
                pointerEvents: 'auto',
                position: 'absolute',
                left:
                  typeof window !== 'undefined' && window.innerWidth >= 768 && sidebarOpen
                    ? `calc(50% + ${parseInt(sidebarWidth) / 2}rem)`
                    : '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold text-sage-800">{editId ? t('trustAccount.editRecord', 'Edit Record') : t('trustAccount.addRecord', 'Add Record')}</div>
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
                  <label className="block mb-1 font-medium text-sage-800">{t('trustAccount.visibility', 'Visibility')}</label>
                  <select
                    name="visibility"
                    value={formData.visibility || 'all'}
                    onChange={handleFormChange}
                    className="border rounded px-2 py-1 w-full text-sage-800"
                  >
                    <option value="all">{t('trustAccount.visibilityAll', 'All')}</option>
                    <option value="intended_parents">{t('trustAccount.visibilityIntendedParents', 'Intended Parents Only')}</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sage-800">{t('trustAccount.amount', 'Amount')}</label>
                  <input
                    type="text"
                    name="change_amount"
                    value={formData.change_amount ?? ''}
                    onChange={handleFormChange}
                    className="border rounded px-2 py-1 w-full text-sage-800 text-left"
                    required
                    inputMode="decimal"
                    readOnly={!!editId}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sage-800">{t('trustAccount.receiver', 'Receiver')}</label>
                  <input
                    type="text"
                    name="receiver"
                    value={formData.receiver ?? ''}
                    onChange={handleFormChange}
                    className="border rounded px-2 py-1 w-full text-sage-800"
                    placeholder={t('trustAccount.pleaseEnterReceiver', 'Please enter receiver')}
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
                  <CustomButton type="button" className="px-3 py-1 rounded bg-gray-200 text-sage-800 cursor-pointer" onClick={handleCloseForm}>{t('cancel', 'Cancel')}</CustomButton>
                  <CustomButton
                    type="submit"
                    className="px-3 py-1 rounded bg-sage-600 text-white cursor-pointer"
                    style={{ opacity: formSubmitting ? 0.5 : 1 }}
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? t('saving', '保存中...') : t('save', '保存')}
                  </CustomButton>
                </div>
              </form>
            </Card>
          </div>
        )}
        <Card className="rounded-xl bg-white p-6 text-sage-800 mb-6 border border-sage-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-sage-800">{t('trustAccount.history', 'Transaction History')}</h2>
            <CustomButton
              className="bg-sage-600 text-white px-3 py-1 rounded hover:bg-sage-700 cursor-pointer"
              onClick={handleAdd}
              disabled={showForm}
            >
              {t('add', 'Add')}
            </CustomButton>
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
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.visibility', 'Visibility')}</th>
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.amount', 'Amount')}</th>
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.receiver', 'Receiver')}</th>
                      <th className="py-2 px-4 font-semibold">{t('trustAccount.remark', 'Remark')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedChanges.length === 0 ? (
                      <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-base">{t('trustAccount.noRecords', 'No records')}</td></tr>
                    ) : pagedChanges.map((change: BalanceChange, idx) => (
                      <tr
                        key={change.id}
                        style={{ cursor: 'pointer', background: idx % 2 === 0 ? '#FAFAF9' : '#fff', transition: 'background 0.2s' }}
                        onClick={() => handleEdit(change)}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#F5F7F6';
                          e.currentTarget.style.cursor = 'pointer';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = idx % 2 === 0 ? '#FAFAF9' : '#fff';
                          e.currentTarget.style.cursor = '';
                        }}
                      >
                        <td className="py-2 px-4 whitespace-nowrap">{change.created_at.slice(0, 19).replace('T', ' ')}</td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {change.change_type === 'RECHARGE' && t('trustAccount.typeRecharge', 'Recharge')}
                          {change.change_type === 'CONSUMPTION' && t('trustAccount.typeConsumption', 'Consumption')}
                          {change.change_type === 'OTHER' && t('trustAccount.typeOther', 'Other')}
                          {!['RECHARGE','CONSUMPTION','OTHER'].includes(change.change_type) ? String(t(`trustAccount.type.${change.change_type}`, change.change_type)) : ''}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap">
                          {change.visibility === 'all'
                            ? <span className="inline-flex items-center text-green-600 font-medium"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="mr-1"><circle cx="10" cy="10" r="8" fill="#22c55e"/><path d="M7 10l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>{t('trustAccount.visibilityAll', 'All')}</span>
                            : <span className="inline-flex items-center text-blue-600 font-medium"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="mr-1"><circle cx="10" cy="10" r="8" fill="#3b82f6"/><path d="M8 12l-2-2 2-2M12 8l2 2-2 2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>{t('trustAccount.visibilityIntendedParents', 'Intended Parents Only')}</span>
                          }
                        </td>
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
