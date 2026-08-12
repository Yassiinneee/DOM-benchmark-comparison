import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BenchmarkResult } from '../../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../../data/frameworksData';

@Component({
  selector: 'app-lab-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">Lab Report & Deliverables Export</h2>
              <p class="text-xs text-slate-500">
                Generate student submission report containing execution results (Benchmark.txt) and architecture analysis (Reflection.md).
              </p>
            </div>
          </div>
          <button (click)="closeModal()" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            ✕
          </button>
        </div>

        <!-- Student Meta Data Form -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              [(ngModel)]="studentName"
              (ngModelChange)="updateContent()"
              placeholder="e.g. Alex Johnson"
              class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Course / Section ID</label>
            <input
              type="text"
              [(ngModel)]="studentId"
              (ngModelChange)="updateContent()"
              placeholder="e.g. CS 490 - Front-End Engineering"
              class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <!-- Export Document Switch Tabs -->
        <div class="flex border-b border-slate-200 space-x-2 text-xs font-semibold">
          <button
            (click)="activeReportTab = 'benchmark'"
            [class]="
              activeReportTab === 'benchmark'
                ? 'pb-2.5 px-4 border-b-2 border-indigo-600 text-indigo-600 font-bold'
                : 'pb-2.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-900'
            "
          >
            📄 Deliverable 1: Benchmark.txt
          </button>
          <button
            (click)="activeReportTab = 'reflection'"
            [class]="
              activeReportTab === 'reflection'
                ? 'pb-2.5 px-4 border-b-2 border-indigo-600 text-indigo-600 font-bold'
                : 'pb-2.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-900'
            "
          >
            📝 Deliverable 2: Reflection.md
          </button>
        </div>

        <!-- Content Preview Area -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>
              Generated Document Preview ({{ activeReportTab === 'benchmark' ? 'Benchmark.txt' : 'Reflection.md' }})
            </span>
            <span>UTF-8 Plain Text / Markdown</span>
          </div>
          <textarea
            *ngIf="activeReportTab === 'benchmark'"
            [(ngModel)]="benchmarkText"
            rows="12"
            class="w-full p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none custom-scrollbar"
          ></textarea>
          <textarea
            *ngIf="activeReportTab === 'reflection'"
            [(ngModel)]="reflectionText"
            rows="12"
            class="w-full p-4 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none custom-scrollbar"
          ></textarea>
        </div>

        <!-- Action Footer -->
        <div class="flex items-center justify-between border-t border-slate-100 pt-4">
          <span class="text-xs text-slate-500 font-mono">
            Recorded Runs: <strong class="text-slate-900">{{ benchmarkResults.length }}</strong>
          </span>

          <div class="flex items-center gap-2">
            <button
              (click)="downloadFile(activeReportTab === 'benchmark' ? benchmarkText : reflectionText, activeReportTab === 'benchmark' ? 'Benchmark.txt' : 'Reflection.md')"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download {{ activeReportTab === 'benchmark' ? 'Benchmark.txt' : 'Reflection.md' }}
            </button>

            <button
              (click)="closeModal()"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LabReportModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() benchmarkResults: BenchmarkResult[] = [];
  @Output() close = new EventEmitter<void>();

  studentName = 'Alex Johnson';
  studentId = 'CS 490';
  activeReportTab: 'benchmark' | 'reflection' = 'benchmark';

  benchmarkText = '';
  reflectionText = '';

  ngOnChanges(): void {
    this.updateContent();
  }

  updateContent(): void {
    this.benchmarkText = this.generateBenchmarkTxt();
    this.reflectionText = this.generateReflectionMd();
  }

  generateBenchmarkTxt(): string {
    const lines = [
      `====================================================================`,
      `              DOM BENCHMARK EXPERIMENTAL LAB REPORT                `,
      `====================================================================`,
      `Student Name : ${this.studentName}`,
      `Course / ID  : ${this.studentId}`,
      `Generated At : ${new Date().toISOString()}`,
      `Total Recorded Runs: ${this.benchmarkResults.length}`,
      `====================================================================\n`,
      `RAW BENCHMARK LOG DATA:`,
      `--------------------------------------------------------------------`,
      `FRAMEWORK | OPERATION               | ITEMS  | TIME (ms) | DOM OPS | MEM (KB)`,
      `--------------------------------------------------------------------`
    ];

    if (this.benchmarkResults.length === 0) {
      lines.push(`No benchmark operations have been recorded yet in this session.`);
    } else {
      for (const res of this.benchmarkResults) {
        const fw = FRAMEWORKS[res.framework]?.name || res.framework;
        const op = BENCHMARK_OPERATIONS.find(o => o.id === res.op)?.name || res.op;
        lines.push(
          `${fw.padEnd(9)} | ${op.padEnd(23)} | ${res.itemCount.toString().padEnd(6)} | ${res.durationMs.toString().padEnd(9)} | ${res.domMutations.toString().padEnd(7)} | ${res.memoryEstKb.toString()}`
        );
      }
    }

    lines.push(`\n--------------------------------------------------------------------`);
    lines.push(`END OF BENCHMARK.TXT`);
    return lines.join('\n');
  }

  generateReflectionMd(): string {
    return `# Architectural Analysis & Reflection Report

**Student Name:** ${this.studentName}  
**Course ID:** ${this.studentId}  
**Date:** ${new Date().toLocaleDateString()}

---

## 1. Executive Summary & Observations
During the automated performance benchmark testing across React, Angular, Vue, and Svelte, significant variances were observed across initial DOM node creation, in-place updates, and deletion cycles.

### Key Performance Characteristics
1. **Initial Rendering (100, 500, 1,000 tasks):**
   - **Svelte & Vue 3** exhibited low initial script overhead due to compile-time DOM instructions and direct reactive dependency tracking.
   - **React & Angular** incurred Virtual DOM and Ivy change detector reconciliation costs, but maintained strong throughput on structural updates.

2. **In-Place Updates (50 tasks):**
   - Fine-grained signal tracking (Angular Signals, Svelte Runes/Stores, Vue Reactivity) bypasses whole-tree diffing and updates text nodes directly.

3. **DOM Deletion (50 tasks):**
   - Direct element detachment and DOM node removal performance depends heavily on key tracking (track in Angular @for, key in React, :key in Vue).

---

## 2. Theoretical Framework Comparisons

| Framework | DOM Strategy | Change Detection Trigger | Overhead Profile |
| :--- | :--- | :--- | :--- |
| **React** | Virtual DOM | Fiber Re-render | VDOM Tree Reconciliation |
| **Angular** | Incremental DOM & Signals | Zone.js / Signal Graph | Template Instruction Execution |
| **Vue 3** | Virtual DOM + Block Tree | Proxy Reactivity | Compiled Block Tree Optimization |
| **Svelte** | Compiled Direct DOM | Reactive Assignments | Near-Zero Runtime Abstraction |

---

## 3. Conclusion & Recommendations
- For high-density, real-time data visualizers, fine-grained reactive frameworks or compiled DOM instructions reduce GC pressure.
- Proper key track bindings prevent unnecessary node destructions and rebuilds.
`;
  }

  downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  closeModal(): void {
    this.close.emit();
  }
}
