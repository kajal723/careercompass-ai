import React, { useState } from 'react';
import { ArrowRight, Code, ExternalLink, FileCheck2, GitBranch, Plus, ShieldAlert, ShieldCheck } from 'lucide-react';

function buildEvidenceItems(profile) {
  const skills = profile?.technicalSkills || [];
  const items = skills.map((skill) => ({
    skill: skill.name,
    confidence: skill.verified ? 'Verified' : 'User provided',
    badgeColor: skill.verified ? 'emerald' : 'indigo',
    evidenceSummary: `${skill.level || 'Added'} skill${skill.evidenceCount ? ` • ${skill.evidenceCount} evidence item${skill.evidenceCount === 1 ? '' : 's'}` : ''}`,
    details: []
  }));
  const addEvidence = (type, entries) => entries.forEach((entry) => {
    const title = typeof entry === 'string' ? entry : entry.title || entry.name || entry.role || entry.company;
    if (!title) return;
    const skill = typeof entry === 'string' ? 'Profile evidence' : entry.skill || entry.name || type;
    const item = items.find((candidate) => candidate.skill === skill) || { skill, confidence: 'User provided', badgeColor: 'indigo', evidenceSummary: 'Added from your profile', details: [] };
    item.details.push({ type, title, url: typeof entry === 'object' ? entry.url : undefined });
    if (!items.includes(item)) items.push(item);
  });
  addEvidence('Project', profile?.projects || []);
  addEvidence('Certification', profile?.certifications || []);
  addEvidence('Internship', profile?.internships || []);
  addEvidence('Achievement', profile?.achievements || []);
  Object.entries(profile?.codingProfiles || {}).forEach(([platform, value]) => addEvidence('Coding profile', [{ name: platform, title: typeof value === 'string' ? value : `${platform} profile` }]));
  return items.filter((item) => item.details.length || skills.some((skill) => skill.name === item.skill));
}

export default function EvidenceMatrix({ profile, setActiveTab }) {
  const [activeTab, setActiveTabLocal] = useState('skills');
  const evidenceItems = buildEvidenceItems(profile);

  if (!evidenceItems.length) return <div className="glass-card rounded-2xl border-slate-800 p-8 text-center"><FileCheck2 className="w-8 h-8 text-indigo-400 mx-auto" /><h1 className="text-xl font-bold text-white mt-4">Your evidence matrix is empty</h1><p className="text-sm text-slate-400 mt-2">Add skills, projects, certifications, internships, achievements, or coding profiles to see provenance here.</p><button onClick={() => setActiveTab('profile')} className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Add profile evidence</button></div>;

  return <div className="space-y-6 pb-12">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2"><ShieldCheck className="w-3.5 h-3.5" /> Evidence-Based Skills & Proof Matrix</div><h1 className="text-2xl font-extrabold text-white tracking-tight">Evidence-Based Skill Provenance</h1><p className="text-sm text-slate-400 mt-1">Review the evidence you have added to support your skills and experience.</p></div><button onClick={() => setActiveTab('profile')} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"><Plus className="w-3.5 h-3.5" /> Add evidence</button></div>
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3"><ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /><p className="text-xs text-slate-400">Only information from your profile is shown here. Unverified entries are clearly marked so you can add stronger supporting evidence.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{evidenceItems.map((item) => <div key={item.skill} className="glass-card p-5 rounded-2xl border border-slate-800"><div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-3"><div><h3 className="text-base font-bold text-white flex items-center gap-2"><Code className="w-4 h-4 text-indigo-400" /> {item.skill}</h3><p className="text-xs text-slate-400 mt-0.5">{item.evidenceSummary}</p></div><span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">{item.confidence}</span></div><div className="mt-4 space-y-2"><span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Documented evidence</span>{item.details.length ? item.details.map((detail, index) => <div key={`${detail.type}-${detail.title}-${index}`} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/70 rounded-lg px-2.5 py-2"><GitBranch className="w-3.5 h-3.5 text-cyan-400 shrink-0" /><span className="truncate">{detail.type}: {detail.title}</span>{detail.url && <a href={detail.url} target="_blank" rel="noreferrer" className="ml-auto text-indigo-400"><ExternalLink className="w-3.5 h-3.5" /></a>}</div>) : <p className="text-xs text-slate-500">No supporting artifact added yet.</p>}</div></div>)}</div>
    <div className="text-center"><button onClick={() => setActiveTab('skill-gaps')} className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white">View priority skill gaps <ArrowRight className="w-3.5 h-3.5" /></button></div>
  </div>;
}
