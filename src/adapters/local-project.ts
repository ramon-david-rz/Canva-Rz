import { browserSession } from './browser-session';
import { isWorkspace, type SessionStoragePort, type WorkspaceState } from '../core/contracts';

type Status = { kind: 'offline' | 'syncing' | 'saved' | 'error'; root: string; error: string | null };
let status: Status = { kind: 'offline', root: '', error: null };
const listeners = new Set<() => void>();
function publish(next: Status) { status = next; listeners.forEach(fn => fn()); }
export const localProject = { getSnapshot: () => status, subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; } };

export async function preparePilot(): Promise<SessionStoragePort> {
  let initial: WorkspaceState | null = null; let baseline: WorkspaceState | null = null; let revision = 0; let online = false; let blocked = false;
  try {
    const response = await fetch('/api/pilot', { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error('No se pudo abrir el piloto local.');
    const data = await response.json(); if (data.state !== null && !isWorkspace(data.state)) throw new Error('El piloto guardado no es compatible.');
    initial = data.state; baseline = data.state; revision = data.revision; online = true; publish({ kind: initial ? 'saved' : 'syncing', root: data.root, error: null });
  } catch (error) { publish({ kind: 'offline', root: '', error: (error as Error).message }); }
  let timer: ReturnType<typeof setTimeout>; let pending: WorkspaceState | null = null; let writing = false;
  async function flush() {
    if (!online || blocked || writing || !pending) return;
    writing = true; const state = pending; pending = null;
    try {
      const response = await fetch('/api/pilot', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state, revision, baseline }) });
      const result = await response.json(); if (!response.ok) { if (response.status === 409) blocked = true; throw new Error(result.error ?? 'No se pudo guardar el proyecto local.'); }
      revision = result.revision; baseline = state;
      if (!pending) { try { sessionStorage.removeItem('canva-rz.pilot.pending'); sessionStorage.removeItem('canva-rz.pilot.draft'); sessionStorage.removeItem('canva-rz.pilot.conflict'); localStorage.removeItem('canva-rz.pilot.pending'); } catch { /* The browser fallback reports its own storage error. */ } }
      publish({ kind: pending ? 'syncing' : 'saved', root: result.root, error: null });
    } catch (error) { pending ??= state; if (blocked) { try { sessionStorage.setItem('canva-rz.pilot.conflict', '1'); } catch { /* Preserve the in-memory draft. */ } } publish({ kind: 'error', root: status.root, error: (error as Error).message }); }
    finally { writing = false; }
    if (pending && !blocked && status.kind !== 'error') void flush();
  }
  // Browser recovery remains immediate. Disk writes are serialized and acknowledged separately.
  return { load() {
    const cached = browserSession.load();
    try {
      const rawDraft = sessionStorage.getItem('canva-rz.pilot.draft');
      const draft = rawDraft ? JSON.parse(rawDraft) : null;
      if (isWorkspace(draft)) {
        if (sessionStorage.getItem('canva-rz.pilot.pending') && !sessionStorage.getItem('canva-rz.pilot.conflict')) return { state: draft, error: cached.error };
        localStorage.setItem(`canva-rz.workspace.v1.recovery.${Date.now()}`, rawDraft!);
      }
      // Migrate an unacknowledged draft from the previous pilot adapter once.
      if (cached.state && localStorage.getItem('canva-rz.pilot.pending') && !sessionStorage.getItem('canva-rz.pilot.conflict')) return cached;
    } catch { return cached; }
    if (cached.state && initial && JSON.stringify(cached.state) !== JSON.stringify(initial)) {
      // Preserve the browser draft before preferring the durable project from another run.
      try { localStorage.setItem(`canva-rz.workspace.v1.recovery.${Date.now()}`, JSON.stringify(cached.state)); } catch { return cached; }
    }
    return initial ? { state: initial, error: cached.error } : cached;
  }, save(state) {
    const error = browserSession.save(state);
    try { sessionStorage.setItem('canva-rz.pilot.draft', JSON.stringify(state)); sessionStorage.setItem('canva-rz.pilot.pending', '1'); } catch { /* Session saving reports the error. */ }
    if (online && !blocked) { pending = state; publish({ ...status, kind: 'syncing', error: null }); clearTimeout(timer); timer = setTimeout(() => void flush(), 150); }
    return error;
  } };
}
