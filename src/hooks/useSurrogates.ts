import { useState, useEffect } from 'react'
import type { Surrogate, SurrogateFilters } from '@/types/surrogate'

export function useSurrogates(initialFilters: SurrogateFilters = {}) {
  const [surrogates, setSurrogates] = useState<Surrogate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SurrogateFilters>(initialFilters)

  useEffect(() => {
    const fetchSurrogates = async () => {
      try {
        setLoading(true)
        // TODO: 替换为实际的API调用
        const mockSurrogates: Surrogate[] = [
          {
            id: 'SUR001',
            name: '王女士',
            age: 28,
            status: '可配对',
            health: '优秀',
            experience: '有经验',
            lastCheckup: '2025-08-15',
            basicInfo: {
              height: 165,
              weight: 55,
              bloodType: 'A',
              education: '本科',
              occupation: '自由职业',
              address: '上海市',
            },
            medicalRecords: [
              {
                id: 1,
                date: '2025-08-15',
                type: '常规体检',
                result: '正常',
                doctor: '张医生',
                hospital: '第一医院',
                nextCheckup: '2025-09-15',
              },
            ],
            matchingPreferences: {
              location: ['上海', '江苏', '浙江'],
              ageRange: {
                min: 25,
                max: 35,
              },
              compensationRange: {
                min: 300000,
                max: 500000,
              },
              specialRequirements: ['无吸烟史', '健康状况良好'],
            },
            documents: [
              {
                id: 1,
                name: '体检报告.pdf',
                type: 'application/pdf',
                category: '医疗记录',
                uploadDate: '2025-08-15',
              },
            ],
          },
          // 更多模拟数据...
        ]

        // 应用筛选器
        let filteredSurrogates = mockSurrogates
        if (filters.status) {
          filteredSurrogates = filteredSurrogates.filter(s => s.status === filters.status)
        }
        if (filters.health) {
          filteredSurrogates = filteredSurrogates.filter(s => s.health === filters.health)
        }
        if (filters.experience) {
          filteredSurrogates = filteredSurrogates.filter(s => s.experience === filters.experience)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredSurrogates = filteredSurrogates.filter(s => 
            s.name.toLowerCase().includes(searchLower) || 
            s.id.toLowerCase().includes(searchLower)
          )
        }
        if (filters.ageRange?.min) {
          filteredSurrogates = filteredSurrogates.filter(s => s.age >= filters.ageRange!.min!)
        }
        if (filters.ageRange?.max) {
          filteredSurrogates = filteredSurrogates.filter(s => s.age <= filters.ageRange!.max!)
        }
        if (filters.lastCheckupAfter) {
          filteredSurrogates = filteredSurrogates.filter(s => 
            new Date(s.lastCheckup) >= new Date(filters.lastCheckupAfter!)
          )
        }

        setSurrogates(filteredSurrogates)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchSurrogates()
  }, [filters])

  const updateFilters = (newFilters: Partial<SurrogateFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const refreshSurrogates = () => {
    setLoading(true)
    // TODO: 实现刷新逻辑
  }

  return {
    surrogates,
    loading,
    error,
    filters,
    updateFilters,
    refreshSurrogates,
  }
}

export function useSurrogate(surrogateId: string) {
  const [surrogate, setSurrogate] = useState<Surrogate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSurrogate = async () => {
      try {
        setLoading(true)
        // TODO: 替换为实际的API调用
        const mockSurrogate: Surrogate = {
          id: surrogateId,
          name: '王女士',
          age: 28,
          status: '可配对',
          health: '优秀',
          experience: '有经验',
          lastCheckup: '2025-08-15',
          basicInfo: {
            height: 165,
            weight: 55,
            bloodType: 'A',
            education: '本科',
            occupation: '自由职业',
            address: '上海市',
          },
          medicalRecords: [
            {
              id: 1,
              date: '2025-08-15',
              type: '常规体检',
              result: '正常',
              doctor: '张医生',
              hospital: '第一医院',
              nextCheckup: '2025-09-15',
            },
          ],
          matchingPreferences: {
            location: ['上海', '江苏', '浙江'],
            ageRange: {
              min: 25,
              max: 35,
            },
            compensationRange: {
              min: 300000,
              max: 500000,
            },
            specialRequirements: ['无吸烟史', '健康状况良好'],
          },
          documents: [
            {
              id: 1,
              name: '体检报告.pdf',
              type: 'application/pdf',
              category: '医疗记录',
              uploadDate: '2025-08-15',
            },
          ],
        }

        setSurrogate(mockSurrogate)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchSurrogate()
  }, [surrogateId])

  const updateSurrogate = async (updates: Partial<Surrogate>) => {
    try {
      // TODO: 替换为实际的API调用
      setSurrogate(prev => prev ? { ...prev, ...updates } : null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
      return false
    }
  }

  const addMedicalRecord = async (record: Omit<Surrogate['medicalRecords'][0], 'id'>) => {
    try {
      // TODO: 替换为实际的API调用
      setSurrogate(prev => {
        if (!prev) return null
        const newRecord = {
          ...record,
          id: Math.max(...prev.medicalRecords.map(r => r.id)) + 1,
        }
        return {
          ...prev,
          medicalRecords: [...prev.medicalRecords, newRecord],
        }
      })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加医疗记录失败')
      return false
    }
  }

  return {
    surrogate,
    loading,
    error,
    updateSurrogate,
    addMedicalRecord,
  }
}
