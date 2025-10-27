'use client'

import * as React from 'react'
import { useRef, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/CustomButton"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, User, MapPin } from "lucide-react"
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
  age?: string
  city?: string
  state?: string
  gender?: string
  ethnicity?: string
  languages?: string[]
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
  const [dataLoaded, setDataLoaded] = React.useState(false)
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
    if (dataLoaded) return;
    
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
          const basic = detail.basic_information || {};
          const family = detail.family_profile || {};
          const contact = detail.contact_information || {};
          
          // 计算年龄
          let age = '';
          if (basic.date_of_birth) {
            const birth = new Date(basic.date_of_birth);
            const now = new Date();
            const calculatedAge = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
            age = String(calculatedAge);
          }
          
          parentDetails.push({
            id: detail.id,
            name: `${basic.firstName || ''} ${basic.lastName || ''}`.trim() || detail.name || '',
            country: family.country || '',
            email: contact.email_address || detail.email || '',
            phone: contact.cell_phone || '',
            status: detail.status || 'Matched',
            created_at: detail.created_at || '',
            updated_at: detail.updated_at || '',
            age,
            city: family.city,
            state: family.state_or_province,
            gender: basic.pronouns || basic.gender_identity,
            ethnicity: basic.ethnicity,
            languages: contact.primary_languages_selected_keys || [],
          });
        }
      }
      setAllClients(parentDetails);
      setDataLoaded(true);
    } catch (err) {
      console.error('获取客户列表失败:', err);
      setError('获取客户列表失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [dataLoaded]);

  // 只在认证后才加载数据
  React.useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      fetchClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
              <div className="text-lg text-sage-700">{t('loading')}</div>
            </div>
          </div>
        ) : pagedClients.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="text-sage-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-xl text-sage-600 font-medium mb-2">
                {searchTerm ? t('clientProfiles.noClientsFiltered', { defaultValue: '暂无客户资料' }) : t('clientProfiles.noClients', { defaultValue: '暂无客户资料' })}
              </p>
              <p className="text-sm text-sage-400 mb-6">
                {searchTerm ? t('clientProfiles.noClientsDescFiltered', { defaultValue: '当前筛选条件下没有找到客户资料' }) : t('clientProfiles.noClientsDesc', { defaultValue: '目前没有任何客户资料' })}
              </p>
            </div>
          </div>
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
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-sage-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-sage-800 truncate">{client.name}</h3>
                      <p className="text-sm text-sage-600 opacity-60">{t('id')}: {client.id} {client.age ? `• ${t('age')}: ${client.age}` : ''}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-sage-700 mb-4">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-4 h-4 text-sage-400" />
                      <span className="truncate">{client.email || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-4 h-4 text-sage-400" />
                      <span className="truncate">{client.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 text-sage-400" />
                      <span className="truncate">{[client.city, client.state, client.country].filter(Boolean).join(', ') || '-'}</span>
                    </div>
                    {client.gender && (
                      <div className="text-xs text-sage-600">
                        {t('genderIdentity')}: {client.gender}
                      </div>
                    )}
                    {client.ethnicity && (
                      <div className="text-xs text-sage-600">
                        {t('ethnicity')}: {client.ethnicity}
                      </div>
                    )}
                    {client.languages && client.languages.length > 0 && (
                      <div className="text-xs text-sage-600">
                        {t('languages')}: {client.languages.join(', ')}
                      </div>
                    )}
                  </div>
                  <hr className="mb-4 border-sage-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-sage-500">
                      {t('lastUpdate')}: {client.updated_at?.slice(0, 10) || '-'}
                    </span>
                    <CustomButton
                      className={
                        (hoveredId === client.id
                          ? "rounded bg-sage-600 text-white font-medium px-4 py-2 text-sm shadow-none"
                          : "rounded bg-sage-100 text-sage-800 font-medium px-4 py-2 text-sm shadow-none border border-sage-200"
                        ) + " cursor-pointer"
                      }
                      onClick={() => handleViewDetails(client.id)}
                    >
                      {t('clientProfiles.view')}
                    </CustomButton>
                  </div>
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
