# Aktualisiert data/heroes.js (Heldenliste + Pub-Winrates) und data/pro.js (Profi-Turniere Tier 1/2) aus der OpenDota-API.
# Ausführen:  powershell -ExecutionPolicy Bypass -File scripts/update-heroes.ps1
# Danach für neue Helden einen Eintrag in data/hero-tags.js ergänzen (tests.html meldet fehlende).
$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object Text.UTF8Encoding $false
$today = Get-Date -Format yyyy-MM-dd

# --- Heldenliste + Pub-Winrates ---
$h = Invoke-RestMethod https://api.opendota.com/api/heroStats
$list = $h | Sort-Object localized_name | ForEach-Object {
  $wr = @{}
  foreach ($b in 1..7) { $p = $_."${b}_pick"; if ($p -gt 0) { $wr["$b"] = [math]::Round($_."${b}_win" / $p * 100, 1) } }
  [ordered]@{ id = $_.id; name = $_.localized_name; short = $_.name -replace 'npc_dota_hero_', ''; attr = $_.primary_attr; attack = $_.attack_type; roles = $_.roles; wr = $wr; picks = $_.pub_pick }
}
$json = $list | ConvertTo-Json -Depth 5 -Compress
$content = "// Automatisch generiert aus OpenDota /api/heroStats (Snapshot $today).`n// wr = Pub-Winrate in % pro Rang-Bracket (1=Herald ... 7=Divine/Immortal). Wird im Browser live aktualisiert.`nwindow.DOTA_HEROES = $json;`n"
[IO.File]::WriteAllText("$root\data\heroes.js", $content, $utf8)
Write-Host "$($list.Count) Helden geschrieben."

# --- Profi-Turniere (OpenDota-Ligen: premium = Tier 1, professional = Tier 2) ---
$qFile = [IO.File]::ReadAllText("$root\data\pro-query.js", [Text.Encoding]::UTF8)
$qHeroes = [regex]::Match($qFile, 'PRO_QUERY = `([^`]*)`').Groups[1].Value
$qGames = [regex]::Match($qFile, 'PRO_GAMES_QUERY = `([^`]*)`').Groups[1].Value
$days = [int][regex]::Match($qFile, 'PRO_DAYS = (\d+)').Groups[1].Value
$api = "https://api.opendota.com/api/explorer?sql="
$rows = (Invoke-RestMethod ($api + [uri]::EscapeDataString($qHeroes.Replace('{DAYS}', "$days")))).rows
$qGames = $qGames.Replace('{DAYS}', "$days")
$games = @{ "1" = 0; "2" = 0 }
foreach ($g in (Invoke-RestMethod ($api + [uri]::EscapeDataString($qGames))).rows) { $games[$(if ($g.tier -eq 'premium') { "1" } else { "2" })] = [int]$g.n }
$heroes = [ordered]@{}
foreach ($r in $rows) { $heroes["$($r.hero_id)"] = @([int]$r.p1, [int]$r.w1, [int]$r.b1, [int]$r.p2, [int]$r.w2, [int]$r.b2) }
$pro = [ordered]@{ date = $today; days = $days; games = $games; heroes = $heroes }
$content = "// Automatisch generiert aus OpenDota (Profi-Ligen der letzten $days Tage, Snapshot $today).`n// heroes: id -> [Picks T1, Siege T1, Bans T1, Picks T2, Siege T2, Bans T2]. Wird im Browser live aktualisiert.`nwindow.DOTA_PRO = $($pro | ConvertTo-Json -Depth 5 -Compress);`n"
[IO.File]::WriteAllText("$root\data\pro.js", $content, $utf8)
Write-Host "Profi-Daten: $($games['1']) Tier-1- und $($games['2']) Tier-2-Spiele."
