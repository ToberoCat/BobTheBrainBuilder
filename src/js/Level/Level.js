const COLOR_COMPARISON_EPS = 0.0001;

// Failures
const COLORS_DONT_MATCH = 0;
const INPUT_ISNT_CONNECTED_TO_ANYTHING = 1;
const NODES_ARE_DEADLOCKED = 2;

class Level extends GameElement {
    constructor(game) {
        super(game);
        this.loadedLevel = null;
        this.currentOutputs = [];
        this.typewriter = new Typewriter(document.getElementById("level-meta-data"));

        this.addEventListener("levelcompleted", this.completedLevel);
        this.addEventListener("levelfailed", this.failedLevel);
    }

    failedLevel(failureInfo) {
        this.typewriter.writeLine(`Something went wrong. ${failureInfo.reason}`);
    }

    completedLevel(level) {
        this.typewriter.writeLine(`You completed ${level.title}`);
    }

    async loadLevel(levelId) {
        this.loadedLevel = await fetch(`../../res/levels/${levelId}.lvl`)
            .then(response => response.json());


        this.displayMeta(this.loadedLevel);
        document.title = `Bob the Brain - ${this.loadedLevel.title}`;

        this.loadedLevel.inputs.forEach(input => {
            const node = this.game.nodePlacementManager.createNodeAt(input.x, input.y);
            input["node"] = node;
            node.setMode(NODE_CONNECTION_MODE_INPUT);
            input.dataStream.forEach(streamable => node.addStreamable(this.createNewStreamableData(streamable)));
        });

        this.loadedLevel.outputs.forEach(output => {
            output["node"] = this.game.nodePlacementManager.createNodeAt(output.x, output.y);
            output["node"].setMode(NODE_CONNECTION_MODE_OUTPUT);
        });
    }

    displayMeta(level) {
        this.typewriter.writeLine(level.title)
            .then(async () => {
                await this.typewriter.wait(3000);
                await this.typewriter.writeLine(level.description);
            });
    }

    receiveOutput(value) {
        this.currentOutputs.push(value);
        if (this.currentOutputs.length !== this.loadedLevel.expectedOutput.length)
            return;

        for (let output in this.loadedLevel.expectedOutput) {
            output = this.loadedLevel.expectedOutput[output];
            const r = output.r / 255;
            const g = output.g / 255;
            const b = output.b / 255;

            for (let i = 0; i < this.currentOutputs.length; i++) {
                const o = this.currentOutputs[i];
                if (!this.areSameColor(r, g, b, o.r, o.g, o.b)) {
                    this.emitEvent("levelfailed", {
                        reason: COLORS_DONT_MATCH,
                        level: this.loadedLevel
                    });
                    return;
                }
            }
        }

        this.emitEvent("levelcompleted", this.loadedLevel);
    }

    areSameColor(eR, eG, eB, vR, vG, vB) {
        const dR = Math.abs(eR - vR);
        const dG = Math.abs(eG - vG);
        const dB = Math.abs(eB - vB);

        return dR < COLOR_COMPARISON_EPS && dG < COLOR_COMPARISON_EPS && dB < COLOR_COMPARISON_EPS;
    }

    createNewStreamableData(streamable) {
        return new ProcessableData(streamable.r / 255, streamable.g / 255, streamable.b / 255, 0, 0)
    }

    reset() {
        this.currentOutputs.length = 0;
        this.loadedLevel.inputs.forEach(input => {
            input.dataStream.forEach(streamable => input["node"]
                .addStreamable(this.createNewStreamableData(streamable)));
        });
    }
}