const {addHandler} = require('skid/lib/event');
const {loadAudio} = require('skid/lib/audio');

addHandler('load', (state) => {
    loadAudio(state, 'ship_destroyed', {src: ['./assets/destroy_0.ogg', './assets/destroy_0.mp3']});
});
