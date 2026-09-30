import { moduleTitles, newWorkspace, type ModuleId, type SessionStoragePort, type ViewStatus, type WorkspaceState } from './contracts';

export function createWorkspaceStore(storage: SessionStoragePort) {
  const loaded = storage.load();
  let snapshot = { state: loaded.state ?? newWorkspace(), error: loaded.error, saved: !!loaded.state };
  const listeners = new Set<() => void>();
  // Do not overwrite a failed recovery until the user makes an explicit change.
  function commit(state: WorkspaceState) {
    const error = storage.save(state);
    snapshot = { state, error, saved: error === null };
    listeners.forEach(listener => listener());
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    createView(module: ModuleId, contentId?: string) {
      const state = snapshot.state;
      const id = crypto.randomUUID();
      const existing = contentId ? state.contents[contentId] : undefined;
      if (contentId && (!existing || existing.module !== module)) throw new Error('Contenido incompatible');
      const n = Object.values(state.contents).filter(c => c.module === module).length + 1;
      const content = existing ?? {
        id: crypto.randomUUID(), module, title: `${moduleTitles[module]} ${n}`, revision: 0,
        text: module === 'document' ? '# Una idea empieza aquí\n\nEste es un borrador de prueba. Puedes escribir, cerrar la pestaña y recuperarlo desde el navegador.\n' : '',
      };
      const view = { id, module, contentId: content.id, title: content.title, status: 'open' as const, filter: '' };
      commit({ ...state, contents: { ...state.contents, [content.id]: content }, views: { ...state.views, [id]: view },
        activeChatId: state.activeChatId ?? (module === 'chat' ? content.id : null) });
      return view;
    },
    setViewStatus(id: string, status: ViewStatus) {
      const state = snapshot.state; const v = state.views[id];
      if (v) commit({ ...state, views: { ...state.views, [id]: { ...v, status } } });
    },
    setFilter(id: string, filter: string) {
      const state = snapshot.state; const v = state.views[id];
      if (v) commit({ ...state, views: { ...state.views, [id]: { ...v, filter } } });
    },
    setText(id: string, text: string) {
      const state = snapshot.state; const c = state.contents[id];
      if (c && c.text !== text) commit({ ...state, contents: { ...state.contents, [id]: { ...c, text, revision: c.revision + 1 } } });
    },
    setActiveChat(id: string) {
      const state = snapshot.state;
      if (state.contents[id]?.module === 'chat') commit({ ...state, activeChatId: id });
    },
    linkChat(chat: string, canvas: string) {
      const state = snapshot.state;
      if (state.contents[chat]?.module === 'chat' && state.contents[canvas]?.module === 'canvas')
        commit({ ...state, chatTargets: { ...state.chatTargets, [chat]: canvas } });
    },
    setPreferences(preferences: Partial<WorkspaceState['preferences']>) {
      commit({ ...snapshot.state, preferences: { ...snapshot.state.preferences, ...preferences } });
    },
    setLayout(layout: unknown, visibleIds: string[], layoutMode: 'compact' | 'wide' = 'wide') {
      const state = snapshot.state;
      const views = Object.fromEntries(Object.entries(state.views).map(([id, view]) => [id,
        visibleIds.includes(id) ? { ...view, status: 'open' as const }
          : view.status === 'open' ? { ...view, status: 'closed' as const } : view]));
      commit({ ...state, layout, layoutMode, views });
    },
  };
}

export type WorkspaceStore = ReturnType<typeof createWorkspaceStore>;
