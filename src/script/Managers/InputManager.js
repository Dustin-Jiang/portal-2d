class InputManager {

    /**
     * Control mouse lock and input
     * @param {HTMLElement} container
     * @param {HTMLCanvasElement} canvas
     */
    constructor(container, canvas) {
        this.keyboard = new KeyboardManager();
        this.mouse = new MouseManager(container, canvas);
        this.gamepad = new GamepadManager();

        this.container = container;
        this.canvas = canvas;

        this.isHeld = {
            "E" : false,
            "Space" : false,
            "Enter" : false,
            "ClickLeft" : false,
            "ClickRight" : false,
        }

        this.x = 0;
        this.y = 0;
    }
    isKeyDown(key) {
        if (key == "ClickLeft")
            return this.mouse.left;
        if (key == "ClickRight")
            return this.mouse.right;
        return this.keyboard.isKeyDown(key) || this.gamepad.isKeyDown(key);
    }
    isKeysDown(keys) {
        let ans = false
        keys.forEach((key) => {
            ans = ans || this.isKeyDown(key)
        })
        return ans
    }
    firstDown(key, operate) {
        if (this.isKeyDown(key)) {
            if (!this.isHeld[key]) {
                this.isHeld[key] = true;
                operate();
            }
        }
        else this.isHeld[key] = false;
        return this.isHeld[key];
    }
    firstDowns(keys, operate) {
        let isAnyHeld = false;
        keys.forEach((key) => {
            isAnyHeld = isAnyHeld || this.firstDown(key, operate);
        });
        return isAnyHeld;
    }
    update() {
        this.gamepad.update();
        this.updateCursor();
    }
    updateCursor() {
        let delta = this.mouse.update();
        if (delta.x === 0 && delta.y === 0 && this.gamepad.ready) {
            delta = this.gamepad.cursor;
        }

        this.x += delta.x;
        this.y += delta.y;

        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x > this.canvas.width) {
            this.x = this.canvas.width;
        }
        if (this.y > this.canvas.height) {
            this.y = this.canvas.height;
        }
    }
    drawCursor() {
        window.$game.ctx.drawImage(window.$game.textureManager.getTexture("cursor"), 12, 9, 16, 22, this.x - 4, this.y - 5, 16, 22);
    }
    get position() {
        return new Vector(this.x, this.y);
    }
    get left() {
        if (this.mouse.left) {
            return true;
        }
        if (this.gamepad.ready && this.gamepad.LT > 0.5) {
            return true;
        }
        return false;
    }
    get right() {
        if (this.mouse.right) {
            return true;
        }
        if (this.gamepad.ready && this.gamepad.RT > 0.5) {
            return true;
        }
        return false;
    }
    get comfirm() {
        if (this.left) {
            return true;
        }
        if (this.gamepad.ready && this.gamepad.A) {
            return true;
        }
        return false;
    }
    get moveLeft() {
        if (this.keyboard.isKeyDown("A") || this.keyboard.isKeyDown("Left")) {
            return 1;
        }
        if (this.gamepad.ready && this.gamepad.LX < -0.1) {
            return -this.gamepad.LX;
        }
        return 0;
    }
    get moveRight() {
        if (this.keyboard.isKeyDown("D") || this.keyboard.isKeyDown("Right")) {
            return 1;
        }
        if (this.gamepad.ready && this.gamepad.LX > 0.1) {
            return this.gamepad.LX;
        }
        return 0;
    }
}
