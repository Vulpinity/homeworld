const {addHandler, handle} = require('skid/lib/event')

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
    state.players.push({socket, team: nextTeam(state.players)})
})

addHandler('disconnection', (state, socket) => {
    state.players = state.players.filter((player) => {return player.ws !== socket})
})
