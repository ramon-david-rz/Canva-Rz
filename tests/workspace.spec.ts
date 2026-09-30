import { test, expect } from '@playwright/test';

test('cerrar, minimizar y recargar conservan el borrador y la distribución', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Conservar la escena sin perder el montaje');
  await page.getByRole('button', { name: 'Minimizar Chat 1', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Restaurar Chat 1', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Conservar la escena sin perder el montaje');
  await page.getByRole('button', { name: 'Cerrar Chat 1', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Vistas', exact: true }).click();
  await page.getByRole('region', { name: 'Todas las vistas' }).getByRole('button', { name: /Chat 1.*Reabrir/ }).click();
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Conservar la escena sin perder el montaje');
  expect(errors).toEqual([]);
});

test('dos vistas comparten contenido y dos bibliotecas conservan búsquedas independientes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir Documento', exact: true }).click();
  await page.getByRole('textbox', { name: 'Texto de Documento 1', exact: true }).fill('Prompt exacto de la toma 01');
  await page.getByRole('region', { name: 'Documento 1', exact: true }).getByRole('button', { name: 'Otra vista', exact: true }).click();
  const editors = page.getByRole('textbox', { name: 'Texto de Documento 1', exact: true });
  await expect(editors).toHaveCount(2);
  await editors.nth(1).fill('La misma toma, revisión compartida');
  await expect(editors.nth(0)).toHaveValue('La misma toma, revisión compartida');
  await page.getByRole('button', { name: 'Abrir Medios', exact: true }).click();
  await page.getByRole('textbox', { name: 'Buscar en Medios 1' }).fill('Lienzo');
  await page.getByRole('button', { name: 'Abrir Medios', exact: true }).click();
  await page.getByRole('textbox', { name: 'Buscar en Medios 2' }).fill('Documento');
  await page.reload();
  await page.getByRole('button', { name: 'Vistas', exact: true }).click();
  await page.getByRole('region', { name: 'Todas las vistas' }).getByRole('button', { name: /Medios 1.*Abierta/ }).click();
  await expect(page.getByRole('textbox', { name: 'Buscar en Medios 1' })).toHaveValue('Lienzo');
  await page.getByRole('button', { name: 'Vistas', exact: true }).click();
  await page.getByRole('region', { name: 'Todas las vistas' }).getByRole('button', { name: /Medios 2.*Abierta/ }).click();
  await expect(page.getByRole('textbox', { name: 'Buscar en Medios 2' })).toHaveValue('Documento');
});

test('dividir, agrupar, ampliar y flotar pasan por el anfitrión', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.dv-groupview')).toHaveCount(2);
  await page.getByRole('button', { name: 'Opciones de Chat 1', exact: true }).click();
  await page.getByRole('button', { name: 'Agrupar con otro panel', exact: true }).click();
  await expect(page.locator('.dv-groupview')).toHaveCount(1);
  await page.getByRole('button', { name: 'Opciones de Chat 1', exact: true }).click();
  await page.getByRole('button', { name: 'Separar debajo', exact: true }).click();
  await expect(page.locator('.dv-groupview')).toHaveCount(2);
  await page.getByRole('region', { name: 'Chat 1', exact: true }).getByRole('textbox').fill('Sigue siendo el mismo chat');
  await page.getByRole('button', { name: 'Ampliar panel', exact: true }).last().click();
  await page.getByRole('button', { name: 'Restaurar panel', exact: true }).click();
  await page.getByRole('button', { name: 'Opciones de Chat 1', exact: true }).click();
  await page.getByRole('button', { name: 'Ventana flotante', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Chat 1', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Chat 1', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Sigue siendo el mismo chat');
});

test('la burbuja comparte el borrador del chat elegido explícitamente', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir Chat', exact: true }).click();
  await page.getByRole('textbox', { name: 'Borrador de Chat 2', exact: true }).fill('Segundo trabajo');
  await page.getByRole('button', { name: 'Activar', exact: true }).click();
  await page.getByRole('button', { name: 'Vistas', exact: true }).click();
  await page.getByRole('button', { name: 'Mostrar burbuja de chat', exact: true }).click();
  await page.getByRole('button', { name: 'Cerrar lista de vistas', exact: true }).click();
  await page.getByRole('button', { name: 'Expandir burbuja de chat', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Borrador de la burbuja' })).toHaveValue('Segundo trabajo');
  await page.getByRole('textbox', { name: 'Borrador de la burbuja' }).fill('Segundo trabajo revisado');
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 2', exact: true })).toHaveValue('Segundo trabajo revisado');
});

test('temas, controles táctiles y paneles se recuperan juntos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Apariencia y controles', exact: true }).click();
  await page.getByRole('button', { name: 'Claro', exact: true }).click();
  await page.getByRole('slider', { name: 'Intensidad del tema' }).fill('80');
  await page.getByRole('slider', { name: 'Tonalidad del tema' }).fill('35');
  await page.getByRole('combobox', { name: 'Perfil de interacción' }).selectOption('touch');
  await page.reload();
  await expect(page.locator('.app')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.app')).toHaveAttribute('data-input', 'touch');
  await expect(page.locator('.app')).toHaveCSS('--theme-hue', '35');
  const target = await page.getByRole('button', { name: 'Apariencia y controles' }).boundingBox();
  expect(target!.height).toBeGreaterThanOrEqual(44);
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.getByRole('button', { name: 'Abrir Lienzo' })).toBeVisible();
});

test('un error de almacenamiento no se anuncia como guardado exitoso', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Quota', 'QuotaExceededError'); }; });
  await page.goto('/');
  await expect(page.locator('.error-banner')).toContainText('No se pudo guardar');
  await expect(page.locator('.status-bar')).toContainText('Cambios sin guardar');
  await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Sigue disponible en memoria');
  await page.getByRole('button', { name: 'Cerrar Chat 1', exact: true }).click();
  await page.getByRole('button', { name: 'Vistas', exact: true }).click();
  await page.getByRole('region', { name: 'Todas las vistas' }).getByRole('button', { name: /Chat 1.*Reabrir/ }).click();
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Sigue disponible en memoria');
});

test('el panel estrecho muestra una herramienta completa sin perder los borradores', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true }).fill('Visible también en una pantalla pequeña');
  await page.setViewportSize({ width: 783, height: 844 });
  await expect(page.locator('.dv-groupview')).toHaveCount(1);
  await expect(page.getByRole('complementary', { name: 'Navegador de la sesión' })).toHaveCount(0);
  await page.getByRole('tab', { name: /Chat 1/ }).click();
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Visible también en una pantalla pequeña');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('.dv-groupview')).toHaveCount(1);
  await expect(page.getByRole('textbox', { name: 'Borrador de Chat 1', exact: true })).toHaveValue('Visible también en una pantalla pequeña');
});
