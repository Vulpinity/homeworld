const {addHandler} = require('skid/lib/event');
const {handleInterval} = require('skid/lib/timer');
const {PieAvatar} = require('skid/lib/scene/pie-avatar');
const {linear} = require('skid/lib/tween');

require('skid/lib/input');

addHandler('load', (state) => {
    state.ships = {};
    updateShip(state, 1, false, 0, 0, .5, -.5, 1);
    updateShip(state, 2, false, 0, 0, .5, .5, 2);
    updateShip(state, 3, false, 0, 0, -.5, .5, 3);

    handleInterval(state, 1000, 'ship_updateall');
    handleInterval(state, 100, 'ship_updateposition');
});

addHandler('key', (state, event) => {
    
})

addHandler('message', (state, data) => {
    var message = JSON.parse(data);
    if (message["type"] === "assignment") {
        state.playerId = message["player"].id;
    } else if (message["type"] === "positionUpdate") {
        var shipDetails = message["ships"];
        Object.keys(shipDetails).forEach(function (key) {
            var player = shipDetails[key].player;
            var positions = shipDetails[key].position;
            var team = shipDetails[key].team;
            updateShip(state, player, player === state.playerId, positions.x, positions.y, positions.dx, positions.dy, team);
        });
    }
});

addHandler('ship_updateall', (state) => {
    for (const ship of Object.values(state.ships)) {
        ship.scene.x.mod(ship.dx, 1000, linear);
        ship.scene.y.mod(ship.dy, 1000, linear);
    }
});

addHandler('ship_updateposition', (state) => {
    for (const ship of Object.values(state.ships)) {
        //make ship.x and ship.y aggregate dx and dy values respectively

    }
});

function updateShip(state, id, isPlayer, x, y, dx, dy, team) {
    let ship = state.ships[id];
    if (!ship) {
        ship = {id};
        state.ships[id] = ship;

        const body = new PieAvatar(state.scene.camera);
        body.breadth.setTo(1);
        ship.scene = body;
        body.x.setTo(x);
        body.y.setTo(y);
        body.w.setTo(1);
        body.h.setTo(1);

        setShipColor(body, isPlayer, team);
    }
    ship.x = x;
    ship.y = y;
    ship.dx = dx;
    ship.dy = dy;
}

function setShipColor(ship, isPlayer, team) {
    if (!isPlayer) {
        switch(team){
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