const uploadBtn = document.getElementById("uploadBtn");

const status = document.getElementById("status");

const summary = document.getElementById("summaryText");

const loading = document.getElementById("loading");

const fileInput = document.getElementById("audioFile");

const selected = document.getElementById("selectedFile");

const wordCount = document.getElementById("wordCount");
const decisionCount = document.getElementById("decisionCount");
const taskCount = document.getElementById("taskCount");

const steps = document.querySelectorAll(".step");
const circles = document.querySelectorAll(".circle");

let report = "";

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) return;

    const size = (file.size / (1024 * 1024)).toFixed(2);

    selected.innerHTML = `
        <b>${file.name}</b><br>
        ${size} MB Audio
    `;
});

uploadBtn.addEventListener("click", async () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("Select audio");
        return;
    }

    const formData = new FormData();

    formData.append("audio", file);

    loading.style.display = "block";

    steps.forEach(step => step.classList.remove("active", "completed"));
    circles.forEach(circle => circle.classList.remove("processing", "completed"));

    steps[0].classList.add("active");
    circles[0].classList.add("processing");

    status.innerHTML = "";
    summary.innerHTML = "";

    try {

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        circles[0].classList.remove("processing");
        circles[0].classList.add("completed");
        steps[0].classList.add("completed");

        steps[1].classList.add("active");
        circles[1].classList.add("completed");

        steps[2].classList.add("active");
        circles[2].classList.add("completed");

        steps[3].classList.add("active");
        circles[3].classList.add("completed");

        loading.style.display = "none";

        status.innerHTML = "✅ AI Summary Generated";
        status.className = "success";

        let html = "";

        // Transcript
        html += "<div class='card fade-in'>";
        html += "<h2><i class='fa-solid fa-microphone-lines'></i> Transcript</h2>";
        html += `<div class="transcript">${data.transcript}</div>`;
        html += "</div>";

        // Executive Summary
        html += "<div class='card slide-up'>";
        html += "<h2><i class='fa-solid fa-file-lines'></i> Executive Summary</h2>";
        html += "<ul class='summary-list'>";

        report = "";

        data.summary.summary.forEach(item => {
            html += `<li>${item}</li>`;
            report += item + "\n";
        });

        html += "</ul></div>";

        // Key Decisions
        html += "<div class='card slide-up'>";
        html += "<h2><i class='fa-solid fa-check'></i> Key Decisions</h2>";
        html += "<div class='decision-list'>";

        data.summary.keyDecisions.forEach(item => {

            html += `
                <div class="decision">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>${item}</span>
                </div>
            `;

            report += item + "\n";
        });

        html += "</div></div>";

        // Action Items
        html += "<div class='card slide-up'>";
        html += "<h2><i class='fa-solid fa-list-check'></i> Action Items</h2>";
        html += "<div class='action-grid'>";

        data.summary.actionItems.forEach(item => {

            html += `
                <div class="action-card">
                    <h3>📌 ${item.task}</h3>

                    <p>
                        <strong>👤 Owner:</strong><br>
                        ${item.owner}
                    </p>

                    <p>
                        <strong>📅 Deadline:</strong><br>
                        ${item.deadline}
                    </p>
                </div>
            `;

            report += `${item.task} | Owner: ${item.owner} | Deadline: ${item.deadline}\n`;
        });

        html += "</div></div>";

        summary.innerHTML = html;

        document.querySelector(".stats").style.display = "grid";

        wordCount.innerHTML = data.transcript.split(/\s+/).length;
        decisionCount.innerHTML = data.summary.keyDecisions.length;
        taskCount.innerHTML = data.summary.actionItems.length;

    }
    catch (err) {

        loading.style.display = "none";

        status.innerHTML = "❌ Error";
        status.className = "error";

        summary.innerHTML = err.message;
    }

});

document.getElementById("copyBtn").addEventListener("click", () => {

    navigator.clipboard.writeText(report);

    status.innerHTML = "📋 Summary copied to clipboard!";
    status.className = "success";

});

document.getElementById("downloadBtn").addEventListener("click", () => {

    const blob = new Blob([report], { type: "text/plain" });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "MeetingSummary.txt";

    a.click();

});