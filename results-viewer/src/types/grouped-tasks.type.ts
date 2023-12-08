import type { ProfiledTask } from '.';

export type GroupedTasks = {
  origin_name: string;
  accumulated_time_in_queue: number;
  accumulated_actual_run_time: number;
  accumulated_total_run_time: number;
  average_time_in_queue: number;
  average_actual_run_time: number;
  average_total_run_time: number;
  average_priority: number;
  has_redundant_tasks: boolean;
  are_all_tasks_redundant: boolean;
  tasks: ProfiledTask[];
};
