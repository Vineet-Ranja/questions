let data = JSON.parse(localStorage.getItem("jeeData")) || {};

const datePicker = document.getElementById("datePicker");
const subjects = ["Physics", "Chemistry", "Maths"];
const types = ["mains_pyq", "adv_pyq", "normal_q", "mains_mock", "adv_mock"];

const names = {
    mains_pyq: "Mains PYQs",
    adv_pyq: "Advance PYQs",
    normal_q: "Normal Q",
    mains_mock: "Mains Mock",
    adv_mock: "Advance Mock"
};

function getKey(subject) {
    return datePicker.value + "_" + subject;
}

function createUI() {
    const container = document.getElementById("subjectsContainer");
    container.innerHTML = "";

    subjects.forEach(sub => {
        let div = document.createElement("div");
        div.className = "subject";

        div.innerHTML = `<h2>${sub}</h2><div class="container" id="${sub}"></div>`;
        container.appendChild(div);

        let inner = document.getElementById(sub);

        types.forEach(type => {
            let card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h4>${names[type]}</h4>
                <div class="counter">
                    <button onclick="changeCount('${sub}','${type}',-1)">-</button>
                    <span id="${sub}_${type}">0</span>
                    <button onclick="changeCount('${sub}','${type}',1)">+</button>
                </div>
            `;
            inner.appendChild(card);
        });
    });
}

function loadData() {
    subjects.forEach(sub => {
        let key = getKey(sub);
        let current = data[key] || {};

        types.forEach(type => {
            document.getElementById(sub + "_" + type).innerText = current[type] || 0;
        });
    });

    updateOverall();
}

function changeCount(sub, type, val) {
    let key = getKey(sub);

    if (!data[key]) data[key] = {};

    data[key][type] = (data[key][type] || 0) + val;
    if (data[key][type] < 0) data[key][type] = 0;

    localStorage.setItem("jeeData", JSON.stringify(data));
    loadData();
}

function updateOverall() {
    let totals = {};

    types.forEach(t => totals[t] = 0);

    for (let key in data) {
        types.forEach(t => {
            totals[t] += data[key][t] || 0;
        });
    }

    let overallDiv = document.getElementById("overallContainer");
    overallDiv.innerHTML = `<div class="container"></div>`;
    let inner = overallDiv.querySelector(".container");

    types.forEach(t => {
        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h4>${names[t]}</h4>
            <h2>${totals[t]}</h2>
        `;
        inner.appendChild(card);
    });
}
function updateProgressBars() {
    let subjectTotals = {
        Physics: 0,
        Chemistry: 0,
        Maths: 0
    };

    for (let key in data) {
        subjects.forEach(sub => {
            if (key.includes(sub)) {
                types.forEach(t => {
                    subjectTotals[sub] += data[key][t] || 0;
                });
            }
        });
    }

    let max = Math.max(...Object.values(subjectTotals), 1);

    let div = document.getElementById("progressBars");
    div.innerHTML = "";

    for (let sub in subjectTotals) {
        let percent = (subjectTotals[sub] / max) * 100;

        div.innerHTML += `
            <h4>${sub} (${subjectTotals[sub]})</h4>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${percent}%"></div>
            </div>
        `;
    }
}

let chart;

function updateGraph() {
    let dailyTotals = {};

    for (let key in data) {
        let date = key.split("_")[0];

        if (!dailyTotals[date]) dailyTotals[date] = 0;

        types.forEach(t => {
            dailyTotals[date] += data[key][t] || 0;
        });
    }

    let labels = Object.keys(dailyTotals).sort();
    let values = labels.map(d => dailyTotals[d]);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("graphCanvas"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Questions per Day",
                data: values,
                fill: false
            }]
        }
    });
}

datePicker.valueAsDate = new Date();
datePicker.addEventListener("change", loadData);

createUI();
loadData();
updateProgressBars();
updateGraph();