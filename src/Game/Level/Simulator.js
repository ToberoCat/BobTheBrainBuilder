class Simulator extends GameElement {

    constructor(game) {
        super(game);
    }

    draw(ctx) {
        const level = this.game.level.loadedLevel;
        if (!level) return;
    }
}

class ProcessableData {
    constructor(value) {
    }

    process(connection) {
        this.value = this.value * connection.weight;
    }
}