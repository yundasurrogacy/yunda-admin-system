export interface Surrogate {
  id: string
  name: string
  age: number
  status: '可配对' | '已配对' | '已完成' | '暂停中'
  health: '优秀' | '良好' | '一般'
  experience: '有经验' | '首次'
  lastCheckup: string
  basicInfo: {
    height: number
    weight: number
    bloodType: string
    education: string
    occupation: string
    address: string
  }
  medicalRecords: {
    id: number
    date: string
    type: string
    result: string
    doctor: string
    hospital: string
    nextCheckup?: string
  }[]
  matchingPreferences: {
    location: string[]
    ageRange: {
      min: number
      max: number
    }
    compensationRange: {
      min: number
      max: number
    }
    specialRequirements: string[]
  }
  documents: {
    id: number
    name: string
    type: string
    category: string
    uploadDate: string
  }[]
}

export interface SurrogateFilters {
  status?: string
  health?: string
  experience?: string
  search?: string
  ageRange?: {
    min?: number
    max?: number
  }
  lastCheckupAfter?: string
}
