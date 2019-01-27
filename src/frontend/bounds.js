const {addHandler} = require('skid/lib/event');
const {PieAvatar} = require('skid/lib/scene/pie-avatar');
const {BOUNDS_DIAMETER} = require('../constants');

addHandler('load', (state) => {
    const field = new PieAvatar(state.scene.camera);
    field.layer = 0;
    field.breadth.setTo(.9999999999); // TODO: bug in Skid; won't pick up inner radius if >=1
    field.innerRadiusRel.setTo(.99);
    field.w.setTo(BOUNDS_DIAMETER);
    field.h.setTo(BOUNDS_DIAMETER);
    field.fillStyle = 'gray';
});
