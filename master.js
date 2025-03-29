window.addEventListener("load", () => {
    // const page = document.getElementById("page");
    const maximum_number_of_animations = 20;

    // var mason = null;
    // var scale = 1;
    // var margin = 0.4;

    const ONE_COLUMN_MAX = 7;

    function arr_move(array, src, dst) {
        array.splice(dst, 0, array.splice(src, 1)[0]);
    }

    class Data {
        constructor() {
            this.title = "";
            this.date = "";
            this.animations = [];
            this.config = { smallTop: false };
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

        bind_input(element, callback) {
            element.addEventListener("input", (event) => { callback(element.value) });
            callback(element.value); // init with trailing input values
        }

        set_title(title) {
            this.title = title;
            this.update();
        }

        set_date(date) {
            this.date = date;
            this.update();
        }

        add_animation() {
            if (this.animations.length >= maximum_number_of_animations) {
                alert(`Impossible d'ajouter une animation : maximum atteint (${maximum_number_of_animations})`);
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

        set_animation_field(index, field, value) {
            this.animations[index][field] = value;
            this.update();
        }

        update() {

            // Update Inputs
            document.getElementById("input-title").value = this.title;
            document.getElementById("input-date").value = this.date;

            const animation_input_container = document.getElementById("animation-inputs");
            for (let i = 0; i < maximum_number_of_animations; i++) {
                const node = animation_input_container.querySelector(`#animation-input-${ i }`);
                if (i < this.animations.length) {
                    const animation = this.animations[i];
                    node.classList.remove("hidden");
                    node.querySelector(".animation-input-day").value = animation.day;
                    node.querySelector(".animation-input-month").value = animation.month;
                    node.querySelector(".animation-input-title").value = animation.title;
                    node.querySelector(".animation-input-description").value = animation.description;
                    for (let j = 1; j <= 6; j++) {
                        const color_item = node.querySelector(`.animation-input-color-item.color-${ j }`);
                        if (j == animation.color) {
                            color_item.classList.add("active");
                        } else {
                            color_item.classList.remove("active");
                        }
                    }
                } else {
                    node.classList.add("hidden");
                }
            }

            // Update Page
            document.getElementById("page-title").textContent = this.title;
            document.getElementById("page-date").textContent = this.date;

            const animation_container = document.getElementById("animations");
            animation_container.className = `animations-${ Math.ceil(this.animations.length / 2) }`;

            const animation_container_left = document.getElementById("animations-left");
            animation_container_left.innerHTML = "";
            const animation_container_right = document.getElementById("animations-right");
            animation_container_right.innerHTML = "";

            // animation_container_left.style.transform = `scale(${ scale })`;
            // animation_container_right.style.transform = `scale(${ scale })`;

            const animation_template = document.getElementById("template-animation");
            this.animations.forEach((animation, index) => {
                const node = document.importNode(animation_template.content, true);

                // node.querySelector(".animation").style.transform = `scale(${ scale })`;
                // node.querySelector(".animation").style.marginTop = `${ margin }rem`;
                // node.querySelector(".animation").style.marginBottom = `${ margin }rem`;

                node.querySelector(".animation-day").innerHTML = animation.day;
                node.querySelector(".animation-month").innerHTML = animation.month;
                node.querySelector(".animation-title").innerHTML = animation.title;
                node.querySelector(".animation-description").innerHTML = animation.description.replaceAll("\n", "<br>");

                if (animation.day.length >= 3) {
                    node.querySelector(".animation-day").classList.add(`animation-day-${ animation.day.length }`);
                }


                const blob = node.querySelector(".blob");

                const vertice_shift = .1;

                const vertices = [
                    { x: .5 + Math.random() * 2 * vertice_shift - vertice_shift, y: .5 + Math.random() * 2 * vertice_shift - vertice_shift },
                    { x: 2.5 + Math.random() * 2 * vertice_shift - vertice_shift, y: .5 + Math.random() * 2 * vertice_shift - vertice_shift },
                    { x: 2.5 + Math.random() * 2 * vertice_shift - vertice_shift, y: 3.5 + Math.random() * 2 * vertice_shift - vertice_shift },
                    { x: .5 + Math.random() * 2 * vertice_shift - vertice_shift, y: 3.5 + Math.random() * 2 * vertice_shift - vertice_shift },
                ];

                const angle_shift = Math.PI / 10;

                const angles = [
                    Math.PI * 0.25 + Math.random() * 2 * angle_shift - angle_shift,
                    Math.PI * 0.75 + Math.random() * 2 * angle_shift - angle_shift,
                    Math.PI * 1.25 + Math.random() * 2 * angle_shift - angle_shift,
                    Math.PI * 1.75 + Math.random() * 2 * angle_shift - angle_shift
                ];

                const distance_min = .2;
                const distance_max = .6;

                const distances = [];
                distances.push([Math.random() * (distance_max - distance_min) + distance_min, Math.random() * (distance_max - distance_min) + distance_min]);
                distances.push([Math.random() * (distance_max - distance_min) + distance_min, Math.random() * (distance_max - distance_min) + distance_min]);
                distances.push([Math.random() * (distance_max - distance_min) + distance_min, Math.random() * (distance_max - distance_min) + distance_min]);
                distances.push([Math.random() * (distance_max - distance_min) + distance_min, Math.random() * (distance_max - distance_min) + distance_min]);

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

                let path = `
                    M ${ vertices[0].x } ${ vertices[0].y }
                    C ${ hooks[0][1].x } ${ hooks[0][1].y } ${ hooks[1][0].x } ${ hooks[1][0].y } ${ vertices[1].x } ${ vertices[1].y }
                    C ${ hooks[1][1].x } ${ hooks[1][1].y } ${ hooks[2][0].x } ${ hooks[2][0].y } ${ vertices[2].x } ${ vertices[2].y }
                    C ${ hooks[2][1].x } ${ hooks[2][1].y } ${ hooks[3][0].x } ${ hooks[3][0].y } ${ vertices[3].x } ${ vertices[3].y }
                    C ${ hooks[3][1].x } ${ hooks[3][1].y } ${ hooks[0][0].x } ${ hooks[0][0].y } ${ vertices[0].x } ${ vertices[0].y }`

                blob.setAttribute("d", path);


                for (let j = 1; j <= 6; j++) {
                    if (j == animation.color) {
                        blob.classList.add(`color-${ j }`);
                    } else {
                        blob.classList.remove(`color-${ j }`);
                    }
                }

                if (this.animations.length >= ONE_COLUMN_MAX) {
                    if (index < Math.ceil(this.animations.length / 2)) {
                        animation_container_left.appendChild(node);
                    } else {
                        animation_container_right.appendChild(node);
                    }
                } else {
                    animation_container_left.appendChild(node);
                }

            });

            if (this.animations.length < ONE_COLUMN_MAX) {
                animation_container_left.classList.add("full");
                animation_container_right.classList.add("hidden");
            } else {
                animation_container_left.classList.remove("full");
                animation_container_right.classList.remove("hidden");
            }

            if (this.config.smallTop) {
                document.getElementById("page").classList.add("smalltop");
                document.getElementById("input-smalltop").checked = true;
            } else {
                document.getElementById("page").classList.remove("smalltop");
                document.getElementById("input-smalltop").removeAttribute("checked");
            }

            this.save();

        }
    }

    const data = new Data();

    const animation_input_container = document.getElementById("animation-inputs");
    const animation_input_template = document.getElementById("template-animation-input");

    for (let i = 0; i < maximum_number_of_animations; i++) {
        const node_fragment = document.importNode(animation_input_template.content, true);
        node_fragment.querySelector(".animation-input").id = `animation-input-${ i }`;
        animation_input_container.appendChild(node_fragment);
        const node = animation_input_container.querySelector(`#animation-input-${ i }`);
        node.classList.add("hidden");
        node.querySelector(".animation-input-day").addEventListener("input", (event) => {
            data.set_animation_field(i, "day", event.target.value);
        });
        node.querySelector(".animation-input-month").addEventListener("input", (event) => {
            data.set_animation_field(i, "month", event.target.value);
        });
        node.querySelector(".animation-input-title").addEventListener("input", (event) => {
            data.set_animation_field(i, "title", event.target.value);
        });
        node.querySelector(".animation-input-description").addEventListener("input", (event) => {
            data.set_animation_field(i, "description", event.target.value);
        });
        node.querySelectorAll(".animation-input-color-item").forEach((color_item, index) => {
            color_item.addEventListener("click", () => {
                data.set_animation_field(i, "color", index + 1);
            });
        });
        node.querySelector(".animation-input-delete").addEventListener("click", () => {
            data.animations.splice(i, 1);
            data.update();
        });
        node.querySelector(".animation-input-top").addEventListener("click", () => {
            arr_move(data.animations, i, 0);
            data.update();
        });
        node.querySelector(".animation-input-up").addEventListener("click", () => {
            arr_move(data.animations, i, Math.max(0, i - 1));
            data.update();
        });
        node.querySelector(".animation-input-down").addEventListener("click", () => {
            arr_move(data.animations, i, Math.min(data.animations.length - 1, i + 1));
            data.update();
        });
        node.querySelector(".animation-input-bottom").addEventListener("click", () => {
            arr_move(data.animations, i, data.animations.length - 1);
            data.update();
        });
    }

    data.load();
    data.update();
    data.bind_input(document.getElementById("input-title"), (title) => data.set_title(title));
    data.bind_input(document.getElementById("input-date"), (date) => data.set_date(date));

    document.getElementById("btn-add-animation").addEventListener("click", () => {
        data.add_animation();
    });

    document.getElementById("input-smalltop").addEventListener("input", () => {
        let checked = document.getElementById("input-smalltop").checked;
        data.config.smallTop = checked;
        data.update();
    });

    document.getElementById("btn-save").addEventListener("click", () => {
        const data_string = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            title: data.title,
            date: data.date,
            animations: data.animations,
            config: data.config
        }));
        const anchor_element = document.createElement("a");
        anchor_element.setAttribute("href", data_string);
        anchor_element.setAttribute("download", "ProgrammeAnimations.json");
        anchor_element.click();
    });

    document.getElementById("btn-load").addEventListener("click", () => {
        const file_input = document.createElement("input");
        file_input.addEventListener("change", (event) => {
            const file_list = event.target.files;
            if (file_list.length > 0) {
                const reader = new FileReader();
                reader.addEventListener("load", (event2) => {
                    const parsed_data = JSON.parse(event2.target.result);
                    data.title = parsed_data.title;
                    data.date = parsed_data.date;
                    data.animations = parsed_data.animations;
                    if ("config" in parsed_data) {
                        data.config = parsed_data.config;
                    }
                    data.update();
                });
                reader.readAsText(file_list[0], "UTF-8");
            }
        });
        file_input.type = "file";
        file_input.accept = "application/json";
        file_input.click();
    });

    /*
    document.getElementById("input-scale").addEventListener("input", (event) => {
    	scale = parseFloat(event.target.value);
    	console.log("New scale:", scale);
    	data.update();
    });

    document.getElementById("input-margin").addEventListener("input", (event) => {
    	margin = parseFloat(event.target.value);
    	console.log("New margin:", margin);
    	data.update();
    });
    */
    /*
	const smallTopInput = document.getElementById("input-smalltop");
	smallTopInput.addEventListener("input", () => {
		if (smallTopInput.checked) {
			document.getElementById("page").classList.add("smalltop");
		} else {
			document.getElementById("page").classList.remove("smalltop");
		}
	});
    */
});
