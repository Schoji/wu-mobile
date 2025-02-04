export const getMyStudies = `
try {
    var tabela = document.getElementsByClassName("inverted-table")[0].querySelector("tbody").querySelectorAll("tr.inverted-table-row");
    var profile = {};

    for (let i = 2; i < tabela.length + 2; i = i + 2) {
        try {
            var category = tabela[i - 2].querySelector("td.inverted-table-col1").textContent;
            var content = tabela[i - 1].querySelector("td.inverted-table-col2").textContent;
            profile[category] = content;
        } catch (error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ "Error": "Row processing failed: " + error.message }));
        }
    }

    console.log(profile);
    window.ReactNativeWebView.postMessage(JSON.stringify({ "MyStudies": profile }));

} catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ "Error": "Script execution failed: " + error.message }));
}
`;