import { isWorkspace, type SessionStoragePort } from '../core/contracts';

export const SESSION_KEY = 'canva-rz.workspace.v1';

export const browserSession: SessionStoragePort = {
  load() {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return { state: null, error: null };
      const state: unknown = JSON.parse(raw);
      if (!isWorkspace(state)) {
        localStorage.setItem(`${SESSION_KEY}.recovery.${Date.now()}`, raw);
        return { state: null, error: 'La sesión guardada no es compatible. Se abrió un espacio nuevo; el registro anterior se conservó para recuperación en el navegador.' };
      }
      return { state, error: null };
    } catch {
      if (raw) {
        try { localStorage.setItem(`${SESSION_KEY}.recovery.${Date.now()}`, raw); } catch { /* Storage may be unavailable. */ }
      }
      return { state: null, error: 'No se pudo recuperar la sesión del navegador. Se conserva el registro anterior cuando el almacenamiento está disponible.' };
    }
  },
  save(state) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(state));
      return null;
    } catch {
      return 'No se pudo guardar en este navegador. Mantén esta página abierta para conservar los borradores actuales.';
    }
  },
};
