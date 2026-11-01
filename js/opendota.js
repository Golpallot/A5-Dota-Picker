// OpenDota-Anbindung mit localStorage-Cache. Fällt die API aus, bleibt der Snapshot aus data/heroes.js aktiv.
(function () {
  const API = "https://api.opendota.com/api";
  const DAY = 24 * 60 * 60 * 1000;

  function cacheGet(key, maxAge) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const v = JSON.parse(raw);
      return Date.now() - v.t < maxAge ? v.d : null;
    } catch (e) { return null; }
  }
  function cacheSet(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (e) { /* voll/blockiert */ }
  }

  // Snapshot-Winrates: { heroId: { bracket: wr } }
  function snapshotWinrates() {
    const out = {};
    for (const h of window.DOTA_HEROES) out[h.id] = h.wr;
    return out;
  }

  const state = { winrates: snapshotWinrates(), source: "snapshot", matchups: {}, pro: window.DOTA_PRO || null, proSource: "snapshot" };

  // Profi-Turniere (Tier 1 + 2) über den OpenDota Explorer
  async function loadProStats() {
    let data = cacheGet("od:pro", DAY);
    if (!data) {
      try {
        const q = (sql) => fetch(API + "/explorer?sql=" + encodeURIComponent(sql.replace(/\{DAYS\}/g, window.PRO_DAYS)))
          .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
        const [heroesRes, gamesRes] = await Promise.all([q(window.PRO_QUERY), q(window.PRO_GAMES_QUERY)]);
        const games = { 1: 0, 2: 0 };
        for (const g of gamesRes.rows) games[g.tier === "premium" ? 1 : 2] = Number(g.n);
        const heroes = {};
        for (const r of heroesRes.rows) heroes[r.hero_id] = [r.p1, r.w1, r.b1, r.p2, r.w2, r.b2].map(Number);
        if (!games[1] && !games[2]) throw new Error("keine Profi-Spiele");
        data = { date: new Date().toISOString().slice(0, 10), days: window.PRO_DAYS, games, heroes };
        cacheSet("od:pro", data);
      } catch (e) {
        console.warn("OpenDota Profi-Daten nicht erreichbar, nutze Snapshot", e);
        return false;
      }
    }
    state.pro = data;
    state.proSource = "live";
    return true;
  }

  async function loadHeroStats() {
    let data = cacheGet("od:heroStats", DAY);
    if (!data) {
      try {
        const res = await fetch(API + "/heroStats");
        if (!res.ok) throw new Error(res.status);
        const raw = await res.json();
        data = {};
        for (const h of raw) {
          const wr = {};
          for (let b = 1; b <= 7; b++) {
            const p = h[b + "_pick"];
            if (p > 0) wr[b] = Math.round((h[b + "_win"] / p) * 1000) / 10;
          }
          data[h.id] = wr;
        }
        cacheSet("od:heroStats", data);
      } catch (e) {
        console.warn("OpenDota heroStats nicht erreichbar, nutze Snapshot", e);
        return false;
      }
    }
    state.winrates = data;
    state.source = "live";
    return true;
  }

  // Matchups für einen Gegnerhelden: { heroId: {games, wins} } (wins = Siege des Gegners)
  async function loadMatchups(enemyId) {
    if (state.matchups[enemyId]) return state.matchups[enemyId];
    let data = cacheGet("od:mu:" + enemyId, 3 * DAY);
    if (!data) {
      try {
        const res = await fetch(API + "/heroes/" + enemyId + "/matchups");
        if (!res.ok) throw new Error(res.status);
        const raw = await res.json();
        data = {};
        for (const m of raw) data[m.hero_id] = { games: m.games_played, wins: m.wins };
        cacheSet("od:mu:" + enemyId, data);
      } catch (e) {
        console.warn("OpenDota Matchups nicht erreichbar", e);
        return null;
      }
    }
    state.matchups[enemyId] = data;
    return data;
  }

  window.OpenDota = { state, loadHeroStats, loadProStats, loadMatchups };
})();
