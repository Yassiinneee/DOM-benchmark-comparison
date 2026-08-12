import React, { useState } from 'react';
import { FrameworkId, BenchmarkResult, BenchmarkOp } from '../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
import { runFrameworkBenchmark } from '../services/domBenchmarkEngine';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Play, Trophy, Cpu, Zap, RotateCcw, CheckCircle2 } from 'lucide-react';

interface BenchmarkSuiteProps {
  itemCount: number;
  benchmarkResults: BenchmarkResult[];
  onRecordResult: (result: BenchmarkResult) => void;
  onClearResults: () => void;
}

export const BenchmarkSuite: React.FC<BenchmarkSuiteProps> = ({
  itemCount,
  benchmarkResults,
  onRecordResult,
  onClearResults,
}) => {
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [activeMetricChart, setActiveMetricChart] = useState<'durationMs' | 'domMutations' | 'memoryEstKb'>('durationMs');
  const [selectedOpFilter, setSelectedOpFilter] = useState<BenchmarkOp>('initialRender');

  const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];

  // Run full benchmark suite across all frameworks & operations
  const handleRunFullSuite = async () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '-9999px';
    document.body.appendChild(hiddenContainer);

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
            itemCount
          );

          onRecordResult(result);
          hiddenContainer.removeChild(sandbox);
        }
      }
    } catch (err) {
      console.error('Error running benchmark suite:', err);
    } finally {
      document.body.removeChild(hiddenContainer);
      setIsBenchmarking(false);
    }
  };

  // Transform benchmark results into Recharts dataset for selected operation
  const chartData = frameworks.map((fwId) => {
    const fw = FRAMEWORKS[fwId];
    const opResults = benchmarkResults.filter((r) => r.framework === fwId && r.op === selectedOpFilter);
    const latest = opResults[opResults.length - 1];

    return {
      framework: fw.name,
      durationMs: latest ? latest.durationMs : 0,
      domMutations: latest ? latest.domMutations : 0,
      memoryEstKb: latest ? latest.memoryEstKb : 0,
      color: fwId === 'react' ? '#0284c7' : fwId === 'angular' ? '#dc2626' : fwId === 'vue' ? '#059669' : '#d97706',
    };
  });

  // Calculate Leaderboard Winners for the active operation
  const sortedWinners = [...chartData]
    .filter((d) => d.durationMs > 0)
    .sort((a, b) => a[activeMetricChart] - b[activeMetricChart]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Benchmark Control Bar & Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 font-mono text-xs font-semibold">
              Comparative Analysis
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Automated DOM Benchmark Suite</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Compare render time, DOM mutations, and memory footprints side-by-side across React, Angular, Vue, and Svelte.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearResults}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Data
          </button>

          <button
            onClick={handleRunFullSuite}
            disabled={isBenchmarking}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
              isBenchmarking
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
          >
            {isBenchmarking ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Benchmarking Framework Engines...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run Part 2 Standard Suite (100, 500, 1,000, Update 50, Delete 50)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Part 2 Focus Card: Operations Summary */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-xs font-bold">
              Part 2 Core Operations
            </span>
            <h3 className="text-base font-bold text-slate-900">Required Benchmark Scenarios</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">React • Angular • Vue • Svelte</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-indigo-700 font-mono">1. Initial Rendering</span>
            <p className="text-xs text-slate-600">Measure render duration for <strong>100</strong>, <strong>500</strong>, and <strong>1,000</strong> tasks from cold DOM state.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-700 font-mono">2. DOM Updates</span>
            <p className="text-xs text-slate-600">Measure time taken to update priority and text for <strong>50 tasks</strong> in place.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-rose-700 font-mono">3. DOM Deletion</span>
            <p className="text-xs text-slate-600">Measure time taken to filter out and delete <strong>50 tasks</strong> from the active DOM tree.</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Summary Medals */}
      {sortedWinners.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sortedWinners.slice(0, 3).map((winner, idx) => {
            const medal = idx === 0 ? '🥇 1st Place' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place';
            const medalClass =
              idx === 0
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : idx === 1
                ? 'border-slate-200 bg-slate-100 text-slate-800'
                : 'border-amber-200 bg-amber-50/60 text-amber-900';

            return (
              <div
                key={winner.framework}
                className={`p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 relative overflow-hidden bg-white`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${medalClass}`}>
                    {medal}
                  </span>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-slate-900">{winner.framework}</div>
                <div className="text-xs text-slate-500 font-mono">
                  {activeMetricChart === 'durationMs'
                    ? `${winner.durationMs} ms Execution Duration`
                    : activeMetricChart === 'domMutations'
                    ? `${winner.domMutations.toLocaleString()} DOM Operations`
                    : `${winner.memoryEstKb.toLocaleString()} KB Memory Footprint`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Benchmark Chart Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-600" />
              Comparative Performance Metrics Chart
            </h3>
            <p className="text-xs text-slate-500">
              Select operation and metric to compare DOM engine efficiency.
            </p>
          </div>

          {/* Operation & Metric Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedOpFilter}
              onChange={(e) => setSelectedOpFilter(e.target.value as BenchmarkOp)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-600 font-medium"
            >
              {BENCHMARK_OPERATIONS.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name}
                </option>
              ))}
            </select>

            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setActiveMetricChart('durationMs')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeMetricChart === 'durationMs'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Time (ms)
              </button>
              <button
                onClick={() => setActiveMetricChart('domMutations')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeMetricChart === 'domMutations'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                DOM Ops
              </button>
              <button
                onClick={() => setActiveMetricChart('memoryEstKb')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeMetricChart === 'memoryEstKb'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Memory (KB)
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-80 w-full pt-4">
          {benchmarkResults.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Zap className="w-8 h-8 text-slate-300" />
              <p className="text-sm">No benchmark data recorded yet.</p>
              <button
                onClick={handleRunFullSuite}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs"
              >
                Run First Benchmark Pass
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="framework" stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                />
                <Bar
                  dataKey={activeMetricChart}
                  name={
                    activeMetricChart === 'durationMs'
                      ? 'Duration (ms)'
                      : activeMetricChart === 'domMutations'
                      ? 'DOM Mutations'
                      : 'Est. Memory (KB)'
                  }
                  radius={[8, 8, 0, 0]}
                  fill="#0284c7"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Comprehensive Benchmark Results Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Full Benchmark Log Table
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700 font-mono">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Framework</th>
                <th className="p-3">Operation</th>
                <th className="p-3">Item Count</th>
                <th className="p-3">Time (ms)</th>
                <th className="p-3">DOM Operations</th>
                <th className="p-3">Est. Memory (KB)</th>
                <th className="p-3">FPS Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {benchmarkResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400 font-sans">
                    Run the benchmark suite above to populate performance metrics table.
                  </td>
                </tr>
              ) : (
                benchmarkResults.map((res) => {
                  const fw = FRAMEWORKS[res.framework];
                  const op = BENCHMARK_OPERATIONS.find((o) => o.id === res.op);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${fw.borderAccent.replace('border-', 'bg-')}`} />
                        {fw.name}
                      </td>
                      <td className="p-3 text-slate-700">{op?.name || res.op}</td>
                      <td className="p-3 text-slate-500">{res.itemCount.toLocaleString()}</td>
                      <td className="p-3 font-semibold text-emerald-600">{res.durationMs} ms</td>
                      <td className="p-3 text-sky-600">{res.domMutations.toLocaleString()}</td>
                      <td className="p-3 text-amber-600">{res.memoryEstKb.toLocaleString()} KB</td>
                      <td className="p-3 text-purple-600">{res.fps} FPS</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chrome DevTools & Measurement Guide */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-mono text-xs font-semibold">
            DevTools & Profiling Guide
          </span>
          <h3 className="text-lg font-bold text-slate-900">How to Measure with External Tools</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          You can verify and cross-examine these benchmark scores using native Chrome DevTools or third-party profiling libraries:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 font-sans">1. Chrome DevTools Performance Panel</h4>
            <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
              <li>Press <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">F12</code> or <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">Cmd+Option+I</code> and navigate to <strong>Performance</strong>.</li>
              <li>Click <strong>Record (Cmd+E)</strong> before triggering a benchmark operation (e.g. Initial Render 1,000 tasks).</li>
              <li>Inspect <strong>Scripting</strong> vs <strong>Rendering</strong> vs <strong>Painting</strong> breakdowns in the flamechart.</li>
              <li>Observe recalculate style & layout reflow durations.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 font-sans">2. User Timing API & Memory Inspector</h4>
            <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
              <li>Use <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">performance.mark('op-start')</code> & <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">performance.measure()</code> for sub-millisecond accuracy.</li>
              <li>Inspect Chrome <strong>Memory</strong> tab -&gt; <strong>Take Heap Snapshot</strong> before and after rendering 1,000 tasks to calculate exact heap memory delta (KB).</li>
              <li>Use <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">MutationObserver</code> to audit real-time DOM element node insertions/removals.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
