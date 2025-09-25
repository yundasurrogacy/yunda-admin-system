"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getClientManagers, insertClientManager } from "@/lib/graphql/client-managers"

export default function ClientManagerPage() {
  const [managers, setManagers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [addLoading, setAddLoading] = useState(false)

  const loadManagers = async () => {
    setLoading(true)
    try {
      const data = await getClientManagers(30, 0)
      setManagers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadManagers()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    try {
      await insertClientManager(form)
      setAddOpen(false)
      setForm({ email: "", password: "" })
      await loadManagers()
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader title="客户经理管理"
          rightContent={
            <Button onClick={() => setAddOpen(true)}>
              添加客户经理
            </Button>
          }
        />
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <form onSubmit={handleAdd} className="space-y-4">
            <h2 className="text-lg font-bold mb-2">添加客户经理</h2>
            <Label>邮箱<Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></Label>
            <Label>密码<Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required /></Label>
            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={addLoading}>提交</Button>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>取消</Button>
            </div>
          </form>
        </Dialog>
        <div className="mt-8">
          {loading ? (
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : managers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">暂无客户经理</div>
          ) : (
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'stretch',
              }}
            >
              {managers.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {/* 可换成客户经理头像或图标 */}
                      <span className="text-sage-400 text-xl font-bold">{m.email?.[0]?.toUpperCase() || "M"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg text-sage-800 truncate">{m.email}</div>
                      <div className="text-sage-500 text-sm truncate">ID: {m.id}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="bg-sage-100 text-sage-700 px-3 py-1 text-xs rounded-full">Manager</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">密码：</span>
                      <span className="truncate">{m.password}</span>
                    </div>
                  </div>
                  <hr className="my-3 border-sage-100" />
                  <div className="flex items-center justify-between text-sage-500 text-sm">
                    <span>
                      创建时间：<br />{m.created_at ? new Date(m.created_at).toLocaleString() : "-"}
                    </span>
                    {/* 可扩展更多操作按钮 */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContent>
    </AdminLayout>
  )
}
