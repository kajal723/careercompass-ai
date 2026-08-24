import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DemoGuideBar from './components/DemoGuideBar';
import Dashboard from './components/Dashboard';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ProfileManager from './components/ProfileManager';
import CareerMatches from './components/CareerMatches';
import CompanyPrep from './components/CompanyPrep';
import SkillGapView from './components/SkillGapView';
import ProjectRoadmap from './components/ProjectRoadmap';
import MockInterview from './components/MockInterview';
import ReadinessDashboard from './components/ReadinessDashboard';
import EvidenceMatrix from './components/EvidenceMatrix';
import ExportReportModal from './components/ExportReportModal';
import StudyRoomPro from './components/StudyRoomPro';

import { defaultStudentProfile } from './data/initialData';
import { parseResumeText } from './services/resumeParser';
import { computeCareerReadinessScore } from './services/recommendationEngine';
import { 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Heart,
  ChevronRight,
  Layers,
  Award
} from 'lucide-react';

const EMPTY_PROFILE = {
  ...defaultStudentProfile,
  id: 'new-candidate',
  name: '',
  headline: '',
  email: '',
  phone: '',
  education: '',
  degree: '',
  university: '',
  cgpa: '',
  graduationYear: '',
  location: '',
  preferredCareer: '',
  targetCompany: '',
  targetRole: '',
  technicalSkills: [],
  softSkills: [],
  projects: [],
  certifications: [],
  internships: [],
  achievements: [],
  codingProfiles: {},
  resumeTextSample: ''
};

export default function App() {
  const [candidateProfile, setCandidateProfile] = useState(null);
  const activeCandidateProfile = candidateProfile || EMPTY_PROFILE;
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 14-Step Demo Mode Presentation Stepper
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);

  // Resume Parsed Intelligence Data
  const [resumeData, setResumeData] = useState(() => parseResumeText(''));

  const handleResumeDataChange = (nextResumeData) => {
    const candidate = nextResumeData.candidate;
    setResumeData(nextResumeData);
    setCandidateProfile((previousProfile) => ({
      ...previousProfile,
      ...(candidate?.name ? { name: candidate.name } : {}),
      ...(nextResumeData.education ? { education: nextResumeData.education } : {}),
      ...(nextResumeData.cgpa ? { cgpa: nextResumeData.cgpa } : {}),
      ...(candidate?.education ? { degree: candidate.education } : {}),
      ...(candidate?.experience ? { headline: candidate.experience } : {}),
      ...(candidate?.targetRole ? { targetRole: candidate.targetRole, preferredCareer: candidate.targetRole } : {}),
      ...(candidate ? {
        candidate,
        projects: candidate.projects || [],
        certifications: candidate.certifications || [],
        interests: candidate.interests || []
      } : {}),
      technicalSkills: (nextResumeData.detectedSkills || []).map((skill) => ({
        name: skill.name,
        level: skill.confidence === 'Strong' ? 'Advanced' : 'Intermediate',
        category: skill.category,
        evidenceCount: skill.mentionCount || skill.mentions || 1,
        verified: false
      })),
      softSkills: nextResumeData.detectedSoftSkills || [],
      resumeTextSample: nextResumeData.raw_text || previousProfile.resumeTextSample
    }));
  };

  // Mock Interview State & Score
  const [latestInterviewScore, setLatestInterviewScore] = useState(null);

  // Computed Readiness Score
  const [readinessData, setReadinessData] = useState(() => 
    computeCareerReadinessScore(EMPTY_PROFILE, null)
  );

  // Recompute readiness whenever profile or interview score changes
  useEffect(() => {
    const updated = computeCareerReadinessScore(activeCandidateProfile, latestInterviewScore);
    setReadinessData(updated);
  }, [activeCandidateProfile, latestInterviewScore]);

  const handleFinishInterview = (score) => {
    setLatestInterviewScore(score);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentProfile={activeCandidateProfile}
        setCurrentProfile={setCandidateProfile}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        demoStep={demoStep}
        setDemoStep={setDemoStep}
        readinessScore={readinessData?.overallReadiness || 0}
        onOpenExport={() => setShowExportModal(true)}
      />

      {/* 14-Step Presentation Walkthrough Bar (Visible when demo mode is active) */}
      {isDemoMode && (
        <DemoGuideBar
          currentStep={demoStep}
          setCurrentStep={setDemoStep}
          setActiveTab={setActiveTab}
          onClose={() => setIsDemoMode(false)}
        />
      )}

      {/* Export Placement Dossier Modal */}
      {showExportModal && (
        <ExportReportModal
          profile={activeCandidateProfile}
          readinessData={readinessData}
          resumeData={resumeData}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            profile={activeCandidateProfile}
            readinessData={readinessData}
            setActiveTab={setActiveTab}
            onStartInterview={() => setActiveTab('mock-interview')}
            onExploreProject={() => setActiveTab('projects-roadmap')}
            onViewRoadmap={() => setActiveTab('projects-roadmap')}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeAnalyzer
            candidateProfile={activeCandidateProfile}
            resumeData={resumeData}
            setResumeData={handleResumeDataChange}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileManager
            profile={activeCandidateProfile}
            setProfile={setCandidateProfile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'career-matches' && (
          <CareerMatches
            candidateProfile={activeCandidateProfile}
            resumeData={resumeData}
            setCandidateProfile={setCandidateProfile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'company-prep' && (
          <CompanyPrep
            candidateProfile={activeCandidateProfile}
            resumeData={resumeData}
            setCandidateProfile={setCandidateProfile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'skill-gaps' && (
          <SkillGapView
            candidateProfile={activeCandidateProfile}
            resumeData={resumeData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'projects-roadmap' && (
          <ProjectRoadmap
            profile={activeCandidateProfile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'mock-interview' && (
          <MockInterview
            candidateProfile={activeCandidateProfile}
            setActiveTab={setActiveTab}
            onFinishInterview={handleFinishInterview}
          />
        )}

        {activeTab === 'readiness' && (
          <ReadinessDashboard
            profile={activeCandidateProfile}
            readinessData={readinessData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'what-if' && (
          <ReadinessDashboard
            profile={activeCandidateProfile}
            readinessData={readinessData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceMatrix
            profile={activeCandidateProfile}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'study-rooms' && <StudyRoomPro />}
      </main>

      {/* Modern SaaS Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200">CareerCompass AI</span>
            <span>—</span>
            <span className="text-slate-400">"From Career Aspirations to Job Readiness"</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <button onClick={() => setActiveTab('profile')} className="hover:text-slate-300">Student Profile</button>
            <button onClick={() => setActiveTab('evidence')} className="hover:text-slate-300">Evidence Matrix</button>
            <button onClick={() => setActiveTab('what-if')} className="hover:text-slate-300">What-If Simulator</button>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">SIH AI Career Intelligence Prototype</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
