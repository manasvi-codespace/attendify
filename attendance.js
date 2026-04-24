let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

let today = new Date().toISOString().split("T")[0];

// 💾 SAVE
function save() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// 🔥 SYNC (FIXED - NO OVERWRITE)
function sync() {

    if (!attendance[today]) {
        attendance[today] = [];
    }

    students.forEach(s => {

        let existing = attendance[today].find(x => x.roll == s.roll);

        // 👉 only add new student (don't overwrite old data)
        if (!existing) {
            attendance[today].push({
                name: s.name,
                roll: s.roll,
                present: null
            });
        }
    });
}

// ➕ ADD STUDENT
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

    sync();
    save();
    render();

    nameInput.value = "";
    rollInput.value = "";
}

// ✔ MARK ATTENDANCE
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
