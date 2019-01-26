
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
    console.log('Updating positions!')
    handle(state,'send', {msg: {type: 'positionUpdate', ships: state.ships}})
})