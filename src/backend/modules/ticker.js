const {PHYSICS_INTERVAL} = require('../../constants')

const {handleInterval} = require('skid/lib/timer')

const {addHandler, handle} = require('skid/lib/event')

addHandler('load', (state) => {
    handleInterval(state, PHYSICS_INTERVAL,  'tick')
})

