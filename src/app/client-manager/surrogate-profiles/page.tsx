'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useDebounce } from '@/hooks/use-debounce'
import ManagerLayout from '@/components/manager-layout'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  User,
  CalendarDays,
  Activity,
  Filter,
  RefreshCw,
  FileText,
  ClipboardCheck,
  UserCheck,
  AlertCircle,
  ChevronRight,
  Heart,
  Star,
} from 'lucide-react'
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'
import { Surrogate, SurrogateFilters } from '@/types/surrogates'

export default function SurrogateProfiles() {
  const router = useRouter()
  const [showFilters, setShowFilters] = React.useState(false)
  const [surrogates, setSurrogates] = React.useState<Surrogate[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [filters, setFilters] = React.useState<SurrogateFilters>({
    search: '',
    status: '',
    health: '',
    experience: '',
    ageRange: { min: undefined, max: undefined }
  })

  const debouncedFilters = useDebounce(filters, 500)

  React.useEffect(() => {
    fetchSurrogates()
  }, [debouncedFilters])

  const updateFilters = (newFilters: Partial<SurrogateFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // 模拟数据
  const mockSurrogates: Surrogate[] = [
    {
      id: '1',
      name: '李梅',
      age: 28,
      experience: '有经验',
      health: '优秀',
      last_checkup: '2025-08-25',
      status: '可配对',
      created_at: '2025-01-15',
      updated_at: '2025-09-05',
      manager_id: 'current_manager_id'
    },
    {
      id: '2',
      name: '王芳',
      age: 26,
      experience: '首次',
      health: '良好',
      last_checkup: '2025-09-01',
      status: '已配对',
      created_at: '2025-02-20',
      updated_at: '2025-09-04',
      manager_id: 'current_manager_id'
    },
    {
      id: '3',
      name: '张丽',
      age: 29,
      experience: '有经验',
      health: '优秀',
      last_checkup: '2025-08-30',
      status: '已完成',
      created_at: '2024-12-10',
      updated_at: '2025-08-30',
      manager_id: 'current_manager_id'
    },
    {
      id: '4',
      name: '赵雪',
      age: 27,
      experience: '首次',
      health: '良好',
      last_checkup: '2025-09-03',
      status: '可配对',
      created_at: '2025-03-15',
      updated_at: '2025-09-03',
      manager_id: 'current_manager_id'
    }
  ]

  const fetchSurrogates = async () => {
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
          { name: { _ilike: `%${filters.search}%` } }
        ]
      }
      
      if (filters.status) {
        where.status = { _eq: filters.status }
      }
      
      if (filters.health) {
        where.health = { _eq: filters.health }
      }
      
      if (filters.experience) {
        where.experience = { _eq: filters.experience }
      }
      
      if (filters.ageRange?.min !== undefined) {
        where.age = { ...where.age, _gte: filters.ageRange.min }
      }
      
      if (filters.ageRange?.max !== undefined) {
        where.age = { ...where.age, _lte: filters.ageRange.max }
      }

      try {
        const result = await hasuraClient.datas<Surrogate>({
          table: 'surrogates',
          args: {
            where,
            order_by: { created_at: () => 'desc' }
          },
          datas_fields: [
            'id',
            'name',
            'age',
            'experience',
            'health',
            'last_checkup',
            'status',
            'created_at',
            'updated_at'
          ]
        })
        setSurrogates(Array.isArray(result) ? result : [])
      } catch (apiError) {
        console.warn('API 请求失败，使用本地测试数据:', apiError)
        // 使用模拟数据并应用过滤
        let filteredMockSurrogates = [...mockSurrogates]
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredMockSurrogates = filteredMockSurrogates.filter(s => 
            s.name.toLowerCase().includes(searchLower)
          )
        }
        
        if (filters.status) {
          filteredMockSurrogates = filteredMockSurrogates.filter(s => 
            s.status === filters.status
          )
        }

        if (filters.health) {
          filteredMockSurrogates = filteredMockSurrogates.filter(s => 
            s.health === filters.health
          )
        }

        if (filters.experience) {
          filteredMockSurrogates = filteredMockSurrogates.filter(s => 
            s.experience === filters.experience
          )
        }

        if (filters.ageRange?.min) {
          filteredMockSurrogates = filteredMockSurrogates.filter(s => 
            s.age >= (filters.ageRange?.min || 0)
          )
        }

        if (filters.ageRange?.max) {
          filteredMockSurrogates = filteredMockSurrogates.filter(s => 
            s.age <= (filters.ageRange?.max || 999)
          )
        }
        
        setSurrogates(filteredMockSurrogates)
      }
    } catch (err) {
      console.error('获取代孕者列表失败:', err)
      setError('获取代孕者列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const refreshSurrogates = () => {
    fetchSurrogates()
  }

  const handleViewDetails = (surrogateId: string) => {
    router.push(`/client-manager/surrogate-profiles/${surrogateId}`)
  }

  const handleViewDocuments = (surrogateId: string) => {
    router.push(`/client-manager/documents?surrogateId=${surrogateId}`)
  }

  const handleViewMedical = (surrogateId: string) => {
    router.push(`/client-manager/medical-records?surrogateId=${surrogateId}`)
  }

  const handleMatchClient = (surrogateId: string) => {
    router.push(`/client-manager/matching?surrogateId=${surrogateId}`)
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="text-red-500">加载失败: {error}</div>
      </ManagerLayout>
    )
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">代孕资料</h1>
            <p className="text-sm text-gray-500 mt-1">管理和跟踪代孕者信息</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className={cn(
                "transition-all duration-200",
                showFilters && "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className={cn("h-4 w-4 mr-2", showFilters && "text-white")} />
              {showFilters ? "隐藏筛选" : "显示筛选"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-purple-50"
              onClick={refreshSurrogates}
              disabled={loading}
            >
              <RefreshCw className={cn(
                "h-4 w-4 mr-2 transition-all",
                loading ? "animate-spin text-purple-500" : "text-gray-500"
              )} />
              {loading ? "加载中..." : "刷新"}
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="p-6 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">筛选条件</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      search: '',
                      status: '',
                      health: '',
                      experience: '',
                      ageRange: { min: undefined, max: undefined }
                    })
                  }}
                >
                  重置筛选
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">搜索</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      className="pl-9 bg-white/80"
                      placeholder="按姓名搜索..."
                      value={filters.search || ''}
                      onChange={(e) => updateFilters({ search: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">状态</label>
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={(value) => updateFilters({ status: value === 'all' ? '' : value })}
                  >
                    <SelectTrigger className="bg-white/80">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>状态筛选</SelectLabel>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="可配对">可配对</SelectItem>
                        <SelectItem value="已配对">已配对</SelectItem>
                        <SelectItem value="已完成">已完成</SelectItem>
                        <SelectItem value="暂停中">暂停中</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">健康状况</label>
                  <Select
                    value={filters.health || 'all'}
                    onValueChange={(value) => updateFilters({ health: value === 'all' ? '' : value })}
                  >
                    <SelectTrigger className="bg-white/80">
                      <SelectValue placeholder="选择健康状况" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>健康筛选</SelectLabel>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="优秀">优秀</SelectItem>
                        <SelectItem value="良好">良好</SelectItem>
                        <SelectItem value="一般">一般</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">经验</label>
                  <Select
                    value={filters.experience || 'all'}
                    onValueChange={(value) => updateFilters({ experience: value === 'all' ? '' : value })}
                  >
                    <SelectTrigger className="bg-white/80">
                      <SelectValue placeholder="选择经验" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>经验筛选</SelectLabel>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="有经验">有经验</SelectItem>
                        <SelectItem value="首次">首次</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">年龄范围</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      className="bg-white/80"
                      placeholder="最小年龄"
                      value={filters.ageRange?.min || ''}
                      onChange={(e) => updateFilters({
                        ageRange: { ...filters.ageRange, min: parseInt(e.target.value) }
                      })}
                    />
                    <Input
                      type="number"
                      className="bg-white/80"
                      placeholder="最大年龄"
                      value={filters.ageRange?.max || ''}
                      onChange={(e) => updateFilters({
                        ageRange: { ...filters.ageRange, max: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {loading ? (
            // 加载状态
            [...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            surrogates.map((surrogate) => (
              <Card key={surrogate.id} className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center ring-2 ring-purple-100">
                      <User className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{surrogate.name}</h3>
                        <span className="text-sm text-gray-500">({surrogate.age}岁)</span>
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3" />
                          {surrogate.experience}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <Badge variant="outline" className={cn("gap-1", 
                          surrogate.health === "优秀" ? "bg-green-50 text-green-700" :
                          surrogate.health === "良好" ? "bg-blue-50 text-blue-700" :
                          "bg-gray-50 text-gray-700"
                        )}>
                          <Heart className="h-3 w-3" />
                          {surrogate.health}
                        </Badge>
                        <span className="flex items-center text-gray-500">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          最近体检：{format(new Date(surrogate.last_checkup), 'yyyy-MM-dd')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                    <Badge variant="secondary" className={cn("gap-1",
                      surrogate.status === '可配对' ? "bg-green-100 text-green-800" :
                      surrogate.status === '已配对' ? "bg-blue-100 text-blue-800" :
                      surrogate.status === '已完成' ? "bg-gray-100 text-gray-800" :
                      "bg-yellow-100 text-yellow-800"
                    )}>
                      <UserCheck className="h-4 w-4" />
                      {surrogate.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-purple-50"
                        onClick={() => handleViewDetails(surrogate.id)}
                      >
                        <User className="h-4 w-4 mr-1 text-purple-500" />
                        详情
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-50"
                        onClick={() => handleViewDocuments(surrogate.id)}
                      >
                        <FileText className="h-4 w-4 mr-1 text-blue-500" />
                        文件
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-50"
                        onClick={() => handleViewMedical(surrogate.id)}
                      >
                        <ClipboardCheck className="h-4 w-4 mr-1 text-green-500" />
                        体检
                      </Button>
                      {surrogate.status === '可配对' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          onClick={() => handleMatchClient(surrogate.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          配对
                        </Button>
                      )}
                    </div>
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
