import { useWorkspace } from '../../shell/host';
import type { ModuleProps } from '../registry';
export function CanvasModule({ viewId }: ModuleProps) {
  const { state } = useWorkspace(); const view = state.views[viewId];
  return <section className="canvas-module module" aria-label={view.title}><div className="canvas-stage"><div className="artboard" aria-label="Lienzo vacío de 1600 por 900" /></div></section>;
}
