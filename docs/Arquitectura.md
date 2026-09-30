# Arquitectura base

## Dos orquestaciones

La orquestación de construcción vive en Plan, Estado, fichas y reportes: decide qué tramo hacemos y qué evidencia necesita. La orquestación del producto vive en el anfitrión: abre módulos, distribuye vistas y conecta operaciones. No hace falta una jerarquía de agentes para ninguna de las dos en esta etapa.

## Responsabilidades

| Capa | Regla | Implementación actual / conexión futura |
| --- | --- | --- |
| Contenido | Tiene identidad propia y revisión; existe aunque no se vea | `core/contracts.ts`, borradores y composiciones de prueba |
| Vista | Pertenece a un módulo, referencia contenido y guarda navegación propia | `ViewRecord`; estado abierto/minimizado/cerrado y filtro |
| Distribución | Decide dónde se muestra una vista; no contiene el documento real | Dockview detrás de `shell/App.tsx` |
| Núcleo | Modifica entidades mediante operaciones comunes | `core/workspace.ts`; sin dependencia de React ni Dockview |
| Persistencia | Guarda y recupera mediante un puerto; confirma después de escribir | `SessionStoragePort` y adaptador de navegador |
| Diseño | Una fuente para roles, tamaños, foco y estados | `design/tokens.css` y primitivas compartidas |
| Módulos | Reciben anfitrión y vista; no importan herramientas hermanas | Registro con ID, versión, icono, título y componente |
| Extensiones hijas | Reciben destino estable y parámetros; cambian su revisión mediante comandos | Contrato proyectado; color/IA/máscaras no implementados aún |

Dos vistas de un documento referencian un `contentId`. Dos documentos nuevos obtienen identidades distintas. Una biblioteca puede tener filtros distintos por `viewId` y consultar un catálogo común. Cerrar no elimina contenido; minimizar conserva además un acceso rápido inferior. Los borradores persisten durante la edición, no solo al salir.

El chat activo es una selección explícita independiente de la pestaña con foco. La burbuja usa ese chat y su mismo borrador. Al enfocar un lienzo, el anfitrión actualiza el vínculo del chat activo; el botón de vínculo ofrece una acción explícita. En la futura generación se congelará el destino y la revisión al enviar; cambiar de pestaña después no cambiará un trabajo en curso.

## Contratos que deben permanecer

```text
ContentRef: projectId + contentId + revision
ViewRef: viewId + moduleId + contentId + estado propio
AssetRef: assetId + versión + ubicación relativa o vínculo externo
Command: operationId + destination + expectedRevision + payload
Job: jobId + entradas congeladas + prompt exacto + proveedor + destino + estado
Result: recursos nuevos + procedencia + dimensiones reales + revisión de entrada
```

Los últimos cuatro contratos son diseño pendiente de implementación. El formato actual guarda `schema: 1` y las identidades iniciales. No contiene medios ni claves API. Antes de añadir archivos se definirá y probará una migración, validación y política de revisiones.

## Plugin y autonomía

La base actual admite módulos internos registrados: cada uno se monta con servicios del anfitrión y puede ocupar todo el área disponible. Para una prueba independiente se prepara un anfitrión mínimo con los mismos puertos; no se crea una lógica duplicada. La distribución es una dependencia del anfitrión, no de la herramienta.

Una extensión hija de ajustes recibe la instancia seleccionada y su revisión. Sus tres controles compactos y su vista completa modifican el mismo modelo. Quitar esa extensión no inutiliza las capas. La conexión hacia otro módulo pasa por referencias/comandos, nunca por importar su componente o mutar su estado privado.

No se promete instalar plugins de terceros con código arbitrario: esa capacidad requiere permisos, validación y aislamiento que se diseñarán si se pide. El objetivo actual es poder añadir y quitar herramientas propias sin reconstruir la base.

## Tecnologías elegidas en el paso 1

React 19.3.0, TypeScript 7.0.2 y Vite 8.3.1. Dockview React 8.3.1 aloja pestañas/grupos y serializa distribución; Lucide React 1.49.0 unifica iconos. Dependencias fijadas y `package-lock.json`. Playwright 1.63.0 prueba flujos con Edge/Chromium local. Node disponible: 24.19.0; npm: 11.17.0. No se instalaron modelos ni un backend de procesamiento.

Dockview se eligió por una necesidad presente: mover/dividir/agrupar/restaurar vistas. Su documentación incluye [paneles](https://dockview.dev/docs/core/panels/add/), [movimiento](https://dockview.dev/docs/core/panels/move/) y [serialización](https://dockview.dev/docs/core/state/save/). La elección sigue condicionada a la prueba de la experiencia real, especialmente táctil. [Vite](https://vite.dev/guide/) sirve desarrollo y compilación; no convierte el repo en un servicio remoto.

Python/FastAPI, SQLite, ComfyUI, FFmpeg, CodeMirror, motor 2D y MCP son opciones posteriores, cada una ligada a una necesidad. No instalarlas ahora evita fijar decisiones sin su prueba.

## Persistencia y traslado

Esta entrega guarda la sesión en localStorage del origen del navegador. Incluye borradores, filtros, preferencias, vínculos y distribución. No es una carpeta compartida, un respaldo remoto ni un formato final de proyecto. Una limpieza del navegador puede eliminarla. Un fallo de escritura aparece como cambios sin guardar.

En el paso 3, el adaptador durable guardará proyectos y medios fuera del código de la aplicación. Se usan identificadores y rutas relativas para material gestionado, ubicaciones explícitas para vínculos externos, revisiones esperadas y escrituras recuperables. El índice será reconstruible; el medio y su procedencia seguirán accesibles desde otros programas. La serialización del motor gráfico nunca sustituirá al documento propio.

## Diseño y gestos

Tres niveles de tokenización: primitivas, roles semánticos y usos de componente. Fondo global, marco, panel, superficie elevada, hover, texto principal/secundario/atenuado, borde, foco, selección, peligro, guías y damero tienen roles. Tema claro/oscuro, intensidad y tono resuelven esos roles globalmente. Añadir un tema no exige recolorear cada módulo.

Radios, espaciados, fuentes, duración y tamaño de interacción son comunes. Los objetivos pasan a 44 px en perfil táctil; íconos mantienen la misma familia. Las acciones de distribución tienen botones alternativos al arrastre. El marco adapta el navegador lateral en pantallas estrechas. La prueba con un viewport de tablet no demuestra los gestos de un iPad real.

Los estilos inspirados en WhatsApp/Instagram/Facebook son presets futuros de roles y presentación, no copias de controles propietarios. Transparencia de una ventana nativa es posterior: una web no garantiza ver el escritorio del sistema detrás del marco.
