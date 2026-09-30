import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { DockviewReact, type DockviewApi, type DockviewReadyEvent, type IDockviewHeaderActionsProps, type IDockviewPanelHeaderProps, type IDockviewPanelProps, type SerializedDockview } from 'dockview-react';
import { ArrowDownToLine, ArrowUpRight, ChevronDown, ChevronRight, CircleCheck, Columns2, FolderOpen, LayoutGrid, Maximize2, MessageCircle, Minus, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Plus, RotateCcw, Settings2, Split, X } from 'lucide-react';
import { browserSession } from '../adapters/browser-session';
import { createWorkspaceStore } from '../core/workspace';
import type { ModuleId, ViewRecord } from '../core/contracts';
import { modules } from '../modules/registry';
import { IconButton } from '../design/Button';
import { HostContext, useHost, useWorkspace, type HostServices } from './host';

const store = createWorkspaceStore(browserSession);
const theme = { name: 'canva-rz', className: 'dockview-theme-rz', gap: 6 };

function ModulePanel(props: IDockviewPanelProps<{ viewId: string }>) {
  const { state } = useWorkspace();
  const view = state.views[props.params.viewId];
  if (!view) return <div className="empty-label">Vista no disponible</div>;
  const Component = modules[view.module].component;
  return <Component viewId={view.id} />;
}
const components = { module: ModulePanel };

function Tab(props: IDockviewPanelHeaderProps<{ viewId: string }>) {
  const host = useHost(); const { state } = useWorkspace();
  const view = state.views[props.params.viewId];
  if (!view) return null;
  const Icon = modules[view.module].icon;
  return <div className="rz-tab"><Icon size={14} /><span>{view.title}</span><button type="button" aria-label={`Cerrar ${view.title}`} title={`Cerrar ${view.title}`} onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); host.close(view.id); }}><X size={12} /></button></div>;
}

function GroupActions(props: IDockviewHeaderActionsProps) {
  const host = useHost(); const [menu, setMenu] = useState(false); const [maximized, setMaximized] = useState(props.api.isMaximized());
  useEffect(() => {
    const subscription = props.containerApi.onDidMaximizedGroupChange(() => setMaximized(props.api.isMaximized()));
    return () => subscription.dispose();
  }, [props.api, props.containerApi]);
  const panel = props.activePanel;
  function move(position: 'right' | 'bottom' | 'center') {
    if (!panel) return;
    props.containerApi.exitMaximizedGroup();
    const target = props.containerApi.groups.find(group => group.id !== props.group.id && group.api.location.type === 'grid');
    panel.api.moveTo({ group: target ?? props.group, position }); setMenu(false);
  }
  return <div className="group-actions" onPointerDown={e => e.stopPropagation()}>
    <IconButton label={`Minimizar ${panel?.title ?? 'vista'}`} disabled={!panel} onClick={() => panel && host.minimize(panel.id)}><Minus size={14} /></IconButton>
    <IconButton label={maximized ? 'Restaurar panel' : 'Ampliar panel'} onClick={() => maximized ? props.api.exitMaximized() : props.api.maximize()}><Maximize2 size={13} /></IconButton>
    <IconButton label={`Opciones de ${panel?.title ?? 'panel'}`} aria-expanded={menu} onClick={() => setMenu(!menu)}><MoreHorizontal size={15} /></IconButton>
    {menu && <><button className="menu-dismiss" aria-label="Cerrar opciones de panel" onClick={() => setMenu(false)} /><div className="popover panel-menu">
      <button onClick={() => move('right')}><Columns2 size={15} /> Separar a la derecha</button>
      <button onClick={() => move('bottom')}><Split size={15} /> Separar debajo</button>
      <button disabled={props.containerApi.groups.filter(g => g.api.location.type === 'grid').length < 2} onClick={() => move('center')}><LayoutGrid size={15} /> Agrupar con otro panel</button>
      <button disabled={props.location?.type === 'floating'} onClick={() => { if (panel) props.containerApi.addFloatingGroup(panel, { width: 460, height: 360, position: { left: 40, top: 40 } }); setMenu(false); }}><ArrowUpRight size={15} /> Ventana flotante</button>
    </div></>}
  </div>;
}

function EmptyWorkspace() {
  const host = useHost();
  return <div className="empty-workspace"><div className="round-mark"><LayoutGrid size={26} /></div><h2>Tu mesa, a tu manera</h2><p>Abre un módulo para empezar.<br />Los borradores siguen disponibles en el navegador.</p><button className="primary-button" onClick={() => host.open('canvas')}><Plus size={16} /> Abrir un lienzo</button></div>;
}

