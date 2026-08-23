import React from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Play,
  FileText,
  Cpu,
  Target,
  Building,
  Layers,
  Zap,
  FolderGit2,
  Calendar,
  MessageSquare,
  HelpCircle,
  Award,
  BarChart2,
  TrendingUp,
  X
} from 'lucide-react';

export const DEMO_STEPS = [
  { step: 1, tab: 'resume', title: 'Upload Resume', icon: FileText, desc: 'Student uploads PDF/text resume' },
  { step: 2, tab: 'resume', title: 'AI Skill Extraction', icon: Cpu, desc: 'AI extracts tech skills & confidence ratings' },
  { step: 3, tab: 'career-matches', title: 'Career Matches', icon: Target, desc: 'System recommends Java Backend (89%), SWE (84%)' },
  { step: 4, tab: 'company-prep', title: 'Target: Microsoft SWE', icon: Building, desc: 'Student locks in Microsoft as dream company' },
  { step: 5, tab: 'company-prep', title: 'Analyze Job Reqs', icon: Layers, desc: 'Company competency model evaluated' },
  { step: 6, tab: 'skill-gaps', title: 'Skill Gap Analysis', icon: Zap, desc: 'Critical vs Medium gaps identified' },
  { step: 7, tab: 'skill-gaps', title: 'Next Best Skill', icon: Sparkles, desc: 'AI recommends Spring Boot as #1 priority' },
  { step: 8, tab: 'projects-roadmap', title: 'Gap-Closing Project', icon: FolderGit2, desc: 'Recommends E-Commerce REST API' },
  { step: 9, tab: 'projects-roadmap', title: 'Personalized Roadmap', icon: Calendar, desc: 'Adaptive 8-week dynamic timeline generated' },
  { step: 10, tab: 'mock-interview', title: 'Start AI Mock Interview', icon: MessageSquare, desc: 'Voice/Text technical & HR mock session' },
  { step: 11, tab: 'mock-interview', title: 'Adaptive Questions', icon: HelpCircle, desc: 'AI adapts difficulty based on performance' },
  { step: 12, tab: 'mock-interview', title: 'Interview Score (76/100)', icon: Award, desc: 'Multi-rubric feedback with strengths/gaps' },
  { step: 13, tab: 'readiness', title: 'Career Readiness (78%)', icon: BarChart2, desc: '6-pillar holistic readiness dashboard' },
  { step: 14, tab: 'readiness', title: 'What-If & Next Action', icon: TrendingUp, desc: 'Interactive simulator shows simulated growth' }
];

export default function DemoGuideBar({ 
  currentStep, 
  setCurrentStep, 
  setActiveTab,
  onClose 
}) {
  const stepInfo = DEMO_STEPS.find(s => s.step === currentStep) || DEMO_STEPS[0];

  const handleStepJump = (stepNum) => {
    setCurrentStep(stepNum);
    const target = DEMO_STEPS.find(s => s.step === stepNum);
    if (target) {
      setActiveTab(target.tab);
    }
  };

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length) {
      handleStepJump(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      handleStepJump(currentStep - 1);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-b border-indigo-500/30 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Step Info */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/30 flex-shrink-0">
            {currentStep}/{DEMO_STEPS.length}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">14-Step Presentation Walkthrough</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-medium">Step {currentStep}</span>
            </div>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span>{stepInfo.title}</span>
              <span className="text-slate-400 font-normal text-xs">— {stepInfo.desc}</span>
            </p>
          </div>
        </div>

        {/* Middle: Step Progress Indicators */}
        <div className="hidden xl:flex items-center space-x-1 overflow-x-auto max-w-xl py-1">
          {DEMO_STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <button
                key={s.step}
                onClick={() => handleStepJump(s.step)}
                title={`Step ${s.step}: ${s.title}`}
                className={`h-2 rounded-full transition-all ${
                  isCurrent 
                    ? 'w-7 bg-indigo-400 shadow-sm shadow-indigo-400' 
                    : isCompleted 
                      ? 'w-2.5 bg-emerald-400/80' 
                      : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            );
          })}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-slate-300 rounded-lg transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === DEMO_STEPS.length}
            className="flex items-center space-x-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-lg shadow-sm shadow-indigo-600/30 transition-all"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg ml-1"
            title="Dismiss Demo Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
