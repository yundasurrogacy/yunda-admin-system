'use client'

import * as React from 'react'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import ManagerLayout from '@/components/manager-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Surrogate {
  id: string
  name: string
  location: string
  status: 'Matched' | 'In Progress'
}

export default function SurrogateProfiles() {
  const { t } = useTranslation('common')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [allSurrogates, setAllSurrogates] = React.useState<Surrogate[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(1)
  const [pageInput, setPageInput] = React.useState('1')
  const [pageSize, setPageSize] = React.useState(8)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    async function fetchSurrogates() {
      setLoading(true)
      setError(null)
      try {
        function getCookie(name: string) {
          if (typeof document === 'undefined') return undefined;
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? match[2] : undefined;
        }
        const managerId = typeof document !== 'undefined' ? getCookie('userId_manager') : null;
        const caseRes = await fetch(`/api/cases-by-manager?managerId=${managerId}`)
        if (!caseRes.ok) throw new Error(t('surrogateProfiles.fetchCasesFailed'))
        const caseData = await caseRes.json()
        const casesRaw = caseData.cases || caseData.data || caseData || []
        const surrogateIds = Array.isArray(casesRaw)
          ? casesRaw.map((item: any) => item.surrogate_mother?.id).filter(Boolean)
          : []
        const details: Surrogate[] = []
        for (const surrogateId of surrogateIds) {
          const res = await fetch(`/api/surrogate_mothers-detail?surrogacy=${surrogateId}`)
          if (res.ok) {
            const detail = await res.json()
            details.push({
              id: detail.id,
              name: detail.contact_information?.name || detail.name || '',
              location: detail.location || detail.contact_information?.location || '',
              status: detail.status || 'Matched',
            })
          }
        }
        setAllSurrogates(details)
      } catch (err: any) {
        setError(t('surrogateProfiles.fetchDataFailed'))
      }
      setLoading(false)
    }
    fetchSurrogates()
  }, [t])

  // 自适应 pageSize
  React.useEffect(() => {
    function calcPageSize() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // 320px 卡片宽度 + 24px 间距
      const cardWidth = 320 + 24;
      const columns = Math.max(1, Math.floor(width / cardWidth));
      setPageSize(columns * 2); // 2 行
    }
    calcPageSize();
    window.addEventListener('resize', calcPageSize);
    return () => window.removeEventListener('resize', calcPageSize);
  }, []);

  // 搜索和分页逻辑移到组件顶层，避免 hooks 顺序问题
  const filteredAllSurrogates = allSurrogates.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredAllSurrogates.length / pageSize));
  const pagedSurrogates = filteredAllSurrogates.slice((page - 1) * pageSize, page * pageSize);
  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      setPageInput(String(totalPages));
    }
  }, [totalPages, page]);

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium text-sage-800">{t('surrogateProfiles.title')}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              className="w-[240px] pl-9 bg-white font-medium text-sage-800 border-none shadow rounded-full focus:ring-0 focus:outline-none"
              placeholder={t('surrogateProfiles.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="font-medium text-sage-800">{t('loadingText')}</div>
        ) : error ? (
          <div className="font-medium text-red-500">{error}</div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              ref={containerRef}
            >
              {pagedSurrogates.map((surrogate, idx) => (
                <div
                  key={`${surrogate.id}-${idx}`}
                  className="rounded-xl bg-sage-50 p-6 shadow text-sage-800 font-medium flex flex-col justify-between min-h-[120px] hover:shadow-lg transition-shadow"
                  onMouseEnter={() => setHovered(surrogate.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div>
                    <div className="text-lg font-medium mb-1 text-sage-800">{surrogate.name}</div>
                    <div className="text-sm mb-1 text-sage-800">{surrogate.location}</div>
                    <div className="text-sm mb-2 text-sage-800">{t('surrogateProfiles.role')}</div>
                    <div className="text-sm mb-2 text-sage-800">{surrogate.status}</div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className={`rounded bg-sage-100 text-sage-800 font-medium px-4 py-1 text-xs shadow-none border border-sage-200 transition-colors ${hovered === surrogate.id ? 'bg-sage-200 border-sage-800' : ''}`}
                      onClick={() => router.push(`/client-manager/surrogate-profiles/${surrogate.id}`)}
                    >
                      {t('surrogateProfiles.view')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* 分页控件 */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="outline" size="sm" onClick={() => {
                const newPage = Math.max(1, page - 1);
                setPage(newPage);
                setPageInput(String(newPage));
              }} disabled={page === 1}>{t('pagination.prevPage', '上一页')}</Button>
              <span>
                {t('pagination.page', '第')}
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pageInput}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPageInput(val);
                  }}
                  onBlur={e => {
                    let val = Number(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > totalPages) val = totalPages;
                    setPage(val);
                    setPageInput(String(val));
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      let val = Number((e.target as HTMLInputElement).value);
                      if (isNaN(val) || val < 1) val = 1;
                      if (val > totalPages) val = totalPages;
                      setPage(val);
                      setPageInput(String(val));
                    }
                  }}
                  className="w-12 border rounded text-center mx-1"
                  style={{height: 28}}
                />
                {t('pagination.of', '共')} {totalPages} {t('pagination.pages', '页')}
              </span>
              <Button variant="outline" size="sm" onClick={() => {
                const newPage = Math.min(totalPages, page + 1);
                setPage(newPage);
                setPageInput(String(newPage));
              }} disabled={page === totalPages}>{t('pagination.nextPage', '下一页')}</Button>
            </div>
          </>
        )}
      </div>
    </ManagerLayout>
  )
}
