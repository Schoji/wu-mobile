export const getMyStudies = `
tabela = document.getElementsByClassName("inverted-table")[0].querySelector("tbody").querySelectorAll("tr.inverted-table-row")
profile = {}
for (let i = 2; i < tabela.length + 2; i = i + 2) {
    var category = tabela[i - 2].querySelector("td.inverted-table-col1").textContent
    var content = tabela[i - 1].querySelector("td.inverted-table-col2").textContent
    profile[category] = content
}
console.log(profile)
window.ReactNativeWebView.postMessage(JSON.stringify({"MyStudies": profile}));
`
