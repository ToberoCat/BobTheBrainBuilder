const TYPE_SPEED = 100;
const WAIT_SEQUENCE = "_ ";


class Typewriter {
    constructor(destination) {
        this.destination = destination;
        this.content = null;
    }

    writeLine(text) {
        this.content = text;
        let index = 0;
        return new Promise((resolve) =>
            this.writingId = setInterval(() => {
                const content = this.content.substring(0, index++);
                this.destination.innerHTML = content + '<span id="caret" aria-hidden="true"></span>';

                if (content !== this.content) return;
                this.destination.innerHTML = this.content;
                clearInterval(this.writingId);
                resolve();
            }, TYPE_SPEED));
    }

    wait(ms) {
        return new Promise(async (resolve) => {
            this.destination.innerHTML = this.content + '<span id="caret" aria-hidden="true"></span>';
            await wait(ms);
            resolve();
        });
    }
}
