import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkId, Task, BenchmarkOp, BenchmarkResult } from '../../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../../data/frameworksData';
import { runFrameworkBenchmark, generateTasks } from '../../services/domBenchmarkEngine';

@Component({
  selector: 'app-interactive-sandbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Sandbox Header & Controls -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-semibold">
                4-Way Split Sandbox
              </span>
              <h2 class="text-2xl font-bold text-slate-900">Simultaneous DOM Execution</h2>
            </div>
            <p class="text-sm text-slate-500 mt-1">
              Trigger DOM operations across React, Angular, Vue, and Svelte simultaneously to observe side-by-side performance.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              (click)="handleRunSimultaneousOp('initialRender100')"
              [disabled]="isExecuting"
              class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Render 100
            </button>
            <button
              (click)="handleRunSimultaneousOp('initialRender500')"
              [disabled]="isExecuting"
              class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Render 500
            </button>
            <button
              (click)="handleRunSimultaneousOp('initialRender1000')"
              [disabled]="isExecuting"
              class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Render 1,000
            </button>
            <button
              (click)="handleRunSimultaneousOp('update50')"
              [disabled]="isExecuting"
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              Update 50 Tasks
            </button>
            <button
              (click)="handleRunSimultaneousOp('delete50')"
              [disabled]="isExecuting"
              class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Delete 50 Tasks
            </button>
          </div>
        </div>

        <!-- Quick Actions Bar -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span class="text-slate-500 font-mono font-medium mr-2">Quick Actions:</span>
          <button
            *ngFor="let op of benchmarkOperations"
            (click)="handleRunSimultaneousOp(op.id)"
            [disabled]="isExecuting"
            class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all font-medium"
          >
            {{ op.name }}
          </button>
        </div>
      </div>

      <!-- 4-Column Split Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          *ngFor="let fwId of frameworks"
          class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
        >
          <!-- Framework Header Card -->
          <div class="space-y-2 border-b border-slate-100 pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div [innerHTML]="frameworksInfo[fwId].logoSvg"></div>
                </span>
                <span class="text-base font-bold text-slate-900">{{ frameworksInfo[fwId].name }}</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800">
                v{{ frameworksInfo[fwId].version }}
              </span>
            </div>
            <div class="text-[11px] text-slate-500 font-mono leading-tight">{{ frameworksInfo[fwId].architecture }}</div>
          </div>

          <!-- Metrics Display Card -->
          <div *ngIf="metricsMap[fwId]" class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
            <div class="flex items-center justify-between text-slate-600 text-[10px]">
              <span>Last Run Duration:</span>
              <span class="text-emerald-600 font-bold text-xs">{{ metricsMap[fwId]?.durationMs }} ms</span>
            </div>
            <div class="flex items-center justify-between text-slate-600 text-[10px]">
              <span>DOM Mutations:</span>
              <span class="text-sky-600 font-bold">{{ metricsMap[fwId]?.domMutations }} ops</span>
            </div>
            <div class="flex items-center justify-between text-slate-600 text-[10px]">
              <span>Est. Memory:</span>
              <span class="text-amber-600 font-bold">{{ metricsMap[fwId]?.memoryEstKb }} KB</span>
            </div>
          </div>
          <div *ngIf="!metricsMap[fwId]" class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-400 text-center">
            Click action button to test {{ frameworksInfo[fwId].name }} engine
          </div>

          <!-- Live Rendered Container -->
          <div class="space-y-1.5 flex-1 flex flex-col">
            <div class="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Task Node Tree</span>
              <span>{{ tasksMap[fwId]?.length || 0 }} items</span>
            </div>
            <div class="flex-1 max-h-64 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200 custom-scrollbar">
              <div [id]="'split-sandbox-' + fwId">
                <!-- Managed dynamically by domBenchmarkEngine -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InteractiveSandboxComponent implements OnInit {
  @Input() itemCount: number = 1000;
  @Output() recordResult = new EventEmitter<BenchmarkResult>();

  frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];
  frameworksInfo = FRAMEWORKS;
  benchmarkOperations = BENCHMARK_OPERATIONS;

  tasksMap: Record<FrameworkId, Task[]> = {
    react: [],
    angular: [],
    vue: [],
    svelte: []
  };

  metricsMap: Record<FrameworkId, BenchmarkResult | null> = {
    react: null,
    angular: null,
    vue: null,
    svelte: null
  };

  isExecuting = false;

  ngOnInit(): void {
    this.tasksMap = {
      react: generateTasks(20, 'React'),
      angular: generateTasks(20, 'Angular'),
      vue: generateTasks(20, 'Vue'),
      svelte: generateTasks(20, 'Svelte')
    };
  }

  async handleRunSimultaneousOp(op: BenchmarkOp) {
    if (this.isExecuting) return;
    this.isExecuting = true;

    for (const fw of this.frameworks) {
      const el = document.getElementById(`split-sandbox-${fw}`);
      if (el) {
        const { result, updatedTasks } = await runFrameworkBenchmark(
          fw,
          op,
          el,
          this.tasksMap[fw],
          this.itemCount
        );

        this.metricsMap[fw] = result;
        this.tasksMap[fw] = updatedTasks;
        this.recordResult.emit(result);
      }
    }

    this.isExecuting = false;
  }
}
