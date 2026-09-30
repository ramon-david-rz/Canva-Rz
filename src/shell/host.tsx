import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ModuleId } from '../core/contracts';
import type { WorkspaceStore } from '../core/workspace';

export interface HostServices {
  store: WorkspaceStore;
  open(module: ModuleId, contentId?: string, direction?: 'right' | 'below'): void;
  reopen(id: string): void;
  minimize(id: string): void;
  close(id: string): void;
  choose(id: string, module: Exclude<ModuleId, 'start'>): void;
  focus(id: string): void;
  move(id: string, target: string, position: 'left' | 'right' | 'top' | 'bottom' | 'center'): void;
  panelAction(id: string, action: 'maximize' | 'float' | 'group' | 'right' | 'bottom'): void;
  fullscreen(id?: string): void;
}

export const HostContext = createContext<HostServices | null>(null);
export function useHost() {
  const value = useContext(HostContext);
  if (!value) throw new Error('El módulo necesita un anfitrión');
  return value;
}
export function useWorkspace() {
  const { store } = useHost();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
