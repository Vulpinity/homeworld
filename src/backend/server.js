const {start} = require('skid/lib/load')
require('./modules/network')
require('./modules/players')
require('./modules/input')
// You may NOT be peaceful!
require('./modules/violence')
require('./modules/ships')
require('./modules/ticker')
start(false)