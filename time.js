let timeData = JSON.parse(localStorage.getItem("timeData")) || {};
let chart;

const datePicker = document.getElementById("datePicker");
datePicker.valueAsDate = new Date();

function getKey() {
    return datePicker.value;
}

function loadTime() {
    let key = getKey();
    let value = timeData[key] || 0;

    document.getElementById("hours").innerText = value;
    updateGraph();
}

function changeTime(val) {
    let key = getKey();

    timeData[key] = (timeData[key] || 0) + val;
    if (timeData[key] < 0) timeData[key] = 0;

    localStorage.setItem("timeData", JSON.stringify(timeData));
    loadTime();
}

function updateGraph() {
    let labels = Object.keys(timeData).sort();
    let values = labels.map(d => timeData[d]);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("timeChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Hours Studied",
                data: values
            }]
        }
    });
}

datePicker.addEventListener("change", loadTime);

loadTime();