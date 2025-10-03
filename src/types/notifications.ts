export type NotificationType = '预约' | '文件' | '消息' | '提醒' | '系统';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  manager_id: string;
  action_path?: string;
  related_type?: string;
  related_id?: string;
  related_name?: string;
}

export interface NotificationFilters {
  search?: string;
  type?: NotificationType;
  isRead?: boolean;
}
