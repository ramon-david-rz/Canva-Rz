# Canva RZ

Base de una suite modular para imágenes, medios, documentos y solicitudes de IA. La entrega 002 afina el **espacio de trabajo anfitrión** y añade un piloto con guardado local: las herramientas se incorporan por tramos.

## Abrir

Requiere Node.js 22.12 o superior compatible. Desde esta carpeta:

```powershell
npm ci
npm run dev
```

Abrir http://127.0.0.1:5173. `npm run build` verifica TypeScript y produce la web en `dist`. `npm test` comprueba operaciones, recuperación y persistencia con Edge/Chromium local. `npm run preview` también sirve el adaptador del piloto.

## Continuar juntos

- [Estado actual](docs/Estado.md)
- [Plan y secuencia de construcción](docs/Plan.md)
- [Arquitectura](docs/Arquitectura.md)
- [Requisitos y procedencia](docs/Requisitos.md)
- [Primer reporte](docs/reportes/001-base.md)
- [Rediseño y piloto local](docs/reportes/002-mesa.md)

La cinta común abre, minimiza y recupera vistas; los laterales pueden plegarse e intercambiarse. Los borradores y la distribución se guardan en `../Proyectos/Piloto-RZ/Episodio-01/`, fuera del repositorio, con recuperación inmediata en el navegador. El piloto prepara `Actual/` y `Medios/`; la selección de otras carpetas, importación de medios y edición de imágenes siguen pendientes. La escritura local requiere el servidor de desarrollo o preview; servir únicamente `dist` conserva solo la recuperación del navegador.
