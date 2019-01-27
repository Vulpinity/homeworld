const {addHandler} = require('skid/lib/event');
const {loadIcon} = require('skid/lib/scene/icon');
const {IconAvatar} = require('skid/lib/scene/icon-avatar');

// NOTE: homeworld.jpg from https://opengameart.org/content/planet-if-2005

addHandler('load', (state) => {
    const w = 4096;
    state.homeworldIcon = loadIcon(state, `./assets/homeworld.jpg`, w / 2, w / 2, w);
});

addHandler('load_done', (state) => {
    const avatar = new IconAvatar(state.scene.camera, state.homeworldIcon, 3, -4, 3, 3);
    avatar.layer = 0;
});
