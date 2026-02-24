param location string = resourceGroup().location
param prefix string = 'ethionav'

module postgres 'postgres.bicep' = {
  name: 'postgresModule'
  params: {
    location: location
    prefix: prefix
  }
}

module cosmos 'cosmos.bicep' = {
  name: 'cosmosModule'
  params: {
    location: location
    prefix: prefix
  }
}

module storage 'storage.bicep' = {
  name: 'storageModule'
  params: {
    location: location
    prefix: prefix
  }
}

module keyvault 'keyvault.bicep' = {
  name: 'keyvaultModule'
  params: {
    location: location
    prefix: prefix
    postgresConnectionString: postgres.outputs.connectionString
  }
}

module aiSearch 'ai-search.bicep' = {
  name: 'aiSearchModule'
  params: {
    location: location
    prefix: prefix
  }
}
