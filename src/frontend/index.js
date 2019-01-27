require('./network');
require('./autoreload');
require('./autoreload');
require('./viewport');
require('./camera');
require('./ship');
require('./laser');
require('./bounds');
require('./destroy');
require('./music');
require('./homeworld');
require('./score')

const {start} = require('skid/lib/load');
start(false);

const {silence} = require('skid/lib/event');
silence(['message', 'update_physics', 'ship_updateall', 'send']);
