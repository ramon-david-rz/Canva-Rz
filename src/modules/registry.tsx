import type { ComponentType } from 'react';
import { FileText, Images, MessageCircle, SquareDashed, Plus, type LucideIcon } from 'lucide-react';
import type { ModuleId } from '../core/contracts';
import { CanvasModule } from './canvas/CanvasModule';
import { ChatModule } from './chat/ChatModule';
import { LibraryModule } from './library/LibraryModule';
import { DocumentModule } from './document/DocumentModule';
import { StartModule } from './start/StartModule';

export interface ModuleProps { viewId: string }
interface ModuleDefinition { id: ModuleId; title: string; icon: LucideIcon; component: ComponentType<ModuleProps>; version: 1 }

export const modules: Record<ModuleId, ModuleDefinition> = {
  start: { id: 'start', title: 'Nueva pestaña', icon: Plus, component: StartModule, version: 1 },
  canvas: { id: 'canvas', title: 'Lienzo', icon: SquareDashed, component: CanvasModule, version: 1 },
  chat: { id: 'chat', title: 'Chat', icon: MessageCircle, component: ChatModule, version: 1 },
  library: { id: 'library', title: 'Medios', icon: Images, component: LibraryModule, version: 1 },
  document: { id: 'document', title: 'Documento', icon: FileText, component: DocumentModule, version: 1 },
};
