// SQL-Abfrage für die Profi-Statistik (OpenDota Explorer). Wird von der App und von scripts/update-heroes.ps1 genutzt.
// OpenDota-Ligastufen: premium = Tier 1, professional = Tier 2. {DAYS} = Zeitraum in Tagen.
window.PRO_QUERY = `
SELECT pb.hero_id,
  sum(CASE WHEN pb.is_pick AND l.tier='premium' THEN 1 ELSE 0 END) p1,
  sum(CASE WHEN pb.is_pick AND l.tier='premium' AND (pb.team=0) = m.radiant_win THEN 1 ELSE 0 END) w1,
  sum(CASE WHEN NOT pb.is_pick AND l.tier='premium' THEN 1 ELSE 0 END) b1,
  sum(CASE WHEN pb.is_pick AND l.tier='professional' THEN 1 ELSE 0 END) p2,
  sum(CASE WHEN pb.is_pick AND l.tier='professional' AND (pb.team=0) = m.radiant_win THEN 1 ELSE 0 END) w2,
  sum(CASE WHEN NOT pb.is_pick AND l.tier='professional' THEN 1 ELSE 0 END) b2
FROM picks_bans pb JOIN matches m USING(match_id) JOIN leagues l USING(leagueid)
WHERE l.tier IN ('premium','professional') AND m.start_time > extract(epoch from now() - interval '{DAYS} days')
GROUP BY pb.hero_id ORDER BY count(*) DESC
`;
window.PRO_GAMES_QUERY = `
SELECT l.tier, count(DISTINCT m.match_id) n FROM matches m JOIN leagues l USING(leagueid)
WHERE l.tier IN ('premium','professional') AND m.start_time > extract(epoch from now() - interval '{DAYS} days')
GROUP BY l.tier
`;
window.PRO_DAYS = 90;
