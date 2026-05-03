# Déploie UNIQUEMENT symo-site/. Après sync : depuis la racine du dépôt, npm run symo:sync puis npm run symo:deploy (ou ce script).
$ErrorActionPreference = "Stop"
# Évite que PowerShell 7 traite la sortie stderr de la CLI Vercel comme une erreur fatale
if ($PSVersionTable.PSVersion.Major -ge 7) {
  $PSNativeCommandUseErrorActionPreference = $false
}
$root = Split-Path -Parent $PSScriptRoot

& (Join-Path $PSScriptRoot "sync-symo.ps1")

$symo = Join-Path $root "symo-site"
$vercelMeta = Join-Path $symo ".vercel\project.json"
if (-not (Test-Path -LiteralPath $vercelMeta)) {
  Write-Host "Lien Vercel absent — liaison au projet symo-solutions (une seule fois)."
  Push-Location $symo
  cmd /c "npx --yes vercel link --yes --project symo-solutions 2>&1"
  Pop-Location
}

Push-Location $symo

# cmd.exe : évite que Windows PowerShell 5 traite stderr de la CLI Vercel comme une erreur fatale
cmd /c "npx --yes vercel pull --yes --environment production 2>&1"
if ($LASTEXITCODE -ne 0) {
  Write-Warning "vercel pull a échoué (projet pas lié ?). On tente tout de même le deploy."
}

cmd /c "npx --yes vercel deploy --prod --yes"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Pop-Location
