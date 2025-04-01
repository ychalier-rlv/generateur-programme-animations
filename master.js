
// Layout settings
const MAXIMUM_NUMBER_OF_ANIMATIONS = 26;
const ONE_COLUMN_MAX = 7;

// Blob settings
const VERTEX_RANDOM_AMPLITUDE = .1;
const ANGLE_RANDOM_AMPLITUDE = Math.PI / 10;
const DISTANCE_MIN = .2;
const DISTANCE_MAX = .6;

function inflateBlob(blob) {
    const vertices = [
        { 
            x: 0.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE,
            y: 0.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE
        }, { 
            x: 2.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE,
            y: 0.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE
        }, { 
            x: 2.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE,
            y: 3.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE
        }, { 
            x: 0.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE,
            y: 3.5 + Math.random() * 2 * VERTEX_RANDOM_AMPLITUDE - VERTEX_RANDOM_AMPLITUDE
        }
    ];
    const angles = [
        Math.PI * 0.25 + Math.random() * 2 * ANGLE_RANDOM_AMPLITUDE - ANGLE_RANDOM_AMPLITUDE,
        Math.PI * 0.75 + Math.random() * 2 * ANGLE_RANDOM_AMPLITUDE - ANGLE_RANDOM_AMPLITUDE,
        Math.PI * 1.25 + Math.random() * 2 * ANGLE_RANDOM_AMPLITUDE - ANGLE_RANDOM_AMPLITUDE,
        Math.PI * 1.75 + Math.random() * 2 * ANGLE_RANDOM_AMPLITUDE - ANGLE_RANDOM_AMPLITUDE
    ];
    const distances = [
        [Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN, Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN],
        [Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN, Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN],
        [Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN, Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN],
        [Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN, Math.random() * (DISTANCE_MAX - DISTANCE_MIN) + DISTANCE_MIN]
    ];
    const hooks = [
        [
            { x: vertices[0].x - distances[0][0] * Math.cos(angles[0]), y: vertices[0].y + distances[0][0] * Math.sin(angles[0]) },
            { x: vertices[0].x + distances[0][1] * Math.cos(angles[0]), y: vertices[0].y - distances[0][1] * Math.sin(angles[0]) }
        ],
        [
            { x: vertices[1].x + distances[1][0] * Math.cos(angles[1]), y: vertices[1].y - distances[1][0] * Math.sin(angles[1]) },
            { x: vertices[1].x - distances[1][1] * Math.cos(angles[1]), y: vertices[1].y + distances[1][1] * Math.sin(angles[1]) }
        ],
        [
            { x: vertices[2].x - distances[2][0] * Math.cos(angles[2]), y: vertices[2].y + distances[2][0] * Math.sin(angles[2]) },
            { x: vertices[2].x + distances[2][1] * Math.cos(angles[2]), y: vertices[2].y - distances[2][1] * Math.sin(angles[2]) }
        ],
        [
            { x: vertices[3].x + distances[3][0] * Math.cos(angles[3]), y: vertices[3].y - distances[3][0] * Math.sin(angles[3]) },
            { x: vertices[3].x - distances[3][1] * Math.cos(angles[3]), y: vertices[3].y + distances[3][1] * Math.sin(angles[3]) }
        ]
    ];
    const path = `
        M ${ vertices[0].x } ${ vertices[0].y }
        C ${ hooks[0][1].x } ${ hooks[0][1].y } ${ hooks[1][0].x } ${ hooks[1][0].y } ${ vertices[1].x } ${ vertices[1].y }
        C ${ hooks[1][1].x } ${ hooks[1][1].y } ${ hooks[2][0].x } ${ hooks[2][0].y } ${ vertices[2].x } ${ vertices[2].y }
        C ${ hooks[2][1].x } ${ hooks[2][1].y } ${ hooks[3][0].x } ${ hooks[3][0].y } ${ vertices[3].x } ${ vertices[3].y }
        C ${ hooks[3][1].x } ${ hooks[3][1].y } ${ hooks[0][0].x } ${ hooks[0][0].y } ${ vertices[0].x } ${ vertices[0].y }`
    blob.setAttribute("d", path);
}

function arrayMove(array, src, dst) {
    array.splice(dst, 0, array.splice(src, 1)[0]);
}

class Controller {

    constructor() {
        this.title = "";
        this.date = "";
        this.animations = [];
        this.config = { 
            smallTop: false,
            noPetal: false
        };
    }

