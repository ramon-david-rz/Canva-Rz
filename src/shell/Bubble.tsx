import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Copy, GripVertical, MessageCircle, Minus } from 'lucide-react';
import { IconButton } from '../design/Button';
import { useHost, useWorkspace } from './host';

export function Bubble({ anchorId }: { anchorId: string }) {
  const host = useHost(); const { state } = useWorkspace(); const [expanded, setExpanded] = useState(true);
  const chat = state.activeChatId ? state.contents[state.activeChatId] : null;
  const node = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(76);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [offset, setOffset] = useState(state.preferences.bubblePosition ?? { x: .5, y: .86 });
  useEffect(() => { const update = () => setSize({ w: window.innerWidth, h: window.innerHeight }); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, []);
  useEffect(() => { if (!node.current) return; const observer = new ResizeObserver(entries => setHeight(entries[0].target.getBoundingClientRect().height)); observer.observe(node.current); return () => observer.disconnect(); }, []);
  function drag(e: PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY }; const initial = offset; const target = e.currentTarget;
    let next = initial;
    const move = (ev: globalThis.PointerEvent) => { next = { x: Math.max(0, Math.min(1, initial.x + (ev.clientX - start.x) / Math.max(1, size.w - (node.current?.offsetWidth ?? 350) - 16))), y: Math.max(0, Math.min(1, initial.y + (ev.clientY - start.y) / Math.max(1, size.h - height - 56))) }; setOffset(next); };
    const end = () => { host.store.setPreferences({ bubblePosition: next }); target.removeEventListener('pointermove', move); target.removeEventListener('pointerup', end); target.removeEventListener('pointercancel', end); };
    target.addEventListener('pointermove', move); target.addEventListener('pointerup', end); target.addEventListener('pointercancel', end);
  }
  function showChat() {
    if (!chat) { host.open('chat', undefined, 'right'); return; }
    const existing = Object.values(state.views).find(v => v.contentId === chat.id && v.status !== 'closed');
    if (existing) host.reopen(existing.id); else host.open('chat', chat.id, 'right');
  }
  const width = expanded ? Math.min(380, size.w - 24) : 72;
  useEffect(() => {
    if (state.preferences.bubblePosition) return;
    const rect = document.getElementById(`panel-${anchorId}`)?.getBoundingClientRect(); if (!rect) return;
    setOffset({ x: Math.max(0, Math.min(1, (rect.left + (rect.width - width) / 2 - 8) / Math.max(1, size.w - width - 16))), y: Math.max(0, Math.min(1, (rect.bottom - height - 18 - 48) / Math.max(1, size.h - height - 56))) });
  }, [anchorId, width, height, size.w, size.h, state.preferences.bubblePosition]);
  return <div ref={node} className={`bubble ${expanded ? 'expanded' : ''}`} style={{ width, left: 8 + offset.x * Math.max(0, size.w - width - 16), top: 48 + offset.y * Math.max(0, size.h - height - 56) }} aria-label="Chat flotante">
    <IconButton label="Mover burbuja" className="bubble-grip" onPointerDown={drag} onKeyDown={e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return; e.preventDefault();
      const next = { x: Math.max(0, Math.min(1, offset.x + (e.key === 'ArrowLeft' ? -20 : e.key === 'ArrowRight' ? 20 : 0) / Math.max(1, size.w - width - 16))), y: Math.max(0, Math.min(1, offset.y + (e.key === 'ArrowUp' ? -20 : e.key === 'ArrowDown' ? 20 : 0) / Math.max(1, size.h - height - 56))) }; setOffset(next); host.store.setPreferences({ bubblePosition: next });
    }}><GripVertical size={14} /></IconButton>
    {expanded ? <>{chat ? <textarea aria-label="Borrador de la burbuja" rows={2} placeholder="Escribe" value={chat.text} onChange={e => host.store.setText(chat.id, e.target.value)} /> : <IconButton label="Abrir Chat" onClick={showChat}><MessageCircle size={18} /></IconButton>}<div className="bubble-actions"><IconButton label="Abrir chat en panel" onClick={showChat}><Copy size={14} /></IconButton><IconButton label="Reducir burbuja" onClick={() => setExpanded(false)}><Minus size={14} /></IconButton></div></> : <IconButton label="Expandir burbuja de chat" onClick={() => setExpanded(true)}><MessageCircle size={17} /></IconButton>}
  </div>;
}
