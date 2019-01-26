const {addHandler, handle} = require('skid/lib/event')
const uuidv4 = require('uuid/v4');

function nextTeam (players) {
    let teams = players.map((player) => {return player.team})
    let team1 = teams.filter((team) => {return team === 1}).length
    let team2 = teams.filter((team) => {return team === 2}).length
    if (team2 < team1) {
        return 2
    } else {
        return 1
    }
}

function teamPosition (team) {
    if (team === 1) {
        return {x: 0, y: 0, dx: 0, dy: 0}
    } else {
        return {x: 10, y: 0, dx: 0, dy: 0}
    }
}

addHandler('load', (state) => {
    state.players = []
})

addHandler('connection', (state, socket) => {
    let player = {id: uuidv4(), team: nextTeam(state.players), socket}
    handle(state, 'send', {
        socket: socket,
        msg: {type: 'assignment', player: {id: player.id, team: player.team}}})
    handle(state, 'playerstart', player)
})

addHandler('disconnection', (state, socket) => {
    state.players = state.players.filter((player) => {return player.ws !== socket})
})

addHandler('newship', (state, ship) => {
    ship.position = teamPosition(ship.team)
})