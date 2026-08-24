import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Code, 
  Database, 
  Layers, 
  GraduationCap, 
  Briefcase, 
  Award,
  ExternalLink
} from 'lucide-react';

const API_BASE_URL =import.meta.env.VITE_API_URL || 'https://careercompass-ai-1-t06u.onrender.com';
const EMPTY_CANDIDATE = {
  name: '',
  education: '',
  experience: '',
  skills: [],
  projects: [],
  certifications: [],
  interests: [],
  targetRole: ''
};

function splitList(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function candidateFromResume(text, analysis) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const section = (name) => {
    const start = lines.findIndex((line) => line.toLowerCase().startsWith(name));
    if (start < 0) return [];
    return lines.slice(start + 1).filter((line) => /^[A-Z][A-Z\s&]+$/.test(line)).length
      ? lines.slice(start + 1, lines.findIndex((line, index) => index > start && /^[A-Z][A-Z\s&]+$/.test(line))).filter(Boolean)
      : [];
  };

  return {
    ...EMPTY_CANDIDATE,
    name: lines[0] || '',
    education: analysis.education || '',
    experience: section('experience').join(' '),
    skills: (analysis.detectedSkills || []).map((skill) => skill.name),
    projects: section('projects'),
    certifications: section('certifications'),
    interests: section('interests')
  };
}

