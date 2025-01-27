export const getGrades = `
  console.log("-------------------------------------------------------------------------");

function showForms() {
    var showAllForms = document.getElementsByClassName("mb-2")[0].getElementsByTagName("input")[0];
    if (showAllForms.checked == false) {
        showAllForms.checked = true;
        var link = showAllForms.getAttribute("onclick");
        eval(link);
    }
}

function getGrades() {
    grades = []
    var showAllForms = document.getElementsByClassName("mb-2")[0].getElementsByTagName("input")[0];
    var terms = document.getElementsByClassName("mb-4");
    for (term of terms) {
        var semesterHeader = term.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
        var semester = semesterHeader.getElementsByTagName("span")[0].textContent;
        var structure = semesterHeader.getElementsByTagName("span")[1].textContent;

        var subjects = term.getElementsByTagName("div")[0]
            .getElementsByTagName("div")[1]
            .getElementsByTagName("div")[0]
            .getElementsByTagName("table")[0]
            .getElementsByTagName("tbody")[0]
            .querySelectorAll(":scope > tr");

        let subjectList = [];
        for (let subject of subjects) {
            if (
                (subject.classList.contains("rgRow") || subject.classList.contains("rgAltRow")) &&
                subject.classList.length == 1
            ) {
                var subjectName = subject.getElementsByTagName("td")[0].textContent;
            } else {
                var gradeTable = subject.querySelectorAll("table")[0];
                var gradeHead = subject.querySelectorAll("thead")[0].querySelectorAll("tr")[0].querySelectorAll("th");
                var gradeBody1 = subject.querySelectorAll("tbody")[0].querySelectorAll("tr");
                let subjectTypeGrades = [];
                for (var i = 0; i < gradeBody1.length; i++) {
                    var gradeBody = subject.querySelectorAll("tbody")[0].querySelectorAll("tr")[i].querySelectorAll("td");
                    var tempSubject = {};
                    var subjectType = gradeBody1[i].firstChild.textContent;
                    for (var j = 0; j < gradeHead.length; j++) {
                        var colName;
                        if (gradeHead[j].childElementCount == 0) {
                            colName = gradeHead[j].textContent;
                        } else {
                            colName = gradeHead[j].querySelectorAll("span")[0].textContent;
                        }
                        tempSubject[colName.trim()] = gradeBody[j].textContent.trim();
                    }
                    subjectTypeGrades.push(tempSubject);
                }
                subjectList.push({
                    SubjectName: subjectName,
                    Subjects: subjectTypeGrades,
                });
            }
        }
        grades.push({
            Semester: semester,
            Structure: structure,
            Grades: subjectList,
        });
    }
    return grades
}
// attemptToFetchGrades()

function checkCollapse(callback) {
    const maxWaitTime = 15000; // Total max wait time
    const maxDelay = 10000; // Maximum delay between checks (10 seconds)
    const minDelay = 500; // Initial delay (500ms)
    const delayIncrement = 1.5; // Factor to increase the delay each time
    let elapsedTime = 0;
    let currentDelay = minDelay;

    function checkTerms() {
        const terms = Array.from(document.getElementsByClassName("mb-4"));
        let allExpanded = true;

        terms.forEach((term) => {
            const termHeader = term.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
            if (termHeader && termHeader.classList.contains("header-collapsed")) {
                termHeader.querySelector("a").click();
                allExpanded = false; // At least one term is still collapsed
            }
        });

        if (allExpanded) {
            console.log("All terms are visible");
            if (typeof callback === "function") callback(); // Trigger the callback only if all terms are expanded
        } else if (elapsedTime >= maxWaitTime) {
            console.log("Max wait time reached. Some terms are still collapsed.");
        } else {
            elapsedTime += currentDelay;
            currentDelay = Math.min(currentDelay * delayIncrement, maxDelay); // Increment delay up to maxDelay
            setTimeout(checkTerms, currentDelay); // Re-check after the updated delay
        }
    }

    checkTerms(); // Start the checking loop
}
showForms()
checkCollapse(() => {
    window.ReactNativeWebView.postMessage(JSON.stringify(getGrades()));
})
  `;