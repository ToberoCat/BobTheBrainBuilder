class Level {
    constructor(game) {
        this.loadedLevel = null;
        this.game = game;
    }

    async loadLevel(levelId) {
        this.loadedLevel = await fetch(`../../res/levels/${levelId}.lvl`)
            .then(response => response.json());


        this.loadedLevel.inputs.forEach(input => {
            const node = this.game.nodePlacementManager.createNodeAt(input.x, input.y);
            input["node"] = node;
            node.setMode(NODE_CONNECTION_MODE_INPUT);
            input.dataStream.forEach(streamable => node
                .addStreamable(new ProcessableData(streamable.r / 255, streamable.g / 255, streamable.b / 255, 0, 0)));
        });

        this.loadedLevel.outputs.forEach(output => {
            output["node"] = this.game.nodePlacementManager.createNodeAt(output.x, output.y);
            output["node"].setMode(NODE_CONNECTION_MODE_OUTPUT);
        });
    }

    reset() {
        this.loadedLevel.inputs.forEach(input => {
            input.dataStream.forEach(streamable => input["node"]
                .addStreamable(new ProcessableData(streamable.r, streamable.g, streamable.b, 0, 0)));
        });
    }
}