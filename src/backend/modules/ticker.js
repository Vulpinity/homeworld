const {handleInterval} = require('skid/lib/timer')

const {addHandler, handle} = require('skid/lib/event')

addHandler('load', (state) => {
    handleInterval(state, 100,  'tick')
})

