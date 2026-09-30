import { useState, type PointerEvent } from 'react';
import { ArrowLeftRight, ChevronDown, ChevronRight, Folder, FolderOpen, LayoutGrid, List, Search } from 'lucide-react';
import { useHost, useWorkspace } from './host';
import { modules } from '../modules/registry';
import { IconButton } from '../design/Button';

type Side = 'left' | 'right';
export function Sidebar({ side, kind }: { side: Side; kind: 'projects' | 'files' }) {
  const host = useHost(); const { state } = useWorkspace();
  const [expanded, setExpanded] = useState(true); const [actual, setActual] = useState(true); const [media, setMedia] = useState(false);
  const [grid, setGrid] = useState(false); const [query, setQuery] = useState('');
  const p = state.preferences; const width = side === 'left' ? p.leftWidth ?? 210 : p.rightWidth ?? 240;
  const items = Object.values(state.contents).filter(c => c.module !== 'start' && c.title.toLowerCase().includes(query.toLowerCase()));
  function open(id: string) {
    const candidates = Object.values(host.store.getSnapshot().state.views).filter(v => v.contentId === id);
    const v = candidates.find(v => v.status === 'open') ?? candidates[0];
    if (v) host.reopen(v.id);
  }
  function resize(e: PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const start = e.clientX; const initial = width; const node = e.currentTarget;
    function move(ev: globalThis.PointerEvent) {
      const next = initial + (ev.clientX - start) * (side === 'left' ? 1 : -1);
      if (next < 72) { host.store.setPreferences(kind === 'projects' ? { navigator: false } : { files: false }); end(); return; }
      host.store.setPreferences(side === 'left' ? { leftWidth: Math.max(160, Math.min(480, next)) } : { rightWidth: Math.max(160, Math.min(480, next)) });
    }
    function end() { node.removeEventListener('pointermove', move); node.removeEventListener('pointerup', end); node.removeEventListener('pointercancel', end); }
    node.addEventListener('pointermove', move); node.addEventListener('pointerup', end); node.addEventListener('pointercancel', end);
  }
  return <aside className={`sidebar sidebar-${side}`} style={{ width }} aria-label={kind === 'projects' ? 'Proyectos' : 'Archivos del proyecto'}>
    {kind === 'projects' ? <div className="projects-tree"><button className="tree-row root-row" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}<FolderOpen size={16} /><span>{state.project.title === 'Mi espacio de trabajo' ? 'Piloto RZ' : state.project.title}</span></button>{expanded && <button className="tree-row episode-row selected" aria-label="Abrir Episodio 01" onClick={() => { host.store.setPreferences({ files: true }); }}><Folder size={15} /><span>Episodio 01</span></button>}</div>
    : <><div className="sidebar-heading"><span>Episodio 01</span><IconButton label={grid ? 'Vista de árbol' : 'Vista de cuadrícula'} onClick={() => setGrid(!grid)}>{grid ? <List size={15} /> : <LayoutGrid size={15} />}</IconButton></div>
      <label className="file-search"><Search size={14} /><input aria-label="Filtrar archivos" placeholder="Buscar" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <button className="tree-row" aria-expanded={actual} onClick={() => setActual(!actual)}>{actual ? <ChevronDown size={13} /> : <ChevronRight size={13} />}<FolderOpen size={15} /><span>Actual</span></button>
      {actual && <div className={grid ? 'file-grid' : 'file-tree'}>{items.map(c => { const Icon = modules[c.module].icon; const selected = Object.values(state.views).some(v => v.contentId === c.id && v.status === 'open'); return <button className={`file-item ${selected ? 'open-file' : ''}`} key={c.id} aria-label={`Abrir archivo ${c.title}`} onDoubleClick={() => open(c.id)} onKeyDown={e => { if (e.key === 'Enter') open(c.id); }} draggable onDragStart={e => e.dataTransfer.setData('application/x-canvarz-content', c.id)}><Icon size={15} /><span>{c.title}{c.module === 'document' ? '.md' : ''}</span></button>; })}</div>}
      <button className="tree-row" aria-expanded={media} onClick={() => setMedia(!media)}>{media ? <ChevronDown size={13} /> : <ChevronRight size={13} />}<Folder size={15} /><span>Medios</span></button>
    </>}
    <div className={`sidebar-divider divider-${side}`} role="separator" aria-label={`Ancho del lateral ${side === 'left' ? 'izquierdo' : 'derecho'}`} aria-orientation="vertical" tabIndex={0} onPointerDown={resize} onKeyDown={e => {
      if (e.key === 'Home') host.store.setPreferences(kind === 'projects' ? { navigator: false } : { files: false });
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') host.store.setPreferences(side === 'left' ? { leftWidth: Math.max(160, Math.min(480, width + (e.key === 'ArrowRight' ? 20 : -20))) } : { rightWidth: Math.max(160, Math.min(480, width + (e.key === 'ArrowLeft' ? 20 : -20))) });
    }}><IconButton label="Intercambiar laterales" onClick={() => host.store.setPreferences({ swapped: !p.swapped })}><ArrowLeftRight size={13} /></IconButton></div>
  </aside>;
}
