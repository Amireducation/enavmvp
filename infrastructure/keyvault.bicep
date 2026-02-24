param location string
param prefix string
param postgresConnectionString string

resource kv 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: '${prefix}-kv'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    accessPolicies: []
    enabledForDeployment: true
    enabledForTemplateDeployment: true
  }
}

resource secret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  name: '${kv.name}/POSTGRES_CONN_STRING'
  properties: {
    value: postgresConnectionString
  }
  dependsOn: [kv]
}
