const NODE_RADIUS = CELL_SIZE / 2 - 6;
const CLAMP_SIZE = CELL_SIZE / 4;

const INPUT_COLOR = "#15B172";
const OUTPUT_COLOR = "#FFBB1F";
const BOTH_COLOR = "#515151";

const NODE_CONNECTION_MODE_BOTH = 0;
const NODE_CONNECTION_MODE_INPUT = 1;
const NODE_CONNECTION_MODE_OUTPUT = 2;

const NODE_PROCESSING_TIME = 30000;

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
        this.taskId = null;

        this.setMode(NODE_CONNECTION_MODE_BOTH);
    }

    getClampedPosition() {
        return {
            x: Math.floor(this.x / CLAMP_SIZE) * CLAMP_SIZE,
            y: Math.floor(this.y / CLAMP_SIZE) * CLAMP_SIZE
        }
    }

    addStreamable(data) {
        const clamped = this.getClampedPosition();
        data.x = clamped.x;
        data.y = clamped.y;

        this.state.r = Math.min(this.state.r + data.finalR, 1);
        this.state.g = Math.min(this.state.g + data.finalG, 1);
        this.state.b = Math.min(this.state.b + data.finalB, 1);

        this.dataStream.push(data);

        if (this.nodeMode === NODE_CONNECTION_MODE_OUTPUT && this.dataStream.length >= this.inputConnections.length)
            this.game.level.receiveOutput(this.state);
    }

    isWaitingForInputs() {
        return this.dataStream.length < this.inputConnections.length;
    }

    checkIfDeadLocked() {
        for (let connection of this.game.nodeConnectionManager.connections) {
            if (connection.dataStream.length !== 0) return false;
        }

        for (let node of this.game.nodePlacementManager.nodes) {
            if (node.nodeMode === NODE_CONNECTION_MODE_INPUT) {
                if (node.dataStream.length !== 0) return false;
            } else if (node.nodeMode === NODE_CONNECTION_MODE_BOTH) {
                if (node.inputConnections.length === 0 ||
                    node.outputConnections.length === 0)
                    continue;
                if (node.taskId != null || !node.isWaitingForInputs())
                    return false;
            }
        }

        return true;
    }

    setMode(mode) {
        this.nodeMode = mode;
        this.color = getColorByMode(mode);
    }

    update() {
        if (!this.game.simulation.simulating) return;
        if (this.nodeMode === NODE_CONNECTION_MODE_OUTPUT) return;
        if (this.isWaitingForInputs()) return;
        if (this.inputConnections.length === 0) {
            if (this.nodeMode === NODE_CONNECTION_MODE_INPUT)
                this.inputConnections.push({});
            return;
        }
        if (this.outputConnections.length === 0)
            return;

        this.dataStream.length = 0;
        this.taskId = setTimeout(() => {
            this.outputConnections.forEach(x => x.addStreamable(new ProcessableData(
                this.state.r,
                this.state.g,
                this.state.b,
                0,
                0)
            ));
            this.taskId = null;
        }, this.nodeMode === NODE_CONNECTION_MODE_INPUT ? 0 : NODE_PROCESSING_TIME / SPEED);
    }

    reset() {
        this.state = new ProcessableData(0, 0, 0, this.x, this.y);
        this.dataStream.length = 0;
        clearTimeout(this.taskId);
        this.taskId = null;
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
            `rgb(${this.state.r * 255}, ${this.state.g * 255}, ${this.state.b * 255})`;
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