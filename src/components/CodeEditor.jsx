import React, { useState } from 'react';
import { CheckCircle2, Code2, Play, RotateCcw } from 'lucide-react';

const starterCode = `function studyPlan(hours) {
  const focus = hours >= 2 ? 'deep work' : 'quick review';
  return { focus, ready: true };
}`;

export default function CodeEditor() {
  const [code, setCode] = useState(starterCode);
  const [ranCode, setRanCode] = useState(false);

  return (
    <section className="glass-card rounded-2xl border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2"><Code2 className="w-4 h-4 text-amber-400" /><div><h2 className="text-sm font-bold text-white">Code editor</h2><p className="text-[10px] text-slate-500 mt-0.5">Pair on a small challenge</p></div></div>
        <div className="flex gap-1"><button onClick={() => setCode(starterCode)} title="Reset code" className="p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button><button onClick={() => setRanCode(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold hover:bg-emerald-500/25"><Play className="w-3 h-3" /> Run</button></div>
      </div>
      <div className="p-3">
        <textarea value={code} onChange={(event) => { setCode(event.target.value); setRanCode(false); }} spellCheck="false" className="w-full h-44 resize-none rounded-xl bg-[#080d17] border border-slate-800 p-3 font-mono text-[11px] leading-5 text-cyan-100 outline-none focus:border-amber-500/50" />
        <div className={`mt-2 rounded-lg px-3 py-2 text-[10px] font-mono ${ranCode ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-900 text-slate-500'}`}>{ranCode ? <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Output: {`{ focus: 'deep work', ready: true }`}</span> : 'Output will appear here when you run the snippet.'}</div>
      </div>
    </section>
  );
}
