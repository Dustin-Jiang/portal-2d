class GamepadManager {
    SENSITIVITY = 15;
    DEADZONE = 0.1;

    constructor() {
        /**
         * @type {Gamepad | null}
         * @readonly
         */
        this.gamepad = null;

        this.A = false;
        this.B = false;
        this.X = false;
        this.Y = false;

        this.UP = false;
        this.DOWN = false;
        this.LEFT = false;
        this.RIGHT = false;

        this.LB = false;
        this.RB = false;

        this.LT = 0.0;
        this.RT = 0.0;

        this.LX = 0.0;
        this.LY = 0.0;
        this.RX = 0.0;
        this.RY = 0.0;

        window.addEventListener("gamepadconnected", (e) => {
            this.gamepad = e.gamepad;
        })
    }

    get ready() {
        return this.gamepad !== null;
    }

    update() {
        if (!this.gamepad) return;

        this.gamepad.buttons.forEach((button, index) => {
            switch (index) {
                case 0: this.A = button.pressed; break;
                case 1: this.B = button.pressed; break;
                case 2: this.X = button.pressed; break;
                case 3: this.Y = button.pressed; break;
                case 4: this.LB = button.pressed; break;
                case 5: this.RB = button.pressed; break;
                case 6: this.LT = button.value; break;
                case 7: this.RT = button.value; break;
                case 8: this.BACK = button.pressed; break;
                case 9: this.START = button.pressed; break;
                case 12: this.UP = button.pressed; break;
                case 13: this.DOWN = button.pressed; break;
                case 14: this.LEFT = button.pressed; break;
                case 15: this.RIGHT = button.pressed; break;
            }
        });

        this.gamepad.axes.forEach((axis, index) => {
            switch (index) {
                case 0: this.LX = this.axisDeadzone(axis); break;
                case 1: this.LY = this.axisDeadzone(axis); break;
                case 2: this.RX = this.axisDeadzone(axis); break;
                case 3: this.RY = this.axisDeadzone(axis); break;
            }
        });
    }

    /**
     * @private
     */
    axisDeadzone(value) {
        if (Math.abs(value) < this.DEADZONE) {
            return 0.0;
        }
        return value;
    }

    /**
     *
     * @param {string} key
     */
    isKeyDown(key) {
        if (!key.startsWith("GAMEPAD_")) return 0;
        let k = key.substring(8);
        return this[k];
    }

    get cursor() {
        const dx = this.RX * this.SENSITIVITY;
        const dy = this.RY * this.SENSITIVITY;
        return new Vector(dx, dy);
    }
}
