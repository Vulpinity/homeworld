const {addHandler, handle} = require('skid/lib/event')
const uuidv4 = require('uuid/v4');
const express = require('express')
const path = require('path')
const expressWs = require('express-ws')
const port = 3000


addHandler('load', (state) => {
    state.connections = []
    state.expressApp = express()
    // Augment express with web socket handling.
    expressWs(state.expressApp)

    // Serve static files.
    state.expressApp.use(express.static(path.join(__dirname, '../../../dist')))
    state.expressApp.ws('/io', function (ws) {
        handle(state, 'connection', ws)
        ws.on('message', function (msg) {
            handle(state,'input', {ws, msg})
        })
        ws.on('close', function () {
            handle(state,'disconnection', ws)
        })
    })
    // express-ws will swallow errors without this. Must be last in the middleware chain.
    // https://stackoverflow.com/questions/43736206/express-ws-is-silencing-errors
    function errorHandler (err, req, res, next) {
        if (req.ws){
            console.error("ERROR from WS route - ", err);
        } else {
            console.error(err);
            res.setHeader('Content-Type', 'text/plain');
            res.status(500).send(err.stack);
        }
    }
    state.expressApp.use(errorHandler);
})

addHandler('load_done', (state) => {
    state.ships[uuidv4()] = (
        {"team":1,"player":"661417c5-7e3d-4e76-8fe8-47f176a966cc","position":{"x":-5,"y":2,"dx":1,"dy":0}}
    )
    state.ships[uuidv4()] =(
        {"team":1,"player":"661417c5-8e3d-4e76-8fe8-47f176a966cc","position":{"x":-5,"y":-2,"dx":1,"dy":0}}
    )
    state.ships[uuidv4()] =(
        {"team":2,"player":"661417c5-9e3d-4e76-8fe8-47f176a966cc","position":{"x":0,"y":0,"dx":0,"dy":0}}
    )
    state.expressApp.listen(port, () => console.log(`Defend your homeworld running on port ${port}!`))
})

addHandler('connection', (state, socket) => {
    state.connections.push(socket)
})

addHandler('disconnection', (state, socket) => {
    state.connections = state.connections.filter((val) => {return socket !== val})
})

addHandler('send', (state, data) => {
    if (data.socket === undefined) {
        for (let ws of state.connections) {
            ws.send(JSON.stringify(data.msg))
        }
        return
    }
    data.socket.send(JSON.stringify(data.msg))
})
