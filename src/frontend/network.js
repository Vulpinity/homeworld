const ReconnectingWebSocket = require('reconnecting-websocket')
const {addHandler, handle} = require('skid/lib/event');

addHandler('load', (state) => {
    const socket = new ReconnectingWebSocket(
        'ws://' + location.hostname + ':' + location.port + '/io');
    state.socket = socket;
    // For debugging.
    window.socket = socket;

    socket.addEventListener('message', (event) => {
        handle(state, 'message', event.data);
    });
    socket.addEventListener('open', (event) => {
        handle(state, 'connect');
    });
});

addHandler('send', (state, message) => {
    try {
        state.socket.send(JSON.stringify(message))
    } catch (err) {
        // Likely that the socket is closing. Ignore.
        console.error(err)
    }
})