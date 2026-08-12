<script setup lang="ts">
import { ref } from 'vue';
import { QUIZ_QUESTIONS, FRAMEWORKS } from '../data/frameworksData';
import { BookOpen, CheckCircle2, XCircle } from 'lucide-vue-next';

const userAnswers = ref<Record<number, number>>({});
const showResults = ref(false);

function handleSelectOption(qId: number, optionIdx: number) {
  if (showResults.value) return;
  userAnswers.value[qId] = optionIdx;
}

function calculateScore() {
  let score = 0;
  QUIZ_QUESTIONS.forEach((q) => {
    if (userAnswers.value[q.id] === q.correctIndex) {
      score += 1;
    }
  });
  return score;
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    <!-- Section 1: Architectural Deep Dive Table -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-semibold">
            Theoretical Foundation
          </span>
          <h2 class="text-2xl font-bold text-slate-900">DOM Manipulation Architecture Matrix</h2>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          Comparing how React, Angular, Vue, and Svelte execute rendering, reconciliation, and browser DOM updates under the hood.
        </p>
      </div>

      <div class="overflow-x-auto border border-slate-200 rounded-xl">
        <table class="w-full text-left text-xs text-slate-700 font-mono">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th class="p-4">Framework</th>
              <th class="p-4">DOM Architecture Paradigm</th>
              <th class="p-4">Reconciliation Strategy</th>
              <th class="p-4">Runtime Memory Overhead</th>
              <th class="p-4">Primary Performance Advantage</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-for="fw in Object.values(FRAMEWORKS)" :key="fw.id" class="hover:bg-slate-50 transition-colors">
              <td class="p-4 font-bold text-slate-900 flex items-center gap-2">
                <span :class="['w-2.5 h-2.5 rounded-full', fw.borderAccent.replace('border-', 'bg-')]" />
                {{ fw.name }}
              </td>
              <td class="p-4 text-slate-800 font-sans font-medium">{{ fw.architecture }}</td>
              <td class="p-4 text-slate-600 font-sans leading-relaxed">{{ fw.domStrategy }}</td>
              <td class="p-4 font-semibold text-amber-600">
                {{
                  fw.id === 'react'
                    ? 'High (VNode tree allocations)'
                    : fw.id === 'angular'
                    ? 'Medium (LView metadata)'
                    : fw.id === 'vue'
                    ? 'Medium-Low (Proxy wrappers)'
                    : 'Minimal (No Virtual DOM)'
                }}
              </td>
              <td class="p-4 text-emerald-600 font-sans leading-relaxed">
                {{ fw.pros[0] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 2: Framework Pros & Cons Matrix -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="fw in Object.values(FRAMEWORKS)"
        :key="fw.id"
        class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
              <div v-html="fw.logoSvg"></div>
            </span>
            <h3 class="text-lg font-bold text-slate-900">{{ fw.name }} Analysis</h3>
          </div>
          <span class="text-xs font-bold px-2.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800">
            {{ fw.architecture }}
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <strong class="text-emerald-700 font-semibold block mb-1.5 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
              Key Strengths
            </strong>
            <ul class="space-y-1 text-slate-600 pl-5 list-disc">
              <li v-for="(p, i) in fw.pros" :key="i">{{ p }}</li>
            </ul>
          </div>

          <div class="pt-2 border-t border-slate-100">
            <strong class="text-amber-700 font-semibold block mb-1.5 flex items-center gap-1">
              <XCircle class="w-3.5 h-3.5 text-amber-600" />
              Trade-offs & Bottlenecks
            </strong>
            <ul class="space-y-1 text-slate-600 pl-5 list-disc">
              <li v-for="(c, i) in fw.cons" :key="i">{{ c }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Interactive Student Assessment Quiz -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div class="flex items-center gap-2">
            <BookOpen class="w-5 h-5 text-indigo-600" />
            <h2 class="text-2xl font-bold text-slate-900">Student Knowledge Assessment</h2>
          </div>
          <p class="text-sm text-slate-500 mt-1">
            Test your understanding of front-end framework DOM manipulation strategies.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span v-if="showResults" class="text-sm font-bold font-mono px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            Score: {{ calculateScore() }} / {{ QUIZ_QUESTIONS.length }} Correct
          </span>
          <button
            @click="showResults = !showResults"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs"
          >
            {{ showResults ? 'Review Answers' : 'Submit Quiz Answers' }}
          </button>
        </div>
      </div>

      <!-- Quiz Questions List -->
      <div class="space-y-8">
        <div v-for="(q, qIdx) in QUIZ_QUESTIONS" :key="q.id" class="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold flex items-center justify-center shrink-0">
              {{ qIdx + 1 }}
            </span>
            <h4 class="text-base font-semibold text-slate-900 leading-snug">{{ q.question }}</h4>
          </div>

          <div class="grid grid-cols-1 gap-2.5 pl-9">
            <button
              v-for="(opt, optIdx) in q.options"
              :key="optIdx"
              @click="handleSelectOption(q.id, optIdx)"
              :class="[
                'p-3 rounded-lg border text-xs text-left transition-all',
                showResults
                  ? optIdx === q.correctIndex
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : userAnswers[q.id] === optIdx
                    ? 'border-rose-400 bg-rose-50 text-rose-900'
                    : 'border-slate-200 bg-white text-slate-700'
                  : userAnswers[q.id] === optIdx
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              ]"
            >
              {{ opt }}
            </button>
          </div>

          <div v-if="showResults" class="ml-9 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <strong class="text-indigo-700 block font-semibold">Explanation:</strong>
            <p class="leading-relaxed">{{ q.explanation }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
