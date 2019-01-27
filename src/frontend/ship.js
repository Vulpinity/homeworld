const {addHandler, handle} = require('skid/lib/event');
const {handleInterval} = require('skid/lib/timer');
const {PieAvatar} = require('skid/lib/scene/pie-avatar');
const {linear} = require('skid/lib/tween');
const {PHYSICS_INTERVAL} = require('../constants');
require('skid/lib/input');

addHandler('load', (state) => {
    state.ships = {};
});

addHandler('load_done', (state) => {
    handleInterval(state, 1000, 'ship_updateall');
    handleInterval(state, PHYSICS_INTERVAL, 'update_physics');
});

addHandler('key', (state, event) => {

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
                positions.dx, positions.dy, team)

            if (player === state.playerId) {
                state.localShip = state.ships[id];
            }
        });
    } else if (message["type"] === "death") {
        let ship = state.ships[message['ship']]
        delete state.ships[message['ship']]
        ship.scene.remove()
    }
});

addHandler('ship_updateall', (state) => {
    for (const ship of Object.values(state.ships)) {
        ship.scene.x.mod(ship.dx, 1000, linear);
        ship.scene.y.mod(ship.dy, 1000, linear);
    }
});

addHandler('update_physics', (state) => {
    for (const ship of Object.values(state.ships)) {
        ship.x += (ship.dx * .1)
        ship.y += (ship.dy * .1)
        handle(state,'send', {type: 'position', position: {x: ship.x, y: ship.y, dx: ship.dx, dy: ship.dy}, id: ship.id})
    }
    // TODO: update only own ship
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
        ship.dx = dx;
        ship.dy = dy;
    }
}

function setShipColor(ship, isPlayer, team) {
    if (!isPlayer) {
        switch(team) {
            case 1:
                ship.fillStyle = 'red';
                break;
            case 2:
                ship.fillStyle = 'blue';
                break;
            case 3:
                ship.fillStyle = 'yellow';
                break;
        }
    } else {
        ship.fillStyle = 'green';
    }
}
