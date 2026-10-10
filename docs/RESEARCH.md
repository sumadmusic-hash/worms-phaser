# Recherche: Worms-Klon mit Phaser 3

> Stand: 2026-10-10 · Versionen per `npm view` verifiziert.
> Zweck: Technische Grundlagen für die Umsetzung (siehe [PLAN.md](PLAN.md)).

---

## 1. Engine-Wahl: Phaser 3.x, nicht Phaser 4

| Paket | Version (verifiziert via npm) | Hinweis |
|---|---|---|
| `phaser` (latest) | **4.2.1** | Phaser 4 ist fertig, aber API teils neu und ärmer dokumentiert; viele Tutorials/Beispiele beziehen sich auf 3.x |
| `phaser` (v3-Zweig) | **3.90.0** (letzte 3.x) | **Empfehlung:** ausgereift, riesige Community, alle Beispiele passen |
| `matter-js` | 0.20.0 | In Phaser 3.90 integriert (`this.matter`) |

**Entscheidung:** `npm i phaser@^3.90.0`. TypeScript-Typen sind im Paket enthalten, kein separates `@types/paket` nötig.

```js
// vite-Einstieg – Phaser kommt als gebündeltes ES-Modul
import Phaser from 'phaser'
```

Weitere relevante Fakten:
- Renderer: WebGL primär, automatischer Canvas-Fallback. Für unser Terrain ist der **Canvas-Fallback relevant** (Pixelzugriff, s. u.).
- `RenderTexture` hat in 3.90 eine **eingebaute Kollisionsunterstützung** (`setCollisionAlpha`, `setCollisionRecommendation`) – dazu unten kritisch.
- Partikel: `this.add.particles(x, y, texture, config)` (neuerer Parser ab 3.60).
- Sound: WebAudio + Howler-Fallback; Audio-Sprites für Waffensounds.

---

## 2. Kernproblem Nr. 1: Zerstörbares Terrain

### 2.1 Datenmodell „Dual Buffer“ (bewährter Standardansatz)

Das Terrain existiert **zweimal, synchron gehalten**:

1. **Visuell:** `Phaser.GameObjects.RenderTexture` (bzw. `CanvasTexture`), gezeichnet mit Gras-/Erdtextur.
2. **Logik:** ein `Uint8Array(width * height)` als binäre Belegungskarte (1 = Land, 0 = Luft) – zusätzlich `Int16Array`-Heightmap pro Spalte für schnelle „Oberflächen-Y“-Lookups.

Vorteile: pixelgenaue Zerstörung, O(1)-Abfragen („Steht hier Boden?“), kleiner Speicher (1600×1000 px ≈ 1,6 MB Buffer).

### 2.2 Zerstörung stanzen

Zwei gleichwertige Wege:

```js
// Weg A: RenderTexture.erase (nutzt intern destination-out)
terrainRT.erase(circleBrushKey, cx - r, cy - r)

// Weg B: direkter 2D-Context (nur bei CanvasRenderer/CanvasTexture)
ctx.globalCompositeOperation = 'destination-out'
ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
ctx.globalCompositeOperation = 'source-over'
```

Parallel dazu im Logik-Buffer: jeden Pixel im Umkreis `r` auf 0 setzen
(`dx*dx + dy*dy <= r*r` ohne Wurzel; unregelmäßige Krater über Masken-Brush aus PNG/JSON).

**Wichtig:** Nach jeder Explosion müssen **Höhen-Cache (Spalten-Oberfläche)** und ggf. Kollisionsrepräsentation aktualisiert werden → Dirty-Region beschränkt auf BBox `cx±r, cy±r`.

### 2.3 Randproblem WebGL: `readPixels` ist langsam

Unter dem WebGL-Renderer ist das Lesen von Pixeln aus einer RenderTexture teuer
(GPU→CPU-Sync ⇒ Frame-Drops). Optionen:

| Option | Bewertung |
|---|---|
| Zerstörungs-/Kollisionslogik **nie** aus der GPU lesen, sondern immer aus dem eigenen `Uint8Array` | ✅ empfohlen – GPU nur zum Anzeigen |
| `type: Phaser.CANVAS` erzwingen | einfachste Lösung, 60 FPS bei 1600×1000 problemlos; verliert WebGL-Partikel-Performance & Shader |
| kleine Terrain-RT (halbe Auflösung, hochskaliert) | Retro-Look + weniger Pixelspeicher |

**Fazit:** Autoritative Quelle = eigener Bitmap-Buffer; Rendering = RT/Textur. Damit ist WebGL vs. Canvas für die Korrektheit egal. Wollen wir Phasers eingebaute RT-Kollision nutzen, brauchen wir den Canvas-Renderer oder einen einmaligen `getImageData`-Sync nach Explosionen.

