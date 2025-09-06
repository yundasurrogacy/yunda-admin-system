import { Calendar, FileText, MessageCircle, AlertCircle, Bell } from 'lucide-react'

interface NotificationIconProps {
  type: '预约' | '文件' | '消息' | '提醒' | '系统'
  className?: string
}

export function NotificationIcon({ type, className = 'h-5 w-5' }: NotificationIconProps) {
  const Icon = {
    '预约': Calendar,
    '文件': FileText,
    '消息': MessageCircle,
    '提醒': AlertCircle,
    '系统': Bell,
  }[type]

  return <Icon className={className} />
}

export function getNotificationColor(type: string) {
  switch (type) {
    case '预约':
      return 'bg-blue-100 text-blue-800'
    case '文件':
      return 'bg-green-100 text-green-800'
    case '消息':
      return 'bg-purple-100 text-purple-800'
    case '提醒':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
