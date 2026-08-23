import React from 'react';
import { 
  Compass, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Building, 
  GraduationCap,
  Calendar,
  Sparkles,
  ShieldCheck,
  Code
} from 'lucide-react';

export default function ExportReportModal({ 
  profile, 
  readinessData, 
  resumeData, 
  onClose 
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8">
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Placement Readiness Official Dossier</h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="space-y-6 bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 text-slate-100 print:bg-white print:text-black print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Compass className="w-6 h-6 text-indigo-400" />
                <span className="text-xl font-extrabold tracking-tight text-white print:text-black">
                  CareerCompass <span className="text-indigo-400">AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 print:text-slate-600">
                End-to-End Placement Intelligence & Job Readiness Evaluation
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 print:text-slate-600">Date: {new Date().toLocaleDateString()}</span>
              <div className="text-xs font-bold text-emerald-400 print:text-emerald-700">Verified Dossier #CC-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Student Profile Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Candidate Name</span>
              <div className="font-bold text-white print:text-black text-sm">{profile.name}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Degree & CGPA</span>
              <div className="font-bold text-white print:text-black">{profile.degree} (CGPA: {profile.cgpa})</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Target Company</span>
              <div className="font-bold text-indigo-400 print:text-indigo-700">{profile.targetCompany}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Target Role</span>
              <div className="font-bold text-white print:text-black">{profile.targetRole}</div>
            </div>
          </div>

          {/* Overall Readiness Score Strip */}
          <div className="p-5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between print:bg-slate-100 print:border-slate-300">
            <div>
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider print:text-indigo-800">
                OVERALL PLACEMENT READINESS
              </span>
              <div className="text-3xl font-black text-white print:text-black mt-0.5">
                {readinessData?.overallReadiness || 78}%
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Top Skill Alignment: <strong>Java Core, OOP, Relational DBMS (82% Technical)</strong>
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold print:bg-emerald-100 print:text-emerald-800">
                High Placement Trajectory
              </span>
              <div className="text-[11px] text-slate-400 print:text-slate-600">Simulated Target: 87%+ with E-Commerce API</div>
            </div>
          </div>

          {/* 6 Pillars Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-700 mb-2">
              Competency Pillar Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(readinessData?.pillars || []).map(p => (
                <div key={p.name} className="p-3 rounded-lg bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white print:text-black">{p.name}</span>
                    <span className="font-black text-indigo-400 print:text-indigo-700">{p.score}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 print:text-slate-600 mt-1">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Gaps & Roadmap Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2">
              <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Priority Gaps To Close:
              </span>
              <ul className="space-y-1 text-slate-300 print:text-slate-700 text-[11px]">
                <li><strong>1. Spring Boot (P0):</strong> Required for enterprise cloud backend architecture</li>
                <li><strong>2. REST APIs & JWT (P0):</strong> Critical for secure stateless web services</li>
                <li><strong>3. Docker (P1):</strong> Essential for microservice deployment & reproducibility</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Prescribed Gap-Closing Action:
              </span>
              <p className="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
                Build the recommended <strong>"Production-Ready E-Commerce REST API"</strong> project and execute the <strong>8-Week Dynamic Preparation Roadmap</strong>.
              </p>
            </div>
          </div>

          {/* Footer & Responsible Disclosure */}
          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 print:text-slate-500 flex items-center justify-between">
            <span>CareerCompass AI Placement Intelligence System</span>
            <span>Generated for Educational Preparation • Not a Hiring Guarantee</span>
          </div>

        </div>

      </div>
    </div>
  );
}
