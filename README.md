# ⚔️ A5 Dota Picker

Draft-Planer für unseren Dota-Stack: Wer spielt in welcher Konstellation welche Position, und welche Helden aus unseren eigenen Pools passen zusammen?

**Ablauf:** Lobby (wer spielt mit?) → Aufstellung (hinterlegte Varianten anklicken oder spontan zuordnen) → Draft (bis zu 6 Helden aus dem eigenen Pool pro Position. Nach jedem Lock sortieren sich die anderen nach Synergie um. Dazu optional „Zum Ausprobieren“: Wunschhelden, Counter- und Meta-Tipps.)

## Lokal starten
- `index.html` doppelklicken.
- Tests: `tests.html` öffnen.

## Daten
| Datei | Inhalt |
|---|---|
| `data/players.js` | Spieler, Rollen-Rangfolge, Heldenpools (Ich-/Team-Bewertung 1–5), Wunschhelden, Vibecheck-Liste, Aufstellungen, Lane-Konflikte |
| `data/hero-tags.js` | Positionen, Tags, Tipp pro Held |
| `data/combos.js` | Explizite Combos mit Bonus |
| `data/plays.js` | Draft-Ideen (Rezepte für Lanes, Support-Duos, Core-Combos, 5-Mann-Comps) |
| `data/config.js` | Gewichte, Pick-Reihenfolgen, Anzahl Vorschläge |
| `data/heroes.js` | Heldenliste + Pub-Winrate-Snapshot |
| `data/pro.js` | Snapshot Profi-Turniere Tier 1/2 (letzte 90 Tage, Picks/Siege/Bans) |
| `data/pro-query.js` | OpenDota-Abfrage für die Profi-Daten (Zeitraum `PRO_DAYS`) |

## Wie der Score entsteht
`Bewertung (Ø aus Ich/Team × 6) + Synergie (Combos, Setup/Follow-up, Saves, Lane) + Teambedarf + kleiner Meta-/Counter-Anteil`
Der eigene Pool und die Synergie stehen im Vordergrund. Meta und Counter spielen vor allem bei „Zum Ausprobieren“ eine Rolle. Vibecheck-Helden bekommen keinen Abzug, nur einen Hinweis.
