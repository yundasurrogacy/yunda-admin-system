import { CaseDetail } from '@/types/case-detail'

class CaseService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

  async getCaseDetail(caseId: string): Promise<CaseDetail> {
    const response = await fetch(`${this.API_BASE_URL}/api/cases/${caseId}`)
    console.log(caseId)
    console.log(response)
    if (!response.ok) {
      throw new Error('API request failed')
    }
    return await response.json()
  }

  async updateCaseDetail(caseId: string, data: Partial<CaseDetail>): Promise<CaseDetail> {
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
  }
}

export const caseService = new CaseService()
