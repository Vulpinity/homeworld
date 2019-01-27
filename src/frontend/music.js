const {addHandler} = require('skid/lib/event');
const {loadAudio} = require('skid/lib/audio');

addHandler('load', (state) => {
    loadAudio(state, 'music', {
        src: ['./assets/music.ogg', './assets/music.mp3'],
        loop: true,
    }).then((sound) => {
        sound.play();
    });
});
