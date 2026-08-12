<script setup lang="ts">
import { ref, computed } from 'vue';
import { FrameworkId, BenchmarkResult, BenchmarkOp } from '../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
import { runFrameworkBenchmark } from '../services/domBenchmarkEngine';
import { Play, Trophy, Cpu, Zap, RotateCcw, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps<{
  itemCount: number;
  benchmarkResults: BenchmarkResult[];
}>();

const emit = defineEmits<{
  (e: 'recordResult', result: BenchmarkResult): void;
  (e: 'clearResults'): void;
}>();

const isBenchmarking = ref(false);
const activeMetricChart = ref<'durationMs' | 'domMutations' | 'memoryEstKb'>('durationMs');
const selectedOpFilter = ref<BenchmarkOp>('initialRender1000');

const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];

async function handleRunFullSuite() {
  if (isBenchmarking.value) return;
  isBenchmarking.value = true;

  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'absolute';
  hiddenContainer.style.left = '-9999px';
  hiddenContainer.style.top = '-9999px';
  document.body.appendChild(hiddenContainer);

  try {
    for (const opInfo of BENCHMARK_OPERATIONS) {
      for (const fw of frameworks) {
        const sandbox = document.createElement('div');
        hiddenContainer.appendChild(sandbox);

        const { result } = await runFrameworkBenchmark(
          fw,
          opInfo.id,
          sandbox,
          [],
          props.itemCount
        );

        emit('recordResult', result);
        hiddenContainer.removeChild(sandbox);
      }
    }
  } catch (err) {
    console.error('Error running benchmark suite:', err);
  } finally {
    document.body.removeChild(hiddenContainer);
    isBenchmarking.value = false;
  }
}

const chartData = computed(() => {
  return frameworks.map((fwId) => {
    const fw = FRAMEWORKS[fwId];
    const opResults = props.benchmarkResults.filter((r) => r.framework === fwId && r.op === selectedOpFilter.value);
    const latest = opResults[opResults.length - 1];

    return {
      id: fwId,
      name: fw.name,
      durationMs: latest ? latest.durationMs : 0,
      domMutations: latest ? latest.domMutations : 0,
      memoryEstKb: latest ? latest.memoryEstKb : 0,
      color: fwId === 'react' ? '#0284c7' : fwId === 'angular' ? '#dc2626' : fwId === 'vue' ? '#059669' : '#d97706',
    };
  });
});

const maxVal = computed(() => {
  const values = chartData.value.map((d) => d[activeMetricChart.value]);
  const highest = Math.max(...values, 1);
  return highest;
});

