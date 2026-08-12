<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue';
import { FrameworkId, Task, BenchmarkOp, BenchmarkResult } from '../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
import { runFrameworkBenchmark, generateTasks } from '../services/domBenchmarkEngine';
import { Play, RefreshCw, Zap } from 'lucide-vue-next';

const props = defineProps<{
  itemCount: number;
}>();

const emit = defineEmits<{
  (e: 'recordResult', result: BenchmarkResult): void;
}>();

const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];

const tasksMap = ref<Record<FrameworkId, Task[]>>({
  react: [],
  angular: [],
  vue: [],
  svelte: [],
});

const metricsMap = ref<Record<FrameworkId, BenchmarkResult | null>>({
  react: null,
  angular: null,
  vue: null,
  svelte: null,
});

const isExecuting = ref(false);

const reactContainer = useTemplateRef<HTMLDivElement>('container-react');
const angularContainer = useTemplateRef<HTMLDivElement>('container-angular');
const vueContainer = useTemplateRef<HTMLDivElement>('container-vue');
const svelteContainer = useTemplateRef<HTMLDivElement>('container-svelte');

function getContainer(fw: FrameworkId): HTMLDivElement | null {
  if (fw === 'react') return reactContainer.value;
  if (fw === 'angular') return angularContainer.value;
  if (fw === 'vue') return vueContainer.value;
  if (fw === 'svelte') return svelteContainer.value;
  return null;
}

onMounted(() => {
  tasksMap.value = {
    react: generateTasks(20, 'React'),
    angular: generateTasks(20, 'Angular'),
    vue: generateTasks(20, 'Vue'),
    svelte: generateTasks(20, 'Svelte'),
  };
});

async function handleRunSimultaneousOp(op: BenchmarkOp) {
  if (isExecuting.value) return;
  isExecuting.value = true;

  for (const fw of frameworks) {
    const el = getContainer(fw);
    if (el) {
      const { result, updatedTasks } = await runFrameworkBenchmark(
        fw,
        op,
        el,
        tasksMap.value[fw],
        props.itemCount
      );

      metricsMap.value[fw] = result;
      tasksMap.value[fw] = updatedTasks;
      emit('recordResult', result);
    }
  }

  isExecuting.value = false;
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Sandbox Header & Controls -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-semibold">
              4-Way Split Sandbox
            </span>
            <h2 class="text-2xl font-bold text-slate-900">Simultaneous DOM Execution</h2>
          </div>
          <p class="text-sm text-slate-500 mt-1">
            Trigger DOM operations across React, Angular, Vue, and Svelte simultaneously to observe side-by-side performance.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="handleRunSimultaneousOp('initialRender100')"
            :disabled="isExecuting"
            class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <Play class="w-3.5 h-3.5 fill-current" />
            Render 100
          </button>
          <button
            @click="handleRunSimultaneousOp('initialRender500')"
            :disabled="isExecuting"
            class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <Play class="w-3.5 h-3.5 fill-current" />
            Render 500
          </button>
          <button
            @click="handleRunSimultaneousOp('initialRender1000')"
            :disabled="isExecuting"
            class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <Play class="w-3.5 h-3.5 fill-current" />
            Render 1,000
          </button>
          <button
            @click="handleRunSimultaneousOp('update50')"
            :disabled="isExecuting"
            class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            Update 50 Tasks
          </button>
          <button
            @click="handleRunSimultaneousOp('delete50')"
            :disabled="isExecuting"
            class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Zap class="w-3.5 h-3.5" />
            Delete 50 Tasks
          </button>
        </div>
      </div>

      <!-- Action Trigger Buttons Bar -->
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span class="text-slate-500 font-mono font-medium mr-2">Quick Actions:</span>
        <button
          v-for="op in BENCHMARK_OPERATIONS"
          :key="op.id"
          @click="handleRunSimultaneousOp(op.id)"
          :disabled="isExecuting"
          class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all font-medium"
        >
          {{ op.name }}
        </button>
      </div>
    </div>

    <!-- 4-Column Split Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="fwId in frameworks"
        :key="fwId"
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
      >
        <!-- Framework Header Card -->
        <div class="space-y-2 border-b border-slate-100 pb-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                <div v-html="FRAMEWORKS[fwId].logoSvg"></div>
              </span>
              <span class="text-base font-bold text-slate-900">{{ FRAMEWORKS[fwId].name }}</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800">
              v{{ FRAMEWORKS[fwId].version }}
            </span>
          </div>
          <div class="text-[11px] text-slate-500 font-mono leading-tight">{{ FRAMEWORKS[fwId].architecture }}</div>
        </div>

        <!-- Metrics Display Card -->
        <div v-if="metricsMap[fwId]" class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
          <div class="flex items-center justify-between text-slate-600 text-[10px]">
            <span>Last Run Duration:</span>
            <span class="text-emerald-600 font-bold text-xs">{{ metricsMap[fwId]?.durationMs }} ms</span>
          </div>
          <div class="flex items-center justify-between text-slate-600 text-[10px]">
            <span>DOM Mutations:</span>
            <span class="text-sky-600 font-bold">{{ metricsMap[fwId]?.domMutations }} ops</span>
          </div>
          <div class="flex items-center justify-between text-slate-600 text-[10px]">
            <span>Est. Memory:</span>
            <span class="text-amber-600 font-bold">{{ metricsMap[fwId]?.memoryEstKb }} KB</span>
          </div>
        </div>
        <div v-else class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-400 text-center">
          Click action button to test {{ FRAMEWORKS[fwId].name }} engine
        </div>

        <!-- Live Rendered Container -->
        <div class="space-y-1.5 flex-1 flex flex-col">
          <div class="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Task Node Tree</span>
            <span>{{ tasksMap[fwId].length }} items</span>
          </div>
          <div class="flex-1 max-h-64 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200 custom-scrollbar">
            <div :ref="`container-${fwId}`" :id="`split-sandbox-${fwId}`">
              <!-- Rendered by engine -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
