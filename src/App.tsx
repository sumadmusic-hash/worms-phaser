import { useState } from 'react'

type Section = 'terrain' | 'physics' | 'game-logic' | 'architecture' | 'graphics' | 'ux' | 'roadmap'

function App() {
  const [activeSection, setActiveSection] = useState<Section>('terrain')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Header */}
      <header className="border-b border-green-500/30 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="text-3xl">🐛💣</div>
          <div>
            <h1 className="text-xl font-bold text-green-400">Phaser 3 × Worms-Klon</h1>
            <p className="text-xs text-gray-500">Architektur-Bestätigung & Lösungsansätze</p>
          </div>
          <div className="ml-auto px-3 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs">
            ✓ READY
          </div>
        </div>
      </header>

      {/* Status Banner */}
      <div className="bg-green-500/5 border-b border-green-500/20">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <p className="text-sm text-green-300">
            <span className="font-bold text-green-400">STATUS:</span> Vertiefte Recherche &amp; Planung abgeschlossen
            (Phaser 3.90.0 verifiziert · Details in{' '}
            <a href="/docs/PLAN.md" target="_blank" rel="noreferrer" className="underline decoration-green-500/50 hover:text-green-200">docs/PLAN.md</a>
            {' '}&amp;{' '}
            <a href="/docs/RESEARCH.md" target="_blank" rel="noreferrer" className="underline decoration-green-500/50 hover:text-green-200">docs/RESEARCH.md</a>).
            Fokus dieser Runde: <span className="text-green-400 font-semibold">Grafik-Konzept</span> und{' '}
            <span className="text-green-400 font-semibold">Benutzerfreundlichkeit</span>. Noch kein Spiel-Code — bereit für Freigabe der Meilensteine M0/M1.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'terrain' as Section, label: '🏔️ Zerstörbares Terrain', color: 'amber' },
            { id: 'physics' as Section, label: '⚙️ Matter.js Physik', color: 'blue' },
            { id: 'game-logic' as Section, label: '🎮 Spiel-Logik & Kamera', color: 'purple' },
            { id: 'architecture' as Section, label: '🏗️ Gesamtarchitektur', color: 'green' },
            { id: 'graphics' as Section, label: '🎨 Grafik-Konzept', color: 'rose' },
            { id: 'ux' as Section, label: '🧭 UX & Bedienbarkeit', color: 'cyan' },
            { id: 'roadmap' as Section, label: '🗺️ Roadmap & Risiken', color: 'lime' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all border ${
                activeSection === tab.id
                  ? `bg-${tab.color}-500/20 border-${tab.color}-500/50 text-${tab.color}-300`
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
              style={activeSection === tab.id ? {
                backgroundColor: tab.color === 'amber' ? 'rgba(245,158,11,0.15)' :
                  tab.color === 'blue' ? 'rgba(59,130,246,0.15)' :
                  tab.color === 'purple' ? 'rgba(168,85,247,0.15)' :
                  tab.color === 'rose' ? 'rgba(244,63,94,0.15)' :
                  tab.color === 'cyan' ? 'rgba(6,182,212,0.15)' :
                  tab.color === 'lime' ? 'rgba(132,204,22,0.15)' :
                  'rgba(34,197,94,0.15)',
                borderColor: tab.color === 'amber' ? 'rgba(245,158,11,0.5)' :
                  tab.color === 'blue' ? 'rgba(59,130,246,0.5)' :
                  tab.color === 'purple' ? 'rgba(168,85,247,0.5)' :
                  tab.color === 'rose' ? 'rgba(244,63,94,0.5)' :
                  tab.color === 'cyan' ? 'rgba(6,182,212,0.5)' :
                  tab.color === 'lime' ? 'rgba(132,204,22,0.5)' :
                  'rgba(34,197,94,0.5)',
                color: tab.color === 'amber' ? '#fbbf24' :
                  tab.color === 'blue' ? '#93c5fd' :
                  tab.color === 'purple' ? '#c084fc' :
                  tab.color === 'rose' ? '#fda4af' :
                  tab.color === 'cyan' ? '#67e8f9' :
                  tab.color === 'lime' ? '#bef264' :
                  '#86efac',
              } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeSection === 'terrain' && <TerrainSection />}
        {activeSection === 'physics' && <PhysicsSection />}
        {activeSection === 'game-logic' && <GameLogicSection />}
        {activeSection === 'architecture' && <ArchitectureSection />}
        {activeSection === 'graphics' && <GraphicsSection />}
        {activeSection === 'ux' && <UXSection />}
        {activeSection === 'roadmap' && <RoadmapSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-gray-500 text-sm">
            🟢 Ich bin bereit für deine ersten Programmierbefehle.
          </p>
        </div>
      </footer>
    </div>
  )
}

function TerrainSection() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="🏔️ Zerstörbares Terrain & Kollisionsabfrage" 
        subtitle="Der Kern jedes Worms-Klons — mein Lösungsansatz"
        color="amber"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Schritt 1: Terrain als Bitmap" color="amber">
          <p>Das Terrain wird als <code className="text-amber-300">Phaser.GameObjects.RenderTexture</code> erstellt. 
          Dies ist im Grunde ein HTML5 Canvas, auf den wir pixelgenau zeichnen können.</p>
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            <li>• Initial: Landschaft per Noise/Heightmap auf die RenderTexture malen</li>
            <li>• Jedes Pixel hat RGBA-Werte → Alpha = "existiert das Terrain hier?"</li>
            <li>• Wir speichern das Terrain-Bild als <code className="text-amber-300">Uint8Array</code> im RAM</li>
          </ul>
        </Card>

        <Card title="Schritt 2: Explosion = Loch stanzen" color="amber">
          <p>Bei einer Explosion nutzen wir <code className="text-amber-300">globalCompositeOperation = 'destination-out'</code>:</p>
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            <li>• Kreisförmige Maske auf die RenderTexture anwenden</li>
            <li>• <code className="text-amber-300">renderTexture.erase(brush, x, y)</code> oder direkt Canvas-Context</li>
            <li>• Ergebnis: Pixel werden transparent → visuelles Loch</li>
            <li>• Radius abhängig von Waffentyp (Bazooka = groß, Granate = mittel)</li>
          </ul>
        </Card>

        <Card title="Schritt 3: Physik-Körper regenerieren" color="amber">
          <p>Das ist die <span className="text-amber-300 font-bold">kritische Herausforderung</span>. Matter.js kennt nur geometrische Formen — nicht pixelbasierte.</p>
          <div className="mt-3 space-y-2 text-sm text-gray-400">
            <p className="text-amber-200 font-semibold">Mein Ansatz: Hybrid-System</p>
            <ul className="space-y-1">
              <li>• <strong>Option A (empfohlen):</strong> Terrain-Kollision via Pixel-Abfrage. 
                Wir prüfen für Projektile/Würmer direkt im Bitmap: 
                <code className="text-amber-300 ml-1">getPixel(x, y).alpha &gt; 0</code></li>
              <li>• <strong>Option B:</strong> Marching Squares Algorithmus extrahiert Konturen aus dem Bitmap 
                → erzeugt Matter.js-Bodies dynamisch neu nach jeder Explosion</li>
              <li>• <strong>Option C (hybrid):</strong> Terrain-Grid in Zellen (z.B. 16×16 px) unterteilen. 
                Jede Zelle hat einen simplen Physics-Body. Bei Explosion: betroffene Zellen deaktivieren.</li>
            </ul>
          </div>
        </Card>

        <Card title="Schritt 4: Kollisionsabfrage optimieren" color="amber">
          <p>Für performante Kollisionen implementiere ich:</p>
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            <li>• <code className="text-amber-300">TerrainCollider</code> Klasse — prüft AABB gegen Bitmap</li>
            <li>• Nur relevante Region scannen (nicht gesamtes Bitmap)</li>
            <li>• Für Würmer: "Fuß-Sensor" — prüft Pixel unter den Füßen für Bodenhaftung</li>
            <li>• Für Projektile: Raycast vom letzten zur aktuellen Position</li>
            <li>• <code className="text-amber-300">Float32Array</code> als Heightmap-Cache für schnelle Y-Lookups</li>
          </ul>
        </Card>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
        <h3 className="text-amber-300 font-bold mb-3">💡 Finale Architektur-Entscheidung</h3>
        <p className="text-sm text-gray-300">
          Ich werde einen <strong className="text-amber-200">Pixel-basierten Kollisionsansatz</strong> wählen, 
          kombiniert mit einem <strong className="text-amber-200">Grid-System</strong> für die Physik. 
          Das Terrain existiert als RenderTexture (visuell) UND als separater Uint8Array-Buffer (Kollision). 
          Bei Explosionen werden BEIDE synchron gelöscht. Matter.js wird NUR für Würmer, Projektile und Seile 
          verwendet — das Terrain selbst wird über Custom-Collision-Callbacks behandelt. 
          Das ist performanter als dynamische Body-Regeneration und gibt uns pixelgenaue Kontrolle.
        </p>
      </div>
    </div>
  )
}

function PhysicsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="⚙️ Matter.js Integration in Phaser 3" 
        subtitle="Physik-Engine für Würmer, Projektile und das Ninja-Seil"
        color="blue"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Matter.js Setup in Phaser" color="blue">
          <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto text-blue-300">{`// Phaser Config
physics: {
  default: 'matter',
  matter: {
    gravity: { x: 0, y: 1.5 },
    // Wind als variable Kraft
  }
}

// Wind simulieren:
this.matter.world.on('beforeupdate', () => {
  const wind = { x: windStrength, y: 0 };
  allBodies.forEach(b => 
    b.force.x += wind.x * b.mass
  );
});`}</pre>
        </Card>

        <Card title="Projektil-Physik" color="blue">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• <strong className="text-blue-300">Bazooka:</strong> Matter.Body mit restitution=0.3 (prallt ab)</li>
            <li>• <strong className="text-blue-300">Granate:</strong> Timer-basiert, explode nach 3s</li>
            <li>• <strong className="text-blue-300">Schlagstock:</strong> Kurze Reichweite, hoher Schaden</li>
            <li>• Flugbahn: Matter.js berechnet automatisch (Gravity + Drag + Wind)</li>
            <li>• Kollision mit Terrain → Custom-Callback prüft Bitmap</li>
          </ul>
        </Card>

        <Card title="Ninja-Seil (Grapple Hook)" color="blue">
          <p className="text-sm text-gray-400 mb-3">Implementierung als <code className="text-blue-300">Matter.Constraint</code>:</p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Wurm klickt Zielpunkt → Raycast findet Terrain-Treffer</li>
            <li>• Constraint erstellen: <code className="text-blue-300">Matter.Constraint.create()</code></li>
            <li>• <code className="text-blue-300">pointA</code> = Terrain-Trefferpunkt (statisch)</li>
            <li>• <code className="text-blue-300">pointB</code> = Wurm-Body (dynamisch)</li>
            <li>• <code className="text-blue-300">length</code> = Abstand zum Ankerpunkt</li>
            <li>• <code className="text-blue-300">stiffness</code> = 0.7 (leicht elastisch)</li>
            <li>• Loslassen → Constraint entfernen, Wurm behält Impuls</li>
          </ul>
        </Card>

        <Card title="Wurm-Physik" color="blue">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Jeder Wurm = Matter.Body (circle, radius ~10px)</li>
            <li>• <code className="text-blue-300">frictionAir: 0.01</code> für natürlichen Fall</li>
            <li>• Laufen: <code className="text-blue-300">body.setVelocity(x, 0)</code> + Boden-Check</li>
            <li>• Springen: <code className="text-blue-300">body.applyForce(&#123;x:0, y:-impuls&#125;)</code></li>
            <li>• Fall-Schaden: Geschwindigkeit bei Aufprall messen</li>
            <li>• Rückstoß bei Schuss: Impuls entgegen Schussrichtung</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function GameLogicSection() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="🎮 Spiel-Logik & Kamera-System" 
        subtitle="Rundenbasiertes Gameplay mit cinematischer Kamera"
        color="purple"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Runden-System (StateMachine)" color="purple">
          <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto text-purple-300">{`// Szenen-Übergänge
