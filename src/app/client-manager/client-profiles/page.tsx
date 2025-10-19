'use client'

import * as React from 'react'
import { useRef, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/CustomButton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client"
// import ManagerLayout from "@/components/manager-layout"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

interface ClientProfile {
  id: string
  name: string
  country: string
  email: string
  phone: string
  status: 'Matched' | 'In Progress'
  created_at: string
  updated_at: string
}

interface Filters {
  search: string;
  status: string;
  startDate: string;
}




export default function ClientProfilesPage() {
  const router = useRouter()
  const { t } = useTranslation('common')
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  
  const [allClients, setAllClients] = React.useState<ClientProfile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageInput, setPageInput] = React.useState('1')
  const [pageSize, setPageSize] = React.useState(9) // 默认 3 列 3 行
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    status: '',
    startDate: ''
  })
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  // 认证检查和 cookie 读取
  React.useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_manager')
      const userEmail = getCookie('userEmail_manager')
      const userId = getCookie('userId_manager')
      const authed = !!(userRole && userEmail && userId && userRole === 'manager')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client-manager/login')
      }
    }
  }, [router]);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useCallback 缓存处理搜索函数
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }, []);

  // 自适应 pageSize
  React.useEffect(() => {
    function calcPageSize() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // 340px 卡片宽度 + 24px 间距
      const cardWidth = 340 + 24;
      const columns = Math.max(1, Math.floor(width / cardWidth));
      setPageSize(columns * 2); // 2 行
    }
    calcPageSize();
    window.addEventListener('resize', calcPageSize);
    return () => window.removeEventListener('resize', calcPageSize);
  }, []);

  // 使用 useCallback 缓存数据获取函数
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const managerId = typeof document !== 'undefined' ? getCookie('userId_manager') : null;
      // 2. 获取所有case
      const caseRes = await fetch(`/api/cases-by-manager?managerId=${managerId}`);
      if (!caseRes.ok) throw new Error('获取案子失败');
      const caseData = await caseRes.json();
      const casesRaw = caseData.cases || caseData.data || caseData || [];
      // 3. 提取所有准父母id
      const parentIds = Array.isArray(casesRaw)
        ? casesRaw.map((item: any) => item.intended_parent?.id).filter(Boolean)
        : [];
      // 4. 批量获取准父母详情
      const parentDetails: ClientProfile[] = [];
      for (const parentId of parentIds) {
        const res = await fetch(`/api/intended-parent-detail?parentId=${parentId}`);
        if (res.ok) {
          const detail = await res.json();
          parentDetails.push({
            id: detail.id,
            name: detail.basic_information?.firstName + ' ' + detail.basic_information?.lastName || detail.name || '',
            country: detail.family_profile?.country || '',
            email: detail.contact_information?.email_address || detail.email || '',
            phone: detail.contact_information?.cell_phone || '',
            status: detail.status || 'Matched',
            created_at: detail.created_at || '',
            updated_at: detail.updated_at || '',
          });
        }
      }
      setAllClients(parentDetails);
    } catch (err) {
      console.error('获取客户列表失败:', err);
      setError('获取客户列表失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 只在认证后才加载数据
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
    }
  }, [isAuthenticated, fetchClients]);

  // 使用 useMemo 缓存筛选后的客户列表
  const filteredAllClients = useMemo(() => allClients.filter(client => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;
    return (
      (client.name && client.name.toLowerCase().includes(search)) ||
      (client.country && client.country.toLowerCase().includes(search)) ||
      (client.email && client.email.toLowerCase().includes(search)) ||
      (client.phone && client.phone.toLowerCase().includes(search))
    );
  }), [allClients, searchTerm]);

  // 使用 useMemo 缓存分页数据
  const { totalPages, pagedClients } = useMemo(() => {
    const pages = Math.max(1, Math.ceil(filteredAllClients.length / pageSize));
    const paged = filteredAllClients.slice((page - 1) * pageSize, page * pageSize);
    return { totalPages: pages, pagedClients: paged };
  }, [filteredAllClients, page, pageSize]);

  // 翻页时如果超出总页数，自动回到最后一页
  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      setPageInput(String(totalPages));
    }
  }, [totalPages, page]);

  // 使用 useCallback 缓存导航函数
  const handleViewDetails = useCallback((clientId: string) => {
    router.push(`/client-manager/client-profiles/${clientId}`)
  }, [router]);

  const handleViewDocuments = useCallback((clientId: string) => {
    router.push(`/client-manager/documents?clientId=${clientId}`)
  }, [router]);

  const handleViewCommunication = useCallback((clientId: string) => {
    router.push(`/client-manager/communication-logs?clientId=${clientId}`)
  }, [router]);

  const handleScheduleMeeting = useCallback((clientId: string) => {
    router.push(`/client-manager/schedule?clientId=${clientId}`)
  }, [router]);

  // 缓存分页处理函数
  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    setPageInput(String(newPage));
  }, [page]);

  const handleNextPage = useCallback(() => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
    setPageInput(String(newPage));
  }, [page, totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPageInput(val);
  }, []);

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    setPage(val);
    setPageInput(String(val));
  }, [totalPages]);

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let val = Number((e.target as HTMLInputElement).value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > totalPages) val = totalPages;
      setPage(val);
      setPageInput(String(val));
    }
  }, [totalPages]);

  const handleMouseEnter = useCallback((clientId: string) => {
    setHoveredId(clientId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

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

  if (error) {
    return (
      // <ManagerLayout>
        <div className="text-red-500">{t('clientProfiles.loadingFailed', { error: error })}</div>
      // </ManagerLayout>
    )
  }

  return (
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium text-sage-800">{t('clientProfiles.title')}</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('clientProfiles.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9 bg-white w-full font-medium text-sage-800 rounded-full"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="font-medium text-sage-800">{t('loadingText')}</div>
        ) : (
          <>
            <div
              className="grid grid-cols-3 gap-6"
              ref={containerRef}
            >
              {pagedClients.map(client => (
                <Card 
                  key={client.id} 
                  className="relative p-6 rounded-xl bg-white hover:shadow-lg transition-shadow text-sage-800 font-medium"
                  onMouseEnter={() => handleMouseEnter(client.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-sage-800">{client.name}</h3>
                      <p className="text-sm text-sage-800 opacity-60">{client.country}</p>
                    </div>
                    <CustomButton
                      className={
                        (hoveredId === client.id
                          ? "rounded bg-white border border-sage-200 text-sage-800 font-medium px-4 py-1 text-sm shadow-none"
                          : "rounded bg-sage-100 text-sage-800 font-medium px-4 py-1 text-sm shadow-none border border-sage-200"
                        ) + " cursor-pointer"
                      }
                      onClick={() => handleViewDetails(client.id)}
                    >
                      {t('clientProfiles.view')}
                    </CustomButton>
                  </div>
                  <p className="text-sm text-sage-800 opacity-60">{client.status === 'Matched' ? t('clientProfiles.clientStatus') : client.status}</p>
                </Card>
              ))}
            </div>
            {/* 分页控件 */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <CustomButton className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer" onClick={handlePrevPage} disabled={page === 1}>{t('pagination.prevPage', '上一页')}</CustomButton>
              <span>
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
              <CustomButton className="px-4 py-1 rounded border border-sage-300 bg-white text-sage-800 text-sm cursor-pointer" onClick={handleNextPage} disabled={page === totalPages}>{t('pagination.nextPage', '下一页')}</CustomButton>
            </div>
          </>
        )}
      </div>
  )
}
