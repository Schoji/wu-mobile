export const getMyTimetable = 
`function executeScript(attempt = 1) {
    console.log(\`Attempt \${attempt} to execute script\`);

    try {
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return day + "." + month + "." + year;
        }

        var studentInfo = {
            "wydzial": "Wydział Informatyki i Telekomunikacji",
            "kierunek": "Informatyka, I Stopnia, Stacjonarne",
            "specjalnosc": "-",
            "nabor": "Semestr 3 - zimowy 2023/2024"
        };

        var plany = { 
            "wydzial": { 'Informatyki i Telekomunikacji': 737, 'Inżynieryjno-Ekonomiczny Transportu': 735, 'Mechaniczny': 734, 'Mechatroniki i Elektrotechniki': 736, 'Nawigacyjny': 733, 'Szkoła Doktorska': 1037 },
            "kierunek": { "Informatyka": 787, "Automatyka i robotyka": 1018 },
            "specjalnosc": { "-": null, "Programowanie": 1233 },
            "nabor": { "2024/2025 zima": 109, "2023/2024 zima": 107 },
            "tryb_studiow": { "Niestacjonarne": 1, "Stacjonarne": 0 }
        };

        var wydzial = plany.wydzial[studentInfo.wydzial.replace("Wydział ", "")];
        var kierunek = plany.kierunek[studentInfo.kierunek.split(",")[0]];
        var specjalnosc = studentInfo.specjalnosc === "-" ? "" : plany.specjalnosc[studentInfo.specjalnosc];
        var trybstudiow = plany.tryb_studiow[studentInfo.kierunek.split(",")[2].trim()];
        var nabor_str = studentInfo.nabor.split("-")[1].trim().split(" ");
        nabor_str = (nabor_str[0] === "zimowy") ? nabor_str[1] + " zima" : nabor_str[1] + " lato";
        var nabor = plany.nabor[nabor_str];

        function scheduleSearch() {
            window.location = \`https://plany.am.szczecin.pl/Plany/ZnajdzTok?TrybStudiowId=\${trybstudiow}&WydzialId=\${wydzial}&naborId=\${nabor}&kierunekId=\${kierunek}&specjalnoscId=\${specjalnosc}\`;
        }

        if (window.location.search === "?Ukryj=True") {
            scheduleSearch();
            return;
        }

        if (window.location.pathname.includes("/Plany/PlanyTokow/")) {
            console.log("Schedule found!");
            let now = new Date();
            let future = new Date(now);
            let past = new Date();
            past.setFullYear(2025, 0, 13)
            future.setDate(future.getDate() + 7);

            
            let past_str = formatDate(past);
            let future_str = formatDate(future);
            console.log(past)
            for (radio of document.querySelectorAll("input[type='radio']")) {
                if (radio.checked) {
                    radio.checked = false
                }
            }
            document.getElementById("DataDo_I").value = future_str;
            document.getElementById("DataOd_I").value = past_str;
            document.getElementById("SzukajLogout").click();

            var timetable = [];
            var dateHeader = "";
            var table = document.querySelector("table#gridViewPlanyTokow_DXMainTable > tbody").children;
            var timetable_rows = [];

            for (let i = 0; i < table.length; i++) {
                if (table[i].id.includes("gridViewPlanyTokow_DXGroupRowExp")) {
                    if (dateHeader !== "") {
                        timetable.push({ [dateHeader]: timetable_rows });
                    }
                    dateHeader = table[i].children[1].textContent.split(" ")[2];
                    timetable_rows = [];
                }

                if (table[i].id.includes("gridViewPlanyTokow_DXDataRow")) {
                    var timetable_rowdata = {};
                    var timetable_headers = ["Czas_od", "Czas_do", "Liczba_godzin", "Grupy", "Zajęcia", "Forma zajęć", "Nr uruch.", "Sala", "Prowadzący", "Forma_zaliczenia", "Uwagi"];
                    var cycle_count = 0;

                    for (let j = 0; j < table[i].children.length; j++) {
                        var tablecell = table[i].children[j];
                        if (tablecell.classList.contains("dxgvIndentCell") || tablecell.classList.contains("dxgvAIC")) {
                            continue;
                        }
                        timetable_rowdata[timetable_headers[j - 1]] = tablecell.textContent.trim();
                    }

                    console.log(timetable_rowdata);
                    window.ReactNativeWebView.postMessage(JSON.stringify({"MyTimetable": timetable}));
                    timetable_rows.push(timetable_rowdata);
                }
            }
            console.log("timetable", timetable);
        } else {
            console.log("Looking for schedule.");

            if (document.getElementById("gridViewZnajdzTok_grouppanel").textContent.trim() == "Drag a column header here to group by that column") {
                document.querySelector(".list-box").firstElementChild.click()
            }

            table = document.getElementById("gridViewZnajdzTok_DXMainTable").querySelector("tbody").children;
            window.ReactNativeWebView.postMessage(JSON.stringify({"Error": table}));
            var pointlist = [];

            for (var i = 2; i < table.length; i++) {
                var tr = table[i].children;
                var points = 0;

                for (var j = 1; j < tr.length - 2; j++) {
                    switch (j) {
                        case 1:
                            if (tr[j].textContent === nabor_str) points++;
                            break;
                        case 2:
                            if (tr[j].textContent === studentInfo.kierunek.split(",")[0]) points++;
                            break;
                        case 3:
                            var specjalnoscstr = studentInfo.specjalnosc === "-" ? " " : studentInfo.specjalnosc;
                            if (tr[j].textContent.length === 1 && specjalnoscstr.length === 1) {
                                points++;
                            } else {
                                if (tr[j].textContent === specjalnoscstr) {
                                    points++;
                                }
                            }
                            break;
                    }
                }

                pointlist.push({ "element": table[i], "points": points });
            }

            let maximum = 0;
            let scheduleUrl;
            pointlist.forEach(element => {
                if (element.points > maximum) {
                    maximum = element.points;
                    scheduleUrl = element.element.querySelector("a");
                }
            });

            if (scheduleUrl) {
                console.log("Clicking schedule link...");
                scheduleUrl.click();
            } else {
                window.ReactNativeWebView.postMessage(JSON.stringify({"Error": "No valid schedule link found."}));
            }
        }
    } catch (error) {
        window.ReactNativeWebView.postMessage(JSON.stringify({"Error": error}));
    }

    // **Retry Mechanism (Max 15 attempts, 2000ms delay)**
    if (attempt < 15) {
        console.log(\`Retrying in 200ms... (Attempt \${attempt + 1})\`);
        setTimeout(() => executeScript(attempt + 1), 2000);
    } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({"Error": "Max attempts reached. Stopping execution."}));
    }
}

// **Initial Execution**
executeScript();
`;