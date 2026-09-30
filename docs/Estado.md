# Estado de construcción

Entrega: **001 · Orquestación base y marco navegable**. Fecha: 30 de septiembre de 2026.

## Punto actual

Se rediseñó la secuencia desde las dos notas ratificadas. Ya existe una aplicación web ejecutable con anfitrión modular, tokens, distribución de vistas y recuperación de borradores en navegador. Todavía no es el editor de imágenes completo.

El tramo 1 está técnicamente comprobado: compilación y siete pruebas pasan; revisión visual en navegador integrado en temas oscuro/claro y tamaño estrecho; separador arrastrable comprobado. Las fuentes completas se copiaron y sus SHA-256 coinciden. La prueba con un iPad físico y los módulos de producción están pendientes.

## Continuar

1. Leer [Reporte 001](reportes/001-base.md).
2. Recoger la guía del usuario sobre el marco y avanzar al paso 2 de [Plan](Plan.md).
3. Después: proyecto/archivos durables, lienzo mínimo y capas; consultar solo las fichas necesarias.

## Ubicaciones

- App local: `Canva-RZ/`, dentro del workspace CANVA-Rz.
- Vista de desarrollo: http://127.0.0.1:5173, mientras el servidor está activo.
- Remoto autorizado: https://github.com/ramon-david-rz/Canva-Rz.
- Checkpoint de entrega: etiqueta `base-001` en `main`; verificar su presencia remota al cerrar la entrega.
- Fuentes originales conservadas en `docs/fuentes/`.
- Referencias instaladas y plan anterior permanecen fuera del repositorio de aplicación.

Los medios y modelos futuros tendrán almacenamiento separado. No incluirlos automáticamente en Git. La sesión del navegador actual no se comparte entre máquinas.