const STATES = {
  SELECTING:   // Spieler wählt Wurm + Waffe
  AIMING:      // Winkel & Stärke einstellen
  FIRING:      // Projektil fliegt (Kamera folgt!)
  RESOLVING:   // Explosion, Schaden, Terrain
  TURN_END:    // Nächster Spieler
  GAME_OVER:   // Siegbedingung prüfen
}

// Timer pro Zug (z.B. 30s)
this.time.addEvent({
  delay: 30000,
  callback: () => endTurn()
});`}</pre>
        </Card>

        <Card title="Kamera-Führung" color="purple">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• <strong className="text-purple-300">Im Spiel:</strong> Kamera folgt aktivem Wurm 
              <code className="text-purple-300 ml-1">cameras.main.startFollow(wurm)</code></li>
            <li>• <strong className="text-purple-300">Beim Schuss:</strong> Kamera wechselt zum Projektil 
              mit smooth follow (lerp)</li>
            <li>• <strong className="text-purple-300">Bei Explosion:</strong> Kamera-Shake + Zoom-out</li>
            <li>• <strong className="text-purple-300">Panoramaschwenk:</strong> Bei Rundenwechsel 
              Tween zur nächsten Einheit</li>
          </ul>
          <pre className="text-xs bg-gray-900 p-3 rounded mt-3 overflow-x-auto text-purple-300">{`// Projektil verfolgen
