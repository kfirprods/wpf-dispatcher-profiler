import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ResultsOverviewView from '../views/ResultsOverviewView.vue';
import { useProfilerStore } from '@/stores/profiler';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/overview',
      name: 'overview',
      component: ResultsOverviewView,
      beforeEnter: (to, from, next) => {
        const { profilingSession } = useProfilerStore();
        if (!profilingSession) {
          next('/');
        } else {
          next();
        }
      }
    }
  ]
});

export default router;
