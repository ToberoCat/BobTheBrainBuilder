class NodeConnectionManager extends GameElement {
    constructor(game) {
        super(game);
        this.connecting = false;
        this.startNode = null;
        this.destination = null;
        this.connections = [];

        this.addEventListener("mouseup", this.mouseUp);
        this.addEventListener("mousemove", this.mouseMove);
        this.addEventListener("zooming", this.mouseMove);
    }

    mouseMove(event) {
        if (!this.connecting || !this.startNode) return false;

        this.destination = {
            x: this.translateScreen(event.clientX),
            y: this.translateScreen(event.clientY)
        };
        return false;
    }

    mouseUp(event) {
        if (!this.connecting) return false;
        if (this.startNode) {
            this.destination = this.game.nodePlacementManager.getNodeAt(
                this.translateScreen(event.clientX),
                this.translateScreen(event.clientY),
                false
            );
            if (this.destination == null)
                return false;

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
        } else this.selectStartNode(event.clientX, event.clientY);
        return false;
    }

    selectStartNode(x, y) {
        this.startNode = this.game.nodePlacementManager.getNodeAt(
            this.translateScreen(x),
            this.translateScreen(y),
            false
        );
        if (this.startNode.nodeMode !== NODE_CONNECTION_MODE_OUTPUT)
            return;
        this.startNode = null; // ToDo: Send Messge Popup to tell the user that he can't select a only output node
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
        ctx.lineWidth = 2 * this.game.camera.zoom;
        ctx.strokeStyle = "#222522";

        this.connections.forEach(connection => this.drawConnection(ctx, connection.start, connection.destination))

        if (!this.startNode || !this.destination) return;
        this.drawConnection(ctx, this.startNode, this.destination);
    }
}