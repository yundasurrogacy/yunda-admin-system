'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  Filter, 
  Users, 
  UserPlus,
  FileText,
  ChevronRight,
  X,
  ArrowLeft,
  Clock
} from 'lucide-react'
import { useClients } from '@/hooks/useClients'
import { useSurrogates } from '@/hooks/useSurrogates'
import { useDebounce } from '@/hooks/use-debounce'
import { Client } from '@/types/client'
import { Surrogate } from '@/types/surrogate'

type SearchResult = {
  type: 'client' | 'surrogate';
  id: string | number;
  name: string;
  info: string;
  status: string;
}

export default function ClientSearch() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'client' | 'surrogate'>('all')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  
  // 防抖搜索词
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // 使用 hooks 获取客户和代孕妈妈数据
  const { clients, loading: clientsLoading } = useClients({ 
    search: searchType === 'surrogate' ? '' : debouncedSearchTerm 
  })
  const { surrogates, loading: surrogatesLoading } = useSurrogates({ 
    search: searchType === 'client' ? '' : debouncedSearchTerm 
  })
  
  // 加载最近搜索记录
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])
  
  // 保存搜索记录
  const saveSearchTerm = (term: string) => {
    if (!term.trim()) return
    
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5)
    
    setRecentSearches(updatedSearches)
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
  }
  
  // 处理搜索结果
  useEffect(() => {
    setLoading(clientsLoading || surrogatesLoading)
    
    const results: SearchResult[] = []
    
    if (searchType !== 'surrogate' && clients.length > 0) {
      clients.forEach((client: Client) => {
        results.push({
          type: 'client',
          id: client.id,
          name: client.name,
          info: client.phone || client.email || '',
          status: client.status
        })
      })
    }
    
    if (searchType !== 'client' && surrogates.length > 0) {
      surrogates.forEach((surrogate: Surrogate) => {
        results.push({
          type: 'surrogate',
          id: surrogate.id,
          name: surrogate.name,
          info: `${surrogate.age}岁 | ${surrogate.health} | ${surrogate.experience}`,
          status: surrogate.status
        })
      })
    }
    
    setSearchResults(results)
  }, [clients, surrogates, clientsLoading, surrogatesLoading, searchType])
  
  // 处理搜索提交
  const handleSearch = () => {
    if (searchTerm.trim()) {
      saveSearchTerm(searchTerm)
    }
  }
  
  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'client') {
      router.push(`/client-manager/client-profiles/${result.id}`)
    } else {
      router.push(`/client-manager/surrogate-profiles/${result.id}`)
    }
  }
  
  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* 页面标题和返回按钮 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">档案查询</h1>
            <p className="text-gray-500">搜索客户和代孕妈妈档案</p>
          </div>
        </div>
        
        {/* 搜索区域 */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="输入姓名、手机号或其他关键词"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>搜索</Button>
            </div>
            
            {/* 筛选器 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">筛选：</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={searchType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('all')}
                >
                  全部
                </Button>
                <Button
                  variant={searchType === 'client' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('client')}
                >
                  <Users className="h-3 w-3 mr-1" />
                  客户
                </Button>
                <Button
                  variant={searchType === 'surrogate' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('surrogate')}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  代孕妈妈
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* 搜索结果或最近搜索 */}
        <div className="space-y-4">
          {debouncedSearchTerm ? (
            <>
              {/* 搜索结果 */}
              <h2 className="text-lg font-semibold">搜索结果</h2>
              
              {loading ? (
                <div className="py-8 text-center text-gray-500">
                  正在搜索...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  未找到匹配的结果
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {searchResults.map((result) => (
                    <Card
                      key={`${result.type}-${result.id}`}
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {result.type === 'client' ? (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                                <UserPlus className="h-4 w-4 text-pink-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{result.name}</p>
                              <p className="text-xs text-gray-500">{result.info}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <div className="text-sm">
                            {result.type === 'client' ? '客户' : '代孕妈妈'}
                          </div>
                          <div>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs 
                              ${result.status === '活跃' || result.status === '可配对' ? 'bg-green-100 text-green-800' : 
                                result.status === '进行中' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {result.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* 最近搜索和快速访问 */}
              {recentSearches.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">最近搜索</h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm(term)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 快速访问卡片 */}
              <h2 className="text-lg font-semibold mt-6 mb-2">快速访问</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push('/client-manager/client-profiles')}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">客户档案管理</h3>
                        <p className="text-sm text-gray-500">查看和管理所有客户资料</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push('/client-manager/surrogate-profiles')}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">代孕妈妈档案管理</h3>
                        <p className="text-sm text-gray-500">查看和管理所有代孕妈妈资料</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
        
        {/* 底部操作区 */}
        <div className="mt-8 pt-4 border-t">
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/client-manager/dashboard')}
            >
              返回仪表盘
            </Button>
            <Button
              onClick={() => router.push('/client-manager/client-profiles/new')}
            >
              <FileText className="h-4 w-4 mr-2" />
              创建新档案
            </Button>
          </div>
        </div>
      </div>
    </ManagerLayout>
  )
}
