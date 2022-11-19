class SimulationButton {
    constructor(simulation, game) {
        this.game = game;
        this.simulation = simulation;
        this.playbutton = document.getElementById('playbutton');

        this.playbutton.addEventListener("click", () => this.changeState());
    }

    changeState() {
        const state = this.simulation.simulating;
        this.simulation.simulating = !state;

        if (!state) {
            this.playbutton.src = "res/buttons/speed/simulation-stop-deselected.svg";
            for (let node of this.game.nodePlacementManager.nodes) {
                if (node.nodeMode === NODE_CONNECTION_MODE_INPUT) {
                    if (node.outputConnections.length === 0) {
                        this.game.emitEvent("levelfailed", {
                            reason: INPUT_ISNT_CONNECTED_TO_ANYTHING,
                            level: this.game.level.loadedLevel
                        });
                        return;
                    }
                } else if (node.nodeMode === NODE_CONNECTION_MODE_OUTPUT) {
                    if (node.inputConnections.length === 0) {
                        this.game.emitEvent("levelfailed", {
                            reason: OUTPUT_ISNT_CONNECTED_TO_ANYTHING,
                            level: this.game.level.loadedLevel
                        });
                        return;
                    }
                }
            }
        }
        else {
            this.simulation.stopSimulation();
        }
    }

    keyDown(event) {
        if (event.keyCode !== 32) return false;
        this.changeState();
        return true;
    }
}