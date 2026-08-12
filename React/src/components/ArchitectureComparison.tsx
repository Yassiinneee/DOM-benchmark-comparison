import React, { useState } from 'react';
import { QUIZ_QUESTIONS, FRAMEWORKS } from '../data/frameworksData';
import { BookOpen, HelpCircle, CheckCircle2, XCircle, FileText, Cpu, ArrowRight } from 'lucide-react';

export const ArchitectureComparison: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Section 1: Architectural Deep Dive Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-semibold">
              Theoretical Foundation
            </span>
            <h2 className="text-2xl font-bold text-slate-900">DOM Manipulation Architecture Matrix</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Comparing how React, Angular, Vue, and Svelte execute rendering, reconciliation, and browser DOM updates under the hood.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700 font-mono">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Framework</th>
                <th className="p-4">DOM Architecture Paradigm</th>
                <th className="p-4">Reconciliation Strategy</th>
                <th className="p-4">Runtime Memory Overhead</th>
                <th className="p-4">Primary Performance Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {Object.values(FRAMEWORKS).map((fw) => (
                <tr key={fw.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${fw.borderAccent.replace('border-', 'bg-')}`} />
                    {fw.name}
                  </td>
                  <td className="p-4 text-slate-800 font-sans font-medium">{fw.architecture}</td>
                  <td className="p-4 text-slate-600 font-sans leading-relaxed">{fw.domStrategy}</td>
                  <td className="p-4 font-semibold text-amber-600">
                    {fw.id === 'react'
                      ? 'High (VNode tree allocations)'
                      : fw.id === 'angular'
                      ? 'Medium (LView metadata)'
                      : fw.id === 'vue'
                      ? 'Medium-Low (Proxy wrappers)'
                      : 'Minimal (No Virtual DOM)'}
                  </td>
                  <td className="p-4 text-emerald-600 font-sans leading-relaxed">
                    {fw.pros[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Framework Pros & Cons Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(FRAMEWORKS).map((fw) => (
          <div
            key={fw.id}
            className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  <div dangerouslySetInnerHTML={{ __html: fw.logoSvg }} />
                </span>
                <h3 className="text-lg font-bold text-slate-900">{fw.name} Analysis</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800`}>
                {fw.architecture}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-emerald-700 font-semibold block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Strengths
                </strong>
                <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                  {fw.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <strong className="text-amber-700 font-semibold block mb-1.5 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-amber-600" />
                  Trade-offs & Bottlenecks
                </strong>
                <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                  {fw.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section 3: Interactive Student Assessment Quiz */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900">Student Knowledge Assessment</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Test your understanding of front-end framework DOM manipulation strategies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {showResults && (
              <span className="text-sm font-bold font-mono px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                Score: {calculateScore()} / {QUIZ_QUESTIONS.length} Correct
              </span>
            )}
            <button
              onClick={() => setShowResults(!showResults)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs"
            >
              {showResults ? 'Review Answers' : 'Submit Quiz Answers'}
            </button>
          </div>
        </div>

        {/* Quiz Questions List */}
        <div className="space-y-8">
          {QUIZ_QUESTIONS.map((q, qIdx) => {
            const selectedOpt = userAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div key={q.id} className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900 leading-snug">{q.question}</h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pl-9">
                  {q.options.map((opt, optIdx) => {
                    let optStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100';
                    if (selectedOpt === optIdx) {
                      optStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold';
                    }

                    if (showResults) {
                      if (optIdx === q.correctIndex) {
                        optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (selectedOpt === optIdx && !isCorrect) {
                        optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-lg border text-xs text-left transition-all ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="ml-9 p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                    <strong className="text-indigo-700 block font-semibold">Explanation:</strong>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
