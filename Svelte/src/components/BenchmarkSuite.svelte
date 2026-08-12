<script lang="ts">
  import type { BenchmarkOp, BenchmarkResult, FrameworkId } from '../types';
  import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
  import { runFrameworkBenchmark, generateTasks } from '../services/domBenchmarkEngine';

  export let itemCount: number = 1000;
  export let benchmarkResults: BenchmarkResult[] = [];
  export let onRecordResults: (results: BenchmarkResult[]) => void;

  let selectedOp: BenchmarkOp = 'initialRender1000';
  let isRunning = false;
  let progressText = '';

  async function runSuiteForOp() {
    if (isRunning) return;
    isRunning = true;

    const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];
    const newResults: BenchmarkResult[] = [];

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '-9999px';
    document.body.appendChild(hiddenContainer);

    try {
      for (let i = 0; i < frameworks.length; i++) {
        const fw = frameworks[i];
        progressText = `Running ${BENCHMARK_OPERATIONS.find(o => o.id === selectedOp)?.name || selectedOp} on ${FRAMEWORKS[fw].name}...`;
        
        // Brief pause to allow UI update
        await new Promise(r => setTimeout(r, 50));

        let tasks = generateTasks(selectedOp === 'update50' || selectedOp === 'delete50' ? itemCount : 10, FRAMEWORKS[fw].name);
        const { result } = await runFrameworkBenchmark(fw, selectedOp, hiddenContainer, tasks, itemCount);
        newResults.push(result);
      }

      onRecordResults(newResults);
    } catch (err) {
      console.error('Benchmark suite error:', err);
    } finally {
      if (document.body.contains(hiddenContainer)) {
        document.body.removeChild(hiddenContainer);
      }
      isRunning = false;
      progressText = '';
    }
  }

  $: filteredResults = benchmarkResults.filter(r => r.op === selectedOp);
  $: minDuration = filteredResults.length > 0 ? Math.min(...filteredResults.map(r => r.durationMs)) : 1;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Operation Selector Panel -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Automated Benchmark Operations</h2>
        <p class="text-xs text-slate-500">Select a DOM operation to run standardized performance benchmarks across all frameworks.</p>
      </div>

      <button
        on:click={runSuiteForOp}
        disabled={isRunning}
        class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95 disabled:opacity-50"
      >
        {#if isRunning}
          <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {progressText || 'Executing Benchmark...'}
        {:else}
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Run Suite Across All 4 Engines
        {/if}
      </button>
    </div>

    <!-- Benchmark Operations Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {#each BENCHMARK_OPERATIONS as op}
        <button
          on:click={() => selectedOp = op.id}
          class="p-4 rounded-xl border text-left transition-all space-y-2 {selectedOp === op.id ? 'border-orange-500 bg-orange-50/50 shadow-xs' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'}"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-900">{op.name}</span>
            <span class="p-1 rounded-lg bg-white border border-slate-200 text-slate-600">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
          </div>
          <p class="text-[11px] text-slate-500 leading-tight">{op.description}</p>
        </button>
      {/each}
    </div>
  </div>

  <!-- Performance Comparison Visualization Bar Chart -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Execution Speed Comparison</h3>
        <p class="text-xs text-slate-500">Duration in milliseconds (Lower is faster)</p>
      </div>

      <div class="text-xs font-mono text-slate-500">
        Selected Op: <span class="font-bold text-slate-900">{BENCHMARK_OPERATIONS.find(o => o.id === selectedOp)?.name}</span>
      </div>
    </div>

    <div class="space-y-4">
      {#each ['react', 'angular', 'vue', 'svelte'] as fwId}
        {@const res = filteredResults.find(r => r.framework === fwId)}
        {@const duration = res ? res.durationMs : 0}
        {@const maxDur = filteredResults.length > 0 ? Math.max(...filteredResults.map(r => r.durationMs), 1) : 100}
        {@const pct = res ? Math.max(8, Math.min(100, (duration / maxDur) * 100)) : 0}

        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-900 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full {fwId === 'react' ? 'bg-sky-500' : fwId === 'angular' ? 'bg-rose-500' : fwId === 'vue' ? 'bg-emerald-500' : 'bg-orange-500'}"></span>
              {FRAMEWORKS[fwId].name}
            </span>
            <span class="font-mono text-slate-600 font-semibold">
              {#if res}
                {res.durationMs} ms
              {:else}
                Not Run
              {/if}
            </span>
          </div>

          <div class="w-full bg-slate-100 h-7 rounded-xl overflow-hidden p-1 flex items-center">
            {#if res}
              <div
                class="h-full rounded-lg transition-all duration-500 flex items-center px-3 text-[10px] font-mono font-bold text-white shadow-xs {fwId === 'react' ? 'bg-sky-500' : fwId === 'angular' ? 'bg-rose-500' : fwId === 'vue' ? 'bg-emerald-500' : 'bg-orange-500'}"
                style="width: {pct}%;"
              >
                {res.durationMs}ms
              </div>
            {:else}
              <div class="text-[10px] text-slate-400 font-mono px-3">No data</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Detailed Results Table -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <h3 class="text-lg font-bold text-slate-900">Recorded Metric Logs</h3>
      <span class="text-xs font-mono text-slate-500">{benchmarkResults.length} Total Test Records</span>
    </div>

    {#if benchmarkResults.length === 0}
      <div class="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs font-mono">
        No benchmark runs recorded yet. Click "Run Suite Across All 4 Engines" above to begin.
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th class="p-3">Engine</th>
              <th class="p-3">Operation</th>
              <th class="p-3">Batch Target</th>
              <th class="p-3">Duration (ms)</th>
              <th class="p-3">DOM Mutations</th>
              <th class="p-3">Est Memory (KB)</th>
              <th class="p-3">FPS</th>
              <th class="p-3">Relative</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {#each benchmarkResults as r}
              {@const isFastest = minDuration > 0 && r.durationMs === minDuration}
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full {r.framework === 'react' ? 'bg-sky-500' : r.framework === 'angular' ? 'bg-rose-500' : r.framework === 'vue' ? 'bg-emerald-500' : 'bg-orange-500'}"></span>
                  {FRAMEWORKS[r.framework].name}
                </td>
                <td class="p-3 text-slate-600">{r.op}</td>
                <td class="p-3 text-slate-600">{r.itemCount.toLocaleString()}</td>
                <td class="p-3 font-bold {isFastest ? 'text-emerald-600 font-extrabold' : 'text-slate-900'}">
                  {r.durationMs} ms
                </td>
                <td class="p-3 text-slate-600">{r.domMutations.toLocaleString()}</td>
                <td class="p-3 text-slate-600">{r.memoryEstKb.toLocaleString()} KB</td>
                <td class="p-3 text-slate-600">{r.fps} FPS</td>
                <td class="p-3">
                  {#if isFastest}
                    <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Fastest</span>
                  {:else}
                    <span class="text-slate-500 text-[10px]">
                      +{(r.durationMs - minDuration).toFixed(0)}ms
                    </span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
