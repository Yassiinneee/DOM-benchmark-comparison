<script lang="ts">
  import { onMount } from 'svelte';
  import type { FrameworkId, Task, BenchmarkOp, BenchmarkResult } from '../types';
  import { FRAMEWORKS } from '../data/frameworksData';
  import { runFrameworkBenchmark, generateTasks } from '../services/domBenchmarkEngine';

  export let itemCount: number = 1000;
  export let onRecordResult: (result: BenchmarkResult) => void;

  let isRunning = false;
  let frameworkStates: Record<FrameworkId, {
    tasks: Task[];
    lastDurationMs: number | null;
    lastMutations: number | null;
  }> = {
    react: { tasks: [], lastDurationMs: null, lastMutations: null },
    angular: { tasks: [], lastDurationMs: null, lastMutations: null },
    vue: { tasks: [], lastDurationMs: null, lastMutations: null },
    svelte: { tasks: [], lastDurationMs: null, lastMutations: null }
  };

  const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];

  onMount(() => {
    frameworks.forEach(fw => {
      frameworkStates[fw].tasks = generateTasks(10, FRAMEWORKS[fw].name);
    });
  });

  async function executeSyncOp(op: BenchmarkOp) {
    if (isRunning) return;
    isRunning = true;

    for (const fw of frameworks) {
      const container = document.getElementById(`sandbox-quadrant-${fw}`);
      if (container) {
        try {
          const { result, updatedTasks } = await runFrameworkBenchmark(
            fw,
            op,
            container,
            frameworkStates[fw].tasks,
            itemCount
          );

          frameworkStates[fw].tasks = updatedTasks;
          frameworkStates[fw].lastDurationMs = result.durationMs;
          frameworkStates[fw].lastMutations = result.domMutations;
          onRecordResult(result);
        } catch (err) {
          console.error(`Sandbox sync error for ${fw}:`, err);
        }
      }
    }

    isRunning = false;
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Controls Panel -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">4-Way Synchronized Split Sandbox</h2>
        <p class="text-xs text-slate-500">
          Executes identical DOM mutations simultaneously across React, Angular, Vue 3, and Svelte in real-time.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          on:click={() => executeSyncOp('initialRender100')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Sync 100
        </button>
        <button
          on:click={() => executeSyncOp('initialRender500')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Sync 500
        </button>
        <button
          on:click={() => executeSyncOp('initialRender1000')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Sync 1,000
        </button>
        <button
          on:click={() => executeSyncOp('update50')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Update 50
        </button>
        <button
          on:click={() => executeSyncOp('delete50')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Delete 50
        </button>
        <button
          on:click={() => executeSyncOp('clearAll')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Clear
        </button>
      </div>
    </div>
  </div>

  <!-- 2x2 Quadrant Grid Viewport -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each frameworks as fw}
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full {fw === 'react' ? 'bg-sky-500' : fw === 'angular' ? 'bg-rose-500' : fw === 'vue' ? 'bg-emerald-500' : 'bg-orange-500'}"></span>
            <h3 class="text-base font-bold text-slate-900">{FRAMEWORKS[fw].name}</h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              v{FRAMEWORKS[fw].version}
            </span>
          </div>

          <div class="flex items-center gap-3 text-xs font-mono">
            {#if frameworkStates[fw].lastDurationMs !== null}
              <span class="text-emerald-600 font-bold">{frameworkStates[fw].lastDurationMs} ms</span>
            {/if}
            <span class="text-slate-500">{frameworkStates[fw].tasks.length} items</span>
          </div>
        </div>

        <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 min-h-56 max-h-72 overflow-y-auto custom-scrollbar">
          <div id="sandbox-quadrant-{fw}">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
