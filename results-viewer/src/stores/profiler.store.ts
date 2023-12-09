import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { type ProfilingSession, type GroupedTasks } from '@/types';

export const useProfilerStore = defineStore('profiler', () => {
  const _profilingSession = ref<ProfilingSession | null>(null);

  function setProfilingSession(session: ProfilingSession) {
    session.tasks = session.tasks.map((task) => ({
      ...task,
      total_run_time: task.actual_run_time + task.time_in_queue
    }));

    _profilingSession.value = session;

    try {
      sessionStorage.setItem('profilingSession', JSON.stringify(session));
    } catch (error) {
      console.warn(
        "Unfortunately, we couldn't save the profiling session to sessionStorage, probably due to it exceeding the 5MB limit."
      );
    }
  }

  const profilingSession = computed(() => {
    if (!_profilingSession.value) {
      const session = sessionStorage.getItem('profilingSession');
      if (session) {
        _profilingSession.value = JSON.parse(session);
      }
    }

    return _profilingSession.value;
  });

  // Tasks grouped by their name
  const groupedTasks = computed<GroupedTasks[]>(() => {
    if (!profilingSession.value) {
      return [];
    }

    // Group tasks by name and calculate accumulated & average values for some fields
    return profilingSession.value.tasks.reduce((_groupedTasks, task) => {
      const existingTask = _groupedTasks.find((t) => t.origin_name === task.origin_name);

      if (existingTask) {
        existingTask.tasks.push(task);
        existingTask.accumulated_actual_run_time += task.actual_run_time;
        existingTask.accumulated_time_in_queue += task.time_in_queue;
        existingTask.accumulated_total_run_time += task.total_run_time;
        existingTask.accumulated_priority += task.priority;
        existingTask.average_actual_run_time = Math.round(
          existingTask.accumulated_actual_run_time / existingTask.tasks.length
        );
        existingTask.average_time_in_queue = Math.round(
          existingTask.accumulated_time_in_queue / existingTask.tasks.length
        );
        existingTask.average_total_run_time = Math.round(
          existingTask.accumulated_total_run_time / existingTask.tasks.length
        );
        existingTask.average_priority = Math.round(
          existingTask.accumulated_priority / existingTask.tasks.length
        );

        if (task.is_probably_redundant) {
          existingTask.has_redundant_tasks = true;
        } else {
          existingTask.are_all_tasks_redundant = false;
        }
      } else {
        const groupedTask: GroupedTasks = {
          origin_name: task.origin_name,
          accumulated_actual_run_time: task.actual_run_time,
          accumulated_time_in_queue: task.time_in_queue,
          accumulated_total_run_time: task.total_run_time,
          accumulated_priority: task.priority,
          average_actual_run_time: task.actual_run_time,
          average_time_in_queue: task.time_in_queue,
          average_total_run_time: task.total_run_time,
          average_priority: task.priority,
          has_redundant_tasks: task.is_probably_redundant,
          are_all_tasks_redundant: task.is_probably_redundant,
          tasks: [task]
        };
        _groupedTasks.push(groupedTask);
      }

      return _groupedTasks;
    }, [] as GroupedTasks[]);
  });

  const longestRunningTasks = computed(() => {
    if (!groupedTasks.value?.length) {
      return [];
    }

    return [...groupedTasks.value].sort(
      (a, b) => b.accumulated_actual_run_time - a.accumulated_actual_run_time
    );
  });

  const longestWaitingTasks = computed(() => {
    if (!groupedTasks.value?.length) {
      return [];
    }

    return [...groupedTasks.value].sort(
      (a, b) => b.accumulated_time_in_queue - a.accumulated_time_in_queue
    );
  });

  return {
    profilingSession,
    setProfilingSession,
    groupedTasks,
    longestRunningTasks,
    longestWaitingTasks
  };
});
