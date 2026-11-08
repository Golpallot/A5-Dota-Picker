// Heldencheck: Wie gut spielt jemand welchen Helden auf welcher Position?
// Läuft eigenständig, speichert im Browser und gibt am Ende eine CSV-Datei aus.
(function () {
  const POS = window.POSITION_NAMES;
  const HERO = {};
  for (const h of window.DOTA_HEROES) HERO[h.id] = h;
  const players = (window.DOTA_PLAYERS.players || []).slice();

  // Die fünf Knöpfe: Wert = Sterne im Picker
  const CHOICES = [
    { v: 5, icon: "❤", label: "Signature", hint: "Spielt er im Schlaf", cls: "c5", key: "1" },
    { v: 4, icon: "👍", label: "Gut", hint: "Darauf ist Verlass", cls: "c4", key: "2" },
    { v: 3, icon: "~", label: "Solide", hint: "Geht in Ordnung", cls: "c3", key: "3" },
    { v: 2, icon: "👎", label: "Wackelig", hint: "Eher nicht sein Held", cls: "c2", key: "4" },
    { v: 1, icon: "✗", label: "Bitte nicht", hint: "Lieber jemand anderes", cls: "c1", key: "5" }
  ];

  const el = document.getElementById("rate");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const heroName = (id) => (HERO[id] ? HERO[id].name : "#" + id);
  const heroImg = (id) => HERO[id]
    ? `<img class="rate-hero-img" alt="${esc(HERO[id].name)}" src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${HERO[id].short}.png">`
    : "";

  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* voll */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* egal */ } }
  };

  let me = store.get("rate:me", null);           // eigene Spieler-ID
  let answers = {};                               // "spieler|pos|held" → 1-5 oder "skip"
  let idx = 0;                                    // aktuelle Karte
  const KEY = () => "rate:answers:" + me;
  const POSKEY = () => "rate:pos:" + me;

  // ---------- Kartenstapel ----------
  // Pro Person, Position und Held eine Karte – Pool und Wunschhelden getrennt markiert.
  function buildCards() {
    const cards = [];
    for (const p of players) {
      if (p.id === me) continue;
      for (const pos of [1, 2, 3, 4, 5]) {
        const pool = (p.pools || {})[pos] || [];
        for (const e of pool) cards.push({ player: p, pos, hero: e.hero, wish: false });
        const wish = ((p.tryout || {})[pos] || []).map((w) => (typeof w === "number" ? { hero: w } : w));
        for (const w of wish) {
          if (pool.some((e) => e.hero === w.hero)) continue;
          cards.push({ player: p, pos, hero: w.hero, wish: true });
        }
      }
    }
    return cards;
  }
  let cards = [];
  const cardKey = (c) => `${c.player.id}|${c.pos}|${c.hero}`;

  // ---------- Ansichten ----------
  function viewPickMe() {
    const liste = players.map((p) => {
      const offen = p.id;
      return `<button class="who-card" data-act="iam" data-id="${esc(offen)}">${esc(p.name)}</button>`;
    }).join("");
    return `<section class="rate-intro">
      <h1>Heldencheck</h1>
      <p>Du bekommst Karte für Karte einen Mitspieler mit einem Helden auf einer Position.
         Die Frage ist immer dieselbe: <b>Wie gut spielt diese Person diesen Helden dort?</b></p>
      <p class="muted">Dauert ein paar Minuten, du kannst jederzeit aufhören und später weitermachen – dein Stand bleibt gespeichert.
         Am Ende lädst du eine Datei herunter und schickst sie an MaStr.</p>
      <h2>Wer bist du?</h2>
      <div class="who-grid">${liste}</div>
      <p class="muted small">Hast du hier schon mal mitgemacht, geht es an deiner letzten Stelle weiter.</p>
    </section>`;
  }

  function viewCard() {
    const total = cards.length;
    const done = Object.keys(answers).length;
    if (idx >= total) return viewDone();
    const c = cards[idx];
    const prev = answers[cardKey(c)];
    const pct = Math.round((done / total) * 100);
    const restProPerson = cards.filter((x, i) => i >= idx && x.player.id === c.player.id).length;

    // Fortschritt im aktuellen Block (diese Person auf dieser Position)
    const block = cards.filter((x) => x.player.id === c.player.id && x.pos === c.pos);
    const blockDone = block.filter((x) => answers[cardKey(x)] != null).length;
    const blockPct = Math.round((blockDone / block.length) * 100);
    // Fortschritt dieser Rolle über alle Personen
    const rolle = cards.filter((x) => x.pos === c.pos);
    const rolleDone = rolle.filter((x) => answers[cardKey(x)] != null).length;

    return `<section class="rate-stage">
      <div class="rate-progress"><div class="bar" style="width:${pct}%"></div></div>
      <div class="rate-meta">
        <span>${done} von ${total} bewertet</span>
        <span>noch ${restProPerson} für ${esc(c.player.name)}</span>
      </div>

      <div class="rate-card">
        <div class="rate-player">${esc(c.player.name)}</div>
        <div class="rate-pos"><span class="pos pos-${c.pos}">Pos ${c.pos}</span> ${esc(POS[c.pos])}
          ${c.wish ? '<span class="rate-wish">möchte er ausprobieren</span>' : ""}</div>
        ${heroImg(c.hero)}
        <div class="rate-hero-name">${esc(heroName(c.hero))}</div>
        <div class="rate-question">Wie gut spielt ${esc(c.player.name)} diesen Helden auf dieser Position?</div>
      </div>

      <div class="rate-buttons">
        ${CHOICES.map((ch) => `<button class="rate-btn ${ch.cls} ${prev === ch.v ? "chosen" : ""}" data-act="vote" data-v="${ch.v}" title="Taste ${ch.key}">
          <span class="rb-icon">${ch.icon}</span><span class="rb-label">${ch.label}</span><span class="rb-hint">${ch.hint}</span>
        </button>`).join("")}
      </div>

      <div class="rate-extra">
        <button class="btn" data-act="back" ${idx === 0 ? "disabled" : ""} title="Rücktaste">← Zurück</button>
        <button class="btn" data-act="skip" title="Leertaste">Diesen Helden überspringen →</button>
        <button class="btn small" data-act="skip-player" title="Alle restlichen Karten dieser Person überspringen">${esc(c.player.name)} ganz überspringen</button>
      </div>
      <div class="rate-counts">
        <div class="count-row">
          <span><b>${esc(c.player.name)} · ${esc(POS[c.pos])}</b></span>
          <span>${blockDone} / ${block.length}</span>
        </div>
        <div class="rate-progress small"><div class="bar" style="width:${blockPct}%"></div></div>
        <div class="count-row muted">
          <span>${esc(POS[c.pos])} insgesamt (alle Mitspieler)</span><span>${rolleDone} / ${rolle.length}</span>
        </div>
        <div class="count-row muted"><span>Alle Karten</span><span>${done} / ${total}</span></div>
      </div>

      <div class="rate-extra">
        <span class="saved-hint">✔ Stand gespeichert</span>
        <button class="btn small primary" data-act="pause">Pause / später weitermachen</button>
      </div>
      <p class="muted small rate-keys">Tastatur: <b>1</b> ❤ · <b>2</b> 👍 · <b>3</b> ~ · <b>4</b> 👎 · <b>5</b> ✗ · <b>Leertaste</b> überspringen · <b>Rücktaste</b> zurück</p>
    </section>`;
  }

  function viewPause() {
    const total = cards.length;
    const done = Object.keys(answers).length;
    const bewertet = Object.values(answers).filter((v) => v !== "skip").length;
    return `<section class="rate-done">
      <h1>Gespeichert ✔</h1>
      <p>Du hast <b>${done}</b> von ${total} Karten durch, davon ${bewertet} bewertet.</p>
      <p class="muted">Dein Stand liegt in diesem Browser. Wenn du die Seite später am selben Gerät wieder öffnest,
        geht es automatisch an dieser Stelle weiter – auch nach Tagen. Nichts doppelt, nichts verloren.</p>
      <div class="row-btns">
        <button class="btn primary" data-act="resume">Weitermachen</button>
        <button class="btn" data-act="download">Zwischenstand herunterladen</button>
      </div>
      <p class="muted small">Du kannst MaStr auch jetzt schon einen Zwischenstand schicken und später einen neuen –
        er überschreibt dann einfach deine alten Angaben.</p>
    </section>`;
  }

  function viewDone() {
    const bewertet = Object.values(answers).filter((v) => v !== "skip").length;
    const uebersprungen = Object.values(answers).filter((v) => v === "skip").length;
    return `<section class="rate-done">
      <h1>Fertig! 🎉</h1>
      <p>Du hast <b>${bewertet}</b> Helden bewertet${uebersprungen ? ` und ${uebersprungen} übersprungen` : ""}.</p>
      <p class="muted">Lade jetzt die Datei herunter und schick sie an MaStr – er baut sie in den Picker ein.</p>
      <div class="row-btns">
        <button class="btn primary" data-act="download">Ergebnisse herunterladen</button>
        <button class="btn" data-act="again">Nochmal durchgehen</button>
      </div>
      <p class="muted small">Dein Stand bleibt in diesem Browser gespeichert. Du kannst die Datei also auch später noch einmal erzeugen.</p>
    </section>`;
  }

  let paused = false;

  function render() {
    const whoEl = document.getElementById("who");
    const restart = document.querySelector('[data-act="restart"]');
    if (me) {
      const p = players.find((x) => x.id === me);
      const done = Object.keys(answers).length;
      whoEl.textContent = (p ? p.name : "") + (cards.length ? ` · ${done}/${cards.length}` : "");
      restart.hidden = false;
    } else { whoEl.textContent = ""; restart.hidden = true; }
    el.innerHTML = !me ? viewPickMe() : paused ? viewPause() : viewCard();
  }

  // ---------- Ablauf ----------
  function save() { store.set(KEY(), answers); store.set(POSKEY(), idx); }

  function vote(value) {
    const c = cards[idx];
    if (!c) return;
    answers[cardKey(c)] = value;
    idx++;
    save(); render();
  }

  function start(id) {
    me = id;
    store.set("rate:me", me);
    cards = buildCards();
    answers = store.get(KEY(), {});
    idx = Math.min(store.get(POSKEY(), 0), cards.length);
    render();
  }

  function csv() {
    const mir = players.find((p) => p.id === me);
    const zeilen = [["BewerterId", "Bewerter", "SpielerId", "Spieler", "Position", "Rolle", "HeldId", "Held", "Bewertung"]];
    for (const c of cards) {
      const v = answers[cardKey(c)];
      if (v == null || v === "skip") continue;
      zeilen.push([me, mir ? mir.name : me, c.player.id, c.player.name, c.pos, POS[c.pos], c.hero, heroName(c.hero), v]);
    }
    // Semikolon + BOM, damit Excel es direkt sauber öffnet
    const text = "﻿" + zeilen.map((r) => r.map((f) => {
      const s = String(f);
      return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(";")).join("\r\n") + "\r\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    a.download = "heldencheck-" + (mir ? mir.name.replace(/[^\wäöüÄÖÜß.-]+/g, "_") : me) + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "iam") start(b.dataset.id);
    else if (act === "vote") vote(Number(b.dataset.v));
    else if (act === "skip") vote("skip");
    else if (act === "back") { if (idx > 0) { idx--; save(); render(); } }
    else if (act === "skip-player") {
      const pid = cards[idx].player.id;
      while (idx < cards.length && cards[idx].player.id === pid) idx++;
      save(); render();
    }
    else if (act === "download") csv();
    else if (act === "pause") { paused = true; save(); render(); }
    else if (act === "resume") { paused = false; render(); }
    else if (act === "again") { idx = 0; paused = false; save(); render(); }
    else if (act === "restart") {
      if (!confirm("Von vorn anfangen? Deine bisherigen Bewertungen werden gelöscht.")) return;
      store.del(KEY()); store.del(POSKEY()); store.del("rate:me");
      me = null; answers = {}; idx = 0; render();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!me || paused || idx >= cards.length) return;
    const ch = CHOICES.find((c) => c.key === e.key);
    if (ch) { e.preventDefault(); vote(ch.v); }
    else if (e.key === " ") { e.preventDefault(); vote("skip"); }
    else if (e.key === "Backspace") { e.preventDefault(); if (idx > 0) { idx--; save(); render(); } }
  });

  if (me && players.some((p) => p.id === me)) start(me); else render();
})();
