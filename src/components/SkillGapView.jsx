import React, { useState } from 'react';
import { 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  Zap, 
  FolderGit2, 
  Calendar, 
  Building, 
  Compass, 
  ChevronRight, 
  TrendingUp, 
  Unlock, 
  Check
} from 'lucide-react';
import { analyzeSkillGaps } from '../services/skillGapEngine';
import { companiesData } from '../data/companiesData';

export default function SkillGapView({ 
  candidateProfile,
  resumeData,
  setActiveTab 
}) {
  const selectedCompany = companiesData.find(c => c.name.toLowerCase() === (candidateProfile.targetCompany || '').toLowerCase()) || companiesData[0];
  const selectedRole = selectedCompany.roles[0];
  
  const analyzedSkills = (resumeData?.detectedSkills || []).map((skill) => ({
    name: skill.name,
    level: skill.confidence === 'Strong' ? 'Advanced' : 'Intermediate'
  }));
  const currentSkills = resumeData ? analyzedSkills : candidateProfile.technicalSkills;
  const gapAnalysis = analyzeSkillGaps(currentSkills, selectedRole.requiredSkills);
  const { criticalGaps, mediumGaps, strongSkills, nextBestSkill } = gapAnalysis;

  if (!candidateProfile?.technicalSkills?.length && !resumeData?.detectedSkills?.length) {
    return <div className="glass-card rounded-2xl border-slate-800 p-8 text-center"><Zap className="w-8 h-8 text-amber-400 mx-auto" /><h1 className="text-xl font-bold text-white mt-4">Skill gaps need your evidence</h1><p className="text-sm text-slate-400 mt-2">Add skills or analyze a resume to calculate gaps against a selected role.</p><button onClick={() => setActiveTab('profile')} className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Add skills</button></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Feature 6 & 7 — Intelligent Skill Gap & Next Best Skill Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Skill Gap Prioritization & Learning Order
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dependency-aware gap analysis tailored for <strong>{candidateProfile.targetCompany} {candidateProfile.targetRole}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('projects-roadmap')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Recommended Projects & Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* FEATURE 7: WHAT SHOULD I LEARN NEXT? HERO CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950/80 border-2 border-indigo-500/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>WHAT SHOULD I LEARN NEXT?</span>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Single Highest-Priority Learning Target</div>
              <h2 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-300">
                  {nextBestSkill.name}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg">
                  {nextBestSkill.unlockedCareerBoost}
                </span>
              </h2>
            </div>

            {/* Why Spring Boot is Recommended */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Why This Skill Now? (AI Rationale)
              </div>
              <ul className="space-y-1 text-xs text-slate-200">
                {nextBestSkill.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites & Unlocks */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="text-slate-400">
                Prerequisites Satisfied: <strong className="text-emerald-400">Java Core, OOP, SQL ✓</strong>
              </span>
              <span className="text-slate-400">
                Est. Duration: <strong className="text-white">{nextBestSkill.estimatedLearningHours}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Button Box */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/30 shadow-inner flex flex-col justify-center space-y-3 w-full lg:w-72 flex-shrink-0">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Priority Index</span>
              <div className="text-3xl font-black text-indigo-400 mt-0.5">{nextBestSkill.priorityScore}/100</div>
            </div>

            <button
              onClick={() => setActiveTab('projects-roadmap')}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Start Week 1 Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('projects-roadmap')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>View E-Commerce API Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 6: THREE-TIER SKILL GAP CATEGORIZATION (Critical Gaps, Medium Gaps, Strong Skills) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Critical Gaps (P0) */}
        <div className="glass-card p-5 rounded-2xl border-rose-500/20 bg-rose-950/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <AlertCircle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Critical Gaps (P0)</h3>
                <span className="text-[10px] text-rose-300">Blocks Target Role Clearance</span>
              </div>
            </div>
            <span className="text-xs font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
              {criticalGaps.length}
            </span>
          </div>

          <div className="space-y-3">
            {criticalGaps.map((gap, index) => (
              <div key={gap.name} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-rose-400 font-mono">#{index + 1}</span> {gap.name}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                    P0 Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {gap.rationale}
                </p>
                <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-cyan-400" />
                  <span>Unlocks: {gap.unlocks.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Medium Gaps (P1) */}
        <div className="glass-card p-5 rounded-2xl border-amber-500/20 bg-amber-950/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Medium Gaps (P1)</h3>
                <span className="text-[10px] text-amber-300">Differentiator for SDE-1</span>
              </div>
            </div>
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              {mediumGaps.length}
            </span>
          </div>

          <div className="space-y-3">
            {mediumGaps.map((gap, index) => (
              <div key={gap.name} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-amber-400 font-mono">#{criticalGaps.length + index + 1}</span> {gap.name}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    P1 Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {gap.rationale}
                </p>
                <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-cyan-400" />
                  <span>Unlocks: {gap.unlocks?.join(', ') || 'Scalability'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Strong Competencies (P2 Foundation) */}
        <div className="glass-card p-5 rounded-2xl border-emerald-500/20 bg-emerald-950/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Strong Skills</h3>
                <span className="text-[10px] text-emerald-300">Verified by Profile & Evidence</span>
              </div>
            </div>
            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {strongSkills.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {strongSkills.map((sk) => (
              <div key={sk.name} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {sk.name}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{sk.description}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Strong
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
