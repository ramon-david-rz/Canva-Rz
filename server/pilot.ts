import { mkdir, readFile, writeFile, rename, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { isWorkspace, type WorkspaceState } from '../src/core/contracts.ts';

export function pilotRepository(root: string) {
  const manifest = join(root, 'project.json'); let queue = Promise.resolve();
  async function load() {
    await mkdir(join(root, 'Actual'), { recursive: true }); await mkdir(join(root, 'Medios'), { recursive: true });
    try { const data = JSON.parse(await readFile(manifest, 'utf8')); if (data.format !== 1 || !Number.isSafeInteger(data.revision) || !isWorkspace(data.state)) throw new Error('Proyecto incompatible'); return { state: data.state as WorkspaceState, revision: data.revision as number, root }; }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { state: null, revision: 0, root }; throw error; }
  }
  async function atomic(path: string, data: string) { const pending = `${path}.pending`; await writeFile(pending, data, 'utf8'); await rename(pending, path); }
  function save(state: WorkspaceState, expected: number, baseline?: WorkspaceState | null) {
    const operation = queue.then(async () => {
      if (!isWorkspace(state)) throw new Error('Proyecto incompatible');
      const before = await load();
      if (before.revision !== expected && !baseline) throw new Error('CONFLICT');
      if (baseline && before.state) {
        const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
        const contents = { ...before.state.contents }; const views = { ...before.state.views };
        for (const [id, content] of Object.entries(state.contents)) {
          const changedHere = !equal(content, baseline.contents[id]); const latest = contents[id];
          if (changedHere && latest && !equal(latest, baseline.contents[id]) && !equal(latest, content)) throw new Error('CONFLICT');
          if (changedHere || !latest) contents[id] = content;
        }
        for (const [id, view] of Object.entries(state.views)) if (!equal(view, baseline.views[id]) || !views[id]) views[id] = view;
        state = { ...state, contents, views };
        if (!isWorkspace(state)) throw new Error('CONFLICT');
      }
      // Keep the last manifest recoverable; closing a view never removes its content files.
      if (before.state) await copyFile(manifest, join(root, 'project.previous.json'));
      for (const content of Object.values(state.contents).filter(c => c.module !== 'start')) {
        if (!/^[a-zA-Z0-9-]{1,80}$/.test(content.id)) throw new Error('Identidad incompatible');
        const filename = `${content.title.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80)}--${content.id}`;
        await atomic(join(root, 'Actual', `${filename}.json`), JSON.stringify(content, null, 2));
        if (content.module === 'document' || content.module === 'chat') await atomic(join(root, 'Actual', `${filename}.md`), content.text);
      }
      const revision = before.revision + 1;
      await atomic(manifest, JSON.stringify({ format: 1, revision, state }, null, 2));
      return { revision, root };
    });
    queue = operation.then(() => {}, () => {}); return operation;
  }
  return { load, save };
}
export function pilotPlugin(root: string): Plugin {
  const repository = pilotRepository(root);
  const middleware = async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    if (request.url?.split('?')[0] !== '/api/pilot') { next(); return; }
    response.setHeader('Content-Type', 'application/json; charset=utf-8'); response.setHeader('Cache-Control', 'no-store');
    const send = (status: number, data: unknown) => { response.statusCode = status; response.end(JSON.stringify(data)); };
    try {
      if (request.method === 'GET') { send(200, await repository.load()); return; }
      if (request.method !== 'PUT') { send(405, { error: 'Método incompatible' }); return; }
      if (request.headers.origin && request.headers.origin !== `http://${request.headers.host}`) { send(403, { error: 'Origen incompatible' }); return; }
      if (!request.headers['content-type']?.startsWith('application/json')) { send(415, { error: 'Formato incompatible' }); return; }
      let body = ''; for await (const chunk of request) { body += chunk; if (Buffer.byteLength(body) > 8 * 1024 * 1024) { send(413, { error: 'Proyecto demasiado grande para el piloto' }); return; } }
      const data = JSON.parse(body); if (!isWorkspace(data.state) || !Number.isSafeInteger(data.revision)) { send(400, { error: 'Proyecto incompatible' }); return; }
      if (data.baseline !== undefined && data.baseline !== null && !isWorkspace(data.baseline)) { send(400, { error: 'Base incompatible' }); return; }
      send(200, await repository.save(data.state, data.revision, data.baseline));
    } catch (error) { send((error as Error).message === 'CONFLICT' ? 409 : 500, { error: (error as Error).message === 'CONFLICT' ? 'El proyecto cambió en otra ventana. Recarga antes de guardar.' : 'No se pudo leer o guardar el proyecto local. Se conserva la sesión del navegador.' }); }
  };
  return { name: 'canva-rz-pilot', configureServer(server) { server.middlewares.use(middleware); }, configurePreviewServer(server) { server.middlewares.use(middleware); } };
}
