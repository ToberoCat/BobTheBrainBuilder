class SimulationButton {
    constructor(simulation, game) {
        this.game = game;
        this.simulation = simulation;
        this.playbutton = document.getElementById('playbutton');
        this.speedSlider = document.getElementById('speed-slider');

        this.playbutton.addEventListener("click", () => this.changeState());
        this.speedSlider.value = DEFAULT_SPEED;
        this.speedSlider.addEventListener("input", () => SPEED = this.speedSlider.value);
    }

    changeState() {
        const state = this.simulation.simulating;
        this.simulation.simulating = !state;

        if (!state) {
            this.playbutton.src = "res/buttons/speed/simulation-stop-deselected.svg";
            if (this.scanNodes()) {
                this.speedSlider.style.visibility = "visible";
                this.speedSlider.style.animation = "fadeIn .2s ease-in both";
            }
        } else {
            this.simulation.stopSimulation();
        }
    }

    scanNodes() {
        for (let node of this.game.nodePlacementManager.nodes) {
            if (node.nodeMode === NODE_CONNECTION_MODE_INPUT) {
                if (node.outputConnections.length === 0) {
                    this.game.emitEvent("levelfailed", {
                        reason: INPUT_ISNT_CONNECTED_TO_ANYTHING,
                        level: this.game.level.loadedLevel
                    });
                    return false;
                }
            } else if (node.nodeMode === NODE_CONNECTION_MODE_OUTPUT) {
                if (node.inputConnections.length === 0) {
                    this.game.emitEvent("levelfailed", {
                        reason: OUTPUT_ISNT_CONNECTED_TO_ANYTHING,
                        level: this.game.level.loadedLevel
                    });
                    return false;
                }
            }
        }
        return true;
    }

    keyDown(event) {
        if (event.keyCode !== 32) return false;
        this.changeState();
        return true;
    }
}