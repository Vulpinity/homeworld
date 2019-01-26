
const uuidv4 = require('uuid/v4');

const {addHandler, handle} = require('skid/lib/event')

addHandler('load', (state) => {
    state.ships = {}
})

addHandler('playerstart', (state, player) => {
    let ship = {team: player.team, player: player.id}
    state.ships[uuidv4()] = ship
    handle(state, 'newship', ship)
})

addHandler('tick', (state) => {
    handle(state, 'positionevents', 'ships')
    handle(state,'send', {msg: {type: 'positionUpdate', ships: state.ships}})
})

addHandler('input_position', (state, data) => {
    // This input is taken directly from the client. It is not validated. Normally, this would be insane, but this is a
    // 'develop a game in 48 hours challenge' and we'll only play it a few times, likely.
    try {
        state.ships[data.msg['id']].position = data.msg['position']
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


addHandler('death', (state, ship) => {
    state.ships.splice(state.ships.indexOf(ship, 1))
    handle(state, 'send', {msg: {type: 'death', ship: ship.id}})
})