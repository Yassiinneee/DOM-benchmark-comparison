import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkId, BenchmarkResult, BenchmarkOp } from '../../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../../data/frameworksData';
import { runFrameworkBenchmark } from '../../services/domBenchmarkEngine';

@Component({
  selector: 'app-benchmark-suite',
  standalone: true,
  imports: [CommonModule],
  template: `
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
            (click)="clearResults.emit()"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Clear Data
          </button>

          <button
            (click)="handleRunFullSuite()"
            [disabled]="isBenchmarking"
            [class]="
              isBenchmarking
                ? 'px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            "
          >
            <ng-container *ngIf="isBenchmarking; else notRunning">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Benchmarking Framework Engines...
            </ng-container>
            <ng-template #notRunning>
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Run Standard Suite (100, 500, 1,000, Update 50, Delete 50)
            </ng-template>
          </button>
        </div>
      </div>

      <!-- Scenarios Breakdown -->
      <div class="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-xs font-bold">
              Core Operations
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
      <div *ngIf="getSortedWinners().length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          *ngFor="let winner of getSortedWinners().slice(0, 3); let idx = index"
          class="p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative overflow-hidden bg-white"
        >
          <div class="flex items-center justify-between">
            <span
              [class]="
                idx === 0
                  ? 'text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800'
                  : idx === 1
                  ? 'text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-800'
                  : 'text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50/60 text-amber-900'
              "
            >
              {{ idx === 0 ? '🥇 1st Place' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place' }}
            </span>
            <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <div class="text-xl font-bold text-slate-900">{{ winner.name }}</div>
          <div class="text-xs text-slate-500 font-mono">
            <ng-container [ngSwitch]="activeMetricChart">
              <span *ngSwitchCase="'durationMs'">{{ winner.durationMs }} ms Execution Duration</span>
              <span *ngSwitchCase="'domMutations'">{{ winner.domMutations.toLocaleString() }} DOM Operations</span>
              <span *ngSwitchCase="'memoryEstKb'">{{ winner.memoryEstKb.toLocaleString() }} KB Memory Footprint</span>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Main Benchmark Chart Section -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
              Comparative Performance Metrics Chart
            </h3>
            <p class="text-xs text-slate-500">
              Select operation and metric to compare DOM engine efficiency.
            </p>
          </div>

          <!-- Operation & Metric Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <select
              [value]="selectedOpFilter"
              (change)="selectedOpFilter = $any($event.target).value"
              class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-600 font-medium"
            >
              <option *ngFor="let op of benchmarkOperations" [value]="op.id">
                {{ op.name }}
              </option>
            </select>

            <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                (click)="activeMetricChart = 'durationMs'"
                [class]="
                  activeMetricChart === 'durationMs'
                    ? 'px-3 py-1 rounded-md transition-all bg-slate-900 text-white font-semibold'
                    : 'px-3 py-1 rounded-md transition-all text-slate-600 hover:text-slate-900'
                "
              >
                Time (ms)
              </button>
              <button
                (click)="activeMetricChart = 'domMutations'"
                [class]="
                  activeMetricChart === 'domMutations'
                    ? 'px-3 py-1 rounded-md transition-all bg-slate-900 text-white font-semibold'
                    : 'px-3 py-1 rounded-md transition-all text-slate-600 hover:text-slate-900'
                "
              >
                DOM Ops
              </button>
              <button
                (click)="activeMetricChart = 'memoryEstKb'"
                [class]="
                  activeMetricChart === 'memoryEstKb'
                    ? 'px-3 py-1 rounded-md transition-all bg-slate-900 text-white font-semibold'
                    : 'px-3 py-1 rounded-md transition-all text-slate-600 hover:text-slate-900'
                "
              >
                Memory (KB)
              </button>
            </div>
          </div>
        </div>

        <!-- Custom SVG / CSS Bar Chart in Angular -->
        <div class="min-h-64 w-full pt-4">
          <div *ngIf="benchmarkResults.length === 0" class="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
            <svg class="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <p class="text-sm">No benchmark data recorded yet.</p>
            <button
              (click)="handleRunFullSuite()"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs"
            >
              Run First Benchmark Pass
            </button>
          </div>

          <div *ngIf="benchmarkResults.length > 0" class="space-y-4">
            <div *ngFor="let item of getChartData()" class="space-y-1.5">
              <div class="flex items-center justify-between text-xs font-mono">
                <span class="font-bold text-slate-800">{{ item.name }}</span>
                <span class="font-bold" [style.color]="item.color">
                  <ng-container [ngSwitch]="activeMetricChart">
                    <span *ngSwitchCase="'durationMs'">{{ item.durationMs }} ms</span>
                    <span *ngSwitchCase="'domMutations'">{{ item.domMutations }} ops</span>
                    <span *ngSwitchCase="'memoryEstKb'">{{ item.memoryEstKb }} KB</span>
                  </ng-container>
                </span>
              </div>
              <div class="w-full bg-slate-100 h-6 rounded-lg overflow-hidden flex items-center p-1 border border-slate-200">
                <div
                  class="h-full rounded-md transition-all duration-500 ease-out flex items-center justify-end px-2"
                  [style.width.%]="getMaxWidthPercentage(item[activeMetricChart])"
                  [style.backgroundColor]="item.color"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Benchmark Log Table -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
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
              <tr *ngIf="benchmarkResults.length === 0">
                <td colSpan="7" class="p-6 text-center text-slate-400 font-sans">
                  Run the benchmark suite above to populate performance metrics table.
                </td>
              </tr>
              <tr *ngFor="let res of benchmarkResults" class="hover:bg-slate-50 transition-colors">
                <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {{ frameworksInfo[res.framework]?.name || res.framework }}
                </td>
                <td class="p-3 text-slate-700">{{ getOpName(res.op) }}</td>
                <td class="p-3 text-slate-500">{{ res.itemCount.toLocaleString() }}</td>
                <td class="p-3 font-semibold text-emerald-600">{{ res.durationMs }} ms</td>
                <td class="p-3 text-sky-600">{{ res.domMutations.toLocaleString() }}</td>
                <td class="p-3 text-amber-600">{{ res.memoryEstKb.toLocaleString() }} KB</td>
                <td class="p-3 text-purple-600">{{ res.fps }} FPS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- DevTools & Measurement Guide -->
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
  `
})
export class BenchmarkSuiteComponent {
  @Input() itemCount: number = 1000;
  @Input() benchmarkResults: BenchmarkResult[] = [];
  @Output() recordResult = new EventEmitter<BenchmarkResult>();
  @Output() clearResults = new EventEmitter<void>();

