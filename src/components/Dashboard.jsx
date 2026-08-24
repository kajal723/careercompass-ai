import React from 'react';
import { 
  Sparkles, 
  Target, 
  Building, 
  AlertCircle, 
  ArrowRight, 
  Award, 
  FileText, 
  PlayCircle, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  BookOpen, 
  FolderGit2, 
  Users,
  Compass,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Dashboard({
  profile,
  readinessData,
  setActiveTab,
  onStartInterview,
  onExploreProject,
  onViewRoadmap
}) {
  const radarData = readinessData?.pillars?.map(p => ({
    subject: p.name.split(' ')[0],
    score: p.score,
    fullMark: 100
  })) || [];

  const hasProfileEvidence = Boolean(profile?.name || profile?.resumeTextSample || profile?.technicalSkills?.length || profile?.projects?.length);
  if (!hasProfileEvidence) {
    return <div className="space-y-6 pb-12"><div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl"><div className="relative z-10 max-w-2xl"><div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /><span>AI Placement Intelligence Engine</span></div><h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-4">Build your placement profile</h1><p className="text-sm text-slate-300 leading-relaxed mt-2">Add your own education, skills, projects, goals, or resume to unlock personalized career analysis.</p><div className="flex flex-wrap gap-3 mt-6"><button onClick={() => setActiveTab('profile')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">Set up profile</button><button onClick={() => setActiveTab('resume')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold">Analyze resume</button></div></div></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="glass-card p-5 rounded-xl border-slate-800"><FileText className="w-5 h-5 text-cyan-400" /><h2 className="text-sm font-bold text-white mt-3">Resume evidence</h2><p className="text-xs text-slate-400 mt-1">Upload or paste your resume.</p></div><div className="glass-card p-5 rounded-xl border-slate-800"><Code className="w-5 h-5 text-emerald-400" /><h2 className="text-sm font-bold text-white mt-3">Your skills</h2><p className="text-xs text-slate-400 mt-1">Add skills you want analyzed.</p></div><div className="glass-card p-5 rounded-xl border-slate-800"><Target className="w-5 h-5 text-amber-400" /><h2 className="text-sm font-bold text-white mt-3">Your goals</h2><p className="text-xs text-slate-400 mt-1">Choose a target role and company.</p></div></div></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 -mb-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Placement Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-200 to-white">{profile.name}</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              "Students don't just need to know WHAT career to choose. They need to know <strong className="text-indigo-300">WHAT TO DO NEXT</strong> to become job-ready."
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                Target Company: <strong className="text-white">{profile.targetCompany}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Career Goal: <strong className="text-white">{profile.preferredCareer}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CGPA: <strong className="text-white">{profile.cgpa}</strong> • {profile.degree}
              </span>
            </div>
          </div>

          {/* Large Readiness Score Dial */}
          <div className="flex items-center space-x-4 bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/30 shadow-inner flex-shrink-0">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${readinessData?.overallReadiness || 78}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-white">{readinessData?.overallReadiness || 0}%</span>
                <span className="text-[9px] uppercase font-bold text-indigo-300 tracking-wider">Readiness</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-300">Overall Readiness</div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{readinessData?.overallReadiness ? 'Based on current evidence' : 'Add evidence to calculate'}</span>
              </div>
              <button
                onClick={() => setActiveTab('readiness')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 pt-1"
              >
                View Breakdown <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Top Skill Gap */}
        <div 
          onClick={() => setActiveTab('skill-gaps')}
          className="glass-card glass-card-hover p-4 rounded-xl cursor-pointer border-slate-800 hover:border-indigo-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Top Skill Gap</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-bold text-white">{readinessData?.needsImprovement?.[0]?.split(':')[0] || 'No gap calculated'}</h3>
            <p className="text-xs text-rose-300/90 mt-0.5">{readinessData?.needsImprovement?.length ? 'Needs more evidence' : 'Complete your profile for analysis'}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>Learn Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Next Best Action */}
        <div 
          onClick={() => setActiveTab('projects-roadmap')}
          className="glass-card glass-card-hover p-4 rounded-xl cursor-pointer border-slate-800 hover:border-indigo-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Next Best Action</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-bold text-white">{readinessData?.recommendedActions?.[0]?.title || 'Add your next action'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{readinessData?.recommendedActions?.[0]?.description || 'Your recommendations will appear here.'}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-amber-400 font-medium">
            <span>View 8-Wk Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Interview Readiness */}
        <div 
          onClick={() => setActiveTab('mock-interview')}
          className="glass-card glass-card-hover p-4 rounded-xl cursor-pointer border-slate-800 hover:border-indigo-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Interview Readiness</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-bold text-white">{readinessData?.pillars?.find((pillar) => pillar.name === 'Interview Readiness')?.score || 0} / 100</h3>
            <p className="text-xs text-slate-400 mt-0.5">Based on completed interview evidence</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>Start AI Mock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Recommended Project */}
        <div 
          onClick={() => setActiveTab('projects-roadmap')}
          className="glass-card glass-card-hover p-4 rounded-xl cursor-pointer border-slate-800 hover:border-indigo-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Recommended Project</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FolderGit2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-bold text-white truncate">{profile.projects?.[0]?.title || 'Add a project'}</h3>
            <p className="text-xs text-emerald-300/90 mt-0.5">{profile.projects?.[0] ? 'From your profile' : 'Project evidence will appear here'}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-emerald-400 font-medium">
            <span>Explore Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Main Grid: Left = Journey Quick Nav & Action Hub, Right = Radar & What-If Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Complete Placement Journey Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6 rounded-2xl border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  Your End-to-End Placement Journey
                </h2>
                <p className="text-xs text-slate-400">Click any stage to inspect AI analysis and take targeted action</p>
              </div>
              <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 border border-slate-700">
                19 AI Subsystems Active
              </span>
            </div>

            {/* Visual Step Roadmap Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'resume',
                  title: '1. AI Resume Analyzer',
                  desc: 'Extracted 8 core skills with evidence validation',
                  status: 'Completed',
                  statusColor: 'emerald',
                  icon: FileText
                },
                {
                  id: 'career-matches',
                  title: '2. Career Recommendations',
                  desc: '89% Java Backend Match, 84% SWE Match',
                  status: 'Analyzed',
                  statusColor: 'indigo',
                  icon: Target
                },
                {
                  id: 'company-prep',
                  title: '3. Company Competency Prep',
                  desc: 'Microsoft SWE Competency Model & Benchmarks',
                  status: 'Selected',
                  statusColor: 'cyan',
                  icon: Building
                },
                {
                  id: 'skill-gaps',
                  title: '4. Skill Gap & Next Skill',
                  desc: 'Spring Boot recommended as Next Best Skill',
                  status: 'Action Required',
                  statusColor: 'amber',
                  icon: AlertCircle
                },
                {
                  id: 'projects-roadmap',
                  title: '5. Dynamic 8-Week Roadmap',
                  desc: 'Week 1-8 tailored timeline & Capstone Project',
                  status: 'In Progress (W1)',
                  statusColor: 'indigo',
                  icon: Layers
                },
                {
                  id: 'mock-interview',
                  title: '6. AI Adaptive Mock Interview',
                  desc: 'Technical & HR rounds with live speech & grading',
                  status: 'Ready to Practice',
                  statusColor: 'purple',
                  icon: Users
                }
              ].map(item => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="p-3.5 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl cursor-pointer transition-all flex items-start space-x-3 group"
                  >
                    <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-600/20 transition-all flex-shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">{item.title}</h4>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          item.statusColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          item.statusColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setActiveTab('mock-interview')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Launch AI Mock Interview</span>
              </button>
              <button
                onClick={() => setActiveTab('what-if')}
                className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate "What If?" Growth</span>
              </button>
              <button
                onClick={() => setActiveTab('evidence')}
                className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Evidence-Based Skills Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Radar Chart Preview & Strong/Weak Summary */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Readiness Competency Radar
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">6 Pillars</span>
              </div>

              {/* Radar Chart */}
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                    <Radar
                      name="Kajal"
                      dataKey="score"
                      stroke="#818cf8"
                      fill="#6366f1"
                      fillOpacity={0.45}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Summary list */}
              <div className="space-y-2 mt-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-start space-x-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-[11px]">
                    <strong>Strongest:</strong> Java Core, OOP & SQL Optimization
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-[11px]">
                    <strong>Key Gap:</strong> Spring Boot & REST APIs for Microsoft SWE
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('readiness')}
              className="mt-4 w-full py-2 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold text-center transition-all"
            >
              Explore Full 6-Pillar Report →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
