import React, { useState, useRef, useEffect } from 'react';
import { FrameworkId, Task, BenchmarkOp, BenchmarkResult } from '../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
import { runFrameworkBenchmark, generateTasks } from '../services/domBenchmarkEngine';
import { Play, Plus, RefreshCw, Zap } from 'lucide-react';

interface InteractiveSandboxProps {
  itemCount: number;
  onRecordResult: (result: BenchmarkResult) => void;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({
  itemCount,
  onRecordResult,
}) => {
  const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];
  const [tasksMap, setTasksMap] = useState<Record<FrameworkId, Task[]>>({
    react: [],
    angular: [],
    vue: [],
    svelte: [],
  });
  const [metricsMap, setMetricsMap] = useState<Record<FrameworkId, BenchmarkResult | null>>({
    react: null,
    angular: null,
    vue: null,
    svelte: null,
  });
  const [isExecuting, setIsExecuting] = useState(false);

  const containerRefs = {
    react: useRef<HTMLDivElement>(null),
    angular: useRef<HTMLDivElement>(null),
    vue: useRef<HTMLDivElement>(null),
    svelte: useRef<HTMLDivElement>(null),
  };

  // Seed sandbox with initial task data
  useEffect(() => {
    const nextMap: Record<FrameworkId, Task[]> = {
      react: generateTasks(20, 'React'),
      angular: generateTasks(20, 'Angular'),
      vue: generateTasks(20, 'Vue'),
      svelte: generateTasks(20, 'Svelte'),
    };
    setTasksMap(nextMap);
  }, []);

  // Execute operation across ALL 4 frameworks simultaneously in split screen
  const handleRunSimultaneousOp = async (op: BenchmarkOp) => {
    if (isExecuting) return;
    setIsExecuting(true);

    const nextMetrics = { ...metricsMap };
    const nextTasks = { ...tasksMap };

    for (const fw of frameworks) {
      const ref = containerRefs[fw].current;
      if (ref) {
        const { result, updatedTasks } = await runFrameworkBenchmark(
          fw,
          op,
          ref,
          tasksMap[fw],
          itemCount
        );

        nextMetrics[fw] = result;
        nextTasks[fw] = updatedTasks;
        onRecordResult(result);
      }
    }

    setMetricsMap(nextMetrics);
    setTasksMap(nextTasks);
    setIsExecuting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sandbox Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-semibold">
                4-Way Split Sandbox
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Simultaneous DOM Execution</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Trigger DOM operations across React, Angular, Vue, and Svelte simultaneously to observe side-by-side performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunSimultaneousOp('initialRender100')}
              disabled={isExecuting}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Render 100
            </button>
            <button
              onClick={() => handleRunSimultaneousOp('initialRender500')}
              disabled={isExecuting}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Render 500
            </button>
            <button
              onClick={() => handleRunSimultaneousOp('initialRender1000')}
              disabled={isExecuting}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Render 1,000
            </button>
            <button
              onClick={() => handleRunSimultaneousOp('update50')}
              disabled={isExecuting}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Update 50 Tasks
            </button>
            <button
              onClick={() => handleRunSimultaneousOp('delete50')}
              disabled={isExecuting}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              Delete 50 Tasks
            </button>
          </div>
        </div>

        {/* Action Trigger Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-mono font-medium mr-2">Quick Actions:</span>
          {BENCHMARK_OPERATIONS.map((op) => (
            <button
              key={op.id}
              onClick={() => handleRunSimultaneousOp(op.id)}
              disabled={isExecuting}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all font-medium"
            >
              {op.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {frameworks.map((fwId) => {
          const fw = FRAMEWORKS[fwId];
          const metric = metricsMap[fwId];
          const tasks = tasksMap[fwId];

          return (
            <div
              key={fwId}
              className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between`}
            >
              {/* Framework Header Card */}
              <div className="space-y-2 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                      <div dangerouslySetInnerHTML={{ __html: fw.logoSvg }} />
                    </span>
                    <span className="text-base font-bold text-slate-900">{fw.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800`}>
                    v{fw.version}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono leading-tight">{fw.architecture}</div>
              </div>

              {/* Metrics Display Card */}
              {metric ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600 text-[10px]">
                    <span>Last Run Duration:</span>
                    <span className="text-emerald-600 font-bold text-xs">{metric.durationMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[10px]">
                    <span>DOM Mutations:</span>
                    <span className="text-sky-600 font-bold">{metric.domMutations} ops</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[10px]">
                    <span>Est. Memory:</span>
                    <span className="text-amber-600 font-bold">{metric.memoryEstKb} KB</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-400 text-center">
                  Click action button to test {fw.name} engine
                </div>
              )}

              {/* Live Rendered Container */}
              <div className="space-y-1.5 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Task Node Tree</span>
                  <span>{tasks.length} items</span>
                </div>
                <div className="flex-1 max-h-64 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200 custom-scrollbar">
                  <div ref={containerRefs[fwId]} id={`split-sandbox-${fwId}`}>
                    {/* Rendered by engine */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
