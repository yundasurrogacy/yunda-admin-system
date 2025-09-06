'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import ManagerLayout from '@/components/manager-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Filter,
  RefreshCw,
  FileText,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'
import { ClientProfile } from '@/types/client-profile';

// 模拟数据
const mockClients: ClientProfile[] = [
  {
    id: 1,
    name: '张女士',
    email: 'zhang@example.com',
    phone: '13800138001',
    status: 'active',
    created_at: '2025-01-15',
    updated_at: '2025-09-05'
  },
  {
    id: 2,
    name: '刘女士',
    email: 'liu@example.com',
    phone: '13800138002',
    status: 'potential',
    created_at: '2025-02-20',
    updated_at: '2025-09-04'
  },
  {
    id: 3,
    name: '王女士',
    email: 'wang@example.com',
    phone: '13800138003',
    status: 'completed',
    created_at: '2024-12-10',
    updated_at: '2025-08-30'
  },
  {
    id: 4,
    name: '李女士',
    email: 'li@example.com',
    phone: '13800138004',
    status: 'active',
    created_at: '2025-03-15',
    updated_at: '2025-09-03'
  }
];

export default function ClientProfiles() {
  const router = useRouter()
  const [showFilters, setShowFilters] = React.useState(false)
  const [clients, setClients] = React.useState<ClientProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    search: '',
    status: '',
    startDate: ''
  });
  
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    
    const hasuraClient = getHasuraClient();
    
    // 构建查询条件
    const where: any = {};
    if (filters.search) {
      where._or = [
        { name: { _ilike: `%${filters.search}%` } },
        { email: { _ilike: `%${filters.search}%` } },
        { phone: { _ilike: `%${filters.search}%` } }
      ];
    }
    if (filters.status) {
      where.status = { _eq: filters.status };
    }
    if (filters.startDate) {
      where.created_at = { _gte: filters.startDate };
    }
    
    try {
      let result;
      try {
        result = await hasuraClient.datas<ClientProfile>({
          table: 'client_profiles',
          args: {
            where,
            order_by: { created_at: () => 'desc' }
          },
          datas_fields: [
            'id',
            'name',
            'email',
            'phone',
            'status',
            'created_at',
            'updated_at'
          ]
        });
        setClients(result);
      } catch (apiError) {
        console.warn('API 请求失败，使用本地测试数据:', apiError);
        // 使用模拟数据并应用过滤
        let filteredMockClients = [...mockClients];
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredMockClients = filteredMockClients.filter(c => 
            c.name.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.phone.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.status) {
          filteredMockClients = filteredMockClients.filter(c => 
            c.status === filters.status
          );
        }
        
        if (filters.startDate) {
          filteredMockClients = filteredMockClients.filter(c => 
            new Date(c.created_at) >= new Date(filters.startDate)
          );
        }
        
        setClients(filteredMockClients);
      }
    } catch (err) {
      console.error('获取客户列表失败:', err);
      setError('获取客户列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, [debouncedSearch, filters.status, filters.startDate]);

  const refreshClients = () => {
    fetchClients();
  };

  const handleViewDetails = (clientId: number) => {
    router.push(`/client-manager/client-profiles/${clientId}`)
  }

  const handleViewDocuments = (clientId: number) => {
    router.push(`/client-manager/documents?clientId=${clientId}`)
  }

  const handleViewCommunication = (clientId: number) => {
    router.push(`/client-manager/communication-logs?clientId=${clientId}`)
  }

  const handleScheduleMeeting = (clientId: number) => {
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
      <div className="space-y-6">
        {/* 页面标题和操作区 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Client Profiles</h1>
            <p className="text-muted-foreground">Manage and monitor your client information</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshClients}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* 搜索和筛选区域 */}
        <Card className={`transition-all duration-200 ${showFilters ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold">Filter Options</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Query</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    className="pl-9"
                    placeholder="Search clients..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => updateFilters({ status: value === 'all' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="potential">Potential</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date</label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => updateFilters({ startDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 客户列表 */}
        <div className="grid gap-4">
          {loading ? (
            Array(3).fill(null).map((_, i) => (
              <Card key={i}>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="animate-pulse h-16 w-16 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-200 rounded" />
                        <div className="h-3 w-1/3 bg-gray-200 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            clients.map((client) => (
              <Card key={client.id}>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    {/* 客户基本信息 */}
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {client.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 状态和操作按钮 */}
                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 md:justify-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${client.status === 'active' ? 'bg-green-100 text-green-800' :
                          client.status === 'potential' ? 'bg-blue-100 text-blue-800' :
                          client.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {client.status}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleViewDetails(client.id)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleViewDocuments(client.id)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Documents
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleViewCommunication(client.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Messages
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleScheduleMeeting(client.id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
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
