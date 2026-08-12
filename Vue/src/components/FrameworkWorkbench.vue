<script setup lang="ts">
import { ref, watch, onMounted, useTemplateRef } from 'vue';
import { FrameworkId, Task, Priority, BenchmarkResult, BenchmarkOp } from '../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
import { runFrameworkBenchmark, generateTasks } from '../services/domBenchmarkEngine';
import { Play, Plus, Edit3, ArrowRightLeft, Trash2, Code, CheckCircle2, Cpu, Zap, ArrowRight, ArrowLeft } from 'lucide-vue-next';

const props = defineProps<{
  itemCount: number;
}>();

const emit = defineEmits<{
  (e: 'recordResult', result: BenchmarkResult): void;
}>();

const selectedFramework = ref<FrameworkId>('vue');
const tasks = ref<Task[]>([]);
const taskName = ref('');
const taskPriority = ref<Priority>('Medium');
const lastMetric = ref<BenchmarkResult | null>(null);
const activeCodeTab = ref<'todoComponent' | 'templateView' | 'stateAndOperations' | 'domOptimization'>('todoComponent');
const isRunning = ref(false);

const containerEl = useTemplateRef<HTMLDivElement>('workbenchContainer');

const frameworkList: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];

const fwInfo = ref(FRAMEWORKS[selectedFramework.value]);

watch(selectedFramework, (newFw) => {
  fwInfo.value = FRAMEWORKS[newFw];
  tasks.value = generateTasks(50, newFw);
  lastMetric.value = null;
});

onMounted(() => {
  tasks.value = generateTasks(50, selectedFramework.value);
});

async function handleExecuteOp(op: BenchmarkOp) {
  if (!containerEl.value || isRunning.value) return;
  isRunning.value = true;

  try {
    const { result, updatedTasks } = await runFrameworkBenchmark(
      selectedFramework.value,
      op,
      containerEl.value,
      tasks.value,
      props.itemCount
    );

    tasks.value = updatedTasks;
    lastMetric.value = result;
    emit('recordResult', result);
  } catch (err) {
    console.error('Benchmark execution error:', err);
  } finally {
    isRunning.value = false;
  }
}

function handleManualAddTask(e: Event) {
  e.preventDefault();
  if (!taskName.value.trim()) return;

  const newTask: Task = {
    id: `${selectedFramework.value}-${Date.now()}`,
    name: taskName.value,
    priority: taskPriority.value,
    createdAt: Date.now(),
    completed: false,
  };

  tasks.value = [newTask, ...tasks.value];
  taskName.value = '';
}

function currentIdx() {
  return frameworkList.indexOf(selectedFramework.value);
}

function goToNextFw() {
  const idx = currentIdx();
  if (idx < frameworkList.length - 1) {
    selectedFramework.value = frameworkList[idx + 1];
  }
}

