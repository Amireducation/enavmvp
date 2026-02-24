# Run from repository root or backend folder
param(
  [string]$BackendUrl = 'http://127.0.0.1:5000/api/status',
  [string]$ChatbotHealth = 'http://127.0.0.1:8000/health'
)

Write-Host "Checking backend: $BackendUrl"
try {
  $b = Invoke-RestMethod -Uri $BackendUrl -Method Get -TimeoutSec 5
  Write-Host "Backend OK:" ($b | ConvertTo-Json -Compress)
} catch {
  Write-Error "Backend check failed: $($_.Exception.Message)"
  exit 2
}

Write-Host "Checking chatbot health: $ChatbotHealth"
try {
  $c = Invoke-RestMethod -Uri $ChatbotHealth -Method Get -TimeoutSec 5
  Write-Host "Chatbot OK:" ($c | ConvertTo-Json -Compress)
} catch {
  Write-Error "Chatbot check failed: $($_.Exception.Message)"
  exit 3
}

Write-Host "Smoke tests passed"
