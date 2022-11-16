const DATA_SIZE = 10;

class Simulator extends GameElement {

    constructor(game) {
        super(game);
        this.simulating = false;
        new SimulationButton(this, game);
    }

    draw(ctx) {
        const level = this.game.level.loadedLevel;
        if (!level) return;
    }
}

class ProcessableData {
    constructor(r, g, b, x, y) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = g;
        this.b = b;
    }

    draw(ctx, zoom, camera) {
        const size = DATA_SIZE * zoom
        const halfSize = size / 2;
        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
        ctx.beginPath();

        ctx.rect(
            this.x * zoom + camera.offsetX - halfSize,
            this.y * zoom + camera.offsetY - halfSize,
            size,
            size
        );

        ctx.fill();
        ctx.closePath();
    }

    clone() {
        return new ProcessableData(this.r, this.g, this.b, this.x, this.y);
    }
}