import { ArrowUp, CircleCheck, MessageCircle } from 'lucide-react';
import { useHost, useWorkspace } from '../../shell/host';
import type { ModuleProps } from '../registry';

export function ChatModule({ viewId }: ModuleProps) {
  const { store } = useHost(); const { state } = useWorkspace();
  const view = state.views[viewId]; const content = state.contents[view.contentId];
  const active = state.activeChatId === content.id;
  const target = state.contents[state.chatTargets[content.id]];
  return <section className="chat-module module" aria-label={view.title}>
    <div className="module-meta"><span>{target ? `Vinculado a ${target.title}` : 'Sin lienzo vinculado'}</span>
      <button className={`quiet-button ${active ? 'selected' : ''}`} aria-pressed={active} onClick={() => store.setActiveChat(content.id)}>{active ? <><CircleCheck size={13} /> Activo</> : 'Activar'}</button></div>
    <div className="chat-empty"><div className="round-mark"><MessageCircle size={23} strokeWidth={1.5} /></div><h2>Una indicación,<br />muchas posibilidades</h2><p>Este chat conserva tu borrador.<br />Aquí aparecerán los trabajos y sus variantes.</p></div>
    <div className="composer"><textarea aria-label={`Borrador de ${content.title}`} placeholder="Escribe una idea…" value={content.text} onChange={e => store.setText(content.id, e.target.value)} />
      <div className="composer-bottom"><span>Borrador · sin proveedor</span><button className="send-button" disabled aria-label="Enviar (proveedor pendiente)" title="Conectaremos la generación en su tramo"><ArrowUp size={17} /></button></div></div>
  </section>;
}
