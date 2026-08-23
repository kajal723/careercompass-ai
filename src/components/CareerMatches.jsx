import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Briefcase, 
  TrendingUp, 
  ShieldAlert, 
  Cpu,
  Layers,
  Award,
   Building
} from 'lucide-react';
import { careerRolesTaxonomy } from '../data/companiesData';

function buildRoleMatch(role, resumeData) {
  const resumeSkills = resumeData?.detectedSkills || resumeData?.detected_skills || [];
  const resumeSkillNames = resumeSkills.map((skill) =>
    typeof skill === 'string' ? skill : skill.name
  );
  const matchedSkills = role.requiredSkills.filter((requiredSkill) =>
    resumeSkillNames.some((resumeSkill) => matchesSkill(requiredSkill, resumeSkill))
  );
  const missingSkills = role.requiredSkills
    .filter((requiredSkill) => !matchedSkills.includes(requiredSkill))
    .map((name, index) => ({
      name,
      priority: index < 2 ? 'High' : 'Medium',
      weight: index < 2 ? 'High' : 'Medium'
    }));

  return {
    ...role,
    matchScore: role.requiredSkills.length
      ? Math.round((matchedSkills.length / role.requiredSkills.length) * 100)
      : 0,
    whyMatches: `${matchedSkills.length} of ${role.requiredSkills.length} benchmark skills align with the current profile.`,
    existingSkills: resumeSkillNames.filter((skill) =>
      role.requiredSkills.some((requiredSkill) => matchesSkill(requiredSkill, skill))
    ),
    missingSkills
  };
}

function matchesSkill(requiredSkill, profileSkill) {
  const normalizedProfileSkill = profileSkill.toLowerCase();
  return requiredSkill
    .split(/[\/&]/)
    .some((skillOption) => normalizedProfileSkill.includes(skillOption.trim().toLowerCase()));
}

export default function CareerMatches({ 
  candidateProfile,
  resumeData,
  setCandidateProfile,
  setActiveTab, 
  onSelectRole 
}) {
  const roleMatches = careerRolesTaxonomy
    .map((role) => buildRoleMatch(role, resumeData))
    .sort((firstRole, secondRole) => secondRole.matchScore - firstRole.matchScore);
  const [selectedRoleId, setSelectedRoleId] = useState(roleMatches[0]?.id);
  const selectedRole = roleMatches.find((role) => role.id === selectedRoleId) || roleMatches[0];

  const handleSelectTarget = (role) => {
    setSelectedRoleId(role.id);
    setCandidateProfile(prev => ({
      ...prev,
      preferredCareer: role.title
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Feature 3 — Multi-Role Career Recommendation Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Personalized Career Match Alignment
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Evaluates your extracted profile across standard industry engineering tracks with objective skill overlap calculations.
          </p>
        </div>

        {/* Ethical Language Disclaimer Banner */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Scored as <strong className="text-indigo-300">Skill Alignment & Readiness</strong>. Not a guarantee of employment.
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Career Match Role Cards, Right = Deep Role Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: List of Ranked Roles */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Top Matched Career Paths ({careerRolesTaxonomy.length})
          </div>

          {roleMatches.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10' 
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white">{role.title}</h3>
                      {role.matchScore >= 85 && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                          Top Match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{role.category} • {role.salaryRange}</p>
                  </div>

                  {/* Circular / Badge Match % */}
                  <div className="text-right">
                    <div className={`text-lg font-extrabold ${
                      role.matchScore >= 80 ? 'text-emerald-400' :
                      role.matchScore >= 65 ? 'text-indigo-400' : 'text-amber-400'
                    }`}>
                      {role.matchScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Match</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      role.matchScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                      role.matchScore >= 65 ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' :
                      'bg-gradient-to-r from-amber-500 to-orange-400'
                    }`}
                    style={{ width: `${role.matchScore}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] truncate max-w-[200px]">
                    Missing: <strong className="text-rose-400">{role.missingSkills[0]?.name || 'None'}</strong>
                  </span>
                  <span className="text-indigo-400 text-[11px] font-medium flex items-center gap-1">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Detailed Role Breakdown & Recommendation Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-5">
            
            {/* Role Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">{selectedRole.title}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                    {selectedRole.matchScore}% Skill Alignment
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Estimated Entry Level Compensation: <strong>{selectedRole.salaryRange}</strong> • Demand: <strong className="text-emerald-400">{selectedRole.demandLevel}</strong>
                </p>
              </div>

              <button
                onClick={() => handleSelectTarget(selectedRole)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Set as Target Goal</span>
              </button>
            </div>

            {/* Why This Career Matches */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 space-y-1.5">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Why This Career Matches Your Profile
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRole.whyMatches}
              </p>
            </div>

            {/* Existing Skills vs Missing Skills Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Existing Skills */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Existing / Aligned Skills ({selectedRole.existingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRole.existingSkills.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded text-xs font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  Missing Skills To Close ({selectedRole.missingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRole.missingSkills.map((sk) => (
                    <span key={sk.name} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded text-xs font-medium flex items-center gap-1">
                      <span>{sk.name}</span>
                      <span className="text-[9px] text-rose-400/80">({sk.priority})</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Recommended Next Action */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Recommended Next Action
              </div>
              <p className="text-xs text-slate-300">
                {selectedRole.recommendedAction}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('skill-gaps')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>Analyze Skill Gaps & Next Skill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('company-prep')}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
              >
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>Prepare for Microsoft</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
