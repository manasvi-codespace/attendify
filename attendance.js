let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

let today = new Date().toISOString().split("T")[0];

// 💾 save
function save() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// 🔥 ensure today exists
function sync() {

    if (!attendance[today]) {
        attendance[today] = [];
    }

    let updated = [];

    students.forEach(s => {

        let existing = attendance[today].find(x => x.roll == s.roll);

        updated.push({
            name: s.name,
            roll: s.roll,
            present: existing ? existing.present : null
        });
    });

    attendance[today] = updated;
}

// ➕ ADD STUDENT (FIXED)
function add() {

    let nameInput = document.getElementById("name");
    let rollInput = document.getElementById("roll");

    if (!nameInput.value || !rollInput.value) {
        alert("Fill details");
        return;
    }

    students.push({
        name: nameInput.value,
        roll: rollInput.value
    });

    save();

    sync();
    save();
    render();

    nameInput.value = "";
    rollInput.value = "";
}

// ✔ MARK
function mark(i, val) {
    attendance[today][i].present = val;
    save();
    render();
}

// 📌 RENDER
function render() {

    sync();

    let list = document.getElementById("list");
    list.innerHTML = "";

    attendance[today].forEach((s, i) => {

        let status =
            s.present === true ? "✅ Present" :
            s.present === false ? "❌ Absent" :
            "⏳ Not Marked";

        list.innerHTML += `
        <div class="student">
            <b>${s.name}</b> (${s.roll})<br><br>

            <button class="present" onclick="mark(${i}, true)">✔ Present</button>
            <button class="absent" onclick="mark(${i}, false)">✖ Absent</button>

            <div style="margin-top:8px">${status}</div>
        </div>
        `;
    });
}

// 🚀 INIT
sync();
render();
