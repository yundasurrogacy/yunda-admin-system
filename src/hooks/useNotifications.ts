import { useState, useEffect } from 'react'
import type { Notification, NotificationFilters } from '@/types/notification'

export function useNotifications(initialFilters: NotificationFilters = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<NotificationFilters>(initialFilters)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        // TODO: 替换为实际的API调用
        const mockNotifications: Notification[] = [
          {
            id: 1,
            type: '预约',
            title: '新的客户面谈',
            description: '张先生预约了明天下午2点的面谈',
            time: '10分钟前',
            isRead: false,
            priority: 'high',
            relatedTo: {
              type: 'client',
              id: 1,
              name: '张先生'
            },
            action: {
              type: 'view',
              path: '/client-manager/schedule'
            }
          },
          {
            id: 2,
            type: '文件',
            title: '新文件上传',
            description: '李女士上传了新的医疗记录',
            time: '1小时前',
            isRead: true,
            priority: 'normal',
            relatedTo: {
              type: 'document',
              id: 'doc123',
              name: '医疗记录.pdf'
            },
            action: {
              type: 'view',
              path: '/client-manager/documents'
            }
          },
          {
            id: 3,
            type: '提醒',
            title: '体检提醒',
            description: '代孕者SUR001的体检日期即将到期',
            time: '2小时前',
            isRead: false,
            priority: 'high',
            relatedTo: {
              type: 'surrogate',
              id: 'SUR001'
            },
            action: {
              type: 'schedule',
              path: '/client-manager/medical-records'
            }
          }
        ]

        // 应用筛选器
        let filteredNotifications = mockNotifications
        if (filters.type) {
          filteredNotifications = filteredNotifications.filter(n => n.type === filters.type)
        }
        if (filters.isRead !== undefined) {
          filteredNotifications = filteredNotifications.filter(n => n.isRead === filters.isRead)
        }
        if (filters.priority) {
          filteredNotifications = filteredNotifications.filter(n => n.priority === filters.priority)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredNotifications = filteredNotifications.filter(n => 
            n.title.toLowerCase().includes(searchLower) || 
            n.description.toLowerCase().includes(searchLower)
          )
        }

        setNotifications(filteredNotifications)
        setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [filters])

  const updateFilters = (newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const markAsRead = async (notificationId: number) => {
    try {
      // TODO: 替换为实际的API调用
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      )
      setUnreadCount(prev => prev - 1)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
      return false
    }
  }

  const markAllAsRead = async () => {
    try {
      // TODO: 替换为实际的API调用
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
      return false
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      // TODO: 替换为实际的API调用
      setNotifications(prev =>
        prev.filter(n => n.id !== notificationId)
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
      return false
    }
  }

  return {
    notifications,
    loading,
    error,
    filters,
    unreadCount,
    updateFilters,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
