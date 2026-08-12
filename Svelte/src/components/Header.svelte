<script lang="ts">
  export let activeTab: 'workbench' | 'suite' | 'sandbox' | 'architecture' = 'workbench';
  export let itemCount: number = 1000;
  export let isBenchmarking: boolean = false;
  export let onRunFullSuite: () => void;
  export let onOpenModal: () => void;
  export let onSelectTab: (tab: 'workbench' | 'suite' | 'sandbox' | 'architecture') => void;
  export let onSelectCount: (count: number) => void;
</script>

<header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
      <!-- Title & Branding -->
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-orange-500 text-white shadow-xs">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">DOM Benchmark Lab</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 font-mono">
              Svelte 5 Edition
            </span>
          </div>
          <p class="text-xs text-slate-500">
            Comparative analysis engine for React, Angular, Vue 3, and Svelte DOM operations.
          </p>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span class="px-2.5 font-mono text-slate-500 font-medium">Batch Target:</span>
          {#each [100, 500, 1000, 5000] as count}
            <button
              on:click={() => onSelectCount(count)}
              class="px-2.5 py-1 rounded-lg font-mono font-semibold transition-all {itemCount === count ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}"
            >
              {count.toLocaleString()}
            </button>
          {/each}
        </div>

        <button
          on:click={onRunFullSuite}
          disabled={isBenchmarking}
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 {isBenchmarking ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95'}"
        >
          {#if isBenchmarking}
            <div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Running Suite...
          {:else}
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Run Full Suite
          {/if}
        </button>

        <button
          on:click={onOpenModal}
          class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Lab Report
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="flex space-x-1 border-t border-slate-100 pt-1">
      <button
        on:click={() => onSelectTab('workbench')}
        class="px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 {activeTab === 'workbench' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'}"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        Framework Workbench
      </button>

      <button
        on:click={() => onSelectTab('suite')}
        class="px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 {activeTab === 'suite' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'}"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Automated Benchmark Suite
      </button>

      <button
        on:click={() => onSelectTab('sandbox')}
        class="px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 {activeTab === 'sandbox' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'}"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
        4-Way Split Sandbox
      </button>

      <button
        on:click={() => onSelectTab('architecture')}
        class="px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 {activeTab === 'architecture' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'}"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
        Architecture Matrix
      </button>
    </nav>
  </div>
</header>
