"use client"

import { useState } from "react"
import { Bell, MessageSquare, FileText, AlertCircle, Calendar } from "lucide-react"
import { Notification } from '@/types'
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NotificationsPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  const text = {
    en: {
      title: "Notifications",
      all: "All Notifications",
      unread: "Unread",
      read: "Read",
      markAllRead: "Mark all as read",
      today: "Today",
      yesterday: "Yesterday",
      thisWeek: "This Week",
      earlier: "Earlier",
      messages: "Messages",
      documents: "Documents",
      alerts: "Alerts",
      appointments: "Appointments",
      filterBy: "Filter by",
      type: "Type",
      date: "Date",
      priority: "Priority",
    },
    cn: {
      title: "通知",
      all: "所有通知",
      unread: "未读",
      read: "已读",
      markAllRead: "标记所有为已读",
      today: "今天",
      yesterday: "昨天",
      thisWeek: "本周",
      earlier: "更早",
      messages: "消息",
      documents: "文档",
      alerts: "提醒",
      appointments: "预约",
      filterBy: "筛选",
      type: "类型",
      date: "日期",
      priority: "优先级",
    }
  }

  const notifications: Record<'today' | 'yesterday' | 'thisWeek', Notification[]> = {
    today: [
      {
        id: 1,
        type: "message",
        title: "New message from Sarah Johnson",
        description: "Regarding the medical examination schedule",
        time: "2 hours ago",
        unread: true,
        priority: "high"
      } as Notification,
      {
        id: 2,
        type: "document",
        title: "New document uploaded",
        description: "Medical records for Case #1234",
        time: "4 hours ago",
        unread: true,
        priority: "medium"
      } as Notification
    ],
    yesterday: [
      {
        id: 3,
        type: "alert",
        title: "Case status updated",
        description: "Case #5678 has moved to medical phase",
        time: "1 day ago",
        unread: false,
        priority: "high"
      } as Notification
    ],
    thisWeek: [
      {
        id: 4,
        type: "appointment",
        title: "Appointment scheduled",
        description: "Client meeting on Friday, 10:00 AM",
        time: "2 days ago",
        unread: false,
        priority: "medium"
      } as Notification,
      {
        id: 5,
        type: "document",
        title: "Document requires review",
        description: "Legal agreement for Case #9012",
        time: "3 days ago",
        unread: false,
        priority: "high"
      } as Notification
    ]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-500" />
      case "document":
        return <FileText className="w-5 h-5 text-green-500" />
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "appointment":
        return <Calendar className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-sage-500" />
    }
  }

  const NotificationGroup = ({ title, items }: { title: string, items: Notification[] }) => (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-sage-600 mb-4">
        {text[language][title as keyof typeof text.en]}
      </h3>
      <div className="space-y-4">
        {items.map((notification) => (
          <div 
            key={notification.id}
            className={`bg-white rounded-lg border ${
              notification.unread ? 'border-sage-300' : 'border-sage-200'
            } p-4 hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                notification.unread ? 'bg-sage-100' : 'bg-sage-50'
              }`}>
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`text-sm font-medium ${
                      notification.unread ? 'text-sage-900' : 'text-sage-700'
                    }`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-sage-600 mt-1">
                      {notification.description}
                    </p>
                  </div>
                  {notification.unread && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-sage-500">
                    {notification.time}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    notification.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {notification.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={text[language].title}
          rightContent={
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    {text[language].filterBy}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    {text[language].type}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].date}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {text[language].priority}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => {}}
                variant="ghost"
                className="text-sage-600 hover:text-sage-800"
              >
                {text[language].markAllRead}
              </Button>
            </div>
          }
        />

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="bg-white"
          >
            {text[language].all}
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className="bg-white"
          >
            {text[language].unread}
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            onClick={() => setFilter("read")}
            className="bg-white"
          >
            {text[language].read}
          </Button>
        </div>

        {/* Notifications List */}
        <NotificationGroup title="today" items={notifications.today} />
        <NotificationGroup title="yesterday" items={notifications.yesterday} />
        <NotificationGroup title="thisWeek" items={notifications.thisWeek} />
      </PageContent>
    </AdminLayout>
  )
}
