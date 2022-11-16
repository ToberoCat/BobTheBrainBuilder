const NODE_RADIUS = CELL_SIZE / 2 - 6;
const CLAMP_SIZE = CELL_SIZE / 4;

const INPUT_COLOR = "#15B172";
const OUTPUT_COLOR = "#FFBB1F";
const BOTH_COLOR = "#515151";

const NODE_CONNECTION_MODE_BOTH = 0;
const NODE_CONNECTION_MODE_INPUT = 1;
const NODE_CONNECTION_MODE_OUTPUT = 2;

const NODE_PROCESSING_TIME = 1000;

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
        this.state = new ProcessableData(0, 0, 0, this.x, this.y);
        this.taskId = 0;

        this.setMode(NODE_CONNECTION_MODE_BOTH);
    }

    getClampedPosition() {
        return {
            x: Math.floor(this.x / CLAMP_SIZE) * CLAMP_SIZE,
            y: Math.floor(this.y / CLAMP_SIZE) * CLAMP_SIZE
        }
    }

    addStreamable(data) {
        data.x = this.x;
        data.y = this.y;

        this.state.r += data.finalR;
        this.state.g += data.finalG;
        this.state.b += data.finalB;

        this.dataStream.push(data);
    }

    setMode(mode) {
        this.nodeMode = mode;
        this.color = getColorByMode(mode);
    }

    update(deltaTime) {
        if (!this.game.simulation.simulating) return;
        if (this.nodeMode === NODE_CONNECTION_MODE_OUTPUT) return;

        if (this.dataStream.length >= this.inputConnections.length) {
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;

            while (this.dataStream.length > 0) {
                const data = this.dataStream.pop();
                sumR += data.finalR;
                sumG += data.finalG;
                sumB += data.finalB;
            }

            if (this.nodeMode === NODE_CONNECTION_MODE_INPUT)
                this.inputConnections.push({});

            this.taskId = setTimeout(() => {
                this.outputConnections.forEach(x => x.addStreamable(new ProcessableData(this.state.r,
                    this.state.g,
                    this.state.b,
                    0,
                    0)
                ));
            }, this.nodeMode === NODE_CONNECTION_MODE_INPUT ? 0 : NODE_PROCESSING_TIME);
        }
    }

    reset() {
        if (this.nodeMode === NODE_CONNECTION_MODE_INPUT) return;
        this.state = new ProcessableData(0, 0, 0, this.x, this.y);
        this.dataStream.length = 0;
        clearTimeout(this.taskId);
    }

    draw(camera, ctx) {
        ctx.beginPath();

        ctx.arc(this.renderX + camera.offsetX,
            this.renderY + camera.offsetY,
            camera.zoom * NODE_RADIUS,
            0,
            Math.PI * 2,
            false);
        ctx.fillStyle = this.getColorByState();
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = camera.zoom;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if (this.nodeMode === NODE_CONNECTION_MODE_BOTH)
            return;
        if (this.nodeMode === NODE_CONNECTION_MODE_INPUT)
            this.dataStream.forEach(x => x.draw(ctx, camera.zoom, camera));
        else if (!(this.state.r === 0 && this.state.g === 0 && this.state.b === 0)) {
            this.state.draw(ctx, camera.zoom, camera);
        }
    }

    getColorByState() {
        if (this.nodeMode !== NODE_CONNECTION_MODE_BOTH) return this.color;

        return (this.state.r === 0 && this.state.g === 0 && this.state.b === 0) ? this.color :
            `rgb(${this.state.r}, ${this.state.g}, ${this.state.b})`;
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