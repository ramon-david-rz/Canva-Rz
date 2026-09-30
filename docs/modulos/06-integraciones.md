# IA, servicios e integraciones

**IA de imágenes.** Generar, editar, armonizar luz/sombra/estilo, cambiar pose/ropa, eliminar/extraer objeto, quitar fondo, ampliar y separar sujeto/fondo en recursos asociados. Resultado como recurso y nueva capa/variante/parche; conservar entrada y relación. Selección sobre imagen/capa/composición en coordenadas de documento, escala/rotación/recorte correctos, salida de mayor resolución colocada en misma proporción; margen/máscara y ajuste manual si el modelo desalineó contenido. No prometer capas originales recuperadas de una imagen plana.

**Proveedores.** API e inferencia local opcionales, flujos ComfyUI con descriptor de entradas/salidas/parámetros/nodos/modelos; selector de modelo y capacidad; herramientas locales de relleno/extracción candidatas (LaMa, rembg u otras a probar); GPU 3070 mencionada, capacidad real por verificar antes de usar. Una laptop sin GPU conserva funciones manuales y proveedor remoto si está configurado. Modelos pesados fuera del repo de app.

**Trabajos.** Estado, progreso, coste estimado cuando exista información, cancelación con alcance conocido, fallo/reintento/resultado desconocido; identificador remoto y recuperación antes de repetir cobros; prompt exacto, referencias ordenadas, versiones, parámetros y destino congelados. Historial y carpeta de generaciones reciben la misma salida. Claves en servicio/almacén adecuado, nunca en docs o repo.

**Extensiones.** Plantillas de acciones rápidas configurables/versionadas; edición IA compacta y vista completa con modos, modelos y parámetros. Generación de vídeo/audio como adaptadores por capacidad, sin implementar timeline ahora; mapa de profundidad como medio auxiliar. Dictado integrado y visor 3D quedan como ideas de baja prioridad expresadas por el usuario; no son requisitos de la primera base.

**Agentes.** Intercambio por carpeta primero; API de comandos reusable por UI y agente; exposición MCP después, para listar/abrir/colocar/editar/generar/consultar/exportar sin lógica paralela. Posibilidad de arnés en el chat o vistas incrustadas por capacidades de plataforma, sin depender de ella para funcionar solo.

**Portabilidad.** Código con lockfile y checkpoints locales; remoto existente por verificar antes de publicar. Navegador en tablet puede controlar un servicio disponible, pero PC apagada no ofrece su GPU/disco. Continuación de código desde nube/tablet es distinta de servir remotamente el proyecto personal. Traslado a otra PC necesita dependencias reproducibles y paquete de medios con rutas relativas.

**Entrega 1.** Contratos de límites y puntos de extensión documentados. No se conectó proveedor, servicio pesado, agente ni GPU. El primer proveedor se elige contigo cuando exista petición y geometría verificables.
