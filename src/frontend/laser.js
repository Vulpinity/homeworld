const {addHandler} = require('skid/lib/event');
const {handleInterval} = require('skid/lib/timer');
const {linear} = require('skid/lib/tween');
const {LineAvatar} = require('./line-avatar');
const {PHYSICS_INTERVAL} = require('../constants');

addHandler('load', (state) => {
    state.lasers = {};
});

addHandler('ship_created', (state, ship) => {
    for (const other of Object.values(state.ships)) {
        if (other === ship) continue;
        if (other.team !== ship.team) continue;

        updateLaser(state, ship, other);
    }
});

function updateLaser(state, shipA, shipB) {
    const id = `${shipA.id}_${shipB.id}`;
    let created = false;
    let laser = state.lasers[id];
    if (!laser) {
        created = true;
        laser = {id};
        state.lasers[id] = laser;

        laser.scene = new LineAvatar(state.scene.world);
        laser.scene.strokeStyle = 'red';
        laser.scene.lineWidth = .1;
        laser.shipA = shipA;
        laser.shipB = shipB;
    }

    const x1 = laser.shipA.scene.x.curr;
    const y1 = laser.shipA.scene.y.curr;
    const x2 = laser.shipB.scene.x.curr;
    const y2 = laser.shipB.scene.y.curr;

    if (created) {
        laser.scene.x1.setTo(x1);
        laser.scene.y1.setTo(y1);
        laser.scene.x2.setTo(x2);
        laser.scene.y2.setTo(y2);
    } else {
        laser.scene.x1.modTo(x1, PHYSICS_INTERVAL, linear);
        laser.scene.y1.modTo(y1, PHYSICS_INTERVAL, linear);
        laser.scene.x2.modTo(x2, PHYSICS_INTERVAL, linear);
        laser.scene.y2.modTo(y2, PHYSICS_INTERVAL, linear);
    }

}

addHandler('update_physics', (state) => {
    for (const laser of Object.values(state.lasers)) {
        updateLaser(state, laser.shipA, laser.shipB);
    }
});
