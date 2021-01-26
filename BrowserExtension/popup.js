// переменные, позволяющие хранить, применять при старте и перезаписывать найстройки пользователя в расширении
let autoChangeTextLastChoice=localStorage.getItem('autoChangeTextLastChoice');
document.getElementById("autoChangeText").checked = autoChangeTextLastChoice === "true";

// явное указание события для кнопки (связано с политикой безопасности)
let submitButton = document.getElementById("submit");
if(submitButton) {
    submitButton.addEventListener("click", saveSettings);
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