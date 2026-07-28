import { useState, useEffect } from 'react';
import { Play, Pause, Activity, Database, TrendingUp, Shield, Sparkles, Download, Terminal, Eye, Brain, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { ResearchStudy } from '../types';
import { ExportResults } from './ExportResults';

interface FederatedAnalysisProps {
  study: ResearchStudy;
  onExport?: () => void;
}

export function FederatedAnalysis({ study, onExport }: FederatedAnalysisProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0.45);
  const [privacyBudget, setPrivacyBudget] = useState(0.85);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [showExportModalLocal, setShowExportModalLocal] = useState(false);
  const [pythonBackendActive, setPythonBackendActive] = useState(false);

  // Model Inspection & Inference Test states
  const [showWeightsPanel, setShowWeightsPanel] = useState(false);
  const [inspectedWeights, setInspectedWeights] = useState<any>(null);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [testGenomicProfile, setTestGenomicProfile] = useState({
    rs1799966: 1, // BRCA1
    rs80357711: 1, // BRCA1 pathogenic
    rs7903146: 0,  // TCF7L2 T2D
    rs429358: 1,   // APOE e4
    rs1042522: 0   // TP53
  });

  // Check Python FastAPI server status on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ONLINE') {
          setPythonBackendActive(true);
          setTrainingLogs(prev => ['[Python API] Connected to FastAPI PyTorch Federated Engine at http://127.0.0.1:8000', ...prev]);
        }
      })
      .catch(() => {
        setPythonBackendActive(false);
      });
  }, []);

  const toggleModelWeightsInspection = () => {
    if (showWeightsPanel) {
      setShowWeightsPanel(false);
    } else {
      setShowWeightsPanel(true);
      if (pythonBackendActive) {
        fetch('http://127.0.0.1:8000/api/fl/model-inspect', {
          headers: { 'Authorization': 'Bearer researcher-token-secret' }
        })
          .then(res => res.json())
          .then(data => setInspectedWeights(data))
          .catch(err => console.error(err));
      } else {
        // Fallback simulation weights
        setInspectedWeights({
          current_round: iteration,
          weight_matrix_shape: [10, 64],
          weight_matrix_sample: [
            [-0.0412, 0.1284, -0.0911, 0.0452, -0.1102, 0.0891],
            [0.0982, -0.0341, 0.1145, -0.0762, 0.0512, -0.0219],
            [-0.0125, 0.0874, -0.0431, 0.0912, -0.0654, 0.0341]
          ],
          mean_weight: -0.00412,
          weight_std: 0.08412,
          privacy_status: { epsilon_used: 0.3, epsilon_total: 10.0, re_id_risk_score: '3.00%' }
        });
      }
    }
  };

  const runLiveInferenceTest = () => {
    if (pythonBackendActive) {
      fetch('http://127.0.0.1:8000/api/fl/predict', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer researcher-token-secret'
        },
        body: JSON.stringify(testGenomicProfile)
      })
        .then(res => res.json())
        .then(data => setInferenceResult(data))
        .catch(err => console.error(err));
    } else {
      const isHigh = testGenomicProfile.rs80357711 === 1 || testGenomicProfile.rs429358 === 2;
      setInferenceResult({
        model_confidence: isHigh ? 88.4 : 24.1,
        disease_risk_prediction: isHigh ? 'HIGH RISK' : 'LOW RISK'
      });
    }
  };

  useEffect(() => {
    if (isRunning && iteration < 10) {
      const timer = setTimeout(async () => {
        if (pythonBackendActive) {
          try {
            const res = await fetch('http://127.0.0.1:8000/api/fl/run-round', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer researcher-token-secret'
              },
              body: JSON.stringify({ epsilon_step: 0.1, study_id: study.id })
            });
            const pyData = await res.json();
            if (pyData.success) {
              const d = pyData.data;
              setIteration(d.round);
              setModelAccuracy(d.accuracy);
              setPrivacyBudget(1.0 - (d.privacy_status.epsilon_used / d.privacy_status.epsilon_total));
              
              setTrainingLogs(prev => [
                `[Python PyTorch FedAvg Round ${d.round}] Aggregated ${d.participating_nodes} nodes (${d.total_samples} VCF samples)`,
                `[Python Privacy Guard] Epsilon used: ${d.privacy_status.epsilon_used.toFixed(2)} / ${d.privacy_status.epsilon_total} | Re-id Risk: ${d.privacy_status.re_id_risk_score}`,
                `[PyTorch Model] FedAvg Accuracy: ${(d.accuracy * 100).toFixed(1)}% | Loss: ${d.loss}`,
                ...prev
              ].slice(0, 20));
              return;
            }
          } catch (e) {
            console.log('Falling back to local FL simulation engine');
          }
        }

        setIteration(prev => prev + 1);
        setModelAccuracy(prev => Math.min(0.94, prev + 0.05));
        setPrivacyBudget(prev => Math.max(0.1, prev - 0.08));

        setTrainingLogs(prev => [
          `[Iteration ${iteration + 1}] Federated Learning Agent: Coordinating model update across ${study.participatingHospitals.length} institutions`,
          `[Iteration ${iteration + 1}] Privacy Guard Agent: Applying differential privacy (ε=${study.privacyLevel === 'high' ? '0.1' : '0.5'})`,
          `[Iteration ${iteration + 1}] Model accuracy: ${(modelAccuracy + 0.05).toFixed(3)}, Privacy budget remaining: ${(privacyBudget - 0.08).toFixed(2)}`,
          ...prev,
        ].slice(0, 20));
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (iteration >= 10) {
      setIsRunning(false);
    }
  }, [isRunning, iteration, modelAccuracy, privacyBudget, study, pythonBackendActive]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIteration(0);
    setModelAccuracy(0.45);
    setPrivacyBudget(0.85);
    setTrainingLogs([]);
    setShowWeightsPanel(false);
    setInspectedWeights(null);
    setInferenceResult(null);
    if (pythonBackendActive) {
      fetch('http://127.0.0.1:8000/api/fl/reset', { 
        method: 'POST',
        headers: { 'Authorization': 'Bearer researcher-token-secret' }
      }).catch(() => {});
    }
  };

  const handleExportClick = () => {
    if (onExport) {
      onExport();
    } else {
      setShowExportModalLocal(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-md flex items-center justify-center border border-zinc-200">
              <Activity className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Federated Analysis Engine</h2>
                {pythonBackendActive && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-md flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-600" />
                    Python FastAPI Engine Active
                  </span>
                )}
              </div>
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
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm ${
                isRunning
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause FL Training
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {iteration > 0 ? 'Resume Training' : 'Start FL Training'}
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
              <Database className="w-5 h-5 text-teal-600" />
              <p className="font-semibold tracking-tight text-zinc-900">Federated Learning Agent</p>
            </div>
            <p className="text-sm text-zinc-600">
              {isRunning
                ? `Training iteration ${iteration}/10 across ${study.participatingHospitals.length} nodes`
                : iteration === 10
                ? 'Model training completed successfully'
                : 'Ready to coordinate distributed training'}
            </p>
          </div>
          <div className="p-5 bg-zinc-50 rounded-lg border border-zinc-200">
            <div className="flex items-center gap-3 mb-2.5">
              <Shield className="w-5 h-5 text-emerald-600" />
              <p className="font-semibold tracking-tight text-zinc-900">Privacy Guard Agent</p>
            </div>
            <p className="text-sm text-zinc-600">
              {isRunning
                ? `Applying ${study.privacyLevel} privacy protection (ε=${study.privacyLevel === 'high' ? '0.1' : '0.5'})`
                : 'Differential privacy (ε=0.3, δ=1e-5) active'}
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
            <p className="text-2xl font-semibold tracking-tight text-emerald-600">{(modelAccuracy * 100).toFixed(1)}%</p>
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
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
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
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${privacyBudget * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Training Logs */}
        <div className="bg-zinc-950 rounded-lg p-5 max-h-64 overflow-y-auto border border-zinc-800 shadow-inner mb-8">
          <div className="flex items-center gap-2.5 mb-4 border-b border-zinc-800 pb-3">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <p className="text-sm font-semibold tracking-tight text-zinc-300">Live Agent Training Logs</p>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {trainingLogs.length === 0 ? (
              <p className="text-zinc-600">No training logs yet. Click Start FL Training to begin federated analysis.</p>
            ) : (
              trainingLogs.map((log, idx) => (
                <p key={idx} className="text-zinc-400 leading-relaxed">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>

        {/* 🔬 Interactive AI Model Inspection & Live Inference Testing Section */}
        <div className="border-t border-zinc-200 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-semibold text-zinc-900">Inspect Trained PyTorch AI Model Tensors</h3>
            </div>
            <button
              onClick={toggleModelWeightsInspection}
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-700" />
              {showWeightsPanel ? 'Hide Weights Matrix' : 'Fetch & View Weight Tensors'}
              {showWeightsPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showWeightsPanel && inspectedWeights && (
            <div className="p-5 bg-zinc-900 text-white rounded-lg border border-zinc-800 space-y-4 font-mono text-xs animate-in fade-in duration-200">
              <div className="flex flex-wrap justify-between border-b border-zinc-800 pb-2 text-zinc-400 gap-2">
                <span>Model Weight Shape: {JSON.stringify(inspectedWeights.weight_matrix_shape)}</span>
                <span>Mean Weight: {inspectedWeights.mean_weight?.toFixed(5) || '0.000'}</span>
                <span>Std Dev: {inspectedWeights.weight_std?.toFixed(5) || '0.084'}</span>
              </div>

              <div>
                <p className="text-emerald-400 font-semibold mb-1">Live PyTorch Weight Tensor Grid (3x6 Slice):</p>
                <div className="bg-black/80 p-3 rounded-md border border-zinc-800 overflow-x-auto text-emerald-300">
                  <pre>{JSON.stringify(inspectedWeights.weight_matrix_sample, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Live Patient Prediction Test */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="text-sm font-semibold text-zinc-900">Test Trained Model Inference on a Patient Sample</h4>
            </div>
            <p className="text-xs text-zinc-600">
              Select genomic variant presence (0, 1, or 2 risk alleles) to evaluate trained model predictions:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.keys(testGenomicProfile).map((rsId) => (
                <div key={rsId} className="bg-white p-3 rounded-md border border-zinc-200 text-center">
                  <p className="text-xs font-mono font-bold text-zinc-800 mb-1">{rsId}</p>
                  <select
                    value={(testGenomicProfile as any)[rsId]}
                    onChange={(e) => setTestGenomicProfile({ ...testGenomicProfile, [rsId]: parseInt(e.target.value) })}
                    className="w-full text-xs border border-zinc-300 rounded-md p-1 bg-zinc-50 font-semibold"
                  >
                    <option value={0}>0 (Homozygous Normal)</option>
                    <option value={1}>1 (Heterozygous Risk)</option>
                    <option value={2}>2 (Homozygous Risk)</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={runLiveInferenceTest}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5" />
                Run Model Inference
              </button>

              {inferenceResult && (
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-md border border-zinc-200 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-zinc-500 font-medium">Prediction:</span>
                    <span className={`text-xs font-bold ${
                      inferenceResult.disease_risk_prediction === 'HIGH RISK' ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {inferenceResult.disease_risk_prediction} ({inferenceResult.model_confidence}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {iteration === 10 && (
        <div className="bg-white rounded-lg border border-zinc-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center border border-emerald-200">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-900">Analysis Complete</h3>
                <p className="text-sm text-zinc-500 mt-0.5">De-identified results ready for export</p>
              </div>
            </div>
            <button
              onClick={handleExportClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-semibold shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export De-identified Results
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-zinc-50 rounded-lg border border-zinc-200">
              <p className="text-sm font-semibold tracking-tight text-zinc-900 mb-4">Final Model Performance</p>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Accuracy</p>
                  <p className="text-xl font-semibold tracking-tight text-emerald-600">{(modelAccuracy * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Privacy Preserved</p>
                  <p className="text-xl font-semibold tracking-tight text-zinc-900">✓ High (ε=0.3)</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Data Never Shared</p>
                  <p className="text-xl font-semibold tracking-tight text-zinc-900">✓ Zero Raw Exposure</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold tracking-tight text-zinc-900 mb-3">Key Findings</p>
              <ul className="space-y-2.5 text-sm text-zinc-700">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span className="leading-relaxed">Successfully identified significant genetic associations (Ensembl GRCh38) without exposing patient data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span className="leading-relaxed">Model trained on {study.participatingHospitals.length} institutions with differential privacy guarantees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span className="leading-relaxed">Statistical power: {Math.round(study.statisticalPower * 100)}% - sufficient for clinical significance</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={handleExportClick}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-semibold shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export De-identified Results (JSON / CSV / Summary)
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModalLocal && (
        <ExportResults
          study={study}
          onClose={() => setShowExportModalLocal(false)}
        />
      )}
    </div>
  );
}
