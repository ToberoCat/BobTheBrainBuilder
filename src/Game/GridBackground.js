const CELL_SIZE = 50;

class BackgroundGrid extends GameElement {
    constructor(game) {
        super(game);
        this.width = game.width;
        this.height = game.height;
        this.grabbingStart = null;

        this.addEventListener("mousedown", this.mouseDown);
        this.addEventListener("node-placement", this.mouseDown)

        this.addEventListener("mouseup", this.mouseUp);
        this.addEventListener("mousemove", this.mouseMove);
        this.addEventListener("wheel", this.scroll);
    }

    //<editor-fold desc="Rendering">
    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#4A5254";

        const zoom = CELL_SIZE * this.game.camera.zoom;
        for (let i = 0; i < this.width; i += zoom)
            ctx.strokeRect(i + this.game.camera.offsetX % zoom, 0, 0, this.height);

        for (let i = 0; i < this.height; i += zoom)
            ctx.strokeRect(0, i + this.game.camera.offsetY % zoom, this.width, 0);
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
        this.game.camera.zoom = Math.min(Math.max(this.game.camera.zoom - Math.sign(event.deltaY) * .1, 1), 5);
        this.game.emitEvent("zooming", {
            clientX: event.clientX,
            clientY: event.clientY
        });
        return true;
    }

    //</editor-fold>
}