export const InfoType = {
    vote: "vote",
    movement: "movement",
    trap: "trap",
    sprint: "sprint",
    update: "update"
}

export const PlayerType = {
    player: "player",
    enemy: "enemy"
}

export function Vote(vote) {
    this.type = InfoType.vote,
        this.vote = vote
}

export function Movement(direction, who) {
    this.type = InfoType.movement,
        this.who = who,
        this.direction = direction,
        this.timestamp = Date.now()
}

export function Trap(coordinates) {
    this.type = InfoType.trap,
        this.coordinates = coordinates
}

export function Sprint(who) {
    this.type = InfoType.sprint,
        this.who = who,
        this.timestamp = Date.now()
}

export function Update() {
    this.type = InfoType.update
}