  isBenchmarking = false;
  activeMetricChart: 'durationMs' | 'domMutations' | 'memoryEstKb' = 'durationMs';
  selectedOpFilter: BenchmarkOp = 'initialRender1000';

  frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];
  frameworksInfo = FRAMEWORKS;
  benchmarkOperations = BENCHMARK_OPERATIONS;

  async handleRunFullSuite() {
    if (this.isBenchmarking) return;
    this.isBenchmarking = true;

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '-9999px';
    document.body.appendChild(hiddenContainer);

    try {
      for (const opInfo of BENCHMARK_OPERATIONS) {
        for (const fw of this.frameworks) {
          const sandbox = document.createElement('div');
          hiddenContainer.appendChild(sandbox);

          const { result } = await runFrameworkBenchmark(
            fw,
            opInfo.id,
            sandbox,
            [],
            this.itemCount
          );

          this.recordResult.emit(result);
          hiddenContainer.removeChild(sandbox);
        }
      }
    } catch (err) {
      console.error('Error running benchmark suite:', err);
    } finally {
      document.body.removeChild(hiddenContainer);
      this.isBenchmarking = false;
    }
  }

  getChartData() {
    return this.frameworks.map((fwId) => {
      const fw = FRAMEWORKS[fwId];
      const opResults = this.benchmarkResults.filter((r) => r.framework === fwId && r.op === this.selectedOpFilter);
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
  }

  getMaxWidthPercentage(val: number): number {
    const data = this.getChartData();
    const values = data.map((d) => d[this.activeMetricChart]);
    const maxVal = Math.max(...values, 1);
    return Math.max(4, (val / maxVal) * 100);
  }

  getSortedWinners() {
    return [...this.getChartData()]
      .filter((d) => d.durationMs > 0)
      .sort((a, b) => a[this.activeMetricChart] - b[this.activeMetricChart]);
  }

  getOpName(opId: BenchmarkOp): string {
    return BENCHMARK_OPERATIONS.find(o => o.id === opId)?.name || opId;
  }
}
