"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Dialog } from "@/components/ui/dialog"
// 不再使用mock hook，全部用API
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Plus, UserPlus } from "lucide-react"

export default function AllCasesPage() {
  // ...existing code...
  const { t, i18n } = useTranslation("common")
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
  const [managers, setManagers] = useState<any[]>([]);
  const router = useRouter();

  // 兼容 contact_information 为 jsonb 字符串或对象
  function getFirstName(info: any) {
    if (!info) return "-";
    if (typeof info === "object") {
      return info.first_name || info.firstName || "-";
    }
    if (typeof info === "string") {
      // 如果是纯字符串，直接返回
      return info;
    }
    return "-";
  }
  // const [language, setLanguage] = useState<"EN" | "CN">("EN")
  // const [showCreateDialog, setShowCreateDialog] = useState(false)
  // const [showAssignDialog, setShowAssignDialog] = useState(false)
  // const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null)
  // const [selectedSurrogateId, setSelectedSurrogateId] = useState<number | null>(null)
  // const [selectedParentId, setSelectedParentId] = useState<number | null>(null)
  // const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null)
  // const [loading, setLoading] = useState(false)
  // const [cases, setCases] = useState<any[]>([])
  // const [surrogates, setSurrogates] = useState<any[]>([])
  // const [clients, setClients] = useState<any[]>([])
  // const [managers, setManagers] = useState<any[]>([]);
  // const router = useRouter();

  useEffect(() => {
    // 调试打印所有数据
    console.log('cases:', cases);
    console.log('surrogates:', surrogates);
    console.log('clients:', clients);
    console.log('managers:', managers);
  }, [cases, surrogates, clients, managers]);

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
  useEffect(() => { fetchAllData(); }, []);
  // 搜索和分页
  const filteredAllCases = allCases.filter((c: any) => {
    const parentMatch = !selectedParent || (c.intended_parent && String(c.intended_parent.id) === selectedParent);
    const surrogateMatch = !selectedSurrogate || (c.surrogate_mother && String(c.surrogate_mother.id) === selectedSurrogate);
    const managerMatch = !selectedManager || (c.client_manager && String(c.client_manager.id) === selectedManager);
    const statusMatch = !selectedStatus || c.process_status === selectedStatus;
    return parentMatch && surrogateMatch && managerMatch && statusMatch;
  });
  const total = filteredAllCases.length
  const pagedCases = filteredAllCases.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
      setPageInput(String(totalPages))
    }
  }, [totalPages, page])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-wider text-sage-800">{t('allCases')}</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)} className="bg-sage-200 text-sage-800 hover:bg-sage-250 font-medium cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />{t('addNewCase')}
            </Button>
          </div>
        </div>
        {/* 筛选器 */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          {/* 只展示当前案例实际出现过的准父母 */}
          <select
            value={selectedParent}
            onChange={e => { setSelectedParent(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="">{t('allIntendedParents', '全部准父母')}</option>
            {Array.from(
              new Map(
                allCases
                  .map(c => c.intended_parent)
                  .filter(Boolean)
                  .map(p => [p.id, p])
              ).values()
            ).map(p => (
              <option key={p.id} value={String(p.id)}>{getFirstName(p.basic_information) || p.basic_information || p.email}</option>
            ))}
          </select>
          {/* 只展示当前案例实际出现过的代孕母 */}
          <select
            value={selectedSurrogate}
            onChange={e => { setSelectedSurrogate(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="">{t('allSurrogateMothers', '全部代孕母')}</option>
            {Array.from(
              new Map(
                allCases
                  .map(c => c.surrogate_mother)
                  .filter(Boolean)
                  .map(s => [s.id, s])
              ).values()
            ).map(s => (
              <option key={s.id} value={String(s.id)}>{getFirstName(s.contact_information) || s.contact_informationname || s.email}</option>
            ))}
          </select>
          {/* 只展示当前案例实际出现过的客户经理 */}
          <select
            value={selectedManager}
            onChange={e => { setSelectedManager(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="">{t('allClientManagers', '全部客户经理')}</option>
            {Array.from(
              new Map(
                allCases
                  .map(c => c.client_manager)
                  .filter(Boolean)
                  .map(m => [m.id, m])
              ).values()
            ).map(m => (
              <option key={m.id} value={String(m.id)}>{m.name || m.email}</option>
            ))}
          </select>
          {/* 只展示当前案例实际出现过的状态 */}
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md p-2 bg-white shadow-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
          >
            <option value="">{t('allStatuses', '全部状态')}</option>
            {Array.from(new Set(allCases.map(c => c.process_status).filter(Boolean))).map(status => (
              <option key={status} value={status}>{(() => {
                const stageMap: Record<string, string> = {
                  Matching: t("matching"),
                  LegalStage: t("legalStage"),
                  CyclePrep: t("cyclePrep"),
                  Pregnant: t("pregnancy"),
                  Transferred: t("transferred"),
                };
                return stageMap[status] || status;
              })()}</option>
            ))}
          </select>
        </div>
        {/* Cases Card Grid */}
        <div
          className="w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {pagedCases.map((c: any) => {
            // 状态国际化映射，必须在t可用后定义
            const stageMap: Record<string, string> = {
              Matching: t("matching"),
              LegalStage: t("legalStage"),
              CyclePrep: t("cyclePrep"),
              Pregnant: t("pregnancy"),
              Transferred: t("transferred"),
            };
            const parentName = c.intended_parent?.basic_information ?? c.intended_parent?.contact_information ?? c.intended_parent?.email ?? "-";
            const surrogateName = c.surrogate_mother?.contact_information ?? c.surrogate_mother?.basic_information ?? c.surrogate_mother?.email ?? "-";
            const managerName = c.client_manager?.name ?? c.client_manager?.email ?? "-";
            // 信托账户余额
            const trustBalance = c.trust_account_balance_changes && c.trust_account_balance_changes.length > 0 && c.trust_account_balance_changes[0].balance_after !== null && c.trust_account_balance_changes[0].balance_after !== undefined
              ? `$${Number(c.trust_account_balance_changes[0].balance_after).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : '-';
            // 国际化状态
            const statusText = stageMap[c.process_status] || c.process_status || "-";
            return (
              <div
                key={c.id}
                className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage-400 text-xl font-semibold">{String(c.id).slice(-2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-sage-800 truncate">{t('caseId')}{c.id}</div>
                    <div className="text-sage-500 text-sm truncate font-medium">{t('status')}{statusText}</div>
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
                  {/* <span className="text-blue-600 underline cursor-pointer font-medium" onClick={() => router.push(`/admin/journey?caseId=${c.id}`)}>{t('myCases.journey')}</span>
                  */}
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/client-journey?caseId=${c.id}`)}>{t('myCases.intendedParentsJourney', 'Intended Parents Journey ')}</span> 
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/surrogacy-journey?caseId=${c.id}`)}>{t('myCases.gestationalCarrierJourney', 'Gestational Carrier Journey ')}</span>
                  {/* <span className="text-purple-600 underline cursor-pointer" onClick={() => router.push(`/admin/appointments?caseId=${c.id}`)}>{t('myCases.appointments', 'APPOINTMENTS')}</span> */}
                  {/* <span className="text-pink-600 underline cursor-pointer" onClick={() => router.push(`/admin/medication?caseId=${c.id}`)}>{t('myCases.medication', 'MEDICATION')}</span> */}
                  <span className="text-blue-600 underline cursor-pointer font-medium" onClick={() => router.push(`/admin/client-ivf-clinic?caseId=${c.id}`)}>{t('myCases.intendedParentsIvfClinic')}</span>
                  <span className="text-blue-600 underline cursor-pointer font-medium" onClick={() => router.push(`/admin/surrogate-ivf-clinic?caseId=${c.id}`)}>{t('myCases.gestationalCarrierIvfClinic')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage-500 text-sm font-medium">{t('createdAt')}{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</span>
                  {managerName === "-" && (
                    <Button size="sm" variant="outline" className="font-medium cursor-pointer" onClick={() => { setSelectedCaseId(c.id); setShowAssignDialog(true); }}>
                      <UserPlus className="w-4 h-4 mr-1" />{t('assignClientManager')}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 分页控件 */}
        <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            disabled={page === 1}
            onClick={() => {
              const newPage = Math.max(1, page - 1)
              setPage(newPage)
              setPageInput(String(newPage))
            }}
          >
            {t('pagination.prevPage', { defaultValue: '上一页' })}
          </Button>
          <span className="text-sage-700 text-sm flex items-center gap-2">
            {t('pagination.page', { defaultValue: '第' })}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '')
                setPageInput(val)
              }}
              onBlur={e => {
                let val = Number(e.target.value)
                if (isNaN(val) || val < 1) val = 1
                if (val > totalPages) val = totalPages
                setPage(val)
                setPageInput(String(val))
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  let val = Number((e.target as HTMLInputElement).value)
                  if (isNaN(val) || val < 1) val = 1
                  if (val > totalPages) val = totalPages
                  setPage(val)
                  setPageInput(String(val))
                }
              }}
              className="w-14 px-2 py-1 border border-sage-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-sage-300"
              aria-label={t('pagination.jumpToPage', { defaultValue: '跳转到页码' })}
            />
            {t('pagination.of', { defaultValue: '共' })} {totalPages} {t('pagination.pages', { defaultValue: '页' })}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            disabled={page >= totalPages}
            onClick={() => {
              const newPage = Math.min(totalPages, page + 1)
              setPage(newPage)
              setPageInput(String(newPage))
            }}
          >
            {t('pagination.nextPage', { defaultValue: '下一页' })}
          </Button>
        </div>

        {pagedCases.length === 0 && (
          <div className="text-center py-8 text-sage-500">
            {t('noApplications', { defaultValue: '暂无记录' })}
          </div>
        )}
        {/* 新增案子弹窗（无遮罩，仅内容） */}
        {showCreateDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">{t('addNewCase')}</h2>
              <div className="mb-4">
                <label className="block mb-2">{t('selectSurrogateMother')}</label>
                <select className="w-full border rounded px-2 py-1" value={selectedSurrogateId ?? ""} onChange={e => setSelectedSurrogateId(Number(e.target.value))}>
                  <option value="">{t('pleaseSelect')}</option>
                  {surrogates.map((s: any) => <option key={s.id} value={s.id}>{getFirstName(s.contact_information) || s.name}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">{t('selectIntendedParent')}</label>
                <select className="w-full border rounded px-2 py-1" value={selectedParentId ?? ""} onChange={e => setSelectedParentId(Number(e.target.value))}>
                  <option value="">{t('pleaseSelect')}</option>
                  {clients.map((p: any) => <option key={p.id} value={p.id}>{getFirstName(p.basic_information) || p.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={async () => {
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
                }} disabled={loading} className="bg-sage-600 text-white">{loading ? t('processing') : t('confirmAdd')}</Button>
                <Button variant="outline" className="cursor-pointer" onClick={() => setShowCreateDialog(false)}>{t('cancel')}</Button>
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
                <select className="w-full border rounded px-2 py-1" value={selectedManagerId ?? ""} onChange={e => setSelectedManagerId(Number(e.target.value))}>
                  <option value="">{t('pleaseSelect')}</option>
                  {managers.map((m: any) => <option key={m.id} value={m.id}>{m.name || m.email}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={async () => {
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
                }} disabled={loading} className="bg-sage-600 text-white">{loading ? t('processing') : t('confirmAssign')}</Button>
                <Button variant="outline" className="cursor-pointer" onClick={() => setShowAssignDialog(false)}>{t('cancel')}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
