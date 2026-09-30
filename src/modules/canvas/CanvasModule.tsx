import { Maximize, MessageCircle, SquareDashed } from 'lucide-react';
import { IconButton } from '../../design/Button';
import { useHost, useWorkspace } from '../../shell/host';
import type { ModuleProps } from '../registry';

export function CanvasModule({ viewId }: ModuleProps) {
  const { store, open } = useHost(); const { state } = useWorkspace();
  const view = state.views[viewId]; const content = state.contents[view.contentId];
  const chat = state.activeChatId;
  return <section className="canvas-module module" aria-label={view.title}>
    <div className="module-meta"><span>Composición / {content.title}</span><span>1600 × 900</span></div>
    <div className="canvas-stage">
      <div className="artboard">
        <div className="artboard-empty"><SquareDashed size={32} strokeWidth={1} /><h2>Un espacio para componer</h2><p>Primero acomodamos la mesa.<br />Las imágenes y las capas llegan en el siguiente tramo.</p></div>
      </div>
      <span className="stage-caption">Lienzo de prueba · 16:9</span>
    </div>
    <div className="canvas-footer"><span><Maximize size={14} /> Ajustado al panel</span>
      <div><button className="quiet-button" onClick={() => open('canvas', content.id, 'right')}>Otra vista</button>
        <IconButton label="Vincular con el chat activo" disabled={!chat} onClick={() => chat && store.linkChat(chat, content.id)}><MessageCircle size={16} /></IconButton></div>
    </div>
  </section>;
}
