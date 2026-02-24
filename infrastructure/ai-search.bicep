param location string
param prefix string

resource search 'Microsoft.Search/searchServices@2023-11-01' = {
  name: '${prefix}-search'
  location: location
  sku: {
    name: 'standard'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
  }
}
