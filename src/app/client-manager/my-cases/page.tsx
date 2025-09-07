'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface CaseCard {
  id: string
  clientName: string
  center: string
  legalStatus: {
    status: string
    progress: number
  }
  reviewStatus: string
  notice: string
  messages: {
    sender: string
    content: string
    time: string
    status: 'edited' | 'sent'
  }[]
}

export default function MyCasesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'matching' | 'legal' | 'cycle' | 'pregnant' | 'transferred'>('matching')
  const [isLoading, setIsLoading] = useState(true)
  const [cases, setCases] = useState<CaseCard[]>([])

  // 获取案例数据
  const fetchCases = async (status: string) => {
    try {
      setIsLoading(true)
      // TODO: 替换为实际的 API 调用
      const mockData: CaseCard[] = [
        {
          id: '1',
          clientName: 'John Doe',
          center: 'Lincon Surrogacy Center',
          legalStatus: {
            status: 'Legal',
            progress: 20
          },
          reviewStatus: 'Surrogacy agreement signed;preparing account',
          notice: 'Agreement upload needed',
          messages: [
            {
              sender: 'John',
              content: 'I have reviewed the draft. Please let me know if there are any changes needed.',
              time: '2 hours ago',
              status: 'edited'
            }
          ]
        },
        {
          id: '2',
          clientName: 'John Doe',
          center: 'Lincon Surrogacy Center',
          legalStatus: {
            status: 'Legal',
            progress: 20
          },
          reviewStatus: 'Surrogacy agreement signed;preparing account',
          notice: 'Agreement upload needed',
          messages: [
            {
              sender: 'John',
              content: 'I have reviewed the draft. Please let me know if there are any changes needed.',
              time: '2 hours ago',
              status: 'sent'
            }
          ]
        }
      ]
      setCases(mockData.filter(c => c.legalStatus.status.toLowerCase() === status.toLowerCase()))
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchCases('matching')
  }, [])

  const refreshCases = () => {
    const statusMap = {
      matching: 'matching',
      legal: 'legal',
      cycle: 'cycle',
      pregnant: 'pregnant',
      transferred: 'transferred'
    }
    fetchCases(statusMap[activeTab])
  }

  const handleViewDetails = (caseId: string) => {
    router.push(`/client-manager/my-cases/${caseId}`)
  }

  const handleViewDocuments = (caseId: string) => {
    router.push(`/client-manager/documents?caseId=${caseId}`)
  }

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab)
    const statusMap = {
      matching: 'matching',
      legal: 'legal',
      cycle: 'cycle',
      pregnant: 'pregnant',
      transferred: 'transferred'
    }
    fetchCases(statusMap[tab])
  }

  return (
    <ManagerLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-8">My Cases</h1>
        
        {/* Status Tabs */}
        <div className="flex gap-4 mb-8">
          <Button 
            variant={activeTab === 'matching' ? 'default' : 'secondary'}
            className={activeTab === 'matching' ? 'bg-[#FDF6E3]' : ''}
            onClick={() => handleTabChange('matching')}
          >
            Matching
          </Button>
          <Button 
            variant={activeTab === 'legal' ? 'default' : 'secondary'}
            onClick={() => handleTabChange('legal')}
          >
            Legal Stage
          </Button>
          <Button 
            variant={activeTab === 'cycle' ? 'default' : 'secondary'}
            onClick={() => handleTabChange('cycle')}
          >
            Cycle Prep
          </Button>
          <Button 
            variant={activeTab === 'pregnant' ? 'default' : 'secondary'}
            onClick={() => handleTabChange('pregnant')}
          >
            Pregnant
          </Button>
          <Button 
            variant={activeTab === 'transferred' ? 'default' : 'secondary'}
            onClick={() => handleTabChange('transferred')}
          >
            Transferred
          </Button>
        </div>

        {/* Case Cards */}
        <div className="grid grid-cols-2 gap-6">
          {isLoading ? (
            <div>Loading...</div>
          ) : cases.length === 0 ? (
            <div>No cases found</div>
          ) : (
            cases.map(caseItem => (
              <Card key={caseItem.id} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold mb-1">{caseItem.clientName}</h3>
                    <p className="text-sm text-gray-500">{caseItem.center}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#64748B]"
                    onClick={() => router.push(`/client-manager/my-cases/${caseItem.id}`)}
                  >
                    Matching
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">STATUS:</span>
                      <span className="text-sm text-gray-500">{caseItem.legalStatus.progress}%</span>
                    </div>
                    <Progress value={caseItem.legalStatus.progress} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">REVIEW:</p>
                    <p className="text-sm text-gray-500">{caseItem.reviewStatus}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">NOTICE:</p>
                    <p className="text-sm text-gray-500">{caseItem.notice}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">MESSAGES:</p>
                    {caseItem.messages.map((message, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-sm font-medium">{message.sender}</span>
                        <span className="text-sm text-gray-500">{message.status === 'edited' ? 'edited' : 'sent'}</span>
                        <span className="text-sm text-gray-500">{message.time}</span>
                      </div>
                    ))}
                    <p className="text-sm text-gray-500 mt-1">{caseItem.messages[0].content}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/client-manager/my-cases/${caseItem.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ManagerLayout>
  )
}
