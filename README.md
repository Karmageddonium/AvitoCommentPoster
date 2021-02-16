# AvitoCommentPoster
Расширение для хрома, чтобы сохранять свои комментарии к объявлениям.

Прежде всего у нас есть расширение, которое вы можете поставить уже из каталога расширений Chrome 

https://chrome.google.com/webstore/detail/avito-comment-adder/hpoolpnhodapahmeifnlmookojkiaoai

В правом верхнем углу появится попап расширения

![](https://sun9-34.userapi.com/impg/fyNN2RomufCyPGEXFntnlkVoU9EyWRQMUinJ3Q/iFRqXpN2P2g.jpg?size=336x285&quality=96&proxy=1&sign=6df7cb9dff11a6c1c1016c3a1dcd67c7&type=album)

Всего три кнопки:
1) Запук принудительно — принудительно вызывает отрисовку элементов, если не сработало автоматически. Вообще крайне бесполезная кнопка как показала практика. Нужна была только для тестов, а после отладки больше ничего никогда не ломалось, но на всякий случай пусть будет.
2) Сохранить в файл — Сохраняет "базу данных" с вашими комментариями локально в txt файл который можно открыть любым блокнотом. Эта фича нужна для более перманентного хранения данных, так как при удалении кэша браузера все ваши комментарии уйдут в небытие. Такой своеобразный бэкап.
3) Загрузить из файла — Восстанавливает "базу данных" расширения из того самого текстового файла выше. Формат файла очень прост - каждая строка это локальный путь на авито (ссылка без домена) и комментарий через пробел (теоретически тут может быть баг, так как в комментариях может затесаться перенос на новую строку, надо будет затестить.):
/moskva/some_amazing_item1 Позвонил, абонент не абонент
/moskva/some_amazing_item2 Позвонил, нет наличия

Расширение добавляет поле с комментарием объявления в 5 разных мест:
1) Когда вы только открыли сайт, вас засыпает разного рода рекомендациями:
![](https://sun9-25.userapi.com/impg/DdpHH9pTHyuPZjxcIcuds_d3f__OYR6SOskvMw/bYM9gzqQRks.jpg?size=1375x805&quality=96&proxy=1&sign=94161f98f6f08d867ad0216b3dcf0fdb&type=album)
2) Конечно же меню поиска. Когда вы ввели поисковой запрос
![](https://sun9-43.userapi.com/impg/TqppjYjjBrVn46n0njGfqUeh2_LRaN0f4Hd1JQ/V6dWo1tjHoI.jpg?size=1291x904&quality=96&proxy=1&sign=464d49d0c635fb5a934047151dda19b9&type=album)
3) Когда открыли само объявление
![](https://sun9-41.userapi.com/impg/_lbPKPl35MGPRrqPG-pkI2J9kQjcDIoPnElf0A/1bRyxU8T_h4.jpg?size=1102x925&quality=96&proxy=1&sign=d21b6d4830132ae1c287420fe10bfe8a&type=album)
4) Список похожих товаров когда открыли само объявление:
![](https://sun9-62.userapi.com/impg/IVCsEvikVKUS-evo-DnEzckk6VYOlt0QLuLk2g/zOOqBTHuLkI.jpg?size=1064x931&quality=96&proxy=1&sign=5eea4f4cf2a334ab7eb3ce79099b84ab&type=album)
5) Список избранных объявлений
![](https://sun9-72.userapi.com/impg/C8QbNxayo7i3iR1l0k3R3zTfd0IwXhB7ACsnGw/aqCGMc-W5oQ.jpg?size=1019x843&quality=96&proxy=1&sign=79b6442481291fa4f79e7c97ab102b3b&type=album)

Добавляемый в разные места элемент представляет собой просто текстовое поле и кнопку внизу, которая при изменении текста в поле становится зелёной - это сигнал к тому что есть несохранённые изменения. По нажатии кнопки, соответственно, изменения сохраняются и будут показаны при обновлении страницы (в будушем можно было бы сделать так чтобы на уже открытых страницах сразу без обновления подтягивались изменения, но это в будущем)

![](https://sun9-46.userapi.com/impg/yWtukk0H-aFuMMO0CFVxw3FcbbqosH0NPxGcSw/RxRhPW9dusU.jpg?size=377x344&quality=96&proxy=1&sign=86fa70f16984741b0805d7e86dd018a9&type=album)

Если расширение сэкономило вам кучу времени, вы можете ~скинуть деньги на лечение~ подарить мне кофе)))

https://yoomoney.ru/to/410012694289877
https://www.buymeacoffee.com/karmageddonium

