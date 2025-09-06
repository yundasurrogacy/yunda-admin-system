export interface Client {
  id: number
  name: string
  phone: string
  email: string
  status: '活跃' | '潜在' | '已完成' | '已暂停'
  joinDate: string
  basicInfo: {
    age: number
    gender: string
    occupation: string
    maritalStatus: string
    address: string
  }
  medicalHistory: {
    id: number
    date: string
    type: string
    description: string
  }[]
  documents: {
    id: number
    name: string
    type: string
    uploadDate: string
    category: string
  }[]
  communicationLogs: {
    id: number
    date: string
    type: '电话' | '邮件' | '面谈' | '其他'
    summary: string
    nextFollowUp?: string
  }[]
}

export interface ClientFilters {
  status?: string
  search?: string
  startDate?: string
  endDate?: string
}
