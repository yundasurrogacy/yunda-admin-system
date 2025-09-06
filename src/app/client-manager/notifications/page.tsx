'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import { NotificationIcon, getNotificationColor } from '@/components/notification-icon'
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'
import { Notification, NotificationFilters } from '@/types/notifications'
import { mockNotifications, filterNotifications, getUnreadCount } from '@/mock/notifications'

export default function Notifications() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<NotificationFilters>({
    search: '',
    type: undefined,
    isRead: undefined
  })
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [filters])

  const updateFilters = (newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const fetchNotifications = async () => {
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
          { title: { _ilike: `%${filters.search}%` } },
          { description: { _ilike: `%${filters.search}%` } }
        ]
      }
      
      if (filters.type) {
        where.type = { _eq: filters.type }
      }
      
      if (filters.isRead !== undefined) {
        where.is_read = { _eq: filters.isRead }
      }

      const result = await hasuraClient.datas<Notification>({
        table: 'user_notifications',
        args: {
          where,
          order_by: { created_at: () => 'desc' }
        },
        datas_fields: [
          'id',
          'type',
          'title',
          'description',
          'is_read',
          'created_at',
          'action_path',
          'related_type',
          'related_id',
          'related_name'
        ]
      })

      setNotifications(Array.isArray(result) ? result : [])
    } catch (err) {
      console.error('获取通知列表失败:', err)
      setError('获取通知列表失败，已切换到离线数据')
      // 使用模拟数据
      const filteredMockData = filterNotifications({
        search: filters.search,
        type: filters.type,
        isRead: filters.isRead
      })
      setNotifications(filteredMockData)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const hasuraClient = getHasuraClient()
      // 尝试直接访问数据
      const result = await hasuraClient.datas({
        table: 'user_notifications_aggregate',
        args: {
          where: {
            manager_id: { _eq: 'current_manager_id' },
            is_read: { _eq: false }
          }
        },
        datas_fields: ['count:count(*)']
      })

      // 以安全的方式处理返回数据
      let count = 0;
      if (Array.isArray(result) && result.length > 0) {
        const firstItem = result[0];
        // 使用类型断言和可选链来安全访问属性
        count = (firstItem as any)?.count || 0;
      }
      
      setUnreadCount(count);
    } catch (err) {
      console.error('获取未读数量失败:', err);
      // 使用模拟数据的未读计数
      setUnreadCount(getUnreadCount());
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const hasuraClient = getHasuraClient()
      await hasuraClient.update_datas({
        table: 'user_notifications',
        args: {
          where: { id: { _eq: notificationId } },
          _set: { is_read: true }
        }
      })
      
      await Promise.all([
        fetchNotifications(),
        fetchUnreadCount()
      ])
    } catch (err) {
      console.error('标记通知已读失败:', err)
      // 在客户端更新模拟数据的状态
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllAsRead = async () => {
    try {
      const hasuraClient = getHasuraClient()
      await hasuraClient.update_datas({
        table: 'user_notifications',
        args: {
          where: {
            manager_id: { _eq: 'current_manager_id' },
            is_read: { _eq: false }
          },
          _set: { is_read: true }
        }
      })
      
      await Promise.all([
        fetchNotifications(),
        fetchUnreadCount()
      ])
    } catch (err) {
      console.error('标记所有通知已读失败:', err)
      // 在客户端更新所有通知为已读
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      )
      setUnreadCount(0)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const hasuraClient = getHasuraClient()
      await hasuraClient.delete_datas({
        table: 'user_notifications',
        args: {
          where: { id: { _eq: notificationId } }
        }
      })
      
      await Promise.all([
        fetchNotifications(),
        fetchUnreadCount()
      ])
    } catch (err) {
      console.error('删除通知失败:', err)
      // 在客户端从列表中移除该通知
      const notificationToDelete = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      // 如果删除的是未读通知，更新未读计数
      if (notificationToDelete && !notificationToDelete.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  }

  const handleAction = (notification: Notification) => {
    if (notification.action_path) {
      markAsRead(notification.id)
      router.push(notification.action_path)
    }
  }

  const handleDelete = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    await deleteNotification(notificationId)
  }

  const handleMarkAsRead = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    await markAsRead(notificationId)
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">通知</h1>
          </div>
          <Card className="p-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-amber-500 font-medium">{error}</div>
              <div className="text-gray-500 text-sm">正在使用离线数据显示通知内容</div>
              <Button onClick={fetchNotifications} variant="outline">
                重试连接
              </Button>
            </div>
          </Card>
          {/* 即使有错误也显示通知列表 */}
          <div className="grid gap-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleAction(notification)}
              >
                <div className="flex gap-4">
                  <div className={`rounded-full p-2 ${getNotificationColor(notification.type)}`}>
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-gray-500">
                          {notification.description}
                        </p>
                        {(notification.related_type || notification.related_id) && (
                          <p className="text-xs text-gray-400">
                            相关：{notification.related_name || notification.related_id}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString('zh-CN')}
                        </span>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        {notification.action_path && (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ManagerLayout>
    )
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">通知</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {unreadCount} 条未读
            </Badge>
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
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                全部标记为已读
              </Button>
            </div>
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
                    placeholder="搜索通知..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">类型</label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) => {
                    // 确保类型正确，只有当value是有效的NotificationType时才设置
                    const validTypes = ['预约', '文件', '消息', '提醒', '系统'];
                    const typeValue = validTypes.includes(value) ? 
                      value as Notification['type'] : 
                      undefined;
                    updateFilters({ type: typeValue });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="预约">预约</SelectItem>
                    <SelectItem value="文件">文件</SelectItem>
                    <SelectItem value="消息">消息</SelectItem>
                    <SelectItem value="提醒">提醒</SelectItem>
                    <SelectItem value="系统">系统</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">状态</label>
                <Select
                  value={filters.isRead === undefined ? 'all' : filters.isRead ? 'read' : 'unread'}
                  onValueChange={(value) => updateFilters({
                    isRead: value === 'all' ? undefined : value === 'read'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="unread">未读</SelectItem>
                    <SelectItem value="read">已读</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {loading ? (
            // 加载状态
            [...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse flex gap-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleAction(notification)}
              >
                <div className="flex gap-4">
                  <div className={`rounded-full p-2 ${getNotificationColor(notification.type)}`}>
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-gray-500">
                          {notification.description}
                        </p>
                        {(notification.related_type || notification.related_id) && (
                          <p className="text-xs text-gray-400">
                            相关：{notification.related_name || notification.related_id}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString('zh-CN')}
                        </span>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                        {notification.action_path && (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
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
