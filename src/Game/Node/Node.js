const NODE_RADIUS = CELL_SIZE / 2 - 6;
const CLAMP_SIZE = CELL_SIZE / 4;

const INPUT_COLOR = "#15B172";
const OUTPUT_COLOR = "#FFBB1F";
const BOTH_COLOR = "#515151";

const NODE_CONNECTION_MODE_BOTH = 0;
const NODE_CONNECTION_MODE_INPUT = 1;
const NODE_CONNECTION_MODE_OUTPUT = 2;

class Node {
    constructor(game, x, y) {
        this.x = x;
        this.y = y;
        this.renderX = 0;
        this.renderY = 0;
        this.inputConnections = [];
        this.outputConnections = [];
        this.dataStream = [];
        this.game = game;

        this.setMode(NODE_CONNECTION_MODE_BOTH);
    }

    getClampedPosition() {
        return {
            x: Math.floor(this.x / CLAMP_SIZE) * CLAMP_SIZE,
            y: Math.floor(this.y / CLAMP_SIZE) * CLAMP_SIZE
        }
    }

    processStreamable(data) {
        this.addStreamable(data);
    }

    addStreamable(data) {
        data.x = this.x;
        data.y = this.y;

        this.dataStream.push(data);
    }

    removeStreamable(data) {
        const index = this.dataStream.indexOf(data);
        if (index <= -1)
            return;

        this.dataStream.splice(index, 1);
    }

    setMode(mode) {
        this.nodeMode = mode;
        this.color = getColorByMode(mode);
    }

    update(deltaTime) {
        if (!this.game.simulation.simulating) return;
        if (this.nodeMode === NODE_CONNECTION_MODE_OUTPUT) return;

        while (this.dataStream.length > 0) {
            const data = this.dataStream.pop();
            this.outputConnections.forEach(x => x.addStreamable(data.clone()));
        }
    }

    draw(camera, ctx) {
        ctx.beginPath();

        ctx.arc(this.renderX + camera.offsetX,
            this.renderY + camera.offsetY,
            camera.zoom * NODE_RADIUS,
            0,
            Math.PI * 2,
            false);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = camera.zoom;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        this.dataStream.forEach(x => x.draw(ctx, camera.zoom, camera));
    }

    adjustPosition(camera) {
        const zoom = camera.zoom;
        this.renderX = worldToRender(this.x, zoom, 0);
        this.renderY = worldToRender(this.y, zoom, 0);
    }
}

function worldToRender(raw, zoom, offset) {
    return Math.floor(raw / CLAMP_SIZE) * CLAMP_SIZE * zoom + offset;
}

function getColorByMode(mode) {
    return mode === NODE_CONNECTION_MODE_BOTH
        ? BOTH_COLOR
        : mode === NODE_CONNECTION_MODE_INPUT
            ? INPUT_COLOR
            : OUTPUT_COLOR;
}