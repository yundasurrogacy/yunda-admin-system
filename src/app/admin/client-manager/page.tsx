"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
// import { AdminLayout } from "@/components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { CustomButton } from "@/components/ui/CustomButton"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getClientManagers, insertClientManager } from "@/lib/graphql/client-managers"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

export default function ClientManagerPage() {
  const { t } = useTranslation("common")
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
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

  // 使用 useCallback 缓存数据加载函数
  const loadManagers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getClientManagers(10000, 0)
      setAllManagers(data)
    } finally {
      setLoading(false)
    }
  }, [])

  // 只在认证后才加载数据
  useEffect(() => {
    if (isAuthenticated) {
      loadManagers()
    }
  }, [isAuthenticated, loadManagers])

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存搜索和分页逻辑（必须在使用它的 useCallback 之前）
  const filteredAllManagers = useMemo(() => {
    return allManagers.filter(m => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        m.email?.toLowerCase().includes(searchLower) ||
        String(m.id).includes(searchTerm)
      )
    })
  }, [allManagers, searchTerm])

  const { total, pagedManagers, totalPages } = useMemo(() => {
    const totalCount = filteredAllManagers.length
    const pages = Math.max(1, Math.ceil(totalCount / pageSize))
    const paged = filteredAllManagers.slice((page - 1) * pageSize, page * pageSize)
    return { total: totalCount, pagedManagers: paged, totalPages: pages }
  }, [filteredAllManagers, page, pageSize])

  // 使用 useCallback 缓存事件处理函数
  const handleAdd = useCallback(async (e: React.FormEvent) => {
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
  }, [form, loadManagers])

  const handleOpenAddDialog = useCallback(() => {
    setAddOpen(true)
  }, [])

  const handleCloseAddDialog = useCallback(() => {
    setAddOpen(false)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }, [])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, email: e.target.value }))
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, password: e.target.value }))
  }, [])

  const handlePrevPage = useCallback(() => {
    setPage(page - 1)
  }, [page])

  const handleNextPage = useCallback(() => {
    setPage(page + 1)
  }, [page])

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setPageInput(val)
  }, [])

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    if (val && !isNaN(Number(val))) {
      const num = Number(val)
      if (num >= 1 && num <= totalPages) {
        setPage(num)
      } else {
        setPageInput(String(page))
      }
    } else {
      setPageInput(String(page))
    }
  }, [page, totalPages])

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
      if (val && !isNaN(Number(val))) {
        const num = Number(val)
        if (num >= 1 && num <= totalPages) {
          setPage(num)
        } else {
          setPageInput(String(page))
        }
      } else {
        setPageInput(String(page))
      }
    }
  }, [page, totalPages])

  // 同步 pageInput
  useEffect(() => {
    setPageInput(String(page))
  }, [page])

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <PageContent>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </PageContent>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  return (

      <PageContent>
        <PageHeader title={t('clientManagerManagement')}
          rightContent={
            <CustomButton className="font-medium text-sage-800 cursor-pointer bg-sage-100 border border-sage-300" onClick={handleOpenAddDialog}>
              {t('addClientManager')}
            </CustomButton>
          }
        />
        {/* 新增客户经理弹窗（无遮罩，仅内容） */}
        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <form onSubmit={handleAdd} className="p-8 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-sage-800 mb-2 text-center tracking-wide">{t('addClientManager')}</h2>
              <div className="flex flex-col gap-3">
                <Label className="text-sage-800 font-medium mb-1" htmlFor="email">{t('emailLabel')}</Label>
                <Input id="email" value={form.email} onChange={handleEmailChange} required className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sage-300" />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sage-800 font-medium mb-1" htmlFor="password">{t('passwordLabel')}</Label>
                <Input id="password" type="password" value={form.password} onChange={handlePasswordChange} required className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sage-300" />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <CustomButton type="submit" disabled={addLoading} className="font-medium cursor-pointer px-6 py-2 bg-sage-600 text-white rounded-md shadow">{addLoading ? t('processing') : t('submit')}</CustomButton>
                <CustomButton type="button" className="font-medium cursor-pointer px-6 py-2 rounded-md border border-sage-300 bg-white" onClick={handleCloseAddDialog}>{t('cancel')}</CustomButton>
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
            onChange={handleSearchChange}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
              <div className="text-lg text-sage-700">{t('loading')}</div>
            </div>
          </div>
        ) : total === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="text-sage-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-xl text-sage-600 font-medium mb-2">{t('noClientManager')}</p>
              <p className="text-sm text-sage-400 mb-6">{t('noClientManagerDesc', { defaultValue: '暂无客户经理记录' })}</p>
            </div>
          </div>
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
              <CustomButton
                className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
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
                className="cursor-pointer border border-sage-300 bg-white text-sage-800 px-3 py-1 text-sm rounded"
                disabled={page >= totalPages}
                onClick={handleNextPage}
              >
                {t('pagination.nextPage', { defaultValue: '下一页' })}
              </CustomButton>
            </div>
          </>
        )}
      </PageContent>
  )
}
