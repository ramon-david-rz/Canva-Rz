# Canva RZ

Base de una suite modular para imágenes, medios, documentos y solicitudes de IA. La primera entrega construye el **espacio de trabajo anfitrión**: las herramientas se incorporan por tramos.

## Abrir

Requiere Node.js 22.12 o superior compatible. Desde esta carpeta:

```powershell
npm ci
npm run dev
```

Abrir http://127.0.0.1:5173. `npm run build` verifica TypeScript y produce la web en `dist`. `npm test` comprueba operaciones y recuperación con Chromium instalado por Playwright.

## Continuar juntos

- [Estado actual](docs/Estado.md)
- [Plan y secuencia de construcción](docs/Plan.md)
- [Arquitectura](docs/Arquitectura.md)
- [Requisitos y procedencia](docs/Requisitos.md)
- [Primer reporte](docs/reportes/001-base.md)

Los módulos de esta entrega son pruebas de alojamiento. Los borradores y la distribución se recuperan en este navegador. La carpeta compartida con otros programas y la escritura durable de medios se implementarán en el tramo de persistencia.
