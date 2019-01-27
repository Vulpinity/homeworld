const {addHandler} = require('skid/lib/event');
const {PieAvatar} = require('skid/lib/scene/pie-avatar');
const {distanceXY} = require('skid/lib/vector2');
const {BOUNDS_DIAMETER, PHYSICS_INTERVAL} = require('../constants');

const BOUNDS_RADIUS = BOUNDS_DIAMETER / 2;

addHandler('load', (state) => {
    const field = new PieAvatar(state.scene.camera);
    field.layer = 0;
    field.breadth.setTo(.9999999999); // TODO: bug in Skid; won't pick up inner radius if >=1
    field.innerRadiusRel.setTo(.99);
    field.w.setTo(BOUNDS_DIAMETER);
    field.h.setTo(BOUNDS_DIAMETER);
    field.fillStyle = 'gray';
});

addHandler('update_physics', (state) => {
    if (state.localShip) {
        const ship = state.localShip;

        const dist = distanceXY(0, 0, ship.x, ship.y);

        // NOTE: Should actually be - .5 but numerical stability below temporarily requires this
        // ship can get snagged on the edge of the boundary somehow
        if (dist > BOUNDS_RADIUS + .5) {

            // normalized vector towards center
            let headingX = -ship.x / dist;
            let headingY = -ship.y / dist;

            // vector to edge of boundary
            headingX *= dist - BOUNDS_RADIUS - .5;
            headingY *= dist - BOUNDS_RADIUS - .5;

            // multiply by boundary pressure
            headingX *= 20;
            headingY *= 20;

            ship.dx += headingX * (PHYSICS_INTERVAL / 1000);
            ship.dy += headingY * (PHYSICS_INTERVAL / 1000);

            ship.dx *= .97;
            ship.dy *= .97;
        }
    }
});
