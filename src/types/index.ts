// 导入现有类型
import { Notification as OriginalNotification } from './notification';

// 任务类型定义
export type Task = {
  title: string;
  priority: "high" | "medium" | "low";
  dueTime?: string;
  completedTime?: string;
  assignedTo: string;
  status: "inProgress" | "pending" | "done" | "scheduled";
};

// 通知类型定义 - 适配页面中使用的版本
export interface Notification {
  id: number;
  type: 'message' | 'document' | 'alert' | 'appointment';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  priority: 'high' | 'medium';
  relatedTo?: {
    type: 'client' | 'surrogate' | 'case' | 'document';
    id: string | number;
    name?: string;
  };
  action?: {
    type: 'view' | 'approve' | 'reject' | 'schedule';
    path?: string;
  };
}
