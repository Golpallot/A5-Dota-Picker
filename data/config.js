// Stellschrauben für Vorschläge und Draft.
window.DOTA_CONFIG = {
  // Gewichte der Score-Bestandteile für den eigenen Pool.
  // Fokus: eigene Bewertung + Synergie. Meta und Counter sind nur Beiwerk.
  weights: { comfort: 1, synergy: 1, needs: 0.8, meta: 0.3, counter: 0.4 },

  // Gewichte für "Zum Ausprobieren"-Empfehlungen (hier zählen Counter/Meta mehr)
  recWeights: { meta: 1, counter: 1.2 },

  // Wunschhelden ("Will ausprobieren")
  wishBaseline: 2.5,     // Annahme, wenn jemand keine Sterne vergeben hat
  wishFactor: 0.85,      // kleiner Abschlag gegenüber eingespielten Helden
  chanceThreshold: 8,    // ab so vielen Situationspunkten (Counter + Teambedarf + Meta) heißt es "jetzt wäre die Gelegenheit"

  // Pub-Winrates immer aus Divine+ (Bracket 7)
  bracket: 7,

  // Meta-Quellen im Draft (Auswahlfeld "Meta"). Die erste ist Standard.
  metaModes: [
    { id: "both", name: "Divine+ & Pro (T1+T2)" },
    { id: "pro",  name: "Pro-Turniere (T1+T2)" },
    { id: "pro1", name: "Pro Tier 1" },
    { id: "pro2", name: "Pro Tier 2" },
    { id: "pub",  name: "Pubs Divine+" }
  ],

  // Pick-Reihenfolgen (Positionen, pro Schritt eine Gruppe). Die erste ist Standard.
  pickOrders: [
    { id: "supports", name: "Supports zuerst (5+4 → 3+1 → 2)", steps: [[5, 4], [3, 1], [2]] },
    { id: "offlane",  name: "Support + Offlane zuerst (4+3 → 5 → 1 → 2)", steps: [[4, 3], [5], [1], [2]] },
    { id: "safelane", name: "Pos 5 + Offlane zuerst (5+3 → 4 → 1 → 2)", steps: [[5, 3], [4], [1], [2]] },
    { id: "free",     name: "Frei (keine Reihenfolge)", steps: [[1, 2, 3, 4, 5]] }
  ],

  // Wie viele Vorschläge aus dem eigenen Pool pro Slot
  suggestions: 6,
  // Wie viele "Zum Ausprobieren"-Empfehlungen (Wunschhelden können es auf bis zu +2 erweitern)
  tryoutSuggestions: 3
};

// Der Admin-Bereich steckt in nur-lokal/admin.js. Dieser Ordner wird nicht hochgeladen,
// online gibt es den Bereich deshalb gar nicht – hier ist nichts einzustellen.

window.POSITION_NAMES ={ 1: "Carry", 2: "Mid", 3: "Offlane", 4: "Soft Support", 5: "Hard Support" };
window.BRACKET_NAMES = { 1: "Herald", 2: "Guardian", 3: "Crusader", 4: "Archon", 5: "Legend", 6: "Ancient", 7: "Divine+" };