function Navigator({ onHide }: { onHide(): void }) {
  const host = useHost(); const { state } = useWorkspace(); const [expanded, setExpanded] = useState(true);
  const grouped = Object.values(modules).map(module => ({ ...module, views: Object.values(state.views).filter(v => v.module === module.id) }));
  return <aside className="navigator" aria-label="Navegador de la sesión"><div className="navigator-heading"><span>ESPACIO DE TRABAJO</span><IconButton label="Ocultar navegador" onClick={onHide}><PanelLeftClose size={15} /></IconButton></div>
    <button className="tree-root" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<FolderOpen size={15} /><span>{state.project.title}</span></button>
    {expanded && <div className="tree-children">{grouped.map(module => <div className="tree-section" key={module.id}><div className="tree-section-heading"><module.icon size={14} /><span>{module.title}</span><IconButton label={`Nuevo ${module.title.toLowerCase()}`} onClick={() => host.open(module.id)}><Plus size={13} /></IconButton></div>
      {module.views.map(view => <button className={`tree-item ${view.status !== 'open' ? 'muted' : ''}`} key={view.id} onClick={() => host.reopen(view.id)}><span>{view.title}</span><small>{view.status === 'minimized' ? 'Reducido' : view.status === 'closed' ? 'Cerrado' : ''}</small></button>)}
    </div>)}</div>}
    <div className="navigator-foot"><span className="small-dot" /> Sesión del navegador<small>Carpetas locales · próximo tramo</small></div>
  </aside>;
}

function PreferencesPanel({ onClose }: { onClose(): void }) {
  const { store } = useHost(); const { state } = useWorkspace(); const p = state.preferences;
  return <><button className="menu-dismiss" aria-label="Cerrar preferencias" onClick={onClose} /><section className="popover preferences-panel" aria-label="Apariencia"><div className="popover-heading"><h2>A tu gusto</h2><IconButton label="Cerrar apariencia" onClick={onClose}><X size={15} /></IconButton></div>
    <span className="field-caption">Tema</span><div className="segmented"><button aria-pressed={p.theme === 'dark'} onClick={() => store.setPreferences({ theme: 'dark' })}>Oscuro</button><button aria-pressed={p.theme === 'light'} onClick={() => store.setPreferences({ theme: 'light' })}>Claro</button></div>
    <label className="slider-label">Intensidad <span>{p.intensity}%</span><input type="range" aria-label="Intensidad del tema" min="0" max="100" value={p.intensity} onChange={e => store.setPreferences({ intensity: Number(e.target.value) })} /></label>
    <label className="slider-label">Tonalidad <span>{p.hue}°</span><input type="range" aria-label="Tonalidad del tema" min="0" max="360" value={p.hue} onChange={e => store.setPreferences({ hue: Number(e.target.value) })} /></label>
    <label className="select-label">Controles<select aria-label="Perfil de interacción" value={p.input} onChange={e => store.setPreferences({ input: e.target.value as typeof p.input })}><option value="auto">Automático</option><option value="mouse">Ratón y teclado</option><option value="touch">Táctil</option></select></label>
    <p>El tono y la intensidad se comparten entre todos los módulos.</p>
  </section></>;
}

function Bubble() {
  const host = useHost(); const { state } = useWorkspace(); const [expanded, setExpanded] = useState(false);
  const chat = state.activeChatId ? state.contents[state.activeChatId] : null;
  const target = chat ? state.contents[state.chatTargets[chat.id]] : null;
  return <div className={`bubble ${expanded ? 'expanded' : ''}`}>
    {expanded ? <><div className="bubble-heading"><span>{chat?.title ?? 'Sin chat activo'}{target ? ` / ${target.title}` : ''}</span><IconButton label="Reducir burbuja" onClick={() => setExpanded(false)}><Minus size={14} /></IconButton></div>
      {chat ? <textarea aria-label="Borrador de la burbuja" placeholder="Una indicación rápida…" value={chat.text} onChange={e => host.store.setText(chat.id, e.target.value)} /> : <button className="quiet-button" onClick={() => host.open('chat')}>Abrir un chat</button>}
      <div className="bubble-footer"><span>Sin proveedor</span><button className="quiet-button" onClick={() => { if (chat) host.open('chat', chat.id, 'right'); }}>Ver chat</button></div></>
      : <IconButton label="Expandir burbuja de chat" onClick={() => setExpanded(true)}><MessageCircle size={21} /></IconButton>}
  </div>;
}

