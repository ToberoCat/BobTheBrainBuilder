const NODE_RADIUS = 150;

class Node {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.placed = false;
        this.icon = new Image();
        this.icon.src = "../../res/node.svg";
    }

    moveToMouse(x, y) {
        this.x = Math.round(x / NODE_RADIUS) * NODE_RADIUS;
        this.y = Math.round(y / NODE_RADIUS) * NODE_RADIUS;
    }

    update(deltaTime, mouseX, mouseY) {
        if (this.placed) return;
        this.moveToMouse(mouseX, mouseY);
    }

    draw(camera, ctx) {
        ctx.drawImage(this.icon, this.x, this.y, NODE_RADIUS, NODE_RADIUS);
    }
}