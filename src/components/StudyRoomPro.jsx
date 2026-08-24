import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock3, Copy, DoorOpen, Hand, LogIn, LogOut, Mail, Mic, MicOff, MonitorUp, Plus, ShieldCheck, TimerReset, Users, Video, VideoOff, Wifi, X } from 'lucide-react';
import ChatPanel from './ChatPanel';
import Whiteboard from './Whiteboard';
import CodeEditor from './CodeEditor';
import DoubtSection from './DoubtSection';

const roomStoreKey = 'careercompass-study-rooms';
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
const getStoredRooms = () => {
  try { return JSON.parse(window.localStorage.getItem(roomStoreKey) || '{}'); } catch { return {}; }
};
const makeRoomCode = () => `CC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
function RemoteVideoTile({ participant }) {
  const videoRef = useRef(null);
  const screenRef = useRef(null);
  useEffect(() => { if (videoRef.current) videoRef.current.srcObject = participant.stream || null; if (screenRef.current) screenRef.current.srcObject = participant.screenStream || null; }, [participant.stream, participant.screenStream]);
  return <div className="relative min-w-0 space-y-2"><video ref={videoRef} autoPlay playsInline className="w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 object-cover" /><span className="absolute bottom-2 left-2 rounded-md bg-slate-950/80 px-2 py-1 text-[10px] text-white">{participant.name}</span>{participant.screenStream && <video ref={screenRef} autoPlay playsInline className="w-full aspect-video rounded-xl bg-slate-950 border border-amber-500/30 object-contain" />}</div>;
}

export default function StudyRoomPro() {
  const [user, setUser] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [room, setRoom] = useState(null);
  const [roomInput, setRoomInput] = useState('');
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
  const [connectionStatus, setConnectionStatus] = useState('Offline');
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [remoteBoardEvent, setRemoteBoardEvent] = useState(null);
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const socketRef = useRef(null);
  const peersRef = useRef(new Map());
  const reconnectRef = useRef(null);
  const participantIdRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  useEffect(() => {
    if (!timerRunning || seconds === 0) return undefined;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning, seconds]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
    if (screenRef.current) screenRef.current.srcObject = screenStream;
    mediaStreamRef.current = mediaStream;
    screenStreamRef.current = screenStream;
  }, [mediaStream, screenStream]);

  useEffect(() => () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const login = (event) => {
    event.preventDefault();
    const name = nameInput.trim();
    const email = emailInput.trim();
{remoteParticipants.some((participant) => participant.stream) && <section className="glass-card rounded-2xl border-slate-800 p-4"><h2 className="text-sm font-bold text-white mb-3">Participants on camera</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{remoteParticipants.filter((participant) => participant.stream).map((participant) => <RemoteVideoTile key={participant.participant_id} participant={participant} />)}</div></section>}
    if (!name || !email || !email.includes('@')) {
      setError('Enter your name and a valid email to continue.');
      return;
    }
    setUser({ name, email });
    setError('');
  };

  const enterRoom = (event, joining = false) => {
    event.preventDefault();
    const roomCode = joining ? roomInput.trim().toUpperCase() : makeRoomCode();
    if (joining && (!roomCode || !getStoredRooms()[roomCode])) {
      setError('That room code is not available. Ask the host to share the current code.');
      return;
    }
    if (!joining) window.localStorage.setItem(roomStoreKey, JSON.stringify({ ...getStoredRooms(), [roomCode]: { createdAt: Date.now() } }));
    setRoom(roomCode);
    setMessages([]);
    setError('');
  };

  useEffect(() => {
    if (!room || !user) return undefined;
    const participantId = `${user.email}-${window.crypto?.randomUUID?.() || Date.now()}`;
    participantIdRef.current = participantId;
    const participant = { id: participantId, participant_id: participantId, name: user.name, video_on: false, voice_on: false };
    const peerConnections = peersRef.current;
    let disposed = false;
    setParticipants([participant]);
    const removePeer = (peerId) => {
      peerConnections.get(peerId)?.close();
      peerConnections.delete(peerId);
      setRemoteParticipants((current) => current.filter((item) => item.participant_id !== peerId));
    };
    const send = (message) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify(message));
    };
    const createPeer = (peerId, initiator) => {
      if (peerConnections.has(peerId)) return peerConnections.get(peerId);
      const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      mediaStreamRef.current?.getTracks().forEach((track) => peer.addTrack(track, mediaStreamRef.current));
      peer.onicecandidate = ({ candidate }) => candidate && send({ type: 'signal', target_id: peerId, signal: { type: 'ice', candidate } });
      peer.onnegotiationneeded = async () => {
        if (peer.signalingState !== 'stable') return;
        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          send({ type: 'signal', target_id: peerId, signal: { type: 'offer', description: offer } });
        } catch { removePeer(peerId); }
      };
      peer.ontrack = ({ streams }) => {
        const stream = streams[0];
        if (stream) setRemoteParticipants((current) => current.some((item) => item.participant_id === peerId) ? current.map((item) => item.participant_id === peerId ? (item.stream ? { ...item, screenStream: stream } : { ...item, stream }) : item) : [...current, { participant_id: peerId, name: 'Participant', stream }]);
      };
      peer.onconnectionstatechange = () => { if (['failed', 'closed', 'disconnected'].includes(peer.connectionState)) removePeer(peerId); };
      peerConnections.set(peerId, peer);
      if (initiator) peer.createOffer().then((offer) => peer.setLocalDescription(offer).then(() => send({ type: 'signal', target_id: peerId, signal: { type: 'offer', description: offer } }))).catch(() => removePeer(peerId));
      return peer;
    };
    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const socket = new WebSocket(`${protocol}://${window.location.hostname}:8000/ws/study/${encodeURIComponent(room)}/${encodeURIComponent(participantId)}?name=${encodeURIComponent(user.name)}`);
      socketRef.current = socket;
      socket.onopen = () => { setConnectionStatus('Connected'); send({ type: 'presence', participant }); };
      socket.onmessage = async ({ data }) => {
        const message = JSON.parse(data);
        if (message.type === 'room_state') {
          message.participants.forEach((item) => { setRemoteParticipants((current) => current.some((entry) => entry.participant_id === item.participant_id) ? current : [...current, item]); createPeer(item.participant_id, true); });
        }
        if (message.type === 'presence' && message.action === 'join') { setRemoteParticipants((current) => current.some((item) => item.participant_id === message.participant.participant_id) ? current : [...current, message.participant]); createPeer(message.participant.participant_id, true); }
        if (message.type === 'presence' && message.action === 'leave') removePeer(message.participant_id);
        if (message.type === 'signal') {
          const peer = createPeer(message.sender_id, false);
          if (message.signal.type === 'offer') { await peer.setRemoteDescription(message.signal.description); const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); send({ type: 'signal', target_id: message.sender_id, signal: { type: 'answer', description: answer } }); }
          if (message.signal.type === 'answer') await peer.setRemoteDescription(message.signal.description);
          if (message.signal.type === 'ice' && message.signal.candidate) await peer.addIceCandidate(message.signal.candidate);
        }
        if (message.type === 'chat') setMessages((current) => [...current, message.message]);
        if (message.type === 'whiteboard') { setRemoteBoardEvent(message.event); window.dispatchEvent(new CustomEvent('study-room-board-event', { detail: message.event })); }
        if (message.type === 'media') setRemoteParticipants((current) => current.map((item) => item.participant_id === message.sender_id ? { ...item, video_on: message.video_on, voice_on: message.voice_on } : item));
      };
      socket.onclose = () => { if (!disposed) { setConnectionStatus('Reconnecting'); reconnectRef.current = window.setTimeout(connect, 1500); } };
      socket.onerror = () => setConnectionStatus('Connection error');
    };
    connect();
    return () => { disposed = true; window.clearTimeout(reconnectRef.current); send({ type: 'presence', action: 'leave' }); socketRef.current?.close(); peerConnections.forEach((peer) => peer.close()); peerConnections.clear(); setRemoteParticipants([]); setConnectionStatus('Offline'); };
  }, [room, user]);

  const sendMessage = (text) => {
    const message = { id: `${Date.now()}-${Math.random()}`, author: user.name, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSelf: true };
    setMessages((current) => [...current, message]);
    socketRef.current?.send(JSON.stringify({ type: 'chat', message: { ...message, isSelf: false } }));
  };

  const sendBoardEvent = (event) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify({ type: 'whiteboard', event }));
  };

  useEffect(() => {
    window.studyRoomSendBoardEvent = sendBoardEvent;
    return () => { delete window.studyRoomSendBoardEvent; };
  }, [room]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('study-room-connection', { detail: connectionStatus }));
  }, [connectionStatus]);

  const updateMedia = async (nextVoice, nextVideo) => {
    if (!nextVoice && !nextVideo) {
      mediaStream?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((peer) => peer.getSenders().forEach((sender) => sender.replaceTrack(null)));
      setMediaStream(null); setVoiceOn(false); setVideoOn(false); socketRef.current?.send(JSON.stringify({ type: 'media', video_on: false, voice_on: false })); return;
    }
    if (!navigator.mediaDevices?.getUserMedia) { setMediaError('This browser does not support camera and microphone access.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: nextVoice, video: nextVideo });
      mediaStream?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((peer) => stream.getTracks().forEach((track) => {
        const sender = peer.getSenders().find((item) => item.track?.kind === track.kind);
        if (sender) sender.replaceTrack(track);
        else peer.addTrack(track, stream);
      }));
      setMediaStream(stream); setVoiceOn(nextVoice); setVideoOn(nextVideo); setMediaError(''); socketRef.current?.send(JSON.stringify({ type: 'media', video_on: nextVideo, voice_on: nextVoice }));
    } catch { setMediaError('Camera or microphone permission was denied. Check browser permissions and try again.'); }
  };

  const shareScreen = async () => {
    if (sharing) { const track = screenStream?.getVideoTracks()[0]; peersRef.current.forEach((peer) => peer.getSenders().find((sender) => sender.track === track)?.replaceTrack(null)); screenStream?.getTracks().forEach((item) => item.stop()); setScreenStream(null); setSharing(false); socketRef.current?.send(JSON.stringify({ type: 'media', screen_on: false })); return; }
    if (!navigator.mediaDevices?.getDisplayMedia) { setMediaError('Screen sharing is not supported in this browser.'); return; }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      stream.getVideoTracks()[0].onended = () => { peersRef.current.forEach((peer) => peer.getSenders().find((sender) => sender.track === stream.getVideoTracks()[0])?.replaceTrack(null)); setScreenStream(null); setSharing(false); socketRef.current?.send(JSON.stringify({ type: 'media', screen_on: false })); };
      peersRef.current.forEach((peer) => peer.addTrack(stream.getVideoTracks()[0], stream));
      setScreenStream(stream); setSharing(true); setMediaError(''); socketRef.current?.send(JSON.stringify({ type: 'media', screen_on: true }));
    } catch { setMediaError('Screen sharing was cancelled or is unavailable in this browser.'); }
  };

  const leaveRoom = () => {
    mediaStream?.getTracks().forEach((track) => track.stop()); screenStream?.getTracks().forEach((track) => track.stop());
    setMediaStream(null); setScreenStream(null); setSharing(false); setVoiceOn(false); setVideoOn(false); setRoom(null); setRoomInput('');
  };

  if (!user) return <div className="max-w-md mx-auto py-8 md:py-16"><div className="glass-card rounded-3xl border-cyan-500/20 p-6 md:p-8"><div className="w-11 h-11 rounded-2xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center"><LogIn className="w-5 h-5" /></div><h1 className="text-2xl font-black text-white mt-5">Enter Study Rooms</h1><p className="text-sm text-slate-400 mt-2">Sign in with your name and email to join a private learning space.</p><form onSubmit={login} className="space-y-3 mt-6"><label className="block text-xs font-semibold text-slate-300">Your name<input required value={nameInput} onChange={(event) => setNameInput(event.target.value)} placeholder="e.g. Aisha Khan" className="mt-1.5 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500" /></label><label className="block text-xs font-semibold text-slate-300">Email address<div className="relative mt-1.5"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" /><input required type="email" value={emailInput} onChange={(event) => setEmailInput(event.target.value)} placeholder="you@example.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500" /></div></label>{error && <p role="alert" className="text-xs text-rose-300">{error}</p>}<button className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl py-3 text-sm font-bold"><Check className="w-4 h-4" /> Continue</button></form><div className="flex items-center gap-2 mt-6 text-[10px] text-slate-500"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Your room identity stays local to this demo.</div></div></div>;

  if (!room) return <div className="max-w-3xl mx-auto py-8 md:py-12"><div className="glass-card rounded-3xl border-cyan-500/20 p-6 md:p-10"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest"><Users className="w-4 h-4" /> Study Rooms</div><h1 className="text-3xl font-black text-white mt-3">Find your focus room</h1><p className="text-sm text-slate-400 mt-2">Welcome, {user.name}. Create a private room or enter a code from your study partner.</p></div><button onClick={() => setUser(null)} title="Sign out" className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800"><LogOut className="w-4 h-4" /></button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"><form onSubmit={(event) => enterRoom(event)} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5"><Plus className="w-5 h-5 text-cyan-400" /><h2 className="text-sm font-bold text-white mt-3">Create a room</h2><p className="text-xs text-slate-500 mt-1 mb-5">Generate a unique code to share with your group.</p><button className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl py-2.5 text-xs font-bold"><Plus className="w-4 h-4" /> Create room</button></form><form onSubmit={(event) => enterRoom(event, true)} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5"><DoorOpen className="w-5 h-5 text-indigo-400" /><h2 className="text-sm font-bold text-white mt-3">Join a room</h2><p className="text-xs text-slate-500 mt-1 mb-3">Use the code shared by your host.</p><input value={roomInput} onChange={(event) => setRoomInput(event.target.value)} placeholder="CC-XXXX" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 mb-3" /><button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-xs font-bold"><DoorOpen className="w-4 h-4" /> Join room</button></form></div>{error && <p role="alert" className="text-xs text-rose-300 mt-4">{error}</p>}</div></div>;

  const controls = [
    { label: voiceOn ? 'Mute' : 'Unmute', icon: voiceOn ? Mic : MicOff, active: voiceOn, action: () => updateMedia(!voiceOn, videoOn), activeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' },
    { label: videoOn ? 'Camera on' : 'Camera off', icon: videoOn ? Video : VideoOff, active: videoOn, action: () => updateMedia(voiceOn, !videoOn), activeClass: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300' },
    { label: sharing ? 'Stop sharing' : 'Share screen', icon: MonitorUp, active: sharing, action: shareScreen, activeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300' },
    { label: handRaised ? 'Lower hand' : 'Raise hand', icon: Hand, active: handRaised, action: () => setHandRaised(!handRaised), activeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-300' }
  ];

  return <div className="space-y-5 pb-10"><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Private room</div><div className="flex items-center gap-3 mt-2"><h1 className="text-2xl md:text-3xl font-black text-white">Study Room</h1><span className="flex items-center gap-1 text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 font-mono">{room}<button onClick={() => navigator.clipboard?.writeText(room)} title="Copy room code" className="text-slate-500 hover:text-white"><Copy className="w-3 h-3" /></button></span></div><p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-400" /> {participants.length} participant{participants.length === 1 ? '' : 's'} <span className="text-slate-700">•</span> {user.name}</p></div><button onClick={leaveRoom} className="self-start flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"><X className="w-3.5 h-3.5" /> Leave room</button></div>{(mediaError || error) && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200"><Wifi className="w-4 h-4 shrink-0 mt-0.5" />{mediaError || error}</div>}<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{controls.map(({ label, icon: Icon, active, action, activeClass }) => <button key={label} onClick={action} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-semibold transition-all ${active ? activeClass : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}><Icon className="w-4 h-4" />{label}</button>)}</div><div className="grid grid-cols-1 xl:grid-cols-12 gap-5"><div className="xl:col-span-7 space-y-5"><section className="glass-card rounded-2xl border-slate-800 overflow-hidden"><div className="flex items-center justify-between px-4 py-3 border-b border-slate-800"><div><h2 className="text-sm font-bold text-white">Live workspace</h2><p className="text-[10px] text-slate-500 mt-0.5">Camera is off until you enable it.</p></div><div className="flex gap-2"><video ref={videoRef} autoPlay muted playsInline className={`w-24 h-14 rounded-lg object-cover bg-slate-950 border border-slate-800 ${videoOn ? '' : 'hidden'}`} /><video ref={screenRef} autoPlay muted playsInline className={`w-24 h-14 rounded-lg object-cover bg-slate-950 border border-amber-500/30 ${sharing ? '' : 'hidden'}`} /></div></div><div className="p-4"><div className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Media permissions are requested only when you turn a control on.</div><div className="flex flex-wrap gap-2 mt-3">{participants.map((participant) => <span key={participant.id} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-2.5 py-2 text-xs text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-400" />{participant.name}</span>)}</div></div></section><Whiteboard /><CodeEditor /></div><div className="xl:col-span-5 space-y-5"><ChatPanel messages={messages} onSend={sendMessage} /><DoubtSection /><section className="glass-card rounded-2xl border-slate-800 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-amber-400" /><h2 className="text-sm font-bold text-white">Session timer</h2></div><span className="text-[10px] text-slate-500">Pomodoro focus</span></div><div className="flex items-center justify-between mt-3"><span className="font-mono text-3xl font-black text-white tracking-wider">{formatTime(seconds)}</span><div className="flex gap-2"><button onClick={() => setTimerRunning(!timerRunning)} className="px-3 py-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/20 text-xs font-bold">{timerRunning ? 'Pause' : 'Start'}</button><button onClick={() => { setSeconds(25 * 60); setTimerRunning(false); }} title="Reset timer" className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><TimerReset className="w-4 h-4" /></button></div></div><div className="h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden"><div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(seconds / (25 * 60)) * 100}%` }} /></div></section></div></div><div className="text-center text-[10px] text-slate-600 flex items-center justify-center gap-1.5"><Wifi className="w-3 h-3 text-emerald-500" /> Private room state is isolated by room code in this browser</div></div>;
}
