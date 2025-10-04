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
  const { t, i18n } = useTranslation("common")
  // 国际化由 i18n 控制，无需本地 language 状态
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null)
  const [selectedSurrogateId, setSelectedSurrogateId] = useState<number | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState<any[]>([])
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
      try {
        const obj = JSON.parse(info);
        return obj.first_name || obj.firstName || "-";
      } catch {
        return "-";
      }
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

  // 刷新全部数据
  const fetchAllData = async () => {
    const [casesRes, surrogatesRes, clientsRes, managersRes] = await Promise.all([
      fetch("/api/cases-list").then(r => r.json()),
      fetch("/api/surrogates-list").then(r => r.json()),
      fetch("/api/clients-list").then(r => r.json()),
      fetch("/api/client-managers").then(r => r.json()),
    ]);
    console.log('casesRes:', casesRes);
    console.log('surrogatesRes:', surrogatesRes);
    console.log('clientsRes:', clientsRes);
    console.log('managersRes:', managersRes);
    // 兼容直接数组或 { data: [...] } 两种格式
    setCases(Array.isArray(casesRes) ? casesRes : casesRes.data || []);
    setSurrogates(Array.isArray(surrogatesRes) ? surrogatesRes : surrogatesRes.data || []);
    setClients(Array.isArray(clientsRes) ? clientsRes : clientsRes.data || []);
    setManagers(Array.isArray(managersRes) ? managersRes : managersRes.data || []);
  };
  useEffect(() => { fetchAllData(); }, []);
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-light tracking-wider text-foreground">{t('allCases')}</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)} className="bg-sage-200 text-sage-800 hover:bg-sage-250">
              <Plus className="w-4 h-4 mr-2" />{t('addNewCase')}
            </Button>
            {/* <Button onClick={() => {}} variant="outline" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-border">
              <Download className="mr-2 h-4 w-4" />{t('export')}
            </Button> */}
          </div>
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
          {cases.map((c: any) => {
            const parentName = c.intended_parent?.basic_information ?? c.intended_parent?.contact_information ?? c.intended_parent?.email ?? "-";
            const surrogateName = c.surrogate_mother?.contact_information ?? c.surrogate_mother?.basic_information ?? c.surrogate_mother?.email ?? "-";
            const managerName = c.client_manager?.name ?? c.client_manager?.email ?? "-";
            return (
              <div
                key={c.id}
                className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sage-400 text-xl font-bold">{String(c.id).slice(-2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-sage-800 truncate">{t('caseId')}{c.id}</div>
                    <div className="text-sage-500 text-sm truncate">{t('status')}{c.process_status || c.status || "-"}</div>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs text-sage-400">{t('surrogateMother')}：</span>
                    <span className="text-blue-600 cursor-pointer underline" onClick={() => router.push(`/admin/surrogate-profiles/${c.surrogate_mother?.id}`)}>{surrogateName}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs text-sage-400">{t('intendedParent')}：</span>
                    <span className="text-green-600 cursor-pointer underline" onClick={() => router.push(`/admin/client-profiles/${c.intended_parent?.id}`)}>{parentName}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs text-sage-400">{t('clientManager')}：</span>
                    {managerName !== "-" ? (
                      <span>{managerName}</span>
                    ) : (
                      <span className="text-gray-400">{t('notAssigned')}</span>
                    )}
                  </div>
                </div>
                <hr className="my-3 border-sage-100" />
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/journey?caseId=${c.id}`)}>{t('journey.title')}</span>
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/ivf-clinic?caseId=${c.id}`)}>{t('ivfClinic.title')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sage-500 text-sm">{t('createdAt')}{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</span>
                  {managerName === "-" && (
                    <Button size="sm" variant="outline" onClick={() => { setSelectedCaseId(c.id); setShowAssignDialog(true); }}>
                      <UserPlus className="w-4 h-4 mr-1" />{t('assignClientManager')}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* 新增案子弹窗 */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>{t('cancel')}</Button>
            </div>
          </div>
        </Dialog>
        {/* 分配客户经理弹窗 */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
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
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>{t('cancel')}</Button>
            </div>
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
