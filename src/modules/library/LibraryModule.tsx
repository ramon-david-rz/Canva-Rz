import { FileText, MessageCircle, Search, SquareDashed } from 'lucide-react';
import { useHost, useWorkspace } from '../../shell/host';
import type { ModuleProps } from '../registry';

const icons = { canvas: SquareDashed, chat: MessageCircle, document: FileText, library: Search };
export function LibraryModule({ viewId }: ModuleProps) {
  const { store, open } = useHost(); const { state } = useWorkspace();
  const view = state.views[viewId];
  const items = Object.values(state.contents).filter(c => c.module !== 'library' && c.title.toLowerCase().includes(view.filter.toLowerCase()));
  return <section className="library-module module" aria-label={view.title}>
    <div className="module-meta"><span>Sesión / Borradores</span><span>{items.length} elementos</span></div>
    <label className="search-field"><Search size={16} /><input aria-label={`Buscar en ${view.title}`} placeholder="Buscar en esta vista…" value={view.filter} onChange={e => store.setFilter(viewId, e.target.value)} /></label>
    <div className="library-grid">{items.map(item => { const Icon = icons[item.module]; return <button className="resource-card" key={item.id} onClick={() => open(item.module, item.id)}><div className={`resource-cover cover-${item.module}`}><Icon size={29} strokeWidth={1.25} /></div><span>{item.title}</span><small>{item.module === 'canvas' ? 'Composición de prueba' : 'Borrador local'}</small></button>; })}</div>
    {items.length === 0 && <p className="empty-label">No hay borradores con ese nombre.</p>}
    <p className="library-note">Las carpetas y los medios reales se conectarán en el tramo de archivos.</p>
  </section>;
}
