import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export default function ChatPanel({ messages, onSend }) {
  const [draft, setDraft] = useState('');

  const submitMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = draft.trim();
    if (!trimmedMessage) return;
    onSend(trimmedMessage);
    setDraft('');
  };

  return (
    <section className="glass-card rounded-2xl border-slate-800 flex flex-col min-h-[340px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Group chat</h2>
        </div>
        <span className="text-[10px] text-slate-500">Private channel</span>
      </div>
      <div className="flex-1 space-y-3 p-4 overflow-y-auto max-h-64">
        {messages.length === 0 && <p className="text-xs text-slate-600 text-center py-8">No messages yet. Start the conversation.</p>}
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${message.isSelf ? 'bg-indigo-500/25 text-indigo-200' : 'bg-cyan-500/15 text-cyan-300'}`}>
              {message.author.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold text-slate-200">{message.author}</span>
                <span className="text-[10px] text-slate-600">{message.time}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submitMessage} className="p-3 border-t border-slate-800 flex gap-2">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message the room..." className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500" />
        <button type="submit" aria-label="Send message" title="Send message" className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"><Send className="w-4 h-4" /></button>
      </form>
    </section>
  );
}
