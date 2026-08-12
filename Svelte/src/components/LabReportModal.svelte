<script lang="ts">
  import type { BenchmarkResult } from '../types';
  import { FRAMEWORKS } from '../data/frameworksData';

  export let isOpen: boolean = false;
  export let benchmarkResults: BenchmarkResult[] = [];
  export let onClose: () => void;

  let copied = false;

  function generateSummaryText(): string {
    const totalTests = benchmarkResults.length;
    let fastText = '';
    if (totalTests > 0) {
      const grouped: Record<string, number[]> = {};
      benchmarkResults.forEach(r => {
        if (!grouped[r.framework]) grouped[r.framework] = [];
        grouped[r.framework].push(r.durationMs);
      });
      
      const averages = Object.entries(grouped).map(([fw, durs]) => ({
        fw,
        avg: durs.reduce((a, b) => a + b, 0) / durs.length
      })).sort((a, b) => a.avg - b.avg);

      fastText = averages.map(a => `${FRAMEWORKS[a.fw].name}: avg ${a.avg.toFixed(1)}ms`).join(', ');
    } else {
      fastText = 'No benchmark runs logged in session yet.';
    }

    return `=== DOM BENCHMARK LAB REPORT ===
Timestamp: ${new Date().toISOString()}
Target Environment: Modern Web Browser (Svelte 5 Engine)
Total Executed Runs: ${totalTests}

SUMMARY PERFORMANCE:
${fastText}

ARCHITECTURAL RECOMMENDATIONS:
- High-Frequency Data Streams / Dashboards: Prefer Svelte or Vue 3 fine-grained reactivity.
- Enterprise Scale & Strict Architecture: Prefer Angular with Signals & Standalone Components.
- Large Component Ecosystem & Team Familiarity: Prefer React with Fiber Virtual DOM.
- Minimal Bundle & Direct DOM Mutations: Prefer Svelte compiled JS output.
`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateSummaryText());
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-orange-100 text-orange-700">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900">Lab Deliverables & Performance Summary</h2>
            <p class="text-xs text-slate-500">Automated DOM execution analytics and architectural analysis report.</p>
          </div>
        </div>

        <button
          on:click={onClose}
          class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Generated Executive Summary</span>
          <button
            on:click={handleCopy}
            class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all flex items-center gap-1.5"
          >
            {#if copied}
              ✓ Copied
            {:else}
              Copy Summary
            {/if}
          </button>
        </div>

        <pre class="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 custom-scrollbar">{generateSummaryText()}</pre>
      </div>

      <div class="flex justify-end pt-2 border-t border-slate-100">
        <button
          on:click={onClose}
          class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
        >
          Close Modal
        </button>
      </div>
    </div>
  </div>
{/if}
