"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AdminLayout } from "@/components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getClientManagers, insertClientManager } from "@/lib/graphql/client-managers"

export default function ClientManagerPage() {
  const { t } = useTranslation("common")
  // 分页相关
  const [allManagers, setAllManagers] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState("1")
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [addLoading, setAddLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 自适应每页条数，始终两行，宽度自适应
  useEffect(() => {
    function calcPageSize() {
      const containerWidth = window.innerWidth - 64
      const cardWidth = 340 + 32
      const rowCount = Math.max(1, Math.floor(containerWidth / cardWidth))
      const colCount = 2
      const newPageSize = rowCount * colCount
      setPageSize(newPageSize)
    }
    calcPageSize()
    window.addEventListener('resize', calcPageSize)
    return () => window.removeEventListener('resize', calcPageSize)
  }, [])

  // page变化时同步pageInput
  useEffect(() => {
    setPageInput(String(page))
  }, [page])

  // 校验输入页码有效性
  const validatePageInput = (val: string) => {
    const maxPage = Math.max(1, Math.ceil(total / pageSize))
    if (!val) return false
    const num = Number(val)
    if (isNaN(num) || num < 1 || num > maxPage) return false
    return true
  }

  const loadManagers = async () => {
    setLoading(true)
    try {
      const data = await getClientManagers(10000, 0)
      setAllManagers(data)
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
      setPage(1)
    } finally {
      setAddLoading(false)
    }
  }

  // 搜索和分页
  const filteredAllManagers = allManagers.filter(m => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      m.email?.toLowerCase().includes(searchLower) ||
      String(m.id).includes(searchTerm)
    )
  })
  const total = filteredAllManagers.length
  const pagedManagers = filteredAllManagers.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader title={t('clientManagerManagement')}
          rightContent={
            <Button className="font-medium text-sage-800 cursor-pointer" onClick={() => setAddOpen(true)}>
              {t('addClientManager')}
            </Button>
          }
        />
        {/* 新增客户经理弹窗（无遮罩，仅内容） */}
        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <form onSubmit={handleAdd} className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-sage-800 mb-2 text-center tracking-wide">{t('addClientManager')}</h2>
              <div className="flex flex-col gap-3">
                <Label className="text-sage-800 font-medium mb-1" htmlFor="email">{t('emailLabel')}</Label>
                <Input id="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sage-300" />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sage-800 font-medium mb-1" htmlFor="password">{t('passwordLabel')}</Label>
                <Input id="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sage-300" />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <Button type="submit" disabled={addLoading} className="font-medium cursor-pointer px-6 py-2 bg-sage-600 text-white rounded-md shadow">{addLoading ? t('processing') : t('submit')}</Button>
                <Button type="button" variant="outline" className="font-medium cursor-pointer px-6 py-2 rounded-md" onClick={() => setAddOpen(false)}>{t('cancel')}</Button>
              </div>
            </form>
          </div>
        )}
        <div className="mb-6 mt-8">
          <Input
            type="text"
            placeholder={t('searchManagers', { defaultValue: 'Search Client Managers' })}
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">{t('loading')}</div>
        ) : total === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">{t('noClientManager')}</div>
        ) : (
          <>
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'stretch',
              }}
            >
              {pagedManagers.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {/* 可换成客户经理头像或图标 */}
                      <span className="text-sage-400 text-xl font-semibold">{m.email?.[0]?.toUpperCase() || t('managerShort')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg text-sage-800 truncate">{m.email}</div>
                      <div className="text-sage-500 text-sm truncate font-medium">{t('id')}{m.id}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="bg-sage-100 text-sage-700 px-3 py-1 text-xs rounded-full font-medium">{t('manager')}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sage-700 text-[15px] font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">{t('passwordLabel')}：</span>
                      <span className="truncate font-medium">{m.password}</span>
                    </div>
                  </div>
                  <hr className="my-3 border-sage-100" />
                  <div className="flex items-center justify-between text-sage-500 text-sm font-medium">
                    <span>
                      {t('createdAt')}<br />{m.created_at ? new Date(m.created_at).toLocaleString() : "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* 分页控件 */}
            <div className="flex flex-wrap justify-center items-center mt-8 gap-4">
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
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
                    // 只允许数字
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    setPageInput(val)
                  }}
                  onBlur={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    if (validatePageInput(val)) {
                      setPage(Number(val))
                    } else {
                      setPageInput(String(page))
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
                      if (validatePageInput(val)) {
                        setPage(Number(val))
                      } else {
                        setPageInput(String(page))
                      }
                    }
                  }}
                  className="w-14 px-2 py-1 border border-sage-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-sage-300"
                  aria-label={t('pagination.jumpToPage', { defaultValue: '跳转到页码' })}
                />
                {t('pagination.of', { defaultValue: '共' })} {Math.max(1, Math.ceil(total / pageSize))} {t('pagination.pages', { defaultValue: '页' })}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage(page + 1)}
              >
                {t('pagination.nextPage', { defaultValue: '下一页' })}
              </Button>
            </div>
          </>
        )}
      </PageContent>
    </AdminLayout>
  )
}
