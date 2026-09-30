import { test, expect, type Page } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  let revision = 0;
  await page.route('**/api/pilot', async route => {
    if (route.request().method() === 'GET') await route.fulfill({ json: { state: null, revision, root: 'Proyecto aislado de pruebas' } });
    else await route.fulfill({ json: { revision: ++revision, root: 'Proyecto aislado de pruebas' } });
  });
});
const newModule = async (page: Page, name: string) => { await page.getByRole('button', { name: 'Nueva pestaña', exact: true }).first().click(); await page.getByRole('button', { name: `Abrir ${name}`, exact: true }).click(); };
const panelMenu = async (page: Page, name: string, action: string) => { await page.getByRole('button', { name: `Opciones de ${name}`, exact: true }).last().click(); await page.getByRole('menuitem', { name: action, exact: true }).click(); };

test('cerrar, minimizar, reabrir desde + y recargar conservan contenido', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const draft = page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true });
  await draft.fill('Conservar la escena sin perder el montaje');
  await panelMenu(page, 'Chat 1', 'Minimizar Chat 1');
  await expect(draft).toHaveCount(0); await page.reload();
  await page.getByRole('tab', { name: 'Chat 1', exact: true }).click();
  await expect(draft).toHaveValue('Conservar la escena sin perder el montaje');
  await page.locator('.global-tabs').getByRole('button', { name: 'Cerrar Chat 1', exact: true }).click();
  await page.reload(); await page.getByRole('button', { name: 'Nueva pestaña', exact: true }).first().click();
  await page.getByRole('button', { name: 'Reabrir Chat 1', exact: true }).click();
  await expect(draft).toHaveValue('Conservar la escena sin perder el montaje'); expect(errors).toEqual([]);
});

test('vistas compartidas y búsquedas independientes sobreviven la recarga', async ({ page }) => {
  await page.goto('/'); await newModule(page, 'Documento');
  await page.getByRole('textbox', { name: 'Texto de Documento 1', exact: true }).fill('Prompt exacto de la toma 01');
  await panelMenu(page, 'Documento 1', 'Otra vista');
  const editors = page.getByRole('textbox', { name: 'Texto de Documento 1', exact: true }); await expect(editors).toHaveCount(2);
  await editors.nth(1).fill('La misma toma, revisión compartida'); await expect(editors.nth(0)).toHaveValue('La misma toma, revisión compartida');
  await newModule(page, 'Medios'); await page.getByRole('textbox', { name: 'Buscar en Medios 1' }).fill('Lienzo');
  await newModule(page, 'Medios'); await page.getByRole('textbox', { name: 'Buscar en Medios 2' }).fill('Documento');
  await page.reload(); await page.getByRole('tab', { name: 'Medios 1', exact: true }).click(); await expect(page.getByRole('textbox', { name: 'Buscar en Medios 1' })).toHaveValue('Lienzo');
  await page.getByRole('tab', { name: 'Medios 2', exact: true }).click(); await expect(page.getByRole('textbox', { name: 'Buscar en Medios 2' })).toHaveValue('Documento');
});

test('dividir, agrupar y flotar mantienen una única cinta de pestañas', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('.dv-groupview')).toHaveCount(2);
  await panelMenu(page, 'Chat 1', 'Agrupar con otro panel'); await expect(page.locator('.dv-groupview')).toHaveCount(1);
  await panelMenu(page, 'Chat 1', 'Separar debajo'); await expect(page.locator('.dv-groupview')).toHaveCount(2);
  await expect(page.getByRole('tablist', { name: 'Vistas abiertas' })).toHaveCount(1);
  await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Sigue siendo el mismo chat');
  await panelMenu(page, 'Chat 1', 'Ampliar o restaurar panel'); await panelMenu(page, 'Chat 1', 'Ampliar o restaurar panel');
  await panelMenu(page, 'Chat 1', 'Ventana flotante'); await expect(page.getByRole('dialog', { name: 'Chat 1', exact: true })).toBeVisible();
  await page.reload(); await expect(page.getByRole('dialog', { name: 'Chat 1', exact: true })).toBeVisible(); await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Sigue siendo el mismo chat');
});

