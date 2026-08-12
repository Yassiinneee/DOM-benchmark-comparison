<script lang="ts">
  import Header from './components/Header.svelte';
  import FrameworkWorkbench from './components/FrameworkWorkbench.svelte';
  import BenchmarkSuite from './components/BenchmarkSuite.svelte';
  import InteractiveSandbox from './components/InteractiveSandbox.svelte';
  import ArchitectureComparison from './components/ArchitectureComparison.svelte';
  import LabReportModal from './components/LabReportModal.svelte';

  import type { BenchmarkResult, BenchmarkOp, FrameworkId } from './types';
  import { FRAMEWORKS, BENCHMARK_OPERATIONS } from './data/frameworksData';
  import { runFrameworkBenchmark, generateTasks } from './services/domBenchmarkEngine';

  let activeTab: 'workbench' | 'suite' | 'sandbox' | 'architecture' = 'workbench';
  let itemCount = 1000;
  let benchmarkResults: BenchmarkResult[] = [];
  let isModalOpen = false;
  let isBenchmarking = false;

  function handleRecordResult(result: BenchmarkResult) {
    benchmarkResults = [result, ...benchmarkResults.slice(0, 49)];
  }

  function handleRecordResults(results: BenchmarkResult[]) {
    benchmarkResults = [...results, ...benchmarkResults.slice(0, 50 - results.length)];
  }

  async function handleRunFullSuite() {
    if (isBenchmarking) return;
    isBenchmarking = true;
    activeTab = 'suite';

    const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];
    const opsToRun: BenchmarkOp[] = ['initialRender1000', 'update50', 'delete50', 'swapRows', 'clearAll'];
    const newResults: BenchmarkResult[] = [];

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '-9999px';
    document.body.appendChild(hiddenContainer);

    try {
      for (const op of opsToRun) {
        for (const fw of frameworks) {
          await new Promise(r => setTimeout(r, 20));
          let tasks = generateTasks(op === 'update50' || op === 'delete50' ? itemCount : 10, FRAMEWORKS[fw].name);
          const { result } = await runFrameworkBenchmark(fw, op, hiddenContainer, tasks, itemCount);
          newResults.push(result);
        }
      }

      handleRecordResults(newResults);
    } catch (err) {
      console.error('Error running full suite:', err);
    } finally {
      if (document.body.contains(hiddenContainer)) {
        document.body.removeChild(hiddenContainer);
      }
      isBenchmarking = false;
    }
  }
</script>

<div class="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col justify-between">
  <div>
    <!-- Main Header -->
    <Header
      {activeTab}
      {itemCount}
      {isBenchmarking}
      onRunFullSuite={handleRunFullSuite}
      onOpenModal={() => isModalOpen = true}
      onSelectTab={(tab) => activeTab = tab}
      onSelectCount={(count) => itemCount = count}
    />

    <!-- Active View Content -->
    <main class="animate-in fade-in duration-200">
      {#if activeTab === 'workbench'}
        <FrameworkWorkbench
          {itemCount}
          onRecordResult={handleRecordResult}
        />
      {:else if activeTab === 'suite'}
        <BenchmarkSuite
          {itemCount}
          {benchmarkResults}
          onRecordResults={handleRecordResults}
        />
      {:else if activeTab === 'sandbox'}
        <InteractiveSandbox
          {itemCount}
          onRecordResult={handleRecordResult}
        />
      {:else if activeTab === 'architecture'}
        <ArchitectureComparison />
      {/if}
    </main>
  </div>

  <!-- Lab Deliverable Export Modal -->
  <LabReportModal
    isOpen={isModalOpen}
    {benchmarkResults}
    onClose={() => isModalOpen = false}
  />

  <!-- Footer -->
  <footer class="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 font-mono">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>DOM Benchmark Engine (Svelte Edition)</span>
      </div>
      <div>
        Comparing Fiber Virtual DOM, Angular Signals, Vue 3 Proxy Reactivity, and Svelte Compiled DOM Operations.
      </div>
    </div>
  </footer>
</div>
