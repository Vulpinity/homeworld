const ReconnectingWebSocket = require('reconnecting-websocket')
const socket = new ReconnectingWebSocket('ws://' + location.hostname + ':' + location.port + '/io')
const saveDead = false
let firstRun = true
socket.addEventListener('open', function (event) {
  if (!firstRun && !saveDead) {
    location.reload()
  }
  firstRun = false
})
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
})


// For debugging.
window.socket = socket
