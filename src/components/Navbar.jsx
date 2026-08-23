import React from 'react';
import { 
  Compass, 
  Sparkles, 
  User, 
  ChevronRight, 
  BarChart3, 
  PlayCircle,
  Briefcase,
  HelpCircle,
  FileText
} from 'lucide-react';
import { sampleAlternativeProfiles, defaultStudentProfile } from '../data/initialData';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentProfile, 
  setCurrentProfile,
  isDemoMode,
  setIsDemoMode,
  demoStep,
  setDemoStep,
  readinessScore = 78,
  onOpenExport
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                  CareerCompass <span className="text-indigo-400">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">From Career Aspirations to Job Readiness</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'resume', label: 'Resume Analyzer' },
              { id: 'career-matches', label: 'Career Matches' },
              { id: 'skill-gaps', label: 'Skill Gaps & Next Skill' },
              { id: 'company-prep', label: 'Company Prep' },
              { id: 'projects-roadmap', label: 'Roadmap & Projects' },
              { id: 'mock-interview', label: 'AI Mock Interview' },
              { id: 'readiness', label: 'Readiness Score' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Area: Demo Stepper, Persona Selector & Readiness Badge */}
          <div className="flex items-center space-x-3">
            
            {/* Demo Mode Toggle */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDemoMode 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle 14-Step Guided Demo Presentation Mode"
            >
              <PlayCircle className={`w-3.5 h-3.5 ${isDemoMode ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">14-Step Demo Flow</span>
            </button>

            {/* Persona Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                  {currentProfile.name.charAt(0)}
                </div>
                <span className="max-w-[80px] truncate hidden sm:inline">{(currentProfile.name || 'Candidate').split(' ')[0]}</span>
                <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 hidden group-hover:block z-50">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Select Persona (Preloaded)
                </div>
                <button
                  onClick={() => setCurrentProfile(defaultStudentProfile)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/60 ${
                    currentProfile.id === defaultStudentProfile.id ? 'text-indigo-400 font-semibold bg-indigo-950/30' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-medium">Kajal Shah (Default)</p>
                    <p className="text-[10px] text-slate-400">Java • SQL • DSA • Microsoft SWE</p>
                  </div>
                  {currentProfile.id === defaultStudentProfile.id && <span className="text-xs">✓</span>}
                </button>
                {sampleAlternativeProfiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentProfile(p)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/60 ${
                      currentProfile.id === p.id ? 'text-indigo-400 font-semibold bg-indigo-950/30' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.preferredCareer} • {p.targetCompany}</p>
                    </div>
                    {currentProfile.id === p.id && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Report Dossier Button */}
            <button
              onClick={onOpenExport}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all"
              title="Print or Export Placement Readiness Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Dossier</span>
            </button>

            {/* Live Readiness Pill */}
            <div 
              onClick={() => setActiveTab('readiness')}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-lg cursor-pointer hover:border-indigo-500/60 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-300">Readiness:</span>
              <span className="text-xs font-bold text-indigo-300">{readinessScore}%</span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
