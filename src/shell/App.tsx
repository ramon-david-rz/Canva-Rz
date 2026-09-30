import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type DragEvent } from 'react';
import { DockviewReact, type DockviewApi, type DockviewReadyEvent, type IDockviewPanelProps, type SerializedDockview } from 'dockview-react';
import * as Popover from '@radix-ui/react-popover';
import { ArrowLeft, ArrowRight, ArrowLeftRight, ArrowUpRight, Check, Circle, Columns2, Copy, FolderOpen, LayoutGrid, Maximize2, MessageCircle, Minus, MoreHorizontal, PanelLeft, PanelRight, Plus, Settings2, Split, X } from 'lucide-react';
import { localProject } from '../adapters/local-project';
import type { WorkspaceStore } from '../core/workspace';
import type { ViewRecord } from '../core/contracts';
import { modules } from '../modules/registry';
import { IconButton } from '../design/Button';
import { Menu, MenuItem, MenuSeparator } from '../design/Menu';
import { HostContext, useHost, useWorkspace, type HostServices } from './host';
import { Sidebar } from './Sidebar';
import { Bubble } from './Bubble';


const theme = { name: 'canva-rz', className: 'dockview-theme-rz', gap: 2 };

function ModulePanel(props: IDockviewPanelProps<{ viewId: string }>) {
  const host = useHost(); const { state } = useWorkspace(); const [drop, setDrop] = useState('');
  const view = state.views[props.params.viewId];
  if (!view) return null;
  const Component = modules[view.module].component;
  function position(e: DragEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height;
    return x < .22 ? 'left' : x > .78 ? 'right' : y < .22 ? 'top' : y > .78 ? 'bottom' : 'center';
  }
  return <div className="panel-body" id={`panel-${view.id}`} data-view-id={view.id} onPointerDownCapture={() => host.focus(view.id)} onDragOver={e => {
    if (e.dataTransfer.types.some(t => t.startsWith('application/x-canvarz-'))) { e.preventDefault(); e.stopPropagation(); setDrop(position(e)); }
  }} onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrop(''); }} onDrop={e => {
    e.preventDefault(); e.stopPropagation(); const p = position(e); setDrop('');
    const id = e.dataTransfer.getData('application/x-canvarz-view');
    if (id) host.move(id, view.id, p);
    const contentId = e.dataTransfer.getData('application/x-canvarz-content');
    if (contentId) { const previous = Object.values(state.views).find(v => v.contentId === contentId); if (previous) { host.reopen(previous.id); host.move(previous.id, view.id, p); } }
  }}>
    <Component key={view.module} viewId={view.id} />
    <div className="pane-actions"><Menu align="end" trigger={<IconButton label={`Opciones de ${view.title}`}><MoreHorizontal size={16} /></IconButton>}>
      <MenuItem onSelect={() => host.minimize(view.id)}><Minus size={15} />Minimizar {view.title}</MenuItem>
      <MenuItem onSelect={() => host.panelAction(view.id, 'maximize')}><Maximize2 size={15} />Ampliar o restaurar panel</MenuItem>
      <MenuItem onSelect={() => host.fullscreen(view.id)}><Maximize2 size={15} />Pantalla completa</MenuItem>
      <MenuSeparator />
      <MenuItem onSelect={() => host.panelAction(view.id, 'right')}><Columns2 size={15} />Separar a la derecha</MenuItem>
      <MenuItem onSelect={() => host.panelAction(view.id, 'bottom')}><Split size={15} />Separar debajo</MenuItem>
      <MenuItem onSelect={() => host.panelAction(view.id, 'group')}><LayoutGrid size={15} />Agrupar con otro panel</MenuItem>
      {view.module !== 'start' && <MenuItem onSelect={() => host.open(view.module, view.contentId, 'right')}><Copy size={15} />Otra vista</MenuItem>}
      <MenuItem onSelect={() => host.panelAction(view.id, 'float')}><ArrowUpRight size={15} />Ventana flotante</MenuItem>
      <MenuSeparator />
      {Object.values(state.views).filter(v => v.status !== 'closed' && v.id !== view.id).map(v => <MenuItem key={v.id} onSelect={() => { host.reopen(v.id); host.move(v.id, view.id, 'center'); }}>{v.title}</MenuItem>)}
      <MenuSeparator /><MenuItem onSelect={() => host.close(view.id)}><X size={15} />Cerrar {view.title}</MenuItem>
    </Menu></div>
    {drop && <div className={`drop-preview drop-${drop}`} />}
  </div>;
}
const components = { module: ModulePanel };
function EmptyWorkspace() { const host = useHost(); return <div className="empty-workspace"><IconButton label="Nueva pestaña" onClick={() => host.open('start')}><Plus size={25} strokeWidth={1.3} /></IconButton></div>; }

