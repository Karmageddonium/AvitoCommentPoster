var dataDictionary;

window.onload = function() {
    if(document.location.host !== "avito.ru") return;

    AddCommentFrontAndData();
    AddObserver();
}

function AddObserver() {
    let elementGroupForFutherObservation = document.getElementsByClassName("item-view-similars");
    if(elementGroupForFutherObservation.length == 0)
    {
        elementGroupForFutherObservation = document.getElementsByClassName("index-content-wrapper-3hB5p")
        if(elementGroupForFutherObservation.length == 0)
        {
            elementGroupForFutherObservation = document.getElementsByClassName("styles-root-o9DEE");
        }
    }

    if(elementGroupForFutherObservation[0] === undefined) {
        setTimeout(AddObserver, 500);
        return;
    }

    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                AddCommentFrontAndData();
            }
        }
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(elementGroupForFutherObservation[0], config);
}

/**
 * Осуществление взаимодействия pop-up формы с background скриптом при помощи отправки-получения сообщений
 * в активной вкладке с передачей в них необходимых для работы параметров.
 * Переданные параметры перезаписывают предыдущие настройки
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(document.location.host !== "avito.ru") return;

    switch (request.message) {
        case "applyChanges":
            AddCommentFrontAndData();
            break;
        case "chooseFile":
            var fileChooser = document.createElement('input');
            fileChooser.type = 'file';
            fileChooser.addEventListener('change', function () {
                console.log("file change");
                var file = fileChooser.files[0];

                var reader = new FileReader();
                reader.onload = function () {
                    let lines = reader.result.split(/\r\n|\r|\n/g);

                    for (let i = 0; i < lines.length; i++) {
                        let tmpRow = lines[i].trim();
                        if (tmpRow !== "") {
                            let splittedRow = lines[i].split(" ");
                            dataDictionary.set(splittedRow[0], splittedRow[1]);
                        }
                    }

                    SaveDataToStorage();
                };

                reader.readAsText(file);
                form.reset(); //Resets the input so we do get a `change` event, even if the user chooses the same file
            });

            /* Wrap it in a form for resetting */
            var form = document.createElement('form');
            form.appendChild(fileChooser);

            fileChooser.click();
            break;
        case "downloadFile":
            downloadAsFile(GetDataAsText());
            break;
    }

    return true;
});


function SaveDataToStorage()
{
    localStorage.setItem("commentDataMap", JSON.stringify(Array.from(dataDictionary.entries())));
}

function LoadDataFromStorage()
{
    dataDictionary = new Map(JSON.parse(localStorage.getItem("commentDataMap")));
}

//Подготоавливает данные из словаря для записи в текстовый документ
function GetDataAsText() {
    let arr = Array.from(dataDictionary.entries())
    let result = "";
    for(let i = 0; i < arr.length; i++)
    {
        let element = arr[i];
        result += element[0] + " " + element[1] + (i < arr.length - 1 ? "\r\n" : "");
    }
    return result;
}

