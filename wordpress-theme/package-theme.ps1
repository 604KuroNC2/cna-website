# package-theme.ps1
# Creates cna-lighting.zip ready for WordPress → Appearance → Themes → Upload
# Run from the wordpress-theme\ folder:
#   cd "D:\Documents\CNA Website - Claude AI\wordpress-theme"
#   .\package-theme.ps1

$ThemeDir  = Join-Path $PSScriptRoot "cna-lighting"
$OutFile   = Join-Path $PSScriptRoot "cna-lighting.zip"

if (-not (Test-Path $ThemeDir)) {
    Write-Error "Theme folder not found: $ThemeDir"
    exit 1
}

if (Test-Path $OutFile) {
    Remove-Item $OutFile -Force
    Write-Host "Removed old $OutFile"
}

Compress-Archive -Path $ThemeDir -DestinationPath $OutFile -CompressionLevel Optimal

$size = (Get-Item $OutFile).Length / 1MB
Write-Host ""
Write-Host "✅  cna-lighting.zip created ($([math]::Round($size,2)) MB)"
Write-Host "    → $OutFile"
Write-Host ""
Write-Host "Upload via: WP Admin → Appearance → Themes → Add New → Upload Theme"
