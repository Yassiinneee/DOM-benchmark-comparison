<script setup lang="ts">
import { ref } from 'vue';
import { BenchmarkResult } from './types';
import Header from './components/Header.vue';
import FrameworkWorkbench from './components/FrameworkWorkbench.vue';
import BenchmarkSuite from './components/BenchmarkSuite.vue';
import InteractiveSandbox from './components/InteractiveSandbox.vue';
import ArchitectureComparison from './components/ArchitectureComparison.vue';
import LabReportModal from './components/LabReportModal.vue';
import { runFrameworkBenchmark } from './services/domBenchmarkEngine';
import { BENCHMARK_OPERATIONS } from './data/frameworksData';

const activeTab = ref<'workbench' | 'suite' | 'sandbox' | 'architecture'>('workbench');
const itemCount = ref<number>(1000);
const benchmarkResults = ref<BenchmarkResult[]>([]);
const isLabReportOpen = ref(false);
const isBenchmarkingSuite = ref(false);

function handleRecordResult(result: BenchmarkResult) {
  benchmarkResults.value = [...benchmarkResults.value, result];
}

function handleClearResults() {
  benchmarkResults.value = [];
}

async function handleRunSuite() {
  if (isBenchmarkingSuite.value) return;
  isBenchmarkingSuite.value = true;
  activeTab.value = 'suite';

  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'absolute';
  hiddenContainer.style.left = '-9999px';
  hiddenContainer.style.top = '-9999px';
  document.body.appendChild(hiddenContainer);

  const frameworks = ['react', 'angular', 'vue', 'svelte'] as const;

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
          itemCount.value
        );

        handleRecordResult(result);
        hiddenContainer.removeChild(sandbox);
      }
    }
  } catch (err) {
    console.error('Suite error:', err);
  } finally {
    document.body.removeChild(hiddenContainer);
    isBenchmarkingSuite.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
    <!-- Main Header -->
    <Header
      v-model:activeTab="activeTab"
      v-model:itemCount="itemCount"
      :isBenchmarking="isBenchmarkingSuite"
      @runSuite="handleRunSuite"
      @openLabReport="isLabReportOpen = true"
    />

    <!-- Tab View Router -->
    <main class="flex-1">
      <FrameworkWorkbench
        v-if="activeTab === 'workbench'"
        :itemCount="itemCount"
        @recordResult="handleRecordResult"
      />

      <BenchmarkSuite
        v-else-if="activeTab === 'suite'"
        :itemCount="itemCount"
        :benchmarkResults="benchmarkResults"
        @recordResult="handleRecordResult"
        @clearResults="handleClearResults"
      />

      <InteractiveSandbox
        v-else-if="activeTab === 'sandbox'"
        :itemCount="itemCount"
        @recordResult="handleRecordResult"
      />

      <ArchitectureComparison
        v-else-if="activeTab === 'architecture'"
      />
    </main>

    <!-- Lab Report Export Modal -->
    <LabReportModal
      :isOpen="isLabReportOpen"
      :benchmarkResults="benchmarkResults"
      @close="isLabReportOpen = false"
    />

    <!-- Global Footer -->
    <footer class="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          DOM Benchmark Engine Active • High Precision Performance Observer
        </div>
        <div>
          React • Angular • Vue 3 • Svelte Performance Analysis
        </div>
      </div>
    </footer>
  </div>
</template>
