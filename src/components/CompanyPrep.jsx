import React, { useState } from 'react';
import { 
  Building, 
  Target, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  BarChart3,
  Search,
  Check,
  RefreshCw,
  FolderGit2,
  Calendar,
  Users
} from 'lucide-react';
import { companiesData } from '../data/companiesData';
import { analyzeJobDescriptionText } from '../services/skillGapEngine';
import { computeCompanyComparison } from '../services/recommendationEngine';

export default function CompanyPrep({ 
  candidateProfile,
  resumeData,
  setCandidateProfile,
  setActiveTab 
}) {
  const analyzedSkills = (resumeData?.detectedSkills || []).map((skill) => ({
    name: skill.name,
    level: skill.confidence === 'Strong' ? 'Advanced' : 'Intermediate'
  }));
  const currentSkills = resumeData ? analyzedSkills : candidateProfile.technicalSkills;
  const [activeSubTab, setActiveSubTab] = useState('company-dashboard'); // 'company-dashboard' | 'comparison' | 'jd-analyzer'
  const [selectedCompanyId, setSelectedCompanyId] = useState('microsoft');
  
  // JD Analyzer state
  const [jdInput, setJdInput] = useState(
    "Looking for a Java Backend Developer with experience in Java, Spring Boot, REST APIs, MySQL, Docker and Git."
  );
  const [jdAnalysisResult, setJdAnalysisResult] = useState(() => 
    analyzeJobDescriptionText(
      "Looking for a Java Backend Developer with experience in Java, Spring Boot, REST APIs, MySQL, Docker and Git.",
      currentSkills
    )
  );
  const [isAnalyzingJD, setIsAnalyzingJD] = useState(false);

  const selectedCompany = companiesData.find(c => c.id === selectedCompanyId) || companiesData[0];
  const selectedRole = selectedCompany.roles[0];
  const companyComparisons = computeCompanyComparison({ ...candidateProfile, technicalSkills: currentSkills });

  const handleSelectCompany = (company) => {
    setSelectedCompanyId(company.id);
    setCandidateProfile(prev => ({
      ...prev,
      targetCompany: company.name
    }));
  };

  const handleAnalyzeJD = () => {
    setIsAnalyzingJD(true);
    setTimeout(() => {
      const res = analyzeJobDescriptionText(jdInput, currentSkills);
      setJdAnalysisResult(res);
      setIsAnalyzingJD(false);
    }, 500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Feature 4, 5, 17 & 18 — Company Intelligence & JD Analyzer</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Company Preparation & Job Description Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Target company competency modeling, cross-firm readiness comparisons, and custom Job Description analysis.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('company-dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'company-dashboard' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Target Company Hub
          </button>
          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'comparison' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Multi-Company Comparison
          </button>
          <button
            onClick={() => setActiveSubTab('jd-analyzer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'jd-analyzer' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            JD Analyzer (Paste)
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TARGET COMPANY HUB & DASHBOARD (Feature 4 & 17) */}
      {activeSubTab === 'company-dashboard' && (
        <div className="space-y-6">
          
          {/* Company Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {companiesData.map(c => {
              const isSelected = selectedCompany.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCompany(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border flex-shrink-0 ${
                    isSelected 
                      ? 'bg-slate-900 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* FEATURE 17: COMPANY PREPARATION DASHBOARD */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border-slate-800 space-y-6">
            
            {/* Header Strip */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">TARGET COMPANY</div>
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <span>{selectedCompany.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedRole.level}
                  </span>
                </div>
                <p className="text-xs text-indigo-300 font-medium">
                  Target Role: <strong className="text-white">{selectedRole.title}</strong> • {selectedRole.department}
                </p>
                <p className="text-xs text-slate-400 italic mt-1">"{selectedCompany.tagline}"</p>
              </div>

              {/* Readiness Score Card */}
              <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-xl border border-indigo-500/30">
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-400">72%</div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Skill Alignment</span>
                </div>
                <div className="text-xs text-slate-300 border-l border-slate-800 pl-4 space-y-1">
                  <div><strong>Focus:</strong> {selectedRole.hiringBarFocus}</div>
                  <div className="text-[11px] text-emerald-400">Java/OOP/DBMS Strong • System Design Gap</div>
                </div>
              </div>
            </div>

            {/* Skill Breakdown vs Student Competency Bars */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Target Role Skill Breakdown & Candidate Alignment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "DSA (Trees, Graphs, DP)", weight: "30% Weight", studentScore: 68, status: "Moderate Gap", color: "indigo" },
                  { name: "Java / Core OOP", weight: "20% Weight", studentScore: 91, status: "Strong Match", color: "emerald" },
                  { name: "DBMS / Relational Schema", weight: "10% Weight", studentScore: 77, status: "Strong Match", color: "emerald" },
                  { name: "Operating Systems & Concurrency", weight: "10% Weight", studentScore: 61, status: "Moderate Gap", color: "amber" },
                  { name: "System Design & Architecture", weight: "10% Weight", studentScore: 54, status: "Critical Gap", color: "rose" },
                  { name: "Communication & Leadership", weight: "10% Weight", studentScore: 81, status: "Strong Match", color: "emerald" }
                ].map(item => (
                  <div key={item.name} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-slate-400 text-[11px]">{item.weight}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.studentScore >= 75 ? 'bg-emerald-500' :
                            item.studentScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.studentScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white w-8 text-right">{item.studentScore}%</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-semibold ${
                        item.status === 'Strong Match' ? 'text-emerald-400' :
                        item.status === 'Moderate Gap' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-slate-500 text-[10px]">Benchmark: 80%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Rounds Topology */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                {selectedCompany.name} Hiring Process Rounds
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedRole.interviewRounds.map((round, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-indigo-400">{round.name}</div>
                    <div className="text-xs text-slate-300 font-medium">{round.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons as requested in Feature 17 */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('skill-gaps')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>[View Skill Gaps]</span>
              </button>

              <button
                onClick={() => setActiveTab('mock-interview')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>[Start AI Interview]</span>
              </button>

              <button
                onClick={() => setActiveTab('projects-roadmap')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>[View Roadmap]</span>
              </button>

              <button
                onClick={() => setActiveTab('projects-roadmap')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>[Recommended Projects]</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: MULTIPLE COMPANY COMPARISON (Feature 18) */}
      {activeSubTab === 'comparison' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Note on Comparison Metrics:</strong> Scores reflect objective candidate skill overlap against indexed hiring benchmarks (DSA complexity, framework requirements, and interview question frequencies). These are <strong>Readiness & Alignment Indicators</strong>, NOT guarantees of employment.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyComparisons.map(comp => (
              <div key={comp.company} className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }}></span>
                      <h3 className="text-lg font-bold text-white">{comp.company}</h3>
                      <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-300">{comp.role}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{comp.tagline}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{comp.readiness}%</div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Readiness</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${comp.readiness}%`,
                      backgroundColor: comp.color 
                    }}
                  />
                </div>

                {/* Strengths & Gaps */}
                <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="font-semibold text-emerald-400">Strong Competencies:</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">{comp.strongSkills.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-rose-400">Key Competency Gaps:</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">{comp.keyGaps.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-indigo-300">Target Focus:</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{comp.focusArea}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleSelectCompany(companiesData.find(c => c.name === comp.company) || companiesData[0]);
                    setActiveSubTab('company-dashboard');
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all text-center"
                >
                  View Dedicated {comp.company} Plan →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: JOB DESCRIPTION ANALYZER (Feature 5) */}
      {activeSubTab === 'jd-analyzer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 5 Cols: Paste Job Description */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card p-5 rounded-2xl border-slate-800 flex flex-col h-full space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Paste Job Description (JD)
                  </h3>
                  <button
                    onClick={() => setJdInput("Looking for a Java Backend Developer with experience in Java, Spring Boot, REST APIs, MySQL, Docker and Git.")}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Reset Demo JD
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Paste any company JD below. The AI extracts required technical skills and compares them instantly with your profile.
                </p>

                <textarea
                  value={jdInput}
                  onChange={(e) => setJdInput(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500/60 resize-none"
                  placeholder="Paste job description text..."
                />

                <button
                  onClick={handleAnalyzeJD}
                  disabled={isAnalyzingJD}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingJD ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingJD ? 'Extracting & Comparing...' : 'Analyze JD Match'}</span>
                </button>
              </div>
            </div>

            {/* Right 7 Cols: JD Match Results & Skill Comparison */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-5">
                
                {/* Score Banner */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">JOB DESCRIPTION MATCH</span>
                    <div className="text-3xl font-black text-indigo-400 mt-0.5">
                      {jdAnalysisResult.jobMatchScore}%
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {jdAnalysisResult.matchedCount} of {jdAnalysisResult.extractedSkills.length} skills matched
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {jdAnalysisResult.matchedCount} Strong
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                      {jdAnalysisResult.missingCount} Missing
                    </span>
                  </div>
                </div>

                {/* Skill Match Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Extracted Required Skills vs Candidate Profile
                  </h4>
                  <div className="overflow-hidden rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="px-3.5 py-2.5">Required Skill</th>
                          <th className="px-3.5 py-2.5">Category</th>
                          <th className="px-3.5 py-2.5">Candidate Alignment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                        {jdAnalysisResult.skillComparisons.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-3.5 py-2.5 font-bold text-white">
                              {item.name}
                            </td>
                            <td className="px-3.5 py-2.5 text-slate-400">
                              {item.category}
                            </td>
                            <td className="px-3.5 py-2.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                item.status === 'Strong'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              }`}>
                                {item.status === 'Strong' ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    Strong
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3 text-rose-400" />
                                    Missing
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Ready to bridge missing JD skills?</span>
                  <button
                    onClick={() => setActiveTab('skill-gaps')}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    <span>View Gap-Closing Action Plan</span>
                    <ArrowRight className="w-3 h-3" />
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
