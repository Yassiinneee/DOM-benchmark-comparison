<script setup lang="ts">
import { ref, computed } from 'vue';
import { BenchmarkResult } from '../types';
import { X, FileText, Download, Copy, Check, User, GraduationCap, Calendar } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  benchmarkResults: BenchmarkResult[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const studentName = ref('Alex Morgan');
const studentId = ref('CS-2026-8942');
const courseName = ref('CS480: Advanced Front-End Web Architecture');
const copied = ref(false);

const markdownReport = computed(() => {
  const now = new Date().toLocaleDateString();
  let text = `# DOM Benchmark & Performance Analysis Lab Report
**Student Name:** ${studentName.value || 'N/A'}
**Student ID:** ${studentId.value || 'N/A'}
**Course:** ${courseName.value || 'N/A'}
**Date Generated:** ${now}

---

## 1. Executive Summary
This lab evaluates DOM manipulation efficiency across React, Angular, Vue 3, and Svelte under heavy structural mutations.

## 2. Benchmark Measurement Matrix
| Framework | Operation | Task Count | Execution Time (ms) | DOM Mutations | Memory Est (KB) |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

  if (props.benchmarkResults.length === 0) {
    text += `| No benchmark data available. Execute the test suite to populate measurements. |\n`;
  } else {
    props.benchmarkResults.forEach((res) => {
      text += `| **${res.framework.toUpperCase()}** | ${res.op} | ${res.itemCount} | ${res.durationMs} ms | ${res.domMutations} ops | ${res.memoryEstKb} KB |\n`;
    });
  }

  text += `
---

## 3. Framework Architectural Findings

### React (Fiber & Virtual DOM Reconciliation)
- Uses Virtual DOM diffing algorithm to calculate minimal patches.
- Incurred higher garbage collection pressure during large initial batch allocations.

### Angular (Ivy Engine & Signals)
- Uses compiled incremental DOM instructions with tracking keys.
- Shows predictable rendering times, but has higher initial memory overhead due to LView tree metadata.

### Vue 3 (Reactive Proxies & Compiler Block Tree)
- Leverages dynamic slot flags in its Block Tree to skip static elements.
- Demonstrates fast patching performance for granular mutations.

### Svelte (Compiled Imperative DOM)
- Compiles components into direct imperative DOM manipulation code without a Virtual DOM layer.
- Achieved the lowest execution latency and smallest memory footprint across initial mounts and updates.

---

## 4. Student Reflection & Conclusion
Based on empirical DOM mutation tracking and browser paint cycle profiling, Svelte and Vue 3 demonstrate optimal performance for high-frequency DOM list re-renderings due to direct reactive bindings and compiler optimization.
`;

  return text;
});

function handleCopyMarkdown() {
  navigator.clipboard.writeText(markdownReport.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function handleDownloadJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.benchmarkResults, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `dom_benchmark_report_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200 shadow-xs">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">Student Lab Report & Export</h2>
            <p class="text-xs text-slate-500">Generate formatted coursework report & export benchmark logs</p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6 flex-1">
        <!-- Student Information Input Card -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div class="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
            Student & Coursework Identifiers
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <User class="w-3 h-3 text-slate-400" />
                Student Name
              </label>
              <input
                v-model="studentName"
                type="text"
                class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <GraduationCap class="w-3 h-3 text-slate-400" />
                Student ID
              </label>
              <input
                v-model="studentId"
                type="text"
                class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Student ID"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar class="w-3 h-3 text-slate-400" />
                Course Title
              </label>
              <input
                v-model="courseName"
                type="text"
                class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Course Title"
              />
            </div>
          </div>
        </div>

        <!-- Markdown Live Preview -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
              Generated Report Preview (Markdown)
            </span>
            <span class="text-xs text-slate-500 font-mono">
              {{ benchmarkResults.length }} Benchmark Records Logged
            </span>
          </div>
          <pre class="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-72 whitespace-pre-wrap border border-slate-800 shadow-inner leading-relaxed">{{ markdownReport }}</pre>
        </div>
      </div>

      <!-- Modal Footer & Action Buttons -->
      <div class="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div class="text-[11px] text-slate-500 font-mono">
          Ready to attach to coursework submission
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <a
            href="/Benchmark.txt"
            download="Benchmark.txt"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Download class="w-3.5 h-3.5 text-sky-600" />
            Download Benchmark.txt
          </a>
          <a
            href="/Reflection.md"
            download="Reflection.md"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Download class="w-3.5 h-3.5 text-indigo-600" />
            Download Reflection.md
          </a>
          <button
            @click="handleDownloadJson"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Download class="w-3.5 h-3.5" />
            JSON Data
          </button>
          <button
            @click="handleCopyMarkdown"
            class="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-300" />
            <Copy v-else class="w-3.5 h-3.5" />
            {{ copied ? 'Copied!' : 'Copy Markdown' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
