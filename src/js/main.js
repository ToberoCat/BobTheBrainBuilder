window.addEventListener("load", async () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas.width, canvas.height);
    await game.init();

    let lastTime;

    function animate() {
        const now = Date.now();
        if (!lastTime) lastTime = now;
        let deltaTime = (now - lastTime) / 1000;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        game.lateUpdate(ctx);
        lastTime = now;
        requestAnimationFrame(animate);
    }

    animate();
});

class Camera {
    constructor() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 3;
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.listeners = [];
        this.elements = [];

        this.camera = new Camera();
        this.grid = new BackgroundGrid(this);

        this.nodeEditor = new NodeEditorManager(this);
        this.nodeConnectionEditor = new NodeConnectionEditor(this);
        this.nodeConnectionManager = new NodeConnectionManager(this);
        this.nodePlacementManager = new NodePlacementManager(this);
        this.nodeManagerButtons = new NodeManagementButton(this);

        this.level = new Level(this);
        this.simulation = new Simulator(this);

        document.addEventListener("mousedown", e => this.emitEvent("mousedown", e));
        document.addEventListener("mouseup", e => this.emitEvent("mouseup", e));
        document.addEventListener("wheel", event => this.emitEvent("wheel", event));
        document.addEventListener("mousemove", e => this.emitEvent("mousemove", e));
        document.addEventListener("keydown", e => this.emitEvent("keydown", e));
    }

    async init() {
        await this.level.loadLevel("level-1");
    }

    emitEvent(event, data) {
        for (const listener of this.listeners)
            if (listener.emitEvent(event, data)) {
                event.preventDefault();
                return;
            }
    }

    registerElement(element) {
        this.listeners.unshift(element);
        this.elements.push(element);
    }

    update(deltaTime) {
        this.elements.forEach(listener => listener.update(deltaTime));
    }

    draw(ctx) {
        this.elements.forEach(listener => listener.draw(ctx));
    }

    lateUpdate(ctx) {
        this.elements.forEach(listener => listener.lateDraw(ctx));
    }
}

class GameElement {
    constructor(game) {
        this.game = game;
        this.events = new Map();
        this.game.registerElement(this);
    }

    /**
     * Call an event
     * @param {string} event
     * @param {json} data
     * @return Returns if the event has been consumed
     */
    emitEvent(event, data) {
        const handler = this.events[event];
        if (handler)
            return handler(data);
        return false;
    }

    addEventListener(event, handler) {
        handler = handler.bind(this);
        this.events[event] = handler;
    }

    update(deltaTime) {

    }

    draw(ctx) {

    }

    lateDraw(ctx) {

    }
}