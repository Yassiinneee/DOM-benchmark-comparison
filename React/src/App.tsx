import React, { useState } from 'react';
import { FrameworkId, BenchmarkResult, BenchmarkOp } from './types';
import { Header } from './components/Header';
import { FrameworkWorkbench } from './components/FrameworkWorkbench';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { ArchitectureComparison } from './components/ArchitectureComparison';
import { LabReportModal } from './components/LabReportModal';
import { runFrameworkBenchmark } from './services/domBenchmarkEngine';
import { BENCHMARK_OPERATIONS } from './data/frameworksData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workbench' | 'suite' | 'sandbox' | 'architecture'>('workbench');
  const [itemCount, setItemCount] = useState<number>(1000);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([]);
  const [isLabReportOpen, setIsLabReportOpen] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  // Add recorded result ensuring no duplicate IDs
  const handleRecordResult = (res: BenchmarkResult) => {
    setBenchmarkResults((prev) => [res, ...prev.slice(0, 99)]);
  };

  const handleClearResults = () => {
    setBenchmarkResults([]);
  };

  // Run full benchmark suite across all frameworks from Header button
  const handleRunFullSuite = async () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);
    setActiveTab('suite');

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '-9999px';
    document.body.appendChild(hiddenContainer);

    const frameworks: FrameworkId[] = ['react', 'angular', 'vue', 'svelte'];

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

          handleRecordResult(result);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Header & Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        itemCount={itemCount}
        setItemCount={setItemCount}
        onRunSuite={handleRunFullSuite}
        onOpenLabReport={() => setIsLabReportOpen(true)}
        isBenchmarking={isBenchmarking}
      />

      {/* Main Content Views */}
      <main className="pb-16">
        {activeTab === 'workbench' && (
          <FrameworkWorkbench
            itemCount={itemCount}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeTab === 'suite' && (
          <BenchmarkSuite
            itemCount={itemCount}
            benchmarkResults={benchmarkResults}
            onRecordResult={handleRecordResult}
            onClearResults={handleClearResults}
          />
        )}

        {activeTab === 'sandbox' && (
          <InteractiveSandbox
            itemCount={itemCount}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureComparison />
        )}
      </main>

      {/* Lab Report Modal */}
      <LabReportModal
        isOpen={isLabReportOpen}
        onClose={() => setIsLabReportOpen(false)}
        benchmarkResults={benchmarkResults}
        itemCount={itemCount}
      />
    </div>
  );
}
