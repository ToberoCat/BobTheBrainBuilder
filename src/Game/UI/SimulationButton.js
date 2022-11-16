class SimulationButton {
    constructor(simulation, game) {
        this.game = game;
        document.getElementById('playbutton').addEventListener("click", e => {
           const state = simulation.simulating;
           simulation.simulating = !state;

           if (state) this.reset();
        });
    }

    reset() {
        this.game.nodeConnectionManager.connections.forEach(conn => conn.reset());
        this.game.level.reset();
        this.game.nodePlacementManager.nodes.forEach(node => node.reset());
    }
}