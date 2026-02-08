class Electron {
    static isElectron = false;
    /**
     * @type {string|null}
     */
    static version = null;

    static init() {
        try {
            if (ipc && ipc.versions && ipc.versions.electron) {
                this.isElectron = true;
                this.version = ipc.versions.electron();
                console.debug("Electron version: ", this.version);

                this.initUserToken();
            }
        }
        catch (error) {
            // Do nothing
        }
    }

    /**
     * @private
     */
    static async initUserToken() {
        localStorage.setItem('portal-2d-token', await ipc.username);
        localStorage.setItem('token', await ipc.username);
    }

    static async exit() {
        if (!this.isElectron) {
            return;
        }
        ipc.exit();
    }
}