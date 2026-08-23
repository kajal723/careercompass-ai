import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Award, 
  Clock, 
  RefreshCw, 
  Send, 
  HelpCircle, 
  Building, 
  Layers, 
  ShieldCheck,
  BookOpen,
  Code,
  Binary
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { interviewQuestionsBank } from '../data/interviewQuestions';
import { companiesData } from '../data/companiesData';
import { evaluateStudentAnswer, generateFinalInterviewReport } from '../services/interviewEvaluator';
import { speakText, stopSpeaking, createSpeechRecognizer } from '../utils/speechUtils';
import confetti from 'canvas-confetti';

export default function MockInterview({ 
  candidateProfile,
  setActiveTab,
  onFinishInterview 
}) {
  // Session Configuration State
  const [sessionState, setSessionState] = useState('setup'); // 'setup' | 'in-progress' | 'feedback-step' | 'final-report'
  const [selectedCompanyId, setSelectedCompanyId] = useState('microsoft');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [interviewType, setInterviewType] = useState('Mixed'); // 'Technical' | 'DSA' | 'System Design' | 'HR' | 'Mixed'
  const [experienceLevel, setExperienceLevel] = useState('New Grad (0-1 Yrs)');

  // Active Interview State
  const [questionList, setQuestionList] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // History & Evaluation State
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const selectedCompany = companiesData.find(c => c.id === selectedCompanyId) || companiesData[0];
  const currentQuestion = questionList[currentQIndex] || interviewQuestionsBank[0];

  // Initialize Speech Recognition
  useEffect(() => {
    recognitionRef.current = createSpeechRecognizer(
      (transcript) => {
        setUserAnswer(prev => prev + ' ' + transcript);
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      }
    );

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const startSession = () => {
    // Filter / build question sequence
    let filtered = [];
    if (interviewType === 'Mixed') {
      filtered = [
        interviewQuestionsBank.find(q => q.id === 'q-hr-01'),
        interviewQuestionsBank.find(q => q.id === 'q-tech-01'),
        interviewQuestionsBank.find(q => q.id === 'q-dsa-01'),
        interviewQuestionsBank.find(q => q.id === 'q-sys-01'),
        interviewQuestionsBank.find(q => q.id === 'q-hr-02')
      ].filter(Boolean);
    } else {
      filtered = interviewQuestionsBank.filter(q => q.category === interviewType);
      if (filtered.length < 3) {
        filtered = interviewQuestionsBank.slice(0, 4);
      }
    }

    setQuestionList(filtered);
    setCurrentQIndex(0);
    setUserAnswer('');
    setInterviewHistory([]);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setSessionState('in-progress');

    // Speak initial question
    if (filtered[0]) {
      setIsSpeaking(true);
      speakText(filtered[0].question, () => setIsSpeaking(false));
    }
  };

  const handleToggleVoiceSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(currentQuestion.question, () => setIsSpeaking(false));
    }
  };

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your answer in the box.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Mic start error:", e);
      }
    }
  };

  const handleLoadSampleAnswer = () => {
    if (currentQuestion.id === 'q-tech-01') {
      setUserAnswer(
        "HashMap is not thread-safe and allows one null key. In multi-threaded environments, ConcurrentHashMap provides thread safety without locking the entire map. Prior to Java 8, it used Segment Locking. In Java 8 and beyond, it uses CAS (Compare-And-Swap) for bucket insertions and synchronized locks only on the individual bucket heads. It doesn't allow null keys and allows concurrent non-blocking reads."
      );
    } else if (currentQuestion.id === 'q-hr-02') {
      setUserAnswer(
        "Situation: In my Bank Management System project, concurrent transactions caused balance inconsistencies under load testing. Task: I needed to resolve the race condition while keeping latency low. Action: I used thread dump analysis to identify unsynchronized shared balances, then refactored to ReentrantLocks with tryLock timeouts and atomic variables. Result: Zero balance discrepancies across 10,000 threads and reduced lock contention latency by 40%."
      );
    } else if (currentQuestion.id === 'q-dsa-01') {
      setUserAnswer(
        "We can solve Lowest Common Ancestor using recursive post-order DFS. Base case: if root is null, or root is p, or root is q, return root. Recursively search left = lca(root.left, p, q) and right = lca(root.right, p, q). If both return non-null, root is the LCA. Time complexity is O(N) as each node is visited once, and space complexity is O(H) for recursion stack."
      );
    } else {
      setUserAnswer(currentQuestion.idealAnswerOutline);
    }
  };

  const handleSubmitAnswer = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const evalResult = evaluateStudentAnswer(currentQuestion, userAnswer);
    setLastEvaluation(evalResult);

    const updatedHistory = [
      ...interviewHistory,
      {
        question: currentQuestion,
        answer: userAnswer,
        evaluation: evalResult,
        timeTakenSecs: timerSeconds
      }
    ];
    setInterviewHistory(updatedHistory);
    setSessionState('feedback-step');
  };

  const handleNextQuestion = () => {
    const nextIdx = currentQIndex + 1;
    if (nextIdx < questionList.length) {
      setCurrentQIndex(nextIdx);
      setUserAnswer('');
      setSessionState('in-progress');
      const nextQ = questionList[nextIdx];
      setIsSpeaking(true);
      speakText(nextQ.question, () => setIsSpeaking(false));
    } else {
      // Completed all questions -> Generate Final Report
      setIsTimerRunning(false);
      const report = generateFinalInterviewReport({
        history: interviewHistory,
        interviewType,
        company: selectedCompany.name
      });
      setFinalReport(report);
      setSessionState('final-report');

      if (onFinishInterview) {
        onFinishInterview(report.interviewReadinessScore);
      }

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Feature 12, 13, 14 & 15 — AI Mock Interview & Evaluation Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            AI Placement Mock Interview Room
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time adaptive audio/text interview simulation with instant rubric-based grading and actionable feedback.
          </p>
        </div>

        {sessionState !== 'setup' && (
          <button
            onClick={() => {
              stopSpeaking();
              setSessionState('setup');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 self-start md:self-auto transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Configure New Interview</span>
          </button>
        )}
      </div>

      {/* STATE 1: SETUP SCREEN */}
      {sessionState === 'setup' && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border-slate-800 max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Configure Your Mock Interview Simulation
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select company round format, domain track, and experience level.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Target Company */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target Company:
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                {companiesData.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {c.roles[0]?.title}</option>
                ))}
              </select>
            </div>

            {/* Target Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target Role:
              </label>
              <input
                type="text"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Interview Track / Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Interview Track:
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="Mixed">Mixed (Full Placement Simulation: Technical + DSA + SysDesign + HR)</option>
                <option value="Technical">Technical (Core Java, Concurrency, DBMS, OS)</option>
                <option value="DSA">DSA (Trees, Graphs, Dynamic Programming)</option>
                <option value="System Design">System Design (Distributed Systems & Scalability)</option>
                <option value="HR">HR & Behavioral (STAR Method & Values)</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Experience Level:
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="New Grad (0-1 Yrs)">New Grad / Campus Placement (B.Tech 2026)</option>
                <option value="Internship">Summer / Spring Engineering Internship</option>
                <option value="SDE-1">SDE-1 (1-2 Yrs Experience)</option>
              </select>
            </div>

          </div>

          {/* AI Features Summary */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Active AI Interview Features:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 text-[11px] pt-1">
              <li className="flex items-center gap-1.5">✓ Natural Speech AI voice interviewer</li>
              <li className="flex items-center gap-1.5">✓ Real-time Speech-to-Text microphone input</li>
              <li className="flex items-center gap-1.5">✓ Adaptive question track adjustments</li>
              <li className="flex items-center gap-1.5">✓ Rubric evaluation: Accuracy, STAR, Depth</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">Duration: ~5 adaptive questions</span>
            <button
              onClick={startSession}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter AI Interview Room</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: ACTIVE INTERVIEW ROOM */}
      {sessionState === 'in-progress' && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border-slate-800 max-w-4xl mx-auto space-y-6">
          
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-indigo-400">Question {currentQIndex + 1} of {questionList.length}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {currentQuestion.category} • {currentQuestion.subCategory}
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 font-mono">
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* AI Interviewer Question Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
                  AI
                </div>
                <span className="text-xs font-bold text-indigo-300">AI Placement Interviewer ({selectedCompany.name})</span>
              </div>

              {/* Audio Play/Stop Button */}
              <button
                onClick={handleToggleVoiceSpeak}
                className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold border border-slate-700 transition-all"
                title="Speak / Mute Question"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span>Mute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Replay Audio</span>
                  </>
                )}
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              "{currentQuestion.question}"
            </h2>

            <p className="text-[11px] text-slate-400 italic">
              💡 {currentQuestion.context}
            </p>
          </div>

          {/* Student Answer Box & Controls */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  Your Response:
                </label>
                {currentQuestion.category === "DSA" && (
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                    Java Algorithm Sandbox Active
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* 1-Click Demo Answer for instant presentation */}
                <button
                  onClick={handleLoadSampleAnswer}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>⚡ Auto-Fill Strong Response</span>
                </button>

                {/* Mic Toggle */}
                <button
                  onClick={handleToggleMic}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isListening 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={7}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-sans text-slate-200 focus:outline-none focus:border-indigo-500/60 leading-relaxed resize-none shadow-inner"
                placeholder={currentQuestion.category === 'DSA' 
                  ? "Explain your algorithmic approach, write Java code, and analyze time/space complexity O(N)..."
                  : "Type your answer here or click 'Voice Input' to speak naturally..."}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center space-x-3">
                <span>{userAnswer.split(/\s+/).filter(Boolean).length} words</span>
                {userAnswer.length > 50 && (
                  <span className="text-emerald-400 text-[11px] font-medium">✓ Sufficient detail provided</span>
                )}
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Submit Response for AI Grading</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STATE 3: INSTANT ANSWER FEEDBACK STEP */}
      {sessionState === 'feedback-step' && lastEvaluation && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border-slate-800 max-w-4xl mx-auto space-y-6">
          
          {/* Feedback Header with Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Response Evaluation</div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Question {currentQIndex + 1}: {currentQuestion.subCategory}
              </h2>
            </div>

            <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-indigo-500/30 self-start sm:self-auto">
              <div className="text-2xl font-black text-indigo-400">{lastEvaluation.score}/100</div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Answer Score</span>
            </div>
          </div>

          {/* 4 Rubric Metric Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Technical Accuracy', score: lastEvaluation.technicalAccuracy },
              { label: 'Conceptual Depth', score: lastEvaluation.conceptualDepth },
              { label: 'Communication', score: lastEvaluation.communication },
              { label: 'Completeness', score: lastEvaluation.completeness }
            ].map(r => (
              <div key={r.label} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400">{r.label}</span>
                <div className="text-lg font-bold text-white mt-0.5">{r.score}%</div>
              </div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Strength:
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{lastEvaluation.strength}</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
              <div className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Improvement Area:
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{lastEvaluation.improvement}</p>
            </div>
          </div>

          {/* Ideal Model Answer Outline */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Ideal Model Answer Breakdown:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              {lastEvaluation.modelAnswer}
            </p>
          </div>

          {/* Adaptive Track Advance Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {currentQIndex + 1 < questionList.length ? 'AI will adapt next question based on your weak areas' : 'All questions completed'}
            </span>
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <span>{currentQIndex + 1 < questionList.length ? 'Proceed to Next Question' : 'View Final Interview Report'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STATE 4: FINAL INTERVIEW REPORT & SCORECARD (Feature 15) */}
      {sessionState === 'final-report' && finalReport && (
        <div className="glass-card p-6 md:p-8 rounded-2xl border-slate-800 max-w-4xl mx-auto space-y-6">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Feature 15 — Final Placement Interview Scorecard</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Comprehensive Interview Performance Report
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Candidate: <strong>{candidateProfile.name}</strong> • Evaluated for: <strong>{selectedCompany.name} {selectedRole}</strong>
              </p>
            </div>

            {/* Final Overall Score Dial */}
            <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 flex-shrink-0">
              <div className="text-center">
                <div className="text-4xl font-black text-indigo-400">{finalReport.interviewReadinessScore}/100</div>
                <span className="text-[10px] uppercase font-bold text-slate-400">INTERVIEW READINESS</span>
              </div>
            </div>
          </div>

          {/* Two-Column Analytics: Left = Radar & Grades, Right = Weaknesses & Homework */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Col: Radar & Category Grades */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Category-by-Category Competency
              </h3>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={finalReport.radarMetrics}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                    <Radar
                      name="Interview Performance"
                      dataKey="score"
                      stroke="#818cf8"
                      fill="#6366f1"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {finalReport.radarMetrics.map(m => (
                  <div key={m.subject} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">{m.subject}:</span>
                    <span className="font-bold text-white">{m.score}/100</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Top Weaknesses & Actionable Next Steps Homework */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Primary Technical Strength:
                </div>
                <p className="text-xs text-slate-200 font-semibold">{finalReport.technicalStrength}</p>
              </div>

              {/* Top Weaknesses */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Top Weaknesses To Fix:
                </div>
                <div className="space-y-1.5">
                  {finalReport.topWeaknesses.map((w, idx) => (
                    <div key={idx} className="text-xs text-slate-300">
                      <strong>{idx + 1}. {w.name}:</strong> <span className="text-slate-400 text-[11px]">{w.gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Steps Homework */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Recommended Actionable Next Steps:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {finalReport.recommendedNextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setSessionState('setup')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all"
            >
              Reattempt Another Mock Round
            </button>

            <button
              onClick={() => setActiveTab('readiness')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Update Overall Readiness Score (78%) →</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
