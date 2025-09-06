'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  FileText, 
  MessageSquare, 
  RefreshCw, 
  Briefcase,
  CheckSquare,
  Users,
  ChevronRight,
  PlusCircle,
  Search,
  UserPlus,
  FileCheck,
  Filter,
} from 'lucide-react'
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'
import { 
  DashboardStats, 
  Activity as DashboardActivity,
  CasesStatsResponse,
  TasksCountResponse,
  ActivityRecord,
  ClientCountResponse,
  SurrogateCountResponse
} from '@/types/dashboard'

export default function ManagerDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    activeCases: 0,
    pendingTasks: 0,
    clientCount: 0,
    surrogateCount: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = () => {
    fetchDashboardData()
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const hasuraClient = getHasuraClient()
      
      try {
        // 获取案例统计数据
        const casesStats = await hasuraClient.datas<CasesStatsResponse>({
          table: 'cases',
          args: {
            where: { manager_id: { _eq: 'current_manager_id' } }
          },
          datas_fields: [
            'aggregate { count { total: count(*), active: count(status=\'进行中\') } }'
          ]
        })

        // 获取待办任务数
        const tasksCount = await hasuraClient.datas<TasksCountResponse>({
          table: 'tasks',
          args: {
            where: { 
              manager_id: { _eq: 'current_manager_id' },
              status: { _eq: 'pending' }
            }
          },
          datas_fields: [
            'aggregate { count { count: count(*) } }'
          ]
        })
        
        // 获取客户数量
        const clientCount = await hasuraClient.datas<ClientCountResponse>({
          table: 'clients',
          args: {
            where: { manager_id: { _eq: 'current_manager_id' } }
          },
          datas_fields: [
            'aggregate { count { count: count(*) } }'
          ]
        })
        
        // 获取代孕妈妈数量
        const surrogateCount = await hasuraClient.datas<SurrogateCountResponse>({
          table: 'surrogates',
          args: {
            where: { status: { _in: ['可配对', '已配对'] } }
          },
          datas_fields: [
            'aggregate { count { count: count(*) } }'
          ]
        })

        // 获取最近活动
        const activitiesResponse = await hasuraClient.datas<ActivityRecord[]>({
          table: 'activities',
          args: {
            where: { manager_id: { _eq: 'current_manager_id' } },
            order_by: { created_at: () => 'desc' },
            limit: 10
          },
          datas_fields: [
            'data { id type description created_at related_id }'
          ]
        })

        const activities = (Array.isArray(activitiesResponse[0]) ? activitiesResponse[0] : []) as ActivityRecord[];
        
        setStats({
          totalCases: casesStats[0]?.total || 0,
          activeCases: casesStats[0]?.active || 0,
          pendingTasks: tasksCount[0]?.count || 0,
          clientCount: clientCount[0]?.count || 0,
          surrogateCount: surrogateCount[0]?.count || 0,
          recentActivities: activities.map(activity => ({
            id: activity.id,
            type: activity.type,
            description: activity.description,
            date: new Date(activity.created_at).toLocaleString('zh-CN')
          }))
        })
      } catch (apiError) {
        console.warn('API请求失败，使用模拟数据:', apiError)
        // 使用模拟数据
        const { mockDashboardData } = await import('@/mock/dashboard')
        setStats({
          totalCases: mockDashboardData.casesStats.total,
          activeCases: mockDashboardData.casesStats.active,
          pendingTasks: mockDashboardData.tasksCount.count,
          clientCount: mockDashboardData.clientCount?.count || 18,
          surrogateCount: mockDashboardData.surrogateCount?.count || 24,
          recentActivities: mockDashboardData.activities.map(activity => ({
            id: activity.id,
            type: activity.type,
            description: activity.description,
            date: new Date(activity.created_at).toLocaleString('zh-CN')
          }))
        })
      }
    } catch (err) {
      console.error('获取仪表盘数据失败:', err)
      setError('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleActivityClick = (type: string) => {
    switch (type) {
      case 'case':
        router.push('/client-manager/my-cases')
        break
      case 'task':
        router.push('/client-manager/daily-tasks')
        break
      case 'document':
        router.push('/client-manager/documents')
        break
      default:
        break
    }
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
      <div className="space-y-8">
        {/* 页面标题和操作区 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">仪表盘</h1>
            <p className="text-gray-500">欢迎回来，这里是您的管理概览</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={() => router.push('/client-manager/my-cases/new')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              创建新案例
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshData}
              disabled={loading}
              title="刷新数据"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* 统计卡片区域 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push('/client-manager/my-cases')}>
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">全部案例</h3>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.totalCases}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">点击查看全部</p>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push('/client-manager/my-cases?status=进行中')}>
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">进行中案例</h3>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.activeCases}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">需要持续跟进</p>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push('/client-manager/client-profiles')}>
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">客户档案</h3>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.clientCount || 18}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">客户信息管理</p>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push('/client-manager/surrogate-profiles')}>
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-pink-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">代孕妈妈档案</h3>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{loading ? '...' : stats.surrogateCount || 24}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">代孕资源管理</p>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 快速操作区域 */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* 创建新案例 */}
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <div className="p-6 flex flex-col items-center justify-center text-center" 
                 onClick={() => router.push('/client-manager/my-cases/new')}>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">创建新案例</h3>
              <p className="text-sm text-gray-500">添加新的客户案例，开始代孕流程</p>
            </div>
          </Card>
          
          {/* 按客户搜索 */}
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <div className="p-6 flex flex-col items-center justify-center text-center"
                 onClick={() => router.push('/client-manager/client-search')}>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">档案查询</h3>
              <p className="text-sm text-gray-500">按名称或内容搜索客户与代孕妈妈信息</p>
            </div>
          </Card>
          
          {/* 添加新档案 */}
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <div className="p-6 flex flex-col items-center justify-center text-center"
                 onClick={() => router.push('/client-manager/new-profile')}>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">添加新档案</h3>
              <p className="text-sm text-gray-500">创建客户资料与代孕妈妈资料</p>
            </div>
          </Card>
        </div>

        {/* 最近活动区域 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* 活动时间线 */}
          <Card className="col-span-full lg:col-span-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">最近活动</h2>
                <Button variant="ghost" size="sm" onClick={() => router.push('/client-manager/notifications')}>
                  查看全部
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-200 h-10 w-10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  stats.recentActivities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleActivityClick(activity.type)}
                    >
                      <div className={`rounded-full p-2 ${
                        activity.type === 'case' ? 'bg-blue-100' :
                        activity.type === 'task' ? 'bg-yellow-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'case' && <Briefcase className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'task' && <CheckSquare className="h-4 w-4 text-yellow-600" />}
                        {activity.type === 'document' && <FileText className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* 待办任务卡片 */}
          <Card className="col-span-full lg:col-span-3">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">待办任务</h2>
                <Button variant="ghost" size="sm" onClick={() => router.push('/client-manager/daily-tasks')}>
                  查看全部
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="rounded bg-gray-200 h-6 w-6" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))
                ) : (
                  stats.recentActivities
                    .filter(activity => activity.type === 'task')
                    .slice(0, 5)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => router.push('/client-manager/daily-tasks')}
                      >
                        <div className="h-2 w-2 rounded-full bg-yellow-400" />
                        <span className="flex-1 text-sm">{task.description}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))
                )}
              </div>
              {stats.recentActivities.filter(activity => activity.type === 'task').length === 0 && !loading && (
                <div className="text-center py-6 text-gray-500">
                  暂无待办任务
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  )
}