export function App() {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot); const { state } = snapshot;
  const apiRef = useRef<DockviewApi | null>(null); const [api, setApi] = useState<DockviewApi | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const [settings, setSettings] = useState(false); const [viewMenu, setViewMenu] = useState(false); const [notice, setNotice] = useState(snapshot.error);
  const [compact, setCompact] = useState(window.innerWidth <= 900);
  const [mobileNavigator, setMobileNavigator] = useState(false);
  const navigatorVisible = compact ? mobileNavigator : state.preferences.navigator;
  function unify(current: DockviewApi) {
    current.exitMaximizedGroup();
    const group = current.groups.find(g => g.api.location.type === 'grid');
    if (!group) return;
    current.panels.filter(p => p.group.id !== group.id).forEach(p => p.api.moveTo({ group, position: 'center' }));
  }
  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)');
    function adapt() {
      setCompact(query.matches);
      if (query.matches && apiRef.current) unify(apiRef.current);
      if (apiRef.current) store.setLayout(apiRef.current.toJSON(), apiRef.current.panels.map(p => p.id), query.matches ? 'compact' : 'wide');
    }
    query.addEventListener('change', adapt);
    return () => query.removeEventListener('change', adapt);
  }, []);
  function attach(view: ViewRecord, direction?: 'right' | 'below') {
    const current = apiRef.current; if (!current) return;
    current.exitMaximizedGroup();
    const existing = current.getPanel(view.id);
    if (existing) { existing.api.setActive(); return; }
    current.addPanel({ id: view.id, component: 'module', title: view.title, params: { viewId: view.id }, minimumWidth: 200, minimumHeight: 160,
      position: direction ? { referencePanel: current.activePanel?.id, direction } : undefined });
    store.setViewStatus(view.id, 'open');
  }
  const host = useMemo<HostServices>(() => ({
    store,
    open(module, contentId, direction) { attach(store.createView(module, contentId), direction); },
    reopen(id) { const view = store.getSnapshot().state.views[id]; if (view) attach(view); },
    minimize(id) { const current = apiRef.current; const panel = current?.getPanel(id); if (panel && current) { store.setViewStatus(id, 'minimized'); current.removePanel(panel); } },
    close(id) { const current = apiRef.current; const panel = current?.getPanel(id); if (panel && current) { store.setViewStatus(id, 'closed'); current.removePanel(panel); } },
  }), []);

  function onReady(event: DockviewReadyEvent) {
    cleanup.current?.(); apiRef.current = event.api; setApi(event.api);
    const saved = store.getSnapshot().state;
    let restored = false;
    if (saved.layout) {
      try {
        const layout = saved.layout as SerializedDockview;
        if (!layout.panels || !layout.grid || Object.entries(layout.panels).some(([id, p]) => !saved.views[id] || p.contentComponent !== 'module' || p.params?.viewId !== id)) throw new Error('Distribución incompatible');
        event.api.fromJSON(layout); restored = true;
      } catch { event.api.clear(); setNotice('No se pudo restaurar la distribución. Tus borradores siguen disponibles en el navegador.'); }
    }
    if (!restored) {
      const views = Object.values(saved.views);
      if (views.length) views.filter(v => v.status === 'open').forEach(v => attach(v));
      else {
        const canvas = store.createView('canvas'); attach(canvas);
        const chat = store.createView('chat'); attach(chat, 'right');
        store.linkChat(chat.contentId, canvas.contentId);
      }
    }
    if (window.innerWidth <= 900 && saved.layoutMode !== 'compact') {
      unify(event.api);
      if (!restored) {
        const canvas = event.api.panels.find(p => store.getSnapshot().state.views[p.id]?.module === 'canvas');
        canvas?.api.setActive();
      }
    }
    const subscription = event.api.onDidLayoutChange(() => store.setLayout(event.api.toJSON(), event.api.panels.map(p => p.id), window.innerWidth <= 900 ? 'compact' : 'wide'));
    const focusSubscription = event.api.onDidActivePanelChange(({ panel }) => {
      const view = panel ? store.getSnapshot().state.views[panel.id] : null;
      const chat = store.getSnapshot().state.activeChatId;
      if (view?.module === 'canvas' && chat) store.linkChat(chat, view.contentId);
    });
    cleanup.current = () => { subscription.dispose(); focusSubscription.dispose(); };
    store.setLayout(event.api.toJSON(), event.api.panels.map(p => p.id), window.innerWidth <= 900 ? 'compact' : 'wide');
  }
  useEffect(() => () => cleanup.current?.(), []);
  function tidy() {
    if (!api) return; api.exitMaximizedGroup();
    const visible = api.panels.map(p => store.getSnapshot().state.views[p.id]).filter(Boolean);
    api.clear();
    visible.forEach((v, i) => attach(v, i === 1 ? 'right' : undefined));
  }
  const vars = { '--theme-hue': state.preferences.hue, '--theme-strength': state.preferences.intensity / 100 } as CSSProperties;
  const minimized = Object.values(state.views).filter(v => v.status === 'minimized');
  return <HostContext.Provider value={host}><div className="app" data-theme={state.preferences.theme} data-input={state.preferences.input} style={vars}>
    <header className="app-header"><div className="brand"><span className="brand-mark">rz</span><span>Canva <b>RZ</b></span><span className="header-divider" /><span className="project-title">{state.project.title}</span></div>
      <div className="header-actions"><span className="prototype-tag">Base 01</span><IconButton label="Mostrar u ocultar navegador" aria-pressed={navigatorVisible} onClick={() => compact ? setMobileNavigator(!mobileNavigator) : store.setPreferences({ navigator: !state.preferences.navigator })}>{navigatorVisible ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</IconButton><IconButton label="Apariencia y controles" aria-expanded={settings} onClick={() => { setSettings(!settings); setViewMenu(false); }}><Settings2 size={17} /></IconButton></div></header>
    <nav className="module-toolbar" aria-label="Abrir módulos"><div className="module-launchers">{Object.values(modules).map(module => <button key={module.id} className="launcher" onClick={() => host.open(module.id)} aria-label={`Abrir ${module.title}`}><module.icon size={16} /><span>{module.title}</span><Plus size={12} className="launcher-plus" /></button>)}</div>
      <div className="workspace-tools"><IconButton label="Ordenar paneles" onClick={tidy}><RotateCcw size={15} /></IconButton><button className="quiet-button" aria-expanded={viewMenu} onClick={() => { setViewMenu(!viewMenu); setSettings(false); }}><LayoutGrid size={15} /><span>Vistas</span><ChevronDown size={12} /></button></div></nav>
    {(snapshot.error || notice) && <div role="alert" className="error-banner">{snapshot.error ?? notice}<button className="quiet-button" onClick={() => setNotice(null)}>Cerrar aviso</button></div>}
    <main className="workspace-frame">{navigatorVisible && <Navigator onHide={() => compact ? setMobileNavigator(false) : store.setPreferences({ navigator: false })} />}<div className="dock-host"><DockviewReact theme={theme} components={components} defaultTabComponent={Tab} rightHeaderActionsComponent={GroupActions} watermarkComponent={EmptyWorkspace} onReady={onReady} floatingGroupBounds="boundedWithinViewport" messages={{ panelOpened: t => `Vista ${t} abierta`, panelClosed: t => `Vista ${t} cerrada`, closeTab: t => `Cerrar ${t}`, groupMaximized: t => `${t} ampliado`, groupRestored: t => `${t} restaurado`, groupFloated: t => `${t} en ventana flotante`, groupDocked: t => `${t} integrado en panel` }} /></div></main>
    <footer className="status-bar"><span className={snapshot.error ? 'save-error' : ''}><CircleCheck size={12} />{snapshot.error ? 'Cambios sin guardar' : snapshot.saved ? 'Sesión guardada en este navegador' : 'Sesión nueva'}</span><div className="minimized-views">{minimized.map(view => <button key={view.id} onClick={() => host.reopen(view.id)} aria-label={`Restaurar ${view.title}`}><ArrowDownToLine size={12} />{view.title}</button>)}</div><span className="status-hint">Arrastra una pestaña para dividir</span></footer>
    {settings && <PreferencesPanel onClose={() => setSettings(false)} />}
    {viewMenu && <><button className="menu-dismiss" aria-label="Cerrar lista de vistas" onClick={() => setViewMenu(false)} /><section className="popover views-menu" aria-label="Todas las vistas"><div className="popover-heading"><h2>Tus vistas</h2><IconButton label="Cerrar vistas" onClick={() => setViewMenu(false)}><X size={15} /></IconButton></div>{Object.values(state.views).map(view => { const Icon = modules[view.module].icon; return <button key={view.id} onClick={() => { host.reopen(view.id); setViewMenu(false); }}><Icon size={15} /><span>{view.title}</span><small>{view.status === 'closed' ? 'Reabrir' : view.status === 'minimized' ? 'Restaurar' : 'Abierta'}</small></button>; })}<div className="popover-divider" /><button onClick={() => store.setPreferences({ bubble: !state.preferences.bubble })}><MessageCircle size={15} />{state.preferences.bubble ? 'Ocultar burbuja' : 'Mostrar burbuja de chat'}</button></section></>}
    {state.preferences.bubble && <Bubble />}
  </div></HostContext.Provider>;
}
