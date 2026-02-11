class Menu {
    focus = -1;
    /**
     *
     * @param {HTMLElement} base
     * @param {HTMLElement[]} items
     * @param {Function[]} operations
     */
    constructor(base, items = [], operations = []) {
        if (items.length !== operations.length) {
            throw new Error(`Menu items and operations length mismatch, items: ${items.length}, operations: ${operations.length}`);
        }
        this.base = base;
        this.items = items;
        this.operations = operations;
        this.items.forEach((item, index) => {
            item.addEventListener("click", () => {
                this.select(index);
            });
        });
    }

    update() {
        if (!this.base.checkVisibility()) return ;
        window.$game.inputManager.firstDowns(["Up", "GAMEPAD_UP"], () => {
            this.move(-1);
        });
        window.$game.inputManager.firstDowns(["Down", "GAMEPAD_DOWN"], () => {
            this.move(1);
        });
        window.$game.inputManager.firstDowns(["Enter", "GAMEPAD_A"], () => {
            if (this.focus >= 0 && this.focus < this.operations.length) {
                this.select(this.focus)
            }
        });
    }

    select(index) {
        this.operations[index]?.();
    }

    move(step) {
        if (this.focus !== -1) {
            this.items[this.focus].classList.remove("hovered");
        }
        this.focus += step;
        console.debug("Menu focus:", this.focus);
        this.focus = (this.focus + 1) % (this.items.length + 1) - 1;
        if (this.focus !== -1) {
            this.items[this.focus].classList.add("hovered");
        }
    }
}
