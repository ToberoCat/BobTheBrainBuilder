class NodeManagementButton extends GameElement {
    constructor(game) {
        super(game);
        document.getElementById("placenode").addEventListener("click", e => {
            this.game.nodeManager.placing = !this.game.nodeManager.placing;
        });
    }

    update(deltaTime) {
    }

    draw(ctx) {
    }
}