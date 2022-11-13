class NodeManagementButton extends GameElement {
    constructor(game) {
        super(game);
        this.hovering = false;

        const placeButton = document.getElementById("placenode");
        const cancelButton = document.getElementById("cancelbutton");

        placeButton.addEventListener("click", e => {
            this.game.nodeManager.placing = !this.game.nodeManager.placing;
            placeButton.style.visibility = "hidden";
            cancelButton.style.visibility = "visible";
        });

        cancelButton.addEventListener("mouseover", () => {
            this.hovering = true;
        });

        cancelButton.addEventListener("mouseleave", () => {
            this.hovering = false;
        });

        this.addEventListener("mousedown", this.mouseDown);
        this.addEventListener("keydown", this.keyDown);
    }

    keyDown(event) {
        if (event.keyCode !== 27) return false;
        this.cancelPlacing();
        return false;
    }

    mouseDown() {
        if (!this.hovering) return false;
        this.cancelPlacing();
        return true;
    }

    cancelPlacing() {
        this.game.nodeManager.placing = false;
        document.getElementById("placenode").style.visibility = "visible";
        document.getElementById("cancelbutton").style.visibility = "hidden";
    }

    update(deltaTime) {
    }

    draw(ctx) {
    }
}