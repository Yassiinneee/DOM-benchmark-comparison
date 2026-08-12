import React, { useState, useRef, useEffect } from 'react';
import { FrameworkId, Task, Priority, BenchmarkResult, BenchmarkOp } from '../types';
import { FRAMEWORKS, BENCHMARK_OPERATIONS } from '../data/frameworksData';
import { runFrameworkBenchmark, generateTasks } from '../services/domBenchmarkEngine';
import { Play, Plus, Edit3, ArrowRightLeft, Trash2, Filter, Code, CheckCircle2, Cpu, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

interface FrameworkWorkbenchProps {
  itemCount: number;
  onRecordResult: (result: BenchmarkResult) => void;
}

export const FrameworkWorkbench: React.FC<FrameworkWorkbenchProps> = ({
  itemCount,
  onRecordResult,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId>('react');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('Medium');
  const [lastMetric, setLastMetric] = useState<BenchmarkResult | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'todoComponent' | 'templateView' | 'stateAndOperations' | 'domOptimization'>('todoComponent');
  const [isRunning, setIsRunning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const frameworkList: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];
  const fwInfo = FRAMEWORKS[selectedFramework];

  // Initialize sandbox with sample tasks when framework changes
  useEffect(() => {
    const initial = generateTasks(50, selectedFramework);
    setTasks(initial);
    setLastMetric(null);
  }, [selectedFramework]);

  // Execute benchmark operation on the selected framework DOM engine
  const handleExecuteOp = async (op: BenchmarkOp) => {
    if (!containerRef.current || isRunning) return;
    setIsRunning(true);

    try {
      const { result, updatedTasks } = await runFrameworkBenchmark(
        selectedFramework,
        op,
        containerRef.current,
        tasks,
        itemCount
      );

      setTasks(updatedTasks);
      setLastMetric(result);
      onRecordResult(result);
    } catch (err) {
      console.error('Benchmark execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Manual Add Task handler
  const handleManualAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: `${selectedFramework}-${Date.now()}`,
      name: taskName,
      priority: taskPriority,
      createdAt: Date.now(),
      completed: false,
    };

    const next = [newTask, ...tasks];
    setTasks(next);
    setTaskName('');
  };

  // Next / Previous Framework handlers for step-by-step workflow
  const currentIdx = frameworkList.indexOf(selectedFramework);
  const goToNextFw = () => {
    if (currentIdx < frameworkList.length - 1) {
      setSelectedFramework(frameworkList[currentIdx + 1]);
    }
  };
  const goToPrevFw = () => {
    if (currentIdx > 0) {
      setSelectedFramework(frameworkList[currentIdx - 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Framework Step Selector Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                Step {currentIdx + 1} of 4
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Framework-by-Framework Deep Dive</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Analyze how each JavaScript framework handles DOM manipulations, template binding, and state reconciliation.
            </p>
          </div>

          {/* Framework Step Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevFw}
              disabled={currentIdx === 0}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                currentIdx === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={goToNextFw}
              disabled={currentIdx === frameworkList.length - 1}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                currentIdx === frameworkList.length - 1
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-xs'
              }`}
            >
              Next Framework
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Framework Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {frameworkList.map((fwId) => {
            const info = FRAMEWORKS[fwId];
            const isSelected = selectedFramework === fwId;
            return (
              <button
                key={fwId}
                onClick={() => setSelectedFramework(fwId)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-800`}>
                    v{info.version}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="text-lg font-bold text-slate-900">{info.name}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{info.architecture}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Framework Header Card */}
      <div className={`p-6 rounded-2xl border border-slate-200 bg-white shadow-xs relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className={`p-2.5 rounded-xl bg-slate-100 border border-slate-200`}>
                <div dangerouslySetInnerHTML={{ __html: fwInfo.logoSvg }} />
              </span>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  {fwInfo.name}
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-800`}>
                    {fwInfo.architecture}
                  </span>
                </h3>
                <p className="text-sm text-slate-600 font-medium mt-0.5">{fwInfo.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {fwInfo.description}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 w-full lg:w-80 font-mono">
            <div className="text-slate-700 font-bold border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>DOM Strategy Overview</span>
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-slate-600 leading-relaxed text-[11px]">
              {fwInfo.domStrategy}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Sandbox + Code Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive To-Do List Sandbox & Benchmarker (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  {fwInfo.name} DOM Manipulation Sandbox
                </h4>
                <p className="text-xs text-slate-500">
                  Execute DOM updates live on {tasks.length.toLocaleString()} task items using {fwInfo.name}'s core engine.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                Active Items: <strong className="text-slate-900">{tasks.length.toLocaleString()}</strong>
              </span>
            </div>

            {/* Manual Task Creator Form */}
            <form onSubmit={handleManualAddTask} className="flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name (e.g., Optimize VDOM tree)..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-all"
              />
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as Priority)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </form>

            {/* DOM Benchmark Trigger Buttons */}
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider font-mono">
                Execute DOM Benchmark Operations
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleExecuteOp('initialRender100')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Play className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Render 100</div>
                    <div className="text-[10px] text-slate-500">100 Initial Tasks</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('initialRender500')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Play className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Render 500</div>
                    <div className="text-[10px] text-slate-500">500 Initial Tasks</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('initialRender1000')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Play className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Render 1,000</div>
                    <div className="text-[10px] text-slate-500">1,000 Initial Tasks</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('update50')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Edit3 className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Update 50 Tasks</div>
                    <div className="text-[10px] text-slate-500">In-Place Mutation</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('delete50')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Trash2 className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Delete 50 Tasks</div>
                    <div className="text-[10px] text-slate-500">Remove from DOM</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('add1000')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Plus className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Append Tasks</div>
                    <div className="text-[10px] text-slate-500">+1,000 Tasks</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('updateEvery10th')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Edit3 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Update 10th</div>
                    <div className="text-[10px] text-slate-500">Every 10th Row</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('swapRows')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <ArrowRightLeft className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Swap Rows</div>
                    <div className="text-[10px] text-slate-500">#1 and #10</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExecuteOp('clearAll')}
                  disabled={isRunning}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left text-xs text-slate-800 transition-all flex items-center gap-2 group"
                >
                  <Trash2 className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-slate-900">Clear All</div>
                    <div className="text-[10px] text-slate-500">Empty DOM</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Benchmark Results Indicator Panel */}
            {lastMetric && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-indigo-700 font-bold border-b border-slate-200 pb-2">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    Metric Log: {BENCHMARK_OPERATIONS.find(o => o.id === lastMetric.op)?.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Recorded {new Date(lastMetric.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Time Duration</div>
                    <div className="text-base font-bold text-emerald-600 mt-0.5">
                      {lastMetric.durationMs} <span className="text-xs font-normal">ms</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">DOM Operations</div>
                    <div className="text-base font-bold text-sky-600 mt-0.5">
                      {lastMetric.domMutations.toLocaleString()} <span className="text-xs font-normal">ops</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Est. Memory</div>
                    <div className="text-base font-bold text-amber-600 mt-0.5">
                      {lastMetric.memoryEstKb.toLocaleString()} <span className="text-xs font-normal">KB</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500">Frame Budget Score</div>
                    <div className="text-base font-bold text-purple-600 mt-0.5">
                      {lastMetric.fps} <span className="text-xs font-normal">FPS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Rendered DOM Sandbox Viewport */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Rendered DOM Viewport ({tasks.length} elements)</span>
                <span>Container: #sandbox-{selectedFramework}</span>
              </div>
              <div className="max-h-72 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200 custom-scrollbar">
                <div ref={containerRef} id={`sandbox-${selectedFramework}`}>
                  {/* Managed dynamically by domBenchmarkEngine.ts */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Inspector & Implementation Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                {fwInfo.name} Idiomatic Implementation
              </h4>
            </div>

            {/* Code Snippet Tabs */}
            <div className="flex border-b border-slate-200 space-x-1 text-xs font-medium overflow-x-auto no-scrollbar">
              {[
                { id: 'todoComponent', label: 'Component & State' },
                { id: 'templateView', label: 'Template / JSX' },
                { id: 'stateAndOperations', label: 'DOM Operations' },
                { id: 'domOptimization', label: 'DOM Engine' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeTab(tab.id as any)}
                  className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${
                    activeCodeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Code Snippet View */}
            <div className="space-y-3">
              <div className="text-xs text-slate-700 font-semibold flex items-center justify-between">
                <span>{fwInfo.codeSnippets[activeCodeTab].title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                  {fwInfo.codeSnippets[activeCodeTab].language}
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 custom-scrollbar max-h-96">
                <code>{fwInfo.codeSnippets[activeCodeTab].code}</code>
              </pre>

              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                <strong className="text-indigo-700 block mb-1">Architectural Takeaway:</strong>
                {fwInfo.codeSnippets[activeCodeTab].explanation}
              </div>
            </div>

            {/* Key Mechanisms Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Key Architectural Features
              </h5>
              <div className="space-y-2">
                {fwInfo.keyMechanisms.map((km, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="font-semibold text-slate-900">{km.title}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">{km.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
