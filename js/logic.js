// Reine Logik ohne DOM: Aufstellungen finden, Bewertungen, Helden-Scoring.
(function () {
  const POSITIONS = [1, 2, 3, 4, 5];
  const LANE_PARTNER = { 1: 5, 5: 1, 3: 4, 4: 3 };
  const LANE_OF = { 1: "safe", 5: "safe", 3: "off", 4: "off", 2: "mid" };
  const LANE_NAMES = { safe: "Safelane", off: "Offlane", mid: "Mid" };
  const CONFLICT_PENALTY = 1000; // Lane-Konflikte schlagen alles andere

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function heroTags(id) {
    const t = window.DOTA_TAGS[id];
    return t ? t[1].split(/\s+/).filter(Boolean) : [];
  }
  function heroPositions(id) {
    const t = window.DOTA_TAGS[id];
    return t ? t[0].split("").map(Number) : [];
  }
  function heroTip(id) {
    const t = window.DOTA_TAGS[id];
    return t ? t[2] : "";
  }
  function heroName(id) {
    const h = window.HERO_BY_ID[id];
    return h ? h.name : "#" + id;
  }

  // ---------- Bewertungen ----------

  // Wunschhelden einer Position: akzeptiert alte Form [heroId] und neue [{hero, self?}]
  function wishEntries(player, pos) {
    const raw = ((player || {}).tryout || {})[pos] || [];
    return raw.map((w) => (typeof w === "number" ? { hero: w } : w)).filter((w) => w && w.hero);
  }

  // Pool-Eintrag {hero, self, team} → Kennzahlen. team ist optional.
  function rating(entry) {
    const self = entry.self || 0;
    const team = entry.team || null;
    const avg = team ? (self + team) / 2 : self;
    return { self, team, avg, delta: team ? team - self : null };
  }

  // ---------- Aufstellungen ----------

  function lineupPlayers(lineup) {
    return POSITIONS.map((p) => lineup.assign[p]).filter(Boolean);
  }

  // exact: gleiche Spielermenge; partial: alle Gewählten stecken drin (Rest wird Random)
  function lineupsFor(selectedIds, lineups) {
    const sel = new Set(selectedIds);
    const exact = [], partial = [];
    for (const l of lineups || []) {
      const ps = lineupPlayers(l);
      const allSelectedIn = selectedIds.every((id) => ps.includes(id));
      if (!allSelectedIn) continue;
      if (ps.length === sel.size) exact.push(l);
      else partial.push(l);
    }
    return { exact, partial };
  }

  // Welche hinterlegten "nicht zusammen auf eine Lane"-Paare verletzt diese Zuordnung?
  function laneConflicts(assign, conflicts) {
    const found = [];
    for (const c of conflicts || []) {
      let posA = null, posB = null;
      for (const pos of POSITIONS) {
        if (assign[pos] === c.a) posA = pos;
        if (assign[pos] === c.b) posB = pos;
      }
      if (posA && posB && LANE_OF[posA] === LANE_OF[posB]) {
        found.push({ a: c.a, b: c.b, lane: LANE_OF[posA], laneName: LANE_NAMES[LANE_OF[posA]], note: c.note || "" });
      }
    }
    return found;
  }

  /**
   * Mögliche Aufstellungen aus den Rollen-Vorlieben erzeugen.
   * Jeder gewählte Spieler bekommt eine Position (max. 5! = 120 Kombinationen), bewertet nach:
   *   Rollen-Rangfolge (1. Wahl am besten) > Position wird zwar nicht gerankt, aber es gibt einen Pool > gar nichts.
   * Rückgabe: [{ assign: {pos: playerId}, score, ranks: {pos: rang|null}, allFirst }] – beste zuerst.
   */
  function generateLineups(players, limit, conflicts) {
    const results = [];
    const assign = {};
    function fit(p, pos) {
      const rank = (p.roles || {})[pos];
      const pool = ((p.pools || {})[pos] || []).length;
      const poolBonus = Math.min(pool, 6) * 0.5;
      if (rank) return 40 - rank * 6 + poolBonus;   // 1. Wahl 34 … 5. Wahl 10 (+ Pool)
      if (pool) return 6 + poolBonus;               // keine Wunschrolle, aber Helden da
      return -20;                                   // spielt die Rolle nicht und hat keine Helden
    }
    function rec(i, score) {
      if (i === players.length) {
        const ranks = {};
        let allFirst = true;
        for (const pos of POSITIONS) {
          const pid = assign[pos];
          if (!pid) continue;
          const p = players.find((x) => x.id === pid);
          ranks[pos] = (p.roles || {})[pos] || null;
          if (ranks[pos] !== 1) allFirst = false;
        }
        const clashes = laneConflicts(assign, conflicts);
        results.push({
          assign: Object.assign({}, assign), ranks, allFirst, conflicts: clashes,
          score: score - clashes.length * CONFLICT_PENALTY
        });
        return;
      }
      for (const pos of POSITIONS) {
        if (assign[pos]) continue;
        assign[pos] = players[i].id;
        rec(i + 1, score + fit(players[i], pos));
        delete assign[pos];
      }
    }
    rec(0, 0);
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit || 6);
  }

  // Gleiche Zuordnung? (für "schon als Aufstellung gespeichert")
  function sameAssign(a, b) {
    return POSITIONS.every((pos) => (a[pos] || null) === (b[pos] || null));
  }

  // ---------- Draft-Ideen ----------

  /**
   * Eine Idee gegen die aktuelle Lage prüfen.
   * ctx: { assign: {pos: playerId}, players: {id: player}, locks: {pos: heroId}, taken: Set (Gegner/Bans/fremde Locks) }
   * Rückgabe: { play, status, score, done, total, slots: [...], missingPlayers }
   *   status: "offen" (läuft noch) | "fertig" | "blockiert" (Held weg oder anderer Held gelockt) | "unpassend" (Position nicht besetzt)
   */
  function evaluatePlay(play, ctx) {
    const slots = [];
    let score = 0, done = 0, blocked = false, unfit = false;

    for (const slot of play.slots) {
      const pid = ctx.assign[slot.pos];
      const p = pid ? ctx.players[pid] : null;
      const locked = ctx.locks[slot.pos];
      const pool = p ? ((p.pools || {})[slot.pos] || []) : [];
      const wish = p ? (((p.tryout || {})[slot.pos]) || []) : [];

      // Kandidaten: Helden der Idee, die diese Person spielt und die noch frei sind
      const options = slot.heroes.map((h) => {
        const entry = pool.find((e) => e.hero === h);
        const inWish = wish.includes(h);
        const free = !ctx.taken.has(h) || locked === h;
        return { hero: h, rating: entry ? rating(entry) : null, wish: inWish, free };
      });
      const usable = options.filter((o) => o.free && (o.rating || o.wish));
      usable.sort((a, b) => (b.rating ? b.rating.avg : 1.5) - (a.rating ? a.rating.avg : 1.5));

      let state = "offen";
      if (!p) { state = "unbesetzt"; unfit = true; }
      else if (locked) {
        if (slot.heroes.includes(locked)) { state = "erledigt"; done++; }
        else { state = "verpasst"; blocked = true; }
      } else if (!usable.length) { state = "blockiert"; blocked = true; }

      if (state === "erledigt") score += 24;
      else if (usable.length) score += (usable[0].rating ? usable[0].rating.avg : 1.5) * 6;

      slots.push(Object.assign({}, slot, { playerId: pid, state, options: usable, locked: locked || null }));
    }

    const total = play.slots.length;
    const status = unfit ? "unpassend" : blocked ? "blockiert" : done === total ? "fertig" : "offen";
    return { play, slots, status, score: score / total, done, total };
  }

  // Alle Ideen bewerten, passende zuerst
  function evaluatePlays(plays, ctx) {
    const rank = { offen: 0, fertig: 1, blockiert: 2, unpassend: 3 };
    return (plays || []).map((pl) => evaluatePlay(pl, ctx))
      .sort((a, b) => rank[a.status] - rank[b.status] || b.score - a.score);
  }

  /**
   * Zusätzliche Ideen automatisch aus data/combos.js ableiten:
   * Zwei Helden mit Combo-Bonus, die zwei verschiedene Spieler auf ihren Positionen tatsächlich spielen.
   */
  function autoPlays(ctx, limit) {
    const found = [];
    for (const c of window.DOTA_COMBOS) {
      const spots = [];
      for (const pos of POSITIONS) {
        const pid = ctx.assign[pos];
        if (!pid) continue;
        const pool = (ctx.players[pid].pools || {})[pos] || [];
        for (const hero of [c[0], c[1]]) {
          const e = pool.find((x) => x.hero === hero);
          if (e && !ctx.taken.has(hero)) spots.push({ pos, hero, rating: rating(e) });
        }
      }
      const a = spots.filter((s) => s.hero === c[0]);
      const b = spots.filter((s) => s.hero === c[1]);
      for (const x of a) for (const y of b) {
        if (x.pos === y.pos) continue;
        found.push({
          auto: true,
          id: "auto-" + c[0] + "-" + c[1] + "-" + x.pos + "-" + y.pos,
          name: c[3],
          scope: "auto",
          plan: "teamfight",
          difficulty: 2,
          bonus: c[2],
          quality: c[2] + (x.rating.avg + y.rating.avg) * 2,
          slots: [{ pos: x.pos, heroes: [x.hero], label: "" }, { pos: y.pos, heroes: [y.hero], label: "" }],
          order: [Math.min(x.pos, y.pos) === 2 ? x.pos : Math.max(x.pos, y.pos), Math.min(x.pos, y.pos)].filter((v, i, arr) => arr.indexOf(v) === i),
          idea: "Automatisch gefunden: " + c[3] + ".",
          tips: [], strongVs: "", careful: ""
        });
      }
    }
    found.sort((a, b) => b.quality - a.quality);
    const seen = new Set();
    return found.filter((p) => {
      const key = p.slots.map((s) => s.heroes[0]).sort().join("-");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, limit || 6);
  }

  // Helden, die laut aktiver Idee auf dieser Position gepickt werden sollen
  function playHeroesFor(evaluated, pos) {
    if (!evaluated) return [];
    const slot = evaluated.slots.find((s) => s.pos === pos && s.state === "offen");
    return slot ? slot.options.map((o) => o.hero) : [];
  }

  // ---------- Helden-Scoring ----------

  function comboBonus(a, b) {
    for (const c of window.DOTA_COMBOS) {
      if ((c[0] === a && c[1] === b) || (c[0] === b && c[1] === a)) return c;
    }
    return null;
  }

  const pct = (v) => v.toFixed(1).replace(".", ",") + " %";

  // Profi-Statistik eines Helden für Tier 1, Tier 2 oder beide
  function proStats(pro, hero, tiers) {
    const r = pro && pro.heroes && pro.heroes[hero];
    let picks = 0, wins = 0, bans = 0, games = 0;
    for (const t of tiers) {
      games += (pro && pro.games && pro.games[t]) || 0;
      if (!r) continue;
      const o = t === 1 ? 0 : 3;
      picks += r[o]; wins += r[o + 1]; bans += r[o + 2];
    }
    return { picks, wins, bans, games };
  }

  /**
   * Meta-Punkte. ctx.metaMode: "pub" | "pro1" | "pro2" | "pro" (T1+T2) | "both" (Pubs + Pro T1+T2)
   * Pub nutzt ctx.winrates[hero][ctx.bracket], Pro nutzt ctx.pro (siehe data/pro.js).
   */
  function metaPart(ctx) {
    const mode = ctx.metaMode || "pub";
    const reasons = [];
    const parts = [];

    if (mode === "pub" || mode === "both") {
      const wr = ctx.winrates && ctx.winrates[ctx.hero] && ctx.winrates[ctx.hero][ctx.bracket];
      if (wr) {
        parts.push(clamp((wr - 50) * 1.5, -8, 8));
        reasons.push({ text: pct(wr) + " in " + window.BRACKET_NAMES[ctx.bracket], kind: wr >= 51 ? "pos" : wr < 48 ? "neg" : "info" });
      }
    }
    if (mode !== "pub") {
      const tiers = mode === "pro1" ? [1] : mode === "pro2" ? [2] : [1, 2];
      const label = mode === "pro1" ? "Pro T1" : mode === "pro2" ? "Pro T2" : "Pro";
      const s = proStats(ctx.pro, ctx.hero, tiers);
      if (s.games > 0) {
        const contest = (s.picks + s.bans) / s.games; // Anteil der Spiele, in denen der Held gepickt oder gebannt wurde
        const wr = s.picks ? (s.wins / s.picks) * 100 : 50;
        const wrPart = (wr - 50) * 1.5 * (s.picks / (s.picks + 30)); // kleine Stichproben zählen weniger
        const p = clamp(wrPart + contest * 8 - 1, -8, 8);
        parts.push(p);
        if (s.picks + s.bans > 0) {
          const bits = [];
          if (s.picks >= 5) bits.push(pct(wr) + " WR");
          bits.push(Math.round(contest * 100) + " % umkämpft");
          reasons.push({ text: label + ": " + bits.join(" · "), kind: p >= 3 ? "pos" : p <= -2 ? "neg" : "info" });
        }
      }
    }
    const points = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
    return { points, reasons };
  }

  /**
   * ctx: { hero, pos, player (oder null für Random), allies: [{hero,pos}], enemies: [heroId],
   *        bracket, winrates: {id: {bracket: wr}}, matchups: {enemyId: {heroId: {games, wins}}}, weights }
   * Rückgabe: { hero, score, rating, reasons: [{text, kind}], vibe, parts }
   */
  function scoreHero(ctx) {
    const w = Object.assign({ comfort: 1, synergy: 1, needs: 1, meta: 1, counter: 1 }, ctx.weights || {});
    const tags = heroTags(ctx.hero);
    const reasons = [];
    let comfort = 0, synergy = 0, needs = 0, meta = 0, counter = 0;

    // Eigene Bewertung (Durchschnitt aus "ich" und "Mitspieler")
    let r = null, isWish = false;
    if (ctx.player) {
      const entry = ((ctx.player.pools || {})[ctx.pos] || []).find((e) => e.hero === ctx.hero);
      if (entry) { r = rating(entry); comfort = r.avg * 6; }
      else {
        // Wunschheld: eigene Sterne, sonst ein mittlerer Startwert – sonst landet er nie oben
        const w = wishEntries(ctx.player, ctx.pos).find((x) => x.hero === ctx.hero);
        if (w) {
          isWish = true;
          r = rating({ hero: ctx.hero, self: w.self || ctx.wishBaseline || 2.5 });
          r.unsure = !w.self;
          comfort = r.avg * 6 * (ctx.wishFactor == null ? 0.85 : ctx.wishFactor);
        }
      }
    }

    // Synergie mit gelockten Verbündeten
    for (const ally of ctx.allies) {
      const at = heroTags(ally.hero);
      const an = heroName(ally.hero);
      const combo = comboBonus(ctx.hero, ally.hero);
      if (combo) {
        synergy += combo[2];
        reasons.push({ text: "Combo: " + combo[3], kind: "pos" });
      }
      if (tags.includes("setup") && at.includes("followup")) {
        synergy += 5; reasons.push({ text: "Setup für " + an, kind: "pos" });
      } else if (tags.includes("followup") && at.includes("setup")) {
        synergy += 5; reasons.push({ text: "nutzt Setup von " + an, kind: "pos" });
      }
      if (tags.includes("save") && at.includes("scaling") && ally.pos === 1) {
        synergy += 4; reasons.push({ text: "Save für " + an, kind: "pos" });
      }
      if (tags.includes("scaling") && ctx.pos === 1 && at.includes("save")) {
        synergy += 3; reasons.push({ text: an + " kann dich retten", kind: "pos" });
      }
      if (tags.includes("armor-reduction") && at.includes("physical") && [1, 2].includes(ally.pos)) {
        synergy += 2; reasons.push({ text: "Rüstungsreduktion für " + an, kind: "pos" });
      }
      if (LANE_PARTNER[ctx.pos] === ally.pos) {
        if (tags.includes("lane") && at.includes("lane")) {
          synergy += 4; reasons.push({ text: "Kill-Lane mit " + an, kind: "pos" });
        } else if ((tags.includes("heal") || tags.includes("save")) && [1, 3].includes(ally.pos)) {
          synergy += 2; reasons.push({ text: "sichert Lane von " + an, kind: "pos" });
        }
      }
    }

    // Teambedarf: was fehlt dem Team noch?
    if (ctx.allies.length > 0) {
      const counts = {};
      for (const a of ctx.allies) for (const t of heroTags(a.hero)) counts[t] = (counts[t] || 0) + 1;
      for (const t of tags) {
        const info = window.TAG_INFO[t];
        if (info && info.need && (counts[t] || 0) < info.need) {
          needs += 5;
          reasons.push({ text: "bringt " + info.label, kind: "need" });
        }
      }
      const mag = counts.magic || 0, phy = counts.physical || 0;
      if (ctx.allies.length >= 2) {
        if (mag === 0 && tags.includes("magic")) { needs += 4; reasons.push({ text: "Magieschaden fehlt", kind: "need" }); }
        if (phy === 0 && tags.includes("physical")) { needs += 4; reasons.push({ text: "Physischer Schaden fehlt", kind: "need" }); }
      }
      if ((counts.scaling || 0) >= 2 && tags.includes("scaling") && ctx.pos !== 1) {
        needs -= 4; reasons.push({ text: "schon viel Late-Game", kind: "neg" });
      }
    }

    // Counter gegen Gegner
    const enemyTags = {};
    for (const e of ctx.enemies) for (const t of heroTags(e)) (enemyTags[t] = enemyTags[t] || []).push(e);
    if (tags.includes("anti-illusion") && enemyTags.illusions) {
      counter += 7;
      reasons.push({ text: "gut gegen Illus (" + enemyTags.illusions.map(heroName).join(", ") + ")", kind: "pos" });
    }
    for (const e of ctx.enemies) {
      const m = ctx.matchups && ctx.matchups[e] && ctx.matchups[e][ctx.hero];
      if (!m || m.games < 30) continue;
      // positiv = gut für uns; kleine Stichproben werden Richtung 0 gezogen
      const adv = (0.5 - m.wins / m.games) * (m.games / (m.games + 100));
      counter += clamp(adv * 120, -6, 6);
      if (Math.abs(adv) >= 0.02) {
        const pct = (adv * 100).toFixed(1).replace(".", ",");
        reasons.push(adv > 0
          ? { text: "stark gegen " + heroName(e) + " (+" + pct + " %)", kind: "pos" }
          : { text: "schwach gegen " + heroName(e) + " (" + pct + " %)", kind: "neg" });
      }
    }

    // Meta (Pubs und/oder Profi-Turniere)
    const m = metaPart(ctx);
    meta = m.points;
    reasons.push(...m.reasons);

    // Vibecheck (kein Abzug!)
    let vibe = null;
    if (ctx.player && ctx.player.vibecheck) {
      const v = ctx.player.vibecheck.find((x) => x.hero === ctx.hero);
      if (v) vibe = v.note || "Vibecheck nötig";
    }

    const score = w.comfort * comfort + w.synergy * synergy + w.needs * needs + w.meta * meta + w.counter * counter;
    // "Jetzt wäre die Gelegenheit": Wunschheld, der gerade situativ stark ist
    const situation = counter + needs + Math.max(0, meta);
    const chance = isWish && situation >= (ctx.chanceThreshold == null ? 8 : ctx.chanceThreshold);
    if (chance) reasons.unshift({ text: "jetzt wäre die Gelegenheit", kind: "need" });
    return { hero: ctx.hero, score, rating: r, reasons, vibe, wish: isWish, chance, situation,
      parts: { comfort, synergy, needs, meta, counter } };
  }

  /**
   * Vorschläge für einen Slot.
   * opts: { pos, player, allies, enemies, taken:Set, bracket, winrates, matchups, weights, recWeights, limit, tryLimit }
   * Rückgabe: { pool: [...] (nur eigener Pool), tryout: [...] (Wunschhelden + Empfehlungen, mit .kind) }
   */
  function suggest(opts) {
    const base = Object.assign({}, opts);
    const limit = opts.limit || 6;
    const score = (h, extra) => scoreHero(Object.assign({}, base, { hero: h }, extra || {}));
    const byScore = (a, b) => b.score - a.score;

    // Random-Slot: Helden, die für die Position üblich sind
    if (!opts.player) {
      const pool = Object.keys(window.DOTA_TAGS).map(Number)
        .filter((h) => window.HERO_BY_ID[h] && !opts.taken.has(h) && heroPositions(h).includes(opts.pos))
        .map((h) => score(h)).sort(byScore).slice(0, limit);
      return { pool, tryout: [], wishes: [] };
    }

    const poolIds = ((opts.player.pools || {})[opts.pos] || []).map((e) => e.hero);
    const pool = poolIds.filter((h) => !opts.taken.has(h)).map((h) => score(h)).sort(byScore).slice(0, limit);

    // Zum Ausprobieren: erst eigene Wunschhelden, dann Counter-/Meta-Empfehlungen außerhalb des Pools
    const tryLimit = opts.tryLimit || 3;
    const wishIds = wishEntries(opts.player, opts.pos).map((w) => w.hero)
      .filter((h) => !opts.taken.has(h) && !poolIds.includes(h));
    const wishes = wishIds.map((h) => Object.assign(score(h), { kind: "wish" })).sort(byScore);
    const recW = Object.assign({}, opts.weights, opts.recWeights || {});
    const recs = Object.keys(window.DOTA_TAGS).map(Number)
      .filter((h) => window.HERO_BY_ID[h] && !opts.taken.has(h) && !poolIds.includes(h) && !wishIds.includes(h) && heroPositions(h).includes(opts.pos))
      .map((h) => {
        const s = score(h, { weights: recW });
        s.kind = s.parts.counter >= 4 ? "counter" : s.parts.meta >= 3 ? "meta" : "team";
        return s;
      })
      .sort(byScore);
    const tryout = wishes.concat(recs).slice(0, Math.max(tryLimit, Math.min(wishes.length, tryLimit + 2)));
    // wishes zusätzlich einzeln zurückgeben – für die Erinnerungsleiste über dem Slot
    return { pool, tryout, wishes };
  }

  // Welche Positionen sind laut Pick-Reihenfolge als Nächstes dran?
  function nextPositions(steps, lockedPositions) {
    for (const step of steps) {
      const open = step.filter((p) => !lockedPositions.includes(p));
      if (open.length) return open;
    }
    return [];
  }

  window.Logic = { POSITIONS, heroTags, heroPositions, heroTip, heroName, rating, wishEntries, lineupPlayers, lineupsFor, generateLineups, sameAssign, laneConflicts, LANE_OF, LANE_NAMES, evaluatePlay, evaluatePlays, autoPlays, playHeroesFor, scoreHero, suggest, nextPositions, comboBonus, proStats, metaPart };
})();
