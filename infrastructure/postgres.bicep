param location string
param prefix string

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2022-01-20-preview' = {
  name: '${prefix}-postgres'
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
    capacity: 1
  }
  properties: {
    administratorLogin: 'enavadmin'
    administratorLoginPassword: 'NewStrongPassword123!' // Use Key Vault reference in production!
    version: '14'
    storage: {
      storageSizeGB: 32
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
  }
}

output connectionString string = 'postgresql://enavadmin:NewStrongPassword123!@${postgres.name}.postgres.database.azure.com/postgres?sslmode=require'
