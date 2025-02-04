export const getMyLecturers = `
try {
    window.ReactNativeWebView.postMessage(JSON.stringify({ "Info": "getMyLecturers has started." }));
    let interval = setInterval(() => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ "Info": "getMyLecturers is still running." }));
    }, 5000);

    function unhideAll() {
        document.querySelectorAll(".header-collapsed a").forEach(button => button.click());
    }

    unhideAll();

    var tables = document.getElementsByClassName("pcg-table");
    var titles = Array.from(document.getElementsByClassName("title")).map(title => title.textContent.trim());
    var output = [];

    for (let i = 0; i < tables.length; i++) {
        try {
            var rows = tables[i].querySelector("tbody").children;
            var tableHeaders = [];
            var subjects = [];
            let currentSubject = "";
            let subjectEntries = [];

            for (var row of rows) {
                if (row.classList.contains("pcg-thead")) {
                    tableHeaders.push(...Array.from(row.children).map(cell => cell.textContent.trim()));
                    continue;
                }

                var rowData = {};
                var subjectName = row.children[0].textContent.trim();

                if (subjectName !== currentSubject && currentSubject !== "") {
                    subjects.push({ [tableHeaders[0]]: currentSubject, "SubjectTypes": subjectEntries });
                    subjectEntries = [];
                }

                for (let k = 1; k < row.children.length; k++) {
                    rowData[tableHeaders[k]] = row.children[k].textContent.trim();
                }

                subjectEntries.push(rowData);
                currentSubject = subjectName;
            }

            // Push last subject entry
            if (subjectEntries.length > 0) {
                subjects.push({ [tableHeaders[0]]: currentSubject, "SubjectTypes": subjectEntries });
            }

            output.push({ [titles[i]]: subjects });

        } catch (error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ "Error": error.message }));
        }
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ "MyLecturers": output }));
    clearInterval(interval);
    window.ReactNativeWebView.postMessage(JSON.stringify({ "Info": "getMyLecturers has finished." }));

} catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ "Error": error.message }));
}`;