<#
Sample PowerShell script to populate Azure Key Vault secrets used by the project.
Usage:
  .\setup-keyvault.ps1 -VaultName myKeyVault -DBConn "..." -JwtSecret "..."

This script expects you to be logged in with `az login` and to have `az` on PATH.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$VaultName,
    [string]$DBConn,
    [string]$DBAdminUser,
    [string]$JwtSecret,
    [string]$AzOpenAiKey,
    [string]$CosmosConn
)

Write-Host "Setting secrets to Key Vault: $VaultName"

if ($DBConn) { az keyvault secret set --vault-name $VaultName --name DB_CONN --value $DBConn | Out-Null; Write-Host "DB_CONN set" }
if ($DBAdminUser) { az keyvault secret set --vault-name $VaultName --name DB_ADMIN_USER --value $DBAdminUser | Out-Null; Write-Host "DB_ADMIN_USER set" }
if ($JwtSecret) { az keyvault secret set --vault-name $VaultName --name JWT_SECRET --value $JwtSecret | Out-Null; Write-Host "JWT_SECRET set" }
if ($AzOpenAiKey) { az keyvault secret set --vault-name $VaultName --name AZ_OPENAI_KEY --value $AzOpenAiKey | Out-Null; Write-Host "AZ_OPENAI_KEY set" }
if ($CosmosConn) { az keyvault secret set --vault-name $VaultName --name COSMOS_CONN --value $CosmosConn | Out-Null; Write-Host "COSMOS_CONN set" }

Write-Host "Done. Confirm in Azure Portal or via az keyvault secret list --vault-name $VaultName"