### 2.4 Kollision Projektil ↔ Terrain

Projektile bewegen sich schnell (Tunneling-Gefahr). Standardlösung: **Raycast über den Bitmap-Buffer** (DDA):

```js
// Segment (prevX,prevY) → (x,y), Schritt ~1 px; erster Treffer == Land ⇒ Impact
const hit = terrain.sampleLine(prevX, prevY, x, y)
if (hit) projectile.explode(hit.x, hit.y)
```

Zusätzlich: Wasserlinie (`y > waterLevel` ⇒ Ertrinken), Map-Ränder, Treffer zwischen Würmern.

### 2.5 Alternative Ansätze (für Vollständigkeit)

- **Marching Squares → Polygon → Matter.Body:** klassischer Weg, „echte“ Reibung/Hängewinkel; aber Body-Regeneration nach jeder Explosion ist fehleranfällig (Concave-Polygone, Clipping bei kleinen Löchern) → **nicht als MVP**.
- **Matter.js statische Zellen-Bodies (Grid 8–16 px):** gut kombinierbar; nur betroffene Zellen beim Zerstören entfernen. Kanten treppig → visuell egal (Terrain zeichnet separat), physikalisch ok.
- **Beliebter Hybrid (unsere Wahl):** Würmer & Projektile machen Custom-Kollision gegen den Bitmap (eigene Velocity-Integration für Projektile statt Matter), während Ninja Rope / fallende Kisten / Wind mit Matter-Constraints laufen. Weniger „Engine-gegen-Engine“-Kämpfe.

### 2.6 Wurm-Stand-/Bewegungslogik auf Bitmap-Terrain

- Fußsensor prüft Buffer unter linker/rechter Körperkante.
- Steigung: max. begehbare Flanke ~45°; sonst entlang der Normalen abrutschen.
- Gehen = Geschwindigkeitsvektor + Snap auf Oberfläche; Springen = Impuls; Fallen = Aufprallgeschwindigkeit > Schwelle ⇒ Fallschaden.

---

## 3. Physik: Was braucht man wirklich?

| Entität | Ansatz | Begründung |
|---|---|---|
| Projektile (Bazooka, Granate, …) | eigene Integration: `v += g*dt (+ wind*dt)`, Raycast-Kollision | exakt berechenbar → Trajektorien-Vorschau trivial, kein Tunneling, deterministisch |
| Würmer | kinematischer Körper (Kreis/AABB) + Bitmap-Kollision | präzises Platforming wichtiger als Realphysik |
| Ninja Rope | Matter.js `Constraint` (pointA statisch, pointB Wurm) oder eigene Pendel-Simulation | genau der Use-Case von Matter |
| Wind | globaler Vektor, sichtbar im HUD, Einfluss auf Flugbahnen | einfach |
| Explosions-Rückstoß | Impuls auf Wurm-Körper | — |

Konfiguration falls Matter genutzt wird:

```js
physics: {
  default: 'matter',
  matter: { gravity: { y: 1 }, debug: false }
}
```

---

## 4. Grafik-Qualität („wichtig!“)

### 4.1 Stil-Entscheidung

1. **Vektor-/Cartoon-Look mit Graphics + PostFX** (Empfehlung für MVP):
   - Terrain: Erd-Ton mit Rauschen, Grasrand (2–3 px heller/dunkler Saum), Schattierung über Höhenkanten-Normalen.
   - Würmer: animierte Sprites (idle/walk/dig/fall) – selbst gezeichnet (Aseprite/Inkscape→PNG) oder CC0-Packs.
   - Vorteil: fast alles generativ erzeugbar → keine Asset-Blocker.
2. **Handgezeichnete Sprite-Assets (Worms-Artstyle):** schöner, aber Asset-Aufwand & Lizenzprüfung.

### 4.2 Konkrete Technik-Liste für „gute Grafik“

