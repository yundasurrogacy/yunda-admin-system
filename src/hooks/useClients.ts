import { useState, useEffect } from 'react'
import type { Client, ClientFilters } from '@/types/client'

export function useClients(initialFilters: ClientFilters = {}) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ClientFilters>(initialFilters)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        // TODO: 替换为实际的API调用
        const mockClients: Client[] = [
          {
            id: 1,
            name: '张先生',
            phone: '137****1234',
            email: 'zhang****@email.com',
            status: '活跃',
            joinDate: '2025-01-15',
            basicInfo: {
              age: 35,
              gender: '男',
              occupation: '企业家',
              maritalStatus: '已婚',
              address: '上海市浦东新区',
            },
            medicalHistory: [
              {
                id: 1,
                date: '2025-01-20',
                type: '初步检查',
                description: '基础体检完成',
              },
            ],
            documents: [
              {
                id: 1,
                name: '身份证明.pdf',
                type: 'application/pdf',
                uploadDate: '2025-01-15',
                category: '身份证明',
              },
            ],
            communicationLogs: [
              {
                id: 1,
                date: '2025-01-15',
                type: '面谈',
                summary: '初次咨询，了解基本需求',
                nextFollowUp: '2025-01-22',
              },
            ],
          },
          // 更多模拟数据...
        ]

        // 应用筛选器
        let filteredClients = mockClients
        if (filters.status) {
          filteredClients = filteredClients.filter(c => c.status === filters.status)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredClients = filteredClients.filter(c => 
            c.name.toLowerCase().includes(searchLower) || 
            c.phone.includes(filters.search!) ||
            c.email.toLowerCase().includes(searchLower)
          )
        }
        if (filters.startDate) {
          filteredClients = filteredClients.filter(c => 
            new Date(c.joinDate) >= new Date(filters.startDate!)
          )
        }
        if (filters.endDate) {
          filteredClients = filteredClients.filter(c => 
            new Date(c.joinDate) <= new Date(filters.endDate!)
          )
        }

        setClients(filteredClients)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchClients()
  }, [filters])

  const updateFilters = (newFilters: Partial<ClientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const refreshClients = () => {
    setLoading(true)
    // TODO: 实现刷新逻辑
  }

  return {
    clients,
    loading,
    error,
    filters,
    updateFilters,
    refreshClients,
  }
}

export function useClient(clientId: number) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true)
        // TODO: 替换为实际的API调用
        const mockClient: Client = {
          id: clientId,
          name: '张先生',
          phone: '137****1234',
          email: 'zhang****@email.com',
          status: '活跃',
          joinDate: '2025-01-15',
          basicInfo: {
            age: 35,
            gender: '男',
            occupation: '企业家',
            maritalStatus: '已婚',
            address: '上海市浦东新区',
          },
          medicalHistory: [
            {
              id: 1,
              date: '2025-01-20',
              type: '初步检查',
              description: '基础体检完成',
            },
          ],
          documents: [
            {
              id: 1,
              name: '身份证明.pdf',
              type: 'application/pdf',
              uploadDate: '2025-01-15',
              category: '身份证明',
            },
          ],
          communicationLogs: [
            {
              id: 1,
              date: '2025-01-15',
              type: '面谈',
              summary: '初次咨询，了解基本需求',
              nextFollowUp: '2025-01-22',
            },
          ],
        }

        setClient(mockClient)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchClient()
  }, [clientId])

  const updateClient = async (updates: Partial<Client>) => {
    try {
      // TODO: 替换为实际的API调用
      setClient(prev => prev ? { ...prev, ...updates } : null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
      return false
    }
  }

  return {
    client,
    loading,
    error,
    updateClient,
  }
}
