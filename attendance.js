let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

// 📅 today's date
let today = new Date().toISOString().split("T")[0];

// create today's attendance if not exists
if (!attendance[today]) {
    attendance[today] = students.map(s => ({
        name: s.name,
        roll: s.roll,
        present: null
    }));
}

// save function
function saveAttendance() {
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// add student (same as before but also update today)
function add() {
    if (!name.value || !roll.value) return alert("Fill details");

    let newStudent = {
        name: name.value,
        roll: roll.value
    };

    students.push(newStudent);

    // also add to today's attendance
    attendance[today].push({
        name: newStudent.name,
        roll: newStudent.roll,
        present: null
    });

    localStorage.setItem("students", JSON.stringify(students));
    saveAttendance();

    render();
}

// mark attendance
function mark(i, val) {
    attendance[today][i].present = val;
    saveAttendance();
    render();
}

// render UI (same theme, just data change)
function render() {

    let container = document.getElementById("list");
    container.innerHTML = "";

    attendance[today].forEach((s, i) => {

        let status =
            s.present === true ? "✅ Present" :
            s.present === false ? "❌ Absent" :
            "⏳ Not Marked";

        container.innerHTML += `
        <div class="student">
            <b>${s.name}</b> (${s.roll})<br>

          <div class="actions">
    <button class="present" onclick="mark(${i}, true)">
        <i class="fa-solid fa-check"></i> Present
    </button>

    <button class="absent" onclick="mark(${i}, false)">
        <i class="fa-solid fa-xmark"></i> Absent
    </button>
</div>
            <div>${status}</div>
        </div>
        `;
    });
}

// run
render();