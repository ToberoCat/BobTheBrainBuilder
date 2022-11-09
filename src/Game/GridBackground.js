const p = 10; // Padding

class BackgroundGrid {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.zoom = 3;
    }

    update(deltaTime) {
    }

    draw(camera, ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#102229";

        const zoom = 50 * this.zoom;
        for (let i = 0; i < this.width; i += zoom)
            ctx.strokeRect(i + camera.offsetX % zoom, 0, 0, this.height);

        for (let i = 0; i < this.height; i += zoom)
            ctx.strokeRect(0, i + camera.offsetY % zoom, this.width, 0);
    }

}