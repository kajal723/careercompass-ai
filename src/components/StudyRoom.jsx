import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock3, Copy, DoorOpen, Hand, LogIn, LogOut, Mail, Mic, MicOff, MonitorUp, Plus, ShieldCheck, TimerReset, Users, Video, VideoOff, Wifi, X } from 'lucide-react';
import ChatPanel from './ChatPanel';
import Whiteboard from './Whiteboard';
import CodeEditor from './CodeEditor';
import DoubtSection from './DoubtSection';

const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
const roomStoreKey = 'careercompass-study-rooms';
const makeRoomCode = () => `CC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const getStoredRooms = () => {
  try { return JSON.parse(window.localStorage.getItem(roomStoreKey) || '{}'); } catch { return {}; }
};

export default function StudyRoom() {
  const [user, setUser] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [room, setRoom] = useState(null);
  const [roomInput, setRoomInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [voiceOn, setVoiceOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [mediaStream, setMediaStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const channelRef = useRef(null);
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning || seconds === 0) return undefined;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning, seconds]);

  const enterRoom = (event, joining = false) => {
    event.preventDefault();
    const roomCode = joining ? roomInput.trim().toUpperCase() : `CC-${Math.floor(100 + Math.random() * 900)}`;
    if (joining && !roomCode) return;
    setRoom(roomCode || 'CC-101');
  };

  const sendMessage = (text) => setMessages((current) => [...current, { id: Date.now(), author: 'You', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSelf: true }]);

  if (!room) {
    return <div className="max-w-3xl mx-auto py-8 md:py-12"><div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/50 p-6 md:p-10 shadow-2xl"><div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl" /><div className="relative"><div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest"><Users className="w-4 h-4" /> Collaborative learning space</div><h1 className="text-3xl md:text-4xl font-black text-white mt-3">Study Rooms</h1><p className="text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">A focused place to learn together, share ideas, and turn confusing concepts into clear next steps.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"><form onSubmit={(event) => enterRoom(event)} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5"><div className="flex items-center gap-2 text-sm font-bold text-white"><Plus className="w-4 h-4 text-cyan-400" /> Create a room</div><p className="text-xs text-slate-500 mt-1 mb-4">Start a fresh session and invite your study group.</p><input value={nameInput} onChange={(event) => setNameInput(event.target.value)} placeholder="Your display name" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-cyan-500 mb-3" /><button className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl py-2.5 text-xs font-bold"><Plus className="w-4 h-4" /> Create room</button></form><form onSubmit={(event) => enterRoom(event, true)} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5"><div className="flex items-center gap-2 text-sm font-bold text-white"><DoorOpen className="w-4 h-4 text-indigo-400" /> Join a room</div><p className="text-xs text-slate-500 mt-1 mb-4">Enter a room code shared by a classmate.</p><input value={roomInput} onChange={(event) => setRoomInput(event.target.value)} placeholder="Room code, e.g. CC-101" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 mb-3" /><button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-xs font-bold"><DoorOpen className="w-4 h-4" /> Join room</button></form></div></div></div></div>;
  }

  const controls = [
    { label: voiceOn ? 'Voice on' : 'Voice off', icon: voiceOn ? Mic : Mic2, active: voiceOn, action: () => setVoiceOn(!voiceOn), activeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' },
    { label: videoOn ? 'Video on' : 'Video off', icon: videoOn ? Video : VideoOff, active: videoOn, action: () => setVideoOn(!videoOn), activeClass: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300' },
    { label: sharing ? 'Stop sharing' : 'Share screen', icon: MonitorUp, active: sharing, action: () => setSharing(!sharing), activeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300' },
    { label: handRaised ? 'Lower hand' : 'Raise hand', icon: Hand, active: handRaised, action: () => setHandRaised(!handRaised), activeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300' }
  ];

  return <div className="space-y-5 pb-10"><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live study room</div><div className="flex items-center gap-3 mt-2"><h1 className="text-2xl md:text-3xl font-black text-white">Study Room</h1><span className="flex items-center gap-1 text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 font-mono">{room}<button onClick={() => navigator.clipboard?.writeText(room)} title="Copy room code" className="text-slate-500 hover:text-white"><Copy className="w-3 h-3" /></button></span></div><p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-400" /> 6 members <span className="text-slate-700">•</span> Backend Sprint: API Design</p></div><button onClick={() => setRoom(null)} className="self-start flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"><X className="w-3.5 h-3.5" /> Leave room</button></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{controls.map(({ label, icon: Icon, active, action, activeClass }) => <button key={label} onClick={action} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-semibold transition-all ${active ? activeClass : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}><Icon className="w-4 h-4" />{label}</button>)}</div><div className="grid grid-cols-1 xl:grid-cols-12 gap-5"><div className="xl:col-span-7 space-y-5"><Whiteboard /><CodeEditor /></div><div className="xl:col-span-5 space-y-5"><ChatPanel messages={messages} onSend={sendMessage} /><DoubtSection /><section className="glass-card rounded-2xl border-slate-800 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-amber-400" /><h2 className="text-sm font-bold text-white">Session timer</h2></div><span className="text-[10px] text-slate-500">Pomodoro focus</span></div><div className="flex items-center justify-between mt-3"><span className="font-mono text-3xl font-black text-white tracking-wider">{formatTime(seconds)}</span><div className="flex gap-2"><button onClick={() => setTimerRunning(!timerRunning)} className="px-3 py-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/20 text-xs font-bold">{timerRunning ? 'Pause' : 'Start'}</button><button onClick={() => { setSeconds(25 * 60); setTimerRunning(false); }} title="Reset timer" className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><TimerReset className="w-4 h-4" /></button></div></div><div className="h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden"><div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(seconds / (25 * 60)) * 100}%` }} /></div></section></div></div><div className="text-center text-[10px] text-slate-600 flex items-center justify-center gap-1.5"><Wifi className="w-3 h-3 text-emerald-500" /> Demo mode: collaboration, media, and code execution are simulated locally</div></div>;
}
