export type ProfiledTask = {
  time_in_queue: number;
  actual_run_time: number;
  is_probably_redundant: boolean;
  priority: number;
  origin_name: string;
  created_at: string;
};
