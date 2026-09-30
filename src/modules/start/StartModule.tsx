import { useHost, useWorkspace } from '../../shell/host';
import { modules, type ModuleProps } from '../registry';

export function StartModule({ viewId }: ModuleProps) {
  const host = useHost(); const { state } = useWorkspace();
  const closed = Object.values(state.views).filter(v => v.module !== 'start' && v.status === 'closed');
  return <section className="start-module module" aria-label="Nueva pestaña"><div className="start-options">
    <div className="start-grid">{Object.values(modules).filter(m => m.id !== 'start').map(m => <button key={m.id} aria-label={`Abrir ${m.title}`} onClick={() => host.choose(viewId, m.id as Exclude<typeof m.id, 'start'>)}><m.icon size={24} strokeWidth={1.3} /><span>{m.title}</span></button>)}</div>
    {closed.length > 0 && <div className="reopen-list">{closed.map(v => { const Icon = modules[v.module].icon; return <button key={v.id} aria-label={`Reabrir ${v.title}`} onClick={() => { host.reopen(v.id); host.close(viewId); }}><Icon size={15} /><span>{v.title}</span></button>; })}</div>}
  </div></section>;
}
