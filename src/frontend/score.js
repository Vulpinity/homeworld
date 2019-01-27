const {addHandler, handle} = require('skid/lib/event')
const {TextAvatar} = require('skid/lib/scene/text-avatar')
const {canvasOf} = require('./viewport')


addHandler('load', (state) => {
    state.scoreAvatar = new TextAvatar(state.scene.hudCamera, state.scene.hudCamera)
    state.scoreAvatar.fillStyle = 'white'
    state.scoreAvatar.x.setTo(0)
    state.scoreAvatar.y.setTo(0)
    state.scoreAvatar.font = '1em sans'
    state.scoreAvatar.textAlign = 'left'
    state.scoreAvatar.textBaseline = 'top'
    state.scoreAvatar.text = 'Connecting...'
})

addHandler('message', (state, message) => {
    if (message.type !== 'score') {
        return
    }
    state.score = message.score
    draw(state)
})

function draw(state) {
    let text = `Team 1: ${state.score.team[1]} | `
    text += `Team 2: ${state.score.team[2]} | `
    text += `You (on team ${state.playerTeam}): ${state.score.players[state.playerId]}`
    state.scoreAvatar.text = text
    state.scoreAvatar.changed()
}