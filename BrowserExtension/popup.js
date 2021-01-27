// переменные, позволяющие хранить, применять при старте и перезаписывать найстройки пользователя в расширении
let autoChangeTextLastChoice=localStorage.getItem('autoChangeTextLastChoice');
document.getElementById("autoChangeText").checked = autoChangeTextLastChoice === "true";

// явное указание события для кнопки (связано с политикой безопасности)
let submitButton = document.getElementById("submit");
if(submitButton) {
    submitButton.addEventListener("click", saveSettings);
}

let importButton = document.getElementById("import-button");
if(importButton) {
    importButton.addEventListener("click", function()
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "chooseFile"}, function(response) {
                console.log(response.response);
            });
        });
    });
}

/**
 * Сохранение настроек и применение их на странице.
 * Применение настроек на странице происходит при помощи их передачи в сообщении, предназначенном для background скрипта
 */
function saveSettings() {
    let textToReplace = document.getElementById("textToReplace").value;
    let newText = document.getElementById("newText").value;

    autoChangeTextLastChoice = document.getElementById("autoChangeText").checked;
    localStorage.setItem('autoChangeTextLastChoice', autoChangeTextLastChoice);

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {todo: "changeTexts", ttp: textToReplace, nt: newText, act: autoChangeTextLastChoice});
    })
}

function validate() {
    var fileName = document.getElementById("fileType").value;
    var dot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(dot, fileName.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg") {
        //accepted
    } else {
        alert("Only jpg and jpeg image files allowed!");
    }
}