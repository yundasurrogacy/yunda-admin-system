export interface ClientProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'potential' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}
