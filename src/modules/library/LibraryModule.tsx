import { Search } from 'lucide-react';
import { useHost, useWorkspace } from '../../shell/host';
import { modules, type ModuleProps } from '../registry';
export function LibraryModule({ viewId }: ModuleProps) {
  const { store, open } = useHost(); const { state } = useWorkspace(); const view = state.views[viewId];
  const items = Object.values(state.contents).filter(c => c.module !== 'start' && c.module !== 'library' && c.title.toLowerCase().includes(view.filter.toLowerCase()));
  return <section className="library-module module" aria-label={view.title}><label className="search-field"><Search size={15} /><input aria-label={`Buscar en ${view.title}`} placeholder="Buscar" value={view.filter} onChange={e => store.setFilter(viewId, e.target.value)} /></label><div className="library-grid">{items.map(item => { const Icon = modules[item.module].icon; return <button className="resource-card" key={item.id} onClick={() => open(item.module, item.id)}><div className="resource-cover"><Icon size={26} strokeWidth={1.25} /></div><span>{item.title}</span></button>; })}</div></section>;
}
