const NODE_RADIUS = CELL_SIZE / 2 - 6;
const CLAMP_SIZE = CELL_SIZE / 4;

const INPUT_COLOR = "#15B172";
const OUTPUT_COLOR = "#FFBB1F";
const BOTH_COLOR = "#515151";

const NODE_CONNECTION_MODE_BOTH = 0;
const NODE_CONNECTION_MODE_INPUT = 1;
const NODE_CONNECTION_MODE_OUTPUT = 2;

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.renderX = 0;
        this.renderY = 0;
        this.inputConnections = [];
        this.outputConnections = [];

        this.setMode(NODE_CONNECTION_MODE_BOTH);
    }

    setMode(mode) {
        this.nodeMode = mode;
        this.color = getColorByMode(mode);
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