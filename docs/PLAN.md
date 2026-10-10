# Umsetzungsplan: Worms-Klon mit Phaser 3 („WurmRumble“)

> Reine Planung – es wird **kein Code implementiert**. Technische Details/Begründungen: [RESEARCH.md](RESEARCH.md)
> Fokus laut Auftrag: **herausragende Grafik** und **Benutzerfreundlichkeit**.

---

## 1. Produktvision & Scope

**Ein-Satz-Ziel:** Ein rundenbasiertes Artillery-Spiel im Worms-Stil, lokal im Browser (Desktop zuerst, Touch als Stretch), mit butterweichen 60 FPS, sattem Cartoon-Look und einer Steuerung, die ohne Anleitung in 30 Sekunden begriffen ist.

**MVP (muss rein):**
- 1 Karte, 2 Teams à 2–4 Würmer, Hotseat
- Bazooka + Granate + Schlagstock (3 Waffen reichen fürs MVP)
- Zerstörbares Terrain mit sauberer Physik & Explosionen
- Runden-Timer, HP, Tod/Fallen/Ertrinken, Sieg-Bildschirm
- Kamera-Follow, Trajektorien-Vorschau, HUD mit allen Infos

**Stretch (danach):** Wind, Ninja Rope, weitere Waffen (Flammenwerfer, Luftschlag), Map-Editor/Generierung, CPU-Gegner, Sound-Mixer, Tag/Night, Online (bewusst: kein Netcode im MVP).

**Nicht-Ziele:** Kampagne/Story, Mobil-native Build, Monetarisierung, proprietäre Worms-Assets (Urheberrecht!).

---

## 2. Architektur (Entwurfsentscheidungen)

### 2.1 Tech-Stack
- `phaser@^3.90.0` (verifiziert letzte 3.x; Phaser 4 = 4.2.1, bewusst übersprungen)
- Vite 6 + TypeScript 5.7 (bereits im Repo vorhanden), strict mode an
- Renderer-Entscheidung: Start mit **WebGL**, Terrain-Kollision über eigenen Bitmap-Buffer (GPU wird nie gelesen); Fallback `Phaser.CANVAS` nur aktivieren, falls Partikel-/FX-Performance oder RT-Pixelzugriff es verlangt → Entscheidung offen lassen hinter Config-Flag `TERRAIN_RENDERER_MODE`.

### 2.2 Szenen
| Szene | Aufgabe |
|---|---|
| `BootScene` | Assets laden/prozedural generieren, Texturen & Anims anlegen |
| `MenuScene` | Hauptmenü, Team-/Spieler-Setup, Optionen (Grafik, Sound, A11y) |
| `GameScene` | Gameplay: Terrain, Würmer, Projektile, TurnManager |
| `UIScene` | Overlay: HUD, Timer, Waffenrad, Damage-Numbers, Minimap; bekommt Events via EventEmitter |

### 2.3 Module in `GameScene` (Klassen, lose gekoppelt über Events)
```
TerrainModel   Uint8Array-Bitmap + Heightmap-Cache + API: isSolid(x,y), dig(mask), sampleLine()
TerrainView    RenderTexture/CanvasTexture, zeichnet Model, Scorch-Layer
Worm           Position/HP/Team, Foot-Sensor, Movement, Aim, State-Machine pro Zug
Projectile     eigene Integration (g+wind), Raycast gegen TerrainModel, Types: Rocket/Grenade/Stick
Explosion      Krater-Masken, Schaden(dist), Impulse, Partikel/Sound/Shake auslösen
TurnManager    Round-Robin, Timer, Zustandsmaschine IDLE→MOVE→AIM→FIRE→RESOLVE→NEXT
CameraDirector Follow-Pan, Projectile-Tracking, Shake/Zoom
InputMapper    Tastatur/Maus/Touch → semantische Aktionen (remappable!)
FxDirector     PostFX, Hit-Stop, Damage-Numbers, Screenflash
```