test('burbuja movible y panel comparten el chat activo sin duplicarlo', async ({ page }) => {
  await page.goto('/'); await newModule(page, 'Chat'); await page.getByRole('textbox', { name: 'Borrador de Chat 2', exact: true }).fill('Segundo trabajo');
  await page.getByRole('button', { name: 'Activar Chat 2', exact: true }).click(); await page.getByRole('button', { name: 'Ver', exact: true }).click(); await page.getByRole('menuitem', { name: 'Mostrar burbuja de chat', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Borrador de la burbuja' })).toHaveValue('Segundo trabajo'); await page.getByRole('textbox', { name: 'Borrador de la burbuja' }).fill('Segundo trabajo revisado');
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 2', exact: true })).toHaveValue('Segundo trabajo revisado');
  const grip = await page.getByRole('button', { name: 'Mover burbuja' }).boundingBox();
  await page.mouse.move(grip!.x + 10, grip!.y + 10); await page.mouse.down(); await page.mouse.move(grip!.x + 110, grip!.y - 90, { steps: 12 }); await page.mouse.up();
  const moved = await page.locator('.bubble').boundingBox(); await page.reload(); const restored = await page.locator('.bubble').boundingBox(); expect(Math.abs(moved!.x - restored!.x)).toBeLessThan(2); expect(Math.abs(moved!.y - restored!.y)).toBeLessThan(2);
  await page.getByRole('button', { name: 'Abrir chat en panel', exact: true }).click(); await expect(page.getByRole('tab', { name: 'Chat 2', exact: true })).toHaveCount(1);
});

test('laterales se intercambian, ocultan por arrastre y conservan tamaño', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Ver', exact: true }).click(); await page.getByRole('menuitem', { name: 'Intercambiar laterales', exact: true }).click();
  await expect(page.locator('.sidebar-left')).toHaveAttribute('aria-label', 'Archivos del proyecto');
  const sash = page.getByRole('separator', { name: 'Ancho del lateral izquierdo' }); const box = await sash.boundingBox();
  await page.mouse.move(box!.x + 3, box!.y + 50); await page.mouse.down(); await page.mouse.move(box!.x + 83, box!.y + 50, { steps: 12 }); await page.mouse.up();
  await page.reload(); await expect(page.locator('.sidebar-left')).toHaveCSS('width', '290px');
  const next = await sash.boundingBox(); await page.mouse.move(next!.x + 3, next!.y + 50); await page.mouse.down(); await page.mouse.move(20, next!.y + 50, { steps: 16 }); await page.mouse.up();
  await expect(page.locator('.sidebar-left')).toHaveCount(0); await page.getByRole('button', { name: 'Mostrar u ocultar lateral izquierdo' }).click(); await expect(page.locator('.sidebar-left')).toBeVisible();
});

test('apariencia persiste y los controles táctiles conservan área útil', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Ver', exact: true }).click(); await page.getByRole('menuitem', { name: 'Apariencia y controles', exact: true }).click();
  await page.getByRole('button', { name: 'Claro', exact: true }).click(); await page.getByRole('slider', { name: 'Intensidad del tema' }).fill('80'); await page.getByRole('slider', { name: 'Tonalidad del tema' }).fill('35'); await page.getByRole('combobox', { name: 'Perfil de interacción' }).selectOption('touch'); await page.reload();
  await expect(page.locator('.app')).toHaveAttribute('data-theme', 'light'); await expect(page.locator('.app')).toHaveCSS('--theme-hue', '35'); const target = await page.getByRole('button', { name: 'Nueva pestaña', exact: true }).first().boundingBox(); expect(target!.height).toBeGreaterThanOrEqual(44);
  await page.setViewportSize({ width: 390, height: 844 }); await page.reload(); await expect(page.locator('.dv-groupview')).toHaveCount(1); await newModule(page, 'Documento'); await expect(page.getByRole('textbox', { name: 'Texto de Documento 1' })).toBeVisible();
});

