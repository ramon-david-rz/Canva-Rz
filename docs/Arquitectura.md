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
| Persistencia | Guarda y recupera mediante un puerto; confirma después de escribir | `SessionStoragePort`, recuperación de navegador y adaptador del piloto local |
| Diseño | Una fuente para roles, tamaños, foco y estados | `design/tokens.css` y primitivas compartidas |
| Módulos | Reciben anfitrión y vista; no importan herramientas hermanas | Registro con ID, versión, icono, título y componente |
| Extensiones hijas | Reciben destino estable y parámetros; cambian su revisión mediante comandos | Contrato proyectado; color/IA/máscaras no implementados aún |

Dos vistas de un documento referencian un `contentId`. Dos documentos nuevos obtienen identidades distintas. Una biblioteca puede tener filtros distintos por `viewId` y consultar un catálogo común. Cerrar no elimina contenido; minimizar conserva el acceso desde la cinta global. Los borradores persisten durante la edición, no solo al salir. La vista interna `start` ofrece herramientas y reapertura; no se proyecta como documento en Actual.

El chat activo es una selección explícita independiente de la pestaña con foco. La burbuja usa ese chat y su mismo borrador. Al enfocar un lienzo, el anfitrión actualiza el vínculo del chat activo. En la futura generación se congelará el destino y la revisión al enviar; cambiar de pestaña después no cambiará un trabajo en curso.

## Contratos que deben permanecer

```text
ContentRef: projectId + contentId + revision
ViewRef: viewId + moduleId + contentId + estado propio
AssetRef: assetId + versión + ubicación relativa o vínculo externo
Command: operationId + destination + expectedRevision + payload
Job: jobId + entradas congeladas + prompt exacto + proveedor + destino + estado
Result: recursos nuevos + procedencia + dimensiones reales + revisión de entrada
```

Los últimos cuatro contratos son diseño pendiente de implementación. El formato actual guarda `schema: 1` y las identidades iniciales. No contiene medios ni claves API. El piloto valida el estado y usa una revisión de manifiesto independiente; los futuros contratos de recursos requieren su propia migración y política de revisiones.

## Plugin y autonomía

La base actual admite módulos internos registrados: cada uno se monta con servicios del anfitrión y puede ocupar todo el área disponible. Para una prueba independiente se prepara un anfitrión mínimo con los mismos puertos; no se crea una lógica duplicada. La distribución es una dependencia del anfitrión, no de la herramienta.

Una extensión hija de ajustes recibe la instancia seleccionada y su revisión. Sus tres controles compactos y su vista completa modifican el mismo modelo. Quitar esa extensión no inutiliza las capas. La conexión hacia otro módulo pasa por referencias/comandos, nunca por importar su componente o mutar su estado privado.

No se promete instalar plugins de terceros con código arbitrario: esa capacidad requiere permisos, validación y aislamiento que se diseñarán si se pide. El objetivo actual es poder añadir y quitar herramientas propias sin reconstruir la base.

## Tecnologías actuales

React 19.3.0, TypeScript 7.0.2 y Vite 8.3.1. Dockview React 8.3.1 distribuye grupos y serializa distribución; el anfitrión presenta una sola cinta y oculta los encabezados internos mediante la API pública. Lucide React 1.49.0 unifica iconos. Radix Dropdown Menu 2.1.24 y Popover 1.1.23 resuelven foco, teclado y posicionamiento con estilos propios. Dependencias fijadas y `package-lock.json`. Playwright 1.63.0 prueba flujos con Edge/Chromium local. Node disponible: 24.19.0; npm: 11.17.0. No se instalaron modelos ni un backend de procesamiento.

Dockview se eligió por una necesidad presente: mover/dividir/agrupar/restaurar vistas. Su documentación incluye [paneles](https://dockview.dev/docs/core/panels/add/), [movimiento](https://dockview.dev/docs/core/panels/move/) y [serialización](https://dockview.dev/docs/core/state/save/). La elección sigue condicionada a la prueba de la experiencia real, especialmente táctil. [Vite](https://vite.dev/guide/) sirve desarrollo y compilación; no convierte el repo en un servicio remoto.

Python/FastAPI, SQLite, ComfyUI, FFmpeg, CodeMirror, motor 2D y MCP son opciones posteriores, cada una ligada a una necesidad. No instalarlas ahora evita fijar decisiones sin su prueba.

## Persistencia y traslado

`src/adapters/local-project.ts` prepara el piloto y conserva la recuperación inmediata mediante el adaptador de navegador. Cada ventana conserva además su propio borrador pendiente en sessionStorage. El estado de guardado en disco se publica por separado y solo se confirma después de una respuesta satisfactoria.

`server/pilot.ts` sirve un endpoint local desde Vite y preview para `../Proyectos/Piloto-RZ/Episodio-01/`. Valida identidades, restringe la ubicación, serializa escrituras, sustituye archivos mediante temporales y escribe el manifiesto al final con copia del anterior. Actual contiene registros JSON y el espejo Markdown de documentos/chats; Medios queda preparado. Las revisiones y el estado base por ventana permiten combinar cambios distintos y rechazar ediciones concurrentes que compiten por el mismo contenido.

El piloto no observa ni reimporta modificaciones externas, ni permite seleccionar carpetas o gestionar varios proyectos. Esas capacidades y la importación de medios pertenecen al paso 3. Se usarán rutas relativas para recursos gestionados y ubicaciones explícitas para vínculos externos. La serialización del motor gráfico nunca sustituirá al documento propio. Una web servida sin este adaptador conserva solo la recuperación de navegador.

## Diseño y gestos

Tres niveles de tokenización: primitivas, roles semánticos y usos de componente. Fondo global, marco, panel, superficie elevada, hover, texto principal/secundario/atenuado, borde, foco, selección, peligro, guías y damero tienen roles. Tema claro/oscuro, intensidad y tono resuelven esos roles globalmente. Añadir un tema no exige recolorear cada módulo.

Radios, espaciados, fuentes, duración y tamaño de interacción son comunes. Los objetivos pasan a 44 px en perfil táctil; íconos mantienen la misma familia. Las acciones de distribución tienen botones alternativos al arrastre. El marco adapta el navegador lateral en pantallas estrechas. La prueba con un viewport de tablet no demuestra los gestos de un iPad real.

Los estilos inspirados en WhatsApp/Instagram/Facebook son presets futuros de roles y presentación, no copias de controles propietarios. Transparencia de una ventana nativa es posterior: una web no garantiza ver el escritorio del sistema detrás del marco.
