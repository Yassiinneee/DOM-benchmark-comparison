import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header.component';
import { FrameworkWorkbenchComponent } from './components/framework-workbench.component';
import { BenchmarkSuiteComponent } from './components/benchmark-suite.component';
import { InteractiveSandboxComponent } from './components/interactive-sandbox.component';
import { ArchitectureComparisonComponent } from './components/architecture-comparison.component';
import { LabReportModalComponent } from './components/lab-report-modal.component';
import { BenchmarkResult } from '../types';
import { runFrameworkBenchmark } from '../services/domBenchmarkEngine';
import { BENCHMARK_OPERATIONS } from '../data/frameworksData';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FrameworkWorkbenchComponent,
    BenchmarkSuiteComponent,
    InteractiveSandboxComponent,
    ArchitectureComparisonComponent,
    LabReportModalComponent,
  ],
  template: `
    <div class="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      <!-- Header -->
      <app-header
        [activeTab]="activeTab"
        (activeTabChange)="activeTab = $event"
        [itemCount]="itemCount"
        (itemCountChange)="itemCount = $event"
        [isBenchmarking]="isBenchmarkingSuite"
        (runSuite)="handleRunSuite()"
        (openLabReport)="isLabReportOpen = true"
      ></app-header>

      <!-- Main Content Router -->
      <main class="flex-1">
        <app-framework-workbench
          *ngIf="activeTab === 'workbench'"
          [itemCount]="itemCount"
          (recordResult)="handleRecordResult($event)"
        ></app-framework-workbench>

        <app-benchmark-suite
          *ngIf="activeTab === 'suite'"
          [itemCount]="itemCount"
          [benchmarkResults]="benchmarkResults"
          (recordResult)="handleRecordResult($event)"
          (clearResults)="handleClearResults()"
        ></app-benchmark-suite>

        <app-interactive-sandbox
          *ngIf="activeTab === 'sandbox'"
          [itemCount]="itemCount"
          (recordResult)="handleRecordResult($event)"
        ></app-interactive-sandbox>

        <app-architecture-comparison
          *ngIf="activeTab === 'architecture'"
        ></app-architecture-comparison>
      </main>

      <!-- Lab Report Modal -->
      <app-lab-report-modal
        [isOpen]="isLabReportOpen"
        [benchmarkResults]="benchmarkResults"
        (close)="isLabReportOpen = false"
      ></app-lab-report-modal>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 font-mono">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            DOM Benchmark Engine Active • Angular Ivy Performance Observer
          </div>
          <div>
            React • Angular Ivy • Vue 3 • Svelte Benchmark Lab
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  activeTab: 'workbench' | 'suite' | 'sandbox' | 'architecture' = 'workbench';
  itemCount: number = 1000;
  benchmarkResults: BenchmarkResult[] = [];
  isLabReportOpen: boolean = false;
  isBenchmarkingSuite: boolean = false;

  handleRecordResult(result: BenchmarkResult): void {
    this.benchmarkResults = [...this.benchmarkResults, result];
  }

  handleClearResults(): void {
    this.benchmarkResults = [];
  }

  async handleRunSuite(): Promise<void> {
    if (this.isBenchmarkingSuite) return;
    this.isBenchmarkingSuite = true;
    this.activeTab = 'suite';

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
            this.itemCount
          );

          this.handleRecordResult(result);
          hiddenContainer.removeChild(sandbox);
        }
      }
    } catch (err) {
      console.error('Suite execution error:', err);
    } finally {
      document.body.removeChild(hiddenContainer);
      this.isBenchmarkingSuite = false;
    }
  }
}