- **Parallax-Hintergrund:** 3 Ebenen (Himmel/Wolken, ferne Berge, Vordergrund-Büsche) als TileSprites mit Kamera-Scroll-Kopplung; Wolken sanft driftend.
- **Stimmung/Beleuchtung:** Tag/Night-Tint via Overlay-Rectangle oder `camera.tint`; Phaser-3.90-`FX`-PostFX (`Glow`, `Shadow`, `Vignette`, `Pixelate`, `Displacement`, `Barrel`) für Glow um Einschläge und weichen Film-Look.
- **Partikel:** Explosionsblitz (additiver Glow), Rauchschwaden, Erdkrümel (Gravity-Particle mit Terrain-Bounce), Funkenregen, Water Splash, Damage-Numbers als Tween-Text.
- **Wucht-Gefühl:** `cameras.main.shake(dauer, intensität)` + kurzer Hit-Stop (timeScale-Puls).
- **Krater-Detail:** zweiter „Scorch“-Pass (größerer Radius, eigene RT, multiplikativ dunkel getintet) → frischer Einschlag sieht mannschaftsgemacht aus.
- **Animation/Micro-Feedback:** Team-Pips wippen, aktiver Wurm mit blinkendem Pfeil, Zielkreuz atmet.
- **Fonts:** Outline-Text für Lesbarkeit auf jedem Hintergrund; optional Pixel-Font (Lizenz prüfen).
- **Auflösung/Scaling:** Welt z. B. 1600×900, Viewport 1280×720, `scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }` → auf jedem Display knackig; `render: { antialias: true }` (oder `pixelArt: true` für Retro).

### 4.3 Assets & Lizenzen

- Keine proprietären Worms-Assets kopieren (Grafik/Name © Team17). Eigener Name (z. B. „WurmRumble“), eigener Artstyle.
- Quellen: Kenney.nl (CC0), itch.io-Free-Packs (Lizenz prüfen), OpenGameArt, eigene PNGs.
- Audio: Freesound (CC0-Filter), jsfxr/sfxr für generierte Retro-SFX → 0 Lizenzrisiko fürs MVP.

---

## 5. Benutzerfreundlichkeit (UX)

### 5.1 Input-Matrix

| Aktion | Maus/Tastatur (Primär) | Touch (Sekundär) |
|---|---|---|
| Zielen | Winkel via Maussteuerung + Powerleiste (gedrückthalten) | Drag-Geste vom Wurm weg (Schleuder-Prinzip) |
| Feuern | Linksklick / Leertaste | Loslassen |
| Bewegen | A/D oder ←/→ | Buttons linke Bildschirmhälfte |
| Waffenwahl | Q/E oder Zahlen 1–9, Tab = Menü | HUD-Icons ≥ 48 px Tap-Target |
| Menü | Tastatur + Klick | — |

### 5.2 UX-Prinzipien für dieses Genre

1. **Trajektorien-Vorschau** (gestrichelte Punkte, erste ~25 % des Flugs) – lehrt die Physik in 10 Sekunden.
2. **Impact-Vorhersage-Kreis** am Terrain (wo explodiert es?).
3. **Fairer Timer:** Rundenzeit als klarer Balken, letzte 5 s rot pulsierend, Auto-End nur mit Vorwarnung/Piepton.
4. **Selbstschaden transparent:** Selbsterexplosionsradius einblenden, Bestätigung bei riskanten Waffen.
5. **Immer lesbar:** Nametag + HP-Pips über jedem Wurm; aktiver Wurm mit blinkendem Marker; Kamera pans sanft (~0,8 s Ease) statt Sprung.
6. **Barrierefreiheit:** farbschwächentaugliche Teamfarben (Blau/Orange statt Rot/Grün), Tastatur-Remapping, Textskalierung, Screen-Shake reduzierbar, Flash-Warnung.
7. **Onboarding:** interaktives Mini-Tutorial (Ziehen → Loslassen → Treffer); Shortcuts-Overlay über Taste `H`.
8. **Kompletter Feedback-Loop:** Treffer = Zahl + Sound + Shake + Partikel + Freeze-Frame. Nichts passiert lautlos.

---

## 6. Referenz-Projekte / Studienmaterial

- Phaser-Examples-Repo (`photonstorm/phaser3-examples`) → Kategorien *RenderTexture*, *MatterJS*, *Particles*, *FX*.
- Offizielle Docs: `phaser.io/docs/3.90.0` → `Phaser.GameObjects.RenderTexture`, `Phaser.Physics.Matter`, `Phaser.GameObjects.FX.*`.
- Open-Source-Worms-Klons als Architektur-Spickzettel (Technik studieren, Code/Lizenzen beachten): Hedgewars (GPL), diverse Phaser-3-Worms-Demos auf GitHub/CodePen.
- Algorithmen: Marching Squares (falls Polygon-Kollision), DDA-Raycasting, Value-/Simplex-Noise für Terrain-Generierung.

---

## 7. Verifizierte Umgebung & nächste Schritte

- Node v20.20.2, npm 10.8.2 vorhanden; Vite 6 + TS 5.7 bereits im Projekt → ideal für `npm i phaser@^3.90.0`.
- Aktuelles Projekt ist eine React-Dokumentationsseite; die Phaser-Implementierung wird eine eigene App-Instanz/eigenes Szenario (Meilensteine in PLAN.md).

→ **Umsetzungsplan, Meilensteine, Risiko- und Teststrategie: [docs/PLAN.md](docs/PLAN.md)**