test('fallo de almacenamiento preserva la edición y muestra el error', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Quota', 'QuotaExceededError'); }; }); await page.goto('/');
  await expect(page.locator('.error-banner')).toContainText('No se pudo guardar'); await expect(page.getByRole('status', { name: 'Cambios sin guardar' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Sigue disponible en memoria'); await page.locator('.global-tabs').getByRole('button', { name: 'Cerrar Chat 1', exact: true }).click(); await page.getByRole('button', { name: 'Nueva pestaña', exact: true }).first().click(); await page.getByRole('button', { name: 'Reabrir Chat 1', exact: true }).click(); await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Sigue disponible en memoria');
});

test('pantalla completa oculta todo el marco y vuelve sin perder edición', async ({ page }) => {
  await page.goto('/'); await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Texto intacto'); await page.getByRole('button', { name: 'Ver', exact: true }).click(); await page.getByRole('menuitem', { name: 'Pantalla completa', exact: true }).click();
  await expect(page.locator('.app-header')).toHaveCount(0); await expect(page.locator('.sidebar')).toHaveCount(0); await page.getByRole('button', { name: 'Salir de pantalla completa' }).click(); await expect(page.locator('.app-header')).toBeVisible(); await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Texto intacto');
});



test('arrastrar desde la cinta agrupa y vuelve a dividir el mismo contenido', async ({ page }) => {
  await page.goto('/');
  const source = page.locator('.global-tab').filter({ has: page.getByRole('tab', { name: 'Lienzo 1', exact: true }) });
  let target = page.locator('.panel-body').filter({ has: page.getByRole('region', { name: 'Chat 1', exact: true }) });
  const box = await target.boundingBox(); await source.dragTo(target, { targetPosition: { x: box!.width / 2, y: box!.height / 2 } });
  await expect(page.locator('.dv-groupview')).toHaveCount(1);
  await page.getByRole('tab', { name: 'Chat 1', exact: true }).click();
  target = page.locator('.panel-body').filter({ has: page.getByRole('region', { name: 'Chat 1', exact: true }) });
  const next = await target.boundingBox(); await source.dragTo(target, { targetPosition: { x: next!.width - 10, y: next!.height / 2 } });
  await expect(page.locator('.dv-groupview')).toHaveCount(2); await expect(page.getByRole('tablist', { name: 'Vistas abiertas' })).toHaveCount(1);
});

test('una escritura local fallida recupera el último borrador al recargar', async ({ page }) => {
  let saved: unknown = null; let revision = 0; let fail = false;
  await page.route('**/api/pilot', async route => {
    if (route.request().method() === 'GET') await route.fulfill({ json: { state: saved, revision, root: 'Piloto aislado' } });
    else if (fail) await route.fulfill({ status: 500, json: { error: 'No se pudo guardar el proyecto local.' } });
    else { saved = route.request().postDataJSON().state; await route.fulfill({ json: { revision: ++revision, root: 'Piloto aislado' } }); }
  });
  await page.goto('/'); await expect(page.getByRole('status', { name: 'Proyecto guardado en disco' })).toBeVisible(); fail = true;
  await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Última edición todavía pendiente');
  await expect(page.locator('.error-banner')).toContainText('No se pudo guardar el proyecto local');
  await page.reload(); await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Última edición todavía pendiente');
});

test('pantalla completa de un panel restaura las demás divisiones al salir', async ({ page }) => {
  await page.goto('/'); await panelMenu(page, 'Chat 1', 'Pantalla completa');
  await expect(page.locator('.app-header')).toHaveCount(0); await expect(page.locator('.canvas-module')).toBeHidden();
  await page.getByRole('button', { name: 'Salir de pantalla completa' }).click(); await expect(page.locator('.canvas-module')).toBeVisible(); await expect(page.locator('.dv-groupview')).toHaveCount(2);
});


test('otra ventana que guarda no elimina la recuperación del borrador pendiente', async ({ page }) => {
  let saved: unknown = null; let revision = 0; let failHere = false;
  const handle = async (route: import('@playwright/test').Route, fail: boolean) => {
    if (route.request().method() === 'GET') await route.fulfill({ json: { state: saved, revision, root: 'Piloto aislado' } });
    else if (fail) await route.fulfill({ status: 500, json: { error: 'Escritura local interrumpida' } });
    else { saved = route.request().postDataJSON().state; await route.fulfill({ json: { revision: ++revision, root: 'Piloto aislado' } }); }
  };
  await page.route('**/api/pilot', route => handle(route, failHere)); await page.goto('/'); await expect(page.getByRole('status', { name: 'Proyecto guardado en disco' })).toBeVisible();
  failHere = true; await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Edición pendiente de esta ventana'); await expect(page.locator('.error-banner')).toContainText('interrumpida');
  const other = await page.context().newPage(); await other.route('**/api/pilot', route => handle(route, false)); await other.goto('/'); await expect(other.getByRole('status', { name: 'Proyecto guardado en disco' })).toBeVisible();
  await page.reload(); await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Edición pendiente de esta ventana'); await other.close();
});
