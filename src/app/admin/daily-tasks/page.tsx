"use client"

import { useState } from "react"
import { Calendar, Clock, FileText } from "lucide-react"
import { Task } from '@/types'
import { AdminLayout } from "../../../components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"

export default function DailyTasksPage() {
  const [language, setLanguage] = useState<"en" | "cn">("en")

  const text = {
    en: {
      title: "Daily Tasks",
      addTask: "Add Task",
      today: "Today",
      upcoming: "Upcoming",
      completed: "Completed",
      priority: "Priority",
      dueTime: "Due Time",
      assignedTo: "Assigned To",
      status: "Status",
      high: "High",
      medium: "Medium",
      low: "Low",
      inProgress: "In Progress",
      pending: "Pending",
      done: "Done",
      viewAll: "View All",
      todayTasks: "Today's Tasks",
      upcomingTasks: "Upcoming Tasks",
      completedTasks: "Completed Tasks",
    },
    cn: {
      title: "日常任务",
      addTask: "添加任务",
      today: "今日",
      upcoming: "即将到来",
      completed: "已完成",
      priority: "优先级",
      dueTime: "截止时间",
      assignedTo: "分配给",
      status: "状态",
      high: "高",
      medium: "中",
      low: "低",
      inProgress: "进行中",
      pending: "待处理",
      done: "已完成",
      viewAll: "查看全部",
      todayTasks: "今日任务",
      upcomingTasks: "即将到来的任务",
      completedTasks: "已完成的任务",
    }
  }

  const tasks: Record<'today' | 'upcoming' | 'completed', Task[]> = {
    today: [
      {
        title: "Review Client Application",
        priority: "high",
        dueTime: "10:00 AM",
        assignedTo: "Sarah Johnson",
        status: "inProgress"
      } as Task,
      {
        title: "Medical Document Verification",
        priority: "medium",
        dueTime: "2:00 PM",
        assignedTo: "Dr. Michael Chen",
        status: "pending"
      } as Task
    ],
    upcoming: [
      {
        title: "Client Interview",
        priority: "high",
        dueTime: "Tomorrow, 11:00 AM",
        assignedTo: "Emily Davis",
        status: "scheduled"
      } as Task,
      {
        title: "Contract Review",
        priority: "medium",
        dueTime: "Sep 6, 3:00 PM",
        assignedTo: "Legal Team",
        status: "scheduled"
      } as Task
    ],
    completed: [
      {
        title: "Background Check",
        priority: "high",
        completedTime: "Today, 9:00 AM",
        assignedTo: "Security Team",
        status: "done"
      } as Task,
      {
        title: "Initial Consultation",
        priority: "medium",
        completedTime: "Yesterday, 4:00 PM",
        assignedTo: "Sarah Johnson",
        status: "done"
      } as Task
    ]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-sage-100 text-sage-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "inProgress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "done":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-sage-100 text-sage-800"
    }
  }

const TaskCard = ({ task, type }: { task: Task, type: 'today' | 'upcoming' | 'completed' }) => (
    <div className="bg-white rounded-lg border border-sage-200 p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <h3 className="text-sage-800 font-medium">{task.title}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                {text[language][task.priority as keyof typeof text.en]}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                {text[language][task.status as keyof typeof text.en]}
              </span>
            </div>
            <div className="mt-4 text-sm text-sage-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{type === 'completed' ? task.completedTime : task.dueTime}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                <span>{task.assignedTo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader 
          title={text[language].title}
          rightContent={
            <Button
              onClick={() => {}}
              className="bg-sage-200 text-sage-800 hover:bg-sage-250"
            >
              {text[language].addTask}
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-sage-800">
                {text[language].todayTasks}
              </h2>
              <Button variant="link" className="text-sage-600 hover:text-sage-800">
                {text[language].viewAll}
              </Button>
            </div>
            {tasks.today.map((task, index) => (
              <TaskCard key={index} task={task} type="today" />
            ))}
          </div>

          {/* Upcoming Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-sage-800">
                {text[language].upcomingTasks}
              </h2>
              <Button variant="link" className="text-sage-600 hover:text-sage-800">
                {text[language].viewAll}
              </Button>
            </div>
            {tasks.upcoming.map((task, index) => (
              <TaskCard key={index} task={task} type="upcoming" />
            ))}
          </div>

          {/* Completed Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-sage-800">
                {text[language].completedTasks}
              </h2>
              <Button variant="link" className="text-sage-600 hover:text-sage-800">
                {text[language].viewAll}
              </Button>
            </div>
            {tasks.completed.map((task, index) => (
              <TaskCard key={index} task={task} type="completed" />
            ))}
          </div>
        </div>
      </PageContent>
    </AdminLayout>
  )
}
