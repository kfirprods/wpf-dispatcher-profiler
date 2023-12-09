import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ResultsOverviewView from '../views/ResultsOverviewView.vue';
import TaskGroupView from '../views/TaskGroupView.vue';
import AllTaskGroupsView from '../views/AllTaskGroupsView.vue';
import { useProfilerStore } from '@/stores/profiler.store';

function requiresProfilingSessionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { profilingSession } = useProfilerStore();
  if (!profilingSession) {
    next('/');
  } else {
    next();
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },

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
      beforeEnter: requiresProfilingSessionGuard
    },
    {
      path: '/task-group',
      name: 'task-group',
      component: TaskGroupView,
      // required query param "origin_name"
      props: (route) => ({ originName: route.query.origin_name as string }),
      beforeEnter: (to, from, next) => {
        const { groupedTasks } = useProfilerStore();
        const group = groupedTasks.find((g) => g.origin_name === to.query.origin_name);

        if (!to.query.origin_name || !group) {
          console.warn(
            `Prevented navigation to /task-group because no group found for origin_name "${to.query.origin_name}" (or no origin_name query param provided)`
          );
          next('/overview');
        } else {
          requiresProfilingSessionGuard(to, from, next);
        }
      }
    },
    {
      path: '/all-task-groups',
      name: 'all-task-groups',
      component: AllTaskGroupsView,
      beforeEnter: requiresProfilingSessionGuard
    }
  ]
});

router.beforeEach((to, from, next) => {
  to.meta.from = from;
  next();
});

export default router;
