function loadDashboard() {

    if(!document.getElementById("total")) return;

    let students = JSON.parse(localStorage.getItem("students")) || [];

    let total = students.length;
    let avg = 0;
    let low = 0;

    students.forEach(s => {
        let percent = s.total ? (s.present / s.total) * 100 : 0;
        avg += percent;
        if(percent < 75) low++;
    });

    avg = total ? avg / total : 0;

    document.getElementById("total").innerText = total;
    document.getElementById("avg").innerText = avg.toFixed(1) + "%";
    document.getElementById("low").innerText = low;

    // ✅ VERTICAL CHART
    new Chart(document.getElementById("chart"), {
        type: 'bar',
        data: {
            labels: students.map(s => s.name),
            datasets: [{
                data: students.map(s =>
                    s.total ? (s.present/s.total)*100 : 0
                ),
                backgroundColor: students.map(s => {
                    let p = s.total ? (s.present/s.total)*100 : 0;
                    return p < 75 ? "#f87171" : "#86efac";
                })
            }]
        },
        options: {
            indexAxis: 'x',   // vertical bars ✅
            maintainAspectRatio: false
        }
    });
}

loadDashboard();