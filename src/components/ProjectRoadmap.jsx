import React, { useState } from 'react';
import { 
  FolderGit2, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award, 
  Code, 
  Layers, 
  ExternalLink, 
  Check, 
  ChevronRight, 
  Users,
  Compass,
  Zap,
  BookOpen
} from 'lucide-react';
import { gapClosingProjects, dynamicRoadmapTemplate } from '../data/skillGraph';
import confetti from 'canvas-confetti';

export default function ProjectRoadmap({ 
  profile, 
  setActiveTab 
}) {
  const [activeTab, setActiveSubTab] = useState('roadmap'); // 'roadmap' | 'projects'
  const [selectedProject, setSelectedProject] = useState(gapClosingProjects[0]);
  const [roadmapWeeks, setRoadmapWeeks] = useState(dynamicRoadmapTemplate);

  const completedCount = roadmapWeeks.filter(w => w.completed).length;
  const progressPercentage = Math.round((completedCount / roadmapWeeks.length) * 100);

  const toggleWeekCompletion = (weekNum) => {
    setRoadmapWeeks(prev => {
      const updated = prev.map(w => {
        if (w.weekNumber === weekNum) {
          const nextState = !w.completed;
          if (nextState) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 }
            });
          }
          return { ...w, completed: nextState };
        }
        return w;
      });
      return updated;
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Feature 8 & 9 — Gap-Closing Projects & Adaptive 8-Week Roadmap</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Personalized Roadmap & Portfolio Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Synthesizes your unique skill gaps into an actionable week-by-week timeline and production-grade portfolio projects.
          </p>
        </div>

        {/* Sub-tab Toggle */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('roadmap')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'roadmap' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>8-Week Dynamic Roadmap</span>
          </button>
          <button
            onClick={() => setActiveSubTab('projects')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'projects' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Gap-Closing Projects ({gapClosingProjects.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DYNAMIC 8-WEEK ROADMAP (Feature 9) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          
          {/* Progress Overview Card */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Personalized Timeline</span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  Tailored for {profile.name} (Java Foundation)
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                8-Week Path to Placement Readiness
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adaptive milestones calibrated to your existing Java & SQL baseline. Check off completed items to simulate readiness progression.
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-slate-800 flex-shrink-0 w-full md:w-auto justify-between md:justify-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Milestone Progress</span>
                <div className="text-2xl font-black text-emerald-400">{completedCount} of 8 Weeks</div>
              </div>
              <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Week by Week Cards */}
          <div className="space-y-4">
            {roadmapWeeks.map((week) => (
              <div 
                key={week.weekNumber}
                className={`glass-card p-5 rounded-2xl border transition-all ${
                  week.completed 
                    ? 'border-emerald-500/40 bg-emerald-950/10' 
                    : week.weekNumber === 2 
                      ? 'border-indigo-500/50 bg-indigo-950/20 shadow-lg shadow-indigo-500/5' 
                      : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleWeekCompletion(week.weekNumber)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        week.completed 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : 'bg-slate-900 border-slate-700 hover:border-indigo-500 text-transparent'
                      }`}
                      title="Toggle week completion"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          WEEK {week.weekNumber}
                        </span>
                        <span className="text-xs font-bold text-white">{week.title}</span>
                        {week.weekNumber === 2 && !week.completed && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-semibold animate-pulse">
                            Current Focus
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{week.focus} • {week.hoursRequired}</p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                    week.completed 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {week.completed ? 'Completed ✓' : 'In Queue'}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300">Core Objectives:</span>
                    <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{week.description}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Key Deliverables:</span>
                    <p className="text-indigo-300 text-[11px] mt-1 font-medium bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
                      🎯 {week.deliverable}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {week.keyTopics.map((topic, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Ready to test your readiness through simulated interviews?
            </div>
            <button
              onClick={() => setActiveTab('mock-interview')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Launch Week 8 AI Mock Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GAP-CLOSING PROJECTS (Feature 8) */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 4 Cols: Project List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Curated Gap-Closing Projects
              </div>

              {gapClosingProjects.map((p) => {
                const isSelected = selectedProject.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-slate-900 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-xs font-bold text-white">{p.title}</h3>
                      {p.id === 'proj-ecommerce-api' && (
                        <span className="text-[9px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                          #1 Priority
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.subtitle}</p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{p.duration}</span>
                      <span className="text-indigo-400 font-medium">Inspect →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 8 Cols: Deep Project Architecture & Resume Value */}
            <div className="lg:col-span-8 space-y-4">
              <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-5">
                
                {/* Project Header */}
                <div className="pb-4 border-b border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      {selectedProject.resumeImpact}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs">
                      {selectedProject.difficulty} • {selectedProject.duration}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                  <p className="text-xs text-indigo-300 font-medium">{selectedProject.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.description}</p>
                </div>

                {/* Skills Gained (Explicitly Connected to Gaps) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Skills Gained & Gaps Closed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.skillsGained.map(sk => (
                      <span key={sk} className="px-2.5 py-1 bg-indigo-950/70 border border-indigo-500/30 text-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Architecture Highlights */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Key Architecture & Resume Highlights
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedProject.architectureHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step-by-Step Implementation Milestones */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Implementation Milestones:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProject.milestones.map((m) => (
                      <div key={m.week} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1">
                        <div className="text-[11px] font-bold text-cyan-400">Week {m.week}: {m.title}</div>
                        <p className="text-[11px] text-slate-400">{m.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={selectedProject.githubStarterTemplate}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View GitHub Boilerplate Template</span>
                  </a>

                  <button
                    onClick={() => setActiveSubTab('roadmap')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                  >
                    Track in 8-Week Roadmap →
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
