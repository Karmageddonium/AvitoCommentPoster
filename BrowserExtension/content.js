// переменные, позволяющие хранить и перезаписывать найстройки пользователя в расширении
let textToReplace = localStorage.getItem('textToReplace');
let newText = localStorage.getItem('newText');
let autoChangeText=localStorage.getItem('autoChangeText');

// применение автоматической замены текста при открытии страницы (если включена соответствующая настройка)
if(autoChangeText==="true")
    replaceText(document.body, textToReplace, newText);

/**
 * Осуществление взаимодействия pop-up формы с background скриптом при помощи отправки-получения сообщений
 * в активной вкладке с передачей в них необходимых для работы параметров.
 * Переданные параметры перезаписывают предыдущие настройки
 */
chrome.runtime.onMessage.addListener(function (request,sender,sendResponse) {
    if (request.todo === "changeTexts") {

        textToReplace=request.ttp;
        newText=request.nt;
        autoChangeText=request.act;

        localStorage.setItem('textToReplace', textToReplace);
        localStorage.setItem('newText', newText);
        localStorage.setItem('autoChangeText', autoChangeText);


        let elements = document.getElementsByTagName('*'), i;
        for (i in elements)
        {
            let element = elements[i];
            if(element.getAttribute('data-marker') === 'item')
            {
                let newP = document.createElement("p");
                newP.textContent = "Мой комментарий:";

                let newTextArea = document.createElement("textarea");
                newTextArea.setAttribute("style", "resize: none; height: 130px; width: 200px");
                newTextArea.onclick =  function()
                {
                    event.stopPropagation();
                };

                //"item-title"
                newTextArea.textContent = GetLink(element);// ourContainerElement.childNodes[0].childNodes[1].getAttribute("href");

                let newBtn = document.createElement("button");
                newBtn.setAttribute("style", "height: 20px; margin-top: 5px");
                newBtn.textContent = "Сохранить";

                let newDiv = document.createElement("div");
                newDiv.className = "first";
                newDiv.id = "someotheridiii"; //not neccessary but probably useful
                newDiv.setAttribute("style", "position: relative; height:100%; width:200px; margin-left: 10px");
                newDiv.appendChild(newP);
                newDiv.appendChild(newTextArea);
                newDiv.appendChild(newBtn);

                if(element.parentNode.className.indexOf("items-vip") === -1)
                {
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

        sendResponse({
            response: "Message received"
        });
        return true;
    }
});

function GetLink(elementForSearchingIn)
{
    if(elementForSearchingIn.getAttribute("data-marker") === "item-title")
    {
        return elementForSearchingIn.getAttribute("href");
    }
    else
    {
        for(let i = 0; i < elementForSearchingIn.childElementCount; i++)
        {
            var result = GetLink(elementForSearchingIn.childNodes[i]);
            if(result !== null)
            {
                return result;
            }
        }
        return null;
    }
}

/**
 * Рекурсивно меняет содержимое дочерних элементов на заданное регулярным выражением (поиск осуществляется глобально, без учёта регистра)
 * @param elementForSearchingIn - родительский элемент, в котором будет осуществляться поиск
 * @param textToReplace - тект, который будет заменён
 * @param newText - текст, на который старый текст будет заменён
 */
function replaceText(elementForSearchingIn, textToReplace, newText) {
    let regex = new RegExp(textToReplace, "gi");

    if(elementForSearchingIn.hasChildNodes()){
        elementForSearchingIn.childNodes.forEach(function(node) {
            replaceText(node, textToReplace, newText)
        });
    } else if(elementForSearchingIn.nodeType===Text.TEXT_NODE){
        elementForSearchingIn.textContent=elementForSearchingIn.textContent.replace(regex, newText);
    }
}