// Draft-Ideen ("Rezepte"): Welche Helden ergeben zusammen ein Konzept?
//
// Aufbau einer Idee:
//   id         eindeutig, klein geschrieben
//   name       kurzer Titel
//   scope      "lane-safe" (Pos 1+5) | "lane-off" (Pos 3+4) | "supports" (Pos 4+5)
//              | "cores" (Pos 1/2/3) | "team" (alle fünf)
//   plan       Spielplan-Marke, siehe PLAN_INFO unten
//   difficulty 1 = einfach, 2 = Absprache nötig, 3 = braucht Koordination
//   slots      [{ pos, heroes: [ids, Alternativen…], label }] – der erste Held ist die erste Wahl
//   order      Pick-Reihenfolge der Positionen (Setup vor Payoff)
//   idea       1–2 Sätze: warum funktioniert das?
//   tips       kurze Ansagen für die Ausführung
//   strongVs   wogegen das gut ist (Freitext)
//   careful    worauf zu achten ist (Freitext)
window.DOTA_PLAYS = [
  {
    id: "aggro-safelane",
    name: "Aggro-Safelane",
    scope: "lane-safe",
    plan: "early",
    difficulty: 1,
    slots: [
      { pos: 5, heroes: [51, 26, 30, 64, 87], label: "Lockdown" },
      { pos: 1, heroes: [70, 8, 54, 95], label: "Früher Druck" }
    ],
    order: [5, 1],
    idea: "Der Support bindet den Gegner fest, der Carry hat genug früher Schaden, um den Kill allein abzuschließen. Ziel ist nicht Farm, sondern die Lane kaputt zu machen und früh Rosh mitzunehmen.",
    tips: ["Erster Kill vor Minute 5, sonst auf Farm umschalten.", "Rosh ab Minute 12 antesten, wenn die Offlane weg ist."],
    strongVs: "passive Offlaner und Supports ohne Escape",
    careful: "Gegen harte Zonen-Offlaner (Timbersaw, Bristleback) wird daraus nichts."
  },
  {
    id: "safelane-babysit",
    name: "Safelane mit Schutzschild",
    scope: "lane-safe",
    plan: "late",
    difficulty: 1,
    slots: [
      { pos: 5, heroes: [112, 31, 50, 85], label: "Save/Sustain" },
      { pos: 1, heroes: [94, 8, 48, 54], label: "Scaling-Carry" }
    ],
    order: [1, 5],
    idea: "Der Carry darf ungestört farmen, der Support hält ihn mit Heal, Shield oder Save am Leben. Das Spiel wird spät gewonnen.",
    tips: ["Lane halten, keine riskanten Fights vor dem ersten großen Item.", "Support zieht ab Minute 15 auf die Karte und stellt Vision für die Farm-Route."],
    strongVs: "Teams, die auf einen frühen Burst setzen und dann nichts mehr haben",
    careful: "Gegen harten Push verliert ihr die Türme, bevor der Carry online ist."
  },
  {
    id: "offlane-setup",
    name: "Offlane-Duo mit Setup",
    scope: "lane-off",
    plan: "teamfight",
    difficulty: 2,
    slots: [
      { pos: 3, heroes: [29, 129, 96, 2, 28], label: "Initiation" },
      { pos: 4, heroes: [128, 64, 7, 51, 9], label: "AoE-Nachlage" }
    ],
    order: [3, 4],
    idea: "Die Offlane initiiert mit einem großen AoE-Disable, der Pos 4 legt sofort Flächenschaden nach. Zwei Zauber, ein toter Gegner.",
    tips: ["Immer zusammen rotieren, einzeln bringt das nichts.", "Vor dem Fight ansagen, wer zuerst reingeht."],
    strongVs: "Teams, die eng zusammenstehen, und Illusions-Cores",
    careful: "Beide brauchen Mana und Blink/Positionierung, sonst verpufft die Combo."
  },
  {
    id: "offlane-spacemaker",
    name: "Offlane macht Platz",
    scope: "lane-off",
    plan: "early",
    difficulty: 1,
    slots: [
      { pos: 3, heroes: [135, 120, 15, 104, 71], label: "Nervensäge" },
      { pos: 4, heroes: [51, 5, 7, 128], label: "Roamer" }
    ],
    order: [4, 3],
    idea: "Die Offlane ist allein überlebensfähig, der Pos 4 rotiert früh auf Mid und Safelane und sammelt dort Kills ein.",
    tips: ["Pos 4 ab Minute 3 unterwegs, nicht in der Lane kleben.", "Offlaner holt sich XP auch aus der Distanz, Sterben ist schlimmer als wenig Farm."],
    strongVs: "immobile Mid-Helden",
    careful: "Wenn der Roam nichts bringt, fällt euer Pos 4 im Level zurück."
  },
  {
    id: "support-abdeckung",
    name: "Support-Duo: Save + Lockdown",
    scope: "supports",
    plan: "teamfight",
    difficulty: 1,
    slots: [
      { pos: 4, heroes: [112, 85, 51, 136, 9], label: "Save/Frontline" },
      { pos: 5, heroes: [30, 26, 87, 31, 40], label: "Lockdown/Schaden" }
    ],
    order: [5, 4],
    idea: "Ein Support hält den Kern am Leben, der andere macht einen Gegner bewegungsunfähig. Damit sind die beiden wichtigsten Punkte im Team-Check abgedeckt.",
    tips: ["Save-Support spielt hinter dem Carry, nicht vorn.", "Lockdown-Support eröffnet den Fight nur mit Vision."],
    strongVs: "Teams, die einen einzelnen Kern fokussieren",
    careful: "Beide sind squishy. Ohne Vision werdet ihr zuerst gepickt."
  },
  {
    id: "support-wombo",
    name: "Support-Duo: Wombo-Combo",
    scope: "supports",
    plan: "teamfight",
    difficulty: 3,
    slots: [
      { pos: 4, heroes: [7, 51, 128, 64], label: "Setup" },
      { pos: 5, heroes: [64, 30, 87, 40], label: "Flächenschaden" }
    ],
    order: [4, 5],
    idea: "Großer AoE-Disable, direkt gefolgt von Flächenschaden auf derselben Stelle. Klappt es, ist der Fight in drei Sekunden vorbei.",
    tips: ["Vorher ansagen, wer initiiert.", "Nicht im Freien initiieren, sondern aus Rauch oder High Ground."],
    strongVs: "gruppierte Teams, Push-Comps am Turm",
    careful: "Verfehlt der Setup-Zauber, steht ihr beide nackt im Fight."
  },
  {
    id: "cores-tempo",
    name: "Farming Mid, kämpfender Carry",
    scope: "cores",
    plan: "push",
    difficulty: 2,
    slots: [
      { pos: 2, heroes: [36, 47, 43, 22], label: "Stabiles Mid" },
      { pos: 1, heroes: [70, 8, 54, 48], label: "Fight-Carry" }
    ],
    order: [2, 1],
    idea: "Das Mid hält seine Lane ohne Hilfe und schiebt Türme, der Carry darf dafür früh mit dem Team kämpfen statt nur zu farmen.",
    tips: ["Nach dem ersten Turm Mid: alle zusammen auf die nächste Lane.", "Carry nimmt Fights nur mit Support-Begleitung."],
    strongVs: "Teams mit Late-Game-Carrys, denen ihr die Zeit nehmt",
    careful: "Zieht sich das Spiel über 40 Minuten, verliert ihr an Skalierung."
  },
  {
    id: "cores-rp-cleave",
    name: "Reverse Polarity trifft Cleave",
    scope: "cores",
    plan: "teamfight",
    difficulty: 3,
    slots: [
      { pos: 3, heroes: [97], label: "RP + Empower" },
      { pos: 1, heroes: [18, 8, 54, 95], label: "Nahkampf-Cleave" }
    ],
    order: [3, 1],
    idea: "Magnus sammelt das gegnerische Team ein und verstärkt den Nahkampf-Carry, der den Haufen mit Cleave abräumt. Die klassische Signature-Combo.",
    tips: ["Carry läuft erst rein, wenn RP gezündet hat.", "Empower immer auf den Carry, auch beim Farmen."],
    strongVs: "alles, was gruppiert kämpft",
    careful: "Ohne Blink ist Magnus nutzlos. Ein Lotus oder BKB auf der Gegenseite kostet euch den Fight."
  },
  {
    id: "team-push",
    name: "5-Mann-Push bis Minute 30",
    scope: "team",
    plan: "push",
    difficulty: 2,
    slots: [
      { pos: 5, heroes: [40, 30, 27, 64], label: "Waveclear/Zonen" },
      { pos: 4, heroes: [64, 128, 51, 85], label: "Flächenschaden" },
      { pos: 3, heroes: [29, 135, 2], label: "Frontline" },
      { pos: 2, heroes: [43, 36, 22], label: "Push-Mid" },
      { pos: 1, heroes: [48, 8, 53], label: "Turm-Schaden" }
    ],
    order: [5, 4, 3, 2, 1],
    idea: "Alle fünf können Creepwellen räumen und Türme schnell umschlagen. Ihr nehmt dem Gegner die Karte, bevor seine Carrys online sind.",
    tips: ["Nach jedem gewonnenen Fight sofort Türme, nicht Jungle farmen.", "Ab Minute 25 Rosh einplanen und mit Aegis durchziehen."],
    strongVs: "Teams mit Late-Game-Carrys und wenig Waveclear",
    careful: "Geht der Push nicht auf, habt ihr spät zu wenig Schaden."
  },
  {
    id: "team-teamfight",
    name: "5-Mann-Teamfight ab Minute 20",
    scope: "team",
    plan: "teamfight",
    difficulty: 2,
    slots: [
      { pos: 5, heroes: [30, 64, 87, 26], label: "Flächenschaden" },
      { pos: 4, heroes: [112, 51, 7, 128], label: "Save/Setup" },
      { pos: 3, heroes: [29, 129, 96], label: "Initiation" },
      { pos: 2, heroes: [36, 22, 43], label: "Magieschaden" },
      { pos: 1, heroes: [18, 8, 48, 54], label: "Schaden im Fight" }
    ],
    order: [5, 4, 3, 2, 1],
    idea: "Eine saubere Standard-Comp: Initiation, Nachlage, ein Save und genug Mix aus magischem und physischem Schaden. Deckt den Team-Check fast komplett ab.",
    tips: ["Fights um Rosh und Türme suchen, nicht im offenen Feld.", "Initiation nur mit Vision, sonst wartet ihr."],
    strongVs: "fast alles, solange ihr zusammen bleibt",
    careful: "Gegen starken Split-Push müsst ihr aktiv Druck machen."
  }
];

// Spielplan-Marken für die Anzeige
window.PLAN_INFO = {
  early:     { label: "Early Aggro", hint: "Druck ab Minute 0" },
  push:      { label: "Push/Tempo",  hint: "Türme vor Farm" },
  teamfight: { label: "Teamfight",   hint: "gruppiert ab Minute 20" },
  late:      { label: "Late Game",   hint: "Zeit kaufen, spät gewinnen" },
  split:     { label: "Split-Push",  hint: "Karte breit halten" }
};

window.SCOPE_INFO = {
  "lane-safe": { label: "Safelane-Duo", positions: [1, 5] },
  "lane-off":  { label: "Offlane-Duo",  positions: [3, 4] },
  "supports":  { label: "Support-Duo",  positions: [4, 5] },
  "cores":     { label: "Core-Combo",   positions: [1, 2, 3] },
  "team":      { label: "5-Mann-Comp",  positions: [1, 2, 3, 4, 5] }
};
