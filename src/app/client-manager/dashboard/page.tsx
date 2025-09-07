'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface WeeklyUpdate {
  name: string
  type: 'Client' | 'Surrogate'
  dueDate: string
  notes: string
}

interface LatestUpdate {
  id: number
  name: string
  date: string
}

interface Case {
  id: string
  clientName: string
  surrogateId?: string
  surrogateName?: string
  status: 'ongoing' | 'completed' | 'pending'
  lastUpdate: string
  ivfStatus?: string
  medicalReport?: string
  contractStatus?: string
  nextAppointment?: string
}

export default function DashboardPage() {
  const router = useRouter()
  
  // 状态管理
  const [cases, setCases] = useState<Case[]>([])
  const [filterStatus, setFilterStatus] = useState<Case['status'] | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 刷新数据
  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchCases()
    setIsRefreshing(false)
  }

  // 处理案例点击
  const handleCaseClick = (caseId: string) => {
    setSelectedCase(caseId)
    router.push(`/client-manager/my-cases/${caseId}`)
  }

  // 处理文档上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // TODO: 实现文件上传 API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      refreshData()
    } catch (error) {
      console.error('Failed to upload file:', error)
      // TODO: 显示错误提示
    }
  }

  // 处理报告导出
  const handleExport = async () => {
    try {
      setIsLoading(true)
      // TODO: 实现导出 API
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: filterStatus,
          date: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cases-report-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export report:', error)
      // TODO: 显示错误提示
    } finally {
      setIsLoading(false)
    }
  }

  // 获取案例数据
  const fetchCases = async () => {
    try {
      setIsLoading(true)
      // TODO: 替换为实际的 API 调用
      const mockData: Case[] = [
        {
          id: '1',
          clientName: 'John Doe',
          status: 'ongoing',
          lastUpdate: '2025-09-07',
          ivfStatus: 'In Progress',
          medicalReport: 'Updated',
          contractStatus: 'Signed',
          nextAppointment: '2025-09-10'
        },
        {
          id: '2',
          clientName: 'Jane Smith',
          surrogateId: 'S001',
          surrogateName: 'Mary Johnson',
          status: 'pending',
          lastUpdate: '2025-09-06',
          ivfStatus: 'Scheduled',
          medicalReport: 'Pending',
          contractStatus: 'In Review'
        },
        // 添加更多模拟数据...
      ]
      
      setCases(mockData)
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 获取案例数据
  // const fetchCases = async () => {
  //   try {
  //     setIsLoading(true)
  //     // TODO: 替换为实际的 API 调用
  //     const response = await fetch('/api/cases')
  //     const data = await response.json()
  //     setCases(data)
  //   } catch (error) {
  //     console.error('Failed to fetch cases:', error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // 初始加载数据
  useEffect(() => {
    fetchCases()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const [weeklyUpdates] = useState<WeeklyUpdate[]>([
    { name: 'John Doe', type: 'Client', dueDate: 'May 12', notes: 'None' },
    { name: 'Mary Hill', type: 'Surrogate', dueDate: 'May 13', notes: 'Further assistant needed' },
    { name: 'Siren Far', type: 'Client', dueDate: 'May 14', notes: 'None' }
  ])

  const [latestUpdates] = useState<LatestUpdate[]>(
    Array(5).fill(null).map((_, i) => ({
      id: i + 1,
      name: 'John Doe',
      date: `May ${12 + i}`
    }))
  )

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen" style={{ background: "#FBF0DA40" }}>
        <h1 className="text-2xl font-semibold mb-8 font-serif text-[#271F18]">DASHBOARD</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow rounded-xl bg-white font-serif text-[#271F18]"
            onClick={() => router.push('/client-manager/my-cases')}
          >
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Today's Task</h2>
            <div className="text-4xl font-bold font-serif text-[#271F18]">
              {isLoading ? '...' : cases.filter(c => c.nextAppointment === new Date().toISOString().split('T')[0]).length}
            </div>
          </Card>
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow rounded-xl bg-white font-serif text-[#271F18]"
            onClick={() => router.push('/client-manager/documents?status=pending')}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-medium font-serif text-[#271F18]">Pending Documents</h2>
              <span className="text-sm font-serif text-[#271F18] opacity-60">1 Due in 2 Days</span>
            </div>
            <div className="text-4xl font-bold font-serif text-[#271F18]">3</div>
            <div className="mt-2 text-sm font-serif text-[#271F18] opacity-60">Action Needed</div>
          </Card>
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow rounded-xl bg-white font-serif text-[#271F18]"
            onClick={() => router.push('/client-manager/documents?type=contract')}
          >
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Contract Status</h2>
            <div className="text-4xl font-bold font-serif text-[#271F18]">
              {isLoading ? '...' : cases.filter(c => c.contractStatus === 'pending').length}
            </div>
            <div className="mt-2 text-sm font-serif text-[#271F18] opacity-60">Pending Review</div>
          </Card>
        </div>
        {/* Updates Needed Table */}
        <Card className="mb-8 rounded-xl bg-white font-serif text-[#271F18]">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Updates Needed (Weekly)</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2 font-serif text-[#271F18]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Name</th>
                    <th className="text-left py-2 px-4 font-semibold">Type</th>
                    <th className="text-left py-2 px-4 font-semibold">Due Date</th>
                    <th className="text-left py-2 px-4 font-semibold">Notes</th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyUpdates.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-none">
                      <td className="py-2 px-4">{row.name}</td>
                      <td className="py-2 px-4">{row.type}</td>
                      <td className="py-2 px-4">{row.dueDate}</td>
                      <td className="py-2 px-4">{row.notes}</td>
                      <td className="py-2 px-4">
                        <Button className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-4 py-1 text-sm shadow-none"
                          onClick={() => router.push(`/client-manager/my-cases?name=${row.name}`)}
                        >View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        {/* Latest Updates */}
        <Card className="rounded-xl bg-white font-serif text-[#271F18]">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-6 font-serif text-[#271F18]">Latest Update</h2>
            <div className="relative">
              <div className="flex space-x-4 overflow-hidden">
                {latestUpdates.map((update) => (
                  <div key={update.id} className="flex-none w-48">
                    <div className="bg-[#F8F9FC] rounded-lg p-4 text-center font-serif text-[#271F18]">
                      <Avatar className="w-12 h-12 mx-auto mb-3">
                        <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">
                          {update.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium font-serif text-[#271F18]">{update.name}</p>
                      <p className="text-sm font-serif text-[#271F18] opacity-60 mb-3">{update.date}</p>
                      <Button 
                        className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-4 py-1 text-sm shadow-none"
                        onClick={() => router.push(`/client-manager/my-cases?name=${update.name}`)}
                      >View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/client-profiles/new')}
          >
            Add New Client
          </Button>
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/documents/upload')}
          >
            Upload File
          </Button>
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => {
              // TODO: 实现导出报告功能
              alert('Export functionality will be implemented soon')
            }}
          >
            Export Report
          </Button>
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/notifications')}
          >
            Notifications
          </Button>
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/client-portal')}
          >
            Client Portal
          </Button>
          <Button 
            className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-6 py-2 text-sm shadow-none"
            onClick={() => router.push('/client-manager/surrogate-portal')}
          >
            Surrogate Portal
          </Button>
        </div>
      </div>
    </ManagerLayout>
  )
}
