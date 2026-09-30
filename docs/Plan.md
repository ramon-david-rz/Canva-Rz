# Ruta de construcción · revisión nueva

Fecha: 30 de septiembre de 2026. Fuente principal: las dos notas ratificadas por el usuario. La nota «ok acá tengo en este…» se leyó primero y dirige esta revisión. El plan anterior permanece como antecedente.

## Estrategia

Construir primero el anfitrión donde se abren herramientas: marco, distribución, registro de módulos, temas, identidades y recuperación. Después completar una capacidad pequeña de cada módulo y probarla juntos. Los contratos se diseñan antes de conectar almacenamiento o proveedores; la experiencia se verifica desde la primera entrega. No conviene terminar todo el backend para descubrir después que las vistas requieren otra estructura.

La analogía de la ciudad se traduce en servicios comunes y puntos de extensión claros. Preparamos conexiones para nuevas herramientas; implementamos cada servicio cuando exista un recorrido que lo necesite. Las extensiones internas son módulos registrados de confianza. Un mercado de plugins externos, carga arbitraria de código o aislamiento de terceros requerirá un contrato adicional.

## Árbol

```text
Canva-RZ/
  docs/                   Plan, estado, decisiones, contratos, requisitos y reportes
    fuentes/              Copias exactas de las notas y feedback, con sus hashes
    modulos/              Una ficha por frente de construcción
  src/
    core/                 Identidades, contenido, vistas y operaciones comunes
    adapters/             Recuperación del navegador y piloto local; después proveedores
    design/               Tokens y controles compartidos
    shell/                Marco, distribución, navegación y burbuja
    modules/              Registro y módulos independientes
      canvas/
      chat/
      library/
      document/
      start/              Selector interno de herramientas y reapertura
  server/                 Adaptador local del piloto para desarrollo y preview
  tests/                  Recuperación y operaciones del anfitrión
```

No crear ahora carpetas vacías para cada función futura. Las fichas y contratos reservan sus responsabilidades. Modelos y recursos voluminosos podrán existir fuera del repositorio de aplicación, como pediste.

## Pasos y evidencia para avanzar

| Paso | Entrega concreta | Cómo se comprueba | Dependencia |
| --- | --- | --- | --- |
| 1 · Marco | Anfitrión web, tokens, registro de módulos, pestañas, paneles, instancias y borradores de prueba | Mover, dividir, agrupar, ampliar, minimizar, cerrar, reabrir y recargar conservando estados | Primera entrega actual |
| 2 · Afinar la mesa | Tu feedback sobre distribución, proporciones, acciones, intensidad y táctil; modificar ese mismo marco | Repetir los recorridos con las correcciones elegidas; probar iPad real cuando esté disponible | Revisión del paso 1 |
| 3 · Proyecto y archivos | Selección de carpeta, proyecto versionado, guardado durable, recuperación y vínculo con archivos externos | Abrir un proyecto, modificar un borrador, interrumpir/reabrir y observar su archivo desde otro programa | Contratos de identidad y persistencia |
| 4 · Lienzo mínimo | Importar una imagen y mover/encuadrar la vista; cerrar y recuperar el documento | Imagen real mantiene dimensiones, ubicación y estado; exportar coincide con la vista | Paso 3 y prueba pequeña del motor |
| 5 · Capas | Añadir, seleccionar, mover, ordenar, ocultar, bloquear, duplicar y deshacer | Dos capas y una anotación conservan estructura al reabrir; selección no compite con navegación | Lienzo mínimo |
| 6 · Transformaciones | Escala, giro, flip, recorte y ajustes esenciales; controles contextuales | Exportación, geometría, originales y deshacer; gestos de esquinas comparados con alternativas visibles | Capas |
| 7 · Chat/historial | Borrador breve/ampliado, entradas, objetivos, tareas verticales y variantes horizontales | Dos chats, activo explícito, vínculo al documento y reutilización con contexto elegido | Núcleo de trabajos |
| 8 · Primera IA | Un adaptador elegido, generación y edición rectangular como nuevo recurso/capa | Conservar revisión de entrada, insertar en coordenadas correctas, registrar prompt y recuperarse de fallo | Paso 7; elección de proveedor contigo |
| 9 · Biblioteca y documentos | Carpetas y galería, miniaturas, visor compartido, Markdown y referencias desde prompts | Dos bibliotecas con búsquedas diferentes consultan el mismo catálogo; original externo conserva ubicación | Paso 3; diseño de galería contigo |
| 10 · Extensiones hijas | Color completo, máscaras, extracción, anotaciones, flujos ComfyUI y utilidades de vídeo, una por entrega | Cada extensión funciona como vista propia y como controles compactos sobre la misma instancia | Contrato de destino y revisiones |
| 11 · Automatización y portabilidad | Comandos para agentes/MCP, paquete portable, uso remoto y empaquetado según necesidad | Agente y usuario usan las mismas operaciones; trasladar a otra PC sin rutas absolutas de la original | Contratos estables y uso real |

Los pasos 7 y 9 pueden alternarse según la utilidad que veas. Varias mesas, vídeo de referencia, mapa de profundidad y búsqueda visual quedan explícitamente conservados en sus fichas; no desaparecen al empezar pequeño.

## Cambios respecto al plan anterior

- El anfitrión flexible se adelanta: no espera a tener un editor útil ni a una ampliación posterior.
- Cada herramienta puede tener varias vistas y existir sola; la versión compacta y la completa usan el mismo contenido.
- La biblioteca puede abrirse varias veces con navegación independiente; el catálogo y los archivos siguen siendo compartidos.
- El chat sigue registrado como módulo importante. El arnés externo puede cubrir escritura e investigación; la app conserva borradores, solicitudes, historial y posibilidad de conversación propia. No se elimina esa posibilidad por una inferencia del informe anterior.
- Temas graduables, tono, perfiles de entrada y reglas de presentación pertenecen a la base.
- Se desacopla la lógica del almacenamiento. Un servicio Python es candidato para archivos/ComfyUI; no es una dependencia obligatoria del marco web.
- Konva y Fabric quedan sin elegir. No hacen falta para construir el anfitrión y deben compararse cuando exista un caso real de lienzo.
- Local y nube se diferencian: el repo respalda construcción; los medios/modelos personales tienen políticas separadas. La tablet no hereda la GPU ni los archivos de una PC apagada.

## Trabajo conjunto

Cada entrega termina con: lo que puedes probar, lo que falló o queda sin verificar, checkpoint local y siguiente tramo recomendado. Tu feedback cambia la siguiente entrega. No fijar tiempos de presión, gestos o estética avanzada como definitivos antes de usarlos contigo.

## Tramo 2 completado

La entrega [002](reportes/002-mesa.md) aplica la nueva guía del usuario: pestañas globales discretas, + como selector y reapertura, laterales reversibles, menos márgenes y textos, contraste oscuro ampliado, menús accesibles y burbuja móvil. También inicia un piloto durable con Actual/Medios fuera del código. El paso 3 continúa pendiente para elegir carpetas, importar/observar archivos y ampliar el formato; no confundir el adaptador pequeño del piloto con esa capacidad completa.
