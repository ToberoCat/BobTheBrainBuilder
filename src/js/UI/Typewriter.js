const TYPE_SPEED = 80;

class Typewriter {
    constructor(destination) {
        this.destination = destination;
        this.content = null;
        this.waitingId = 0;
        this.writingId = 0;
        this.isWriting = false;
    }

    writeLine(text) {
        this.content = text;
        let index = 0;
        clearInterval(this.writingId);
        clearTimeout(this.waitingId);
        this.isWriting = true;
        this.destination.style.visibility = 'visible';
        return new Promise((resolve) => {
            this.writingId = setInterval(() => {
                const content = this.content.substring(0, index++);
                this.destination.innerHTML = content + '<span id="caret" aria-hidden="true"></span>';

                if (content !== this.content) return;
                this.destination.innerHTML = this.content;
                clearInterval(this.writingId);
                this.isWriting = false;
                resolve();
            }, TYPE_SPEED);
        });
    }

    finishLine() {
        this.destination.innerHTML = this.content;
        clearInterval(this.writingId);
        clearTimeout(this.waitingId);
        this.isWriting = false;
    }

    isHidden() {
        return this.destination.style.visibility === 'hidden';
    }

    hideLine() {
        this.finishLine();
        this.destination.innerHTML = "";
        this.destination.style.visibility = 'hidden';
    }

    wait(ms) {
        return new Promise(async (resolve) => {
            this.destination.innerHTML = this.content + '<span id="caret" aria-hidden="true"></span>';
            this.waitingId = setInterval(() => resolve(), ms);
        });
    }
}
