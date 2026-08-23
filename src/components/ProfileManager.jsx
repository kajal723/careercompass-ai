import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Building, 
  Target, 
  Award, 
  Briefcase, 
  Code, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProfileManager({ profile, setProfile, setActiveTab }) {
  const [formData, setFormData] = useState({ ...profile });
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const updatedSkills = [
      ...formData.technicalSkills,
      { name: newSkill.trim(), level: newSkillLevel, category: "Custom", evidenceCount: 1, verified: false }
    ];

    setFormData(prev => ({ ...prev, technicalSkills: updatedSkills }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillName) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter(s => s.name !== skillName)
    }));
  };

  const handleSaveProfile = () => {
    setProfile(formData);
    setSaveSuccess(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Feature 1 — Comprehensive Student Placement Profile</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Student Profile & Academics Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain your academic credentials, technical skillset, verified projects, and placement target companies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('resume')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload / Sync Resume</span>
          </button>
          
          <button
            onClick={handleSaveProfile}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveSuccess ? 'Profile Saved ✓' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Academic & Target Info, Right = Skills & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Personal & Academic Info */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card: Personal & Academic Details */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Academic & Education Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Full Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email Address:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">University / College:</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Degree & Branch:</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleInputChange('degree', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Cumulative CGPA (out of 10):</label>
                <input
                  type="text"
                  value={formData.cgpa}
                  onChange={(e) => handleInputChange('cgpa', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none font-bold text-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Graduation Year:</label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card: Career Goals & Target Companies */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Target className="w-4 h-4 text-cyan-400" />
              Career Aspirations & Target Roles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Preferred Career Track:</label>
                <input
                  type="text"
                  value={formData.preferredCareer}
                  onChange={(e) => handleInputChange('preferredCareer', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Dream Target Company:</label>
                <input
                  type="text"
                  value={formData.targetCompany}
                  onChange={(e) => handleInputChange('targetCompany', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none font-bold text-indigo-300"
                />
              </div>
            </div>
          </div>

          {/* Card: Internship Experience */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Internship Experience
            </h3>

            {(formData.internships || []).map((intern, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{intern.role} — {intern.company}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{intern.duration}</span>
                </div>
                <p className="text-[11px] text-slate-300">{intern.description}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Right 6 Cols: Skills Matrix & Project Evidence */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card: Technical Skills Manager */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                Technical Skills ({formData.technicalSkills.length})
              </h3>
            </div>

            {/* Existing Skills Badges */}
            <div className="flex flex-wrap gap-2">
              {formData.technicalSkills.map((sk) => (
                <span 
                  key={sk.name}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 group"
                >
                  <span>{sk.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({sk.level})</span>
                  <button
                    onClick={() => handleRemoveSkill(sk.name)}
                    className="text-slate-500 hover:text-rose-400 transition-colors ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Mini Form */}
            <form onSubmit={handleAddSkill} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Docker, Spring Boot)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Card: Portfolio Projects */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Code className="w-4 h-4 text-cyan-400" />
              Portfolio Projects & GitHub Repositories
            </h3>

            {(formData.projects || []).map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{proj.title}</span>
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]">
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-300">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Card: Certifications */}
          <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Award className="w-4 h-4 text-purple-400" />
              Verified Certifications
            </h3>

            {(formData.certifications || []).map((cert) => (
              <div key={cert.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{cert.title}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Verified {cert.year}</span>
                </div>
                <p className="text-[11px] text-slate-400">Issuer: {cert.issuer}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