### 2.4 Ordnerstruktur (geplant)
```
src/game/
  main.ts            # Phaser.Game Instanz + Config
  scenes/            # Boot/Menu/Game/UI
  systems/           # TerrainModel, TerrainView, TurnManager, ...
  entities/          # Worm, Projectile, Weapon defs
  fx/                # ParticlePresets, CameraDirector, FxDirector
  data/              # weapons.json, maps/*.json, theme.ts (Farben/Fonts)
public/assets/       # sprites, audio, fonts (CC0/Lizenzdokumentation!)
```

---

## 3. Grafik-Konzept (Schwerpunkt 1)

### 3.1 Art Direction
- Look: „polierter Cartoon“ — gesättigte Palette, weiche Schatten, dicker Outline bei Würfeln/Würmern.
- Teamfarben farbschwächentauglich: Blau / Orange / Violett / Gelb.
- Vorbilder für Mood: Worms W.M.D-Auflösung, Hand-Drawn-Joy of Vector-Art.

### 3.2 Bildschirmaufbau (Layer von hinten nach vorn)
1. Himmel-Gradient + Sonne/Mond (Tag/Night später)
2. Wolken-Ebene (Parallax 0.2, driftend)
3. Ferne Berge (Parallax 0.4, Silhouette mit Dunst-Tint)
4. Terrain (Scroll 1.0) + Scorch-Layer + Gras-Saum
5. Entitäten (Würmer, Projektile, Kisten)
6. Wasserlinie (animiertes Shader-/Tile-Wasser mit Spiegel-Glow)
7. Partikel/Explosionen (additive Blending)
8. FX-Postprocessing: dezenter Vignette-Glow auf Einschläge
9. UIScene-HUD (skaliert, camera-fixed)

### 3.3 Terrain-Rendering im Detail
- Basis: Erdtextur prozedural (Noise + 3 Brauntöne), Grasrand 3 px (hell/dunkel), Kantenschummerierung über Höhenkanten.
- Krater: dunkler Scorch-Ring (eigene Ebene, multiplikativ), Erdkrümel-Partikel fliegen raus und bleiben liegen (optional „Debris“-Layer).
- Auflösung: Welt 1600×900 px, Terrain-Buffer 1:1; bei Low-End-GPUs Flag auf halbe Bufferauflösung.

### 3.4 Animations-Liste (Spritesheets, je ~6–8 Frames)
idle (Atmen), walk, fall, jump, aim (Waffe heben), fire (Recoil), dig, hit/flinch, death (Wirbel), drown (Plätschern).

### 3.5 Abnahmekriterien „gute Grafik“
- Konstant 60 FPS auf Mittelklasse-Laptop (Chrome, WebGL aktiv).
- Jede Explosion hat ≥3 simultane Feedback-Kanäle (Bild, Partikel, Sound, Shake).
- Alle Texte jederzeit kontrastreich lesbar (Outline + Shadow, Kontrastcheck ≥ 4.5:1).
- Screenshot des Spiels sieht „wie ein Spiel“ aus, nicht wie eine Programmierübung.

---

## 4. UX-Konzept (Schwerpunkt 2)

### 4.1 Steuerungsmodell (Primär Maus/Tastatur)
- **Zielen:** Winkel folgt der Maus relativ zum Wurm; Feinjustierung ←/→; Power: Gedrückthalten der linken Maustaste füllt Balken (oszillierend 0–100 %, loslassen = feuern) ODER Klick auf Power-Slider.
- **Bewegen:** A/D bzw. ←/→ innerhalb der Move-Phase; Leertaste = Springen; Shift+B = Boxen graben? (später).
- **Waffen:** Zahlen 1–9, Q/E Blättern, Tab öffnet Waffenrad (Maus-klickbar).
- **Menü:** P pausiert, H Hilfe-Overlay, M mute, Esc geht zurück.

