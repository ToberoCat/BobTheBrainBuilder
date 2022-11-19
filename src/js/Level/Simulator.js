const DATA_SIZE = 10;

class Simulator extends GameElement {

    constructor(game) {
        super(game);
        this.simulating = false;
        this.simulationButton = new SimulationButton(this, game);
        this.addEventListener("keydown", this.simulationButton.keyDown);
    }

    stopSimulation() {
        this.simulationButton.speedSlider.style.animation = "fadeOut .2s ease-in both";
        setTimeout(() => this.simulationButton.speedSlider.style.visibility = "hidden", 200);
        this.simulating = false;
        document.getElementById('playbutton').src = "res/buttons/speed/default-speed-selected.svg";
        this.reset();
    }

    reset() {
        this.game.nodeConnectionManager.connections.forEach(conn => conn.reset());
        this.game.nodePlacementManager.nodes.forEach(node => {
            if (node.nodeMode === NODE_CONNECTION_MODE_INPUT)
                node.inputConnections.length = 0;

            node.reset()
        });
        this.game.level.reset();
    }
}

class ProcessableData {
    constructor(r, g, b, x, y) {
        this.x = x;
        this.y = y;

        this.r = r;
        this.g = g;
        this.b = b;

        this.finalR = r;
        this.finalG = g;
        this.finalB = b;
    }

    draw(ctx, zoom, camera, d=true) {
        const size = DATA_SIZE * zoom
        const halfSize = size / 2;
        ctx.fillStyle = d ? `rgb(${this.r * 255}, ${this.g * 255}, ${this.b * 255})` : "rgb(0, 0, 0)";
        ctx.strokeStyle = '#222522';
        ctx.beginPath();

        ctx.rect(
            this.x * zoom + camera.offsetX - halfSize,
            this.y * zoom + camera.offsetY - halfSize,
            size,
            size
        );

        ctx.lineWidth = 2 * zoom;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    clone() {
        return new ProcessableData(this.r, this.g, this.b, this.x, this.y);
    }
}