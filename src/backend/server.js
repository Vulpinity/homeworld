const express = require('express')
const path = require('path');
const app = express()
const expressWs = require('express-ws')(app);

const port = 3000

app.use(express.static(path.join(__dirname, '../../dist')))


app.ws('/io', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  })
})

app.listen(port, () => console.log(`Defend your homeworld running on port ${port}!`))
