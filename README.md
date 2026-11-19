# ⚔️ A5 Dota Picker

Draft-Planer für unseren Dota-Stack: Wer spielt in welcher Konstellation welche Position, und welche Helden aus unseren eigenen Pools passen zusammen?

**Ablauf:** Lobby (wer spielt mit?) → Aufstellung (hinterlegte Varianten anklicken oder spontan zuordnen) → Draft (bis zu 6 Helden aus dem eigenen Pool pro Position. Nach jedem Lock sortieren sich die anderen nach Synergie um. Dazu optional „Zum Ausprobieren“: Wunschhelden, Counter- und Meta-Tipps.)

## Seiten
- `index.html` – der Picker.
- `bewerten.html` – **Heldencheck**: Karte für Karte bewerten, wie gut jemand einen Helden auf einer Position spielt.
  Fünf Knöpfe von ❤ bis ✗, Stand wird im Browser gespeichert, am Ende CSV herunterladen und an MaStr schicken.
- `tests.html` – Logik-Tests.

## Daten
| Datei | Inhalt |
|---|---|
| `data/players.js` | Spieler, Rollen-Rangfolge, Heldenpools (Ich-/Team-Bewertung 1–5), Wunschhelden, Vibecheck-Liste, Aufstellungen, Lane-Konflikte, Heldencheck-Bewertungen |
| `data/hero-tags.js` | Positionen, Tags, Tipp pro Held |
| `data/combos.js` | Explizite Combos mit Bonus |
| `data/plays.js` | Draft-Ideen (Rezepte für Lanes, Support-Duos, Core-Combos, 5-Mann-Comps) |
| `data/capabilities.js` | Team-Check: 12 Kategorien mit Gewicht und Zielwert, dazu je Held 0–3 Punkte pro Kategorie |
| `data/config.js` | Gewichte, Pick-Reihenfolgen, Anzahl Vorschläge |
| `data/heroes.js` | Heldenliste + Pub-Winrate-Snapshot |
| `data/pro.js` | Snapshot Profi-Turniere Tier 1/2 (letzte 90 Tage, Picks/Siege/Bans) |
| `data/pro-query.js` | OpenDota-Abfrage für die Profi-Daten (Zeitraum `PRO_DAYS`) |

## Wie der Score entsteht
`Bewertung (Ø aus Ich/Team × 6) + Synergie (Combos, Setup/Follow-up, Saves, Lane) + Teambedarf + kleiner Meta-/Counter-Anteil`
Der eigene Pool und die Synergie stehen im Vordergrund. Meta und Counter spielen vor allem bei „Zum Ausprobieren“ eine Rolle. Vibecheck-Helden bekommen keinen Abzug, nur einen Hinweis.

Der Team-Wert kommt aus dem Heldencheck: Er ist der Schnitt der Fremdbewertungen – und zwar nur von den Leuten,
die gerade in der Lobby stehen. Liegt für einen Helden nichts vor, gilt der im Admin eingetragene Wert.
