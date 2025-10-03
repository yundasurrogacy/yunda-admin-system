import { useState, useEffect } from 'react'
import type { Case, CaseFilters } from '@/types/case'

export function useCases(initialFilters: CaseFilters = {}) {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CaseFilters>(initialFilters)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true)
        // TODO: 替换为实际的API调用
        const mockCases: Case[] = [
          {
            id: 1,
            clientName: '张先生',
            surrogateId: 'SUR001',
            status: '进行中',
            startDate: '2025-01-15',
            lastUpdate: '2025-09-01',
            documents: [
              {
                id: 1,
                name: '合同文件.pdf',
                type: 'application/pdf',
                uploadDate: '2025-01-15',
              },
            ],
            notes: [
              {
                id: 1,
                content: '初次面谈完成',
                date: '2025-01-15',
                author: '王经理',
              },
            ],
          },
          // 更多模拟数据...
        ]

        // 应用筛选器
        let filteredCases = mockCases
        if (filters.status) {
          filteredCases = filteredCases.filter(c => c.status === filters.status)
        }
        if (filters.search) {
          filteredCases = filteredCases.filter(c => 
            c.clientName.includes(filters.search!) || 
            c.surrogateId.includes(filters.search!)
          )
        }
        if (filters.startDate) {
          filteredCases = filteredCases.filter(c => 
            new Date(c.startDate) >= new Date(filters.startDate!)
          )
        }
        if (filters.endDate) {
          filteredCases = filteredCases.filter(c => 
            new Date(c.startDate) <= new Date(filters.endDate!)
          )
        }

        setCases(filteredCases)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchCases()
  }, [filters])

  const updateFilters = (newFilters: Partial<CaseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const refreshCases = () => {
    setLoading(true)
    // TODO: 实现刷新逻辑
  }

  return {
    cases,
    loading,
    error,
    filters,
    updateFilters,
    refreshCases,
  }
}
