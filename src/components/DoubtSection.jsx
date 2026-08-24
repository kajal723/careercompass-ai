import React, { useState } from 'react';
import { HelpCircle, Send, ThumbsUp } from 'lucide-react';

export default function DoubtSection() {
  const [doubt, setDoubt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [upvoted, setUpvoted] = useState(false);

  const submitDoubt = (event) => {
    event.preventDefault();
    if (!doubt.trim()) return;
    setSubmitted(true);
    setDoubt('');
  };

  return (
    <section className="glass-card rounded-2xl border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-1"><HelpCircle className="w-4 h-4 text-rose-400" /><h2 className="text-sm font-bold text-white">Doubts queue</h2><span className="ml-auto text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full px-2 py-0.5">{submitted ? 1 : 0} open</span></div>
      <p className="text-[10px] text-slate-500 mb-3">Ask the room and keep useful answers visible.</p>
      <div className="space-y-2 mb-3">{submitted && <div className="bg-slate-900/80 rounded-xl p-2.5"><p className="text-[11px] text-slate-300">Your doubt is now visible to this room.</p><button onClick={() => setUpvoted(!upvoted)} className={`mt-1.5 flex items-center gap-1 text-[10px] ${upvoted ? 'text-rose-300' : 'text-slate-500'}`}><ThumbsUp className="w-3 h-3" /> {upvoted ? 1 : 0} helpful</button></div>}</div>
      {submitted && <div className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-2 mb-2">Your doubt is now visible to the room.</div>}
      <form onSubmit={submitDoubt} className="flex gap-2"><input value={doubt} onChange={(event) => setDoubt(event.target.value)} placeholder="Add a doubt..." className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-[11px] text-white placeholder:text-slate-600 outline-none focus:border-rose-500" /><button aria-label="Post doubt" title="Post doubt" className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/20"><Send className="w-3.5 h-3.5" /></button></form>
    </section>
  );
}
