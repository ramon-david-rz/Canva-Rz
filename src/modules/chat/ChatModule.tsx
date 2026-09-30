import { CircleCheck } from 'lucide-react';
import { IconButton } from '../../design/Button';
import { useHost, useWorkspace } from '../../shell/host';
import type { ModuleProps } from '../registry';
export function ChatModule({ viewId }: ModuleProps) {
  const { store } = useHost(); const { state } = useWorkspace();
  const view = state.views[viewId]; const content = state.contents[view.contentId]; const active = state.activeChatId === content.id;
  return <section className="chat-module module" aria-label={view.title}><div className="chat-space" /><div className="composer"><textarea aria-label={`Borrador de ${content.title}`} placeholder="Escribe" value={content.text} onChange={e => store.setText(content.id, e.target.value)} /><IconButton label={active ? 'Chat activo' : `Activar ${content.title}`} aria-pressed={active} className={active ? 'active-chat' : ''} onClick={() => store.setActiveChat(content.id)}><CircleCheck size={15} /></IconButton></div></section>;
}
