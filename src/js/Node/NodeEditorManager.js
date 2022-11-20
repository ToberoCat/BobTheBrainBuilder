
class NodeEditorManager extends GameElement {
    constructor(game) {
        super(game);
        this.selectedNode = null;

/*        this.addEventListener("mousedown", this.mouseDown);
        this.addEventListener("mousemove", this.mouseMove);*/
    }

    mouseDown(event) {
        if (event.which !== 1) return false;

        this.selectedNode = this.game.nodePlacementManager.getNodeAt(
            this.translateScreen(event.clientX, "X"),
            this.translateScreen(event.clientY, "Y"),
            false
        );
        return false;
    }

    mouseMove(event) {
        if (!this.selectedNode) return false;

        const nodeX = (event.clientX - this.game.camera.offsetX) / this.game.camera.zoom;
        const nodeY = (event.clientY - this.game.camera.offsetY) / this.game.camera.zoom;

        this.selectedNode.x = nodeX;
        this.selectedNode.y = nodeY;

        this.selectedNode.adjustPosition(this.game.camera);
    }

    translateScreen(screenPosition, axis) {
        return (screenPosition - this.game.camera[`offset${axis}`]) / this.game.camera.zoom;
    }

    draw(ctx) {
        if (!this.selectedNode) return;

        const camera = this.game.camera;

        ctx.beginPath();
        ctx.arc(this.selectedNode.renderX + camera.offsetX,
            this.selectedNode.renderY + camera.offsetY,
            camera.zoom * NODE_RADIUS,
            0,
            Math.PI * 2,
            false);
        ctx.strokeStyle = '#52CF67';
        ctx.lineWidth = 4 * camera.zoom;
        ctx.stroke();
        ctx.closePath();
    }
}

function calcPointsCirc(cx, cy, rad, dashLength) {
    let n = rad / dashLength,
        alpha = Math.PI * 2 / n,
        points = [],
        i = -1;

    while (i < n) {
        const theta = alpha * i, theta2 = alpha * (i + 1);

        points.push({
            x: (Math.cos(theta) * rad) + cx,
            y: (Math.sin(theta) * rad) + cy,
            ex: (Math.cos(theta2) * rad) + cx,
            ey: (Math.sin(theta2) * rad) + cy
        });
        i += 2;
    }

    return points;
}