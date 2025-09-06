export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  pendingTasks: number;
  clientCount: number;
  surrogateCount: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'case' | 'task' | 'document';
  description: string;
  date: string;
  related_id?: string;
}

export interface CasesStatsResponse {
  total: number;
  active: number;
}

export interface TasksCountResponse {
  count: number;
}

export interface ClientCountResponse {
  count: number;
}

export interface SurrogateCountResponse {
  count: number;
}

export interface ActivityRecord {
  id: string;
  type: 'case' | 'task' | 'document';
  description: string;
  created_at: string;
  related_id: string;
  manager_id: string;
}
