const uuidv4 = require('uuid/v4');
const {addHandler, handle} = require('skid/lib/event')
const {PHYSICS_INTERVAL} = require('../../constants')

addHandler('load', (state) => {
    state.ships = {}
})

addHandler('playerleft', (state, player) => {
    const ship = shipOfPlayer(state, player);
    if (!ship) return;
    handle(state, 'death', {killed: ship});
})

function shipOfPlayer(state, player) {
    for (const ship of Object.values(state.ships)) {
        if (ship.player === player.id) {
            return ship;
        }
    }
}

function makeShip(state, player) {
    let id = uuidv4()
    let ship = {team: player.team, player: player.id, id}
    state.ships[id] = ship
    handle(state, 'newship', ship)
}
exports.makeShip = makeShip

addHandler('tick', (state) => {
    handle(state, 'updatephysics', 'ships')
    handle(state, 'positionevents', 'ships')
    handle(state,'send', {msg: {type: 'positionUpdate', ships: state.ships}})
})

addHandler('input_position', (state, data) => {
    // This input is taken directly from the client. It is not validated. Normally, this would be insane, but this is a
    // 'develop a game in 48 hours challenge' and we'll only play it a few times, likely.
    try {
        if (state.ships[data.msg['id']] === undefined) {
            if (state.debug) {
                console.log(`Got position for non-existant ship, '${data.msg.id}'`)
            }
            return
        }
        state.ships[data.msg['id']].position = data.msg['position']
    } catch (err) {
        console.log("Couldn't update position!")
        console.error(err)
    }
})

addHandler('updatephysics', (state) => {
    for (const ship of Object.values(state.ships)) {
        ship.position.x += (ship.position.dx * (PHYSICS_INTERVAL / 1000))
        ship.position.y += (ship.position.dy * (PHYSICS_INTERVAL / 1000))
    }
});

addHandler('input_shipdirection', (state, data) => {
    // This input is taken directly from the client. It is not validated. Normally, this would be insane, but this is a
    // 'develop a game in 48 hours challenge' and we'll only play it a few times, likely.
    try {
        if (!state.ships[data.msg.id]) {
            // Ship has been eliminated.
            return
        }
        let ship = state.ships[data.msg.id]
        ship.position.dx = data.msg.dx
        ship.position.dy = data.msg.dy
    } catch (err) {
        console.log("Couldn't update position!")
        console.error(err)
    }
})

function pairsToObject (pairs) {
    let obj = {}
    for (let pair of pairs) {
        obj[pair[0]] = pair[1]
    }
    return obj
}


addHandler('playerleft', (state, player) => {
    let remaining = Object.entries(state.ships).filter((entry) => {
        return entry[1].player !== player.id
    })
    // Is there no inverse of Object.entries? Surely there's a quick way to turn an array of key,
    // value pairs into an object!
    state.ships = pairsToObject(remaining)
})


addHandler('death', (state, combatants) => {
    let ship = combatants.killed
    let remaining = Object.entries(state.ships).filter((entry) => {
        return entry[0] !== ship.id
    })
    state.ships = pairsToObject(remaining)
    handle(state, 'send', {msg: {type: 'death', ship: ship.id}})
})
