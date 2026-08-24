import React, { useState } from 'react';
import { 
  BarChart2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle, 
  Sliders, 
  Award, 
  Code, 
  Binary, 
  FolderGit2, 
  MessageSquare, 
  FileText, 
  Users,
  Compass,
  Check,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { simulationOptions, calculateSimulatedReadiness } from '../services/simulatorEngine';
import confetti from 'canvas-confetti';

export default function ReadinessDashboard({ 
  profile, 
  readinessData, 
  setActiveTab 
}) {
  const [activeView, setActiveView] = useState('readiness'); // 'readiness' | 'what-if'
  
  // What-If Simulator State
  const [activeSimIds, setActiveSimIds] = useState([]);
  const simulatedResult = calculateSimulatedReadiness(readinessData?.overallReadiness || 0, activeSimIds);

  const toggleSimOption = (simId) => {
    setActiveSimIds(prev => {
      const next = prev.includes(simId) 
        ? prev.filter(id => id !== simId)
        : [...prev, simId];

      if (!prev.includes(simId)) {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7 }
        });
      }
      return next;
    });
  };

  const radarData = readinessData?.pillars?.map(p => ({
    subject: p.name,
    score: p.score,
    fullMark: 100
  })) || [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Feature 10 & 11 — Career Readiness Score & What-If Simulator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Placement Readiness Intelligence & Growth Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Holistic 6-pillar placement readiness evaluation and dynamic simulation engine.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveView('readiness')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'readiness' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Readiness Score ({readinessData?.overallReadiness || 0}%)</span>
          </button>
          <button
            onClick={() => setActiveView('what-if')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'what-if' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>"What-If?" Simulator</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 6-PILLAR CAREER READINESS SCORE DASHBOARD (Feature 10) */}
      {activeView === 'readiness' && (
        <div className="space-y-6">
          
          {/* Main Hero Card: Overall Score + Radar Chart */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 5 Cols: Big Score Dial & Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  OVERALL CAREER READINESS
                </span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-cyan-300">
                    {readinessData?.overallReadiness || 0}%
                  </span>
                  <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    High Placement Potential
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Calculated against tier-1 enterprise hiring bars for <strong>{profile.targetCompany} {profile.targetRole}</strong>.
                </p>
              </div>

              {/* Responsible Disclaimer Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Ethical AI Scoring:</strong> This metric represents your current <em>Skill Alignment & Readiness</em> relative to indexed benchmarks. It is an educational preparation indicator, not a guarantee of hiring.
                </span>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={() => setActiveView('what-if')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate Next Steps Growth →</span>
                </button>
              </div>
            </div>

            {/* Right 7 Cols: Competency Radar Visualization */}
            <div className="lg:col-span-7 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                  <Radar
                    name="Student Readiness"
                    dataKey="score"
                    stroke="#818cf8"
                    fill="#6366f1"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* 6 Pillars Breakdown Cards */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              6-Pillar Competency Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(readinessData?.pillars || []).map((p) => (
                <div key={p.name} className="glass-card p-4 rounded-xl border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="font-black text-indigo-400 text-sm">{p.score}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${p.score}%`,
                        backgroundColor: p.color 
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Areas, Needs Improvement & Recommended Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Strong Areas */}
            <div className="glass-card p-5 rounded-2xl border-emerald-500/20 bg-emerald-950/10 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Strong Areas
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {(readinessData?.strongAreas || []).map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Needs Improvement */}
            <div className="glass-card p-5 rounded-2xl border-rose-500/20 bg-rose-950/10 space-y-3">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Needs Improvement
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {(readinessData?.needsImprovement || []).map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Next Actions */}
            <div className="glass-card p-5 rounded-2xl border-indigo-500/20 bg-indigo-950/10 space-y-3">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Recommended Actions
              </div>
              <div className="space-y-2">
                {(readinessData?.recommendedActions || []).map((act, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-0.5">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{act.title}</span>
                      <span className="text-[9px] text-amber-400 font-semibold">{act.priority}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: "WHAT-IF?" CAREER SIMULATOR (Feature 11) */}
      {activeView === 'what-if' && (
        <div className="space-y-6">
          
          {/* Simulator Hero Card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Feature 11 — Interactive Placement Simulator</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  "What-If?" Career Readiness Simulator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Toggle target actions below to simulate how closing specific gaps impacts your estimated placement readiness.
                </p>
              </div>

              {/* Large Dynamic Score Comparison */}
              <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 flex-shrink-0">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current</span>
                  <div className="text-2xl font-bold text-slate-400">{simulatedResult.baseReadiness}%</div>
                </div>

                <ArrowRight className="w-5 h-5 text-indigo-400 animate-pulse" />

                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Simulated</span>
                  <div className="text-3xl font-black text-emerald-400">{simulatedResult.simulatedScore}%</div>
                </div>

                <div className="text-center border-l border-slate-800 pl-4">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Total Gain</span>
                  <div className="text-2xl font-black text-cyan-300">+{simulatedResult.totalGain}%</div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Simulated Estimate Notice:</strong> All scores are mathematical estimations derived from target job weighting models. They indicate relative readiness progress, not guaranteed placement outcomes.
              </span>
            </div>

            {/* Interactive Simulation Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulationOptions.map((opt) => {
                const isActive = activeSimIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleSimOption(opt.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                      isActive 
                        ? 'bg-indigo-950/50 border-indigo-500/80 shadow-lg shadow-indigo-500/10' 
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive 
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {opt.tag}
                        </span>

                        <span className={`text-sm font-black ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {opt.impact}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white mt-2.5">{opt.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500">{opt.category}</span>
                      <span className={`font-semibold flex items-center gap-1 text-xs ${
                        isActive ? 'text-indigo-400' : 'text-slate-400'
                      }`}>
                        {isActive ? 'Simulated Active ✓' : '+ Add to Simulation'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Hub */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {activeSimIds.length} simulation actions selected ({simulatedResult.totalGain}% projected readiness jump)
              </span>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveSimIds([])}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all"
                >
                  Reset Baseline (68%)
                </button>
                <button
                  onClick={() => setActiveTab('projects-roadmap')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                >
                  Execute in 8-Week Roadmap →
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
