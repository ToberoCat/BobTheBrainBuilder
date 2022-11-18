class SimulationButton {
    constructor(simulation, game) {
        this.game = game;
        const playbutton = document.getElementById('playbutton');

        playbutton.addEventListener("click", e => {
            const state = simulation.simulating;
            simulation.simulating = !state;

            if (!state)
                playbutton.src = "res/buttons/simulation-stop.svg";
            else {
                playbutton.src = "res/buttons/simulation-start.svg";
                this.reset();
            }
        });
    }

    reset() {
        this.game.nodeConnectionManager.connections.forEach(conn => conn.reset());
        this.game.nodePlacementManager.nodes.forEach(node => {
            if (node.nodeMode === NODE_CONNECTION_MODE_INPUT)
                node.inputConnections.length = 0;

            node.reset()
        });
        this.game.level.reset();
    }
}