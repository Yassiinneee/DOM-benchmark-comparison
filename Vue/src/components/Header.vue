<script setup lang="ts">
import { Play, FileText, Cpu, Layers, Sparkles, Sliders } from 'lucide-vue-next';

defineProps<{
  activeTab: 'workbench' | 'suite' | 'sandbox' | 'architecture';
  itemCount: number;
  isBenchmarking: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'workbench' | 'suite' | 'sandbox' | 'architecture'): void;
  (e: 'update:itemCount', count: number): void;
  (e: 'runSuite'): void;
  (e: 'openLabReport'): void;
}>();
</script>

<template>
  <header class="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Cpu class="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold tracking-tight text-slate-900">
                DOM Benchmark Lab
              </h1>
              <span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-mono">
                Vue 3 Engine Active
              </span>
            </div>
            <p class="text-xs text-slate-500">
              Performance & DOM manipulation analysis workbench for front-end JS frameworks
            </p>
          </div>
        </div>

        <!-- Global Workload Selector & Quick Controls -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-medium">
            <span class="px-2.5 text-slate-500 flex items-center gap-1.5">
              <Sliders class="w-3.5 h-3.5 text-slate-400" />
              Workload:
            </span>
            <button
              v-for="cnt in [500, 1000, 2500, 5000]"
              :key="cnt"
              @click="emit('update:itemCount', cnt)"
              :class="[
                'px-2.5 py-1 rounded-md transition-all',
                itemCount === cnt
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              ]"
            >
              {{ cnt.toLocaleString() }}
            </button>
          </div>

          <button
            @click="emit('runSuite')"
            :disabled="isBenchmarking"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-xs',
              isBenchmarking
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            ]"
          >
            <template v-if="isBenchmarking">
              <div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running Suite...
            </template>
            <template v-else>
              <Play class="w-3.5 h-3.5 fill-current" />
              Run All Benchmarks
            </template>
          </button>

          <button
            @click="emit('openLabReport')"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all hover:text-slate-900"
          >
            <FileText class="w-3.5 h-3.5 text-amber-600" />
            Lab Report
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center space-x-1 border-t border-slate-100 pt-1 overflow-x-auto no-scrollbar">
        <button
          @click="emit('update:activeTab', 'workbench')"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'workbench'
              ? 'border-indigo-600 text-indigo-600 font-semibold bg-indigo-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
          ]"
        >
          <Layers class="w-4 h-4 text-indigo-600" />
          Framework Workbench ("Framework after Framework")
        </button>

        <button
          @click="emit('update:activeTab', 'suite')"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'suite'
              ? 'border-sky-600 text-sky-600 font-semibold bg-sky-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
          ]"
        >
          <Cpu class="w-4 h-4 text-sky-600" />
          Comparative Benchmark Matrix & Charts
        </button>

        <button
          @click="emit('update:activeTab', 'sandbox')"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'sandbox'
              ? 'border-amber-600 text-amber-600 font-semibold bg-amber-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
          ]"
        >
          <Sparkles class="w-4 h-4 text-amber-600" />
          Interactive Split Sandbox
        </button>

        <button
          @click="emit('update:activeTab', 'architecture')"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'architecture'
              ? 'border-emerald-600 text-emerald-600 font-semibold bg-emerald-50/50 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
          ]"
        >
          <FileText class="w-4 h-4 text-emerald-600" />
          Architecture Comparison & Quiz
        </button>
      </div>
    </div>
  </header>
</template>
