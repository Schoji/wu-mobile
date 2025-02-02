export const getGrades = `
  console.log("-------------------------------------------------------------------------");
  console.log("Script started.");

  function showForms() {
    try {
      console.log("Checking if form is visible...");
      var showAllForms = document.getElementsByClassName("mb-2")[0].getElementsByTagName("input")[0];
      if (showAllForms && showAllForms.checked == false) {
        console.log("Checking the form...");
        showAllForms.checked = true;
        var link = showAllForms.getAttribute("onclick");
        eval(link);
        console.log("Form activated.");
      } else {
        console.log("Form already checked.");
      }
    } catch (error) {
      console.error("Error in showForms:", error);
      window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Error in showForms: " + error.message }));
    }
  }

  function getGrades() {
    try {
      console.log("Fetching grades...");
      let grades = [];
      var terms = document.getElementsByClassName("mb-4");
      for (let term of terms) {
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
      console.log("Grades successfully fetched:", grades);
      return grades;
    } catch (error) {
      console.error("Error in getGrades:", error);
      window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Error in getGrades: " + error.message }));
      return [];
    }
  }

  function checkCollapse(callback) {
    try {
      console.log("Expanding collapsed sections if necessary...");
      const maxWaitTime = 15000;
      const maxDelay = 10000;
      const minDelay = 500;
      const delayIncrement = 1.5;
      let elapsedTime = 0;
      let currentDelay = minDelay;

      function checkTerms() {
        const terms = Array.from(document.getElementsByClassName("mb-4"));
        let allExpanded = true;

        terms.forEach((term) => {
          const termHeader = term.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
          if (termHeader && termHeader.classList.contains("header-collapsed")) {
            console.log("Expanding section...");
            termHeader.querySelector("a").click();
            allExpanded = false;
          }
        });

        if (allExpanded) {
          console.log("All sections are expanded.");
          if (typeof callback === "function") callback();
        } else if (elapsedTime >= maxWaitTime) {
          console.log("Max wait time reached. Some sections are still collapsed.");
          window.ReactNativeWebView.postMessage(JSON.stringify({ warning: "Some sections could not be expanded." }));
        } else {
          elapsedTime += currentDelay;
          currentDelay = Math.min(currentDelay * delayIncrement, maxDelay);
          setTimeout(checkTerms, currentDelay);
        }
      }

      checkTerms();
    } catch (error) {
      console.error("Error in checkCollapse:", error);
      window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Error in checkCollapse: " + error.message }));
    }
  }

  showForms();
  checkCollapse(() => {
    try {
      const gradesData = getGrades();
      console.log("Sending grades data to React Native...");
      window.ReactNativeWebView.postMessage(JSON.stringify({ MyGrades: gradesData }));
    } catch (error) {
      console.error("Error while sending grades:", error);
      window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Error while sending grades: " + error.message }));
    }
  });

  console.log("Script execution finished.");
  console.log("-------------------------------------------------------------------------");
`;