import { type ProfiledTask } from './profiled-task.type';

export type ProfilingSession = {
  exported_at: string;
  total_run_time: number;
  tasks: ProfiledTask[];
};
