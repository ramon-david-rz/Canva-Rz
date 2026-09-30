# Chat, compositor e historial

**Requisitos.** Chat como módulo propio que puede funcionar sin lienzo/biblioteca abiertos; varios chats, cierre con nombre e historial, chat activo explícito por proyecto, relación con documento/lienzo; burbuja mínima opcional, entrada breve, panel dividido o vista completa; mismos borrador/adjuntos/operaciones en todos los tamaños.

**Entrada.** Añadir y enviar, referencias en miniaturas/burbujas, objetivo separado (lienzo/capa/objeto/región), arroba sobre elementos disponibles, búsquedas/slash para consultar bibliotecas y capas, arrastrar texto o archivo marcado como prompt/contexto. Compositor ampliado para textos largos: referencias arriba, cuerpo amplio/Markdown, parámetros y proveedor abajo. Ampliación no crea otra sesión.

**Historial.** Tareas/posts ordenados en vertical, variantes de la misma idea en horizontal; miniaturas sugieren más hacia los lados, tamaños pequeño/medio/grande; prompt y referencias vinculados al resultado seleccionado; texto plegable, detalle temporal, vista amplia del grupo; nueva tarea/carrusel manual. Agrupación semiautomática por mismo trabajo o documento como sugerencia revisable, sin mezclar silenciosamente dos ideas. Un mismo chat puede reunir varios lienzos en posts distintos; nuevo proyecto puede abrir otro chat.

**Reutilización/contexto.** Copiar prompt, usar resultado como referencia, reutilizar entradas completas; vínculo a prompt original/versiones; historial visible no implica contexto enviado. Opciones sin contexto previo, continuar tarea, responder a elemento específico; conversación vertical y modo mixto conservados como posibles capacidades. El arnés externo puede encargarse de escritura/investigación; no se decide aquí eliminar conversación propia.

**Entrega 1.** Borradores independientes, chat activo, vínculo a lienzo, burbuja compartida y reapertura. Botón enviar deshabilitado: no hay backend de conversación, generación ni mensajes ficticios. Carruseles y generación se implementarán en sus tramos.

**Retos.** Congelar destino al enviar; evitar que foco en otra pestaña reasigne una generación en curso; rol inequívoco de adjuntos; historial durable y fallos de proveedor; distintas capacidades de parámetros para imagen/vídeo/texto.
