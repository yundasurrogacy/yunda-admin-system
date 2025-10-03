import { CaseDetail } from '@/types/case-detail'

export const mockCaseDetails: Record<string, CaseDetail> = {
  'case-001': {
    id: 'case-001',
    clientName: '张三',
    status: 'ongoing',
    lastUpdate: '2025-09-07',
    ivfStatus: '进行中',
    medicalReport: '已更新',
    contractStatus: '已签署',
    nextAppointment: '2025-09-10',
    timeline: [
      {
        date: '2025-09-07',
        event: 'IVF咨询',
        details: '完成初步咨询',
        type: 'ivf'
      },
      {
        date: '2025-09-06',
        event: '医疗报告更新',
        details: '新的医疗记录已添加',
        type: 'medical'
      }
    ],
    documents: [
      {
        id: 'd1',
        name: '医疗报告.pdf',
        type: 'medical',
        uploadDate: '2025-09-07',
        status: 'approved'
      },
      {
        id: 'd2',
        name: '合同草案.pdf',
        type: 'contract',
        uploadDate: '2025-09-06',
        status: 'pending'
      }
    ]
  },
  'case-002': {
    id: 'case-002',
    clientName: '李四',
    status: 'pending',
    lastUpdate: '2025-09-05',
    ivfStatus: '待开始',
    medicalReport: '待更新',
    contractStatus: '审核中',
    nextAppointment: '2025-09-12',
    timeline: [
      {
        date: '2025-09-05',
        event: '初步咨询',
        details: '完成客户需求评估',
        type: 'general'
      }
    ],
    documents: [
      {
        id: 'd3',
        name: '初步评估报告.pdf',
        type: 'medical',
        uploadDate: '2025-09-05',
        status: 'pending'
      }
    ]
  }
}
