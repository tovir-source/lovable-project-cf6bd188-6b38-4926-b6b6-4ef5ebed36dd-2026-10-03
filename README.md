# Alianza Soccer Cup 2026

Sitio de información del torneo en Ipiales. Los datos están en JSON locales; no requiere cuenta, base de datos ni panel de administración. Utiliza React, TanStack Start y Tailwind CSS, la plataforma disponible en Lovable. En este proyecto no se usa Astro porque no es compatible con la vista previa de Lovable.

## Ejecutar

```bash
bun install
bun run dev
```

## Archivos que puedes editar

Todos están en `src/data/`:

- `tournament.json`: fechas, categorías, descripción, grupos y jornadas. Para agregar una categoría o jornada, agrega su entrada y crea la página de esa jornada en `src/routes/`.
- `teams.json`: nombre y escudo de cada equipo. Cada equipo tiene un `id` único y `categoryId` (`f9` o `f8`). Los 24 escudos se extrajeron del PDF y ya están asociados a sus equipos. Para sustituir uno, guarda la imagen en `public/images/` y escribe `/images/nombre.png` en `crest`.
- `groups.json`: reemplaza cada `null` por el `id` del equipo sorteado para esa posición. Por ejemplo, la primera entrada de `f9.A` es `A1`. No cambies el orden de la lista sin querer cambiar el sorteo.
- `matches.json`: cada partido contiene fecha, hora de 24 horas, fase, dos referencias y un resultado. Los partidos de grupos usan posiciones (`A1`), no nombres; los cruces usan referencias como `position:A:1`, `rank:1`, `winner:f9-Cuartos-1`, `loser:f9-Semifinales-1` o `bestLoser:1`. Para registrar un marcador, cambia `result` de `null` a `{"home": 2, "away": 1}`. Para un empate de eliminación agrega `penalties`: `{"home": 4, "away": 3}`. La tanda no suma goles reglamentarios. Deja `result: null` en partidos aún no jugados.
- `players.json`: agrega `{"id":"jugador-1","teamId":"f9-team-01","name":"Nombre"}` para registrar jugadores.
- `matches.json`, campo `goals`: agrega `{"playerId":"jugador-1","teamId":"f9-team-01","count":1}` para cada goleador; el total se calcula automáticamente. El campo `discipline` acepta `{"teamId":"f9-team-01","yellows":1,"reds":0,"sanctions":0}`.
- `photos.json`: agrega `{"id":"foto-1","date":"2026-10-06","src":"/images/foto-1.jpg","width":1200,"height":800,"alt":"Descripción"}`. Guarda primero el archivo en `public/images/`. Se puede agregar `categoryId`, `matchId`, `teamId` o `event`. Cada jornada carga solamente sus fotos con PhotoSwipe.
- `awards.json`: reservado para premios excepcionales que no se desprendan de resultados. Campeón, puestos, goleador y valla se calculan a partir de partidos y goles.

## Formatos y datos aún por confirmar

El PDF enumera 14 equipos F9 y 10 equipos F8, pero **no asigna los equipos a sus grupos**. Por eso los cruces muestran A1, B2, etc. hasta llenar `groups.json`. Tampoco publica resultados, jugadores, fotografías de jornada, sede ni hora de inauguración. Aparecen pendientes sin datos ficticios.

F9: grupos A/B de cuatro y C/D de tres; dos primeros de cada grupo a cuartos. F8: tabla general de diez equipos, fase eliminatoria de cinco partidos, cinco ganadores y tres mejores perdedores a cuartos. Los desempates siguen el orden del documento: enfrentamiento directo, juego limpio, diferencia, goles anotados, goles recibidos y sorteo. El sorteo final, cuando todos los criterios empaten, requiere una decisión manual en los JSON.

Algunos partidos F9 cruzan equipos de los grupos C y D; sus resultados cuentan para cada equipo en su respectiva tabla de grupo. Para que las posiciones sean correctas, asigna primero todos los equipos en `groups.json`.

**Advertencia del documento:** los cuartos de F9 del viernes contienen 9:20 y 10:40 marcados como “P.M.” entre los horarios de 8:00 A.M. y 12:00 P.M. Se interpretaron como horarios matutinos por secuencia; verificar con la organización. El PDF también programa semifinales F9 y F8 en las mismas horas y finales en las mismas horas, sin especificar canchas. No se han inventado sedes.
