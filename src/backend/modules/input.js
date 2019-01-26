const {addHandler, handle} = require('skid/lib/event')

addHandler('input', (state, data) => {
    data.ws.send('Message from server: ' + data.msg)
})