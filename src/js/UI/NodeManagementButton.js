const NODE_MODE_PLACE = 1;
const NODE_MODE_CONNECT = 2;
const NODE_MODE_NOTHING = 0;

class NodeManagementButton extends GameElement {
    constructor(game) {
        super(game);
        this.hovering = false;
        this.mode = NODE_MODE_NOTHING;

        const placeButton = document.getElementById("placenode");
        const cancelButton = document.getElementById("cancelbutton");
        const connectButton = document.getElementById("connectnode");

        placeButton.addEventListener("click", e => {
            this.game.nodePlacementManager.placing = true;
            this.mode = NODE_MODE_PLACE;
            placeButton.style.visibility = "hidden";
            connectButton.style.visibility = "hidden";
            cancelButton.style.visibility = "visible";
        });

        connectButton.addEventListener("click", e => {
            this.game.nodeConnectionManager.connecting = true;
            this.mode = NODE_MODE_CONNECT;
            placeButton.style.visibility = "hidden";
            connectButton.style.visibility = "hidden";
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

        if (this.mode === NODE_MODE_CONNECT) {
            if (!this.game.nodeConnectionManager.startNode) {
                this.cancelPlacing();
            } else {
                this.game.nodeConnectionManager.startNode = null;
                this.game.nodeConnectionManager.destination = null;
            }
        } else
            this.cancelPlacing();

        return false;
    }

    mouseDown() {
        if (!this.hovering) return false;
        this.cancelPlacing();
        return true;
    }

    cancelPlacing() {
        if (this.mode === NODE_MODE_PLACE)
            this.game.nodePlacementManager.placing = false;
        else if (this.mode === NODE_MODE_CONNECT) {
            const mg = this.game.nodeConnectionManager;
            mg.connecting = false;
            mg.startNode = null;
            mg.destination = null;
        }

        this.mode = NODE_MODE_NOTHING;
        document.getElementById("placenode").style.visibility = "visible";
        document.getElementById("connectnode").style.visibility = "visible";
        document.getElementById("cancelbutton").style.visibility = "hidden";
    }

    update(deltaTime) {
    }

    draw(ctx) {
    }
}