<script lang="ts">
  import { onMount } from 'svelte';
  import type { FrameworkId, Task, BenchmarkOp, BenchmarkResult } from '../types';
  import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
  import { runFrameworkBenchmark, generateTasks } from '../services/domBenchmarkEngine';

  export let itemCount: number = 1000;
  export let onRecordResult: (result: BenchmarkResult) => void;

  let selectedFramework: FrameworkId = 'svelte';
  let activeSnippetKey: 'todoComponent' | 'templateView' | 'stateAndOperations' | 'domOptimization' = 'todoComponent';

  let currentTasks: Task[] = [];
  let isRunning = false;
  let latestResult: BenchmarkResult | null = null;
  let sandboxContainer: HTMLElement | null = null;

  $: fwInfo = FRAMEWORKS[selectedFramework];

  function switchFramework(id: FrameworkId) {
    selectedFramework = id;
    currentTasks = generateTasks(10, FRAMEWORKS[id].name);
    latestResult = null;
    if (sandboxContainer) {
      sandboxContainer.innerHTML = '';
    }
  }

  onMount(() => {
    currentTasks = generateTasks(10, FRAMEWORKS[selectedFramework].name);
  });

  async function handleExecuteOp(op: BenchmarkOp) {
    if (isRunning) return;
    isRunning = true;

    if (!sandboxContainer) {
      sandboxContainer = document.getElementById('workbench-sandbox-viewport');
    }

    if (sandboxContainer) {
      try {
        const { result, updatedTasks } = await runFrameworkBenchmark(
          selectedFramework,
          op,
          sandboxContainer,
          currentTasks,
          itemCount
        );

        latestResult = result;
        currentTasks = updatedTasks;
        onRecordResult(result);
      } catch (err) {
        console.error('Error running workbench benchmark:', err);
      } finally {
        isRunning = false;
      }
    } else {
      isRunning = false;
    }
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Framework Selection Pills -->
  <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <span class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Select Engine:</span>
      <div class="flex flex-wrap gap-2">
        {#each ['react', 'angular', 'vue', 'svelte'] as id}
          <button
            on:click={() => switchFramework(id)}
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border {selectedFramework === id ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}"
          >
            <span>{FRAMEWORKS[id].name}</span>
            <span class="text-[10px] opacity-70">v{FRAMEWORKS[id].version}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="flex items-center gap-2 text-xs font-mono text-slate-500">
      <span>Strategy:</span>
      <span class="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
        {fwInfo.domStrategy}
      </span>
    </div>
  </div>

  <!-- Deep Dive Framework Info Card -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div class="flex items-center gap-3">
        <div class="p-3 rounded-2xl bg-slate-100 border border-slate-200">
          {@html fwInfo.logoSvg}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-bold text-slate-900">{fwInfo.name}</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono {fwInfo.badgeBg} {fwInfo.badgeText}">
              {fwInfo.architecture}
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">{fwInfo.tagline}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
          <div class="text-[10px] text-slate-500 uppercase font-mono">DOM Manipulation</div>
          <div class="text-xs font-bold text-slate-900">{fwInfo.domStrategy}</div>
        </div>
      </div>
    </div>

    <p class="text-xs text-slate-600 leading-relaxed">{fwInfo.description}</p>

    <!-- Pros and Cons Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-2">
        <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-800 font-mono">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Architecture Advantages
        </div>
        <ul class="text-xs text-emerald-900 space-y-1 list-disc pl-4">
          {#each fwInfo.pros as pro}
            <li>{pro}</li>
          {/each}
        </ul>
      </div>

      <div class="p-4 bg-rose-50/60 border border-rose-100 rounded-xl space-y-2">
        <div class="flex items-center gap-1.5 text-xs font-bold text-rose-800 font-mono">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Trade-offs & Overheads
        </div>
        <ul class="text-xs text-rose-900 space-y-1 list-disc pl-4">
          {#each fwInfo.cons as con}
            <li>{con}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- Code Snippets Inspection Section -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Code Architecture Inspection</h3>
        <p class="text-xs text-slate-500">Examine how {fwInfo.name} handles DOM rendering and reactive state updates.</p>
      </div>

      <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
        <button
          on:click={() => activeSnippetKey = 'todoComponent'}
          class="px-3 py-1.5 rounded-lg transition-all {activeSnippetKey === 'todoComponent' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'}"
        >
          Component
        </button>
        <button
          on:click={() => activeSnippetKey = 'templateView'}
          class="px-3 py-1.5 rounded-lg transition-all {activeSnippetKey === 'templateView' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'}"
        >
          Template
        </button>
        <button
          on:click={() => activeSnippetKey = 'stateAndOperations'}
          class="px-3 py-1.5 rounded-lg transition-all {activeSnippetKey === 'stateAndOperations' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'}"
        >
          Reactivity
        </button>
        <button
          on:click={() => activeSnippetKey = 'domOptimization'}
          class="px-3 py-1.5 rounded-lg transition-all {activeSnippetKey === 'domOptimization' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'}"
        >
          Optimization
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between text-xs font-mono text-slate-500">
        <span class="font-bold text-slate-700">{fwInfo.codeSnippets[activeSnippetKey].title}</span>
        <span>{fwInfo.codeSnippets[activeSnippetKey].language}</span>
      </div>
      <pre class="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed custom-scrollbar">{fwInfo.codeSnippets[activeSnippetKey].code}</pre>
      <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <strong class="text-slate-900 font-mono">Mechanism Note:</strong> {fwInfo.codeSnippets[activeSnippetKey].explanation}
      </p>
    </div>
  </div>

  <!-- Live Sandbox Viewport & Controls -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-semibold">
            Isolated Sandbox
          </span>
          <h3 class="text-lg font-bold text-slate-900">Live {fwInfo.name} Render Execution Viewport</h3>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">Trigger DOM operations directly in this isolated container.</p>
      </div>

      <!-- Operational Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          on:click={() => handleExecuteOp('initialRender100')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Render 100
        </button>
        <button
          on:click={() => handleExecuteOp('initialRender500')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Render 500
        </button>
        <button
          on:click={() => handleExecuteOp('initialRender1000')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Render 1,000
        </button>
        <button
          on:click={() => handleExecuteOp('update50')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Update 50
        </button>
        <button
          on:click={() => handleExecuteOp('delete50')}
          disabled={isRunning}
          class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Delete 50
        </button>
      </div>
    </div>

    <!-- Live Metrics Log -->
    {#if latestResult}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900 text-white font-mono text-xs">
        <div>
          <span class="text-slate-400 block text-[10px]">EXECUTION TIME</span>
          <span class="text-emerald-400 font-bold text-sm">{latestResult.durationMs} ms</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">DOM MUTATIONS</span>
          <span class="text-sky-400 font-bold text-sm">{latestResult.domMutations.toLocaleString()} ops</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">EST. MEMORY FOOTPRINT</span>
          <span class="text-amber-400 font-bold text-sm">{latestResult.memoryEstKb.toLocaleString()} KB</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">FPS THROUGHPUT</span>
          <span class="text-purple-400 font-bold text-sm">{latestResult.fps} FPS</span>
        </div>
      </div>
    {/if}

    <!-- Live Rendered Container -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-mono text-slate-500">
        <span>Active Render Container (#workbench-sandbox-viewport)</span>
        <span>{currentTasks.length} Task Node Elements</span>
      </div>
      <div class="min-h-64 max-h-96 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200 custom-scrollbar">
        <div id="workbench-sandbox-viewport" bind:this={sandboxContainer}>
          <!-- Rendered dynamically by domBenchmarkEngine -->
        </div>
      </div>
    </div>
  </div>
</div>
