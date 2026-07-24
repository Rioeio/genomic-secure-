import { useState, useEffect } from 'react';
import { Play, Pause, Lock, Activity, Database, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { ResearchStudy } from '../types';

interface FederatedAnalysisProps {
  study: ResearchStudy;
}

export function FederatedAnalysis({ study }: FederatedAnalysisProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0.45);
  const [privacyBudget, setPrivacyBudget] = useState(0.85);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isRunning && iteration < 10) {
      const timer = setTimeout(() => {
        setIteration(prev => prev + 1);
        setModelAccuracy(prev => Math.min(0.94, prev + 0.05));
        setPrivacyBudget(prev => Math.max(0.1, prev - 0.08));

        setTrainingLogs(prev => [
          `[Iteration ${iteration + 1}] Federated Learning Agent: Coordinating model update across ${study.participatingHospitals.length} institutions`,
          `[Iteration ${iteration + 1}] Privacy Guard Agent: Applying differential privacy (ε=${study.privacyLevel === 'high' ? '0.1' : '0.5'})`,
          `[Iteration ${iteration + 1}] Model accuracy: ${(modelAccuracy + 0.05).toFixed(3)}, Privacy budget remaining: ${(privacyBudget - 0.08).toFixed(2)}`,
          ...prev,
        ].slice(0, 20));
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (iteration >= 10) {
      setIsRunning(false);
    }
  }, [isRunning, iteration, modelAccuracy, privacyBudget, study]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIteration(0);
    setModelAccuracy(0.45);
    setPrivacyBudget(0.85);
    setTrainingLogs([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-zinc-200 p-8 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
              <Activity className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Federated Analysis</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{study.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-50 transition-colors text-sm font-medium shadow-sm"
            >
              Reset
            </button>
            <button
              onClick={handleStartStop}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm ${
                isRunning
                  ? 'bg-zinc-100 text-zinc-900 border border-zinc-300 hover:bg-zinc-200'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Multi-Agent Status */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-zinc-50 rounded-lg border border-zinc-200">
            <div className="flex items-center gap-3 mb-2.5">
              <Database className="w-5 h-5 text-zinc-700" />
              <p className="font-semibold tracking-tight text-zinc-900">Federated Learning Agent</p>
            </div>
            <p className="text-sm text-zinc-600">
              {isRunning
                ? `Training iteration ${iteration}/10 across ${study.participatingHospitals.length} nodes`
                : 'Ready to coordinate distributed training'}
            </p>
          </div>
          <div className="p-5 bg-zinc-50 rounded-lg border border-zinc-200">
            <div className="flex items-center gap-3 mb-2.5">
              <Shield className="w-5 h-5 text-zinc-700" />
              <p className="font-semibold tracking-tight text-zinc-900">Privacy Guard Agent</p>
            </div>
            <p className="text-sm text-zinc-600">
              {isRunning
                ? `Applying ${study.privacyLevel} privacy protection (ε=${study.privacyLevel === 'high' ? '0.1' : '0.5'})`
                : 'Differential privacy configured'}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-white rounded-lg border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Iteration</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900">{iteration}<span className="text-zinc-400 text-lg font-normal">/10</span></p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Model Accuracy</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900">{(modelAccuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Privacy Budget</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900">{privacyBudget.toFixed(2)}</p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1.5">Active Nodes</p>
            <p className="text-2xl font-semibold tracking-tight text-zinc-900">{study.participatingHospitals.length}</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-5 mb-8">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-900 font-semibold">Training Progress</span>
              <span className="text-zinc-500 font-medium">{Math.round((iteration / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2 border border-zinc-200 overflow-hidden">
              <div
                className="bg-zinc-900 h-full rounded-full transition-all duration-500"
                style={{ width: `${(iteration / 10) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-900 font-semibold">Privacy Budget Remaining</span>
              <span className="text-zinc-500 font-medium">{Math.round(privacyBudget * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2 border border-zinc-200 overflow-hidden">
              <div
                className="bg-zinc-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${privacyBudget * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Training Logs */}
        <div className="bg-zinc-950 rounded-lg p-5 max-h-64 overflow-y-auto border border-zinc-800 shadow-inner">
          <div className="flex items-center gap-2.5 mb-4 border-b border-zinc-800 pb-3">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <p className="text-sm font-semibold tracking-tight text-zinc-300">Training Logs</p>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {trainingLogs.length === 0 ? (
              <p className="text-zinc-600">No training logs yet. Click Start to begin federated analysis.</p>
            ) : (
              trainingLogs.map((log, idx) => (
                <p key={idx} className="text-zinc-400 leading-relaxed">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {iteration === 10 && (
        <div className="bg-white rounded-lg border border-zinc-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
            <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
              <TrendingUp className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900">Analysis Complete</h3>
              <p className="text-sm text-zinc-500 mt-0.5">De-identified results available</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-zinc-50 rounded-lg border border-zinc-200">
              <p className="text-sm font-semibold tracking-tight text-zinc-900 mb-4">Final Model Performance</p>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Accuracy</p>
                  <p className="text-xl font-semibold tracking-tight text-zinc-900">{(modelAccuracy * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Privacy Preserved</p>
                  <p className="text-xl font-semibold tracking-tight text-zinc-900">✓ High</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Data Never Shared</p>
                  <p className="text-xl font-semibold tracking-tight text-zinc-900">✓ Yes</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold tracking-tight text-zinc-900 mb-3">Key Findings</p>
              <ul className="space-y-2.5 text-sm text-zinc-700">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span className="leading-relaxed">Successfully identified significant genetic associations without exposing patient data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span className="leading-relaxed">Model trained on {study.participatingHospitals.length} institutions with differential privacy guarantees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span className="leading-relaxed">Statistical power: {Math.round(study.statisticalPower * 100)}% - sufficient for clinical significance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span className="leading-relaxed">Privacy budget maintained within acceptable limits throughout training</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button className="w-full px-6 py-3 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-semibold shadow-sm">
                Export De-identified Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
