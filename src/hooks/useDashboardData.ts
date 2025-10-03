import { useState, useEffect } from 'react'

export interface DashboardStats {
  totalCases: number
  activeCases: number
  pendingTasks: number
  recentActivities: Array<{
    id: number
    type: 'case' | 'task' | 'document' | 'message'
    description: string
    date: string
  }>
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    activeCases: 0,
    pendingTasks: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: 替换为实际的API调用
        const mockData: DashboardStats = {
          totalCases: 24,
          activeCases: 12,
          pendingTasks: 5,
          recentActivities: [
            {
              id: 1,
              type: 'case',
              description: '新案例 #123 已创建',
              date: '2025-09-06'
            },
            {
              id: 2,
              type: 'task',
              description: '待办任务：客户面谈',
              date: '2025-09-06'
            },
            {
              id: 3,
              type: 'document',
              description: '新文件上传：医疗记录',
              date: '2025-09-05'
            }
          ]
        }
        setStats(mockData)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const refreshData = () => {
    setLoading(true)
    // TODO: 实现刷新逻辑
  }

  return { stats, loading, error, refreshData }
}
