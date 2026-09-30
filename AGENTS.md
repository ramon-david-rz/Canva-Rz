# Construcción de Canva RZ

El usuario construye junto al agente. Esta carpeta contiene el desarrollo nuevo; `../Canva-RZ-plan` conserva un antecedente y `../Apps de referencia` las referencias. Las dos notas originales en `docs/fuentes` son instrucciones ratificadas por el usuario. Ante conflicto, la nota «ok acá tengo en este…» precisa la visión anterior, y las nuevas indicaciones del usuario prevalecen.

## Continuidad y alcance

- Leer `docs/Estado.md` y el tramo activo de `docs/Plan.md`; consultar solo la ficha del módulo afectado y los contratos necesarios.
- Entregar un avance concreto por tramo, con lo construido, evidencia, límites y siguiente paso. No ejecutar toda la hoja de ruta de una vez: la guía del usuario forma parte de la construcción.
- No convertir el plan anterior en una especificación aprobada. Conservar requisitos; registrar diferencias y propuestas.
- Trabajar dentro de esta carpeta. Consultar las aplicaciones de referencia por control concreto cuando llegue su módulo.
- Un checkpoint Git local por entrega comprobada. Publicar solo contra un remoto verificado y autorizado; nunca adivinar repositorio ni incluir las aplicaciones de referencia, modelos, credenciales o medios personales.

## Diseño y arquitectura

- Todos los módulos pasan por el registro y las operaciones del núcleo. No importar implementaciones de un módulo desde otro.
- Separar identidad del contenido, identidad de la vista y ubicación del panel. Cerrar o minimizar una vista nunca elimina contenido.
- Lógica pura en `src/core`; adaptadores en `src/adapters`; marco en `src/shell`; módulos en `src/modules`; tokens y primitivas en `src/design`.
- Colores, radios, espaciados, interacción y movimiento usan tokens. El motor de paneles recibe los mismos roles semánticos.
- Acciones con nombre accesible, foco visible y alternativa a arrastrar. PC y táctil comparten operaciones; su presentación puede variar.
- Guardado solo se confirma después de una escritura satisfactoria. La recuperación del navegador no equivale al guardado en una carpeta de proyecto.
- No incorporar proveedores, dependencias de GPU ni generación en una entrega del marco. Las extensiones hijas y adaptadores se conectan según el tramo.
- No instalar una skill por rutina: primero determinar si resuelve una carencia concreta. Las convenciones de esta carpeta mantienen la consistencia.

## Verificación

Ejecutar `npm run build` y las pruebas afectadas de `npm test`. Probar en navegador la distribución y los cambios de tema. No afirmar compatibilidad con iPad físico sin probarlo. Registrar evidencia en el reporte de la entrega. Las pruebas protegen persistencia, identidades y operaciones compartidas; evitar pruebas que solo repitan estilos.
