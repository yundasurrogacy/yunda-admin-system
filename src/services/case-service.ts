import { CaseDetail } from '@/types/case-detail'
import { mockCaseDetails } from '@/mock/cases'

class CaseService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
  private readonly USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

  async getCaseDetail(caseId: string): Promise<CaseDetail> {
    if (this.USE_MOCK) {
      return this.getMockCaseDetail(caseId)
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/api/cases/${caseId}`)
      if (!response.ok) {
        throw new Error('API request failed')
      }
      return await response.json()
    } catch (error) {
      console.warn('Failed to fetch case detail from API, falling back to mock data:', error)
      return this.getMockCaseDetail(caseId)
    }
  }

  private getMockCaseDetail(caseId: string): CaseDetail {
    const mockCase = mockCaseDetails[caseId]
    if (!mockCase) {
      throw new Error(`Case with ID ${caseId} not found`)
    }
    return mockCase
  }

  async updateCaseDetail(caseId: string, data: Partial<CaseDetail>): Promise<CaseDetail> {
    if (this.USE_MOCK) {
      return this.updateMockCaseDetail(caseId, data)
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/api/cases/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error('API update failed')
      }
      return await response.json()
    } catch (error) {
      console.warn('Failed to update case detail via API, falling back to mock update:', error)
      return this.updateMockCaseDetail(caseId, data)
    }
  }

  private updateMockCaseDetail(caseId: string, data: Partial<CaseDetail>): CaseDetail {
    const existingCase = this.getMockCaseDetail(caseId)
    const updatedCase = {
      ...existingCase,
      ...data,
      lastUpdate: new Date().toISOString().split('T')[0]
    }
    mockCaseDetails[caseId] = updatedCase
    return updatedCase
  }
}

export const caseService = new CaseService()
