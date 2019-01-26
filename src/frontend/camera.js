const {addHandler, handle} = require('skid/lib/event');
const {Group} = require('skid/lib/scene/group');
const {Camera} = require('skid/lib/scene/camera');

addHandler('load', (state) => {
    const camera = new Camera(state.scene.renderer);
    camera.anchorX.setTo(.5);
    camera.anchorY.setTo(.5);
    camera.layer = 1;

    const world = new Group(camera);
    world.layer = 1;
    const worldUI = new Group(camera);
    worldUI.layer = 3;

    state.scene.camera = camera;
    state.scene.world = world;
    state.scene.worldUI = worldUI;
});

addHandler('load', (state) => {
    // temporary initial state

    state.scene.camera.w.setTo(10);
    state.scene.camera.h.setTo(10);
});
