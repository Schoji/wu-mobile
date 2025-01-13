export const getMyInfo = `
    tabela = document.getElementsByClassName("inverted-table")[0].querySelector("tbody").querySelectorAll("tr.inverted-table-row")
    myData = {}
    for (let i = 2; i < tabela.length + 2; i = i + 2) {
        var category = tabela[i - 2].querySelector("td.inverted-table-col1").textContent
        var content = tabela[i - 1].querySelector("td.inverted-table-col2").textContent
        myData[category] = content
    }

    permissions = document.querySelectorAll("span[onkeydown] > input")
    myData["email-consent"] = permissions[0].checked
    myData["phone_number-consent"] = permissions[1].checked
    imienazwisko = document.getElementsByClassName("nav-top2-name")[0].textContent
    var imie = imienazwisko.split(" ")[0]
    var nazwisko = imienazwisko.split(" ")[1]
    myData["imie"] = imie
    myData["nazwisko"] = nazwisko
    window.ReactNativeWebView.postMessage(JSON.stringify(myData));
  `