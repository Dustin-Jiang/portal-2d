class Save {
    constructor(parent = null) {
        this.ctx = document.querySelector("#save-load");
        this.parent = parent;
    }

    show() {
        this.build();
        this.ctx.classList.remove("hidden");
        if (this.parent) {
            this.parent.classList.add("hidden");
        }
    }

    setMenu(parent) {
        this.menu = new Menu(
            parent,
            [
                this.ctx.querySelector("#new-save-btn"),
                this.ctx.querySelector(".button")
            ],
            [
                () => this.save(),
                () => this.hide()
            ]
        );
    }

    hide() {
        this.ctx.classList.add("hidden");
        this.ctx.innerHTML = "";
        const container = document.createElement("div")
        container.classList.add("save-container")
        this.ctx.appendChild(container)
        if (this.parent) {
            this.parent.classList.remove("hidden");
        }
    }

    build() {
        const container = document.querySelector(".save-container")
        container.innerHTML = ""

        const title = document.createElement("div")
        title.classList.add("title")

        title.innerText = "保存"

        container.appendChild(title)

        this.getAll().forEach((url, save) => {
            const btn = document.createElement("div");
            btn.classList.add("list-item");
            btn.innerHTML = save;

            container.appendChild(btn)
        })

        if (this.getAll().length === 0) {
            const empty = document.createElement("div")
            empty.classList.add("empty")

            empty.innerText = "没有可用的存档"

            container.appendChild(empty)
        }

        const newBtn = document.createElement("div")
        newBtn.classList.add("list-item");
        newBtn.id = "new-save-btn"
        newBtn.innerHTML = "新建存档";
        newBtn.style["fontWeight"] = 800;

        newBtn.addEventListener("click", () => this.save())

        container.appendChild(newBtn)

        const backBtn = document.createElement("div");
        backBtn.classList.add("button");
        backBtn.innerHTML = "返回";

        backBtn.addEventListener("click", () => this.hide())

        container.appendChild(backBtn)

        this.ctx.appendChild(container)

        this.setMenu(title);
    }

    save(title = null) {
        const parfait = JSON.parse(Store.get("parfait") ?? "[]");
        const camera = JSON.parse(Store.get("camera") ?? "[]");
        const statistics = window.$game.statistics ?? {};
        title ??= `${window.$game.chapterNow}-${(new Date()).toISOString()}`;

        this.set(title, {
            url: `${window.$game.chapterNow}.json`,
            parfait,
            camera,
            statistics
        });
        this.hide();
    }

    get(key) {
        return JSON.parse(Store.get("saves"))[key];
    }
    set(key, value) {
        const saves = JSON.parse(Store.get("saves")) || {};
        saves[key] = value;
        Store.set("saves", JSON.stringify(saves));
    }
    /**
     * @typedef SaveData
     * @type {{
     *      url: string,
     *      parfait: string[]
     *      camera: string[]
     * }}
     */

    /**
     * @returns {Map<string, SaveData>}
     */
    getAll() {
        const data = JSON.parse(Store.get("saves")) ?? {};

        const result = new Map()
        Object.keys(data).forEach((v, k) => {
            result.set(v, data[v])
        })

        return result;
    }
}

class Load extends Save {
    constructor(parent = null, callback) {
        super(parent);
        this.switchCallback = callback;
    }

    setMenu(parent) {
        this.menu = new Menu(
            parent,
            [
                ...this.ctx.querySelectorAll(".list-item"),
                this.ctx.querySelector(".button")
            ],
            [
                ...Array.from(this.getAll()).map((item) => {
                    return () => this.switchCallback(item[1]);
                }),
                () => this.hide()
            ]
        );
    }

    build() {
        const container = document.querySelector(".save-container")
        container.innerHTML = ""

        const title = document.createElement("div");
        title.classList.add("title");

        title.innerText = "加载";

        container.appendChild(title)

        const scroll = document.createElement("div");
        scroll.classList.add("list");

        this.getAll().forEach((data, save) => {
            const btn = document.createElement("div")
            btn.classList.add("list-item")
            btn.innerHTML = save

            btn.addEventListener("click", this.switchCallback.bind(this, data))

            scroll.appendChild(btn)
        })

        container.appendChild(scroll)

        if (this.getAll().size === 0) {
            const empty = document.createElement("div");
            empty.classList.add("empty");

            empty.innerText = "没有可用的存档";

            container.appendChild(empty)
        }

        const backBtn = document.createElement("div");
        backBtn.classList.add("button");
        backBtn.innerHTML = "返回";

        backBtn.addEventListener("click", () => this.hide())

        container.appendChild(backBtn)

        this.ctx.appendChild(container)

        this.setMenu(title);
    }
}
