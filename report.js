let students = JSON.parse(localStorage.getItem("students")) || [];
let container = document.getElementById("report");

students.forEach(s => {

    let percent = s.total ? (s.present/s.total)*100 : 0;

    container.innerHTML += `
    <div class="row">
        <b>${s.name}</b> (${s.roll}) - ${percent.toFixed(1)}%

        <div class="bar">
            <div class="fill ${percent < 75 ? 'bad' : 'good'}"
                 style="width:${percent}%">
            </div>
        </div>
    </div>
    `;
});