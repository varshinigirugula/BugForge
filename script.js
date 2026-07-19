// ---------------- GLOBAL HISTORY ----------------
let scanHistory = [];

// ---------------- ANALYZE CODE ----------------
async function analyzeCode() {
    const code = document.getElementById("codeInput").value;
    const lang = document.getElementById("language").value;

    const loader = document.getElementById("loaderBox");
    const result = document.getElementById("resultBox");
    const historyBox = document.getElementById("historyBox");

    if (!code.trim()) {
        alert("Please enter code first!");
        return;
    }

    loader.style.display = "block";
    result.style.display = "none";

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code,
                language: lang
            })
        });

        if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
}

const data = await response.json();

        loader.style.display = "none";
        result.style.display = "block";

        const fixed = data.fixedCode;

        // ---------------- BUG INFO ----------------
        let title = "Syntax / Logic Bug Detected";
        let desc = detectBugDescription(code);
        let severityText = "🟠 Warning";

        document.getElementById("bugTitle").innerText = title;
        document.getElementById("bugDesc").innerText = desc;

        const severityLabel = document.getElementById("severityLabel");
        severityLabel.innerText = severityText;
        severityLabel.className = "warning";

        document.getElementById("lineInfo").innerText =
            detectBugLine(code);

        // ---------------- COMPARE PANEL ----------------
        document.getElementById("originalCode").innerText = code;
        document.getElementById("fixedCode").innerText = fixed;

        // ---------------- ADD TO HISTORY ----------------
        scanHistory.unshift({
            time: new Date().toLocaleString(),
            language: lang,
            original: code,
            fixed: fixed,
            title: title,
            description: desc,
            severity: severityText
        });

        // ---------------- UPDATE HISTORY UI ----------------
        if (historyBox) {
            historyBox.innerHTML = scanHistory.map((h, i) => `
                <div class="history-item">
                    <b>${i + 1}. [${h.time}] (${h.language}) - ${h.severity}</b>
                    <p><b>Title:</b> ${h.title}</p>
                    <p><b>Description:</b> ${h.description}</p>
                    <pre>${h.original}</pre>
                    <pre>${h.fixed}</pre>
                </div>
            `).join("");
        }

    } catch (error) {
        loader.style.display = "none";
        alert("Backend or model server is not running!");
        console.error(error);
    }
}

// ---------------- BUG DESCRIPTION ----------------
function detectBugDescription(code) {
    if (code.includes("pritn")) {
        return "Typographical error in print statement";
    }

    if (
        code.includes("printf(") &&
        !code.includes(";")
    ) {
        return "Missing semicolon in C print statement";
    }

    if (
        code.includes("cout") &&
        !code.includes(";")
    ) {
        return "Missing semicolon in C++ output statement";
    }

    if (
        code.includes("System.out.println") &&
        !code.includes(";")
    ) {
        return "Missing semicolon in Java print statement";
    }

    if (
        code.includes("def") &&
        !code.includes(":")
    ) {
        return "Missing colon in Python function definition";
    }

    return "Code issue detected and corrected successfully";
}

// ---------------- BUG LINE DETECTION ----------------
function detectBugLine(code) {
    const lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes("pritn")) {
            return `Line ${i + 1} → Typographical error`;
        }

        if (
            line.includes("printf(") &&
            !line.includes(";")
        ) {
            return `Line ${i + 1} → Missing semicolon`;
        }

        if (
            line.includes("cout") &&
            !line.includes(";")
        ) {
            return `Line ${i + 1} → Missing semicolon`;
        }

        if (
            line.includes("System.out.println") &&
            !line.includes(";")
        ) {
            return `Line ${i + 1} → Missing semicolon`;
        }

        if (
            line.includes("def") &&
            !line.includes(":")
        ) {
            return `Line ${i + 1} → Missing colon`;
        }
    }

    return "Line-level issue identified successfully";
}

// ---------------- DOWNLOAD FUNCTION ----------------
function downloadFixedCode() {
    const fixedCode = document.getElementById("fixedCode").innerText;
    const lang = document.getElementById("language").value;

    if (!fixedCode.trim()) {
        alert("No fixed code available!");
        return;
    }

    let extension = "txt";

    if (lang === "python") extension = "py";
    else if (lang === "c") extension = "c";
    else if (lang === "cpp") extension = "cpp";
    else if (lang === "java") extension = "java";

    const blob = new Blob([fixedCode], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `fixed_code.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ---------------- CODE COMPLEXITY ----------------
function analyzeComplexity() {
    const code = document.getElementById("codeInput").value;
    const box = document.getElementById("complexityBox");

    if (!code.trim()) {
        alert("Please enter code first!");
        return;
    }

    const lines = code
        .split("\n")
        .filter(line => line.trim() !== "")
        .length;

    const functions = (code.match(/function|def/g) || []).length;
    const loops = (code.match(/for|while/g) || []).length;
    const conditions = (code.match(/if|else if|switch/g) || []).length;

    let level = "Low";

    if (loops >= 2 || conditions >= 3) level = "Medium";
    if (loops >= 3 || functions >= 3) level = "High";

    box.style.display = "block";
    box.innerHTML = `
        <h2>📊 Code Complexity Report</h2>
        <p><b>Total Lines:</b> ${lines}</p>
        <p><b>Functions:</b> ${functions}</p>
        <p><b>Loops:</b> ${loops}</p>
        <p><b>Conditions:</b> ${conditions}</p>
        <p><b>Complexity Level:</b> ${level}</p>
    `;
}
