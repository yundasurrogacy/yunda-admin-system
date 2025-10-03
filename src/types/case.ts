export interface Case {
  id: number
  clientName: string
  surrogateId: string
  status: '进行中' | '待配对' | '已完成' | '已取消'
  startDate: string
  lastUpdate: string
  documents: Array<{
    id: number
    name: string
    type: string
    uploadDate: string
  }>
  notes: Array<{
    id: number
    content: string
    date: string
    author: string
  }>
}

export interface CaseFilters {
  status?: string
  search?: string
  startDate?: string
  endDate?: string
}
