class MouseManager {
    /**
     * Control mouse lock and input
     * @param {HTMLElement} container
     */
    constructor(container, canvas) {
        this.canvas = canvas;
        this.container = container;
        this.isCapture = false;
        this.ratio = 1;
        if (this.canvas && this.container)
            this.ratio = this.canvas.width / this.container.clientWidth;
        this.dx = 0;
        this.dy = 0;

        /**
         * @readonly
         * @type {boolean}
         */
        this.left = false;

        /**
         * @readonly
         * @type {boolean}
         */
        this.right = false;

        this.clickable = false;

        this.container.addEventListener('mousemove', (e) => this.move(e));
        this.container.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.container.addEventListener('mouseup', (e) => this.mouseUp(e));

        if (this.canvas) {
            this.container.addEventListener('click', () => this.capture());
            document.addEventListener('pointerlockchange', () => this.uncapture());
            document.addEventListener('visibilitychange', () => this.blur());
        }
    }

    async capture() {
        if (!this.isCapture) {
            await this.container.requestPointerLock({
                unadjustedMovement: false,
            });

            this.isCapture = true;
            setTimeout(() => {
                this.clickable = true;
            }, 200);
        }
    }

    blur() {
        if (document.visibilityState === 'hidden') {
            document.exitPointerLock();
            this.uncapture();
        }
    }

    uncapture() {
        console.debug("uncapture: ", document.pointerLockElement, this.container);
        console.debug("uncapture: ", document.pointerLockElement !== this.container);
        if (document.pointerLockElement !== this.container) {
            this.isCapture = false;
            window.$game.pause();
        }
        this.clickable = false;
    }

    /**
     *
     * @param {MouseEvent} e
     */
    mouseDown(e) {
        e.preventDefault();
        if (!this.clickable) return;
        if (e.button === 0) {
            this.left = true;
        }
        if (e.button === 2) {
            this.right = true;
        }
    }

    mouseUp(e) {
        e.preventDefault();
        if (e.button === 0) {
            this.left = false;
        }
        if (e.button === 2) {
            this.right = false;
        }
    }

    /**
     *
     * @param {MouseEvent} e
     */
    move(e) {
        e.preventDefault();
        if (this.isCapture) {
            this.dx += e.movementX * this.ratio;
            this.dy += e.movementY * this.ratio;
            // console.log(this.x, this.y, this.ratio);
        }
    }

    update() {
        const delta = new Vector(this.dx, this.dy);
        this.dx = 0;
        this.dy = 0;
        return delta;
    }
}
