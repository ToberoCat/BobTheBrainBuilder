class Level {
    constructor(game) {
        this.loadedLevel = null;
        this.game = game;
    }

    async loadLevel(levelId) {
        this.loadedLevel = await fetch(`../../res/levels/${levelId}.lvl`)
            .then(response => response.json());


        this.loadedLevel.inputs.forEach(input => {
            input["node"] = this.game.nodePlacementManager.createNodeAt(input.x, input.y);
            input["node"].setMode(NODE_CONNECTION_MODE_INPUT);
        });

        this.loadedLevel.outputs.forEach(output => {
            output["node"] = this.game.nodePlacementManager.createNodeAt(output.x, output.y);
            output["node"].setMode(NODE_CONNECTION_MODE_OUTPUT);
        });
    }
}