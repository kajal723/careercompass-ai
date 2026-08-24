import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Pencil, RotateCcw, Square } from 'lucide-react';

export default function Whiteboard({ onBoardEvent, remoteEvent }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [connectionStatus, setConnectionStatus] = useState('Offline');

  useEffect(() => {
    const receiveBoardEvent = (event) => {
      const boardEvent = event.detail;
      if (boardEvent.action === 'clear') clearBoard();
      if (boardEvent.action === 'draw') drawSegment(boardEvent);
    };
    window.addEventListener('study-room-board-event', receiveBoardEvent);
    return () => window.removeEventListener('study-room-board-event', receiveBoardEvent);
  }, []);

  useEffect(() => {
    const receiveConnectionStatus = (event) => setConnectionStatus(event.detail);
    window.addEventListener('study-room-connection', receiveConnectionStatus);
    return () => window.removeEventListener('study-room-connection', receiveConnectionStatus);
  }, []);

  const drawSegment = (segment) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context || !segment?.from || !segment?.to) return;
    const coordinates = [segment.from.x, segment.from.y, segment.to.x, segment.to.y];
    if (!coordinates.every(Number.isFinite)) return;
    context.strokeStyle = segment.tool === 'eraser' ? '#0b1220' : '#67e8f9';
    context.lineWidth = segment.tool === 'eraser' ? 18 : 3;
    context.beginPath();
    context.moveTo(segment.from.x, segment.from.y);
    context.lineTo(segment.to.x, segment.to.y);
    context.stroke();
  };

  useEffect(() => {
    if (!remoteEvent) return;
    if (remoteEvent.action === 'clear') {
      const context = canvasRef.current?.getContext('2d');
      if (context) { context.fillStyle = '#0b1220'; context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); }
    }
    if (remoteEvent.action === 'draw') drawSegment(remoteEvent);
  }, [remoteEvent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#0b1220';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, []);

  const pointFromEvent = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    const point = {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height
    };
    return Number.isFinite(point.x) && Number.isFinite(point.y) ? point : null;
  };

  const startDrawing = (event) => {
    const point = pointFromEvent(event);
    const context = canvasRef.current?.getContext('2d');
    if (!context || !point) return;
    drawingRef.current = { lastPoint: point };
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    const point = pointFromEvent(event);
    if (!drawingRef.current || !point) return;
    const segment = { action: 'draw', tool, from: drawingRef.current.lastPoint, to: point };
    drawSegment(segment);
    drawingRef.current.lastPoint = point;
    onBoardEvent?.(segment);
    window.studyRoomSendBoardEvent?.(segment);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#0b1220';
    context.fillRect(0, 0, canvas.width, canvas.height);
    onBoardEvent?.({ action: 'clear' });
    window.studyRoomSendBoardEvent?.({ action: 'clear' });
  };

  return (
    <section className="glass-card rounded-2xl border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div><h2 className="text-sm font-bold text-white">Collaborative whiteboard</h2><p className="text-[10px] text-slate-500 mt-0.5">Draw architecture, formulas, and ideas together</p></div>
        <div className="flex items-center gap-1">
          <button onClick={() => setTool('pen')} className={`p-2 rounded-lg ${tool === 'pen' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:bg-slate-800'}`} title="Pen"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:bg-slate-800'}`} title="Eraser"><Eraser className="w-3.5 h-3.5" /></button>
          <button onClick={clearBoard} className="p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white" title="Clear whiteboard"><RotateCcw className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="p-3">
        <canvas ref={canvasRef} width="800" height="360" onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={() => { drawingRef.current = null; }} onPointerLeave={() => { drawingRef.current = null; }} className="w-full aspect-[2/1] rounded-xl border border-slate-800 cursor-crosshair touch-none" />
        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500"><Square className="w-3 h-3 text-cyan-400" /> Live drawing sync · {connectionStatus}</div>
      </div>
    </section>
  );
}
