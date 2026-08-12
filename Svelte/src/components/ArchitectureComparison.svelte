<script lang="ts">
  import { FRAMEWORKS, QUIZ_QUESTIONS } from '../data/frameworksData';

  let selectedQuestionAnswers: Record<number, number> = {};
  let showExplanations: Record<number, boolean> = {};

  function handleSelectOption(qId: number, optionIdx: number) {
    selectedQuestionAnswers[qId] = optionIdx;
    showExplanations[qId] = true;
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- Architectural Matrix Grid -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
    <div class="border-b border-slate-100 pb-4">
      <h2 class="text-xl font-bold text-slate-900">Framework Architectural Comparison Matrix</h2>
      <p class="text-xs text-slate-500">
        Structural and runtime comparison across React, Angular, Vue 3, and Svelte DOM engines.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each ['react', 'angular', 'vue', 'svelte'] as fwId}
        {@const fw = FRAMEWORKS[fwId]}
        <div class="border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-slate-300 transition-all bg-slate-50/40">
          <div class="flex items-center gap-3 border-b border-slate-200/60 pb-3">
            <div class="w-8 h-8 flex items-center justify-center p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
              {@html fw.logoSvg}
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">{fw.name}</h3>
              <p class="text-[10px] font-mono text-slate-500">v{fw.version}</p>
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Architecture</span>
              <span class="font-bold text-slate-800">{fw.architecture}</span>
            </div>

            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block font-semibold">DOM Strategy</span>
              <span class="font-bold text-slate-800">{fw.domStrategy}</span>
            </div>

            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Key Strengths</span>
              <ul class="list-disc pl-4 space-y-0.5 text-slate-600 mt-1">
                {#each fw.pros as pro}
                  <li>{pro}</li>
                {/each}
              </ul>
            </div>

            <div>
              <span class="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Trade-offs</span>
              <ul class="list-disc pl-4 space-y-0.5 text-slate-600 mt-1">
                {#each fw.cons as con}
                  <li>{con}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Interactive Architecture Knowledge Quiz -->
  <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
    <div class="border-b border-slate-100 pb-4">
      <h2 class="text-xl font-bold text-slate-900">Architecture Knowledge Assessment</h2>
      <p class="text-xs text-slate-500">
        Test your understanding of DOM reconciliation, Virtual DOM, Signals, and Ahead-of-Time compilation.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each QUIZ_QUESTIONS as q}
        <div class="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
          <div class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {q.id}
            </span>
            <p class="text-sm font-bold text-slate-900">{q.question}</p>
          </div>

          <div class="space-y-2 pl-9">
            {#each q.options as opt, idx}
              {@const isSelected = selectedQuestionAnswers[q.id] === idx}
              {@const isCorrect = idx === q.correctIndex}
              <button
                on:click={() => handleSelectOption(q.id, idx)}
                class="w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between {isSelected ? (isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-rose-50 border-rose-300 text-rose-900 font-bold') : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'}"
              >
                <span>{opt}</span>
                {#if isSelected}
                  {#if isCorrect}
                    <span class="text-emerald-600 font-bold font-mono">✓ Correct</span>
                  {:else}
                    <span class="text-rose-600 font-bold font-mono">✗ Incorrect</span>
                  {/if}
                {/if}
              </button>
            {/each}
          </div>

          {#if showExplanations[q.id]}
            <div class="ml-9 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-950 font-sans leading-relaxed">
              <strong class="font-mono text-indigo-900">Explanation:</strong> {q.explanation}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
