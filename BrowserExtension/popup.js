// явное указание события для кнопки (связано с политикой безопасности)
let submitButton = document.getElementById("submit");
if(submitButton) {
    submitButton.addEventListener("click", function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "applyChanges"}, function(response) {
                console.log(response.response);
            });
        });
    });
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

let exportButton = document.getElementById("export-button");
if(exportButton) {
    exportButton.addEventListener("click", function()
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "downloadFile"}, function(response) {
                console.log(response.response);
            });
        });
    });
}