function downloadAsFile(data) {
    let a = document.createElement("a");
    let file = new Blob([data], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = "example.txt";
    a.click();
}

function GetLink(elementForSearchingIn, titleMarker) {
    if (elementForSearchingIn.nodeType === Node.ELEMENT_NODE && elementForSearchingIn.getAttribute("data-marker") === titleMarker) {
        return elementForSearchingIn.getAttribute("href");
    } else {
        for (let i = 0; i < elementForSearchingIn.childElementCount; i++) {
            var result = GetLink(elementForSearchingIn.childNodes[i]);
            if (result !== null) {
                return result;
            }
        }
        return null;
    }
}

function GetPrefferedLink(elementForSearchingIn) {
    if (elementForSearchingIn.nodeType === Node.ELEMENT_NODE && elementForSearchingIn.getAttribute("class").indexOf("item-snippet-column-2") > -1) {
        return elementForSearchingIn.childNodes[0].getAttribute("href");
    } else {
        for (let i = 0; i < elementForSearchingIn.childElementCount; i++) {
            var result = GetLink(elementForSearchingIn.childNodes[i]);
            if (result !== null) {
                return result;
            }
        }
        return null;
    }
}

function AddCommentFrontAndData() {
    LoadDataFromStorage();
    let elements = document.getElementsByTagName('*'), i;
    for (i in elements) {
        let element = elements[i];
        if(element.nodeType !== Node.ELEMENT_NODE) continue;
        
        if (element.getAttribute('data-marker') !== null && element.getAttribute('data-marker') === 'item')
        {
            //У списка вип-объявлений ширину менять не надо, ибо они идут строкой. Новый div добавится столбиком внизу.
            if (element.parentNode.className.indexOf("items-vip") === -1) {
                element.setAttribute("style", "width: 860px");
            }
            let ourRoot = element.childNodes[0].tagName === "META" ? element.childNodes[1] : element.childNodes[0];
            let newDiv = CreateCommentNode(GetLink(element, "item-title"));
            newDiv.style.marginLeft = "10px";

            if(ourRoot.childNodes[ourRoot.childNodes.length - 1].getAttribute("id") === "someotheridiii") continue;
            ourRoot.appendChild(newDiv);
        }
        else if(element.getAttribute("class") !== null && element.getAttribute("class").indexOf("item-view-contacts") > -1)
        {
            let lastnode = element.childNodes[element.childNodes.length - 1];
            if(lastnode.nodeType === Node.ELEMENT_NODE && lastnode.getAttribute("id") === "someotheridiii") continue;
            let newDiv = CreateCommentNode(window.location.pathname);
            newDiv.style.marginTop = "10px";
            element.appendChild(newDiv);
        }
        else if(element.getAttribute('data-marker') !== null && element.getAttribute('data-marker') === 'bx-recommendations-block-item')
        {
            if(element.childNodes[element.childNodes.length - 1].getAttribute("id") === "someotheridiii") continue;
            let newDiv = CreateCommentNode(GetLink(element, "title"));
            newDiv.style.marginTop = "5px";
            element.appendChild(newDiv);
        }
        else if(element.getAttribute('data-marker') !== null
            && element.getAttribute('data-marker').split("-")[0] === "item"
            && !isNaN(element.getAttribute('data-marker').split("-")[1]))
        {
            if(element.childNodes[element.childNodes.length - 1].getAttribute("id") === "someotheridiii") continue;
            let newDiv = CreateCommentNode(GetPrefferedLink(element));
            newDiv.style.marginLeft = "10px";
            element.setAttribute("style", "width: 900px");
            element.appendChild(newDiv);
        }
    }
}

function CreateCommentNode(currentItemLink) {
    let newP = document.createElement("p");
    newP.textContent = "Мой комментарий:";

    let newTextArea = document.createElement("textarea");
    newTextArea.setAttribute("style", "resize: none; height: 130px; width: 200px");
    newTextArea.onclick = function () {
        event.stopPropagation();
    };

    newTextArea.textContent = dataDictionary.get(currentItemLink);

    let newBtn = document.createElement("button");
    let savedColor = newBtn.style.backgroundColor;
    newBtn.setAttribute("style", "height: 20px; margin-top: 5px");
    newBtn.textContent = "Сохранить";
    newBtn.onclick = function () {
        dataDictionary.set(currentItemLink, newTextArea.value);
        SaveDataToStorage();
        newBtn.style.backgroundColor = savedColor;
    };

    let needSaveColor = "#8EFF00";
    if (newTextArea.addEventListener) {
        newTextArea.addEventListener('input', function() {
            newBtn.style.backgroundColor = needSaveColor;
            // event handling code for sane browsers
        }, false);
    }

    let newDiv = document.createElement("div");
    newDiv.className = "first";
    newDiv.id = "someotheridiii"; //not neccessary but probably useful
    newDiv.setAttribute("style", "position: relative; height:100%; width:200px;");
    newDiv.appendChild(newP);
    newDiv.appendChild(newTextArea);
    newDiv.appendChild(newBtn);

    return newDiv;
}