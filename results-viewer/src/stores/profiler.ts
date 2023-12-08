import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { type ProfilingSession } from '@/types';

export const useProfilerStore = defineStore('profiler', () => {
  const _profilingSession = ref<ProfilingSession | null>(null);

  function setProfilingSession(session: ProfilingSession) {
    _profilingSession.value = session;
    sessionStorage.setItem('profilingSession', JSON.stringify(session));
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

  return {
    profilingSession,
    setProfilingSession
  };
});
