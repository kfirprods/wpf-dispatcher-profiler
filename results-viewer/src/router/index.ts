import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ResultsOverviewView from '../views/ResultsOverviewView.vue';
import TaskGroupView from '../views/TaskGroupView.vue';
import { useProfilerStore } from '@/stores/profiler.store';

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
    },
    {
      path: '/task-group',
      name: 'task-group',
      component: TaskGroupView,
      // required query param "origin_name"
      props: (route) => ({ originName: route.query.origin_name as string }),
      beforeEnter: (to, from, next) => {
        const { profilingSession } = useProfilerStore();
        if (!to.query.origin_name) {
          next('/overview');
        } else if (!profilingSession) {
          next('/');
        } else {
          next();
        }
      }
    }
  ]
});

export default router;
