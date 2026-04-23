document.addEventListener("DOMContentLoaded", function () {

let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

let cal = document.getElementById("cal");
let monthEl = document.getElementById("month");
let popup = document.getElementById("popup");
let popupDate = document.getElementById("popupDate");
let studentList = document.getElementById("studentList");

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let monthNames = [
 "January","February","March","April","May","June",
 "July","August","September","October","November","December"
];

// 🔥 FIXED LOCAL DATE (NO UTC BUG)
function getDate(y, m, d) {
    let mm = String(m + 1).padStart(2, "0");
    let dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
}

// 📅 render calendar
function renderCalendar() {

    cal.innerHTML = "";

    let days = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthEl.innerHTML = `
        📅 ${monthNames[currentMonth]} ${currentYear}
        <br><br>
        <button onclick="prevMonth()">⬅ Prev</button>
        <button onclick="nextMonth()">Next ➡</button>
    `;

    for (let i = 1; i <= days; i++) {

        let date = getDate(currentYear, currentMonth, i);

        let div = document.createElement("div");
        div.className = "day";

        // today highlight
        if (
            i === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            div.classList.add("today");
        }

        // attendance
        if (attendance[date]) {
            let present = attendance[date].filter(s => s.present).length;
            let total = attendance[date].length;
            let percent = total ? (present / total) * 100 : 0;

            div.classList.add(percent >= 75 ? "good" : "bad");
           div.innerHTML = `
    <b>${i}</b>
    <small>${percent.toFixed(0)}%</small>
`;
        } else {
            div.classList.add("empty");
            div.innerHTML = `<b>${i}</b>`;
        }

        div.onclick = () => openDay(date);

        cal.appendChild(div);
    }
}

// 🔁 month navigation
window.nextMonth = function () {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
};

window.prevMonth = function () {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
};

// 📌 open popup
function openDay(date) {

    popup.style.display = "block";
    popupDate.innerHTML = `📅 ${date} <button onclick="closePopup()" style="float:right;">❌</button>`;

    if (!attendance[date]) {
        attendance[date] = students.map(s => ({
            name: s.name,
            roll: s.roll,
            present: null
        }));
    }

    renderStudents(date);
}

// ❌ close popup
window.closePopup = function () {
    popup.style.display = "none";
};

// 👩‍🎓 render students
function renderStudents(date) {

    studentList.innerHTML = "";

    attendance[date].forEach((s, i) => {

        let status =
            s.present === true ? "✅" :
            s.present === false ? "❌" : "⏳";

        studentList.innerHTML += `
        <div class="student">
            <span>${s.name}</span>
            <div>
                <button onclick="mark('${date}', ${i}, true)">✔</button>
                <button onclick="mark('${date}', ${i}, false)">✖</button>
                ${status}
            </div>
        </div>
        `;
    });
}

// ✔ mark attendance
window.mark = function(date, i, val) {
    attendance[date][i].present = val;
    localStorage.setItem("attendance", JSON.stringify(attendance));
    renderCalendar();
    renderStudents(date);
};

// start
renderCalendar();

});