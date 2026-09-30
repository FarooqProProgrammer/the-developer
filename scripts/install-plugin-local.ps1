# Install the-developer as a local Cursor plugin
$ErrorActionPreference = "Stop"
$src = Split-Path $PSScriptRoot -Parent
$dest = Join-Path $env:USERPROFILE ".cursor\plugins\local\the-developer"

New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
if (Test-Path $dest) {
  Remove-Item -Recurse -Force $dest
}
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Only the Cursor Plugin payload (not Spec Kit project scratch / vendor)
$include = @(
  ".cursor-plugin",
  "rules",
  "skills",
  "agents",
  "commands",
  "hooks",
  "scripts",
  "assets",
  "mcp.json",
  "PLUGIN.md",
  "README.md",
  "AGENTS.md",
  "LICENSE"
)

foreach ($item in $include) {
  $from = Join-Path $src $item
  if (-not (Test-Path $from)) { continue }
  $to = Join-Path $dest $item
  if ((Get-Item $from).PSIsContainer) {
    Copy-Item -Recurse -Force $from $to
  } else {
    Copy-Item -Force $from $to
  }
}

Write-Host "Installed local plugin → $dest"
Write-Host "Reload Cursor window (Developer: Reload Window), then open Customize to verify."