function PreferencesPanel({ open, onClose }: { open: boolean; onClose(): void }) {
  const { store } = useHost(); const { state } = useWorkspace(); const p = state.preferences;
  return <Popover.Root open={open} onOpenChange={v => !v && onClose()}><Popover.Anchor asChild><span className="appearance-anchor" /></Popover.Anchor><Popover.Portal container={document.querySelector('.app')}><Popover.Content className="preferences-panel menu-surface" align="start" sideOffset={8} collisionPadding={12} aria-label="Apariencia">
    <div className="popover-heading"><span>Apariencia</span><Popover.Close asChild><IconButton label="Cerrar apariencia"><X size={14} /></IconButton></Popover.Close></div>
    <div className="segmented"><button aria-pressed={p.theme === 'dark'} onClick={() => store.setPreferences({ theme: 'dark' })}>Oscuro</button><button aria-pressed={p.theme === 'light'} onClick={() => store.setPreferences({ theme: 'light' })}>Claro</button></div>
    <label className="slider-label">Intensidad<span>{p.intensity}%</span><input type="range" aria-label="Intensidad del tema" min="0" max="100" value={p.intensity} onChange={e => store.setPreferences({ intensity: Number(e.target.value) })} /></label>
    <label className="slider-label">Tonalidad<span>{p.hue}°</span><input type="range" aria-label="Tonalidad del tema" min="0" max="360" value={p.hue} onChange={e => store.setPreferences({ hue: Number(e.target.value) })} /></label>
    <label className="select-label">Controles<select aria-label="Perfil de interacción" value={p.input} onChange={e => store.setPreferences({ input: e.target.value as typeof p.input })}><option value="auto">Automático</option><option value="mouse">Ratón y teclado</option><option value="touch">Táctil</option></select></label>
  </Popover.Content></Popover.Portal></Popover.Root>;
}

