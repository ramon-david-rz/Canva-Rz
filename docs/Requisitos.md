# Requisitos y procedencia

## Autoridad y conservación

1. Instrucciones posteriores del usuario en este chat.
2. [Nota 1 · dirección de construcción](fuentes/01-direccion-construccion.txt): empieza «ok acá tengo en este…».
3. [Nota 2 · visión y apuntes](fuentes/02-vision-apuntes.txt): empieza «Este proyecto lo voy…».
4. `../../Canva-RZ-plan`: antecedente para detectar omisiones; sus recomendaciones no prevalecen sobre las notas.

Las dos fuentes se conservan completas y sin corregir el dictado. [Procedencia](fuentes/Procedencia.md) identifica originales y SHA-256. Las fichas siguientes normalizan el sentido; no sustituyen las fuentes ni borran alternativas contradictorias. «Canva» del dictado puede indicar editor/lienzo propio; «marco» indica el anfitrión. LaMa, ComfyUI, SVG, Markdown y MCP se normalizan como términos, sin afirmar haber validado sus integraciones.

## Nuevos requisitos que dirigen el marco

| ID | Requisito de la nota 1 | Entrega 1 |
| --- | --- | --- |
| A01 | Construcción gradual contigo, feedback por avance | Plan, Estado y reporte por tramo |
| A02 | Marco general primero, distinto del lienzo de imágenes | Anfitrión navegable con artboard de prueba |
| A03 | Módulos propios integrables y extensiones hijas | Registro inicial; contrato hijo documentado |
| A04 | Abrir/cerrar varias instancias de cada herramienta | Implementado para cuatro módulos de prueba |
| A05 | Dividir horizontal/vertical, agrupar, mover y redimensionar | Implementado con motor de paneles; pruebas |
| A06 | Maximizar, reducir, ocultar y recuperar vistas | Panel ampliado, minimización y navegador ocultable |
| A07 | Cerrar vista conserva contenido y estado | Borradores recuperables en navegador; archivos pendientes |
| A08 | Dos bibliotecas con búsquedas independientes sobre catálogo común | Prueba con catálogo de borradores |
| A09 | Chat activo explícito y vínculo al lienzo | Selector y vínculo; sin generación |
| A10 | Chat breve/flotante, ampliado o dividido usa la misma lógica | Burbuja y panel comparten borrador; compositor pro posterior |
| A11 | Temas claro/oscuro con intensidad, tono y presets | Intensidad y tono implementados; presets posteriores |
| A12 | Tokenizar todos los nuevos controles y estados | CSS semántico y mapeo del motor de paneles |
| A13 | Patrones comunes, minimalismo y opciones avanzadas ampliables | Controles compartidos; extensiones completas posteriores |
| A14 | Separar lógica, interfaz y almacenamiento de proyectos | Núcleo, anfitrión y adaptador distintos |
| A15 | Proyectos en carpetas compartidas con otras aplicaciones | Contrato preservado; paso 3 |
| A16 | Estado editable, autoguardado e imagen final recuperable | Borradores en navegador; imagen final depende del editor |
| A17 | Arrastrar/contextualizar entre módulos | Distribución de pestañas actual; transferencia de recursos posterior |
| A18 | Web en pestaña de Codex y traslado a otras PC | Web local abrible; instalación reproducible; traslado de proyectos pendiente |
| A19 | Trabajo local con checkpoints y continuación remota | Git local; remoto no identificado aún |
| A20 | GPU local opcional y API como alternativa | Puertos futuros; sin acoplar marco a GPU |
| A21 | Referencias consultadas por función al llegar a su módulo | No se inspeccionaron paquetes de referencia en esta entrega |
| A22 | Carpeta propia para app; modelos/medios pesados aparte | Desarrollo dentro de `Canva-RZ` |

## Cobertura de visión y apuntes

| Familia | Ficha que conserva detalles | Requisitos del inventario anterior usados solo como contraste |
| --- | --- | --- |
| Marco y plataforma | [Marco](modulos/00-marco.md), Arquitectura | P01–P04, P09, P11–P16 |
| Lienzo, transformaciones, navegación | [Lienzo](modulos/01-lienzo.md) | E01–E33 |
| Capas, anotaciones y ajustes | [Capas y extensiones](modulos/02-capas-extensiones.md) | C01–C23 |
| Chat, peticiones y carruseles | [Chat](modulos/03-chat.md) | I01–I07, H01–H09 |
| Biblioteca y visor | [Medios](modulos/04-medios.md) | B01–B13, B17 |
| Documentos y producción | [Documentos](modulos/05-documentos.md) | B14–B16, P12 |
| IA, local/API, trabajos y agentes | [Integraciones](modulos/06-integraciones.md) | I08–I21, P10, P13–P17 |
| Guardado y portabilidad | Arquitectura y fichas Marco/Medios | P05–P08, P11 |

No se adoptan las fases del inventario anterior: se sustituyen por la secuencia de Plan. Las asignaciones de esquinas, resistencia del zoom, gestos de borrar y clasificación inteligente requieren ensayo contigo; permanecen registradas. No se convierten por defecto en hechos técnicos o comportamientos finales.

## Decisiones abiertas sin bloquear el marco

- Motor de edición: Konva/Fabric u otro, a decidir con una escena representativa.
- Servicio de archivos y distribución de proyectos, especialmente PC/iPad/remoto.
- Proveedor inicial y alcance de generación/conversación en la app.
- Tratamiento de recursos compartidos al editar: instancia, variante y recurso derivado.
- Gestos finales de esquinas, capas, navegación y táctil.
- Ubicación y repo remoto real; nube no significa acceso automático al disco local.

El primer feedback puede centrarse en el marco: tamaño del navegador, proporción chat/lienzo, claridad de minimizar/reabrir, controles visibles y tema. Las decisiones técnicas que no dependan de ese feedback continúan según el tramo autorizado.
