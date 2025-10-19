"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Dialog } from "@/components/ui/dialog"
// 不再使用mock hook，全部用API
import { CustomButton } from "@/components/ui/CustomButton"
// import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Plus, UserPlus } from "lucide-react"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取辅助函数到组件外部，避免每次渲染重新创建
// 兼容 contact_information 为 jsonb 字符串或对象
function getFirstName(info: any): string {
  if (!info) return "-";
  if (typeof info === "object") {
    return info.first_name || info.firstName || "-";
  }
  if (typeof info === "string") {
    return info;
  }
  return "-";
}

export default function AllCasesPage() {
  const { t, i18n } = useTranslation("common")
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  // 状态枚举和映射（必须在 t 获取后定义）
  const STATUS_ENUM = [
    { value: 'Matching', label: t('matching', { defaultValue: 'Matching' }) },
    { value: 'LegalStage', label: t('legalStage', { defaultValue: 'Legal Stage' }) },
    { value: 'CyclePrep', label: t('cyclePrep', { defaultValue: 'Cycle Prep' }) },
    { value: 'Pregnant', label: t('pregnancy', { defaultValue: 'Pregnancy' }) },
    { value: 'Transferred', label: t('transferred', { defaultValue: 'Transferred' }) },
  ];
  // 状态下拉相关
  const [statusDropdownCaseId, setStatusDropdownCaseId] = useState<number | null>(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  // 国际化由 i18n 控制，无需本地 language 状态
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null)
  const [selectedSurrogateId, setSelectedSurrogateId] = useState<number | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  // 分页相关
  const [allCases, setAllCases] = useState<any[]>([])
  const [cases, setCases] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [pageSize, setPageSize] = useState(10)
  // 筛选相关
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedSurrogate, setSelectedSurrogate] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [surrogates, setSurrogates] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [managers, setManagers] = useState<any[]>([])

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
  }, [router])

  // 自适应每页条数，始终两行，宽度自适应
  useEffect(() => {
    function calcPageSize() {
      // 卡片宽度约340px+gap，左右padding 32px
      const containerWidth = window.innerWidth - 64
      const cardWidth = 340 + 32
      const rowCount = Math.max(1, Math.floor(containerWidth / cardWidth))
      const colCount = 2 // 固定两行
      const newPageSize = rowCount * colCount
      setPageSize(newPageSize)
    }
    calcPageSize()
    window.addEventListener('resize', calcPageSize)
    return () => window.removeEventListener('resize', calcPageSize)
  }, [])

  // 刷新全部数据
  const fetchAllData = async () => {
    const [casesRes, surrogatesRes, clientsRes, managersRes] = await Promise.all([
      fetch("/api/cases-list").then(r => r.json()),
      fetch("/api/surrogates-list").then(r => r.json()),
      fetch("/api/clients-list").then(r => r.json()),
      fetch("/api/client-managers").then(r => r.json()),
    ]);
    // 兼容直接数组或 { data: [...] } 两种格式
    const allCasesData = Array.isArray(casesRes) ? casesRes : casesRes.data || [];
    setAllCases(allCasesData);
    setSurrogates(Array.isArray(surrogatesRes) ? surrogatesRes : surrogatesRes.data || []);
    setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes.data || []);
    setManagers(Array.isArray(managersRes) ? managersRes : managersRes.data || []);
  };
  
  // 只在认证后才加载数据
  useEffect(() => { 
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存过滤和分页逻辑
  const filteredAllCases = useMemo(() => {
    return allCases.filter((c: any) => {
      const parentMatch = !selectedParent || (c.intended_parent && String(c.intended_parent.id) === selectedParent);
      const surrogateMatch = !selectedSurrogate || (c.surrogate_mother && String(c.surrogate_mother.id) === selectedSurrogate);
      const managerMatch = !selectedManager || (c.client_manager && String(c.client_manager.id) === selectedManager);
      const statusMatch = !selectedStatus || c.process_status === selectedStatus;
      return parentMatch && surrogateMatch && managerMatch && statusMatch;
    });
  }, [allCases, selectedParent, selectedSurrogate, selectedManager, selectedStatus]);

  const { total, pagedCases, totalPages } = useMemo(() => {
    const totalCount = filteredAllCases.length
    const pages = Math.max(1, Math.ceil(totalCount / pageSize))
    const paged = filteredAllCases.slice((page - 1) * pageSize, page * pageSize)
    return { total: totalCount, pagedCases: paged, totalPages: pages }
  }, [filteredAllCases, page, pageSize])

  // 当总页数变化时，确保当前页不超过总页数
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
  }, [totalPages, page])

  // 使用 useCallback 缓存事件处理函数
  const handleOpenCreateDialog = useCallback(() => {
    setShowCreateDialog(true)
  }, [])

  const handleCloseCreateDialog = useCallback(() => {
    setShowCreateDialog(false)
    setSelectedSurrogateId(null)
    setSelectedParentId(null)
  }, [])

  const handleOpenAssignDialog = useCallback((caseId: number) => {
    setSelectedCaseId(caseId)
    setShowAssignDialog(true)
  }, [])

  const handleCloseAssignDialog = useCallback(() => {
    setShowAssignDialog(false)
    setSelectedCaseId(null)
    setSelectedManagerId(null)
  }, [])

  const handleParentFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedParent(e.target.value)
    setPage(1)
  }, [])

  const handleSurrogateFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSurrogate(e.target.value)
    setPage(1)
  }, [])

  const handleManagerFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedManager(e.target.value)
    setPage(1)
  }, [])

  const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
    setPage(1)
  }, [])

  const handleStatusDropdownToggle = useCallback((caseId: number) => {
    setStatusDropdownCaseId(statusDropdownCaseId === caseId ? null : caseId)
  }, [statusDropdownCaseId])

  const handleStatusUpdate = useCallback(async (caseId: number, newStatus: string) => {
    if (statusUpdating) return;
    setStatusUpdating(true);
    await fetch('/api/cases-update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId, process_status: newStatus })
    });
    setStatusDropdownCaseId(null);
    setStatusUpdating(false);
    await fetchAllData();
  }, [statusUpdating])

  const handleCreateCase = useCallback(async () => {
    if (!selectedSurrogateId || !selectedParentId) return
    setLoading(true)
    await fetch("/api/cases-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surrogate_mother_surrogate_mothers: selectedSurrogateId,
        intended_parent_intended_parents: selectedParentId
      })
    })
    setLoading(false)
    setShowCreateDialog(false)
    setSelectedSurrogateId(null)
    setSelectedParentId(null)
    await fetchAllData()
  }, [selectedSurrogateId, selectedParentId])

  const handleAssignManager = useCallback(async () => {
    if (!selectedCaseId || !selectedManagerId) return
    setLoading(true)
    await fetch("/api/cases-assign-manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_id: selectedCaseId, client_manager_id: selectedManagerId })
    })
    setLoading(false)
    setShowAssignDialog(false)
    setSelectedCaseId(null)
    setSelectedManagerId(null)
    await fetchAllData()
  }, [selectedCaseId, selectedManagerId])

  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(1, page - 1)
    setPage(newPage)
    setPageInput(String(newPage))
  }, [page])

  const handleNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, page + 1)
    setPage(newPage)
    setPageInput(String(newPage))
  }, [page, totalPages])

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setPageInput(val)
  }, [])

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let val = Number(e.target.value)
    if (isNaN(val) || val < 1) val = 1
    if (val > totalPages) val = totalPages
    setPage(val)
    setPageInput(String(val))
  }, [totalPages])

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let val = Number((e.target as HTMLInputElement).value)
      if (isNaN(val) || val < 1) val = 1
      if (val > totalPages) val = totalPages
      setPage(val)
      setPageInput(String(val))
    }
  }, [totalPages])

  // 使用 useMemo 缓存筛选选项
  const uniqueParents = useMemo(() => {
    return Array.from(
      new Map(
        allCases
          .map(c => c.intended_parent)
          .filter(Boolean)
          .map(p => [p.id, p])
      ).values()
    )
  }, [allCases])

  const uniqueSurrogates = useMemo(() => {
    return Array.from(
      new Map(
        allCases
          .map(c => c.surrogate_mother)
          .filter(Boolean)
          .map(s => [s.id, s])
      ).values()
    )
  }, [allCases])

  const uniqueManagers = useMemo(() => {
    return Array.from(
      new Map(
        allCases
          .map(c => c.client_manager)
          .filter(Boolean)
          .map(m => [m.id, m])
      ).values()
    )
  }, [allCases])

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(allCases.map(c => c.process_status).filter(Boolean)))
  }, [allCases])

  // 使用 useMemo 缓存状态映射
  const stageMap = useMemo<Record<string, string>>(() => ({
    Matching: t("matching"),
    LegalStage: t("legalStage"),
    CyclePrep: t("cyclePrep"),
    Pregnant: t("pregnancy"),
    Transferred: t("transferred"),
  }), [t])

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="space-y-6">
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
    // <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-wider text-sage-800">{t('allCases')}</h1>
          <div className="flex gap-2">
            <CustomButton onClick={handleOpenCreateDialog} className="bg-sage-200 text-sage-800 hover:bg-sage-250 font-medium cursor-pointer">
              {/* <Plus className="w-4 h-4 mr-2" /> */}
              {t('addNewCase')}
            </CustomButton>
          </div>
        </div>
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          {/* 只展示当前案例实际出现过的准父母 */}
          <select
            value={selectedParent}
            onChange={handleParentFilterChange}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 cursor-pointer"
          >
            <option value="">{t('allIntendedParents', '全部准父母')}</option>
            {uniqueParents.map(p => (
              <option key={p.id} value={String(p.id)}>{getFirstName(p.basic_information) || p.basic_information || p.email}</option>
            ))}
          </select>
          {/* 只展示当前案例实际出现过的代孕母 */}
          <select
            value={selectedSurrogate}
            onChange={handleSurrogateFilterChange}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 cursor-pointer"
          >
            <option value="">{t('allSurrogateMothers', '全部代孕母')}</option>
            {uniqueSurrogates.map(s => (
              <option key={s.id} value={String(s.id)}>{getFirstName(s.contact_information) || s.contact_informationname || s.email}</option>
            ))}
          </select>
          {/* 只展示当前案例实际出现过的客户经理 */}
          <select
            value={selectedManager}
            onChange={handleManagerFilterChange}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 cursor-pointer"
          >
            <option value="">{t('allClientManagers', '全部客户经理')}</option>
            {uniqueManagers.map(m => (
              <option key={m.id} value={String(m.id)}>{m.name || m.email}</option>
            ))}
          </select>
          {/* 只展示当前案例实际出现过的状态 */}
          <select
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 cursor-pointer"
          >
            <option value="">{t('allStatuses', '全部状态')}</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{stageMap[status] || status}</option>
            ))}
          </select>
        </div>
        {/* Cases Card Grid，始终有最小高度，无数据时显示占位 */}
        <div
          className="w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
            minHeight: '400px', // 可根据实际页面调整
          }}
        >
          {pagedCases.length > 0 ? (
            pagedCases.map((c: any) => {
              const parentName = c.intended_parent?.basic_information ?? c.intended_parent?.contact_information ?? c.intended_parent?.email ?? "-";
              const surrogateName = c.surrogate_mother?.contact_information ?? c.surrogate_mother?.basic_information ?? c.surrogate_mother?.email ?? "-";
              const managerName = c.client_manager?.name ?? c.client_manager?.email ?? "-";
              const trustBalance = c.trust_account_balance_changes && c.trust_account_balance_changes.length > 0 && c.trust_account_balance_changes[0].balance_after !== null && c.trust_account_balance_changes[0].balance_after !== undefined
                ? `$${Number(c.trust_account_balance_changes[0].balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                : '-';
              const statusText = stageMap[c.process_status] || c.process_status || "-";
              return (
                <div
                  key={c.id}
                  className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-visible relative"
                  style={{ overflow: 'visible', zIndex: 1 }}
                >
                  {/* ...existing card content... */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sage-400 text-xl font-semibold">{String(c.id).slice(-2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg text-sage-800 truncate">{t('caseId')}{c.id}</div>
                      <div className="text-sage-500 text-sm truncate font-medium">
                        {t('status')}
                        <span
                          className="inline-block cursor-pointer px-2 py-1 rounded hover:bg-sage-100"
                          onClick={() => handleStatusDropdownToggle(c.id)}
                          style={{ minWidth: 80 }}
                        >
                          {statusText}
                          <span className="ml-1 text-xs text-sage-400">▼</span>
                        </span>
                      </div>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        {statusDropdownCaseId === c.id && (
                          <div
                            className="z-50 mt-2 bg-white border border-sage-200 rounded shadow-lg"
                            style={{ minWidth: 160, position: 'absolute', left: 0, top: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                          >
                            {STATUS_ENUM.map((opt) => (
                              <div
                                key={opt.value}
                                className={`px-4 py-2 cursor-pointer hover:bg-sage-100 text-sage-700 ${c.process_status === opt.value ? 'font-bold bg-sage-50' : ''}`}
                                onClick={() => handleStatusUpdate(c.id, opt.value)}
                              >
                                {opt.label}
                              </div>
                            ))}
                            <div
                              className="px-4 py-2 cursor-pointer text-sage-400 hover:bg-sage-100"
                              onClick={() => setStatusDropdownCaseId(null)}
                            >{t('cancel')}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sage-700 text-[15px] font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">{t('trustBalanceLabel')}</span>
                      <span className="cursor-pointer text-blue-600 underline" onClick={() => router.push(`/admin/trust-account?caseId=${c.id}`)}>
                        {trustBalance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">{t('intendedParent')}：</span>
                      <span className="text-green-600 cursor-pointer underline font-medium" onClick={() => router.push(`/admin/client-profiles/${c.intended_parent?.id}`)}>{parentName}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">{t('surrogateMother')}：</span>
                      <span className="text-blue-600 cursor-pointer underline font-medium" onClick={() => router.push(`/admin/surrogate-profiles/${c.surrogate_mother?.id}`)}>{surrogateName}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">{t('clientManager')}：</span>
                      {managerName !== "-" ? (
                        <span className="font-medium">{managerName}</span>
                      ) : (
                        <span className="text-gray-400 font-medium">{t('notAssigned')}</span>
                      )}
                    </div>
                  </div>
                  <hr className="my-3 border-sage-100" />
                  <div className="flex flex-wrap gap-2 text-sm font-medium">
                    {/* ...existing card links... */}
                    <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/client-journey?caseId=${c.id}`)}>{t('myCases.intendedParentsJourney', 'Intended Parents Journey ')}</span> 
                    <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/surrogacy-journey?caseId=${c.id}`)}>{t('myCases.gestationalCarrierJourney', 'Gestational Carrier Journey ')}</span>
                    <span className="text-blue-600 underline cursor-pointer font-medium" onClick={() => router.push(`/admin/client-ivf-clinic?caseId=${c.id}`)}>{t('myCases.intendedParentsIvfClinic')}</span>
                    <span className="text-blue-600 underline cursor-pointer font-medium" onClick={() => router.push(`/admin/surrogate-ivf-clinic?caseId=${c.id}`)}>{t('myCases.gestationalCarrierIvfClinic')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sage-500 text-sm font-medium">{t('createdAt')}{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</span>
                    {managerName === "-" && (
                      <CustomButton className="px-3 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm font-medium cursor-pointer" onClick={() => handleOpenAssignDialog(c.id)}>
                        {t('assignClientManager')}
                      </CustomButton>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex items-center justify-center w-full h-full text-sage-500">
              {t('noApplications', { defaultValue: 'Loading...' })}
            </div>
          )}
        </div>

        {/* 分页控件 */}
        <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
          <CustomButton
            className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            {t('pagination.prevPage', { defaultValue: '上一页' })}
          </CustomButton>
          <span className="text-sage-700 text-sm flex items-center gap-2">
            {t('pagination.page', { defaultValue: '第' })}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handlePageInputKeyDown}
              className="w-14 px-2 py-1 border border-sage-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-sage-300"
              aria-label={t('pagination.jumpToPage', { defaultValue: '跳转到页码' })}
            />
            {t('pagination.of', { defaultValue: '共' })} {totalPages} {t('pagination.pages', { defaultValue: '页' })}
          </span>
          <CustomButton
            className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer"
            disabled={page >= totalPages}
            onClick={handleNextPage}
          >
            {t('pagination.nextPage', { defaultValue: '下一页' })}
          </CustomButton>
        </div>

        {pagedCases.length === 0 && !loading && total > 0 && (
          <div className="text-center py-8 text-sage-500">
            {t('noApplications', { defaultValue: 'Loading...' })}
          </div>
        )}
        {/* 新增案子弹窗（无遮罩，仅内容） */}
        {showCreateDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">{t('addNewCase')}</h2>
              <div className="mb-4">
                <label className="block mb-2">{t('selectSurrogateMother')}</label>
                <select className="w-full border rounded px-2 py-1 cursor-pointer" value={selectedSurrogateId ?? ""} onChange={e => setSelectedSurrogateId(Number(e.target.value))}>
                  <option value="">{t('pleaseSelect')}</option>
                  {/* 过滤掉已有案例中的代孕母 */}
                  {surrogates
                    .filter((s: any) => !allCases.some((c: any) => c.surrogate_mother?.id === s.id))
                    .map((s: any) => (
                      <option key={s.id} value={s.id}>{getFirstName(s.contact_information) || s.name}</option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">{t('selectIntendedParent')}</label>
                <select className="w-full border rounded px-2 py-1 cursor-pointer" value={selectedParentId ?? ""} onChange={e => setSelectedParentId(Number(e.target.value))}>
                  <option value="">{t('pleaseSelect')}</option>
                  {/* 过滤掉已有案例中的准父母 */}
                  {clients
                    .filter((p: any) => !allCases.some((c: any) => c.intended_parent?.id === p.id))
                    .map((p: any) => (
                      <option key={p.id} value={p.id}>{getFirstName(p.basic_information) || p.name}</option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <CustomButton onClick={handleCreateCase} disabled={loading} className="bg-sage-600 text-white">{loading ? t('processing') : t('confirmAdd')}</CustomButton>
                <CustomButton className="px-3 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer" onClick={handleCloseCreateDialog}>{t('cancel')}</CustomButton>
              </div>
            </div>
          </div>
        )}
        {/* 分配客户经理弹窗（无遮罩，仅内容） */}
        {showAssignDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">{t('assignClientManager')}</h2>
              <div className="mb-4">
                <label className="block mb-2">{t('selectClientManager')}</label>
                <select className="w-full border rounded px-2 py-1 cursor-pointer" value={selectedManagerId ?? ""} onChange={e => setSelectedManagerId(Number(e.target.value))}>
                  <option value="">{t('pleaseSelect')}</option>
                  {managers.map((m: any) => <option key={m.id} value={m.id}>{m.name || m.email}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <CustomButton onClick={handleAssignManager} disabled={loading} className="bg-sage-600 text-white">{loading ? t('processing') : t('confirmAssign')}</CustomButton>
                <CustomButton className="px-3 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer" onClick={handleCloseAssignDialog}>{t('cancel')}</CustomButton>
              </div>
            </div>
          </div>
        )}
      </div>
    // </AdminLayout>
  )
}