this.cameras.main.startFollow(projectile, 
  true, 0.1, 0.1); // smooth lerp

// Explosion: Shake!
this.cameras.main.shake(300, 0.01);`}</pre>
        </Card>

        <Card title="Szenen-Management" color="purple">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• <code className="text-purple-300">BootScene</code> — Assets laden</li>
            <li>• <code className="text-purple-300">MenuScene</code> — Hauptmenü, Spieler-Setup</li>
            <li>• <code className="text-purple-300">GameScene</code> — Hauptgameplay</li>
            <li>• <code className="text-purple-300">UIScene</code> — Overlay (HP, Timer, Waffen)</li>
          </ul>
          <p className="text-sm text-gray-400 mt-3">UIScene läuft parallel (launch) und empfängt Events von GameScene via EventEmitter.</p>
        </Card>

        <Card title="Siegbedingungen & Schaden" color="purple">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Schaden = Funktion von: Entfernung zum Explosionszentrum</li>
            <li>• <code className="text-purple-300">damage = maxDmg * (1 - dist/radius)</code></li>
            <li>• Fall-Schaden ab bestimmter Velocity-Schwelle</li>
            <li>• Ertrinken: Wurm unter Wasserlinie → HP = 0</li>
            <li>• Sieg: Letztes Team mit ≥1 lebenden Würmern</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function ArchitectureSection() {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="🏗️ Gesamtarchitektur" 
        subtitle="Wie alle Systeme zusammenwirken"
        color="green"
      />

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <pre className="text-xs text-green-300 overflow-x-auto whitespace-pre">{`
┌─────────────────────────────────────────────────────────┐
│                    PHASER 3 GAME                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ BootScene│→ │MenuScene │→ │     GameScene         │  │
│  └──────────┘  └──────────┘  │                        │  │
│                               │  ┌──────────────────┐ │  │
│                               │  │  TerrainManager   │ │  │
│                               │  │  • RenderTexture   │ │  │
│                               │  │  • PixelBuffer     │ │  │
│                               │  │  • Explosion()     │ │  │
│                               │  └──────────────────┘ │  │
│                               │                        │  │
│                               │  ┌──────────────────┐ │  │
│                               │  │  WormController   │ │  │
│                               │  │  • Matter.Body     │ │  │
│                               │  │  • Movement/Aim    │ │  │
│                               │  │  • WeaponSystem    │ │  │
│                               │  └──────────────────┘ │  │
│                               │                        │  │
│                               │  ┌──────────────────┐ │  │
│                               │  │  ProjectileSystem │ │  │
│                               │  │  • Trajectory      │ │  │
│                               │  │  • Terrain-Collide │ │  │
│                               │  │  • Explosion       │ │  │
│                               │  └──────────────────┘ │  │
│                               │                        │  │
│                               │  ┌──────────────────┐ │  │
│                               │  │  TurnManager      │ │  │
│                               │  │  • Round-Robin     │ │  │
│                               │  │  • Timer           │ │  │
│                               │  │  • State Machine   │ │  │
│                               │  └──────────────────┘ │  │
│                               └────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │              UIScene (Overlay)                    │    │
│  │  • HP-Bars • Timer • Waffen-Auswahl • Minimap    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
        `}</pre>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
          <h4 className="text-green-300 font-bold text-sm mb-2">📦 Datenfluss</h4>
          <p className="text-xs text-gray-400">
            Input → TurnManager → WormController → WeaponSystem → ProjectileSystem → 
            TerrainManager (Explosion) → DamageCalc → TurnManager (nächster Zug)
          </p>
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
          <h4 className="text-green-300 font-bold text-sm mb-2">🔄 Event-System</h4>
          <p className="text-xs text-gray-400">
            Phaser.Events.EventEmitter verbindet alle Systeme lose gekoppelt. 
            Explosion-Event → alle Systeme reagieren (Schaden, Kamera, Sound, Partikel).
          </p>
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
          <h4 className="text-green-300 font-bold text-sm mb-2">⚡ Performance</h4>
          <p className="text-xs text-gray-400">
            Terrain: Nur betroffene Region updaten. Physik: Fixed timestep. 
            Rendering: Dirty-Rectangles für UI. Pixel-Buffer in TypedArrays.
          </p>
        </div>
      </div>

      {/* Ready Banner */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-8 text-center mt-8">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-300 mb-2">Ich bin bereit!</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Alle Kernmechaniken sind analysiert und die Architektur steht. 
          Gib mir deine ersten Programmierbefehle — ich starte mit der Implementierung 
          des <strong className="text-green-300">TerrainManagers</strong>, des <strong className="text-green-300">Physics-Setups</strong> 
          oder einem anderen Modul deiner Wahl.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// NEU (Recherche-Runde 2): Grafik-Konzept, UX, Roadmap
// Details: docs/RESEARCH.md & docs/PLAN.md
// ═══════════════════════════════════════════════════════════

function GraphicsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="🎨 Grafik-Konzept"
        subtitle="Schwerpunkt 1 — so wird der Klon visuell überzeugend"
        color="rose"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Art Direction: 'Poliert-Cartoon'" color="rose">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Gesättigte Palette, weiche Schatten, Outlines an Würmern/Waffen</li>
            <li>• Teamfarben <strong className="text-rose-300">farbschwächentauglich</strong>: Blau / Orange / Violett / Gelb</li>
            <li>• Stil via Phaser <code className="text-rose-300">Graphics</code> + prozedurale Texturen → MVP ohne Asset-Blocker; später optional Hand-Sprites</li>
            <li>• ⚠️ Kein Kopieren von Team17-Assets (Urheberrecht) — eigener Look, eigener Name</li>
          </ul>
        </Card>

        <Card title="Parallax-Bühne (Ebenen)" color="rose">
          <ol className="space-y-1 text-sm text-gray-400 list-decimal list-inside">
            <li>Himmel-Gradient + Sonne/Mond</li>
            <li>Wolken (Faktor 0.2, driftend)</li>
            <li>Ferne Berge (0.4, Dunst-Tint)</li>
            <li>Terrain (1.0) + Scorch-Layer + Grasrand</li>
            <li>Würmer / Projektile / Kisten</li>
            <li>Animierte Wasserlinie mit Glow</li>
            <li>Partikel (additiv) → PostFX → HUD</li>
          </ol>
        </Card>

        <Card title="Terrain-Rendering" color="rose">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Erdtextur prozedural (Noise, 3 Brauntöne), 3-px-Grasrand hell/dunkel</li>
            <li>• Schattierung aus Höhenkanten-Normalen → plastische Klippen</li>
            <li>• Krater: zweiter dunkler <strong>Scorch-Ring</strong> (eigene RenderTexture, multiplikativ getintet)</li>
            <li>• Welt 1600×900 px, Buffer 1:1; Low-End-Flag: halbe Auflösung</li>
          </ul>
        </Card>

        <Card title="Explosions-Choreografie (≥3 Feedback-Kanäle!)" color="rose">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Additiver Blitz-Glow + Rauchschwaden + Erdkrümel (Gravity-Particles mit Terrain-Bounce)</li>
            <li>• <code className="text-rose-300">cameras.main.shake()</code> + kurzer Hit-Stop (timeScale-Puls)</li>
            <li>• Damage-Numbers als Tween-Text, Grabstein-Animation beim Kill</li>
            <li>• Phaser-3.90-FX: Glow / Shadow / Vignette für Film-Look</li>
          </ul>
        </Card>

        <Card title="Wurm-Animationen (Spritesheets)" color="rose">
          <p className="text-sm text-gray-400 mb-2">Je 6–8 Frames:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {['idle (Atmen)', 'walk', 'jump', 'fall', 'aim', 'fire (Recoil)', 'dig', 'hit/flinch', 'death (Wirbel)', 'drown'].map(a => (
              <span key={a} className="px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300">{a}</span>
            ))}
          </div>
        </Card>

        <Card title="Auflösung & Skalierung" color="rose">
          <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto text-rose-300">{`scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH
},
render: { antialias: true } // oder pixelArt: true`}</pre>
          <p className="text-sm text-gray-400 mt-2">Viewport 1280×720 → auf jedem Display knackig; Abnahme: konstant 60 FPS auf Mittelklasse-Hardware.</p>
        </Card>
      </div>

      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-6">
        <h3 className="text-rose-300 font-bold mb-2">🔬 Recherche-Facts (verifiziert 2026-10-10)</h3>
        <ul className="space-y-1 text-sm text-gray-400">
          <li>• npm latest = <strong>Phaser 4.2.1</strong>; empfohlene stabile Version = <strong>Phaser 3.90.0</strong> (TS-Typen inklusive)</li>
          <li>• WebGL-<code>readPixels</code> ist langsam → Kollisionslogik liest NIE die GPU, nur den CPU-Uint8Array-Buffer</li>
          <li>• Assets: Kenney.nl (CC0), OpenGameArt, jsfxr-generierte SFX → 0 Lizenzrisiko; Audio via WebAudio + Howler-Fallback</li>
        </ul>
      </div>
    </div>
  )
}

function UXSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="🧭 Benutzerfreundlichkeit"
        subtitle="Schwerpunkt 2 — Steuerung, Information, Onboarding, Barrierefreiheit"
        color="cyan"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Input-Matrix" color="cyan">
          <table className="w-full text-xs text-gray-400">
            <thead><tr className="text-cyan-300 border-b border-cyan-500/30">
              <th className="py-1 text-left">Aktion</th><th className="text-left">Maus/Tastatur</th><th className="text-left">Touch</th>
            </tr></thead>
            <tbody className="[&_td]:py-1">
              <tr><td>Zielen</td><td>Mauswinkel + ←/→ fein</td><td>Schleuder-Drag</td></tr>
              <tr><td>Feuern</td><td>Klick halten=Power, loslassen</td><td>Loslassen</td></tr>
              <tr><td>Bewegen</td><td>A/D · Leertaste=Sprung</td><td>Buttons ≥48 px</td></tr>
              <tr><td>Waffe</td><td>1–9 · Q/E · Tab=Waffenrad</td><td>HUD-Icons</td></tr>
              <tr><td>Sonstiges</td><td>P Pause · H Hilfe · M Mute</td><td>—</td></tr>
            </tbody>
          </table>
        </Card>

        <Card title="Lernhilfe: Flugvorhersage" color="cyan">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• <strong className="text-cyan-300">Trajektorien-Punkte</strong> (erste ~25 % des Flugs) — lehrt Physik in 10 s</li>
            <li>• Impact-Kreis zeigt Einschlagpunkt am Terrain</li>
            <li>• Risikoring warnt bei möglicher Selbstexplosion (abschaltbar für Profis)</li>
          </ul>
        </Card>

        <Card title="HUD — immer klar: Wer, was, wann?" color="cyan">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Aktives Team + blinkender Marker über dem dran-seienden Wurm</li>
            <li>• Runden-Timer als Balken/Ring; letzte 5 s rot pulsierend + Piepton</li>
            <li>• Nametag + HP-Balken über jedem Wurm (fremde dezent, Hover = detail)</li>
            <li>• Kamera pans sanft (~0,8 s Ease) statt Sprung — Orientierung bleibt</li>
          </ul>
        </Card>

        <Card title="Onboarding & Fehlerkultur" color="cyan">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Interaktives Tutorial (&lt;60 s, überspringbar): Ziehen → Loslassen → Treffer</li>
            <li>• Kein Undo (Genre), dafür verlässliche Vorhersage-Tools</li>
            <li>• Shortcuts-Overlay jederzeit per H; alle Bindings remappbar</li>
            <li>• Jeder Treffer = Zahl + Sound + Shake + Partikel (nichts passiert lautlos)</li>
          </ul>
        </Card>

        <Card title="Barrierefreiheit" color="cyan">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Reduzierte-Effekte-Modus (Shake ↓, Flash aus) — Epilepsie-Prävention</li>
            <li>• Farbfehlsichtigkeits-Paletten-Switch, UI-Schrift 100/125/150 %</li>
            <li>• Vollständig tastenspielbar, Fokus-Indikatoren im Menü</li>
            <li>• Kontrast aller Texte ≥ 4.5:1 (Outline + Shadow)</li>
          </ul>
        </Card>

        <Card title="Abnahmekriterien UX" color="cyan">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>☑ Genre-Neuling trifft den ersten Schuss im Tutorial</li>
            <li>☑ Nie unklar, wer dran ist / was klickbar ist</li>
            <li>☑ Zug-Zeit ≤ 30 s; alles Wichtige ohne Menü erreichbar</li>
            <li>☑ Think-Aloud-Test mit 2 externen Nutzern dokumentiert</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function RoadmapSection() {
  const milestones = [
    { id: 'M0', name: 'Setup', desc: 'phaser@^3.90.0 installieren, TS/Vite-Integration, leere GameScene', done: false },
    { id: 'M1', name: 'Terrain-Kern', desc: 'Bitmap-Model + Heightmap, Generierung, dig(), Raycast, Tests', done: false },
    { id: 'M2', name: 'Wurm & Bewegung', desc: 'Fußsensor, Gehen/Springen/Fall, Fallschaden, Kamera', done: false },
    { id: 'M3', name: 'Projektile & Explosion', desc: 'Bazooka/Granate, Flugintegration, Krater, Rückstoß, Wasser', done: false },
    { id: 'M4', name: 'Rundenlogik & HUD', desc: 'TurnManager, Timer, UIScene, Win-Screen, Hotseat-Menü', done: false },
    { id: 'M5', name: '★ Grafik-Polish', desc: 'Parallax, Scorch, Partikel, PostFX, Anims, Sound', done: false },
    { id: 'M6', name: '★ UX-Polish', desc: 'Flugvorhersage, Tutorial, A11y, Touch-Pfad, Remapping', done: false },
    { id: 'M7', name: 'Stretch', desc: 'Wind, Ninja Rope, mehr Waffen, CPU-KI, Map-Varianten', done: false },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader
        title="🗺️ Roadmap, Risiken & offene Entscheidungen"
        subtitle="Reihenfolge mit Abnahme-Demos pro Meilenstein · Vollversion in docs/PLAN.md"
        color="lime"
      />

      <div className="grid md:grid-cols-2 gap-3">
        {milestones.map((m) => (
          <div key={m.id} className="bg-gray-900 border border-lime-500/20 rounded-xl p-4 flex gap-4 items-start">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-lime-500/10 border border-lime-500/40 flex items-center justify-center text-lime-300 font-bold text-sm">{m.id}</div>
            <div>
              <h4 className="text-lime-300 font-bold text-sm">{m.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="⚠️ Top-Risiken & Gegenmaßnahmen" color="lime">
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• <strong>Terrain-Desync</strong> (Bild ≠ Kollision) → eine autoritative Quelle (Model), View redrawed nur Dirty-Rects</li>
            <li>• <strong>Doppelphysik</strong> Matter vs. Custom → klar getrennt: Terrain/Würmer/Projektile custom, Seil/Kisten ggf. Matter</li>
            <li>• <strong>Perf auf Intel-IGP</strong> → Budgets (≤800 Partikel), Dirty-Region-Redraw, Dev-FPS-Overlay</li>
            <li>• <strong>Scope-Creep</strong> → MVP = 3 Waffen, kein Netcode; Stretchliste einfrieren</li>
            <li>• <strong>Lizenzen</strong> → CC0-Assetliste + jsfxr-SFX-Fallback</li>
          </ul>
        </Card>

        <Card title="❓ Offene Entscheidungen (bitte wählen)" color="lime">
          <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
            <li>Look: Cartoon-Vektor <em>(empfohlen)</em> vs. Hand-Sprites?</li>
            <li>Renderer: WebGL-first <em>(empfohlen)</em> vs. Canvas erzwingen?</li>
            <li>Matter.js nur für Rope/Kisten <em>(empfohlen)</em> oder ganz weg?</li>
            <li>Gamesprache: Deutsch / Englisch / i18n ab Werk?</li>
            <li>Spiel als eigener Entry Point <code>/game</code>, Doku-Seite bleibt?</li>
            <li>Desktop zuerst, Touch in M6 <em>(empfohlen)</em>?</li>
          </ol>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-lime-500/10 to-green-500/10 border border-lime-500/30 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">📐</div>
        <h2 className="text-2xl font-bold text-lime-300 mb-2">Planung steht — noch kein Spiel gebaut</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Bestätige die 6 offenen Entscheidungen (oder sage „nimm deine Empfehlungen“),
          dann starte ich in der nächsten Runde mit <strong className="text-lime-300">M0 + M1 (Terrain-Kern)</strong>.
        </p>
      </div>
    </div>
  )
}

// Reusable Components
function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  const colorMap: Record<string, string> = {
    amber: 'text-amber-300 border-amber-500/30',
    blue: 'text-blue-300 border-blue-500/30',
    purple: 'text-purple-300 border-purple-500/30',
    green: 'text-green-300 border-green-500/30',
    rose: 'text-rose-300 border-rose-500/30',
    cyan: 'text-cyan-300 border-cyan-500/30',
    lime: 'text-lime-300 border-lime-500/30',
  }
  return (
    <div className={`border-b ${colorMap[color]} pb-4 mb-6`}>
      <h2 className={`text-2xl font-bold ${colorMap[color].split(' ')[0]}`}>{title}</h2>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  )
}

function Card({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  const borderColors: Record<string, string> = {
    amber: 'border-amber-500/20',
    blue: 'border-blue-500/20',
    purple: 'border-purple-500/20',
    green: 'border-green-500/20',
    rose: 'border-rose-500/20',
    cyan: 'border-cyan-500/20',
    lime: 'border-lime-500/20',
  }
  const titleColors: Record<string, string> = {
    amber: 'text-amber-300',
    blue: 'text-blue-300',
    purple: 'text-purple-300',
    green: 'text-green-300',
    rose: 'text-rose-300',
    cyan: 'text-cyan-300',
    lime: 'text-lime-300',
  }
  return (
    <div className={`bg-gray-900 border ${borderColors[color]} rounded-xl p-5`}>
      <h3 className={`font-bold ${titleColors[color]} mb-3`}>{title}</h3>
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  )
}

export default App
