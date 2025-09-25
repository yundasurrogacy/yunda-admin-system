'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CaseDetail } from '@/types/case-detail'
import { caseService } from '@/services/case-service'

export default function CaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const caseId = params?.id as string
  const isValidCaseId = caseId && !isNaN(Number(caseId));

  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline'>('overview')

  // 获取案例详情
  const fetchCaseDetail = async () => {
    try {
      setIsLoading(true)
      const data = await caseService.getCaseDetail(caseId)
      setCaseDetail(data)
    } catch (error) {
      console.error('Failed to fetch case detail:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isValidCaseId) {
      fetchCaseDetail()
    }
  }, [caseId])

  if (isLoading || !caseDetail) {
    if (!isValidCaseId) {
      return (
        <ManagerLayout>
          <div className="p-8 text-red-500">参数 id 缺失或非法</div>
        </ManagerLayout>
      );
    }
    return (
      <ManagerLayout>
        <div className="p-8">Loading...</div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-[#E2E8F0]">
                  {(() => {
                    const name = caseDetail.clientName || caseDetail.id || '未知';
                    if (typeof name === 'string') {
                      return name.split(' ').map(n => n[0]).join('');
                    }
                    return '未知';
                  })()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold">
                  {caseDetail.clientName || caseDetail.id || '未知'}
                </h1>
                <p className="text-gray-500">Case ID: {caseDetail.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary"
                size="sm"
                className={activeTab === 'overview' ? 'bg-[#F8F9FC]' : ''}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                className={activeTab === 'documents' ? 'bg-[#F8F9FC]' : ''}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                className={activeTab === 'timeline' ? 'bg-[#F8F9FC]' : ''}
                onClick={() => setActiveTab('timeline')}
              >
                Timeline
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push(`/client-manager/my-cases/${caseId}/edit`)}
            >
              Edit Case
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(`/client-manager/my-cases/${caseId}/upload`)}
            >
              Upload Document
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid gap-6">
            {/* Basic Info */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium">{caseDetail.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Update</p>
                    <p className="font-medium">{caseDetail.lastUpdate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">IVF Status</p>
                    <p className="font-medium">{caseDetail.ivfStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contract Status</p>
                    <p className="font-medium">{caseDetail.contractStatus}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Documents */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Recent Documents</h2>
                <div className="space-y-4">
                  {(Array.isArray(caseDetail.documents) ? caseDetail.documents.slice(0, 3) : []).map(doc => (
                    <div key={doc.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">Uploaded on {doc.uploadDate}</p>
                      </div>
                      <Button variant="secondary" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Timeline */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Recent Timeline</h2>
                <div className="space-y-4">
                  {(Array.isArray(caseDetail.timeline) ? caseDetail.timeline.slice(0, 3) : []).map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-32 shrink-0 text-sm text-gray-500">{event.date}</div>
                      <div>
                        <p className="font-medium">{event.event}</p>
                        <p className="text-sm text-gray-500">{event.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium mb-6">All Documents</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-4">Document Name</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Upload Date</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {caseDetail.documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="py-4">{doc.name}</td>
                      <td className="py-4">{doc.type}</td>
                      <td className="py-4">{doc.uploadDate}</td>
                      <td className="py-4">
                        <span className={`
                          px-2 py-1 rounded text-xs
                          ${doc.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                          ${doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${doc.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="secondary" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'timeline' && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium mb-6">Complete Timeline</h2>
              <div className="space-y-6">
                {caseDetail.timeline.map((event, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="w-32 shrink-0">
                      <p className="font-medium">{event.date}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          w-2 h-2 rounded-full
                          ${event.type === 'ivf' ? 'bg-blue-500' : ''}
                          ${event.type === 'medical' ? 'bg-green-500' : ''}
                          ${event.type === 'contract' ? 'bg-purple-500' : ''}
                          ${event.type === 'general' ? 'bg-gray-500' : ''}
                        `} />
                        <p className="font-medium">{event.event}</p>
                      </div>
                      <p className="text-gray-500">{event.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </ManagerLayout>
  )
}
