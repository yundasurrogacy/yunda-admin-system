'use client'

import * as React from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { getHasuraClient } from "@/config-lib/hasura-graphql-client/hasura-graphql-client"
import ManagerLayout from "@/components/manager-layout"

interface ClientProfile {
  id: string
  name: string
  country: string
  email: string
  phone: string
  status: 'Matched' | 'In Progress'
  created_at: string
  updated_at: string
}

interface Filters {
  search: string;
  status: string;
  startDate: string;
}




export default function ClientProfilesPage() {
  const router = useRouter()
  const [clients, setClients] = React.useState<ClientProfile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    status: '',
    startDate: ''
  })
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  // 处理搜索
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
  };

  const debouncedSearch = useDebounce(filters.search, 500);

  // 获取所有case并批量获取准父母详情
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. 获取当前经理id（localStorage 或默认值）
      const managerId = typeof window !== 'undefined' ? localStorage.getItem('managerId') || '3' : '3';
      // 2. 获取所有case
      const caseRes = await fetch(`/api/cases-by-manager?managerId=${managerId}`);
      if (!caseRes.ok) throw new Error('获取案子失败');
      const caseData = await caseRes.json();
      const casesRaw = caseData.cases || caseData.data || caseData || [];
      // 3. 提取所有准父母id
      const parentIds = Array.isArray(casesRaw)
        ? casesRaw.map((item: any) => item.intended_parent?.id).filter(Boolean)
        : [];
      // 4. 批量获取准父母详情
      const parentDetails: ClientProfile[] = [];
      for (const parentId of parentIds) {
        const res = await fetch(`/api/intended-parent-detail?parentId=${parentId}`);
        if (res.ok) {
          const detail = await res.json();
          parentDetails.push({
            id: detail.id,
            name: detail.basic_information?.firstName + ' ' + detail.basic_information?.lastName || detail.name || '',
            country: detail.family_profile?.country || '',
            email: detail.contact_information?.email_address || detail.email || '',
            phone: detail.contact_information?.cell_phone || '',
            status: detail.status || 'Matched',
            created_at: detail.created_at || '',
            updated_at: detail.updated_at || '',
          });
        }
      }
      setClients(parentDetails);
    } catch (err) {
      console.error('获取客户列表失败:', err);
      setError('获取客户列表失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  // 导航函数
  const handleViewDetails = (clientId: string) => {
    router.push(`/client-manager/client-profiles/${clientId}`)
  }

  const handleViewDocuments = (clientId: string) => {
    router.push(`/client-manager/documents?clientId=${clientId}`)
  }

  const handleViewCommunication = (clientId: string) => {
    router.push(`/client-manager/communication-logs?clientId=${clientId}`)
  }

  const handleScheduleMeeting = (clientId: string) => {
    router.push(`/client-manager/schedule?clientId=${clientId}`)
  }

  if (error) {
    return (
      <ManagerLayout>
        <div className="text-red-500">加载失败: {error}</div>
      </ManagerLayout>
    )
  }

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold font-serif text-[#271F18]">Client Profile</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] h-4 w-4" />
            <Input
              type="text"
              placeholder="Search"
              value={filters.search}
              onChange={handleSearch}
              className="pl-9 bg-[#F8F9FC] w-full font-serif text-[#271F18] rounded-full"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="font-serif text-[#271F18]">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {clients.map(client => (
              <Card 
                key={client.id} 
                className="relative p-6 rounded-xl bg-white hover:shadow-lg transition-shadow font-serif text-[#271F18]"
                onMouseEnter={() => setHoveredId(client.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold font-serif text-[#271F18]">{client.name}</h3>
                    <p className="text-sm font-serif text-[#271F18] opacity-60">{client.country}</p>
                  </div>
                  <Button 
                    variant={hoveredId === client.id ? "outline" : "ghost"}
                    size="sm"
                    className={
                      hoveredId === client.id
                        ? "rounded bg-white border border-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-sm shadow-none"
                        : "rounded bg-[#E3E8E3] text-[#271F18] font-serif px-4 py-1 text-sm shadow-none border border-[#D9D9D9]"
                    }
                    onClick={() => handleViewDetails(client.id)}
                  >
                    View
                  </Button>
                </div>
                <p className="text-sm font-serif text-[#271F18] opacity-60">{client.status === 'Matched' ? 'Client' : client.status}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ManagerLayout>
  )
}
