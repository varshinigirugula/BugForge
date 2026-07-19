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

            throw new Error(
                `Server Error: ${response.status}`
            );

        }


        const data = await response.json();


        console.log(
            "Gemini Response:",
            data
        );


        loader.style.display = "none";
        result.style.display = "block";


        // ---------------- AI RESPONSE ----------------


        const title =
            data.title ||
            "No Bug Information";


        const description =
            data.description ||
            "No description provided";


        const severity =
            data.severity ||
            "Unknown";


        const line =
            data.lineInfo ||
            "Not available";


        const fixedCode =
            data.fixedCode ||
            code;



        // ---------------- DISPLAY RESULT ----------------


        document.getElementById(
            "bugTitle"
        ).innerText = title;



        document.getElementById(
            "bugDesc"
        ).innerText = description;



        document.getElementById(
            "severityLabel"
        ).innerText =
            "Severity: " + severity;



        document.getElementById(
            "lineInfo"
        ).innerText =
            line;



        document.getElementById(
            "originalCode"
        ).innerText =
            code;



        document.getElementById(
            "fixedCode"
        ).innerText =
            fixedCode;



        // ---------------- HISTORY ----------------


        scanHistory.unshift({

            time:
            new Date()
            .toLocaleString(),

            language:
            lang,

            original:
            code,

            fixed:
            fixedCode,

            title:
            title,

            description:
            description,

            severity:
            severity

        });



        if(historyBox){


            historyBox.innerHTML =


            scanHistory.map(
            (item,index)=>{


                return `

                <div class="history-item">


                <h3>
                ${index+1}.
                ${item.language}
                |
                ${item.severity}
                </h3>


                <p>
                <b>Title:</b>
                ${item.title}
                </p>


                <p>
                <b>Description:</b>
                ${item.description}
                </p>


                <h4>
                Original Code
                </h4>


                <pre>
${item.original}
                </pre>


                <h4>
                Fixed Code
                </h4>


                <pre>
${item.fixed}
                </pre>


                </div>

                `;


            }).join("");

        }



    }

    catch(error){


        loader.style.display =
        "none";


        alert(
            "AI server connection failed!"
        );


        console.error(
            error
        );

    }

}





// ---------------- DOWNLOAD FIXED CODE ----------------


function downloadFixedCode(){


    const fixedCode =
    document.getElementById(
        "fixedCode"
    ).innerText;



    const lang =
    document.getElementById(
        "language"
    ).value;



    if(!fixedCode.trim()){

        alert(
            "No fixed code available!"
        );

        return;

    }



    let extension =
    "txt";



    if(lang==="python")
        extension="py";


    else if(lang==="c")
        extension="c";


    else if(lang==="cpp")
        extension="cpp";


    else if(lang==="java")
        extension="java";


    else if(lang==="javascript")
        extension="js";




    const blob =
    new Blob(
        [fixedCode],
        {
            type:"text/plain"
        }
    );



    const link =
    document.createElement(
        "a"
    );



    link.href =
    URL.createObjectURL(
        blob
    );



    link.download =
    `fixed_code.${extension}`;



    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


}






// ---------------- COMPLEXITY ANALYSIS ----------------


function analyzeComplexity(){


    const code =
    document.getElementById(
        "codeInput"
    ).value;



    const box =
    document.getElementById(
        "complexityBox"
    );



    if(!code.trim()){

        alert(
            "Please enter code first!"
        );

        return;

    }



    const lines =
    code
    .split("\n")
    .filter(
        line =>
        line.trim() !== ""
    )
    .length;



    const functions =
    (
        code.match(
            /function|def/g
        )
        ||
        []
    )
    .length;



    const loops =
    (
        code.match(
            /for|while/g
        )
        ||
        []
    )
    .length;



    const conditions =
    (
        code.match(
            /if|else|switch/g
        )
        ||
        []
    )
    .length;



    let level =
    "Low";



    if(
        loops >=2 ||
        conditions >=3
    )
        level="Medium";



    if(
        loops>=3 ||
        functions>=3
    )
        level="High";



    box.style.display =
    "block";



    box.innerHTML = `

    <h2>
    📊 Code Complexity Report
    </h2>


    <p>
    <b>Total Lines:</b>
    ${lines}
    </p>


    <p>
    <b>Functions:</b>
    ${functions}
    </p>


    <p>
    <b>Loops:</b>
    ${loops}
    </p>


    <p>
    <b>Conditions:</b>
    ${conditions}
    </p>


    <p>
    <b>Complexity Level:</b>
    ${level}
    </p>

    `;


}
