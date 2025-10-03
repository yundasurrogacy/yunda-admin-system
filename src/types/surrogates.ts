export interface Surrogate {
  id: string;
  name: string;
  age: number;
  experience: '有经验' | '首次';
  health: '优秀' | '良好' | '一般';
  last_checkup: string;
  status: '可配对' | '已配对' | '已完成' | '暂停中';
  created_at: string;
  updated_at: string;
  manager_id: string;
}

export interface SurrogateFilters {
  search?: string;
  status?: string;
  health?: string;
  experience?: string;
  ageRange?: {
    min?: number;
    max?: number;
  };
}
