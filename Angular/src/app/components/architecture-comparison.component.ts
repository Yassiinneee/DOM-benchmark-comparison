import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ArchitectureItem {
  paradigm: string;
  name: string;
  frameworks: string[];
  description: string;
  mechanism: string;
  advantages: string[];
  drawbacks: string[];
}

@Component({
  selector: 'app-architecture-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-semibold">
            Deep Theoretical Matrix
          </span>
          <h2 class="text-2xl font-bold text-slate-900">Framework Architecture & Rendering Paradigms</h2>
        </div>
        <p class="text-sm text-slate-500">
          Compare the underlying execution strategies of React, Angular, Vue, and Svelte: Virtual DOM, Incremental DOM, Reactive Proxies, and Compile-Time DOM generation.
        </p>
      </div>

      <!-- Comparative Paradigm Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          *ngFor="let item of matrix"
          class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                {{ item.paradigm }}
              </span>
              <span class="text-xs font-semibold text-slate-500 font-mono">{{ item.frameworks.join(', ') }}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900">{{ item.name }}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">{{ item.description }}</p>
          </div>

          <div class="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono">
              <span class="font-bold text-indigo-700 block text-[11px]">Core Mechanism:</span>
              <span class="text-slate-600 leading-normal block">{{ item.mechanism }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div class="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
                <span class="font-bold text-emerald-800 font-mono block text-[11px]">Primary Advantage</span>
                <ul class="text-[11px] text-emerald-900 list-disc pl-3.5 space-y-0.5">
                  <li *ngFor="let adv of item.advantages">{{ adv }}</li>
                </ul>
              </div>

              <div class="p-3 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1">
                <span class="font-bold text-rose-800 font-mono block text-[11px]">Trade-Off / Overhead</span>
                <ul class="text-[11px] text-rose-900 list-disc pl-3.5 space-y-0.5">
                  <li *ngFor="let draw of item.drawbacks">{{ draw }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ArchitectureComparisonComponent {
  matrix: ArchitectureItem[] = [
    {
      paradigm: 'Virtual DOM (Fiber)',
      name: 'React 19 VDOM Diffing',
      frameworks: ['React'],
      description: 'Creates in-memory Virtual DOM node object trees on state change and computes structural tree diffs before batching DOM writes.',
      mechanism: 'Component function execution -> Fiber VNode tree generation -> Heuristic key-based diffing -> Batched layout flush.',
      advantages: [
        'Declarative state model reduces bug surface area',
        'Time-slicing and concurrent rendering support',
      ],
      drawbacks: [
        'GC overhead from short-lived VNode allocations',
        'Requires explicit memoization to prevent child re-renders',
      ],
    },
    {
      paradigm: 'Incremental DOM & Signals',
      name: 'Angular Ivy Engine',
      frameworks: ['Angular'],
      description: 'Compiles templates into linear instructions (LViews) that mutate actual DOM nodes incrementally without allocating intermediate VNodes.',
      mechanism: 'Template instruction execution (i0.ɵɵtext) -> Signal graph dependency resolution -> Direct DOM node patching.',
      advantages: [
        'Zero intermediate VNode object creation',
        'Fine-grained signal graph pinpoints specific text nodes',
      ],
      drawbacks: [
        'Requires Ahead-Of-Time (AOT) template compilation step',
        'Higher framework runtime bundle size baseline',
      ],
    },
    {
      paradigm: 'Proxy Reactivity + Block Tree',
      name: 'Vue 3 Block Tree',
      frameworks: ['Vue 3'],
      description: 'Combines ES6 Proxy reactivity with compiler static analysis to create Block Trees with bitwise Patch Flags.',
      mechanism: 'ES6 Proxy trap -> Track dynamic nodes in Block array -> Patch Flag bitwise comparison -> Direct property update.',
      advantages: [
        'Bypasses static DOM elements during re-renders',
        'Automatic reactivity dependency collection',
      ],
      drawbacks: [
        'Proxy wrapper overhead on massive arrays',
        'Requires compiler transform for optimal performance',
      ],
    },
    {
      paradigm: 'Compile-Time Direct DOM',
      name: 'Svelte 5 Runes Engine',
      frameworks: ['Svelte'],
      description: 'Eliminates Virtual DOM entirely by compiling templates into surgical JavaScript browser DOM statements.',
      mechanism: 'Build-time template parsing -> Direct JS DOM methods (node.textContent = ...) -> Zero-VDOM runtime execution.',
      advantages: [
        'Near-zero framework runtime abstraction overhead',
        'Lowest memory footprint and instant initial render',
      ],
      drawbacks: [
        'Compiled JavaScript output size grows with template complexity',
        'Smaller ecosystem compared to React/Angular',
      ],
    },
  ];
}
