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

    getNodeAt(xC, yC, round = true) {
        const x = round ? Math.round(xC / CLAMP_SIZE) * CLAMP_SIZE : xC;
        const y = round ? Math.round(yC / CLAMP_SIZE) * CLAMP_SIZE : yC;

        for (let i = 0; i < this.occupations.length; i++) {
            const node = this.occupations[i];
            if (this.circleIntersect(x, y, NODE_RADIUS + 4, node.x, node.y, NODE_RADIUS + 4))
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
        this.createNodeAt(this.nodeX, this.nodeY);
        return true;
    }

    createNodeAt(x, y) {
        const node = new Node(this.game, x, y);
        node.adjustPosition(this.game.camera);
        this.nodes.push(node);

        this.makeOccupied(x, y, node);
        this.game.emitEvent("node-placement", {});
        return node;
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

    update(deltaTime) {
        this.nodes.forEach(node => node.update(deltaTime));
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