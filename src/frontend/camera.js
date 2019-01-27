const {addHandler, handle} = require('skid/lib/event');
const {Group} = require('skid/lib/scene/group');
const {Camera} = require('skid/lib/scene/camera');
const {linear} = require('skid/lib/tween');
const {canvasOf} = require('./viewport');
const {localShip} = require('./ship');

addHandler('load', (state) => {
    const camera = new Camera(state.scene.renderer);
    camera.anchorX.setTo(.5);
    camera.anchorY.setTo(.5);
    camera.layer = 2;

    const world = new Group(camera);
    world.layer = 2;
    const worldUI = new Group(camera);
    worldUI.layer = 3;

    state.scene.camera = camera;
    state.scene.world = world;
    state.scene.worldUI = worldUI;
});

addHandler('load resize', (state) => {
    const canvas = canvasOf(state);
    const aspect = canvas.width / canvas.height;
    state.scene.camera.w.setTo(20 * aspect);
    state.scene.camera.h.setTo(20);
});

addHandler('update_physics', (state) => {
    const ship = state.localShip;
    if (!ship) return;
    if (state.scene.camera.x.dest === ship.x && state.scene.camera.y.dest === ship.y) return;
    state.scene.camera.x.modTo(ship.x, 1000, linear);
    state.scene.camera.y.modTo(ship.y, 1000, linear);
    // TODO: maybe use quadratic?
});
