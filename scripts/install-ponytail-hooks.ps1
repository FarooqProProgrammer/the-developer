# Re-bind Ponytail Cursor hooks after clone or path change
# (hooks.json stores an absolute path to vendor/ponytail)
Set-Location $PSScriptRoot\..
node vendor\ponytail\scripts\cursor-hooks.js install --project
