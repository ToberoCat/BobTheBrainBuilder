const NODE_RADIUS = CELL_SIZE;

const ICON = new Image();
ICON.src = "../../res/nodes/node.svg";

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.renderX = 0;
        this.renderY = 0;
    }

    draw(camera, ctx) {
        ctx.drawImage(ICON,
            this.renderX + camera.offsetX,
            this.renderY + camera.offsetY,
            camera.zoom * NODE_RADIUS,
            camera.zoom * NODE_RADIUS
        );
    }

    adjustPosition(camera) {
        const zoom = camera.zoom;
        this.renderX = getRenderingPosition(this.x, zoom, 0);
        this.renderY = getRenderingPosition(this.y, zoom, 0);
    }
}

class NodePlacementManager extends GameElement {
    constructor(game) {
        super(game);
        this.nodeX = 0;
        this.nodeY = 0;

        this.placing = false;
        this.nodes = [];
        this.occupations = new Map();

        this.addEventListener("mousedown", this.mouseDown);
        this.addEventListener("mouseup", this.mouseUp);
        this.addEventListener("mousemove", this.mouseMove);
        this.addEventListener("zooming", this.zoom);
    }

    isOccupied(x, y) {
        const yMap = this.occupations.get(x);
        return yMap ? yMap.has(y) : false;
    }

    makeOccupied(x, y, node) {
        let yMap = this.occupations.get(x);
        if (!yMap) yMap = new Map();

        yMap[y] = node;
        this.occupations[x] = yMap;
    }

    getOccupied(x, y) {
        if (!this.isOccupied(x, y)) return null;
        return this.occupations[x][y];
    }

    zoom(event) {
        this.nodes.forEach(node => node.adjustPosition(this.game.camera));
        this.mouseMove(event);
    }

    mouseDown(event) {
        if (event.which !== 1) return false;
        return this.placing;
    }

    mouseUp(event) {
        if (event.which !== 1) return false;
        if (!this.placing) return false;

        const node = new Node(this.nodeX, this.nodeY);
        node.adjustPosition(this.game.camera);
        this.nodes.push(node);

        this.game.emitEvent("node-placement", {});
        return true;
    }

    mouseMove(event) {
        if (event.buttons === 2) return false;
        if (!this.placing) return false;

        this.nodeX = (event.clientX - this.game.camera.offsetX) / this.game.camera.zoom;
        this.nodeY = (event.clientY - this.game.camera.offsetY) / this.game.camera.zoom;

        return true;
    }

    getBrightness

    draw(ctx) {
        this.nodes.forEach(node => node.draw(this.game.camera, ctx));

        if (!this.placing)
            return;

        const zoom = this.game.camera.zoom;
        const actualRadius = zoom * NODE_RADIUS;

        const x = getRenderingPosition(this.nodeX, zoom, this.game.camera.offsetX);
        const y = getRenderingPosition(this.nodeY, zoom, this.game.camera.offsetY);

        ctx.drawImage(ICON, x, y, actualRadius, actualRadius);


    }
}

function getRenderingPosition(raw, zoom, offset) {
    return Math.floor(raw / CELL_SIZE) * CELL_SIZE * zoom + offset;
}