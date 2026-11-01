# Mini-Webserver für die lokale Vorschau (optional – index.html funktioniert auch per Doppelklick).
# Start:  powershell -ExecutionPolicy Bypass -File serve.ps1   → http://localhost:8080
param([int]$Port = 8080)
$root = $PSScriptRoot
$types = @{ ".html" = "text/html; charset=utf-8"; ".js" = "text/javascript; charset=utf-8"; ".css" = "text/css; charset=utf-8"; ".json" = "application/json"; ".png" = "image/png"; ".svg" = "image/svg+xml" }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Stack Drafter läuft auf http://localhost:$Port/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart("/"))
  if ($path -eq "") { $path = "index.html" }
  $file = Join-Path $root $path
  $full = [IO.Path]::GetFullPath($file)
  if ($full.StartsWith($root) -and (Test-Path $full -PathType Leaf)) {
    $bytes = [IO.File]::ReadAllBytes($full)
    $ext = [IO.Path]::GetExtension($full).ToLower()
    $ctx.Response.ContentType = if ($types[$ext]) { $types[$ext] } else { "application/octet-stream" }
    $ctx.Response.Headers.Add("Cache-Control", "no-store")
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
