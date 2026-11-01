// UI: Lobby → Aufstellung → Draft, dazu Spielerübersicht und Admin.
(function () {
  const CFG = window.DOTA_CONFIG;
  const L = window.Logic;
  const OD = window.OpenDota;
  window.HERO_BY_ID = {};
  for (const h of window.DOTA_HEROES) window.HERO_BY_ID[h.id] = h;
  const HERO_BY_NAME = {};
  for (const h of window.DOTA_HEROES) HERO_BY_NAME[h.name.toLowerCase()] = h.id;

  // ---------- Speicher ----------
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignorieren */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignorieren */ } }
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // Pool sortieren: eigene Sterne ↓, dann Team-Sterne ↓, dann Name A–Z
  function sortPool(pool) {
    const nm = (id) => (window.HERO_BY_ID[id] ? window.HERO_BY_ID[id].name : "");
    return pool.sort((a, b) => (b.self || 0) - (a.self || 0) || (b.team || 0) - (a.team || 0) || nm(a.hero).localeCompare(nm(b.hero)));
  }

  // Ältere Formate (comfort 1-3, positionPref) ins aktuelle Format bringen
  function normalizeDb(d) {
    d.players = d.players || [];
    d.lineups = d.lineups || [];
    // Lane-Konflikte: [{a, b, note}] – diese beiden wollen nicht zusammen auf eine Lane
    d.conflicts = (d.conflicts || []).filter((c) => c.a && c.b && c.a !== c.b);
    // Eigene Draft-Ideen und ausgeblendete Vorlagen aus data/plays.js
    d.plays = d.plays || [];
    d.hiddenPlays = d.hiddenPlays || [];
    for (const p of d.players) {
      p.pools = p.pools || {};
      p.tryout = p.tryout || {};
      // Wunschhelden: alte Form [heroId] → [{hero, self?}]
      for (const pos of L.POSITIONS) {
        if (p.tryout[pos]) p.tryout[pos] = p.tryout[pos].map((w) => (typeof w === "number" ? { hero: w } : w));
      }
      p.vibecheck = p.vibecheck || [];
      for (const pos of L.POSITIONS) {
        p.pools[pos] = sortPool((p.pools[pos] || []).map((e) => {
          if (e.self == null && e.comfort != null) return { hero: e.hero, self: { 1: 2, 2: 3, 3: 5 }[e.comfort] || 3 };
          return e;
        }));
      }
      // Rollen-Rangfolge: roles = { pos: rang } (1 = Lieblingsrolle). Fehlt eine Position = spielt sie nicht.
      if (!p.roles) {
        p.roles = {};
        const pref = p.positionPref || {};
        L.POSITIONS.filter((x) => pref[x]).sort((a, b) => pref[b] - pref[a]).forEach((x, i) => (p.roles[x] = i + 1));
      }
      delete p.positionPref;
    }
    return d;
  }

  // Lokale Admin-Änderungen verwerfen, sobald die Repo-Datei denselben Stand hat (z.B. nach Export + Hochladen)
  const repoDb = normalizeDb(clone(window.DOTA_PLAYERS));
  if (JSON.stringify(normalizeDb(store.get("dd:players", null) || {})) === JSON.stringify(repoDb)) store.del("dd:players");
  let db = normalizeDb(store.get("dd:players", null) || clone(repoDb));
  let dbDirty = !!store.get("dd:players", null);
  function saveDb() { store.set("dd:players", db); dbDirty = true; }

  const defaultSession = () => ({
    selected: [], assign: {}, locks: {}, enemies: [], bans: [], history: [], manual: {},
    order: CFG.pickOrders[0].id, metaMode: CFG.metaModes[0].id
  });
  let S = Object.assign(defaultSession(), store.get("dd:session", {}));
  function saveSession() { store.set("dd:session", S); }

  // ---------- Admin-Bereich ----------
  // Der Admin steckt komplett in nur-lokal/admin.js. Diese Datei liegt nicht auf GitHub,
  // online gibt es den Bereich also gar nicht – nichts zu erraten, nichts freizuschalten.
  let Admin = null;
  const hasAdmin = () => Admin !== null;

  function loadAdmin() {
    return new Promise((done) => {
      const s = document.createElement("script");
      s.src = "nur-lokal/admin.js";
      s.onload = () => {
        try {
          Admin = window.ADMIN_UI(adminApi());
          Object.assign(actions, Admin.actions);
          Object.assign(heroActions, Admin.heroActions);
        } catch (e) {
          console.warn("Admin-Bereich konnte nicht geladen werden", e);
          Admin = null;
        }
        done();
      };
      s.onerror = () => done();   // online schlicht nicht vorhanden
      document.head.appendChild(s);
    });
  }

  // Werkzeugkasten, den nur-lokal/admin.js bekommt
  function adminApi() {
    return {
      esc, img, heroName, posLabel, posTag, heroInput, roleHint, diffLabel, stars, ratingHtml,
      L, CFG, store, clone, sortPool, normalizeDb, allPlays, player, render, go, S, saveSession, saveDb,
      getDb: () => db,
      setDb: (next) => { db = next; },
      resetDb: () => { db = clone(repoDb); dbDirty = false; },
      isDirty: () => dbDirty
    };
  }

  const player = (id) => db.players.find((p) => p.id === id) || null;
  const pname = (id) => { const p = player(id); return p ? p.name : "?"; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const heroName = (id) => (window.HERO_BY_ID[id] ? window.HERO_BY_ID[id].name : "?");
  const img = (id, cls) => {
    const h = window.HERO_BY_ID[id];
    return h ? `<img class="${cls || "hero-img"}" loading="lazy" alt="${esc(h.name)}" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${h.short}.png">` : "";
  };
  const stars = (n) => { n = Math.round(n || 0); return `<span class="stars">${"★".repeat(n)}<span class="dim">${"★".repeat(5 - n)}</span></span>`; };
  const posLabel = (p) => `<span class="pos pos-${p}">Pos ${p}</span> ${window.POSITION_NAMES[p]}`;
  const posTag = (p) => `<span class="pos pos-${p}">Pos ${p}</span>`;

  // Rollen eines Spielers in Wunsch-Reihenfolge (ohne Angabe: Positionen mit Pool)
  function rolesOrdered(p) {
    const ranked = L.POSITIONS.filter((x) => p.roles[x]).sort((a, b) => p.roles[a] - p.roles[b]);
    return ranked.length ? ranked : L.POSITIONS.filter((x) => (p.pools[x] || []).length);
  }
  // Hinweis "2. Wahl" / "keine Wunschrolle" für Spieler p auf Position pos
  function roleHint(p, pos) {
    if (!p || !Object.keys(p.roles).length) return "";
    const r = p.roles[pos];
    return r ? `<span class="role-hint r${r}">${r}. Wahl</span>` : `<span class="role-hint none">keine Wunschrolle</span>`;
  }
  function roleList(p) {
    const ranked = L.POSITIONS.filter((x) => p.roles[x]).sort((a, b) => p.roles[a] - p.roles[b]);
    return ranked.map((x) => `<span class="role-chip">${p.roles[x]}. ${posTag(x)}</span>`).join(" ");
  }

  // "Ich ★★★★☆ · Team ★★★☆☆ · Δ −1"
  function ratingHtml(r) {
    if (!r) return "";
    if (r.unsure) return `<span class="rating unsure" title="Wunschheld ohne eigene Bewertung – angenommener Mittelwert">
      <span class="r-lbl">geschätzt</span>${stars(r.self)}</span>`;
    let h = `<span class="rating"><span class="r-lbl">Ich</span>${stars(r.self)}`;
    if (r.team) {
      h += ` <span class="r-lbl">Team</span>${stars(r.team)}`;
      if (r.delta !== 0) h += ` <span class="delta ${r.delta > 0 ? "up" : "down"}" title="Mitspieler minus eigene Bewertung">Δ ${r.delta > 0 ? "+" : "−"}${Math.abs(r.delta)}</span>`;
      else h += ` <span class="delta" title="Mitspieler minus eigene Bewertung">Δ 0</span>`;
    }
    return h + "</span>";
  }

  function heroInput(action, placeholder, extra) {
    return `<input class="hero-input" list="hero-list" placeholder="${esc(placeholder || "Held suchen…")}" data-action="${action}" ${extra || ""}>`;
  }
  function resolveHero(value) {
    return HERO_BY_NAME[String(value || "").trim().toLowerCase()] || null;
  }

  // ---------- Routing ----------
  const app = document.getElementById("app");
  function route() { return (location.hash.replace(/^#\/?/, "") || "lobby").split("?")[0]; }
  function go(r) { location.hash = "#/" + r; }
  window.addEventListener("hashchange", render);

  function render() {
    const r = route();
    document.querySelectorAll("[data-nav]").forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === r);
      if (a.dataset.nav === "admin") a.hidden = !hasAdmin();
    });
    const views = { lobby: viewLobby, aufstellung: viewLineups, draft: viewDraft, ideen: viewPlays, spieler: viewPlayers, admin: viewAdmin };
    app.innerHTML = (views[r] || viewLobby)();
    const src = document.getElementById("meta-source");
    if (src) src.textContent = OD.state.source === "live" ? "Meta: OpenDota live" : "Meta: Snapshot (offline)";
  }

  // ---------- Lobby ----------
  function viewLobby() {
    const cards = db.players.map((p) => {
      const on = S.selected.includes(p.id);
      const pos = rolesOrdered(p);
      return `<button class="player-card ${on ? "on" : ""}" data-action="toggle-player" data-id="${esc(p.id)}">
        <div class="pc-name">${esc(p.name)}</div>
        <div class="pc-sub">${Object.keys(p.roles).length ? roleList(p) : pos.map(posTag).join(" ") || '<span class="muted small">noch keine Rollen</span>'}</div>
        ${p.vibecheck.length ? `<div class="pc-vibe">⚠️ ${p.vibecheck.length}× Vibecheck</div>` : ""}
      </button>`;
    }).join("");
    const m = S.selected.length ? L.lineupsFor(S.selected, db.lineups) : { exact: [], partial: [] };
    const hint = S.selected.length
      ? `<span class="muted small">Gleich siehst du mögliche Aufstellungen${m.exact.length + m.partial.length ? `, davon ${m.exact.length + m.partial.length} gemerkt` : ""}</span>`
      : "";
    return `<section>
      <h1>Wer spielt mit?</h1>
      <p class="muted">Wähle 1–5 Spieler. Danach schlägt die App mögliche Aufstellungen vor, du suchst dir eine aus.</p>
      <div class="player-grid">${cards || '<p class="muted">Noch keine Spieler. Leg welche im Admin-Bereich an.</p>'}</div>
      <div class="actions">
        <button class="btn primary" data-action="to-lineups" ${S.selected.length ? "" : "disabled"}>Weiter zur Aufstellung (${S.selected.length}/5) →</button>
        ${hint}
      </div>
    </section>`;
  }

  // ---------- Aufstellung ----------
  // opts: { title, highlight, action, id, idx }
  function lineupCard(assign, o) {
    const rows = L.POSITIONS.map((pos) => {
      const pid = assign[pos];
      const inGame = pid && S.selected.includes(pid);
      if (!inGame) return `<li class="random">${posLabel(pos)} <b>Random</b></li>`;
      const p = player(pid);
      const pool = (p.pools[pos] || []).slice().sort((a, b) => L.rating(b).avg - L.rating(a).avg).slice(0, 5);
      return `<li>${posLabel(pos)} <b>${esc(p.name)}</b> ${roleHint(p, pos)}
        <span class="mini-pool">${pool.map((e) => img(e.hero, "hero-mini")).join("")}</span></li>`;
    }).join("");
    const attrs = o.id != null ? `data-id="${esc(o.id)}"` : `data-idx="${o.idx}"`;
    return `<div class="path-card ${o.highlight ? "best" : ""} ${o.conflict ? "conflict" : ""}">
      ${o.title ? `<div class="path-head">${o.title}</div>` : ""}
      <ul class="path-list">${rows}</ul>
      <div class="row-btns">
        <button class="btn ${o.highlight ? "primary" : ""}" data-action="${o.action}" ${attrs}>Diese Aufstellung →</button>
        ${o.saveIdx != null ? `<button class="btn small" data-action="save-suggestion" data-idx="${o.saveIdx}" title="Merkt sich die Aufstellung für diese Gruppe">☆ Merken</button>` : ""}
        ${o.forgetId ? `<button class="btn small danger" data-action="forget-lineup" data-id="${esc(o.forgetId)}" title="Gemerkte Aufstellung löschen">🗑 Vergessen</button>` : ""}
      </div>
    </div>`;
  }

  function viewLineups() {
    if (!S.selected.length) return `<section><p>Erst Spieler wählen.</p><a class="btn" href="#/lobby">Zur Lobby</a></section>`;
    const m = L.lineupsFor(S.selected, db.lineups);
    const players = S.selected.map(player).filter(Boolean);
    const suggestions = L.generateLineups(players, 6, db.conflicts);
    viewLineups.cache = suggestions;
    const saved = m.exact.concat(m.partial);
    const suggCards = suggestions.map((s, i) => {
      const known = saved.find((l) => L.sameAssign(l.assign, s.assign));
      const ranked = L.POSITIONS.filter((pos) => s.assign[pos] && s.ranks[pos]).length;
      const title = i === 0 && !s.conflicts.length ? "⭐ Empfehlung" : "Alternative " + (i || 1);
      const badge = s.conflicts.length ? s.conflicts.map((c) => `<span class="lineup-badge bad" title="${esc(c.note || "nicht zusammen auf eine Lane")}">⚠️ ${esc(pname(c.a))} &amp; ${esc(pname(c.b))} zusammen auf der ${esc(c.laneName)}</span>`).join(" ")
        : s.allFirst ? '<span class="lineup-badge good">alle auf 1. Wahl</span>'
        : ranked < players.length ? '<span class="lineup-badge warn">nicht für alle Wunschrolle</span>' : "";
      const note = known && known.note ? `<span class="muted small">${esc(known.note)}</span>` : known ? '<span class="muted small">gemerkt</span>' : "";
      const fits = L.evaluatePlays(allPlays(), playsContext(s.assign, {})).filter((e) => e.status === "offen");
      const ideas = fits.length ? `<span class="idea-chip" title="${esc(fits.slice(0, 4).map((e) => e.play.name).join(" · "))}">💡 ${fits.length} Idee${fits.length === 1 ? "" : "n"}</span>` : "";
      return lineupCard(s.assign, { title: `${title} ${badge} ${ideas} ${note}`, highlight: i === 0 && !s.conflicts.length, conflict: s.conflicts.length > 0, action: "choose-suggestion", idx: i, saveIdx: known ? null : i });
    }).join("");

    const opts = (pos) => [`<option value="">Random</option>`].concat(S.selected.map((id) =>
      `<option value="${esc(id)}" ${S.manual[pos] === id ? "selected" : ""}>${esc(pname(id))}${player(id).roles[pos] ? ` (${player(id).roles[pos]}. Wahl)` : ""}</option>`)).join("");
    const manual = `<div class="path-card manual-card">
      <div class="path-head">Selbst zuordnen</div>
      <ul class="path-list">${L.POSITIONS.map((pos) => `<li>${posLabel(pos)} <select data-action="manual-pos" data-pos="${pos}">${opts(pos)}</select></li>`).join("")}</ul>
      <div class="row-btns">
        <button class="btn" data-action="choose-manual">Damit draften →</button>
        <button class="btn small" data-action="save-manual" title="Speichert die Zuordnung als Aufstellung (Admin-Daten)">Als Aufstellung speichern</button>
      </div>
    </div>`;
    return `<section>
      <h1>Wer spielt was?</h1>
      <p class="muted">Mögliche Aufstellungen für ${S.selected.map((id) => esc(pname(id))).join(", ")}, sortiert nach euren Rollen-Vorlieben (1. Wahl zuerst) und der Größe der Heldenpools. Such dir eine aus.</p>
      <div class="path-grid">${suggCards}</div>
      ${saved.length ? `<h2 class="section-h">Gemerkte Aufstellungen</h2>
        <div class="path-grid">${saved.map((l) => {
          const cl = L.laneConflicts(l.assign, db.conflicts).filter((c) => S.selected.includes(c.a) && S.selected.includes(c.b));
          return lineupCard(l.assign, {
            title: (l.note ? esc(l.note) : "Gemerkt") + cl.map((c) => ` <span class="lineup-badge bad">⚠️ ${esc(pname(c.a))} &amp; ${esc(pname(c.b))} auf der ${esc(c.laneName)}</span>`).join(""),
            conflict: cl.length > 0, action: "choose-lineup", id: l.id, forgetId: l.id
          });
        }).join("")}</div>` : ""}
      <h2 class="section-h">Oder selbst zuordnen</h2>
      <div class="path-grid">${manual}</div>
    </section>`;
  }

  function startDraft(assign) {
    S.assign = {};
    for (const pos of L.POSITIONS) S.assign[pos] = assign[pos] && S.selected.includes(assign[pos]) ? assign[pos] : null;
    S.locks = {}; S.history = []; S.play = null;
    saveSession(); go("draft");
  }

  // ---------- Draft ----------
  function draftContext() {
    const allies = Object.keys(S.locks).map(Number).map((pos) => ({ pos, hero: S.locks[pos] }));
    const taken = new Set([...allies.map((a) => a.hero), ...S.enemies, ...S.bans]);
    return { allies, taken };
  }

  const TRY_LABEL = { wish: "⭐ Wunschheld", counter: "🎯 Counter-Tipp", meta: "📈 Meta-Tipp", team: "🧩 passt ins Team" };

  // ---------- Draft-Ideen ----------
  function playsContext(assign, locks) {
    const players = {};
    for (const p of db.players) players[p.id] = p;
    const l = locks || {};
    const taken = new Set([...Object.values(l), ...S.enemies, ...S.bans]);
    return { assign: assign || {}, players, locks: l, taken };
  }
  // Vorlagen aus data/plays.js (ohne ausgeblendete) + eure eigenen Ideen
  const allPlays = () => (window.DOTA_PLAYS || []).filter((p) => !db.hiddenPlays.includes(p.id))
    .concat(db.plays.map((p) => Object.assign({}, p, { custom: true })));
  function activePlay() {
    if (!S.play) return null;
    const ctx = playsContext(S.assign, S.locks);
    const found = allPlays().find((p) => p.id === S.play) || L.autoPlays(ctx, 12).find((p) => p.id === S.play);
    return found ? L.evaluatePlay(found, ctx) : null;
  }

  // Die ganze Karte ist der Lock-Button – ein Klick genügt.
  function suggRow(s, pos, kind, planned) {
    const shown = s.reasons.slice(0, 3);
    const chips = shown.map((r) => `<span class="chip ${r.kind}">${esc(r.text)}</span>`).join("")
      + (s.reasons.length > shown.length ? `<span class="chip more" title="${esc(s.reasons.slice(3).map((r) => r.text).join(" · "))}">+${s.reasons.length - shown.length}</span>` : "");
    const p = s.parts;
    const title = `${heroName(s.hero)} locken\n${L.heroTip(s.hero)}\n\nBewertung ${Math.round(p.comfort)} · Synergie ${Math.round(p.synergy)} · Teambedarf ${Math.round(p.needs)} · Meta ${Math.round(p.meta)} · Counter ${Math.round(p.counter)}`;
    return `<button class="sugg ${kind ? "try" : ""} ${planned ? "planned" : ""}" data-action="lock" data-pos="${pos}" data-hero="${s.hero}" title="${esc(title)}">
      ${img(s.hero)}
      <div class="sugg-body">
        <div class="sugg-title"><b>${esc(heroName(s.hero))}</b>
          <span class="score">${Math.round(s.score)}</span>
        </div>
        <div class="sugg-labels">
          ${planned ? '<span class="plan-label">💡 Idee</span>' : ""}
          ${kind ? `<span class="try-label">${TRY_LABEL[kind]}</span>` : ""}
          ${ratingHtml(s.rating)}
        </div>
        ${s.vibe ? `<div class="vibe">⚠️ ${esc(s.vibe)}</div>` : ""}
        <div class="chips">${chips}</div>
      </div>
    </button>`;
  }

  function slotView(pos, isNext) {
    const pid = S.assign[pos];
    const p = pid ? player(pid) : null;
    const locked = S.locks[pos];
    const options = [`<option value="">Random</option>`].concat(
      S.selected.map((id) => player(id)).filter(Boolean).map((pl) => `<option value="${esc(pl.id)}" ${pl.id === pid ? "selected" : ""}>${esc(pl.name)}</option>`)
    ).join("");
    const head = `<div class="slot-head">
      <div>${posLabel(pos)} ${isNext ? '<span class="next-badge">Als Nächstes</span>' : ""} ${roleHint(p, pos)}</div>
      <select data-action="slot-player" data-pos="${pos}">${options}</select>
    </div>`;

    if (locked) {
      const vibe = p && p.vibecheck.find((v) => v.hero === locked);
      const entry = p && (p.pools[pos] || []).find((e) => e.hero === locked);
      return `<div class="slot locked">${head}
        <div class="locked-hero">${img(locked, "hero-big")}<div><div class="lh-name">${esc(heroName(locked))}</div>
        ${entry ? ratingHtml(L.rating(entry)) : ""}
        <div class="muted small">${esc(L.heroTip(locked))}</div>
        ${vibe ? `<div class="vibe">⚠️ Vibecheck: ${esc(vibe.note)}</div>` : ""}</div></div>
        <button class="btn small" data-action="unlock" data-pos="${pos}">Entsperren</button>
      </div>`;
    }

    const { allies, taken } = draftContext();
    const res = L.suggest({
      pos, player: p, allies, enemies: S.enemies, taken, bracket: CFG.bracket, metaMode: S.metaMode, pro: OD.state.pro,
      winrates: OD.state.winrates, matchups: OD.state.matchups, weights: CFG.weights, recWeights: CFG.recWeights,
      wishBaseline: CFG.wishBaseline, wishFactor: CFG.wishFactor, chanceThreshold: CFG.chanceThreshold,
      limit: CFG.suggestions + 6, tryLimit: CFG.tryoutSuggestions
    });
    // Helden der aktiven Idee nach oben holen
    const planHeroes = L.playHeroesFor(activePlay(), pos);
    const planned = res.pool.filter((s) => planHeroes.includes(s.hero));
    const rest = res.pool.filter((s) => !planHeroes.includes(s.hero)).slice(0, Math.max(2, CFG.suggestions - planned.length));
    res.pool = planned.concat(rest);
    // Erinnerungsleiste: Wunschhelden dieser Position als Icons, Klick lockt direkt
    const wishBar = res.wishes && res.wishes.length ? `<div class="wish-bar ${res.wishes.some((w) => w.chance) ? "hot" : ""}">
      <span class="wish-lbl" title="Helden, die ${esc(p.name)} mal ausprobieren will">⭐</span>
      ${res.wishes.slice(0, 6).map((w) => `<button class="wish-pick ${w.chance ? "chance" : ""}" data-action="lock" data-pos="${pos}" data-hero="${w.hero}"
        title="${esc(heroName(w.hero) + " locken" + (w.rating && !w.rating.unsure ? " · " + w.rating.self + " ★" : " · noch ohne Bewertung") + (w.chance ? "\njetzt wäre die Gelegenheit: " + w.reasons.filter((r) => !r.text.startsWith("jetzt wäre")).slice(0, 3).map((r) => r.text).join(" · ") : ""))}">
        ${img(w.hero, "hero-mini")}${w.chance ? '<span class="chance-dot">!</span>' : ""}</button>`).join("")}
    </div>` : "";
    const empty = p && !res.pool.length ? `<p class="muted small">Kein freier Held im Pool von ${esc(p.name)} für Pos ${pos}.</p>` : "";
    const hotWish = res.tryout.some((s) => s.chance);
    const tryout = res.tryout.length ? `<details class="tryout"${(S.openTry && S.openTry[pos]) || hotWish ? " open" : ""} data-pos="${pos}">
        <summary>Zum Ausprobieren (${res.tryout.length})${hotWish ? ' <span class="chip need">Gelegenheit</span>' : ""}</summary>
        <div class="sugg-list">${res.tryout.map((s) => suggRow(s, pos, s.kind)).join("")}</div>
      </details>` : "";
    if (!p) {
      return `<div class="slot random ${isNext ? "next" : ""}">${head}
        <details class="tryout"${S.openTry && S.openTry[pos] ? " open" : ""} data-pos="${pos}">
          <summary>Ideen für den Random (${res.pool.length})</summary>
          <div class="sugg-list">${res.pool.map((s) => suggRow(s, pos, null)).join("")}</div>
        </details>
        <div class="manual">${heroInput("lock-manual", "Pick des Randoms eintragen…", `data-pos="${pos}"`)}</div>
      </div>`;
    }
    return `<div class="slot ${isNext ? "next" : ""}">${head}
      ${wishBar}
      <div class="sugg-list">${res.pool.map((s) => suggRow(s, pos, null, planHeroes.includes(s.hero))).join("")}${empty}</div>
      ${tryout}
      <div class="manual">${heroInput("lock-manual", "Anderen Helden locken…", `data-pos="${pos}"`)}</div>
    </div>`;
  }

  const planBadge = (play) => {
    const i = window.PLAN_INFO[play.plan];
    return i ? `<span class="plan-tag" title="${esc(i.hint)}">${esc(i.label)}</span>` : "";
  };
  const diffLabel = (n) => ["", "einfach", "Absprache nötig", "braucht Koordination"][n || 1];

  function playSlotLine(s) {
    const icons = (s.options.length ? s.options : s.heroes.map((h) => ({ hero: h, rating: null })))
      .slice(0, 4).map((o) => `<span class="plan-hero ${o.rating ? "" : "dim"}" title="${esc(heroName(o.hero))}${o.rating ? " · " + o.rating.avg.toFixed(1).replace(".", ",") + " ★" : " (nicht im Pool)"}">${img(o.hero, "hero-mini")}</span>`).join("");
    const who = s.playerId ? esc(pname(s.playerId)) : '<span class="muted">unbesetzt</span>';
    const state = { erledigt: "✓", verpasst: "✗", blockiert: "✗", unbesetzt: "–" }[s.state] || "";
    return `<li class="${s.state}">${posTag(s.pos)} <b>${who}</b> ${s.label ? `<span class="muted small">${esc(s.label)}</span>` : ""}
      <span class="plan-heroes">${icons}</span> <span class="plan-state">${state}</span></li>`;
  }

  function playCard(ev, active) {
    const p = ev.play;
    const statusChip = { fertig: '<span class="chip pos">komplett</span>', blockiert: '<span class="chip neg">Held weg</span>', unpassend: '<span class="chip neg">Position unbesetzt</span>' }[ev.status] || "";
    return `<div class="play-card ${active ? "active" : ""} ${ev.status}">
      <div class="play-head"><b>${esc(p.name)}</b> ${planBadge(p)} ${p.auto ? '<span class="chip info">automatisch</span>' : ""} ${statusChip}
        <span class="play-progress">${ev.done}/${ev.total}</span></div>
      <div class="muted small">${esc(p.idea)}</div>
      <ul class="plan-slots">${ev.slots.map(playSlotLine).join("")}</ul>
      ${p.tips && p.tips.length ? `<ul class="plan-tips">${p.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${p.strongVs ? `<div class="small"><span class="chip pos">stark gegen</span> ${esc(p.strongVs)}</div>` : ""}
      ${p.careful ? `<div class="small"><span class="chip neg">Achtung</span> ${esc(p.careful)}</div>` : ""}
      <div class="row-btns">
        ${active ? `<button class="btn small" data-action="stop-play">Idee beenden</button>`
          : `<button class="btn small primary" data-action="use-play" data-id="${esc(p.id)}" ${ev.status === "unpassend" || ev.status === "blockiert" ? "disabled" : ""}>Als Plan nehmen</button>`}
        <span class="muted small">${esc(diffLabel(p.difficulty))}</span>
      </div>
    </div>`;
  }

  function playBar() {
    const ctx = playsContext(S.assign, S.locks);
    const active = activePlay();
    if (active) {
      return `<div class="play-bar"><div class="play-bar-head">💡 Aktive Idee</div>${playCard(active, true)}</div>`;
    }
    const curated = L.evaluatePlays(allPlays(), ctx).filter((e) => e.status === "offen").slice(0, 3);
    const auto = L.evaluatePlays(L.autoPlays(ctx, 6), ctx).filter((e) => e.status === "offen").slice(0, 2);
    if (!curated.length && !auto.length) return "";
    return `<details class="play-bar" ${S.openPlays ? "open" : ""} data-plays>
      <summary>💡 Draft-Ideen (${curated.length + auto.length})</summary>
      <div class="play-grid">${curated.map((e) => playCard(e, false)).join("")}</div>
      ${auto.length ? `<div class="sub-head">Automatisch gefunden</div><div class="play-grid">${auto.map((e) => playCard(e, false)).join("")}</div>` : ""}
    </details>`;
  }

  function conflictWarning() {
    const cl = L.laneConflicts(S.assign, db.conflicts);
    if (!cl.length) return "";
    return `<div class="conflict-bar">⚠️ Lane-Konflikt: ${cl.map((c) =>
      `<b>${esc(pname(c.a))}</b> &amp; <b>${esc(pname(c.b))}</b> stehen zusammen auf der ${esc(c.laneName)}${c.note ? ` – ${esc(c.note)}` : ""}`).join(" · ")}</div>`;
  }

  function proInfo() {
    const p = OD.state.pro;
    if (!p || S.metaMode === "pub") return "";
    return `${p.games[1] || 0} T1- + ${p.games[2] || 0} T2-Spiele, letzte ${p.days} Tage${OD.state.proSource === "live" ? "" : " (Snapshot " + p.date + ")"}`;
  }

  function teamSummary() {
    const heroes = Object.values(S.locks);
    if (!heroes.length) return "";
    const counts = {}, who = {};
    for (const h of heroes) for (const t of L.heroTags(h)) { counts[t] = (counts[t] || 0) + 1; (who[t] = who[t] || []).push(heroName(h)); }
    const needs = Object.entries(window.TAG_INFO).filter(([, i]) => i.need).map(([t, i]) => {
      const ok = (counts[t] || 0) >= i.need;
      const title = who[t] ? who[t].join(", ") : "noch niemand";
      return `<span class="chip ${ok ? "pos" : "neg"}" title="${esc(title)}">${ok ? "✓" : "✗"} ${esc(i.label)} ${counts[t] || 0}/${i.need}</span>`;
    }).join("");
    const mix = `<span class="chip info">Magie ${counts.magic || 0} · Physisch ${counts.physical || 0}</span>`;
    return `<div class="team-summary"><b>Team-Check:</b> ${needs} ${mix}</div>`;
  }

  function viewDraft() {
    if (!S.selected.length) {
      return `<section><p>Noch kein Team. Starte in der Lobby.</p><a class="btn" href="#/lobby">Zur Lobby</a></section>`;
    }
    const order = CFG.pickOrders.find((o) => o.id === S.order) || CFG.pickOrders[0];
    const lockedPos = Object.keys(S.locks).map(Number);
    let next = order.id === "free" ? [] : L.nextPositions(order.steps, lockedPos);
    // Läuft eine Idee, gibt ihre Reihenfolge den Takt vor (Setup vor Payoff)
    const act = activePlay();
    if (act) {
      const open = (act.play.order || act.slots.map((s) => s.pos)).filter((pos) => act.slots.some((s) => s.pos === pos && s.state === "offen"));
      if (open.length) next = [open[0]];
    }
    const displayOrder = order.steps.flat().filter((v, i, a) => a.indexOf(v) === i);

    const enemySlots = S.enemies.map((h) => `<span class="enemy">${img(h, "hero-mini")} ${esc(heroName(h))}
      <button class="x" data-action="rm-enemy" data-hero="${h}" title="Entfernen">×</button></span>`).join("");
    const banSlots = S.bans.map((h) => `<span class="enemy ban">${img(h, "hero-mini")} ${esc(heroName(h))}
      <button class="x" data-action="rm-ban" data-hero="${h}" title="Entfernen">×</button></span>`).join("");

    return `<section>
      <div class="draft-bar">
        <label>Pick-Reihenfolge <select data-action="set-order">${CFG.pickOrders.map((o) => `<option value="${o.id}" ${o.id === S.order ? "selected" : ""}>${esc(o.name)}</option>`).join("")}</select></label>
        <label>Meta <select data-action="set-meta">${CFG.metaModes.map((m) => `<option value="${m.id}" ${m.id === S.metaMode ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select></label>
        <span class="muted small" title="Profi-Daten: OpenDota-Ligen Tier 1 (premium) und Tier 2 (professional)">${proInfo()}</span>
        <span class="spacer"></span>
        <button class="btn small" data-action="undo" ${S.history.length ? "" : "disabled"}>↶ Rückgängig</button>
        <button class="btn small" data-action="reset-draft">Draft zurücksetzen</button>
      </div>
      <div class="enemy-bar">
        <div><b>Gegner</b> <span class="muted small">(optional, für Counter-Tipps)</span>
          <div class="enemy-list">${enemySlots}${S.enemies.length < 5 ? heroInput("add-enemy", "Gegnerpick hinzufügen…") : ""}</div></div>
        <div><b>Bans</b>
          <div class="enemy-list">${banSlots}${heroInput("add-ban", "Ban hinzufügen…")}</div></div>
      </div>
      ${conflictWarning()}
      ${playBar()}
      ${teamSummary()}
      <div class="slots">${displayOrder.map((pos) => slotView(pos, next.includes(pos))).join("")}</div>
    </section>`;
  }

  // ---------- Spielerübersicht ----------
  function viewPlayers() {
    const cards = db.players.map((p) => {
      const pools = L.POSITIONS.filter((pos) => (p.pools[pos] || []).length || (p.tryout[pos] || []).length).map((pos) => {
        const entries = (p.pools[pos] || []).slice().sort((a, b) => L.rating(b).avg - L.rating(a).avg);
        const tries = L.wishEntries(p, pos);
        return `<div class="pool-row">${posLabel(pos)}
          ${entries.map((e) => `<div class="pool-line">${img(e.hero, "hero-mini")} <span class="pl-name">${esc(heroName(e.hero))}</span>${ratingHtml(L.rating(e))}</div>`).join("")}
          ${tries.length ? `<div class="pool-line muted small">Will ausprobieren: ${tries.map((w) => esc(heroName(w.hero)) + (w.self ? ` (${w.self} ★)` : "")).join(", ")}</div>` : ""}
        </div>`;
      }).join("");
      const vibe = p.vibecheck.map((v) => `<div class="vibe">${img(v.hero, "hero-mini")} <b>${esc(heroName(v.hero))}</b> – ${esc(v.note)}</div>`).join("");
      const roles = Object.keys(p.roles).length ? `<div class="pc-roles"><span class="muted small">Rollen:</span> ${roleList(p)}</div>` : "";
      return `<div class="pcard"><h2>${esc(p.name)}</h2>${roles}${pools || '<p class="muted small">Noch kein Pool.</p>'}
        ${vibe ? `<h3>⚠️ Vibecheck-Liste</h3>${vibe}` : ""}</div>`;
    }).join("");
    return `<section><h1>Spieler & Pools</h1>
      <p class="muted small">Ich = eigene Bewertung · Team = Bewertung der Mitspieler · Δ = Team minus eigene Bewertung</p>
      <div class="pcard-grid">${cards}</div></section>`;
  }

  // ---------- Ideen-Reiter ----------
  function viewPlays() {
    const scopes = Object.keys(window.SCOPE_INFO);
    const filter = S.playFilter || "alle";
    const list = allPlays().filter((p) => filter === "alle" || p.scope === filter);
    // Wer aus der Gruppe kann einen Slot überhaupt spielen?
    const whoCan = (slot) => db.players.filter((p) => slot.heroes.some((h) => ((p.pools || {})[slot.pos] || []).some((e) => e.hero === h)));
    const cards = list.map((p) => {
      const slots = p.slots.map((s) => {
        const can = whoCan(s);
        return `<li>${posTag(s.pos)} ${s.label ? `<b>${esc(s.label)}</b>` : ""}
          <span class="plan-heroes">${s.heroes.map((h) => `<span class="plan-hero" title="${esc(heroName(h))}">${img(h, "hero-mini")}</span>`).join("")}</span>
          <span class="muted small">${can.length ? can.map((x) => esc(x.name)).join(", ") : "noch niemand im Pool"}</span></li>`;
      }).join("");
      return `<div class="play-card">
        <div class="play-head"><b>${esc(p.name)}</b> ${planBadge(p)}
          <span class="chip info">${esc((window.SCOPE_INFO[p.scope] || {}).label || p.scope)}</span></div>
        <div class="muted small">${esc(p.idea)}</div>
        <ul class="plan-slots">${slots}</ul>
        <div class="muted small">Pick-Reihenfolge: ${(p.order || []).map((x) => "Pos " + x).join(" → ")} · ${esc(diffLabel(p.difficulty))}</div>
        ${p.tips && p.tips.length ? `<ul class="plan-tips">${p.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        ${p.strongVs ? `<div class="small"><span class="chip pos">stark gegen</span> ${esc(p.strongVs)}</div>` : ""}
        ${p.careful ? `<div class="small"><span class="chip neg">Achtung</span> ${esc(p.careful)}</div>` : ""}
        ${hasAdmin() ? Admin.playCardButtons(p) : p.custom ? '<div class="muted small">eigene Idee</div>' : ""}
      </div>`;
    }).join("");

    const hidden = (window.DOTA_PLAYS || []).filter((p) => db.hiddenPlays.includes(p.id));
    return `<section>
      <h1>Draft-Ideen</h1>
      <p class="muted">Fertige Konzepte zum Nachlesen. Im Draft tauchen automatisch die auf, die zu eurer Aufstellung und euren Pools passen.
        ${hasAdmin() ? "Eigene Ideen kannst du hier anlegen; sie landen beim Export in <code>players.js</code>." : ""}</p>
      <div class="draft-bar">
        <label>Filter <select data-action="play-filter">
          <option value="alle" ${filter === "alle" ? "selected" : ""}>Alle (${allPlays().length})</option>
          ${scopes.map((s) => `<option value="${s}" ${filter === s ? "selected" : ""}>${esc(window.SCOPE_INFO[s].label)} (${allPlays().filter((p) => p.scope === s).length})</option>`).join("")}
        </select></label>
        <span class="spacer"></span>
        ${hasAdmin() ? Admin.playsToolbar() : ""}
      </div>
      ${hasAdmin() ? Admin.playsEditorSlot() : ""}
      <div class="play-grid wide">${cards || '<p class="muted">Keine Ideen in dieser Kategorie.</p>'}</div>
      ${hidden.length && hasAdmin() ? Admin.hiddenPlaysView(hidden) : ""}
    </section>`;
  }

  function viewAdmin() {
    if (hasAdmin()) return Admin.view();
    return `<section><h1>Admin</h1>
      <p class="muted">Diesen Bereich gibt es nur in der lokalen Kopie der App – die Datei dafür liegt nicht auf dem Server.</p>
      <a class="btn" href="#/lobby">Zurück zur Lobby</a></section>`;
  }

  // ---------- Aktionen ----------
  function pushHistory() {
    S.history.push(JSON.stringify({ locks: S.locks, enemies: S.enemies, bans: S.bans, assign: S.assign }));
    if (S.history.length > 50) S.history.shift();
  }
  function onEnemyChange(heroId) {
    OD.loadMatchups(heroId).then(() => { if (route() === "draft") render(); });
  }

  const actions = {
    "toggle-player"(el) {
      const id = el.dataset.id;
      if (S.selected.includes(id)) S.selected = S.selected.filter((x) => x !== id);
      else if (S.selected.length < 5) S.selected.push(id);
      S.manual = {};
      saveSession(); render();
    },
    "to-lineups"() { go("aufstellung"); },
    "choose-lineup"(el) { const l = db.lineups.find((x) => x.id === el.dataset.id); if (l) startDraft(l.assign); },
    "choose-suggestion"(el) { startDraft(viewLineups.cache[Number(el.dataset.idx)].assign); },
    "forget-lineup"(el) {
      const l = db.lineups.find((x) => x.id === el.dataset.id);
      if (!l || !confirm(`Gemerkte Aufstellung${l.note ? ` "${l.note}"` : ""} löschen?`)) return;
      db.lineups = db.lineups.filter((x) => x.id !== l.id);
      saveDb(); render();
    },
    "use-play"(el) { S.play = el.dataset.id; S.openPlays = true; saveSession(); render(); },
    "stop-play"() { S.play = null; saveSession(); render(); },
    "play-filter"(el) { S.playFilter = el.value; saveSession(); render(); },
    "save-suggestion"(el) {
      const s = viewLineups.cache[Number(el.dataset.idx)];
      const note = prompt("Notiz für diese Aufstellung (optional):", "");
      if (note === null) return;
      const assign = {};
      for (const pos of L.POSITIONS) assign[pos] = s.assign[pos] || null;
      db.lineups.push({ id: "l" + Date.now(), note, assign });
      saveDb(); render();
    },
    "manual-pos"(el) {
      const pos = el.dataset.pos, id = el.value || null;
      for (const other of L.POSITIONS) if (String(other) !== pos && id && S.manual[other] === id) S.manual[other] = null;
      S.manual[pos] = id; saveSession(); render();
    },
    "choose-manual"() { startDraft(S.manual); },
    "save-manual"() {
      const assign = {}; for (const pos of L.POSITIONS) assign[pos] = S.manual[pos] || null;
      if (!Object.values(assign).some(Boolean)) return alert("Erst mindestens eine Position zuordnen.");
      const note = prompt("Notiz für diese Aufstellung (optional):", "") ;
      if (note === null) return;
      db.lineups.push({ id: "l" + Date.now(), note, assign }); saveDb(); render();
    },
    "slot-player"(el) {
      pushHistory();
      const pos = Number(el.dataset.pos), id = el.value || null;
      for (const other of L.POSITIONS) if (other !== pos && id && S.assign[other] === id) S.assign[other] = S.assign[pos] || null;
      S.assign[pos] = id;
      saveSession(); render();
    },
    lock(el) { pushHistory(); S.locks[el.dataset.pos] = Number(el.dataset.hero); saveSession(); render(); },
    unlock(el) { pushHistory(); delete S.locks[el.dataset.pos]; saveSession(); render(); },
    "rm-enemy"(el) { pushHistory(); S.enemies = S.enemies.filter((h) => h !== Number(el.dataset.hero)); saveSession(); render(); },
    "rm-ban"(el) { pushHistory(); S.bans = S.bans.filter((h) => h !== Number(el.dataset.hero)); saveSession(); render(); },
    "set-order"(el) { S.order = el.value; saveSession(); render(); },
    "set-meta"(el) { S.metaMode = el.value; saveSession(); render(); },
    undo() { const last = S.history.pop(); if (last) Object.assign(S, JSON.parse(last)); saveSession(); render(); },
    "reset-draft"() { pushHistory(); S.locks = {}; S.enemies = []; S.bans = []; saveSession(); render(); }
    // Alles zum Pflegen der Daten steckt in nur-lokal/admin.js und wird dort ergänzt.
  };

  // Helden-Eingaben (datalist): bei Auswahl eines gültigen Namens ausführen
  const heroActions = {
    "add-enemy"(id) { if (!S.enemies.includes(id) && S.enemies.length < 5) { pushHistory(); S.enemies.push(id); onEnemyChange(id); } },
    "add-ban"(id) { if (!S.bans.includes(id)) { pushHistory(); S.bans.push(id); } },
    "lock-manual"(id, el) { pushHistory(); S.locks[el.dataset.pos] = id; }
  };

  app.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el || el.tagName === "SELECT" || el.tagName === "INPUT") return;
    const fn = actions[el.dataset.action];
    if (fn) fn(el);
  });
  app.addEventListener("change", (e) => {
    const el = e.target;
    const a = el.dataset.action;
    if (!a) return;
    if (heroActions[a]) {
      const id = resolveHero(el.value);
      if (!id) return;
      heroActions[a](id, el);
      saveSession(); render();
      return;
    }
    if (actions[a] && ["SELECT", "INPUT", "TEXTAREA"].includes(el.tagName)) actions[a](el);
  });
  // Auf-/Zuklappen von "Zum Ausprobieren" merken
  app.addEventListener("toggle", (e) => {
    const d = e.target;
    if (d.hasAttribute && d.hasAttribute("data-plays")) { S.openPlays = d.open; saveSession(); return; }
    if (!d.classList || !d.classList.contains("tryout")) return;
    S.openTry = S.openTry || {};
    S.openTry[d.dataset.pos] = d.open; saveSession();
  }, true);
  // Enter in einer Helden-Eingabe = erster passender Treffer
  app.addEventListener("keydown", (e) => {
    const el = e.target;
    if (e.key !== "Enter" || !el.classList.contains("hero-input")) return;
    const q = el.value.trim().toLowerCase();
    if (!q) return;
    const hit = window.DOTA_HEROES.find((h) => h.name.toLowerCase().startsWith(q)) || window.DOTA_HEROES.find((h) => h.name.toLowerCase().includes(q));
    if (hit) { el.value = hit.name; el.dispatchEvent(new Event("change", { bubbles: true })); }
  });

  // ---------- Start ----------
  document.getElementById("hero-list").innerHTML = window.DOTA_HEROES.map((h) => `<option value="${esc(h.name)}">`).join("");
  render();
  loadAdmin().then(render);
  OD.loadHeroStats().then(render);
  OD.loadProStats().then(render);
  for (const e of S.enemies) onEnemyChange(e);
})();
