export interface Notification {
  id: number
  type: '预约' | '文件' | '消息' | '提醒' | '系统'
  title: string
  description: string
  time: string
  isRead: boolean
  priority: 'high' | 'normal' | 'low'
  relatedTo?: {
    type: 'client' | 'surrogate' | 'case' | 'document'
    id: string | number
    name?: string
  }
  action?: {
    type: 'view' | 'approve' | 'reject' | 'schedule'
    path?: string
  }
}

export interface NotificationFilters {
  type?: string
  isRead?: boolean
  priority?: string
  search?: string
  startDate?: string
  endDate?: string
}