function goToPrevFw() {
  const idx = currentIdx();
  if (idx > 0) {
    selectedFramework.value = frameworkList[idx - 1];
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Framework Step Selector Header -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
              Step {{ currentIdx() + 1 }} of 4
            </span>
            <h2 class="text-2xl font-bold text-slate-900">Framework-by-Framework Deep Dive</h2>
          </div>
          <p class="text-sm text-slate-500 mt-1">
            Analyze how each JavaScript framework handles DOM manipulations, template binding, and state reconciliation.
          </p>
        </div>

        <!-- Framework Step Navigation -->
        <div class="flex items-center gap-2">
          <button
            @click="goToPrevFw"
            :disabled="currentIdx() === 0"
            :class="[
              'p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all',
              currentIdx() === 0
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
            ]"
          >
            <ArrowLeft class="w-4 h-4" />
            Previous
          </button>
          <button
            @click="goToNextFw"
            :disabled="currentIdx() === frameworkList.length - 1"
            :class="[
              'p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all',
              currentIdx() === frameworkList.length - 1
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-xs'
            ]"
          >
            Next Framework
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Framework Selector Tabs -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          v-for="fwId in frameworkList"
          :key="fwId"
          @click="selectedFramework = fwId"
          :class="[
            'p-4 rounded-xl border text-left transition-all relative overflow-hidden',
            selectedFramework === fwId
              ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600/30'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800">
              v{{ FRAMEWORKS[fwId].version }}
            </span>
            <CheckCircle2 v-if="selectedFramework === fwId" class="w-4 h-4 text-indigo-600" />
          </div>
          <div class="text-lg font-bold text-slate-900">{{ FRAMEWORKS[fwId].name }}</div>
          <div class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{{ FRAMEWORKS[fwId].architecture }}</div>
        </button>
      </div>
    </div>

    <!-- Current Framework Header Card -->
    <div class="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs relative overflow-hidden">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="space-y-2 max-w-3xl">
          <div class="flex items-center gap-3">
            <span class="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
              <div v-html="fwInfo.logoSvg"></div>
            </span>
            <div>
              <h3 class="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {{ fwInfo.name }}
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-800">
                  {{ fwInfo.architecture }}
                </span>
              </h3>
              <p class="text-sm text-slate-600 font-medium mt-0.5">{{ fwInfo.tagline }}</p>
            </div>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed pt-2">
            {{ fwInfo.description }}
          </p>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 w-full lg:w-80 font-mono">
          <div class="text-slate-700 font-bold border-b border-slate-200 pb-1.5 flex items-center justify-between">
            <span>DOM Strategy Overview</span>
            <Cpu class="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div class="text-slate-600 leading-relaxed text-[11px]">
            {{ fwInfo.domStrategy }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid: Interactive Sandbox + Code Inspector -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Interactive To-Do List Sandbox & Benchmarker (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap class="w-5 h-5 text-amber-500" />
                {{ fwInfo.name }} DOM Manipulation Sandbox
              </h4>
              <p class="text-xs text-slate-500">
                Execute DOM updates live on {{ tasks.length.toLocaleString() }} task items using {{ fwInfo.name }}'s core engine.
              </p>
            </div>
            <span class="text-xs font-mono px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
              Active Items: <strong class="text-slate-900">{{ tasks.length.toLocaleString() }}</strong>
            </span>
          </div>

          <!-- Manual Task Creator Form -->
          <form @submit="handleManualAddTask" class="flex flex-wrap sm:flex-nowrap gap-2">
            <input
              type="text"
              v-model="taskName"
              placeholder="Enter task name (e.g., Optimize VDOM tree)..."
              class="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-all"
            />
            <select
              v-model="taskPriority"
              class="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              <Plus class="w-4 h-4" />
              Add Task
            </button>
          </form>

          <!-- DOM Benchmark Trigger Buttons -->
          <div>
            <div class="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider font-mono">
              Execute DOM Benchmark Operations
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                @click="handleExecuteOp('initialRender100')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Play class="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Render 100</div>
                  <div class="text-[10px] text-slate-500">100 Initial Tasks</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('initialRender500')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Play class="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Render 500</div>
                  <div class="text-[10px] text-slate-500">500 Initial Tasks</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('initialRender1000')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Play class="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Render 1,000</div>
                  <div class="text-[10px] text-slate-500">1,000 Initial Tasks</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('update50')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Edit3 class="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Update 50 Tasks</div>
                  <div class="text-[10px] text-slate-500">In-Place Mutation</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('delete50')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Trash2 class="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Delete 50 Tasks</div>
                  <div class="text-[10px] text-slate-500">Remove from DOM</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('add1000')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Plus class="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Append Tasks</div>
                  <div class="text-[10px] text-slate-500">+1,000 Tasks</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('updateEvery10th')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Edit3 class="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Update 10th</div>
                  <div class="text-[10px] text-slate-500">Every 10th Row</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('swapRows')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <ArrowRightLeft class="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Swap Rows</div>
                  <div class="text-[10px] text-slate-500">#1 and #10</div>
                </div>
              </button>

              <button
                @click="handleExecuteOp('clearAll')"
                :disabled="isRunning"
                class="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
              >
                <Trash2 class="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
                <div>
                  <div class="font-semibold text-slate-900">Clear All</div>
                  <div class="text-[10px] text-slate-500">Empty DOM</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Performance Benchmark Results Indicator Panel -->
          <div v-if="lastMetric" class="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-3">
            <div class="flex items-center justify-between text-indigo-700 font-bold border-b border-slate-200 pb-2">
              <span class="flex items-center gap-2">
                <Cpu class="w-4 h-4 text-indigo-600" />
                Metric Log: {{ BENCHMARK_OPERATIONS.find(o => o.id === lastMetric.op)?.name }}
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Recorded {{ new Date(lastMetric.timestamp).toLocaleTimeString() }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div class="text-[10px] text-slate-500">Time Duration</div>
                <div class="text-base font-bold text-emerald-600 mt-0.5">
                  {{ lastMetric.durationMs }} <span class="text-xs font-normal">ms</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div class="text-[10px] text-slate-500">DOM Operations</div>
                <div class="text-base font-bold text-sky-600 mt-0.5">
                  {{ lastMetric.domMutations.toLocaleString() }} <span class="text-xs font-normal">ops</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div class="text-[10px] text-slate-500">Est. Memory</div>
                <div class="text-base font-bold text-amber-600 mt-0.5">
                  {{ lastMetric.memoryEstKb.toLocaleString() }} <span class="text-xs font-normal">KB</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div class="text-[10px] text-slate-500">Frame Budget Score</div>
                <div class="text-base font-bold text-purple-600 mt-0.5">
                  {{ lastMetric.fps }} <span class="text-xs font-normal">FPS</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Rendered DOM Sandbox Viewport -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Rendered DOM Viewport ({{ tasks.length }} elements)</span>
              <span>Container: #sandbox-{{ selectedFramework }}</span>
            </div>
            <div class="max-h-72 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200 custom-scrollbar">
              <div ref="workbenchContainer" :id="`sandbox-${selectedFramework}`">
                <!-- Managed dynamically by domBenchmarkEngine.ts -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Code Inspector & Implementation Details (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Code class="w-5 h-5 text-indigo-600" />
              {{ fwInfo.name }} Idiomatic Implementation
            </h4>
          </div>

          <!-- Code Snippet Tabs -->
          <div class="flex border-b border-slate-200 space-x-1 text-xs font-medium overflow-x-auto no-scrollbar">
            <button
              v-for="tab in [
                { id: 'todoComponent', label: 'Component & State' },
                { id: 'templateView', label: 'Template / JSX' },
                { id: 'stateAndOperations', label: 'DOM Operations' },
                { id: 'domOptimization', label: 'DOM Engine' },
              ]"
              :key="tab.id"
              @click="activeCodeTab = tab.id as any"
              :class="[
                'pb-2.5 px-3 border-b-2 whitespace-nowrap transition-all',
                activeCodeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Active Code Snippet View -->
          <div class="space-y-3">
            <div class="text-xs text-slate-700 font-semibold flex items-center justify-between">
              <span>{{ fwInfo.codeSnippets[activeCodeTab].title }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                {{ fwInfo.codeSnippets[activeCodeTab].language }}
              </span>
            </div>

            <pre class="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 custom-scrollbar max-h-96"><code>{{ fwInfo.codeSnippets[activeCodeTab].code }}</code></pre>

            <div class="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
              <strong class="text-indigo-700 block mb-1">Architectural Takeaway:</strong>
              {{ fwInfo.codeSnippets[activeCodeTab].explanation }}
            </div>
          </div>

          <!-- Key Mechanisms Breakdown -->
          <div class="pt-4 border-t border-slate-100 space-y-2">
            <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Key Architectural Features
            </h5>
            <div class="space-y-2">
              <div v-for="(km, idx) in fwInfo.keyMechanisms" :key="idx" class="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div class="font-semibold text-slate-900">{{ km.title }}</div>
                <div class="text-slate-600 text-[11px] mt-0.5">{{ km.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
