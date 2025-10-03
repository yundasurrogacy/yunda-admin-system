export interface Case {
  id: string;
  status: string;
  client_name: string;
  surrogate_id: string | null;
  start_date: string;
  last_update: string;
  title: string;
  description: string;
  manager_id: string;
}
