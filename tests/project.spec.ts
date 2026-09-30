import { test, expect } from '@playwright/test';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pilotRepository } from '../server/pilot';
import { newWorkspace } from '../src/core/contracts';

test('guardar y cerrar mantiene archivos; revisiones simultáneas no sobrescriben', async () => {
  const prefix = join(tmpdir(), 'canva-rz-test-'); const root = await mkdtemp(prefix);
  try {
    const repo = pilotRepository(root); const initial = await repo.load(); expect(initial.state).toBeNull();
    const state = newWorkspace(); state.contents['content-01'] = { id: 'content-01', module: 'document', title: 'Documento 1', text: 'Texto local exacto', revision: 1 };
    state.views['view-01'] = { id: 'view-01', module: 'document', contentId: 'content-01', title: 'Documento 1', status: 'open', filter: '' };
    await repo.save(state, 0); expect(await readFile(join(root, 'Actual/Documento-1--content-01.md'), 'utf8')).toBe('Texto local exacto');
    state.views['view-01'].status = 'closed'; await repo.save(state, 1); expect((await repo.load()).state?.views['view-01'].status).toBe('closed'); expect(await readdir(join(root, 'Actual'))).toHaveLength(2);
    const results = await Promise.allSettled([repo.save(state, 2), repo.save(state, 2)]); expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1); expect((await repo.load()).revision).toBe(3);
    expect(JSON.parse(await readFile(join(root, 'project.previous.json'), 'utf8')).revision).toBe(2);
  } finally { if (!resolve(root).startsWith(resolve(prefix))) throw new Error('Carpeta de prueba fuera del alcance'); await rm(root, { recursive: true, force: true }); }
});

test('dos ventanas conservan ediciones distintas y una vista antigua no revierte texto nuevo', async () => {
  const prefix = join(tmpdir(), 'canva-rz-test-'); const root = await mkdtemp(prefix);
  try {
    const repo = pilotRepository(root); const initial = newWorkspace();
    initial.contents['content-01'] = { id: 'content-01', module: 'document', title: 'Documento 1', text: '', revision: 0 };
    initial.views['view-01'] = { id: 'view-01', module: 'document', contentId: 'content-01', title: 'Documento 1', status: 'open', filter: '' };
    await repo.save(initial, 0);
    const editor = structuredClone(initial); editor.contents['content-01'].text = 'Texto recién editado'; editor.contents['content-01'].revision = 1;
    await repo.save(editor, 1, initial);
    const other = structuredClone(initial); other.preferences.files = false;
    await repo.save(other, 1, initial); expect((await repo.load()).state?.contents['content-01'].text).toBe('Texto recién editado');
    other.preferences.files = true; await repo.save(other, 3, initial); expect((await repo.load()).state?.contents['content-01'].text).toBe('Texto recién editado');
    const conflicting = structuredClone(initial); conflicting.contents['content-01'].text = 'Otra edición simultánea'; conflicting.contents['content-01'].revision = 1;
    await expect(repo.save(conflicting, 4, initial)).rejects.toThrow('CONFLICT'); expect((await repo.load()).state?.contents['content-01'].text).toBe('Texto recién editado');
  } finally { if (!resolve(root).startsWith(resolve(prefix))) throw new Error('Carpeta de prueba fuera del alcance'); await rm(root, { recursive: true, force: true }); }
});
