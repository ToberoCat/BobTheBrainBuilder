const SPEED = 30;

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

        this.destination = this.game.nodePlacementManager.getNodeAt(
            this.translateScreen(event.clientX),
            this.translateScreen(event.clientY),
            false
        );

        if (this.destination && this.destination.nodeMode !== NODE_CONNECTION_MODE_INPUT)
            return false;

        this.destination = {
            x: this.translateScreen(event.clientX),
            y: this.translateScreen(event.clientY)
        };
        return false;
    }

    mouseUp(event) {
        if (!this.connecting) return false;
        if (this.startNode) {
            this.selectDestination(event.clientX, event.clientY);
            if (this.destination == null)
                return false;

            const weight = 1;
            const connection = new Connection(this.game, this.startNode, this.destination, weight);
            this.startNode.outputConnections.push(connection);
            this.destination.inputConnections.push(connection);
            this.connections.push(connection);

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
        if (this.startNode == null || this.startNode.nodeMode !== NODE_CONNECTION_MODE_OUTPUT)
            return;
        this.startNode = null; // ToDo: Send Message Popup to tell the user that he can't select a only output node
    }

    selectDestination(x, y) {
        this.destination = this.game.nodePlacementManager.getNodeAt(
            this.translateScreen(x),
            this.translateScreen(y),
            false
        );

        if (this.destination == null || this.destination.nodeMode !== NODE_CONNECTION_MODE_INPUT)
            return;

        this.destination = {
            x: this.translateScreen(x),
            y: this.translateScreen(y)
        };
    }

    translateScreen(screenPosition) {
        return (screenPosition - this.game.camera.offsetY) / this.game.camera.zoom;
    }

    update(deltaTime) {
        this.connections.forEach(conn => conn.runSimulation(deltaTime));
    }

    draw(ctx) {
        ctx.lineWidth = 2 * this.game.camera.zoom;
        ctx.strokeStyle = "#222522";

        const camera = this.game.camera;
        this.connections.forEach(connection => connection.draw(ctx, camera))

        if (!this.startNode || !this.destination) return;
        drawConnection(ctx, camera, this.startNode, this.destination);
    }

    lateDraw(ctx) {
        this.connections.forEach(connection => connection.lateDraw(ctx, this.game.camera))
    }
}

class Connection {
    constructor(game, start, destination, weight) {
        this.start = start;
        this.game = game;
        this.destination = destination;
        this.weight = weight;
        this.dataStream = [];

        this.cStart = start.getClampedPosition();
        this.cDestination = destination.getClampedPosition();

        this.direction = direction(this.cStart.x, this.cStart.y, this.cDestination.x, this.cDestination.y);
    }

    addStreamable(data) {
        data.x = this.start.x;
        data.y = this.start.y;

        this.dataStream.push(data);
    }

    removeStreamable(data) {
        const index = this.dataStream.indexOf(data);
        if (index <= -1)
            return;

        this.dataStream.splice(index, 1);
    }

    reset() {
        this.dataStream.length = 0;
    }

    runSimulation(deltaTime) {
        const remove = [];
        this.dataStream.forEach(data => {
            data.x -= this.direction.x * SPEED * deltaTime;
            data.y -= this.direction.y * SPEED * deltaTime;
            if (this.game.nodePlacementManager.circleIntersect(
                data.x,
                data.y,
                0,
                this.destination.x,
                this.destination.y,
                NODE_RADIUS
            )) {
                remove.push(data);
                this.destination.processStreamable(data);
            }
        });

        remove.forEach(x => this.removeStreamable(x));
    }

    draw(ctx, camera) {
        drawConnection(ctx, camera, this.start, this.destination);
    }

    lateDraw(ctx, camera) {
        this.dataStream.forEach(x => x.draw(ctx, camera.zoom, camera));
    }
}

function drawConnection(ctx, camera, start, destination) {
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