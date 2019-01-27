const {addHandler} = require('skid/lib/event');
const {handleLater} = require('skid/lib/timer');
const {makeShip} = require('./ships');
const {playerOfId} = require('./players');
const {TIME_SPAWN} = require('../../constants');

function teamPosition(team) {
    if (team === 1) {
        return {x: 14.5, y: 0, dx: 0, dy: 0};
    } else {
        return {x: -14.5, y: 0, dx: 0, dy: 0};
    }
}

addHandler('playerstart', (state, player) => {
    makeShip(state, player);
});

addHandler('newship', (state, ship) => {
    ship.position = teamPosition(ship.team);
});

addHandler('death', (state, combatants) => {
    handleLater(state, TIME_SPAWN, 'respawn', combatants.killed.player);
});

addHandler('respawn', (state, playerId) => {
    const player = playerOfId(state, playerId);
    if (!player) return;
    makeShip(state, player);
});
