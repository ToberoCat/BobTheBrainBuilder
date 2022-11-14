const CELL_SIZE = 50;
const MAX_SCROLL = 5;
const MIN_SCROLL = 1;
const ZOOM_SPEED = .1;

class BackgroundGrid extends GameElement {
    constructor(game) {
        super(game);
        this.width = game.width;
        this.height = game.height;
        this.grabbingStart = null;
        this.innerGridDepth = (this.game.camera.zoom - MIN_SCROLL) / MAX_SCROLL;

        this.addEventListener("mousedown", this.mouseDown);
        this.addEventListener("node-placement", this.mouseDown)

        this.addEventListener("mouseup", this.mouseUp);
        this.addEventListener("mousemove", this.mouseMove);
        this.addEventListener("wheel", this.scroll);
    }

    //<editor-fold desc="Rendering">
    draw(ctx) {
        ctx.lineWidth = 2;

        const zoom = CELL_SIZE * this.game.camera.zoom;

        this.drawGrid(ctx, zoom / 4, `hsla(192,6%,31%, ${this.innerGridDepth})`);
        this.drawGrid(ctx, zoom, "hsla(195,4%,37%, 1)");
    }

    drawGrid(ctx, level, color) {
        const offsetX = this.game.camera.offsetX % level;
        const offsetY = this.game.camera.offsetY % level;

        ctx.strokeStyle = color;
        for (let i = 0; i < this.width; i += level)
            ctx.strokeRect(i + offsetX, 0, 0, this.height);

        for (let i = 0; i < this.height; i += level)
            ctx.strokeRect(0, i + offsetY, this.width, 0);
    }

    //</editor-fold>

    //<editor-fold desc="Events">
    mouseDown(event) {
        if (event.which !== 3) return false;
        event.preventDefault();

        document.body.style.cursor = 'grab';
        this.grabbingStart = {x: event.clientX - this.game.camera.offsetX, y: event.clientY - this.game.camera.offsetY};
        return true;
    }

    mouseUp() {
        document.body.style.cursor = 'default';
        this.grabbingStart = null;
        return true;
    }

    mouseMove(event) {
        if (!this.grabbingStart) return false;

        this.game.camera.offsetX = event.clientX - this.grabbingStart.x;
        this.game.camera.offsetY = event.clientY - this.grabbingStart.y;
        return true;
    }

    scroll(event) {
        this.game.camera.zoom = Math.min(Math.max(this.game.camera.zoom - Math.sign(event.deltaY) * ZOOM_SPEED,
            MIN_SCROLL), MAX_SCROLL);
        this.innerGridDepth = (this.game.camera.zoom - MIN_SCROLL) / MAX_SCROLL;
        this.game.emitEvent("zooming", {
            clientX: event.clientX,
            clientY: event.clientY
        });
        return true;
    }

    //</editor-fold>
}