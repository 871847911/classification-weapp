let boz = {}
boz['api'] = {}
boz['api']['dev'] = require('./api.dev.js')
// boz['api']['sit'] = require('./api.sit.js')
// boz['api']['uat'] = require('./api.uat.js')
boz['api']['prod'] = require('./api.prod.js')
// development
boz['env'] = process.env.NODE_ENV === 'production' ? 'prod': 'dev'

export default boz