export default function ResumeAnalyzer({ 
  candidateProfile,
  resumeData, 
  setResumeData, 
  setActiveTab 
}) {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState('extracted'); // 'extracted' | 'raw'
  const [uploadError, setUploadError] = useState('');
  const [entryMode, setEntryMode] = useState('upload');
  const [manualCandidate, setManualCandidate] = useState(EMPTY_CANDIDATE);

  const analyzeResume = async (file, candidateOverride = null) => {
    setIsAnalyzing(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_role', candidateOverride?.targetRole || candidateProfile.targetRole || 'Software Engineer');
      formData.append('target_company', candidateProfile.targetCompany || 'Microsoft');

      const response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || 'Resume analysis failed.');
      }

      const resumeText = result.raw_text || inputText;
      const candidate = candidateOverride || candidateFromResume(resumeText, result);
      const detectedSkills = [...(result.detectedSkills || [])];
      candidate.skills.forEach((skillName) => {
        if (!detectedSkills.some((skill) => skill.name.toLowerCase() === skillName.toLowerCase())) {
          detectedSkills.push({ name: skillName, category: 'Manual Entry', confidence: 'Moderate', mentionCount: 1 });
        }
      });
      setInputText(resumeText);
      setResumeData({
        ...result,
        detectedSkills,
        summaryStats: {
          ...result.summaryStats,
          totalSkillsDetected: detectedSkills.length
        },
        candidate
      });
    } catch (error) {
      setUploadError(error.message || 'Could not connect to the resume analysis service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    analyzeResume(new File([inputText], 'pasted-resume.txt', { type: 'text/plain' }));
  };

  const handleManualChange = (field, value) => {
    setManualCandidate((current) => ({ ...current, [field]: value }));
  };

  const handleManualSubmit = () => {
    const candidate = {
      ...manualCandidate,
      skills: Array.isArray(manualCandidate.skills) ? manualCandidate.skills : splitList(manualCandidate.skills),
      projects: Array.isArray(manualCandidate.projects) ? manualCandidate.projects : splitList(manualCandidate.projects),
      certifications: Array.isArray(manualCandidate.certifications) ? manualCandidate.certifications : splitList(manualCandidate.certifications),
      interests: Array.isArray(manualCandidate.interests) ? manualCandidate.interests : splitList(manualCandidate.interests)
    };
    const manualText = [
      candidate.name,
      candidate.education,
      candidate.experience,
      `Skills: ${candidate.skills.join(', ')}`,
      `Projects: ${candidate.projects.join(', ')}`,
      `Certifications: ${candidate.certifications.join(', ')}`,
      `Interests: ${candidate.interests.join(', ')}`,
      candidate.targetRole ? `Target Role: ${candidate.targetRole}` : ''
    ].filter(Boolean).join('\n');

    setInputText(manualText);
    analyzeResume(new File([manualText], 'manual-candidate.txt', { type: 'text/plain' }), candidate);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const isSupportedFile = /\.(txt|pdf|docx)$/i.test(file.name);
      if (!isSupportedFile) {
        setUploadError('Please upload a TXT, PDF, or DOCX resume.');
        e.target.value = '';
        return;
      }

      setUploadError('');
      analyzeResume(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Feature 2 — AI Resume Intelligence & Skill Extraction</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Resume Analyzer & Evidence Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Extracts deep technical competencies, frameworks, soft skills, and validates confidence levels against industry benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              const blob = new Blob([candidateProfile.resumeTextSample || ''], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${(candidateProfile.name || 'Candidate').replace(/\s+/g, '_')}_Resume.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            title="Download Resume File"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Resume File (.txt)</span>
          </button>

          <button
            onClick={() => setActiveTab('career-matches')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>View Career Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Left = Resume Input / Dropzone, Right = Detected AI Skills & Evidence Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload / Paste Resume */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl border-slate-800 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Resume Document
              </h3>
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setActiveView('extracted')}
                  className={`px-2 py-1 rounded ${activeView === 'extracted' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400'}`}
                >
                  Extraction View
                </button>
                <button
                  onClick={() => setActiveView('raw')}
                  className={`px-2 py-1 rounded ${activeView === 'raw' ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400'}`}
                >
                  Raw Text
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3" role="tablist" aria-label="Resume entry method">
              <button
                type="button"
                onClick={() => setEntryMode('upload')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${entryMode === 'upload' ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
              >
                Upload Resume
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('manual')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${entryMode === 'manual' ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
              >
                Enter Manually
              </button>
            </div>

            {entryMode === 'upload' ? (
              <>
                <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/50 hover:bg-slate-900/80 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all mb-3 text-center">
                  <UploadCloud className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
                  <span className="text-xs font-semibold text-slate-200">Drop your resume here</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX, and TXT files (Click to browse)</span>
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx, text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <div className="flex-1 flex flex-col">
                  <label className="text-[11px] font-semibold text-slate-400 mb-1">Or paste resume content directly:</label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={12}
                    className="w-full flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500/60 resize-none"
                    placeholder="Paste full resume text here..."
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{inputText.length} characters • {inputText.split(/\s+/).filter(Boolean).length} words</span>
                  <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all">
                    <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {[
                  ['name', 'Name', 'Rahul'],
                  ['education', 'Education / Degree', 'B.Tech CSE'],
                  ['experience', 'Experience', 'Fresher or previous roles'],
                  ['skills', 'Skills', 'Python, SQL, Pandas, Machine Learning'],
                  ['projects', 'Projects', 'Customer Churn Prediction'],
                  ['certifications', 'Certifications', 'Certification names, comma separated'],
                  ['interests', 'Interests', 'Areas you want to explore'],
                  ['targetRole', 'Target Role (optional)', 'Software Engineer']
                ].map(([field, label, placeholder]) => (
                  <label key={field} className="block">
                    <span className="text-[11px] font-semibold text-slate-400">{label}</span>
                    <input
                      value={Array.isArray(manualCandidate[field]) ? manualCandidate[field].join(', ') : manualCandidate[field]}
                      onChange={(event) => handleManualChange(field, event.target.value)}
                      placeholder={placeholder}
                      className="mt-1 w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60"
                    />
                  </label>
                ))}
                <button onClick={handleManualSubmit} disabled={isAnalyzing} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Candidate'}
                </button>
              </div>
            )}
            {uploadError && <p className="mt-3 text-xs text-rose-300" role="alert">{uploadError}</p>}
          </div>
        </div>

        {/* Right Column: AI Detected Skills, Categories & Confidence Indicators */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Summary Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-3 rounded-xl border-slate-800 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Detected Skills</span>
              <div className="text-xl font-bold text-white mt-0.5">
                 {resumeData?.summaryStats?.totalSkillsDetected ?? 0}
              </div>
            </div>
            <div className="glass-card p-3 rounded-xl border-slate-800 text-center">
              <span className="text-[10px] uppercase font-semibold text-emerald-400">Strong Confidence</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">
                 {resumeData?.summaryStats?.strongSkillsCount ?? 0}
              </div>
            </div>
            <div className="glass-card p-3 rounded-xl border-slate-800 text-center">
              <span className="text-[10px] uppercase font-semibold text-rose-400">Identified Gaps</span>
              <div className="text-xl font-bold text-rose-400 mt-0.5">
                 {resumeData?.summaryStats?.missingSkillsCount ?? 0}
              </div>
            </div>
          </div>

          {/* AI Detected Skill Badges */}
          <div className="glass-card p-5 rounded-2xl border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                AI Detected Skills
              </h3>
              <span className="text-[11px] text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Natural Language Extraction
              </span>
            </div>

            {/* Categorized Skills */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Programming Languages:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {(resumeData?.detectedLanguages ?? []).map(lang => (
                    <span key={lang} className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Code className="w-3 h-3 text-indigo-400" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Frameworks:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(resumeData?.detectedFrameworks ?? []).map(framework => (
                    <span key={framework} className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 rounded-lg text-xs font-semibold">
                      {framework}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Core Computer Science:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {(resumeData?.detectedCoreCS ?? []).map(cs => (
                    <span key={cs} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      {cs}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Databases & Tools:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {(resumeData?.detectedDatabases ?? []).map(db => (
                    <span key={db} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <Database className="w-3 h-3 text-amber-400" />
                      {db}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cloud & DevOps:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(resumeData?.detectedCloud ?? []).map(tool => (
                    <span key={tool} className="px-2.5 py-1 bg-amber-950/60 border border-amber-500/30 text-amber-200 rounded-lg text-xs font-semibold">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Soft Skills:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {(resumeData?.detectedSoftSkills ?? []).map(soft => (
                    <span key={soft} className="px-2.5 py-1 bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded-lg text-xs">
                      {soft}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Confidence Indicator Table */}
          <div className="glass-card p-5 rounded-2xl border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Skill Confidence & Evidence Indicators
                </h3>
                <p className="text-[11px] text-slate-400">
                  Target Company Benchmark: <strong>Microsoft Software Engineer</strong>
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-2.5">Skill Competency</th>
                    <th className="px-3.5 py-2.5">Confidence Status</th>
                    <th className="px-3.5 py-2.5">Evidence / Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                  {(resumeData?.skillEvidenceTable || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-3.5 py-2.5 font-semibold text-white">
                        {row.name}
                      </td>
                      <td className="px-3.5 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          row.status === 'Strong' 
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                            : row.status === 'Moderate'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          {row.status === 'Strong' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {row.status === 'Moderate' && <HelpCircle className="w-3 h-3 text-amber-400" />}
                          {row.status === 'Missing' && <AlertCircle className="w-3 h-3 text-rose-400" />}
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-400 text-[11px]">
                        {row.evidenceNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Explanatory Note */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Evidence Note:</strong> Confidence is calculated from resume context, project descriptions, GitHub repositories, and verified certifications. Gaps reflect competencies required by target role.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