    save() {
        localStorage.setItem("title", this.title);
        localStorage.setItem("date", this.date);
        localStorage.setItem("animations", JSON.stringify(this.animations));
        localStorage.setItem("config", JSON.stringify(this.config));
    }

    load() {
        if (localStorage.getItem("title") != null) {
            this.title = localStorage.getItem("title");
        }
        if (localStorage.getItem("date") != null) {
            this.date = localStorage.getItem("date");
        }
        if (localStorage.getItem("animations") != null) {
            this.animations = JSON.parse(localStorage.getItem("animations"));
        }
        if (localStorage.getItem("config") != null) {
            this.config = JSON.parse(localStorage.getItem("config"));
        }
    }

    bindInput(element, callback) {
        element.addEventListener("input", (event) => { callback(element.value) });
        callback(element.value); // init with trailing input values
    }

    setTitle(title) {
        this.title = title;
        this.update();
    }

    setDate(date) {
        this.date = date;
        this.update();
    }

    addAnimation() {
        if (this.animations.length >= MAXIMUM_NUMBER_OF_ANIMATIONS) {
            alert(`Impossible d'ajouter une animation : maximum atteint (${MAXIMUM_NUMBER_OF_ANIMATIONS})`);
            return;
        }
        this.animations.push({
            day: "",
            month: "",
            title: "",
            description: "",
            color: 1
        });
        this.update();
    }

    setAnimationField(index, field, value) {
        this.animations[index][field] = value;
        this.update();
    }

    update() {

        // Update Inputs
        document.getElementById("input-title").value = this.title;
        document.getElementById("input-date").value = this.date;

        const animationInputContainer = document.getElementById("animation-inputs");
        for (let i = 0; i < MAXIMUM_NUMBER_OF_ANIMATIONS; i++) {
            const node = animationInputContainer.querySelector(`#animation-input-${ i }`);
            if (i < this.animations.length) {
                const animation = this.animations[i];
                node.classList.remove("hidden");
                node.querySelector(".animation-input-day").value = animation.day;
                node.querySelector(".animation-input-month").value = animation.month;
                node.querySelector(".animation-input-title").value = animation.title;
                node.querySelector(".animation-input-description").value = animation.description;
                for (let j = 1; j <= 6; j++) {
                    const colorItem = node.querySelector(`.animation-input-color-item.color-${ j }`);
                    if (j == animation.color) {
                        colorItem.classList.add("active");
                    } else {
                        colorItem.classList.remove("active");
                    }
                }
            } else {
                node.classList.add("hidden");
            }
        }

        document.getElementById("page-title").textContent = this.title;
        document.getElementById("page-date").textContent = this.date;

        const animationContainer = document.getElementById("animations");
        animationContainer.className = `animations-${ Math.ceil(this.animations.length / 2) }`;

        const animationContainerLeft = document.getElementById("animations-left");
        animationContainerLeft.innerHTML = "";
        const animationContainerRight = document.getElementById("animations-right");
        animationContainerRight.innerHTML = "";

        const animationTemplate = document.getElementById("template-animation");
        this.animations.forEach((animation, index) => {
            const node = document.importNode(animationTemplate.content, true);

            node.querySelector(".animation-day").innerHTML = animation.day;
            node.querySelector(".animation-month").innerHTML = animation.month;
            node.querySelector(".animation-title").innerHTML = animation.title;
            node.querySelector(".animation-description").innerHTML = animation.description.replaceAll("\n", "<br>");

            if (animation.day.length >= 3) {
                node.querySelector(".animation-day").classList.add(`animation-day-${ animation.day.length }`);
            }

            const blob = node.querySelector(".blob");
            inflateBlob(blob);
            for (let j = 1; j <= 6; j++) {
                if (j == animation.color) {
                    blob.classList.add(`color-${j}`);
                } else {
                    blob.classList.remove(`color-${j}`);
                }
            }

            if (this.animations.length >= ONE_COLUMN_MAX) {
                if (index < Math.ceil(this.animations.length / 2)) {
                    animationContainerLeft.appendChild(node);
                } else {
                    animationContainerRight.appendChild(node);
                }
            } else {
                animationContainerLeft.appendChild(node);
            }

        });

        if (this.animations.length < ONE_COLUMN_MAX) {
            animationContainerLeft.classList.add("full");
            animationContainerRight.classList.add("hidden");
        } else {
            animationContainerLeft.classList.remove("full");
            animationContainerRight.classList.remove("hidden");
        }

        if (this.config.smallTop) {
            document.getElementById("page").classList.add("smalltop");
            document.getElementById("input-smalltop").checked = true;
        } else {
            document.getElementById("page").classList.remove("smalltop");
            document.getElementById("input-smalltop").removeAttribute("checked");
        }

        if (this.config.noPetal) {
            document.getElementById("page").classList.add("nopetal");
            document.getElementById("input-nopetal").checked = true;
        } else {
            document.getElementById("page").classList.remove("nopetal");
            document.getElementById("input-nopetal").removeAttribute("checked");
        }

        this.save();

        document.getElementById("animation-counter").textContent = this.animations.length;

    }
}

