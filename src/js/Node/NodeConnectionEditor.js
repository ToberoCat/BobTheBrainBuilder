class NodeConnectionEditor extends GameElement {
    constructor(game) {
        super(game);
        this.addEventListener("mouseup", this.mouseUp);
        this.selected = null;
        this.connectionEditor = document.getElementById("connection-settings");
        this.rSlider = document.getElementById("red-slider");
        this.gSlider = document.getElementById("green-slider");
        this.bSlider = document.getElementById("blue-slider");

        this.rLabel = document.getElementById("red-label");
        this.gLabel = document.getElementById("green-label");
        this.bLabel = document.getElementById("blue-label");

        this.addListener("r");
        this.addListener("g");
        this.addListener("b");
    }

    addListener(color) {
        const slider = this[color + "Slider"];
        const label = this[color + "Label"];

        slider.addEventListener("input", () => {
            label.innerHTML = slider.value;

            if (this.selected)
                this.selected.weight[color] = slider.value;
        })
    }

    translateScreen(screenPosition, axis) {
        return (screenPosition - this.game.camera[`offset${axis}`]) / this.game.camera.zoom;
    }

    showSettings() {
        const start = this.selected.start;
        const end = this.selected.destination;

        const weight = this.selected.weight;
        this.rSlider.value = weight.r;
        this.rLabel.innerHTML = weight.r;

        this.gSlider.value = weight.g;
        this.gLabel.innerHTML = weight.g;

        this.bSlider.value = weight.b;
        this.bLabel.innerHTML = weight.b;

        this.connectionEditor.style.left = (start.renderX + end.renderX) / 2 + "px";
        this.connectionEditor.style.top = (start.renderY + end.renderY) / 2 + "px";

        this.connectionEditor.style.visibility = "visible";
    }

    hideSettings() {
        this.connectionEditor.style.visibility = "hidden";
    }

    mouseUp(event) {
        this.selected = this.game.nodeConnectionManager.getConnectionAt(
            this.translateScreen(event.clientX, "X"),
            this.translateScreen(event.clientY, "Y")
        );

        if (!this.selected) {
            this.hideSettings();
            return false;
        } else {
            this.showSettings();
            return true;
        }
    }
}