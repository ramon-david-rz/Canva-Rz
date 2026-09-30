import { useHost, useWorkspace } from '../../shell/host';
import type { ModuleProps } from '../registry';
export function DocumentModule({ viewId }: ModuleProps) {
  const { store } = useHost(); const { state } = useWorkspace(); const view = state.views[viewId]; const content = state.contents[view.contentId];
  return <section className="document-module module" aria-label={view.title}><textarea className="document-editor" aria-label={`Texto de ${content.title}`} value={content.text} onChange={e => store.setText(content.id, e.target.value)} spellCheck={false} /></section>;
}
