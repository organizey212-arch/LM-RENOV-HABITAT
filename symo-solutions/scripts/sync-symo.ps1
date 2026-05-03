# Copie les pages symo vers symo-site/ avant un deploy Vercel (sans le site LM Rénov).

# Lit dashboard/.env.local, puis .env.local (dossier symo-solutions), puis .env.local à la racine du dépôt Git (monorepo).



function Read-DotEnvFile {

  param([string]$Path)

  $map = @{}

  if (!(Test-Path -LiteralPath $Path)) { return $map }

  Get-Content -LiteralPath $Path -Encoding UTF8 | ForEach-Object {

    $line = $_.Trim()

    if ($line -match '^\s*#' -or $line -eq '') { return }

    $eq = $line.IndexOf('=')

    if ($eq -lt 1) { return }

    $k = $line.Substring(0, $eq).Trim()

    $v = $line.Substring($eq + 1).Trim()

    if ($v.Length -ge 2 -and $v.StartsWith('"') -and $v.EndsWith('"')) {

      $v = $v.Substring(1, $v.Length - 2) -replace '\\n', "`n"

    } elseif ($v.Length -ge 2 -and $v.StartsWith("'") -and $v.EndsWith("'")) {

      $v = $v.Substring(1, $v.Length - 2)

    }

    $map[$k] = $v

  }

  return $map

}



$root = Split-Path -Parent $PSScriptRoot

$dest = Join-Path $root "symo-site"

New-Item -ItemType Directory -Force -Path $dest | Out-Null



$merged = @{}

$monoRoot = Split-Path -Parent $root

foreach ($p in @(

    (Join-Path $root "dashboard\.env.local"),

    (Join-Path $monoRoot ".env.local"),

    (Join-Path $root ".env.local")

  )) {

  $m = Read-DotEnvFile $p

  foreach ($k in $m.Keys) { $merged[$k] = $m[$k] }

}



$url = $merged["VITE_SUPABASE_URL"]

if ([string]::IsNullOrWhiteSpace($url)) { $url = $merged["SUPABASE_URL"] }

$key = $merged["VITE_SUPABASE_ANON_KEY"]

if ([string]::IsNullOrWhiteSpace($key)) { $key = $merged["SUPABASE_ANON_KEY"] }



$uJson = if ([string]::IsNullOrWhiteSpace($url)) { '""' } else { ConvertTo-Json -Compress $url }

$kJson = if ([string]::IsNullOrWhiteSpace($key)) { '""' } else { ConvertTo-Json -Compress $key }

$envJs = Join-Path $dest "login-supabase-env.js"

$envJsRoot = Join-Path $root "login-supabase-env.js"

$body = "window.__SYMO_SUPABASE_URL = $uJson;`r`nwindow.__SYMO_SUPABASE_ANON_KEY = $kJson;`r`n"

[System.IO.File]::WriteAllText($envJs, $body, [System.Text.UTF8Encoding]::new($false))

[System.IO.File]::WriteAllText($envJsRoot, $body, [System.Text.UTF8Encoding]::new($false))



Copy-Item (Join-Path $root "landing-mini-agence.html") (Join-Path $dest "landing-mini-agence.html") -Force

Copy-Item (Join-Path $root "landing-mini-agence.css") (Join-Path $dest "landing-mini-agence.css") -Force

Copy-Item (Join-Path $root "rdv.html") (Join-Path $dest "rdv.html") -Force

Copy-Item (Join-Path $root "login.html") (Join-Path $dest "login.html") -Force

Copy-Item (Join-Path $root "symo-login.js") (Join-Path $dest "symo-login.js") -Force

Copy-Item (Join-Path $root "landing-mini-agence.html") (Join-Path $dest "index.html") -Force

foreach ($f in @("service-site-web.html", "service-seo.html", "service-agent-ia.html", "a-propos.html")) {

  $srcPath = Join-Path $root $f

  if (Test-Path $srcPath) {

    Copy-Item $srcPath (Join-Path $dest $f) -Force

  }

}

$symoJs = Join-Path $root "symo-mobile-nav.js"

if (Test-Path $symoJs) {

  Copy-Item $symoJs (Join-Path $dest "symo-mobile-nav.js") -Force

}

$blogSrc = Join-Path $root "blog"

$blogDest = Join-Path $dest "blog"

if (Test-Path $blogSrc) {

  Copy-Item $blogSrc $blogDest -Recurse -Force

}

foreach ($f in @("sitemap.xml", "robots.txt")) {

  $p = Join-Path $root $f

  if (Test-Path $p) {

    Copy-Item $p (Join-Path $dest $f) -Force

  }

}

$dashProj = Join-Path $root "dashboard"

Push-Location $dashProj

npm run build

if ($LASTEXITCODE -ne 0) {

  Pop-Location

  Write-Error "Build dashboard echouee (voir les logs npm ci-dessus)."

  exit $LASTEXITCODE

}

Pop-Location

node (Join-Path $root "scripts\copy-dashboard-dist.mjs")

if ($LASTEXITCODE -ne 0) {

  Write-Error "copy-dashboard-dist.mjs a echoue."

  exit $LASTEXITCODE

}

