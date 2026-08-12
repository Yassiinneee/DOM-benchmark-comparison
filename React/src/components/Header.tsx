import React from 'react';
import { Play, FileText, Cpu, Layers, Sparkles, Sliders } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workbench' | 'suite' | 'sandbox' | 'architecture';
  setActiveTab: (tab: 'workbench' | 'suite' | 'sandbox' | 'architecture') => void;
  itemCount: number;
  setItemCount: (count: number) => void;
  onRunSuite: () => void;
  onOpenLabReport: () => void;
  isBenchmarking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  itemCount,
  setItemCount,
  onRunSuite,
  onOpenLabReport,
  isBenchmarking,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  DOM Benchmark Lab
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-mono">
                  React • Angular • Vue • Svelte
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Performance & DOM manipulation analysis workbench for front-end JS frameworks
              </p>
            </div>
          </div>

          {/* Global Workload Selector & Quick Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-medium">
              <span className="px-2.5 text-slate-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Workload:
              </span>
              {[500, 1000, 2500, 5000].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setItemCount(cnt)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    itemCount === cnt
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cnt.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              onClick={onRunSuite}
              disabled={isBenchmarking}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-xs ${
                isBenchmarking
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
              }`}
            >
              {isBenchmarking ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running Suite...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run All Benchmarks
                </>
              )}
            </button>

            <button
              onClick={onOpenLabReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all hover:text-slate-900"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Lab Report
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('workbench')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'workbench'
                ? 'border-indigo-600 text-indigo-600 font-semibold bg-indigo-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            Framework Workbench ("Framework after Framework")
          </button>

          <button
            onClick={() => setActiveTab('suite')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'suite'
                ? 'border-sky-600 text-sky-600 font-semibold bg-sky-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Cpu className="w-4 h-4 text-sky-600" />
            Comparative Benchmark Matrix & Charts
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'border-amber-600 text-amber-600 font-semibold bg-amber-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Interactive Split Sandbox
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-emerald-600 text-emerald-600 font-semibold bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Architecture Comparison & Quiz
          </button>
        </div>
      </div>
    </header>
  );
};
