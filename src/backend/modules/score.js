const {addHandler, handle} = require('skid/lib/event')
const {playerOfId} = require('./players')
const {KILL_SCORE} = require('../../constants')

addHandler('death', (state, combatants) => {
    for (const killer of combatants.killers) {
        let player = playerOfId(state, killer.id)
        if (player === undefined) {
            console.log(killer.id + ' not found. Cannot award points.')
            break
        }
        playerOfId(state, killer.id).score += KILL_SCORE / 2
    }
    let killed = playerOfId(state, combatants.killed.player)
    if (killed === undefined) {
        console.log(combatants.killed.player + ' not found. Cannot deduct points.')
        return
    }
    killed.score -= KILL_SCORE / 2
    if (killed.score < 0) {
        killed.score = 0
    }
    handle(state, 'updateScore')
})


function tallyScore(state) {
    let score = {team: {1: 0, 2: 0}, players: {}}
    for (const player of state.players) {
        score.team[player.team] += player.score
        score.players[player.id] = player.score
    }
    return score
}

function updateScore(state) {
    handle(state, 'send', {msg:{type: 'score', score: tallyScore(state)}})
}

for (const eventType of ['updateScore', 'connection', 'disconnection']) {
    addHandler(eventType, updateScore)
}