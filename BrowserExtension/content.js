var dataDictionary;

window.onload = function() {
    AddCommentFrontAndData();
}
/**
 * Осуществление взаимодействия pop-up формы с background скриптом при помощи отправки-получения сообщений
 * в активной вкладке с передачей в них необходимых для работы параметров.
 * Переданные параметры перезаписывают предыдущие настройки
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.todo === "changeTexts") {


        AddCommentFrontAndData();

        sendResponse({
            response: "Message received"
        });
        return true;
    } else if (request.message == "chooseFile") {
        /* Creates an `input[type="file]` */
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
            form.reset();   // <-- Resets the input so we do get a `change` event,
                            //     even if the user chooses the same file
        });

        /* Wrap it in a form for resetting */
        var form = document.createElement('form');
        form.appendChild(fileChooser);

        fileChooser.click();
        sendResponse({response: "fileChooser clicked"});
    }
    else if(request.message === "downloadFile")
    {
        downloadAsFile(GetDataAsText());
    }
});



function SaveDataToStorage()
{
    localStorage.setItem("commentDataMap", JSON.stringify(Array.from(dataDictionary.entries())));
}

function LoadDataFromStorage() {
    dataDictionary = new Map(JSON.parse(localStorage.getItem("commentDataMap")));
}
function GetDataAsText() {
    let arr = Array.from(dataDictionary.entries())
    //let data = ;

    //let data = Object.entries(dataDictionary).map(a => a.join(" "));
    let result = "";
    //let count = keys.count;
    for(let i = 0; i < arr.length; i++)
    {
        let element = arr[i];
        //result += data[i] + (i < keys.length - 1 ? "\r\n" : "");
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

function GetLink(elementForSearchingIn) {
    if (elementForSearchingIn.getAttribute("data-marker") === "item-title") {
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

function AddCommentFrontAndData() {
    LoadDataFromStorage();
    let elements = document.getElementsByTagName('*'), i;
    for (i in elements) {
        let element = elements[i];
        if (element.getAttribute('data-marker') === 'item') {
            let newP = document.createElement("p");
            newP.textContent = "Мой комментарий:";


            let newTextArea = document.createElement("textarea");
            newTextArea.setAttribute("style", "resize: none; height: 130px; width: 200px");
            newTextArea.onclick = function () {
                event.stopPropagation();
            };


            let currentItemLink = GetLink(element);
            //"item-title"


            //newTextArea.textContent =  localStorage.getItem(currentItemLink);

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
            newDiv.setAttribute("style", "position: relative; height:100%; width:200px; margin-left: 10px");
            newDiv.appendChild(newP);
            newDiv.appendChild(newTextArea);
            newDiv.appendChild(newBtn);

            //#4CAF50

            if (element.parentNode.className.indexOf("items-vip") === -1) {
                element.setAttribute("style", "width: 860px");
            }
            let ourRoot = element.childNodes[0].tagName === "META" ? element.childNodes[1] : element.childNodes[0];
            ourRoot.appendChild(newDiv);
            //element.childNodes[0].appendChild(newDiv);
        }
        /*
                    if((' ' + elements[i].className + ' ').indexOf(' ' + matchClass + ' ')
                        > -1) {
                        elements[i].innerHTML = content;
                    }*/
    }
}