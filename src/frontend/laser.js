const {addHandler, handle} = require('skid/lib/event');
const {handleInterval} = require('skid/lib/timer');
const {linear} = require('skid/lib/tween');
const {distanceXY} = require('skid/lib/vector2');
const {loadAudio} = require('skid/lib/audio');
const {LineAvatar} = require('./line-avatar');
const {PHYSICS_INTERVAL, MAX_LEN_LASER} = require('../constants');

addHandler('load', (state) => {
    state.lasers = {};

    loadAudio(state, 'laser_off', {src: ['./assets/laser_off_0.ogg', './assets/laser_off_0.mp3']});
    loadAudio(state, 'laser_on', {src: ['./assets/laser_on_0.ogg', './assets/laser_on_0.mp3']});
});

addHandler('ship_created', (state, ship) => {
    for (const other of Object.values(state.ships)) {
        if (other === ship) continue;
        if (other.team !== ship.team) continue;

        updateLaser(state, ship, other);
    }
});

addHandler('ship_destroyed', (state, ship) => {
    for (const key of Object.keys(state.lasers)) {
        if (key.startsWith(ship.id) || key.endsWith(ship.id)) {
            const laser = state.lasers[key];
            laser.scene.remove();
            delete state.lasers[key];
        }
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
        laser.scene.layer = 2;
        laser.scene.lineWidth = .1;
        laser.shipA = shipA;
        laser.shipB = shipB;
    }

    let x1 = laser.shipA.scene.x.curr;
    let y1 = laser.shipA.scene.y.curr;
    let x2 = laser.shipB.scene.x.curr;
    let y2 = laser.shipB.scene.y.curr;

    const dist = distanceXY(x1, y1, x2, y2);
    if (3 <= dist && dist <= MAX_LEN_LASER) {
        if (laser.scene.strokeStyle !== 'red') {
            created = true;
            handle(state, 'laser_on');
        }
        laser.scene.strokeStyle = 'red';
    } else {
        if (laser.scene.strokeStyle === 'red') {
            handle(state, 'laser_off');
        }
        laser.scene.strokeStyle = 'transparent';
        return;
    }

    const [a, b] = shrinkSegment({x: x1, y: y1}, {x: x2, y: y2}, 3);
    x1 = a.x;
    y1 = a.y;
    x2 = b.x;
    y2 = b.y;

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


// NOTE: copied from backend vvv

function pointDistance(a, b) {
    // get the distance between two points.
    return Math.abs(Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)))
}

function shrinkEnd(p1, p2, length, reduction) {
    return {x: p1.x + (reduction * (p2.x-p1.x)/length), y: p1.y + (reduction * (p2.y - p1.y) / length)}
}

function shrinkSegment(p1, p2, reduction) {
    let length = pointDistance(p1, p2)
    let p1b = shrinkEnd(p1, p2, length, reduction / 2)
    let p2b = shrinkEnd(p2, p1, length, reduction / 2)
    return [p1b, p2b]
}
