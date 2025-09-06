import { Notification } from '@/types/notifications';

// 模拟通知数据
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: '系统',
    title: '系统维护通知',
    description: '系统将于今晚22:00-23:00进行例行维护，期间可能无法访问系统。',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    manager_id: 'current_manager_id',
    action_path: '/client-manager/dashboard',
  },
  {
    id: '2',
    type: '文件',
    title: '新文件上传',
    description: '客户张三上传了新的身份证明文件，请及时查看。',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    manager_id: 'current_manager_id',
    action_path: '/client-manager/client-profiles',
    related_type: '客户',
    related_id: 'client-001',
    related_name: '张三',
  },
  {
    id: '3',
    type: '预约',
    title: '预约提醒',
    description: '您有一个与李四的视频会议将在明天上午10:00开始。',
    is_read: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    manager_id: 'current_manager_id',
    related_type: '会议',
    related_id: 'meeting-002',
    related_name: '李四视频会议',
  },
  {
    id: '4',
    type: '消息',
    title: '新消息',
    description: '您收到了来自王五的新消息，请及时回复。',
    is_read: false,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    manager_id: 'current_manager_id',
    action_path: '/client-manager/messages',
    related_type: '客户',
    related_id: 'client-003',
    related_name: '王五',
  },
  {
    id: '5',
    type: '提醒',
    title: '任务到期提醒',
    description: '您有一个关于合同审核的任务即将到期，请尽快处理。',
    is_read: true,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
    manager_id: 'current_manager_id',
    action_path: '/client-manager/tasks',
  }
];

// 根据筛选条件过滤通知
export const filterNotifications = (filters: {
  search?: string;
  type?: string;
  isRead?: boolean;
}) => {
  let filtered = [...mockNotifications];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      n => 
        n.title.toLowerCase().includes(searchLower) || 
        n.description.toLowerCase().includes(searchLower)
    );
  }

  if (filters.type) {
    filtered = filtered.filter(n => n.type === filters.type);
  }

  if (filters.isRead !== undefined) {
    filtered = filtered.filter(n => n.is_read === filters.isRead);
  }

  return filtered;
};

// 获取未读通知数量
export const getUnreadCount = () => {
  return mockNotifications.filter(n => !n.is_read).length;
};
