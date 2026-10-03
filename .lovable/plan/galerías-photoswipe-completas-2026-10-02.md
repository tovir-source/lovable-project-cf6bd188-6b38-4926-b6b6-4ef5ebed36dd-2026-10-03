# Galerías PhotoSwipe completas

## Objetivo
Convertir cada galería del torneo en una demostración funcional con fotografías de fútbol diferentes por jornada.

## Cambios
- Crear un conjunto variado de imágenes de ejemplo y asignarlas por fecha en el archivo local de fotos.
- Mejorar las miniaturas con proporciones estables, descripción y datos de cada foto.
- Configurar PhotoSwipe con navegación anterior/siguiente, contador, zoom por clic/rueda/pellizco, arrastre, cierre, teclado y pantalla completa.
- Añadir descarga de la imagen abierta y textos accesibles para los controles.
- Mantener todo local, sin base de datos ni servicios externos.

## Verificación
- Abrir varias jornadas en escritorio y móvil.
- Recorrer imágenes, ampliar, cerrar, usar pantalla completa y comprobar descarga.
- Confirmar que no existan imágenes rotas, desbordes ni errores visibles.

## Detalles técnicos
- Se conservará PhotoSwipe 5.4.4 y su carga dinámica actual.
- Los controles adicionales usarán la API oficial de elementos de interfaz de PhotoSwipe.
- Las imágenes serán archivos optimizados del proyecto y `photos.json` seguirá siendo la única fuente editable.
