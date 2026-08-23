import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  GitBranch, 
  Award, 
  Briefcase, 
  Code, 
  Binary, 
  ShieldAlert, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function EvidenceMatrix({ profile, setActiveTab }) {
  const [activeTab, setActiveTabLocal] = useState('skills'); // 'skills' | 'add-evidence'

  const evidenceItems = [
    {
      skill: "Java",
      confidence: "Strong (High Evidence)",
      badgeColor: "emerald",
      evidenceSummary: "3 Projects • 145 LeetCode Problems • 1 Verified Internship • 1 Oracle Cert",
      details: [
        { type: "Project", title: "Student Management System (Java/JDBC)", url: "https://github.com/kajal-shah/student-management-system" },
        { type: "Project", title: "Bank Account Management System (Multithreading)", url: "https://github.com/kajal-shah/bank-management-system" },
        { type: "Internship", title: "Java Development Intern at TechNova Solutions (3 mos)" },
        { type: "Certification", title: "Oracle Certified Associate: Java SE 8 Programmer (2024)" },
        { type: "Coding Profile", title: "LeetCode: 145 DSA problems solved in Java (Rating 1560)" }
      ]
    },
    {
      skill: "SQL / MySQL",
      confidence: "Strong (High Evidence)",
      badgeColor: "emerald",
      evidenceSummary: "2 Projects • 1 Specialization Cert • Industry Query Optimization Experience",
      details: [
        { type: "Internship", title: "Optimized MySQL queries reducing lookup latency by 25% at TechNova" },
        { type: "Certification", title: "Coursera: Database Management & SQL Specialization (Stanford Online)" },
        { type: "Project", title: "Relational Schema & ACID transactions in Student System" }
      ]
    },
    {
      skill: "DSA (Data Structures & Algorithms)",
      confidence: "Moderate to Strong",
      badgeColor: "emerald",
      evidenceSummary: "180+ Problems Solved • Techathon Finalist",
      details: [
        { type: "Coding Profile", title: "LeetCode: 145 Problems (Arrays, Strings, LinkedList, Trees)" },
        { type: "Coding Profile", title: "GeeksforGeeks: 65 Problems (Graphs, DP basics)" },
        { type: "Achievement", title: "Top 10 Finalist in University Techathon 2024 (80 teams)" }
      ]
    },
    {
      skill: "Git & Version Control",
      confidence: "Strong (Verified)",
      badgeColor: "emerald",
      evidenceSummary: "7 Public Repositories • 218 Contributions in 2025",
      details: [
        { type: "GitHub", title: "github.com/kajal-shah (Active commit history, branch reviews)" },
        { type: "Internship", title: "Collaborated via Git feature branches and PR code reviews" }
      ]
    },
    {
      skill: "Spring Boot",
      confidence: "Missing (0 Evidence)",
      badgeColor: "rose",
      evidenceSummary: "No verified repositories or certifications detected. Identified as P0 gap.",
      details: [
        { type: "Gap Action", title: "Recommended: Complete Week 1-4 Roadmap & Build E-Commerce REST API" }
      ]
    },
    {
      skill: "Docker & Containerization",
      confidence: "Missing (0 Evidence)",
      badgeColor: "rose",
      evidenceSummary: "No containerization artifacts found in repositories.",
      details: [
        { type: "Gap Action", title: "Recommended: Add Dockerfile and multi-container Docker Compose to project" }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Feature 16 — Evidence-Based Skills & Proof Matrix</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Evidence-Based Skill Provenance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Skill ratings are anchored in verifiable artifacts (GitHub repositories, problem solving metrics, certifications, and internships).
          </p>
        </div>

        <button
          onClick={() => setActiveTab('skill-gaps')}
          className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start md:self-auto"
        >
          <span>View Priority Skill Gaps</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mandatory Responsible Transparency Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white">Platform Evidence Notice:</div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The platform calculates confidence scores using <strong>user-linked evidence</strong> (GitHub repos, commit counts, solved problem logs, accredited certifications, and internship records). Skills without demonstrable evidence are flagged as unverified or missing to guide your placement roadmap.
          </p>
        </div>
      </div>

      {/* Evidence Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {evidenceItems.map((item) => (
          <div 
            key={item.skill}
            className={`glass-card p-5 rounded-2xl border transition-all ${
              item.badgeColor === 'rose' 
                ? 'border-rose-500/30 bg-rose-950/10' 
                : 'border-slate-800 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" />
                  {item.skill}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{item.evidenceSummary}</p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                item.badgeColor === 'emerald' 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}>
                {item.confidence}
              </span>
            </div>

            {/* List of Evidence Items */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Documented Evidence Artifacts:
              </span>
              <div className="space-y-1.5">
                {item.details.map((d, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-500/20">
                        {d.type}
                      </span>
                      <span className="text-slate-300 text-[11px]">{d.title}</span>
                    </div>
                    {d.url && (
                      <a href={d.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-300">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
