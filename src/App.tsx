import { useState } from 'react'

type Section = 'terrain' | 'physics' | 'game-logic' | 'architecture'

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
            <span className="font-bold text-green-400">STATUS:</span> Recherche abgeschlossen. 
            Alle Kernmechaniken analysiert und verstanden. Bereit für Programmierbefehle.
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
                  'rgba(34,197,94,0.15)',
                borderColor: tab.color === 'amber' ? 'rgba(245,158,11,0.5)' :
                  tab.color === 'blue' ? 'rgba(59,130,246,0.5)' :
                  tab.color === 'purple' ? 'rgba(168,85,247,0.5)' :
                  'rgba(34,197,94,0.5)',
                color: tab.color === 'amber' ? '#fbbf24' :
                  tab.color === 'blue' ? '#93c5fd' :
                  tab.color === 'purple' ? '#c084fc' :
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

// Reusable Components
function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  const colorMap: Record<string, string> = {
    amber: 'text-amber-300 border-amber-500/30',
    blue: 'text-blue-300 border-blue-500/30',
    purple: 'text-purple-300 border-purple-500/30',
    green: 'text-green-300 border-green-500/30',
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
  }
  const titleColors: Record<string, string> = {
    amber: 'text-amber-300',
    blue: 'text-blue-300',
    purple: 'text-purple-300',
    green: 'text-green-300',
  }
  return (
    <div className={`bg-gray-900 border ${borderColors[color]} rounded-xl p-5`}>
      <h3 className={`font-bold ${titleColors[color]} mb-3`}>{title}</h3>
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  )
}

export default App
