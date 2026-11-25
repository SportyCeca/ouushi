
let currentUser = null;

const authSection = document.getElementById("authSection");
const userSection = document.getElementById("userSection");
const userRulers = document.getElementById("userRulers");
const publicRulers = document.getElementById("publicRulers");
const message = document.getElementById("message");

function createRulerCard(ruler, editable = false) {
    const column = document.createElement("div");
    column.className = "col-12 col-sm-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "character";

    if (ruler.image) {
        const img = document.createElement("img");
        img.src = ruler.image;
        img.alt = ruler.name;
        img.onerror = () => img.style.display = "none";
        card.appendChild(img);
    }

    const title = document.createElement("h3");
    title.textContent = ruler.name;
    card.appendChild(title);

    const fields = [
        ["Uralkodó neve", "name"],
        ["Uralkodási idő", "reign"],
        ["Birodalom", "empire"],
        ["Kép URL-je", "image"]
    ];

    fields.slice(1, 3).forEach(([label, key]) => {
        const p = document.createElement("p");
        p.textContent = label + ": " + ruler[key];
        card.appendChild(p);
    });

    if (editable) {
        const buttons = document.createElement("div");
        buttons.className = "character-buttons";

        const edit = document.createElement("button");
        edit.textContent = "✏️";
        edit.title = "Szerkesztés";

        edit.onclick = () => {
            card.innerHTML = "";

            const inputs = {};

            fields.forEach(([label, key]) => {
                const input = document.createElement("input");

                input.className = "form-control mb-2";
                input.placeholder = label;
                input.value = ruler[key] || "";

                if (key === "image") {
                    input.type = "url";
                }

                inputs[key] = input;
                card.appendChild(input);
            });

            const publicSelect = document.createElement("select");
            publicSelect.className = "form-select mb-2";

            publicSelect.innerHTML = `
                <option value="1">Publikus</option>
                <option value="0">Privát</option>
            `;

            publicSelect.value = ruler.isPublic;
            card.appendChild(publicSelect);

            const controls = document.createElement("div");
            controls.className = "character-buttons";

            const save = document.createElement("button");
            save.textContent = "💾";
            save.title = "Mentés";

            save.onclick = () => {
                fetch(`/api/users/rulers/${currentUser.id}/${ruler.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: inputs.name.value,
                        reign: inputs.reign.value,
                        empire: inputs.empire.value,
                        image: inputs.image.value,
                        isPublic: Number(publicSelect.value)
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "Ruler updated") {
                        loadUserRulers();
                        loadPublicRulers();
                    } else {
                        alert("Nem sikerült a módosítás!");
                    }
                });
            };

            const cancel = document.createElement("button");
            cancel.textContent = "❌";
            cancel.title = "Mégse";
            cancel.onclick = loadUserRulers;

            controls.append(save, cancel);
            card.appendChild(controls);
        };

        const del = document.createElement("button");
        del.textContent = "🗑️";
        del.title = "Törlés";

        del.onclick = () => {
            if (confirm("Biztosan törlöd ezt az uralkodót?")) {
                fetch(`/api/users/rulers/${currentUser.id}/${ruler.id}`, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "Ruler deleted") {
                        loadUserRulers();
                        loadPublicRulers();
                    }
                });
            }
        };

        buttons.append(edit, del);
        card.appendChild(buttons);
    }

    column.appendChild(card);
    return column;
}

function loadPublicRulers() {
    fetch("/api/rulers")
        .then(res => res.json())
        .then(data => {
            publicRulers.innerHTML = "";

            data.forEach(ruler => {
                publicRulers.appendChild(createRulerCard(ruler));
            });
        });
}

function loadUserRulers() {
    if (!currentUser) return;

    fetch(`/api/users/rulers/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
            userRulers.innerHTML = "";

            data.forEach(ruler => {
                userRulers.appendChild(createRulerCard(ruler, true));
            });
        });
}

document.getElementById("registerForm").onsubmit = (e) => {
    e.preventDefault();

    fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById("regUsername").value,
            email: document.getElementById("regEmail").value,
            password: document.getElementById("regPassword").value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.id) {
            message.textContent = "Sikeres regisztráció! Most már bejelentkezhetsz.";
            message.style.color = "green";
            e.target.reset();
        } else {
            message.textContent = data.message || "Sikertelen regisztráció!";
            message.style.color = "red";
        }
    })
    .catch(() => {
        message.textContent = "Hiba történt a regisztráció során!";
        message.style.color = "red";
    });
};

document.getElementById("loginForm").onsubmit = (e) => {
    e.preventDefault();

    fetch("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.id) {
            currentUser = data;

            authSection.hidden = true;
            userSection.hidden = false;

            document.getElementById("welcome").textContent =
                "Szia, " + data.username + "!";

            e.target.reset();
            message.textContent = "";

            loadUserRulers();
        } else {
            message.textContent = "Hibás e-mail cím vagy jelszó!";
            message.style.color = "red";
        }
    });
};

document.getElementById("rulerForm").onsubmit = (e) => {
    e.preventDefault();

    fetch("/api/users/rulers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("rulerName").value,
            reign: document.getElementById("reign").value,
            empire: document.getElementById("empire").value,
            image: document.getElementById("image").value,
            isPublic: Number(document.getElementById("isPublic").value)
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message === "Ruler saved") {
            e.target.reset();

            message.textContent = "Sikeresen hozzáadtad az uralkodót!";
            message.style.color = "green";

            loadUserRulers();
            loadPublicRulers();
        } else {
            message.textContent = "Nem sikerült a mentés!";
            message.style.color = "red";
        }
    });
};

document.getElementById("logoutButton").onclick = () => {
    fetch("/api/users/logout", {
        method: "POST"
    })
    .then(() => {
        currentUser = null;

        clearForms();

        userRulers.innerHTML = "";
        message.textContent = "";

        userSection.hidden = true;
        authSection.hidden = false;

        loadPublicRulers();
    });
};

function clearForms() {
    document.querySelectorAll("form").forEach(form => form.reset());
}

clearForms();
loadPublicRulers();
