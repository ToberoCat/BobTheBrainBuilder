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
                this.simulation.stopSimulation();
            }
        });
    }
}