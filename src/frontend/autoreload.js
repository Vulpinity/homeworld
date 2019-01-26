const {addHandler, handle} = require('skid/lib/event');
const ReconnectingWebSocket = require('reconnecting-websocket')
const socket = new ReconnectingWebSocket('ws://' + location.hostname + ':' + location.port + '/io')
const saveDead = false
let firstRun = true

socket.addEventListener('open', (event) => {
    if (!firstRun && !saveDead) {
        location.reload()
    }
    firstRun = false
})


addHandler('load', (state) => {
    socket.addEventListener('message', (event) => {
        handle(state, 'message', event.data);
    });
});

// For debugging.
window.socket = socket