export function App({ store }: { store: WorkspaceStore }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot); const { state } = snapshot;
  const project = useSyncExternalStore(localProject.subscribe, localProject.getSnapshot, localProject.getSnapshot);
  const apiRef = useRef<DockviewApi | null>(null); const cleanup = useRef<(() => void) | null>(null);
  const [active, setActive] = useState(''); const [settings, setSettings] = useState(false); const [notice, setNotice] = useState<string | null>(null);
  const [compact, setCompact] = useState(window.innerWidth <= 900); const [drawer, setDrawer] = useState<'projects' | 'files' | null>(null);
  const [zen, setZen] = useState(false); const history = useRef({ items: [] as string[], index: -1 }); const navigating = useRef(false);
  const fullscreenCommand = useRef<(id?: string) => void>(() => {}); const restoreGroup = useRef(false);
  function unify(current: DockviewApi) { current.exitMaximizedGroup(); const g = current.groups.find(g => g.api.location.type === 'grid'); if (g) current.panels.filter(p => p.group.id !== g.id).forEach(p => p.api.moveTo({ group: g, position: 'center' })); }
  function saveLayout() { const current = apiRef.current; if (current) store.setLayout(current.toJSON(), current.panels.map(p => p.id), window.innerWidth <= 900 ? 'compact' : 'wide'); }
  function attach(view: ViewRecord, direction?: 'right' | 'below') {
    const current = apiRef.current; if (!current) return;
    current.exitMaximizedGroup(); const existing = current.getPanel(view.id);
    if (existing) { existing.api.setActive(); return; }
    current.addPanel({ id: view.id, component: 'module', title: view.title, params: { viewId: view.id }, minimumWidth: 160, minimumHeight: 120, position: direction && current.activePanel ? { referencePanel: current.activePanel.id, direction } : undefined });
    store.setViewStatus(view.id, 'open');
  }
  const host = useMemo<HostServices>(() => ({
    store,
    fullscreen(id) { fullscreenCommand.current(id); },
    open(module, contentId, direction) { attach(store.createView(module, contentId), direction); },
    choose(id, module) { const view = store.choose(id, module); apiRef.current?.getPanel(id)?.api.setTitle(view.title); saveLayout(); },
    reopen(id) { const v = store.getSnapshot().state.views[id]; if (v) attach(v); },
    focus(id) { const p = apiRef.current?.getPanel(id); if (p && apiRef.current?.activePanel?.id !== id) p.api.setActive(); },
    minimize(id) { const current = apiRef.current; const p = current?.getPanel(id); store.setViewStatus(id, 'minimized'); if (p && current) current.removePanel(p); },
    close(id) { const current = apiRef.current; const p = current?.getPanel(id); store.setViewStatus(id, 'closed'); if (p && current) current.removePanel(p); },
    move(id, target, position) { const current = apiRef.current; const p = current?.getPanel(id); const other = current?.getPanel(target); if (!p || !other || !current) return; if (p.id === other.id && (position === 'center' || p.group.panels.length === 1)) return; current.exitMaximizedGroup(); p.api.moveTo({ group: other.group, position }); p.api.setActive(); },
    panelAction(id, action) { const current = apiRef.current; const p = current?.getPanel(id); if (!p || !current) return;
      if (action === 'maximize') { p.group.api.isMaximized() ? p.group.api.exitMaximized() : p.group.api.maximize(); return; }
      current.exitMaximizedGroup();
      if (action === 'float') { current.addFloatingGroup(p, { width: 460, height: 360, position: { left: 40, top: 40 } }); return; }
      const other = current.groups.find(g => g.id !== p.group.id && g.api.location.type === 'grid');
      if (action === 'group' && !other) return;
      p.api.moveTo({ group: other ?? p.group, position: action === 'group' ? 'center' : action }); p.api.setActive();
    },
  }), []);
  function remember(id: string) {
    setActive(id); const h = history.current;
    if (!navigating.current && h.items[h.index] !== id) { h.items = h.items.slice(0, h.index + 1).concat(id); h.index = h.items.length - 1; }
  }
  function onReady(event: DockviewReadyEvent) {
    cleanup.current?.(); const current = event.api; apiRef.current = current;
    const groupSub = current.onDidAddGroup(g => { g.header.hidden = true; });
    const saved = store.getSnapshot().state; let restored = false;
    if (saved.layout) {
      try { const layout = saved.layout as SerializedDockview; if (!layout.panels || !layout.grid || Object.entries(layout.panels).some(([id, p]) => !saved.views[id] || p.contentComponent !== 'module' || p.params?.viewId !== id)) throw new Error('Distribución incompatible'); current.fromJSON(layout); restored = true; }
      catch { current.clear(); setNotice('No se pudo restaurar la distribución. Los documentos siguen disponibles.'); }
    }
    if (!restored) {
      const views = Object.values(saved.views);
      if (views.length) views.filter(v => v.status === 'open').forEach(v => attach(v));
      else { const canvas = store.createView('canvas'); attach(canvas); const chat = store.createView('chat'); attach(chat, 'right'); store.linkChat(chat.contentId, canvas.contentId); }
    }
    current.groups.forEach(g => { g.header.hidden = true; });
    if (window.innerWidth <= 900 && saved.layoutMode !== 'compact') unify(current);
    if (current.activePanel) remember(current.activePanel.id);
    const layoutSub = current.onDidLayoutChange(saveLayout);
    const focusSub = current.onDidActivePanelChange(({ panel }) => {
      remember(panel?.id ?? ''); const s = store.getSnapshot().state; const view = panel ? s.views[panel.id] : undefined;
      if (view?.module === 'canvas' && s.activeChatId && s.chatTargets[s.activeChatId] !== view.contentId) store.linkChat(s.activeChatId, view.contentId);
    });
    cleanup.current = () => { groupSub.dispose(); layoutSub.dispose(); focusSub.dispose(); }; saveLayout();
  }
  useEffect(() => () => cleanup.current?.(), []);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)');
    const adapt = () => { setCompact(query.matches); setDrawer(null); if (query.matches && apiRef.current) unify(apiRef.current); saveLayout(); };
    query.addEventListener('change', adapt); return () => query.removeEventListener('change', adapt);
  }, []);
  function navigate(delta: number) {
    const h = history.current; let index = h.index + delta;
    while (index >= 0 && index < h.items.length && (!h.items[index] || store.getSnapshot().state.views[h.items[index]]?.status === 'closed')) index += delta;
    if (index < 0 || index >= h.items.length) return;
    h.index = index; navigating.current = true; host.reopen(h.items[index]); navigating.current = false;
  }
  function exitFocus() {
    setZen(false); if (restoreGroup.current) apiRef.current?.exitMaximizedGroup(); restoreGroup.current = false;
    if (document.fullscreenElement) void document.exitFullscreen();
  }
  function toggleFullscreen(id?: string) {
    if (zen) { exitFocus(); return; }
    const panel = id ? apiRef.current?.getPanel(id) : undefined;
    if (panel) { restoreGroup.current = !panel.group.api.isMaximized(); panel.group.api.maximize(); }
    setSettings(false); setZen(true); void document.documentElement.requestFullscreen?.().catch(() => {});
  }
  fullscreenCommand.current = toggleFullscreen;
  useEffect(() => { const exit = (e: KeyboardEvent) => { if (e.key === 'Escape' && zen) exitFocus(); }; const change = () => { if (!document.fullscreenElement && zen) exitFocus(); }; window.addEventListener('keydown', exit); document.addEventListener('fullscreenchange', change); return () => { window.removeEventListener('keydown', exit); document.removeEventListener('fullscreenchange', change); }; }, [zen]);
  const p = state.preferences;
  const leftKind = p.swapped ? 'files' : 'projects'; const rightKind = p.swapped ? 'projects' : 'files';
  const visible = (kind: 'projects' | 'files') => compact ? drawer === kind : kind === 'projects' ? p.navigator : p.files ?? true;
  const toggle = (kind: 'projects' | 'files') => compact ? setDrawer(drawer === kind ? null : kind) : store.setPreferences(kind === 'projects' ? { navigator: !p.navigator } : { files: !(p.files ?? true) });
  const tabs = Object.values(state.views).filter(v => v.status !== 'closed');
  const saveLabel = snapshot.error ? 'Cambios sin guardar' : project.kind === 'saved' ? 'Proyecto guardado en disco' : project.kind === 'syncing' ? 'Guardando proyecto' : 'Sesión del navegador';
  const vars = { '--theme-hue': p.hue, '--theme-strength': p.intensity / 100 } as CSSProperties;
  return <HostContext.Provider value={host}><div className={`app ${zen ? 'zen' : ''}`} data-theme={p.theme} data-input={p.input} style={vars}>
    {!zen && <header className="app-header"><div className="header-basics">
      <IconButton label="Atrás" disabled={history.current.index <= 0} onClick={() => navigate(-1)}><ArrowLeft size={16} /></IconButton><IconButton label="Adelante" disabled={history.current.index >= history.current.items.length - 1} onClick={() => navigate(1)}><ArrowRight size={16} /></IconButton>
      <IconButton label="Mostrar u ocultar lateral izquierdo" aria-pressed={visible(leftKind)} onClick={() => toggle(leftKind)}><PanelLeft size={16} /></IconButton>
      <Menu trigger={<button className="text-menu" aria-label="Archivo">Archivo</button>}><MenuItem onSelect={() => host.open('start')}><Plus size={15} />Nueva pestaña</MenuItem><MenuSeparator />{Object.values(state.views).filter(v => v.module !== 'start' && v.status === 'closed').map(v => <MenuItem key={v.id} onSelect={() => host.reopen(v.id)}>Reabrir {v.title}</MenuItem>)}<MenuItem onSelect={() => toggle('files')}><FolderOpen size={15} />Archivos del proyecto</MenuItem></Menu>
      <Menu preventReturnFocus={settings} trigger={<button className="text-menu" aria-label="Ver">Ver</button>}><MenuItem onSelect={() => setSettings(true)}><Settings2 size={15} />Apariencia y controles</MenuItem><MenuItem onSelect={() => toggleFullscreen()}><Maximize2 size={15} />Pantalla completa</MenuItem><MenuItem onSelect={() => store.setPreferences({ bubble: !p.bubble })}><MessageCircle size={15} />{p.bubble ? 'Ocultar burbuja' : 'Mostrar burbuja de chat'}</MenuItem><MenuSeparator /><MenuItem onSelect={() => toggle('projects')}><PanelLeft size={15} />Proyectos</MenuItem><MenuItem onSelect={() => toggle('files')}><PanelRight size={15} />Archivos</MenuItem><MenuItem onSelect={() => store.setPreferences({ swapped: !p.swapped })}><ArrowLeftRight size={15} />Intercambiar laterales</MenuItem></Menu>
    </div>
    <div className="tab-ribbon"><div className="global-tabs" role="tablist" aria-label="Vistas abiertas">{tabs.map(view => <div key={view.id} className={`global-tab ${active === view.id ? 'active' : ''} ${view.status === 'minimized' ? 'minimized' : ''}`} draggable onDragStart={e => { e.dataTransfer.setData('application/x-canvarz-view', view.id); e.dataTransfer.effectAllowed = 'move'; }}>
      <button role="tab" tabIndex={active === view.id || !active ? 0 : -1} aria-controls={`panel-${view.id}`} aria-selected={active === view.id} aria-label={view.title} title={view.title} onClick={() => host.reopen(view.id)} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = tabs[(tabs.indexOf(view) + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; host.reopen(next.id); (e.currentTarget.closest('.global-tabs')?.querySelectorAll('[role=tab]')[tabs.indexOf(next)] as HTMLElement)?.focus(); } if (e.key === 'Delete') host.close(view.id); }}><span>{view.module === 'start' ? 'Nueva pestaña' : view.title}</span></button>
      <button className="tab-close" aria-label={`Cerrar ${view.title}`} title={`Cerrar ${view.title}`} onClick={() => host.close(view.id)}><X size={12} /></button>
    </div>)}<IconButton className="new-tab" label="Nueva pestaña" onClick={() => host.open('start')}><Plus size={18} strokeWidth={1.4} /></IconButton></div></div>
    <div className="header-end"><IconButton label="Mostrar u ocultar lateral derecho" aria-pressed={visible(rightKind)} onClick={() => toggle(rightKind)}><PanelRight size={16} /></IconButton></div></header>}
    {(snapshot.error || project.error || notice) && <div role="alert" className="error-banner">{snapshot.error ?? project.error ?? notice}{notice && !snapshot.error && !project.error && <IconButton label="Cerrar aviso" onClick={() => setNotice(null)}><X size={14} /></IconButton>}</div>}
    <main className="workspace-frame">{!zen && visible(leftKind) && <Sidebar key={`left-${leftKind}`} side="left" kind={leftKind} />}<div className="dock-host"><DockviewReact theme={theme} components={components} watermarkComponent={EmptyWorkspace} onReady={onReady} floatingGroupBounds="boundedWithinViewport" /></div>{!zen && visible(rightKind) && <Sidebar key={`right-${rightKind}`} side="right" kind={rightKind} />}</main>
    {!zen && <footer className="status-bar"><span className={snapshot.error || project.error ? 'save-error' : ''} role="status" title={saveLabel} aria-label={saveLabel}>{project.kind === 'saved' && !snapshot.error ? <Check size={10} /> : <Circle size={8} />}</span></footer>}
    <PreferencesPanel open={settings} onClose={() => setSettings(false)} />
    {p.bubble && <Bubble anchorId={active} />}
    {zen && <IconButton className="exit-fullscreen" label="Salir de pantalla completa" onClick={() => toggleFullscreen()}><Maximize2 size={15} /></IconButton>}
  </div></HostContext.Provider>;
}
