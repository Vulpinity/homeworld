// This contains a bunch of math to determine if ships will explode.
const {addHandler, handle} = require('skid/lib/event')
const {MAX_LEN_LASER, MIN_LEN_LASER} = require('../../constants')

addHandler('positionevents', (state, collisionSet) => {
    if (!(collisionSet === 'ships')) {
        // We don't support collision events for anything else at the moment. Maybe ever.
        return
    }
    let toCheck = state[collisionSet]
    // Separate the ships of the two teams.
    let teamSets = [1, 2].map((val) => {
            return Object.values(toCheck).filter((ship) => {
                return ship.team === val
            })
        }
    )
    // Get all of the possible pairs from each team.
    let pairSets = teamSets.map((team) => {
        let pairs = []
        for (let i=0; i < team.length - 1; i++) {
            for (let j=i + 1; j < team.length; j++ ) {
                pairs.push([team[i], team[j]])
            }
        }
        return pairs
    })
    // Filter out any pairs that aren't close together enough.
    let connectedSets = pairSets.map((pairSet) => {
        return pairSet.filter((pair) => {
            let a = pair[0].position
            let b = pair[1].position
            let distance = pointDistance(a, b)
            return (MIN_LEN_LASER < distance) && (distance <= MAX_LEN_LASER)
        })
    })
    // Lop off the ends of the lasers so that there's a grace area users can pass over.
    let shrunkenSets = connectedSets.map((pairSet) => {
        return pairSet.map((pair) => {return shrinkSegment(pair[0], pair[1], 3)})
    })
    // Now to find out who is dead.
    runCollisions(state, shrunkenSets[0], teamSets[1])
    runCollisions(state, shrunkenSets[1], teamSets[0])
})

function runCollisions (state, connectedSets, opposingTeam) {
    // Checks to see if anyone blew up, and sends a death event, if so.
    for (let member of opposingTeam) {
        for (let connectedSet of connectedSets) {
            if (pointDistanceToSegment(connectedSet[0].position, connectedSet[1].position, member.position) <= .5) {
                handle(state, 'death', {killed: member, killers: connectedSet})
            }
        }
    }
}

function pointDistance(a, b) {
    // get the distance between two points.
    return Math.abs(Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2)))
}

// Thanks to KathTheDragon for this algorithm.
function shrinkEnd(p1, p2, length, reduction) {
    return {x: p1.x + (reduction * (p2.x-p1.x)/length), y: p1.y + (reduction * (p2.y - p1.y) / length)}
}

function shrinkSegment(p1, p2, reduction) {
    let length = pointDistance(p1.position, p2.position)
    let p1b = shrinkEnd(p1.position, p2.position, length, reduction / 2)
    let p2b = shrinkEnd(p2.position, p1.position, length, reduction / 2)
    return [{id: p1.player, position: p1b}, {id: p2.player, position: p2b}]
}


// csharphelper.com/blog/2016/09/find-the-shortest-distance-between-a-point-and-a-line-segment-in-c/

function pointDistanceToSegment (p1, p2, pt) {
    // p1 and p2 are the two points from which a line segment is built.
    // pt is a free-floating point whose distance from said segment we need to find.
    let closest
    let dx = p2.x - p1.x
    let dy = p2.y - p1.y
    if ((dx === 0) && (dy === 0)) {
        // It's a point, not a line segment.
        return pointDistance(pt, p1)
    }

    // Calculate the t that minimizes the distance.
    let t = ((pt.x - p1.x) * dx + (pt.y - p1.y) * dy) / (dx * dx + dy * dy)

    if (t < 0) {
        dx = pt.x - p1.x
        dy = pt.y - p1.y
    } else if (t > 1) {
        dx = pt.x - p2.x
        dy = pt.y - p2.y
    } else {
        closest = {x: p1.x + t * dx, y: p1.y + t * dy}
        dx = pt.x - closest.x;
        dy = pt.y - closest.y;
    }
    return Math.sqrt(dx * dx + dy * dy);
}