const sortedWinners = computed(() => {
  return [...chartData.value]
    .filter((d) => d.durationMs > 0)
    .sort((a, b) => a[activeMetricChart.value] - b[activeMetricChart.value]);
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Benchmark Control Bar & Overview -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 font-mono text-xs font-semibold">
            Comparative Analysis
          </span>
          <h2 class="text-2xl font-bold text-slate-900">Automated DOM Benchmark Suite</h2>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          Compare render time, DOM mutations, and memory footprints side-by-side across React, Angular, Vue, and Svelte.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="emit('clearResults')"
          class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          Clear Data
        </button>

        <button
          @click="handleRunFullSuite"
          :disabled="isBenchmarking"
          :class="[
            'px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs',
            isBenchmarking
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
          ]"
        >
          <template v-if="isBenchmarking">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Benchmarking Framework Engines...
          </template>
          <template v-else>
            <Play class="w-4 h-4 fill-current" />
            Run Part 2 Standard Suite (100, 500, 1,000, Update 50, Delete 50)
          </template>
        </button>
      </div>
    </div>

    <!-- Part 2 Focus Card: Operations Summary -->
    <div class="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-xs font-bold">
            Part 2 Core Operations
          </span>
          <h3 class="text-base font-bold text-slate-900">Required Benchmark Scenarios</h3>
        </div>
        <span class="text-xs text-slate-500 font-mono">React • Angular • Vue • Svelte</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-indigo-700 font-mono">1. Initial Rendering</span>
          <p class="text-xs text-slate-600">Measure render duration for <strong>100</strong>, <strong>500</strong>, and <strong>1,000</strong> tasks from cold DOM state.</p>
        </div>
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-emerald-700 font-mono">2. DOM Updates</span>
          <p class="text-xs text-slate-600">Measure time taken to update priority and text for <strong>50 tasks</strong> in place.</p>
        </div>
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span class="text-xs font-bold text-rose-700 font-mono">3. DOM Deletion</span>
          <p class="text-xs text-slate-600">Measure time taken to filter out and delete <strong>50 tasks</strong> from the active DOM tree.</p>
        </div>
      </div>
    </div>

    <!-- Leaderboard Summary Medals -->
    <div v-if="sortedWinners.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="(winner, idx) in sortedWinners.slice(0, 3)"
        :key="winner.id"
        class="p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative overflow-hidden bg-white"
      >
        <div class="flex items-center justify-between">
          <span
            :class="[
              'text-xs font-bold px-2.5 py-0.5 rounded-full',
              idx === 0
                ? 'border border-amber-200 bg-amber-50 text-amber-800'
                : idx === 1
                ? 'border border-slate-200 bg-slate-100 text-slate-800'
                : 'border border-amber-200 bg-amber-50/60 text-amber-900'
            ]"
          >
            {{ idx === 0 ? '🥇 1st Place' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place' }}
          </span>
          <Trophy class="w-4 h-4 text-amber-500" />
        </div>
        <div class="text-xl font-bold text-slate-900">{{ winner.name }}</div>
        <div class="text-xs text-slate-500 font-mono">
          {{
            activeMetricChart === 'durationMs'
              ? `${winner.durationMs} ms Execution Duration`
              : activeMetricChart === 'domMutations'
              ? `${winner.domMutations.toLocaleString()} DOM Operations`
              : `${winner.memoryEstKb.toLocaleString()} KB Memory Footprint`
          }}
        </div>
      </div>
    </div>

    <!-- Main Benchmark Chart Section -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Cpu class="w-5 h-5 text-sky-600" />
            Comparative Performance Metrics Chart
          </h3>
          <p class="text-xs text-slate-500">
            Select operation and metric to compare DOM engine efficiency.
          </p>
        </div>

        <!-- Operation & Metric Controls -->
        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="selectedOpFilter"
            class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-600 font-medium"
          >
            <option v-for="op in BENCHMARK_OPERATIONS" :key="op.id" :value="op.id">
              {{ op.name }}
            </option>
          </select>

          <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              @click="activeMetricChart = 'durationMs'"
              :class="[
                'px-3 py-1 rounded-md transition-all',
                activeMetricChart === 'durationMs' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Time (ms)
            </button>
            <button
              @click="activeMetricChart = 'domMutations'"
              :class="[
                'px-3 py-1 rounded-md transition-all',
                activeMetricChart === 'domMutations' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              DOM Ops
            </button>
            <button
              @click="activeMetricChart = 'memoryEstKb'"
              :class="[
                'px-3 py-1 rounded-md transition-all',
                activeMetricChart === 'memoryEstKb' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Memory (KB)
            </button>
          </div>
        </div>
      </div>

      <!-- Custom SVG Bar Chart in Vue -->
      <div class="min-h-64 w-full pt-4">
        <div v-if="benchmarkResults.length === 0" class="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
          <Zap class="w-8 h-8 text-slate-300" />
          <p class="text-sm">No benchmark data recorded yet.</p>
          <button
            @click="handleRunFullSuite"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs"
          >
            Run First Benchmark Pass
          </button>
        </div>

        <div v-else class="space-y-4">
          <div v-for="item in chartData" :key="item.id" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="font-bold text-slate-800">{{ item.name }}</span>
              <span class="font-bold" :style="{ color: item.color }">
                {{ item[activeMetricChart] }}
                {{ activeMetricChart === 'durationMs' ? 'ms' : activeMetricChart === 'domMutations' ? 'ops' : 'KB' }}
              </span>
            </div>
            <div class="w-full bg-slate-100 h-6 rounded-lg overflow-hidden flex items-center p-1 border border-slate-200">
              <div
                class="h-full rounded-md transition-all duration-500 ease-out flex items-center justify-end px-2"
                :style="{
                  width: `${Math.max(4, (item[activeMetricChart] / maxVal) * 100)}%`,
                  backgroundColor: item.color
                }"
              >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comprehensive Benchmark Results Data Table -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
      <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
        <CheckCircle2 class="w-5 h-5 text-emerald-600" />
        Full Benchmark Log Table
      </h3>

      <div class="overflow-x-auto border border-slate-200 rounded-xl">
        <table class="w-full text-left text-xs text-slate-700 font-mono">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th class="p-3">Framework</th>
              <th class="p-3">Operation</th>
              <th class="p-3">Item Count</th>
              <th class="p-3">Time (ms)</th>
              <th class="p-3">DOM Operations</th>
              <th class="p-3">Est. Memory (KB)</th>
              <th class="p-3">FPS Score</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <template v-if="benchmarkResults.length === 0">
              <tr>
                <td colSpan="7" class="p-6 text-center text-slate-400 font-sans">
                  Run the benchmark suite above to populate performance metrics table.
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="res in benchmarkResults" :key="res.id" class="hover:bg-slate-50 transition-colors">
                <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
                  <span :class="['w-2 h-2 rounded-full', FRAMEWORKS[res.framework].borderAccent.replace('border-', 'bg-')]" />
                  {{ FRAMEWORKS[res.framework].name }}
                </td>
                <td class="p-3 text-slate-700">{{ BENCHMARK_OPERATIONS.find((o) => o.id === res.op)?.name || res.op }}</td>
                <td class="p-3 text-slate-500">{{ res.itemCount.toLocaleString() }}</td>
                <td class="p-3 font-semibold text-emerald-600">{{ res.durationMs }} ms</td>
                <td class="p-3 text-sky-600">{{ res.domMutations.toLocaleString() }}</td>
                <td class="p-3 text-amber-600">{{ res.memoryEstKb.toLocaleString() }} KB</td>
                <td class="p-3 text-purple-600">{{ res.fps }} FPS</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Chrome DevTools & Measurement Guide -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono text-xs font-semibold">
          DevTools & Profiling Guide
        </span>
        <h3 class="text-lg font-bold text-slate-900">How to Measure with External Tools</h3>
      </div>
      <p class="text-xs text-slate-600 leading-relaxed">
        You can verify and cross-examine these benchmark scores using native Chrome DevTools or third-party profiling libraries:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 class="font-bold text-slate-900 font-sans">1. Chrome DevTools Performance Panel</h4>
          <ul class="space-y-1.5 text-slate-600 list-disc pl-4">
            <li>Press <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-900">F12</code> or <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-900">Cmd+Option+I</code> and navigate to <strong>Performance</strong>.</li>
            <li>Click <strong>Record (Cmd+E)</strong> before triggering a benchmark operation (e.g. Initial Render 1,000 tasks).</li>
            <li>Inspect <strong>Scripting</strong> vs <strong>Rendering</strong> vs <strong>Painting</strong> breakdowns in the flamechart.</li>
            <li>Observe recalculate style & layout reflow durations.</li>
          </ul>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 class="font-bold text-slate-900 font-sans">2. User Timing API & Memory Inspector</h4>
          <ul class="space-y-1.5 text-slate-600 list-disc pl-4">
            <li>Use <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-900">performance.mark('op-start')</code> & <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-900">performance.measure()</code> for sub-millisecond accuracy.</li>
            <li>Inspect Chrome <strong>Memory</strong> tab -&gt; <strong>Take Heap Snapshot</strong> before and after rendering 1,000 tasks to calculate exact heap memory delta (KB).</li>
            <li>Use <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-900">MutationObserver</code> to audit real-time DOM element node insertions/removals.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
