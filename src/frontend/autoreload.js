const {addHandler} = require('skid/lib/event');

const saveDead = false
let firstRun = true

addHandler('connect', (state) => {
    if (!firstRun && !saveDead) {
        location.reload()
    }
    firstRun = false
});
