export const InfoType = {
    vote: "vote",
    movement: "movement",
    trap: "trap",
    sprint: "sprint",
    update: "update",
    winner: "winner",
    disconnect: "disconnect"
}

export const PlayerType = {
    player: "player",
    enemy: "enemy",
    none: "none"
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

export function Winner(who) {
    this.type = InfoType.winner,
        this.who = who;
}

