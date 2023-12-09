<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { RouterLink } from 'vue-router';
import { Chart as ChartJS, ArcElement, Tooltip, type ChartData } from 'chart.js';
import { Pie } from 'vue-chartjs';
import AnimatedNumber from './AnimatedNumber.vue';

ChartJS.register(ArcElement, Tooltip);

interface TaskSummary {
  origin_name: string;
  time: number;
}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array as PropType<TaskSummary[]>,
    required: true
  },
  timeOccupiedByOtherTasks: {
    type: Number,
    required: true
  }
});

const backgroundColors = ['#F44336', '#9C27B0', '#2196F3', '#4CAF50', '#FFEB3B', '#9E9E9E'];

const pieChartData: any = computed(() => {
  const totalTimeOfAllTasks =
    props.tasks.reduce((acc, task) => acc + task.time, 0) + props.timeOccupiedByOtherTasks;
  const percentagesOfTasks = props.tasks.map((task) =>
    Math.round((task.time / totalTimeOfAllTasks) * 100)
  );
  const percentageOfOtherTasks = Math.round(
    (props.timeOccupiedByOtherTasks / totalTimeOfAllTasks) * 100
  );

  return {
    labels: [...props.tasks.map((task) => task.origin_name), 'Other tasks'],
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: [...percentagesOfTasks, percentageOfOtherTasks]
      }
    ]
  };
});

const pieChartOptions = ref({
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || '';

          if (context.parsed) {
            label += `${context.parsed}%`;
          }

          return label;
        }
      }
    }
  }
});
</script>

<template>
  <div class="highlight">
    <h3 class="highlight-title">{{ title }}</h3>
    <div class="highlight-content-container">
      <div class="chart-container">
        <pie class="pie-chart" :data="pieChartData" :options="pieChartOptions" />
      </div>

      <div class="highlight-list-container">
        <template v-for="(task, index) in tasks" :key="index">
          <div class="time">
            <animated-number suffix="ms" :number="task.time" />
          </div>
          <div class="name">
            <router-link :to="{ name: 'task-group', query: { origin_name: task.origin_name } }">
              {{ task.origin_name }}
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlight-content-container {
  display: flex;
  gap: 1rem;
}

.highlight-list-container {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.3rem 0.5rem;
}

.highligh-list-item {
  padding: 0.5rem 1rem;
  gap: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.time {
  flex-shrink: 0;
  font-weight: 300;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-container {
  width: 100px;
  height: 100px;
}
</style>
