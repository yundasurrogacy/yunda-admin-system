import { ActivityRecord, CasesStatsResponse, TasksCountResponse, ClientCountResponse, SurrogateCountResponse } from '@/types/dashboard'

// 模拟数据
export const mockDashboardData: {
  casesStats: CasesStatsResponse;
  tasksCount: TasksCountResponse;
  clientCount: ClientCountResponse;
  surrogateCount: SurrogateCountResponse;
  activities: ActivityRecord[];
} = {
  casesStats: {
    total: 24,
    active: 8,
  },
  tasksCount: {
    count: 12,
  },
  clientCount: {
    count: 18
  },
  surrogateCount: {
    count: 24
  },
  activities: [
    {
      id: '1',
      type: 'case',
      description: '新客户 Sarah Johnson 的代孕申请已提交',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
      related_id: 'case_1',
      manager_id: 'manager_1'
    },
    {
      id: '2',
      type: 'task',
      description: '需要审核 Emily Brown 的医疗记录',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
      related_id: 'task_1',
      manager_id: 'manager_1'
    },
    {
      id: '3',
      type: 'document',
      description: '代孕协议已上传，等待审核',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3小时前
      related_id: 'doc_1',
      manager_id: 'manager_1'
    },
    {
      id: '4',
      type: 'case',
      description: 'Maria Garcia 的代孕流程已进入第二阶段',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5小时前
      related_id: 'case_2',
      manager_id: 'manager_1'
    },
    {
      id: '5',
      type: 'task',
      description: '安排 Lisa Wilson 的心理评估',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8小时前
      related_id: 'task_2',
      manager_id: 'manager_1'
    },
    {
      id: '6',
      type: 'document',
      description: '更新代孕合同条款',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1天前
      related_id: 'doc_2',
      manager_id: 'manager_1'
    },
    {
      id: '7',
      type: 'case',
      description: 'Anna Martinez 的代孕申请已批准',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25小时前
      related_id: 'case_3',
      manager_id: 'manager_1'
    },
    {
      id: '8',
      type: 'task',
      description: '跟进 Rachel Thompson 的体检报告',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26小时前
      related_id: 'task_3',
      manager_id: 'manager_1'
    },
    {
      id: '9',
      type: 'document',
      description: '医疗保险文件已更新',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2天前
      related_id: 'doc_3',
      manager_id: 'manager_1'
    },
    {
      id: '10',
      type: 'case',
      description: 'Sophie Lee 的代孕流程已完成',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3天前
      related_id: 'case_4',
      manager_id: 'manager_1'
    },
  ]
}
