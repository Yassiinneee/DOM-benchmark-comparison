import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="15" x2="23" y2="15" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="15" x2="4" y2="15" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-slate-900 tracking-tight">DOM Benchmark Lab</h1>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-800 border border-red-200 uppercase tracking-wide">
                  Angular Edition
                </span>
              </div>
              <p class="text-xs text-slate-500 font-medium">
                Comparative Performance Analysis: React vs Angular vs Vue 3 vs Svelte
              </p>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <nav class="hidden md:flex space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              (click)="selectTab('workbench')"
              [class]="
                activeTab === 'workbench'
                  ? 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-xs transition-all'
                  : 'px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 transition-all'
              "
            >
              Framework Workbench
            </button>
            <button
              (click)="selectTab('suite')"
              [class]="
                activeTab === 'suite'
                  ? 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-xs transition-all'
                  : 'px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 transition-all'
              "
            >
              Benchmark Suite
            </button>
            <button
              (click)="selectTab('sandbox')"
              [class]="
                activeTab === 'sandbox'
                  ? 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-xs transition-all'
                  : 'px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 transition-all'
              "
            >
              4-Way Sandbox
            </button>
            <button
              (click)="selectTab('architecture')"
              [class]="
                activeTab === 'architecture'
                  ? 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-xs transition-all'
                  : 'px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 transition-all'
              "
            >
              Architecture Matrix
            </button>
          </nav>

          <!-- Right Action Items -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <span class="text-slate-500 font-mono text-[11px]">Tasks Target:</span>
              <select
                [value]="itemCount"
                (change)="onItemCountChange($event)"
                class="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option [value]="100">100</option>
                <option [value]="500">500</option>
                <option [value]="1000">1,000</option>
              </select>
            </div>

            <button
              (click)="onRunSuite()"
              [disabled]="isBenchmarking"
              class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Run Suite</span>
            </button>

            <button
              (click)="onOpenLabReport()"
              class="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Lab Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() activeTab: 'workbench' | 'suite' | 'sandbox' | 'architecture' = 'workbench';
  @Output() activeTabChange = new EventEmitter<'workbench' | 'suite' | 'sandbox' | 'architecture'>();

  @Input() itemCount: number = 1000;
  @Output() itemCountChange = new EventEmitter<number>();

  @Input() isBenchmarking: boolean = false;
  @Output() runSuite = new EventEmitter<void>();
  @Output() openLabReport = new EventEmitter<void>();

  selectTab(tab: 'workbench' | 'suite' | 'sandbox' | 'architecture'): void {
    this.activeTabChange.emit(tab);
  }

  onItemCountChange(event: Event): void {
    const val = Number((event.target as HTMLSelectElement).value);
    this.itemCountChange.emit(val);
  }

  onRunSuite(): void {
    this.runSuite.emit();
  }

  onOpenLabReport(): void {
    this.openLabReport.emit();
  }
}
