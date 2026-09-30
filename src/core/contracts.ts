export type ModuleId = 'canvas' | 'chat' | 'library' | 'document';
export type ViewStatus = 'open' | 'minimized' | 'closed';

export interface ContentRecord {
  id: string;
  module: ModuleId;
  title: string;
  text: string;
  revision: number;
}

export interface ViewRecord {
  id: string;
  module: ModuleId;
  contentId: string;
  title: string;
  status: ViewStatus;
  filter: string;
}

export interface Preferences {
  theme: 'dark' | 'light';
  intensity: number;
  hue: number;
  input: 'auto' | 'mouse' | 'touch';
  navigator: boolean;
  bubble: boolean;
}

export interface WorkspaceState {
  schema: 1;
  project: { id: string; title: string };
  contents: Record<string, ContentRecord>;
  views: Record<string, ViewRecord>;
  activeChatId: string | null;
  chatTargets: Record<string, string>;
  preferences: Preferences;
  // Layout belongs to the host adapter. Modules never read this representation.
  layout: unknown;
  layoutMode?: 'compact' | 'wide';
}

export interface SessionStoragePort {
  load(): { state: WorkspaceState | null; error: string | null };
  save(state: WorkspaceState): string | null;
}

export const moduleTitles: Record<ModuleId, string> = {
  canvas: 'Lienzo', chat: 'Chat', library: 'Medios', document: 'Documento',
};

export function newWorkspace(): WorkspaceState {
  return {
    schema: 1,
    project: { id: 'workspace-demo', title: 'Mi espacio de trabajo' },
    contents: {}, views: {}, activeChatId: null, chatTargets: {}, layout: null,
    preferences: { theme: 'dark', intensity: 55, hue: 215, input: 'auto', navigator: true, bubble: false },
  };
}

export function isWorkspace(value: unknown): value is WorkspaceState {
  if (!value || typeof value !== 'object') return false;
  const s = value as WorkspaceState;
  const validModule = (m: unknown) => ['canvas', 'chat', 'library', 'document'].includes(String(m));
  const dict = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  if (s.schema !== 1 || typeof s.project?.title !== 'string' || typeof s.project?.id !== 'string'
    || !dict(s.contents) || !dict(s.views) || !dict(s.chatTargets) || !dict(s.preferences)) return false;
  const p = s.preferences;
  if (!['dark', 'light'].includes(p.theme) || !['auto', 'mouse', 'touch'].includes(p.input)
    || !Number.isFinite(p.intensity) || p.intensity < 0 || p.intensity > 100
    || !Number.isFinite(p.hue) || p.hue < 0 || p.hue > 360
    || typeof p.navigator !== 'boolean' || typeof p.bubble !== 'boolean') return false;
  for (const [id, c] of Object.entries(s.contents)) {
    if (!c || c.id !== id || !validModule(c.module) || typeof c.title !== 'string'
      || typeof c.text !== 'string' || !Number.isInteger(c.revision) || c.revision < 0) return false;
  }
  for (const [id, v] of Object.entries(s.views)) {
    if (!v || v.id !== id || !validModule(v.module) || typeof v.title !== 'string'
      || typeof v.filter !== 'string' || !['open', 'minimized', 'closed'].includes(v.status)
      || !s.contents[v.contentId] || s.contents[v.contentId].module !== v.module) return false;
  }
  if (s.activeChatId !== null && s.contents[s.activeChatId]?.module !== 'chat') return false;
  return Object.entries(s.chatTargets).every(([chat, canvas]) =>
    s.contents[chat]?.module === 'chat' && s.contents[canvas]?.module === 'canvas');
}
