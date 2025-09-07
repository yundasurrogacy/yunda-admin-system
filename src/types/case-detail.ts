export interface CaseDetail {
  id: string
  clientName: string
  status: 'ongoing' | 'completed' | 'pending'
  lastUpdate: string
  ivfStatus: string
  medicalReport: string
  contractStatus: string
  nextAppointment: string
  timeline: {
    date: string
    event: string
    details: string
    type: 'ivf' | 'medical' | 'contract' | 'general'
  }[]
  documents: {
    id: string
    name: string
    type: string
    uploadDate: string
    status: 'pending' | 'approved' | 'rejected'
  }[]
}
