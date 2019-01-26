require('./network');
require('./autoreload');
require('./autoreload');
require('./viewport');
require('./camera');
require('./ship');

const {start} = require('skid/lib/load');
start(true);

const {silence} = require('skid/lib/event');
silence('message');
