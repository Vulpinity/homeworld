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

addHandler('load', (state) => {
    state.players = []
})

addHandler('connection', (state, socket) => {
    let player = {id: uuidv4(), team: nextTeam(state.players), socket, score: 0}
    state.players.push(player)
    handle(state, 'send', {
        socket: socket,
        msg: {type: 'assignment', player: {id: player.id, team: player.team}}})
    handle(state, 'playerstart', player)
})

addHandler('disconnection', (state, socket) => {
    let player
    for (player of state.players) {
        if (player.socket === socket ) {
            break
        }
    }
    state.players.splice(state.players.indexOf(player), 1)
    state.players = state.players.filter((player) => {return player.ws !== socket})
    handle(state, 'playerleft', player)
})

function playerOfId(state, id) {
    for (const player of state.players) {
        if (player.id === id) return player;
    }
}

exports.playerOfId = playerOfId;
