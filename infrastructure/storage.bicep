param location string
param prefix string

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: toLower('${prefix}storage')
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}
