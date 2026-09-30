import { useHost, useWorkspace } from '../../shell/host';
import type { ModuleProps } from '../registry';

export function DocumentModule({ viewId }: ModuleProps) {
  const { store, open } = useHost(); const { state } = useWorkspace();
  const view = state.views[viewId]; const content = state.contents[view.contentId];
  return <section className="document-module module" aria-label={view.title}>
    <div className="module-meta"><span>Borradores / {content.title}.md</span><button className="quiet-button" onClick={() => open('document', content.id, 'right')}>Otra vista</button></div>
    <textarea className="document-editor" aria-label={`Texto de ${content.title}`} value={content.text} onChange={e => store.setText(content.id, e.target.value)} spellCheck={false} />
    <div className="module-meta"><span>Texto Markdown · borrador del navegador</span><span>Revisión {content.revision}</span></div>
  </section>;
}
