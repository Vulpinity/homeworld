const {Viewport} = require('skid/lib/scene/viewport');
const {Camera} = require('skid/lib/scene/camera');
const {Smoothing} = require('skid/lib/scene/smoothing');
const {addHandler} = require('skid/lib/event');
const {ClearAll} = require('skid/lib/scene/clear-all');

addHandler('load', (state) => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    document.body.appendChild(canvas);

    const renderer = new Viewport(canvas);
    
    const clearAll = new ClearAll(renderer);
    clearAll.layer = 1;
    
    const hudCamera = new Camera(renderer);
    hudCamera.layer = 2;
    hudCamera.w.setTo(1);
    hudCamera.h.setTo(1);

    state.scene = {renderer, hudCamera};
});

addHandler('load resize', (state) => {
    const scene = state.scene;
    const canvas = canvasOf(state);
    const width = canvas.parentElement.clientWidth - 2;
    const height = canvas.parentElement.clientHeight - 2;
    canvas.width = Math.floor(width / 2) * 2;
    canvas.height = Math.floor(height / 2) * 2;
    scene.renderer.changed();
    const aspect = canvas.width / canvas.height;
    scene.hudCamera.w.setTo(aspect);
    scene.hudCamera.x.setTo((1 - aspect) / 2);
});

function canvasOf(state) {
    return state.scene.renderer._canvas;
}
exports.canvasOf = canvasOf;

function contextOf(state) {
    return canvasOf(state).getContext('2d');
}
exports.contextOf = contextOf;
