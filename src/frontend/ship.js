const {addHandler, handle} = require('skid/lib/event');
const {handleInterval} = require('skid/lib/timer');
const {stateOf} = require('skid/lib/keyboard')
const KEYS = require('skid/lib/key'); // Holds keyboard value constants.
const {PieAvatar} = require('skid/lib/scene/pie-avatar');
const {linear} = require('skid/lib/tween');
const {PHYSICS_INTERVAL, ACCELERATION_FACTOR, MAX_ACCELERATION, FRICTION_FACTOR} = require('../constants');
require('skid/lib/input');

addHandler('load', (state) => {
    state.ships = {};
});

addHandler('load_done', (state) => {
    handleInterval(state, 1000, 'ship_updateall');
    handleInterval(state, PHYSICS_INTERVAL, 'update_physics')
});


addHandler('message', (state, data) => {
    let message = JSON.parse(data);
    if (message["type"] === "assignment") {
        state.playerId = message["player"].id;
    } else if (message["type"] === "positionUpdate") {
        let shipDetails = message["ships"];
        Object.keys(shipDetails).forEach(function (key) {
            let id = shipDetails[key].id
            let player = shipDetails[key].player
            let positions = shipDetails[key].position;
            let team = shipDetails[key].team;
            updateShip(state, id, player === state.playerId, positions.x, positions.y,
                       positions.dx, positions.dy, team);

            if (player === state.playerId) {
                state.localShip = state.ships[id];
            }
        });
    } else if (message["type"] === "death") {
        handle(state, 'ship_destroying', message['ship']);
    }
});

const TRANSLATIONS = {
}

TRANSLATIONS[KEYS.W] = KEYS.UP
TRANSLATIONS[KEYS.S] = KEYS.DOWN
TRANSLATIONS[KEYS.A] = KEYS.LEFT
TRANSLATIONS[KEYS.D] = KEYS.RIGHT

const MOVE_MAPPINGS = [
    [KEYS.UP, {dx: 0, dy: -ACCELERATION_FACTOR}],
    [KEYS.DOWN, {dx: 0, dy: ACCELERATION_FACTOR}],
    [KEYS.LEFT, {dx: -ACCELERATION_FACTOR, dy: 0}],
    [KEYS.RIGHT, {dx: ACCELERATION_FACTOR, dy: 0}]
]

addHandler('update_physics', (state) => {
    if (!state.localShip) {
        return
    }
    // state.localShip.dx *=  1 - (FRICTION_FACTOR * (PHYSICS_INTERVAL / 1000))
    // state.localShip.dy *=  1 - (FRICTION_FACTOR * (PHYSICS_INTERVAL / 1000))
    for (let mapping of MOVE_MAPPINGS) {
        let key = mapping[0]
        let vector = mapping[1]
        if (stateOf(key)) {
            state.localShip.dx += (vector.dx * (PHYSICS_INTERVAL / 1000))
            if (state.localShip.dx > MAX_ACCELERATION) {
                state.localShip.dx = MAX_ACCELERATION
            }
            state.localShip.dy += (vector.dy * (PHYSICS_INTERVAL / 1000))
            if (state.localShip.dy > MAX_ACCELERATION) {
                state.localShip.dy = MAX_ACCELERATION
            }
        }
    }
    handle(state, 'send', {
        type: 'shipdirection', dx: state.localShip.dx, dy: state.localShip.dy, id: state.localShip.id
    })
})

addHandler('ship_destroying', (state, id) => {
    const ship = state.ships[id];
    if (!ship) return;
    delete state.ships[id];
    ship.scene.remove();
    if (state.localShip === ship) {
        state.localShip = undefined;
    }
    handle(state, 'ship_destroyed', ship);
});


function updateShip(state, id, isPlayer, x, y, dx, dy, team) {
    let ship = state.ships[id];
    if (!ship) {
        ship = {id, team};
        state.ships[id] = ship;

        const body = new PieAvatar(state.scene.camera);
        body.layer = 1;
        body.breadth.setTo(1);
        body.x.setTo(x);
        body.y.setTo(y);
        body.w.setTo(1);
        body.h.setTo(1);

        setShipColor(body, isPlayer, team);

        ship.scene = body;
        ship.x = x;
        ship.y = y;
        ship.dx = dx;
        ship.dy = dy;

        handle(state, 'ship_created', ship);
    } else {
        ship.x = x;
        ship.y = y;
        if (ship !== state.localShip) {
            ship.dx = dx;
            ship.dy = dy;
        }
    }

    ship.scene.x.modTo(ship.x, PHYSICS_INTERVAL, linear);
    ship.scene.y.modTo(ship.y, PHYSICS_INTERVAL, linear);
}

function setShipColor(ship, isPlayer, team) {
    if (!isPlayer) {
        switch(team) {
            case 1:
                ship.fillStyle = 'yellow';
                break;
            case 2:
                ship.fillStyle = 'blue';
                break;
            case 3:
                ship.fillStyle = 'gray';
                break;
        }
    } else {
        ship.fillStyle = 'green';
    }
}
