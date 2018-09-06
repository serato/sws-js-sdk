require('./node_modules/babel-register/lib/node')({
  'presets': [
    ['env', {
      'targets': {
        'node': 'current'
      }
    }]
  ]
})

var client = require('./src/index.js')

console.log(client)

// console.log(swsClient)
