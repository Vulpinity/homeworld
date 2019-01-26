const {addHandler} = require('skid/lib/event');
const {handleInterval} = require('skid/lib/timer');
const {RectAvatar} = require('skid/lib/scene/rect-avatar');

addHandler('load', (state) => {
    state.ships = {};
    updateShip(state, 1, 0, 0, 0, 0, 'a');

    handleInterval(state, 1000, 'ship_updateall');
});

addHandler('ship_updateall', (state) => {
    for (const ship of state.ships) {
        // TODO: ship.scene.x.modTo();
    }
});

function updateShip(state, id, x, y, dx, dy, team) {
    let ship = state.ships[id];
    if (!ship) {
        ship = {id};
        state.ships[id] = ship;

        const rect = new RectAvatar(state.scene.camera);
        ship.scene = rect;
        rect.x.setTo(x);
        rect.y.setTo(y);
        rect.w.setTo(1);
        rect.h.setTo(1);
        rect.anchorX.setTo(.5);
        rect.anchorY.setTo(.5);
        rect.fillStyle = 'red';
    }
    ship.x = x;
    ship.y = y;
    ship.dx = dx;
    ship.dy = dy;
}
