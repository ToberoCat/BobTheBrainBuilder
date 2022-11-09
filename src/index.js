window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas.width, canvas.height);

    let lastTime;

    function animate() {
        const now = Date.now();
        if (!lastTime) lastTime = now;
        let deltaTime = (now - lastTime) / 1000;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        lastTime = now;
        requestAnimationFrame(animate);
    }

    animate();
});

class Camera {
    constructor() {
        this.offsetX = 0;
        this.offsetY = 0;
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.clientX = 0;
        this.clientY = 0;
        this.grabbing = false;

        this.camera = new Camera();
        this.grid = new BackgroundGrid(width, height);
        this.nodes = [];

        this.nodes.push(new Node());

        document.addEventListener("mousedown", () => {
            document.body.style.cursor = 'grab';
            this.grabbing = true;
        });

        document.addEventListener("mouseup", () => {
            document.body.style.cursor = 'default';
            this.grabbing = false;
        });

        document.addEventListener("wheel", event => {
            this.grid.zoom = Math.min(Math.max(this.grid.zoom + Math.sign(event.deltaY) * .1, 1), 5);
        });

        document.addEventListener("mousemove", e => {
            this.clientX = e.clientX;
            this.clientY = e.clientY;
            if (!this.grabbing) return;

            this.camera.offsetX += e.movementX;
            this.camera.offsetY += e.movementY;
        });
    }

    update(deltaTime) {
        this.grid.update(deltaTime);

        this.nodes.forEach(node => node.update(deltaTime, this.clientX, this.clientY));
    }

    draw(ctx) {
        this.grid.draw(this.camera, ctx);
        this.nodes.forEach(node => node.draw(this.camera, ctx));
    }
}