const controller = new Controller();
const animationInputContainer = document.getElementById("animation-inputs");
const animationInputTemplate = document.getElementById("template-animation-input");

for (let i = 0; i < MAXIMUM_NUMBER_OF_ANIMATIONS; i++) {
    const nodeFragment = document.importNode(animationInputTemplate.content, true);
    nodeFragment.querySelector(".animation-input").id = `animation-input-${ i }`;
    animationInputContainer.appendChild(nodeFragment);
    const node = animationInputContainer.querySelector(`#animation-input-${ i }`);
    node.classList.add("hidden");
    node.querySelector(".animation-input-day").addEventListener("input", (event) => {
        controller.setAnimationField(i, "day", event.target.value);
    });
    node.querySelector(".animation-input-month").addEventListener("input", (event) => {
        controller.setAnimationField(i, "month", event.target.value);
    });
    node.querySelector(".animation-input-title").addEventListener("input", (event) => {
        controller.setAnimationField(i, "title", event.target.value);
    });
    node.querySelector(".animation-input-description").addEventListener("input", (event) => {
        controller.setAnimationField(i, "description", event.target.value);
    });
    node.querySelectorAll(".animation-input-color-item").forEach((colorItem, index) => {
        colorItem.addEventListener("click", () => {
            controller.setAnimationField(i, "color", index + 1);
        });
    });
    node.querySelector(".animation-input-delete").addEventListener("click", () => {
        controller.animations.splice(i, 1);
        controller.update();
    });
    node.querySelector(".animation-input-top").addEventListener("click", () => {
        arrayMove(controller.animations, i, 0);
        controller.update();
    });
    node.querySelector(".animation-input-up").addEventListener("click", () => {
        arrayMove(controller.animations, i, Math.max(0, i - 1));
        controller.update();
    });
    node.querySelector(".animation-input-down").addEventListener("click", () => {
        arrayMove(controller.animations, i, Math.min(controller.animations.length - 1, i + 1));
        controller.update();
    });
    node.querySelector(".animation-input-bottom").addEventListener("click", () => {
        arrayMove(controller.animations, i, controller.animations.length - 1);
        controller.update();
    });
}

controller.load();
controller.update();
controller.bindInput(document.getElementById("input-title"), (title) => controller.setTitle(title));
controller.bindInput(document.getElementById("input-date"), (date) => controller.setDate(date));

document.getElementById("btn-add-animation").addEventListener("click", () => {
    controller.addAnimation();
});

document.getElementById("input-smalltop").addEventListener("input", () => {
    const checked = document.getElementById("input-smalltop").checked;
    controller.config.smallTop = checked;
    controller.update();
});

document.getElementById("input-nopetal").addEventListener("input", () => {
    const checked = document.getElementById("input-nopetal").checked;
    controller.config.noPetal = checked;
    controller.update();
});

document.getElementById("btn-save").addEventListener("click", () => {
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        title: controller.title,
        date: controller.date,
        animations: controller.animations,
        config: controller.config
    }));
    const anchorElement = document.createElement("a");
    anchorElement.setAttribute("href", dataString);
    anchorElement.setAttribute("download", "ProgrammeAnimations.json");
    anchorElement.click();
});

document.getElementById("btn-load").addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.addEventListener("change", (event) => {
        const fileList = event.target.files;
        if (fileList.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", (event2) => {
                const parsed_data = JSON.parse(event2.target.result);
                controller.title = parsed_data.title;
                controller.date = parsed_data.date;
                controller.animations = parsed_data.animations;
                if ("config" in parsed_data) {
                    controller.config = parsed_data.config;
                }
                controller.update();
            });
            reader.readAsText(fileList[0], "UTF-8");
        }
    });
    fileInput.type = "file";
    fileInput.accept = "application/json";
    fileInput.click();
});