### 4.2 Touch-Konzept (Sekundär, aber von Anfang an mitdenken)
- Schleuder-Geste: vom Wurm ziehen (wie Angry Birds), Vektor = Winkel+Power, loslassen = Schuss.
- Linke untere Ecke: D-Pad-Buttons (≥48 px), rechte untere Ecke: Waffen-Icon öffnet Rad.

### 4.3 Informationsdesign (HUD)
- Immer sichtbar: aktives Team + Name, Runden-Timer (Ring/Balken), Wind (nur wenn aktiv), verbleibende Zeit als Zahl.
- Über jedem Wurm: Nametag + HP-Balken (bei fremden Würmern kleiner, blendet auf bei Hover/Aktion).
- Beim Zielen: eingeblendete Flugvorhersage (Punkte) + Impact-Kreis + Risikoring (Selbstschaden).
- Nach Treffer: Damage-Number floatet, HP-Balken animiert, Kill ⇒ Grabstein-Animation + „Ouch!“-Speechbubble.

### 4.4 Onboarding & Fehlertoleranz
- Erststart: interaktives Tutorial (3 Schritte, überspringbar, <60 s).
- Bestätigungsdialog bei Selbstgefährdung („Du könntest dich selbst treffen – feuern?“) – abschaltbar für Profis.
- Undo gibt es nicht (Genre), dafür klare Vorhersage-Tools.
- Shortcuts-Overlay jederzeit per H; alle Bindings remappbar.

### 4.5 Barrierefreiheit
- Reduzierte Effekte-Option (Shake ↓, Flash aus, Partikel ↓) — Epilepsie-Prävention.
- Farbfehlsichtigkeits-Paletten-Switch, skalierbare UI-Schrift (100/125/150 %).
- Vollständig tastenspielbar (Fokus-Indikatoren im Menü).

### 4.6 Abnahmekriterien „Benutzerfreundlichkeit“
- Eine Person ohne Genre-Kenntnis trifft im Tutorial den ersten Schuss.
- Kein Zustand, in dem der Spieler nicht weiß, was gerade klickbar/tätig ist (deutlicher „Wer ist dran?“-Marker).
- Roundtrip Zeit pro Zug ≤ 30 s inkl. Warten; alles Wichtige ohne Menü erreichbar.

---

## 5. Meilensteine (mit Demo & Abnahmetest)

| MS | Inhalt | Abnahme („ playable slice“) | Geschätzt |
|---|---|---|---|
| **M0 Setup** | `npm i phaser@^3.90.0`, TS-Config, leere GameScene neben React-Seite (`/game.html` Route oder separate App-Instanz), Dev-Flag | Phaser läuft, 60 FPS, HMR ok | 0,5 Tag |
| **M1 Terrain-Kern** | TerrainModel (Bitmap+Heightmap), prozedurale Generierung (Noise), Rendering als Textur, `dig()` mit Maske, Unit-Tests für dig/isSolid/sampleLine | Löcher stanzen per Mausklick, visuell sauber | 2 Tage |
| **M2 Wurm & Bewegung** | Worm-Entity, Fußsensor, Gehen/Springen/Fall/Fallschaden, Kamera-Follow, 1 Wurm steuerbar | Wurm läuft Klippen hoch/runter, fällt, nimmt Fallschaden | 2 Tage |
| **M3 Projektile & Explosion** | Bazooka+Granate, eigene Flugintegration, Raycast-Impact, Explosion→TerrainModel+View synchron, Rückstoß, Wasser/Tod | Zwei Würmer beschießen sich bis zum Tod, Terrain zerstört korrekt | 2–3 Tage |
| **M4 Rundenlogik & HUD** | TurnManager-StateMachine, Timer, UIScene, Damage-Numbers, Win-Screen, Hotseat-Setup-Menü | Komplette Partie 2v2 spielbar inkl. Sieger | 2 Tage |
| **M5 Grafik-Polish** ★ | Parallax-Ebenen, Scorch-Layer, Partikel-Presets, PostFX(Glow/Vignette), Animationen, Hit-Stop, Sound (SFX+Musik-Loop), Tag/Night optional | Screenshot-Vergleich gegen Referenz; 60 FPS gehalten | 3 Tage |
| **M6 UX-Polish** ★ | Trajektorien-Vorschau, Impact-/Risikoring, Tutorial, A11y-Optionen, Input-Mapping, Touch-Pfad, Hilfe-Overlay | Usability-Test mit 2 Testern (Think-Aloud) | 2–3 Tage |
| **M7 Stretch** | Wind, Ninja Rope, Luftschlag/Flammenwerfer, Map-Varianten, CPU-KI (einfache Heuristik), Settings persistieren (localStorage) | — | fortlaufend |

