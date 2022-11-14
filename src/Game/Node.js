const NODE_RADIUS = CELL_SIZE / 2 - 4;
const CLAMP_SIZE = CELL_SIZE / 4;

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.renderX = 0;
        this.renderY = 0;
        this.inputConnections = [];
        this.outputConnections = [];
    }

    draw(camera, ctx) {
        ctx.beginPath();

        ctx.arc(this.renderX + camera.offsetX,
            this.renderY + camera.offsetY,
            camera.zoom * NODE_RADIUS,
            0,
            Math.PI * 2,
            false);
        ctx.fillStyle = '#515151';
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = camera.zoom;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.font = '20px serif';
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";

        const x = Math.floor(this.x / CELL_SIZE) * CELL_SIZE;
        const y = Math.floor(this.y / CELL_SIZE) * CELL_SIZE;
        ctx.fillText(`${x}, ${y}`, this.renderX + camera.offsetX, this.renderY + camera.offsetY);
    }

    adjustPosition(camera) {
        const zoom = camera.zoom;
        this.renderX = worldToRender(this.x, zoom, 0);
        this.renderY = worldToRender(this.y, zoom, 0);
    }
}

class NodePlacementManager extends GameElement {
    constructor(game) {
        super(game);
        this.nodeX = 0;
        this.nodeY = 0;

        this.placing = false;
        this.nodes = [];
        this.occupations = [];

        this.addEventListener("mousedown", this.mouseDown);
        this.addEventListener("mouseup", this.mouseUp);
        this.addEventListener("mousemove", this.mouseMove);
        this.addEventListener("zooming", this.zoom);
    }

    isOccupied(xC, yC) {
        const x = Math.floor(xC / CLAMP_SIZE) * CLAMP_SIZE;
        const y = Math.floor(yC / CLAMP_SIZE) * CLAMP_SIZE;

        for (let i = 0; i < this.occupations.length; i++) {
            const node = this.occupations[i];
            if (this.circleIntersect(x, y, NODE_RADIUS, node.x, node.y, NODE_RADIUS))
                return true;
        }
        return false;
    }

    getNodeAt(xC, yC) {
        const x = Math.floor(xC / CLAMP_SIZE) * CLAMP_SIZE;
        const y = Math.floor(yC / CLAMP_SIZE) * CLAMP_SIZE;

        for (let i = 0; i < this.occupations.length; i++) {
            const node = this.occupations[i];
            if (this.circleIntersect(x, y, NODE_RADIUS, node.x, node.y, NODE_RADIUS))
                return node.node;
        }
        return null;
    }

    circleIntersect(x0, y0, r0, x1, y1, r1) {
        return (Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2)) <= Math.pow(r0 + r1, 2);
    }

    makeOccupied(xC, yC, node) {
        const x = Math.floor(xC / CLAMP_SIZE) * CLAMP_SIZE;
        const y = Math.floor(yC / CLAMP_SIZE) * CLAMP_SIZE;

        this.occupations.push({
            x: x,
            y: y,
            node: node
        });
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
        if (this.isOccupied(this.nodeX, this.nodeY)) return true;

        const node = new Node(this.nodeX, this.nodeY);
        node.adjustPosition(this.game.camera);
        this.nodes.push(node);

        this.makeOccupied(this.nodeX, this.nodeY, node);
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

    getFillColor(x, y) {
        return this.isOccupied(x, y) ? "#842323" : "#224914";
    }

    draw(ctx) {
        this.nodes.forEach(node => node.draw(this.game.camera, ctx));

        if (!this.placing)
            return;

        const zoom = this.game.camera.zoom;

        const x = worldToRender(this.nodeX, zoom, this.game.camera.offsetX);
        const y = worldToRender(this.nodeY, zoom, this.game.camera.offsetY);

        ctx.beginPath();
        ctx.arc(
            x,
            y,
            zoom * NODE_RADIUS,
            0,
            Math.PI * 2,
            false
        );
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = zoom;
        ctx.fillStyle = this.getFillColor(this.nodeX, this.nodeY);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

class NodeConnectionManager extends GameElement {
    constructor(game) {
        super(game);
        this.connecting = false;
        this.startNode = null;
        this.destination = null;
        this.connections = [];

        this.addEventListener("mouseup", this.mouseUp);
        this.addEventListener("mousemove", this.mouseMove);
    }

    mouseMove(event) {
        if (!this.connecting) return false;
        if (!this.startNode) return true;

        this.destination = {
            x: this.translateScreen(event.clientX),
            y: this.translateScreen(event.clientY)
        };
        return true;
    }

    mouseUp(event) {
        if (!this.connecting) return false;
        if (this.startNode) {
            this.destination = this.game.nodeManager.getNodeAt(
                this.translateScreen(event.clientX),
                this.translateScreen(event.clientY)
            );
            if (this.destination == null)
                return true;

            const weight = 1;
            this.startNode.outputConnections.push({
                weight: weight,
                node: this.destination
            });
            this.destination.inputConnections.push({
                weight: weight,
                node: this.startNode
            });

            this.connections.push({
                start: this.startNode,
                destination: this.destination,
                weight: weight
            });
            this.startNode = null;
            this.destination = null;
        } else
            this.startNode = this.game.nodeManager.getNodeAt(
                this.translateScreen(event.clientX),
                this.translateScreen(event.clientY)
            );
        return true;
    }

    translateScreen(screenPosition) {
        return (screenPosition - this.game.camera.offsetY) / this.game.camera.zoom;
    }

    drawConnection(ctx, start, destination) {
        const camera = this.game.camera;
        ctx.moveTo(
            worldToRender(start.x, camera.zoom, camera.offsetX),
            worldToRender(start.y, camera.zoom, camera.offsetY)
        );
        ctx.lineTo(
            worldToRender(destination.x, camera.zoom, camera.offsetX),
            worldToRender(destination.y, camera.zoom, camera.offsetY)
        );
        ctx.stroke();
    }

    draw(ctx) {
        ctx.lineWidth = this.game.camera.zoom;
        ctx.strokeStyle = "#000000";

        this.connections.forEach(connection => this.drawConnection(ctx, connection.start, connection.destination))

        if (!this.startNode || !this.destination) return;
        this.drawConnection(ctx, this.startNode, this.destination);
    }


}

function worldToRender(raw, zoom, offset) {
    return Math.floor(raw / CLAMP_SIZE) * CLAMP_SIZE * zoom + offset;
}