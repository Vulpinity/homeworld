const {addHandler, handle} = require('skid/lib/event')

addHandler('input', (state, data) => {
    if (state.debug) {
        console.log(data.msg)
    }
    try {
        data.msg = JSON.parse(data.msg)
    } catch {
        console.log("ERR: Invalid JSON: ", data.msg)
        console.log('Type was: ' + typeof(data.msg))
        return
    }
    handle(state, 'input_' + data.msg.type, data)
})