Reihenfolge-Prinzip: erst das **Terrain als Fundament** (alles hängt daran), dann Spielbarkeit, dann Grafik/UX-Schwerpunkte explizit als eigene Meilensteine mit Abnahmekriterien.

---

## 6. Risiken & Gegenmaßnahmen

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| WebGL-Pixelzugriff zu langsam | Klemmen bei Explosionen | Design regelt das schon: Logik liest nur CPU-Buffer; GPU nur Display |
| Terrain-Desync (RT ≠ Bitmap) | Geisterlöcher/unsichtbare Böden |Eine einzige autoritative Quelle (Model), View wird immer aus Model redrawn (dirty rects) |
| Matter.js vs. Custom-Kollision Doppelphysik | Bugs, doppelte Kollisionen | Klar: Terrain/Würmer/Projektile = Custom; Matter nur Seil/Kisten (oder ganz weg) |
| Scope-Explosion Waffen/Netcode | Nie fertig | MVP = 3 Waffen, kein Netcode; Stretchliste einfrieren |
| Asset-Lizenzen | Release-Blocker | CC0-only-Liste führen; jsfxr-generierte SFX als Fallback |
| Performance auf Intel-IGP | Ruckler | Budgets definieren (≤800 Partikel, dirty-region-redraw), Canary-FPS-Overlay im Dev-Modus |
| Touch-UX scheitert an Precision | Mobile unspielbar | Schleuder-Geste mit Auto-Aim-Assist (Winkel snap an Surface-Normalen) |

---

## 7. Teststrategie (Plan, noch keine Tests geschrieben)

- **Unit (Vitest):** TerrainModel dig/isSolid/sampleLine/Heightmap-Refresh; Schadensformel; TurnManager-Übergänge.
- **Integration/Manuell:** Checklisten pro Meilenstein (siehe Spalte „Abnahme“), Edge Cases: Explosion am Rande, Wurm im Wasser, Timer=0 während Flug, zwei Explosionen gleiche Frame.
- **Perf:** Chrome-Performance-Profil nach M5, Ziel ≥ 58 FPS average auf 1280×720.
- **Usability:** 2 externe Tester, Aufgaben: „Töte einen Gegner mit der Bazooka“, Beobachtung: Zeitaufwand, Irritationen.

---

## 8. Offene Entscheidungen (bitte bestätigen/wählen)

1. **Name & Look-Richtung:** Cartoon-Vektor (empfohlen, MVP-tauglich) vs. detaillierte Sprites (schöner, teurer)?
2. **Renderer:** WebGL-first mit Buffer-Logik (empfohlen) oder gleich Canvas erzwingen (einfacher, weniger FX)?
3. **Matter.js überhaupt nutzen?** Nur für Ninja Rope/Kisten (empfohlen) oder komplett Custom?
4. **Sprache der In-Game-Texte:** Deutsch, Englisch, beides (i18n ab Werk)?
5. **React-Doku-Seite behalten?** Spiel als eigener Entry Point (`/game`) empfohlen, Doku bleibt erhalten.
6. **Zielplattform-Reihenfolge:** Desktop zuerst (empfohlen), Touch in M6.

→ Nach Bestätigung dieser Punkte kann direkt mit **M0 + M1** begonnen werden.
