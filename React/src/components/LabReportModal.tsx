import React, { useState } from 'react';
import { BenchmarkResult } from '../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
import { X, Copy, Download, Check, FileText } from 'lucide-react';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  benchmarkResults: BenchmarkResult[];
  itemCount: number;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  benchmarkResults,
  itemCount,
}) => {
  const [studentName, setStudentName] = useState('Student Researcher');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate markdown report content
  const generateMarkdownReport = () => {
    let md = `# Front-End JavaScript Frameworks DOM Performance Benchmark Report\n`;
    md += `**Author / Student:** ${studentName}\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Benchmark Workload Item Count:** ${itemCount.toLocaleString()} tasks\n\n`;

    md += `## 1. Executive Summary & Objective\n`;
    md += `The objective of this exercise is to benchmark and compare the performance of popular front-end JavaScript frameworks (React, Angular, Vue, and Svelte) in handling DOM manipulations through hands-on testing of To-Do list operations.\n\n`;

    md += `## 2. Experimental Benchmark Results\n\n`;
    md += `| Framework | Operation | Item Count | Duration (ms) | DOM Operations | Est. Memory (KB) | FPS Score |\n`;
    md += `|-----------|-----------|------------|---------------|----------------|------------------|-----------|\n`;

    benchmarkResults.forEach((r) => {
      const fw = FRAMEWORKS[r.framework]?.name || r.framework;
      const op = BENCHMARK_OPERATIONS.find((o) => o.id === r.op)?.name || r.op;
      md += `| ${fw} | ${op} | ${r.itemCount.toLocaleString()} | ${r.durationMs} ms | ${r.domMutations} | ${r.memoryEstKb} KB | ${r.fps} |\n`;
    });

    md += `\n## 3. Architectural Key Takeaways\n`;
    md += `- **React (Virtual DOM):** Uses runtime Fiber reconciliation tree diffing. Excellent for complex state trees, but allocates temporary VNode objects in memory.\n`;
    md += `- **Angular (Ivy LViews & Signals):** Compiles templates into instruction sets. Signals enable targeted binding updates without broad change detection passes.\n`;
    md += `- **Vue (Reactive Proxy & Block Trees):** Combines fine-grained ES6 Proxies with compiler Block Trees, skipping static DOM nodes during diffing passes.\n`;
    md += `- **Svelte (Compile-Time Direct DOM):** Operates with zero Virtual DOM overhead by compiling templates directly into native browser DOM mutations.\n\n`;

    md += `---\n*Report generated via DOM Benchmark Lab*`;
    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(
      {
        studentName,
        date: new Date().toISOString(),
        itemCount,
        results: benchmarkResults,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dom-benchmark-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Student Lab Report Preview</h3>
              <p className="text-xs text-slate-500">
                Formatted benchmark report ready for assignment submission.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-full sm:w-auto space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                Student Name / ID
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="text-right text-slate-500 font-mono text-[11px]">
              <div>Workload: <strong className="text-slate-900">{itemCount.toLocaleString()} items</strong></div>
              <div>Recorded Runs: <strong className="text-emerald-600">{benchmarkResults.length}</strong></div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-mono">Recorded Benchmark Data Table</h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Framework</th>
                    <th className="p-2.5">Operation</th>
                    <th className="p-2.5">Time (ms)</th>
                    <th className="p-2.5">DOM Ops</th>
                    <th className="p-2.5">Est. Memory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {benchmarkResults.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400 font-sans">
                        No benchmark data recorded. Run benchmarks first!
                      </td>
                    </tr>
                  ) : (
                    benchmarkResults.map((r) => (
                      <tr key={r.id}>
                        <td className="p-2.5 font-bold text-slate-900">{FRAMEWORKS[r.framework]?.name || r.framework}</td>
                        <td className="p-2.5 text-slate-700">{r.op}</td>
                        <td className="p-2.5 text-emerald-600 font-bold">{r.durationMs} ms</td>
                        <td className="p-2.5 text-sky-600">{r.domMutations}</td>
                        <td className="p-2.5 text-amber-600">{r.memoryEstKb} KB</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 font-mono">Generated Markdown Preview</h4>
            <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto max-h-48 leading-relaxed custom-scrollbar">
              <code>{generateMarkdownReport()}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Ready to attach to coursework submission
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/Benchmark.txt"
              download="Benchmark.txt"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              Download Benchmark.txt
            </a>
            <a
              href="/Reflection.md"
              download="Reflection.md"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              Download Reflection.md
            </a>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              JSON Data
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
