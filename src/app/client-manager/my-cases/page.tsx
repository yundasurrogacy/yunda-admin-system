'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, FileText, Search, Filter, RefreshCw } from 'lucide-react'
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'
import { Case } from '@/types/cases'

export default function MyCases() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: ''
  })

  useEffect(() => {
    fetchCases()
  }, [filters])

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // 模拟数据
  const mockCases: Case[] = [
    {
      id: '1',
      status: '进行中',
      client_name: '张女士',
      surrogate_id: 'S2025001',
      start_date: '2025-01-15',
      last_update: '2025-09-05',
      title: '第一次代孕计划',
      description: '常规代孕计划，进展顺利',
      manager_id: 'current_manager_id'
    },
    {
      id: '2',
      status: '待配对',
      client_name: '李女士',
      surrogate_id: 'S2025002',
      start_date: '2025-02-20',
      last_update: '2025-09-04',
      title: '特殊代孕计划',
      description: '需要特殊医疗关注',
      manager_id: 'current_manager_id'
    },
    {
      id: '3',
      status: '已完成',
      client_name: '王女士',
      surrogate_id: 'S2024015',
      start_date: '2024-08-10',
      last_update: '2025-08-30',
      title: '成功完成的代孕计划',
      description: '顺利完成，母婴平安',
      manager_id: 'current_manager_id'
    }
  ]

  const fetchCases = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const hasuraClient = getHasuraClient()
      
      // 构建查询条件
      const where: any = {
        manager_id: { _eq: 'current_manager_id' } // 需要替换为实际的经理ID
      }
      
      if (filters.search) {
        where._or = [
          { client_name: { _ilike: `%${filters.search}%` } },
          { title: { _ilike: `%${filters.search}%` } },
          { description: { _ilike: `%${filters.search}%` } }
        ]
      }
      
      if (filters.status) {
        where.status = { _eq: filters.status }
      }
      
      if (filters.startDate) {
        where.start_date = { _gte: filters.startDate }
      }

      try {
        const result = await hasuraClient.datas<Case>({
          table: 'cases',
          args: {
            where,
            order_by: { last_update: () => 'desc' }
          },
          datas_fields: [
            'id',
            'status',
            'client_name',
            'surrogate_id',
            'start_date',
            'last_update',
            'title',
            'description',
            'manager_id'
          ]
        })
        setCases(Array.isArray(result) ? result : [])
      } catch (apiError) {
        console.warn('API 请求失败，使用本地测试数据:', apiError)
        // 使用模拟数据并应用过滤
        let filteredMockCases = [...mockCases]
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredMockCases = filteredMockCases.filter(c => 
            c.client_name.toLowerCase().includes(searchLower) ||
            c.title.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower)
          )
        }
        
        if (filters.status) {
          filteredMockCases = filteredMockCases.filter(c => 
            c.status === filters.status
          )
        }
        
        if (filters.startDate) {
          filteredMockCases = filteredMockCases.filter(c => {
            try {
              return c.start_date && new Date(c.start_date) >= new Date(filters.startDate);
            } catch (e) {
              console.error('日期解析错误:', e);
              return false;
            }
          });
        }
        
        setCases(filteredMockCases)
      }
    } catch (err) {
      console.error('获取案例列表失败:', err)
      setError('获取案例列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const refreshCases = () => {
    fetchCases()
  }

  const handleViewDetails = (caseId: string) => {
    router.push(`/client-manager/my-cases/${caseId}`)
  }

  const handleViewDocuments = (caseId: string) => {
    router.push(`/client-manager/documents?caseId=${caseId}`)
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">我的案例</h1>
          </div>
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-red-500 font-medium">{error}</div>
              <Button onClick={fetchCases} variant="outline">
                重试加载
              </Button>
            </div>
          </Card>
          {cases.length > 0 && (
            <div className="grid gap-4">
              {cases.map((case_) => (
                <Card key={case_.id} className="p-6">
                  {/* 省略卡片内容，与下方相同 */}
                </Card>
              ))}
            </div>
          )}
        </div>
      </ManagerLayout>
    )
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">我的案例</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCases}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">搜索</label>
                <div className="mt-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    className="pl-9"
                    placeholder="搜索案例..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">状态</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => updateFilters({ status: value === 'all' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="进行中">进行中</SelectItem>
                    <SelectItem value="待配对">待配对</SelectItem>
                    <SelectItem value="已完成">已完成</SelectItem>
                    <SelectItem value="已取消">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">开始日期</label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => updateFilters({ startDate: e.target.value })}
                />
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {loading ? (
            // 加载状态
            [...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            cases.map((case_) => (
              <Card key={case_.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">案例 #{case_.id}</h3>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          case_.status === '进行中'
                            ? 'bg-green-100 text-green-800'
                            : case_.status === '待配对'
                            ? 'bg-yellow-100 text-yellow-800'
                            : case_.status === '已完成'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {case_.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">客户：{case_.client_name}</p>
                    <p className="text-sm text-gray-500">代孕编号：{case_.surrogate_id || '暂无'}</p>
                    <p className="text-sm text-gray-500">开始日期：{case_.start_date ? new Date(case_.start_date).toLocaleDateString('zh-CN') : '未设置'}</p>
                    <p className="text-sm text-gray-500">最后更新：{case_.last_update ? new Date(case_.last_update).toLocaleDateString('zh-CN') : '未更新'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(case_.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocuments(case_.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      相关文件
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ManagerLayout>
  )
}
