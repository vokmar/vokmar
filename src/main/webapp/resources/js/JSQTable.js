(function ($) {

    $.fn.JSQTable = function (options) {
        var defaults = {
            category: 'nou',
            columncat: 0,
            thead: [],
            name: [],
            input: [],
            placeholders: []
        };
        /*
         url (id) - имя адреса по которому вызывается контроллер для загрузки содержимог JSON объекта состоящего из категорий, подкатегорий суб категорий
         этот же адрес используется в качестве id таблицы

         category (data-type-category) - если значение по умолчанию (nou) значит таблица не поддерживает категории, если значение ок, таблица поддерживает все категории

         columncat (data-sub-category) - указавает на количество категорий; 0 - нет подкатегорий и субкатегорий; 1 - есть подкатегориии; 2 есть субкатегории

         thead - наименование заголовков, если указаны таблица с заголовком если нет, заголовки не выводятся.

         name - название полей, записываемое в параметр name

         input - указывается тип поля ввода, который будет установлен для ячейки: input, textarea

         placeholders - содержащий массив описаний [['Описание категории..','Наименование...'],['Описание подкатегории...'],['Описание субкатегорий...']]

        */
        var opts = $.extend(defaults, options);
        //outerHeightTextArea();
        var table_name12 = "#egrulname";
        var table_name22 = "#category";
        var table_name22 = "#egrulname, #category";
        var table_name_on2 = "#egrulname tr, #category tr"; // Список всех таблиц на странице
        var table_name_on_click2 = "#egrulname tr input[type=checkbox], #category tr input[type=checkbox]";

        var $object = this;

        initDecore();

        function initDecore() {
            $.ajax({
                type: "POST",
                url: opts.url,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: true,
                beforeSend: function (xhr) {

                    xhr.setRequestHeader(opts.header, opts.token);
                    $object.text('Загрузка данных...');
                },
                success: function (res) {
                    $object.empty();
                    eachData(res);

                }
            });

            // Производим разбор объекта на категории, подкатегории, субкатегории
            function eachData(objektJson) {
                console.log(objektJson);
                var ok = false; // проверки в методе insertCategory
                // Выполняем манипуляци, только если объект не пустой
                if (objektJson != null) {
                    // Добавление таблицы и заголовков
                    var flag = insertTable();
                    //КАТЕГОРИЯ
                    objektJson.forEach(function (value, index, arr) {
                        // КАТЕГОРИЯ value.name
                        if ((value.subcategory != null) && (opts.columncat == 0 || 1 || 2) && flag && !ok) {
                            ok = insertCategory(value); // Добавляем категории
                        }
                        // Если последняя строка всех категорий,  после нее выводим пустую
                        if ((index == (objektJson.length - 1) && (opts.columncat == 0 || 1 || 2) && flag && !ok) || (value.subcategory.length == 0)) {

                            ok = insertCategory(null); // добавляем последнюю строку кактегорий
                        }

                        if ((value.subcategory != null) && (opts.columncat == 1 || 2) && flag) {
                            //alert('Подкатегории');
                            //ПОД КАТЕГОРИЯ

                            value.subcategory.forEach(function (value1, index, arr) {
                                //console.log(' -' + value1.name);
                                insertCatSub(value.id, value1, arr, index); // Добавляем подкатегорию


                                //СУБ КАТЕГОРИЯ
                                if (opts.columncat == 2) {
                                    //alert('Субкатегории');
                                    value1.subtwocategory.forEach(function (value2, index2, arr2) {
                                        //console.log('  --' + value2.name);
                                        insertCatSubTwo(value.id, value1.id, value2, arr2, index2);
                                    });
                                }


                            });
                        }
                    });

                }
            }

            // Добавление таблицы и заголовков
            function insertTable() {
                var flag = true;
                /* Формирование таблицы*/
                $object.html('<table data-sub-category=' + opts.columncat + ' data-type-category=' + opts.category + ' id=' + opts.url + '></table> ');
                /*Формирование заголовков, если они указаны*/
                // ПРОВЕРКА корректности столбцов шапки и тела таблицы
                // Если столбцов заголовков больше чем данных
                if (opts.thead.length != 0) { // выводим шапку если указаны названия столбцов
                    var trd = '<tr>';
                    $.each(opts.thead, function (index, value) { // index - начинается с нуля
                        // проверка, что заголовков не должно быть больше данных
                        if (index + 1 <= opts.name.length) {
                            trd += '<td>' + value + '</td>'
                        } else { // если заголовков больше выводим предупреждение
                            trd += '<td>' + value + '<span style="color: red; font-size: 12px;">Лишний заголовок</span></td>'
                            flag = false;
                        }
                    });
                    // Если данных больше чем заголовков
                    $.each(opts.name, function (index, value) { // index - начинается с нуля
                        if ((opts.name.length > opts.thead.length) && ((index + 1) > opts.thead.length)) {
                            trd += '<td><span style="color: red; font-size: 12px">Добавьте заголовок</span></td>'
                            flag = false;
                        }
                    });


                    // Если описания не соответсвуют количеству столбцов таблицы

                    $


                    trd += '</tr>'
                    /*Запись заголовка в таблицу*/
                    $('table[id=' + opts.url + ']', $object).prepend(
                        '<thead>' +
                        '<tr>' +
                        trd +
                        '</tr>' +
                        '</thead>'
                    );

                    if (!flag) {
                        $('table[id=' + opts.url + ']', $object).append(
                            '<tr>' +
                            '<td style="color: red;" colspan="' + (opts.thead.length + 1) + '"><span style="margin: 10px">Проверьет количество параметров: thead, name!</span></td>' +
                            '</tr>'
                        );
                    }
                }
                return flag;
            }

            // Добавление категорий в таблицу
            function insertCategory(category) {
                let flag = false; // false - все проверки пройдены
                let typeInputFalse = false; // Проверка провильного наименования типов полей
                if (opts.input.length == 0) { // если не указаны типы ячеек
                    $.each(opts.name, function (key, value) {
                        opts.input.push('textarea');
                    });
                }

                if ((opts.input.length > opts.name.length) || (opts.input.length < opts.name.length)) {
                    flag = true; // проверка, количество типов == количеству заголовков
                }


                if (!flag && (category != null)) {
                    var rtvar = '<tr id="' + category.id + '">';
                    $.each(opts.name, function (key, value) {
                        var placeholdersId = '';
                        if (opts.placeholders[0] != null) {
                            placeholdersId = opts.placeholders[0][key];
                            if (placeholdersId == undefined) {
                                placeholdersId = ''; // Если описание не задано
                            }
                        }

                        if (category[value] == undefined) { // Если данные не пустые, предотвращаем вывод undefined
                            category[value] = '';

                        }

                        switch (opts.input[key]) {
                            case 'input': {
                                //console.log('opts.category '+opts.category+'| '+'key '+key);
                                if ((opts.category == 'ok') && (key == 0)) { //категории возможны и это первый элемент массива input
                                    rtvar += '<td><div class="content_spisok">' +
                                        '<div class="spisok" >' +
                                        '<a href="#">+</a>' +
                                        '</div>' +
                                        '<div class="input_spisok">' +
                                        '<input class="ft" placeholder="' + placeholdersId + '"  name="' + value + '" id="' + category.id + '" value=' + category[value] + '></input>' +
                                        '</div>' +
                                        '</div></td>';
                                }
                                if ((opts.category == 'ok') && (key > 0)) { //категории возможны и это второй и > элемент массива input
                                    rtvar += '<td><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="' + category.id + '"  value=' + category[value] + '></input></td>';
                                }
                                if (opts.category == 'nou') { // категории запрещены
                                    rtvar += '<td><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="' + category.id + '"  value=' + category[value] + '></input></td>';
                                }
                                break;
                            }
                            case 'textarea'  : {
                                if ((opts.category == 'ok') && (key == 0)) { //категории возможны и это первый элемент массива input
                                    rtvar += '<td><div class="content_spisok">' +
                                        '<div class="spisok" >' +
                                        '<a href="#">+</a>' +
                                        '</div>' +
                                        '<div class="input_spisok">' +
                                        '<textarea placeholder="' + placeholdersId + '" name="' + value + '" id="' + category.id + '" class="ft" >' + category[value] + '</textarea>' +
                                        '</div>' +
                                        '</div></td>';
                                }
                                if ((opts.category == 'ok') && (key > 0)) { //категории возможны и это второй и > элемент массива input
                                    rtvar += '<td><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="' + category.id + '" class="ft" >' + category[value] + '</textarea></td>';
                                }

                                if (opts.category == 'nou') { // категории запрещены
                                    rtvar += '<td><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="' + category.id + '" class="ft" >' + category[value] + '</textarea></td>';
                                }
                                break;
                            }

                            default: { // проверка на правильность наименования типов
                                flag = true;
                                typeInputFalse = true; // Не верно указаны типы полей
                            }

                        }

                    });
                }

                if (flag) { // если типов больше или меньше чем заголовков столбцов

                    if (typeInputFalse) { // Не верно указаны типы полей
                        rtvar = '<tr>';
                        rtvar += '<td style="color: red;" colspan="' + (opts.thead.length + 1) + '"><span style="margin: 10px">Не верно указы типы полей (input)!</span></td>';
                    } else {
                        rtvar += '<td style="color: red;" colspan="' + (opts.thead.length + 1) + '"><span style="margin: 10px">Проверьте типы полей (input) и наименования (name)!</span></td>';
                    }


                }
                if (category != null) { // Для последней строки не выводим стандартное завершение таблицы
                    //Данное окончание таблицы выводится для основных строк таблицы
                    rtvar += '<td style="border: 0px" id=' + category.id + ' ></td>';

                    rtvar += '</tr>';
                    $('table[id=' + opts.url + ']').append(rtvar);
                }

                if (category == null) { // Вывод пустой строки категорий
                    var rtvars = '<tr id="new_so" data-cat="new">';
                    $.each(opts.name, function (key, value) {
                        let placeholdersId = '';
                        if (opts.placeholders[0] != null) {
                            placeholdersId = opts.placeholders[0][key];
                            if (placeholdersId == undefined) {
                                placeholdersId = '';
                            }
                        }


                        switch (opts.input[key]) {
                            case 'input': {

                                rtvars += '<td><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="new_' + value + '" ></input></td>';


                                break;
                            }
                            case 'textarea'  : {

                                rtvars += '<td><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="new_' + value + '" class="ft" ></textarea></td>';

                                break;
                            }

                        }

                    });
                    rtvars += '<td style="border: 0px" id="delete" ></td>';
                    rtvars += '</tr>';
                    //console.log(rtvars);
                    $('table[id=' + opts.url + ']').append(rtvars);
                }


                outerHeightTextArea();

                return flag;
            }

            function insertCatSub(idCat, cat2, arr, index) {
                // Выборка категории

                let dataCat = $('table[id=' + opts.url + '] tr[id=' + idCat + ']', $object);
                // Выборка 1, 2, 3, и т.д. строк подкатегорий cat2.id - вторая подкатегория, чтобы выбрать первую (cat2.id-1)
                let dataCatSub = $('table[id=' + opts.url + '] tr[id $=' + (cat2.id - 1) + '_' + idCat + ']:last', $object);

                var tr = eachDataTable(cat2, cat2.id + '_' + idCat, true, idCat); // Получаем строку таблицы

                if (dataCatSub.length > 0) { // если есть субкатегории
                    dataCatSub.after(tr);
                } else {
                    dataCat.after(tr); // для первой субкатегории
                }

                if ((index + 1 == arr.length)) {  // Если последняя строка подкатегорий, то после нее выводим пустую
                    // выбираем уже существующую последнбюю подкатегю (cat2.id) -> исключаем единицу (cat2.id-1)
                    dataCatSub = $('table[id=' + opts.url + '] tr[id $=' + (cat2.id) + '_' + idCat + ']:last', $object);
                    tr = eachDataTable(null, idCat, true, idCat); // Получаем строку таблицы
                    dataCatSub.after(tr);
                }

                if (cat2.subtwocategory.length == 0) { // Вывод пустой строки субкатегории, если их нет

                    dataCatSub = $('table[id=' + opts.url + '] tr[id $=' + (cat2.id) + '_' + idCat + ']:last', $object);
                    tr = eachDataTable(null, idCat, false, cat2.id + '_' + idCat); // Получаем строку таблицы
                    dataCatSub.after(tr);
                }


            }

            function insertCatSubTwo(idCat, idCatSub, cat3, arr, index) {

                let dataCat1 = $('table[id=' + opts.url + '] tr[id=' + idCatSub + '_' + idCat + ']', $object);
                let dataCatSubTwo = $('table[id=' + opts.url + '] tr[id=' + (cat3.id - 1) + '_' + idCatSub + '_' + idCat + ']', $object);

                var tr = eachDataTable(cat3, cat3.id + '_' + idCatSub + '_' + idCat, false, idCatSub + '_' + idCat); // Получаем строку таблицы

                if (dataCatSubTwo.length > 0) {
                    dataCatSubTwo.after(tr);

                } else {
                    dataCat1.after(tr);
                }

                // Вывод пустой строки субкатегории
                if ((index + 1 == arr.length)) {  // Если последняя строка подкатегорий, то после нее выводим пустую
                    // выбираем уже существующую последнбюю подкатегю (cat3.id) -> исключаем единицу (cat3.id-1)
                    let dataCatSubTwos = $('table[id=' + opts.url + '] tr[id=' + (cat3.id) + '_' + idCatSub + '_' + idCat + ']', $object);
                    tr = eachDataTable(null, idCatSub + '_' + idCat, false, idCatSub + '_' + idCat); // Получаем строку таблицы
                    dataCatSubTwos.after(tr);
                }


            }


        } // Конец модуля

        // Получение строки подкатегории и субкатегории в т.ч. пустые строки
        function eachDataTable(category, iDi, flag, idCat) {
            /*
            category - объект подкатегори или субкатегории; при выводе пустой строки равняется null
            iDi - текущее значение id
            flag - true  - категории; false - субкатегория
            idCat - id строки выше
          */

            let rtvar = '';
            if (category != null) {
                rtvar = '<tr id="' + iDi + '"  style="display: none;" data-tr-id="' + idCat + (flag ? ('" data-sub-cat="' + category.id) : ('" data-sub-two-category="' + category.id)) + (flag ? ('" data-cat="' + idCat) : '') + '" >';
                $.each(opts.name, function (key, value) { //
                    var placeholdersId = '';
                    if (opts.placeholders[flag ? 1 : 2] != null) { // выбираем из массива placeholders 2-й или 3-й элементы
                        placeholdersId = opts.placeholders[flag ? 1 : 2][key];
                        if (placeholdersId == undefined) {
                            placeholdersId = ''; // Если описание не задано
                        }
                    }

                    if (category[value] == undefined) { // Если данные не пустые, предотвращаем вывод undefined
                        category[value] = ''; // используется при не существующих данных
                    }

                    switch (opts.input[key]) {
                        case 'input': {
                            //console.log('opts.category '+opts.category+'| '+'key '+key);
                            if ((opts.category == 'ok') && (key == 0)) { //категории возможны и это первый элемент массива input
                                if (flag) {
                                    rtvar += '<td><div class="content_spisok2">' +
                                        '<div class="spisok" >' +
                                        '<a href="#">+</a>' +
                                        '</div>' +
                                        '<div class="input_spisok">' +
                                        '<input class="ft" placeholder="' + placeholdersId + '"  name="' + value + '" id="' + iDi + '" value=' + category[value] + '></input>' +
                                        '</div>' +
                                        '</div></td>';
                                } else {
                                    rtvar += '<td>' +
                                        '<div class="content_spisok_subtwo">' +
                                        '<input class="ft" placeholder="' + placeholdersId + '"  name="' + value + '" id="' + iDi + '" value=' + category[value] + '></input>' +
                                        '</div>' +
                                        '</td>';
                                }
                            }
                            if ((opts.category == 'ok') && (key > 0)) { //категории возможны и это второй и > элемент массива input
                                rtvar += '<td><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="' + iDi + '"  value=' + category[value] + '></input></td>';
                            }
                            if (opts.category == 'nou') { // категории запрещены
                                rtvar += '<td><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="' + iDi + '"  value=' + category[value] + '></input></td>';
                            }
                            break;
                        }
                        case 'textarea'  : {
                            if ((opts.category == 'ok') && (key == 0)) { //категории возможны и это первый элемент массива input
                                if (flag) {
                                    rtvar += '<td><div class="content_spisok2">' +
                                        '<div class="spisok" >' +
                                        '<a href="#">+</a>' +
                                        '</div>' +
                                        '<div class="input_spisok">' +
                                        '<textarea placeholder="' + placeholdersId + '" name="' + value + '" id="' + iDi + '" class="ft" >' + category[value] + '</textarea>' +
                                        '</div>' +
                                        '</div></td>';

                                } else {
                                    rtvar += '<td>' +
                                        '<div class="content_spisok_subtwo">' +
                                        '<input class="ft" placeholder="' + placeholdersId + '"  name="' + value + '" id="' + iDi + '" value=' + category[value] + '></input>' +
                                        '</div>' +
                                        '</td>';
                                }


                            }
                            if ((opts.category == 'ok') && (key > 0)) { //категории возможны и это второй и > элемент массива input
                                rtvar += '<td><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="' + iDi + '" class="ft" >' + category[value] + '</textarea></td>';
                            }

                            if (opts.category == 'nou') { // категории запрещены
                                rtvar += '<td><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="' + iDi + '" class="ft" >' + category[value] + '</textarea></td>';
                            }
                            break;
                        }

                        default: { // проверка на правильность наименования типов
                            //flag = true;
                            // typeInputFalse = true; // Не верно указаны типы полей
                        }

                    }

                });

            }

            if (category != null) {

                rtvar += '<td style="border: 0px" id=' + category.id + ' ></td>';
                rtvar += '</tr>';
            }

            if (category == null) { // Вывод пустой строки категорий
                rtvar = '<tr id="new_so_' + (flag ? iDi : idCat) + '" data-sub-cat="new" data-cat="' + iDi + '"  style="display: none;" data-tr-id="' + (flag ? idCat : idCat) + '" >';
                $.each(opts.name, function (key, value) {
                    let placeholdersId = '';
                    if (opts.placeholders[flag ? 1 : 2] != null) {
                        placeholdersId = opts.placeholders[flag ? 1 : 2][key];
                        if (placeholdersId == undefined) {
                            placeholdersId = '';
                        }
                    }
                    switch (opts.input[key]) {
                        case 'input': {
                            if ((opts.category == 'ok') && (key == 0)) { // Первая ячейка
                                if (flag) { // Подкатегория, выводим без "+"
                                    rtvar += '<td><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="new_' + value + '_' + iDi + '" ></input></td>';
                                } else { // Субкатегория, выводим со знаком субкатегории
                                    rtvar += '<td><div class="content_spisok_subtwo"><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="new_' + value + '_' + iDi + '" ></input></div></td>';
                                }
                            }

                            if ((opts.category == 'ok') && (key > 0)) { //категории возможны и это второй и > элемент массива input
                                rtvar += '<td><input placeholder="' + placeholdersId + '" class="ft" name="' + value + '" id="' + iDi + '"  value=' + category[value] + '></input></td>';
                            }
                            break;
                        }
                        case 'textarea'  : {
                            if ((opts.category == 'ok') && (key == 0)) {
                                if (flag) {
                                    rtvar += '<td><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="new_' + value + '_' + iDi + '" class="ft" ></textarea></td>';
                                } else {
                                    rtvar += '<td><div class="content_spisok_subtwo"><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="new_' + value + '_' + iDi + '" class="ft" ></textarea></div></td>';

                                }
                            }
                            if ((opts.category == 'ok') && (key > 0)) { //категории возможны и это второй и > элемент массива input
                                rtvar += '<td><textarea placeholder="' + placeholdersId + '" name="' + value + '" id="new_' + value + '_' + iDi + '" class="ft" ></textarea></td>';
                            }


                            break;
                        }

                    }

                });
                rtvar += '<td style="border: 0px" id="delete" ></td>';
                rtvar += '</tr>';

                //console.log(rtvars);

            }


            return rtvar;
        }


        function outerHeightTextArea() {
            $('textarea', $object).each(function (index, value) { // обходим все строки
                $(this).outerHeight(16).outerHeight(this.scrollHeight);
            });

        }


        /*
                $(document)
                    .on('input.textarea.ft', 'textarea.ft', function (e) {
                        $(this).outerHeight(16).outerHeight(this.scrollHeight);
                    });

                function outerHeightTextArea() {
                    // Срабатывает при начальной загрузке всех зарегистрированных таблиц на странице
                    $(table_name).each(function (index, value) { // обходим все таблицы
                        //console.log("*******************************");
                        var tab = $(this).attr('id');
                        $('#' + tab + ' textarea').each(function (index, value) { // обходим все строки

                            $(this).outerHeight(16).outerHeight(this.scrollHeight);
                            //console.log('#'+tab+' textarea'+ $(this).attr('placeholder')+' '+$(this).css('height'));
                        });
                    });
                }
        */

//**************************Заверщшение обработки переноса в поле textarea***********

        /*
                // удаление всех чекбоксов при вводе символов
                $(document).on('keydown input', 'input[class=ft], textarea[class=ft]', function () {
                    var table_id = $(this).closest('table').attr("id");
                    delete_header_table(true, table_id); // удаление в шапке

                    $('#' + table_id + ' tbody tr div.div_table_delete').remove(); // удаление в строках

                });
        */

        // Поиск событий для вновь добавленных элементов
        //$(function () {

        $(document).on('change.' + opts.url, 'table[id=' + opts.url + '] :input', function () { // не нажатое состояние
            var table_id = $(this).closest('table').attr("id");
            delete_header_table(true, table_id); // удаление в шапке
            var t = $(this);
            //myfunc(t);
            alert($(this).val());

        });
        //});

        // Добавление и обновление записи таблицы
        function myfunc(v) { // В v находится элемент input или textarea
            // Получаем id таблицы
            var table_id = v.closest('table').attr("id");
            var table_type = $('#' + table_id).attr('data-type-category');

            var id_i = v.attr('id');

            if (id_i == "new_name" || id_i == "new_desc") {
                //delete_header_table(true);
                id_i = undefined;
            }
            console.log(table_id);
            var token = $("meta[name='_csrf']").attr("content");
            var header = $("meta[name='_csrf_header']").attr("content");

            /*
                v.closest('table').attr("id") - находим id строки таблицы
               Определяем что редактирует пользователь
               1= редакрируется поле существующей категоири
               2= редактируется существующее поле подкатегории
               3= добавляется новая строка подкатегории
               0=
             */
            var identificator = testDataTableVendor(v.closest('tr').attr("id"));
            var obj; // объект для передачи данных

            switch (identificator) {
                case 1: {// Новое значение/категория
                    obj = dataNouCategoru(v);
                    break;
                }
                case 2: { // Редактирование значения/категории
                    if (table_type == "nou") { // значение строки
                        console.log("Меняем значение строки");
                        obj = dataNouCategoru(v);
                    }
                    if (table_type == "ok") { // категория
                        console.log("Меняем значение категории");
                        obj = dataCategoru(v);
                    }
                    break;
                }
                case 3: { // Редактирование категории
                    obj = dataCategoru(v);
                    console.log("Добавляем подкатегорию");
                    break;
                }
                case 4: {
                    console.log("Изменение подкатегории");
                    obj = dataCategoru(v);
                    break;
                }

                case 5: {
                    console.log("Добавляем субкатегорию");
                    obj = dataCategoru(v);
                    break;
                }
                case 6: {
                    console.log("Изменяем субкатегорию");
                    obj = dataCategoru(v);
                    break;
                }

            }

            //var obj = dataNouCategoru(v); // вызываем для новых или категорий без подкатегорий.
            console.log('Значение JSON');
            console.log(JSON.stringify(obj));

            $.ajax({
                type: "POST",
                url: table_id,
                data: JSON.stringify(obj),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: true,
                beforeSend: function (xhr) {

                    xhr.setRequestHeader(header, token);
                },
                success: function (res) {
                    if (res.validated) {
                        alert('Ошибка');
                        // Очищаем от всех ошибок
                        error_remove(table_id);
                        var val1 = "";
                        $.each(res.errorMessages, function (key, value) {
                            $("#data_td").remove();
                            val1 = val1 + value + '\r\n';
                        });

                        vokmar.error.message(val1, v);
                    } else {
                        $("#data_td").remove(); // Очищаем все ошибки
                        if (identificator == 1 && table_type == "nou") { // Для новой записи категорииale

                            v.attr('id', res.id); // Для поля name=name для input
                            $('#' + table_id + " textarea[id=new_desc]").attr('id', res.id); // Для name=name_desc
                            $('#' + table_id + ' tr td[id=delete]').attr('id', res.id); // id для ячейки
                            $('#' + table_id + ' tr[id=new_so]').attr('id', res.id); // id для строки

                            // Очищаем все элементы которыми удаляют строки: чекбоксы, ссылки в строках и шапке, кроме самой шапки
                            // При добавлении нововой строки это нужно, чтобы появились сразу все чекбоксы и ссылки
                            $('#' + table_id + ' tr td[id]:not(#hed)').empty();
                            $('#' + table_id + ' thead tr a').empty();


                            // Очищаем от всех ошибок
                            error_remove(table_id);

                            // Временные id new  и  delete для их дальнейшей перезаписи
                            $('#' + table_id).append(
                                '<tr id="new_so">' +
                                '<td><input id="new_name" placeholder="Новое значение..." class=ft  type=text value="" name="name"/>' +
                                '<td><textarea id="new_desc" placeholder="Новое описание..." rows="1" class=ft name="desc"></textarea></td>' +
                                '<td style="border: 0px" id=delete></td>' +
                                '</tr>');


                        }

                        if ((identificator == 1 || 3 || 5) && table_type == "ok") { // Для редактирования строк подкатегории
                            //alert(identificator);
                            podCategory(table_id, res, v, identificator);
                        }

                    }
                },
                error: function (jqxhr, status, errorMsg) {

                    console.log("Статус: " + status + " Ошибка: " + errorMsg + "  Объект: " + jqxhr);
                    console.log(jqxhr);
                    console.log("Статус");
                    console.log(status);
                    console.log("Ошибка");
                    console.log(errorMsg);
                }
            });

        } //конец функции


        // Обработка категории если
        // 1 Новая категория
        // 2 Категория без подкатегорий
        // Возвращаемое значение объект новой/измененной (без подкатегорий) категории
        function dataNouCategoru(v) {
            // Получаем id таблицы
            var table_id = v.closest('table').attr("id");
            var id_i = v.attr('id');
            //console.log(v);
            console.log("id в начале " + id_i);

            var name_i = $("#" + table_id + " input[name=name][id=" + v.attr('id') + "]").val();
            //console.log("Значение name в начале " + name_i);
            var desc = $("#" + table_id + " textarea[name=desc][id=" + v.attr('id') + "]").val();
            if (desc == undefined) { // В поле desc был введен текс=>name_i=null=>вводится поле name_i=>подхватываем текс в поле desc
                var desc = $("#" + table_id + " textarea[name=desc][id=new_desc]").val();
            }
            // console.log("Значение desc в начале " + desc);

            if (id_i == "new_name" || id_i == "new_desc") {
                //delete_header_table(true);
                id_i = undefined;
            }


            var obj = {
                id: id_i,
                name: name_i,
                desc: desc,
                validated: true,
                errorMessages: null

            }


            return obj;
        }

// Обработка подкатегорий, создание объекта для отправки
        function dataCategoru(v) { // v - текущая строка подкатегории
            // Получаем id таблицы
            var table_id = v.closest('table').attr("id");

            var testUpdeteSubTwoCategoru = /^([0-9]+)_([0-9]+)_([0-9]+)$/;
            var testNewSubTwoCategoru = /^[a-z]{3}_[a-z]{4}_([0-9]+)_([0-9]+)$/; // проверка новой субкатегории new_name_123_235 - добавляется новая строка субкатегории
            var testNewSubCategoru = /^[a-z]{3}_[a-z]{4}_([0-9]+)$/; // проверка новой строки подкатегории new_name_123 - добавляется новая строка подкатегории
            var testUpdeteSubCategoru = /^([0-9]+)_([0-9]+)$/; // проверка существующей строки - изменяется подкатегория
            var testUpdeteCategoru = /^([0-9]+)$/ // проверка категории - если редактируется категория

            var str = $(v).attr('id'); // id или из input или из textarea
            // Добавляется новая строка подкатегории
            var resultNewCategoru = testNewSubCategoru.exec(str);//result[1]  - номер категории
            // Редактируется существующая категория
            var resultCategoru = testUpdeteCategoru.exec(str);

            // Редактируется существующая подкатегория
            var resultUpdeteSubCategoru = testUpdeteSubCategoru.exec(str);
            // ДОбавляется новая субкатегория
            var resultNewSubTwoCategoru = testNewSubTwoCategoru.exec(str);
            var resultUpdeteSubTwoCategoru = testUpdeteSubTwoCategoru.exec(str);

            var category;

            // Обновляем значение категории
            if (resultCategoru != null) {
                category = eachCategory(table_id, v.attr('id'), false);
            }

            // Обрабатываем добавление новой строки подкатегории
            if (resultNewCategoru != null) { // null если не соответсвует тесту (не новая или изменяемая категория)
                // получаем объект категория + подкатегории включая новую строку
                console.log('НОВАЯ ПОДКАТЕГОрия');
                category = eachCategory(table_id, resultNewCategoru[1], true, false, null);

            }

            // Обрабатываем обновление строк подкатегории
            if (resultUpdeteSubCategoru != null) {

                category = eachCategory(table_id, resultUpdeteSubCategoru[2], false, false, null);

            }


            if (resultNewSubTwoCategoru != null) {
                //alert('Добавляем новую субкатегорию' + resultUpdeteSubTwoCategoru);
                //resultUpdeteSubTwoCategoru[2] - id категории
                category = eachCategory(table_id, resultNewSubTwoCategoru[2], false, true, resultNewSubTwoCategoru[1]);
            }

            if (resultUpdeteSubTwoCategoru != null) {
                //alert('Редактируем сущ. субкатегорию' + resultUpdeteSubTwoCategoru);
                //resultUpdeteSubTwoCategoru[2] - id категории
                category = eachCategory(table_id, resultUpdeteSubTwoCategoru[3], false, resultUpdeteSubTwoCategoru[2], 'updete');
            }


            console.log(category); // Идентичны

            return category;

        }

        /*
        Функция осуществляет выбор данных конкретной категории
        Возвращает объект состоящий из категории и подкатегорий
         */
        function eachCategory(table_id, Categoru_id, flag, flag2, flag3) {


            if (flag) { // Только для добавления новой строки
                // Выборка данных у новой строки
                // Формирование данных объекта в части subcategory: [{id:1}]....
                var id_new = undefined; // Используется для новой строки
                var name_new = $("#" + table_id + " input[name=name][id=new_name_" + Categoru_id + "]").val(); // Значение подкатегории name текущей строки v
                var desc_new = $("#" + table_id + " textarea[name=desc][id=new_desc_" + Categoru_id + "]").val(); // Значение подкатегории desc текущей строки v
                //alert(name_new + " " + desc_new);
            }
            var category;

            // Получаем категорию, передаем любой объект имеющий нужный id
            //console.log("Передаваемый id " + Categoru_id);
            //console.log("Передаваемый id подкатегории " + flag3);
            category = dataNouCategoru($("#" + table_id + " tr[id=" + Categoru_id + "]"));
            //console.log("Данные категории :");
            //console.log(category);
            //Получаем все подкатегории фильтр _125; _659; - нижнее подчеркивание + id категории, кроме последней новой строки включая все input[type=text]
            // В данный массив будут включены также субкатегории
            var obgekt = $("#" + table_id + " input[id $=_" + Categoru_id + "]:not(:last):not(input[type !=text])");
            //console.log("Данные под категории :");
            // console.log(obgekt);


            var newCategory = []; // Массив подкатегорий в т.ч. новой строки
            var newSubTwoCategory = []; // Массив подкатегорий в т.ч. новой строки
            // Добавляем в массив подкатегорий все существующие строки
            if (obgekt.length != 0) {

                obgekt.each(function (index, value) { // проходим по всем существующим строкам и добавляем их в массив

                    var valu = $(this).val();
                    var ids = $(this).attr("id");
                    var ig = testDataTableVendor(ids);
                    // console.log("тест " + ids);
                    //console.log(ig);
                    if (ig == 4) {
                        //console.log('Только подкатегория');
                        //console.log("Элемент "+index+" id:"+$(this).attr("id")+"  тип "+$(this).localName);
                        var obj = {
                            id: ids.split('_')[0],
                            name: $(this).val(),
                            desc: $("#" + table_id + " textarea[name=desc][id=" + ids + "]").val(),
                            validated: true,
                            errorMessages: null,
                            subtwocategory: undefined
                        }
                        //console.log("Сохраняемая в массив подкатегория :");
                        //console.log(obj);
                        newCategory.push(obj);
                    }
                    //Обработка новых строк субкатегорй
                    //console.log($(this).data('sub-two-category'));
                    if ($(this).data('sub-two-category')) {
                        var abj12;
                        //console.log('Суб категория ');
                        var idsubcat = $(this).attr('id').split('_')[2];// id категории
                        var idso = $(this).attr('id').split('_')[1];// id под категории
                        var idsubtwo = idsubcat + '_' + $(this).attr('id').split('_')[3]; // id категории
                        var id_new1;
                        var name_new1;
                        var desc_new1;
                        if (flag2) { // Если новая строка
                            //console.log('Суб категория новая строка');
                            id_new1 = undefined; // Используется для новой строки
                            name_new1 = $("#" + table_id + " input[name=name][id=new_name_" + idsubtwo + "]").val(); // Значение подкатегории name текущей строки v
                            desc_new1 = $("#" + table_id + " textarea[name=desc][id=new_desc_" + idsubtwo + "]").val(); // Значение подкатегории desc текущей строки v
                            console.log('Обрабатываем новую. суб. кат  id=' + id_new1 + ' name=' + name_new1 + " desc=" + desc_new1);
                        }
                        if (ig == 6) { // Редактирование сущ. суб категории
                            //alert('Записываем сущ. категорию');
                            id_new1 = ids.split('_')[0],
                                name_new1 = $(this).val();
                            desc_new1 = $("#" + table_id + " textarea[name=desc][id=" + ids + "]").val(); // Значение подкатегории desc текущей строки v

                            abj12 = {
                                id: id_new1,
                                name: name_new1,
                                desc: desc_new1,
                                validated: true,
                                errorMessages: null
                            };
                            newCategory.forEach(function (value12, index, arr) {

                                if (idso == value12.id) { // Сравниваем id под категорий

                                    if (value12.subtwocategory != undefined) {
                                        value12.subtwocategory.push(abj12);
                                    } else {
                                        value12.subtwocategory = [];
                                        value12.subtwocategory.push(abj12);
                                    }
                                }
                            });
                        }

                        if (flag2) { // Добавление первой новой суб категории
                            abj12 = {
                                id: id_new1,
                                name: name_new1,
                                desc: desc_new1,
                                validated: true,
                                errorMessages: null
                            };

                            var one_new = $(this).closest('tr').attr("id"); // Получаем id текущей строки
                            var test_id = testDataTableVendor(one_new);
                            console.log('ПРОВЕРКА');
                            console.log(one_new);
                            console.log(test_id);


                            var test_new = true;
                            newCategory.forEach(function (subCatVal, index, arr) {
                                if (subCatVal.id === flag3) {// Определяем подкатегорию flag3 - та подкотегория в которой происходит добавление

                                    if (subCatVal.subtwocategory == undefined) {
                                        //alert('Добавляю новую суб катеогоию тут');
                                        subCatVal.subtwocategory = [];
                                        subCatVal.subtwocategory.push(abj12);
                                        test_new = false;
                                    }

                                    /* Записываем новую строку при существующих субкатегориях
                                    Условия:
                                    количество субкатеогрий больше 0
                                    субкатегория проходит тест как новая строка субкатеогории, идентификатор 5
                                    запись производится только один раз index + 1 == arr.length
                                    исключаем дублирование при записи первой субкатегории
                                 */
                                    if (subCatVal.subtwocategory.length > 0 && test_id == 5 && index + 1 == arr.length && test_new) {

                                        new_twoCat = {
                                            id: undefined,
                                            name: $("#" + table_id + " input[name=name][id=new_name_" + subCatVal.id + "_" + Categoru_id + "]").val(),
                                            desc: $("#" + table_id + " textarea[name=desc][id=new_desc_" + subCatVal.id + "_" + Categoru_id + "]").val(),
                                            validated: true,
                                            errorMessages: null
                                        };
                                        subCatVal.subtwocategory.push(new_twoCat);
                                    }

                                }
                            });

                        } // конец добавления новой первой суб категории
                    }


                });


            }

            if (flag) { // Только для редактирования
                // Добавляем в массив подкатегорий новую категорию
                newCategory.push({
                    id: id_new,
                    name: name_new,
                    desc: desc_new,
                    validated: true,
                    errorMessages: null
                    //subtwocategory: undefined
                });

            }


            console.log('Результат:');
            category.subcategory = newCategory;

            console.log(category);


            return category;


        }


        // Определение какой тип данных редакрируется, добавляется

        function testDataTableVendor(id_data) {
            var test2 = /^[0-9]+$/; // id  состоит из одного значения id=1 | id=598 ...... (для существующей категоири)
            var test4 = /^[0-9]+_[0-9]+$/; // id состоит из двух значений id=1_1 | id=3_1 ..... (для существующей подкатегории)
            var test1 = /new_so?$/; // id новой строки категории id=new_so  (для новой строки категории)
            var test3 = /^new_so_([0-9]+)$/; // id новой строки подкатегории id=new_so_1 | id=new_so_256 (для новой строки подкатегории)
            var test5 = /^new_so_([0-9]+)_([0-9]+)$/; // id новой строки суб категории id=new_so_1_3 |  id=new_so_1_3 (для новой строки суб категории)
            var test6 = /^([0-9]+)_([0-9]+)_([0-9]+)$/; // id существующей субкатегории

            var identificator;
            if (test1.test(id_data)) {
                //alert("Новое значение");
                identificator = 1;
            }

            if (test2.test(id_data)) {
                //alert("Изменение значения/категории");
                identificator = 2;
            }

            if (test3.test(id_data)) {
                //alert("Новая подкатегория");
                identificator = 3;
            }

            if (test4.test(id_data)) {
                //alert("Изменение подкатегории");
                identificator = 4;
            }

            if (test5.test(id_data)) {
                //alert("Новая субкатегории");
                identificator = 5;
            }

            if (test6.test(id_data)) {
                //alert("Изменение субкатегории");
                identificator = 6;
            }

            return identificator;
        }

        // Выводим подкатегории и подкатегорий
        function podCategory(table_id, res, v, catecory) {


            if (catecory == 1) { // Выводим знак + только при добавлении категории
                ///alert("Редактируем категорию");
                // добавляем перед input контейнер со знаокм
                $(v).before('<div class="spisok" id=' + res.id + '><a href="#">+</a></div>');
                // Обертываем input в контейнер
                $(v).wrap('<div class="input_spisok"></div>');


                /*
                * Переименовываем бывшую строку в данные id добавленной записи
                * */


                v.attr('id', res.id); // Меняем id для input
                $('#' + table_id + " textarea[id=new_desc]").attr('id', res.id); // Меняем id для textarea
                $('#' + table_id + ' tr td[id=delete]').attr('id', res.id); // id для ячейки
                $('#' + table_id + ' tr[id=new_so]').attr('id', res.id); // меняем id для строки


                // добавляем скрытую строку к вновь добавленной категории, чтобы по + появлялась новая строка
                $('#' + table_id).append(
                    '<tr id=new_so_' + res.id + ' style="display: none;" data-tr-id=' + res.id + ' >' +
                    '<td><input id=new_name_' + res.id + ' placeholder="Новое значение..." class=ft  type=text value="" name="name"/>' +
                    '<td><textarea  id=new_desc_' + res.id + '  placeholder="Новое описание..." rows="1" class=ft name="desc"></textarea></td>' +
                    '<td style="border: 0px"  id=delete_' + res.id + '></td>' +
                    '</tr>');


                // Очищаем все элементы которыми удаляют строки: чекбоксы, ссылки в строках и шапке, кроме самой шапки
                // При добавлении вовой строки это нужно, чтобы появились сразу все чекбоксы и ссылки
                $('#' + table_id + ' tr td[id]:not(#hed)').empty();
                $('#' + table_id + ' thead tr a').empty();
                // Очищаем от всех ошибок
                error_remove(table_id);

                // Временные id new  и  delete для их дальнейшей перезаписи
                $('#' + table_id).append(
                    '<tr id="new_so">' +
                    '<td><input id="new_name" placeholder="Новая категория..." class=ft  type=text value="" name="name"/>' +
                    '<td><textarea id="new_desc" placeholder="Новое описание..." rows="1" class=ft name="desc"></textarea></td>' +
                    '<td style="border: 0px" id=delete></td>' +
                    '</tr>');

            }

// Обработка вывода новых субкатегорий
            if (catecory == 3) {
                //alert("Редактируем подкатегорию");
                var test0 = /^new_name_([0-9]+)$/;
                var id_cat = test0.exec($(v).attr("id"));
                var trObg = v.closest('tr'); //  Получаем строку относящуюся к полям ввода

                //console.log("Объект с сервера: ")
                //console.log(res);
                var iy = res.subcategory.length; // Количество элементов подкатегории
                // Переименовываем строку, устанавливаем необходимый id
                $('#' + table_id + " tr[id=new_so_" + id_cat[1] + "]").attr('id', res.subcategory[iy - 1].id + "_" + id_cat[1]);
                v.attr('id', res.subcategory[iy - 1].id + "_" + id_cat[1]); // Меняем id для input

                $('#' + table_id + " textarea[id=new_desc_" + id_cat[1] + "]").attr('id', res.subcategory[iy - 1].id + "_" + id_cat[1]); // Меняем id для textarea
                // Выбираем ячейку с id delete_456 (id- категориии) и меняем у этой строки id ячейки на id - подкатегории
                // Это позволяет у добавляемых подкатегорий отбражать checked сразу
                $('#' + table_id + ' tr td[id=delete_' + id_cat[1] + ']').attr('id', res.subcategory[iy - 1].id);


                // добавляем скрытую строку к вновь добавленной категории, чтобы по + появлялась новая строка
                $('#' + table_id + " tr[id=" + res.subcategory[iy - 1].id + "_" + id_cat[1] + "]").after(
                    '<tr id=new_so_' + res.id + '  data-tr-id=' + res.id + ' >' +
                    '<td><input id=new_name_' + res.id + ' placeholder="Новая подкатегория..." class=ft  type=text value="" name="name"/>' +
                    '<td><textarea  id=new_desc_' + res.id + '  placeholder="Новое описание..." rows="1" class=ft name="desc"></textarea></td>' +
                    '<td style="border: 0px"  id=delete_' + res.id + '></td>' +
                    '</tr>');

                // Выводить субкатегории нужно после подкатегории, чтобы был правильный порядок строк.
                // Доюавляем/меняем значение идентификатор подкатегории data-sub-cat
                trObg.attr('data-sub-cat', res.subcategory[iy - 1].id);
                // Если таблица с суб категориями, выводим знак +
                //console.log('data-sub-category');
                //console.log($('#' + table_id).data('sub-category'));
                if ($('#' + table_id).data('sub-category') == 2) {
                    //console.log('Отправляем на декорацию');
                    decorElemCount(trObg);
                }


            }
            // Обработка вывода новых субкатегорий
            if (catecory == 5) {
                //alert('Обновляем значение субкатегории');
                console.log('Данные с сервера');
                console.log(res);


                // Из массива категорий выбираем те, у которых subtwocategory больше 0
                res.subcategory.forEach(function (value) {
                    /*Меняем
                    id и data-tr-id:  c new_so_459_45 и 459_45 на 14_459_45 и 14_459_45
                     */
                    if (value.subtwocategory != null) {

                        // Выполняем корректровку и добавление новой строки только к той которую редактировал пользователь
                        if (v.attr('id') == ('new_name_' + value.id + '_' + res.id)) {
                            // Получаем последний элемент, он же является новым добавленным элементом
                            var last_obgect = value.subtwocategory[value.subtwocategory.length - 1];
                            // Меняем id строки
                            $('tr[id=new_so_' + value.id + '_' + res.id + ']', '#' + table_id).attr(
                                {
                                    'id': last_obgect.id + '_' + value.id + '_' + res.id,
                                    'data-tr-id': value.id + '_' + res.id,
                                    'data-sub-two-category': last_obgect.id + '_' + value.id + '_' + res.id
                                });
                            // Меняем id содержимого первой ячейки
                            $('[id=new_name_' + value.id + '_' + res.id + ']', '#' + table_id).attr({'id': last_obgect.id + '_' + value.id + '_' + res.id});

                            // Меняем id содержимого второй ячейки
                            $('[id=new_desc_' + value.id + '_' + res.id + ']', '#' + table_id).attr({'id': last_obgect.id + '_' + value.id + '_' + res.id});
                            // Меняем id содержимого последней ячейки (в ней хранится чекбокс на удаление)
                            $('[id=delete_' + value.id + '_' + res.id + ']', '#' + table_id).attr({'id': last_obgect.id + '_' + value.id + '_' + res.id});

                            // Добавляем новую строку при добавдени новой субкатегории
                            $("tr[id=" + last_obgect.id + "_" + value.id + "_" + res.id + "]", '#' + table_id).after('<tr style="" data-tr-id=' + value.id + "_" + res.id + ' id=new_so_' + value.id + "_" + res.id + '>' +
                                '<td><div class="content_spisok_subtwo"><input class=ft name="name" placeholder="Значение..." data-sub-two-category="name"  id=new_name_' + value.id + "_" + res.id + ' type=text value=""/></div> </td>' +
                                '<td><textarea class=ft data-min-rows="1" name="desc" data-sub-two-category="desc" placeholder="Описание..." rows="1"' +
                                'id=new_desc_' + value.id + "_" + res.id + '></textarea></td>' +
                                '<td style="border: 0px" id=delete_' + value.id + "_" + res.id + '></td></tr>'
                            );
                        }
                    }
                });


            }
        }

        /*
                // Обработка вывода кнопки удалить и чекбоксов
                $(document).on({
                        'mouseenter': function (e) {
                            // Выполняем действия толко для конкретной таблицы, список этих таблиц указан в переменной
                            var tab_id_mouseenter = $(this).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие

                            insert_checbox(tab_id_mouseenter); // При наведении на строку, вставляем чекбокс, за ним идет ссылка с картинкой
                            if ($('#' + tab_id_mouseenter + ' tr :checkbox:checked').length < 1) { // если выбран больше 1 checkbox, не выводим единичное удаление
                                insert_lable_delete(this);

                            }
                        },
                        'mouseleave': function (e) {
                            // В текущей строке $(this) находим ссылку с идентификатором on_delete_vendor и удаляем ее
                            $(this).find('a[id=on_delete_vendor]').remove();

                        }
                    },
                    table_name_on); // конец обработки события
        */

        /*

                var timeOut_table;
                // Обработка событий таблицы
                $(document).on({
                        'mouseenter': function () {
                            timeOut_table = 0;
                        },
                        'mouseleave': function () {
                            // Очищаем все элементы которыми удаляют строки: чекбоксы, ссылки в строках и шапке кроме самой шапки
                            var tab_id_mouseenter = $(this).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие

                            if ($('#' + tab_id_mouseenter + ' tr :checkbox:checked').length < 1) {
                                delete_header_table(false, tab_id_mouseenter);


                                clearTimeout(timeOut_table);
                                timeOut_table = setTimeout(function () {
                                    delete_header_table(false, tab_id_mouseenter);

                                    $('#' + tab_id_mouseenter + ' tbody tr div.div_table_delete').remove();

                                }, 500);
                            }

                        }
                    },
                    table_name); //Конец обработки table_name - строки таблицы

        */

        /*
                // Обработка нажатия checkbox в шапке таблицы
                $(document).on('click', table_name1 + ' #del_all_header, ' + table_name2 + ' #del_all_header', function (e) {
                    var tab_id_mouseenter = $(this).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие


                    if ($(this).is(':checked')) { // если нажат
                        $('#' + tab_id_mouseenter + ' tbody input[type=checkbox]').prop('checked', true);

                    } else { // если снят
                        $('#' + tab_id_mouseenter + ' tbody input[type=checkbox]').prop('checked', false);
                    }
                });

        */

        /*
        // Обрабока нажатия чекбоксов в теле таблицы (кроме шапки)
                $(document).on('click', table_name_on_click, function (e) {

                        var tab_id_mouseenter = $(this).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие
                        var col_ceh = 0; // общее количество heckbox у строк, кроме шапки

                        $('#' + tab_id_mouseenter + ' tbody tr input[type=checkbox]').each(function (index, value) {
                            col_ceh = col_ceh + 1;
                        });

                        // Выбраны все чекбоксы
                        if ($('#' + tab_id_mouseenter + ' tbody tr :checkbox:checked').length == col_ceh) {
                            $('#' + tab_id_mouseenter + '  thead tr input[type=checkbox]').prop('checked', true);
                        }

                        // Выбрано несколько чекбоксов
                        if ($('#' + tab_id_mouseenter + ' tbody tr :checkbox:checked').length < col_ceh) {

                            // Очистка шапки от элементов
                            delete_header_table(true, tab_id_mouseenter);


                            //Вставляем в шапку ссылку на удаление нескольких строк
                            $('#' + tab_id_mouseenter + ' thead tr').append("<div class='div_table_delete'></div>");
                            $('#' + tab_id_mouseenter + ' thead tr div.div_table_delete').append("<input class='cehed_all_delete_a' id=del_all_header type=checkbox> <label  for=del_all_header></label>");
                            $('#' + tab_id_mouseenter + ' thead tr div.div_table_delete').append('<a id=on_delete_all_vendor href="#">' +
                                '<img src="../../resources/image/delete_str.png" width="20" \n' +
                                '  height="12" alt="Удалить"></a>');


                        }
                        // Если не выбрано ни одного чекбокса
                        if ($('#' + tab_id_mouseenter + ' tr :checkbox:checked').length == 0) {
                            // Очистка шапки от элементов
                            delete_header_table(false, tab_id_mouseenter);
                            // добавляем боковую сылку на данную строку
                            insert_lable_delete(this);
                        }

                        col_ceh = 0;


                    }
                );
        */

// Функция очищает
        function delete_header_table(flag, tab_id_mouseenter) {

            $('#' + tab_id_mouseenter + ' thead tr div.div_table_delete').remove();
            if (flag) {
                // Очищаем боковую ссылку удаления строк
                $('#' + tab_id_mouseenter + ' tr td[id] a[id]').empty();

            }
        }

        /*
        // Обработка нажатия на ссылку удаляющую несколько строк или одну строку
                $(document).on("click", '#on_delete_all_vendor, #on_delete_vendor', function (e) {
                    var tab_id_mouseenter = $(this).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие

                    var checked = []; // массив удаляемых категорий
                    var checked1 = []; // массив удаляемых подкатегорий
                    var checked2 = []; // массив удаляемых субкатегорий
                    var checkboxData = []; // массив для хранения всех нажатых чекбоксов
                    if ($('#' + tab_id_mouseenter + ' tbody tr :checkbox:checked').length == 0) { // Обработка щелчка по ссылке

                        if (testDataTableVendor($(this).closest('tr').attr("id")) == 2) { // щелчек на удаление категории
                            //alert(this);
                            var arrData = hrefCategoryDelete(this, checkboxData); // checkboxData == 0
                            checked = arrData[0];
                            console.log('Удаляемая категория ');
                            console.log(checked); // Нажатие на одиночную ссылку для удаления категоиии и подкатегорий
                            deleteAll_Id(checked, tab_id_mouseenter);
                            if (arrData[1] != null && arrData[1].length > 0) { // Удаление подкатегорий
                                checked1 = arrData[1];
                                console.log('Удаляемые под категория ');
                                console.log(checked1); // Нажатие на одиночную ссылку для удаления подкатегорий
                                deleteAll_Id(checked1, 'subcategory');
                            }
                            if (arrData[2] != null && arrData[2].length > 0) { // Удаление субкатегорий
                                checked2 = arrData[2];
                                console.log('Удаляемые суб категории ');
                                console.log(checked2); // Нажатие на одиночную ссылку для удаления подкатегорий
                                deleteAll_Id(checked2, 'subtwocategory');
                            }
                        }
                        if (testDataTableVendor($(this).closest('tr').attr("id")) == 4) { // щелчек на удалени подкатегории
                            //alert(this);
                            var arrData = hrefCategoryDelete(this, checkboxData);
                            console.log('Входной массив');
                            console.log(arrData);
                            checked1 = arrData[1];
                            console.log('Удаляемые под категория одиночная ');
                            console.log(checked1); // Нажатие на одиночную ссылку для удаления подкатегорий
                            deleteAll_Id(checked1, 'subcategory');

                            if (arrData[2] != null && arrData[2].length > 0) { // Удаление субкатегорий
                                checked2 = arrData[2];
                                console.log('Удаляемые суб категории ');
                                console.log(checked2); // Нажатие на одиночную ссылку для удаления подкатегорий
                                deleteAll_Id(checked2, 'subtwocategory');
                            }
                        }
                        if (testDataTableVendor($(this).closest('tr').attr("id")) == 6) { // щелчек на удалени субкатегории
                            // alert("Удаляем субкатегорию");
                            //alert(this);
                            var arrData = hrefCategoryDelete(this, checkboxData);
                            if (arrData[2] != null && arrData[2].length > 0) { // Удаление субкатегорий
                                checked2 = arrData[2];
                                console.log('Удаляемая суб категория ');
                                console.log(checked2); // Нажатие на одиночную ссылку для удаления подкатегорий
                                deleteAll_Id(checked2, 'subtwocategory');
                            }
                        }


                    } else { // щелчек на чекбоксах
                        $('#' + tab_id_mouseenter + ' tbody tr :checkbox:checked').each(function () { //Создаем массив для удобства обработки
                            checkboxData.push($(this).closest('tr').attr("id")); // Собираем все id нажатых элементов строк в массив
                        });
                        var arrData = hrefCategoryDelete(this, checkboxData); // получаем массив из 2-х элементов

                        //console.log('Входной массив');
                        //console.log(arrData);

                        //arrData[категория, второй, третий]
                        if (arrData[0] != null && arrData[0].length > 0) { // Проверяем категорию
                            checked = arrData[0];
                            deleteAll_Id(checked, tab_id_mouseenter);
                        }
                        //arrData[первый, подкатегория, третий]
                        if (arrData[1] != null && arrData[1].length > 0) { // Проверяем подкатегорию
                            checked1 = arrData[1];
                            deleteAll_Id(checked1, 'subcategory');
                        }

                        //arrData[первый, второй, субкатегория]
                        if (arrData[2] != null && arrData[2].length > 0) { // Проверяем подкатегорию
                            checked2 = arrData[2];
                            deleteAll_Id(checked2, 'subtwocategory');
                        }

                    }
                    //console.log(checked);

                    $('#' + tab_id_mouseenter + ' thead tr input:checked').prop('checked', false);
                    $('#' + tab_id_mouseenter + ' thead tr input[type=checkbox]').remove(); // очищаем чекбокс в шапке
                    $('#' + tab_id_mouseenter + ' thead tr a').remove(); // очищаем ссылку в шапке

                    vokmar.error.remove(); // при удалении строки(строк) очищаем все сообщения об ошибке, выделения ошибо остаются
                });
        */

        // Обработка нажатия одиночной ссылки
        // Функция определяет у стрки является ли она категорией или подкатегорией
        // Возвращается или список удаляемых подкатегорий или вся категория со списокм удаляемых подкатегрий
        function hrefCategoryDelete(t, arrData) {  // t - ссылка на объект таблицы arrdata - массив удаляемых категорий и подкатегорий
            var tab_id_mouseenter = $(t).closest('table').attr("id");
            //console.log('tab_id_mouseenter '+tab_id_mouseenter);
            var testObgect1 = []; // Категория
            var testObgect2 = []; // Подкатегория
            var testObgect3 = []; // Субкатегория
            var arrayObject = []; // Общий массив для отправки
            // console.log(arrData.length);
            if (arrData.length > 0) { // Если массив >0 значит были выбраны чекбоксы
                //console.log('arrData ' + arrData);

                arrData.forEach(function (elem) {
                    //console.log('эудаляемый элемент');
                    //console.log(elem);
                    var testIds = testDataTableVendor(elem); // Может быть 2 значения: 2 - категория; 4 - подкатегоия
                    //console.log('тип удаляемого элемента');
                    //console.log(testIds);

                    if (testIds == 4) { // элемент является подкатегорией
                        testObgect2.push({id: elem.split('_')[0]}); // Выбираем id подкатегории
                        var dataObject = $('tr', '#' + tab_id_mouseenter).filter('[id $=' + elem + ']:not([id ^=new_so])');
                        dataObject.each(function (index, value) { // Сохраняем все id подкатегорий
                            if (testDataTableVendor($(this).attr('id')) == 6) {
                                testObgect3.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id субкатегории (testObgect3)
                            }
                        });
                    }

                    if (testIds == 2) { // элемент является категорией
                        // Выбираем категорию и все его подкатегории и субкатегории
                        var dataObject = $('tr', '#' + tab_id_mouseenter).filter('[id $=' + elem + ']:not([id ^=new_so])');
                        testObgect1.push({id: elem}); // Сохраняем id категории

                        dataObject.each(function (index, value) { // Сохраняем все id подкатегорий

                            if (testDataTableVendor($(this).attr('id')) == 4) {
                                testObgect2.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id подкатегории (testObgect2)
                            }
                            if (testDataTableVendor($(this).attr('id')) == 6) {
                                testObgect3.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id субкатегории (testObgect3)
                            }

                        });
                    }

                    if (testIds == 6) { // элемент является субкатегорией
                        testObgect3.push({id: elem.split('_')[0]}); // Выбираем id субкатегории (testObgect3)
                    }

                });

                arrayObject.push(testObgect1);
                arrayObject.push(testObgect2);
                arrayObject.push(testObgect3);

            } else { // иначе значит был щелчек на одиночной ссылки категори или подкатегории
                //console.log('Одиночная ссылка');
                //console.log('arrData ' + null);

                // Определение, что выбрано категория или подкатегория
                // Определяем тип id
                // 325 - категрия
                // 256_325 - подкатегория
                // 256_325_12 - субкатогория
                var id_tr = $(t).closest('tr').attr("id");
                var tab_id = id_tr; // Если выбрали категорию, будет 1 значение, если подкатеорию 2 значения 12_45, если суб категория 3 значения 12_45_56
                // console.log('tab_id '+tab_id);
                var testId = testDataTableVendor(tab_id); // Может быть 2 значения: 2 - категория; 4 - подкатегоия; 6 - субкатегория
                //console.log('testId ' + testId);

                // Объект для храниния категории со всеми подэлементами или подкатегории со всеми подэлементами или субкатегорий
                var dataObject;

                console.log(tab_id);

                switch (testId) { // проверяем, что удаляет пользователь
                    case 2: { // получаем id категории (testObgect1); id подкатегории (testObgect2); id субкатегории (testObgect3)
                        // при значении 2 в tab_id будет 1 значение категоирии
                        // если подкатегории и субкатегории существуют, они попадут в массив dataObject
                        dataObject = $('tr', '#' + tab_id_mouseenter).filter('[id $=' + tab_id + ']:not([id ^=new_so])');
                        testObgect1.push({id: id_tr}); // Сохраняем id категории

                        dataObject.each(function (index, value) {
                            if (testDataTableVendor($(this).attr('id')) == 4) {
                                testObgect2.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id подкатегории (testObgect2)
                            }
                            if (testDataTableVendor($(this).attr('id')) == 6) {
                                testObgect3.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id субкатегории (testObgect3)
                            }
                        });
                        arrayObject.push(testObgect1); // категория
                        arrayObject.push(testObgect2); // подкатегоря
                        arrayObject.push(testObgect3); // субкатегория
                    }
                        break;
                    case 4: {
                        // arrayObject[категория, подкатегория, субкатегория]
                        // при значении 4 в tab_id будет 1 значение подкатегория_категоирии 12_45
                        // если субкатегории существуют, они попадут в массив dataObject
                        dataObject = $('tr', '#' + tab_id_mouseenter).filter('[id $=' + tab_id + ']:not([id ^=new_so])');
                        testObgect2.push({id: id_tr.split('_')[0]}); // записываем id подкатегории
                        dataObject.each(function (index, value) {  // записываем id субкатегоррии если они есть
                            if (testDataTableVendor($(this).attr('id')) == 6) {
                                testObgect3.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id субкатегории
                            }
                        });
                        arrayObject.push(testObgect1); // arrayObject[null, подкатегория, субкатегория] - при удалении подкатегории и суб категоиии категория не удаляется null
                        arrayObject.push(testObgect2); // Выбираем id подкатегории
                        arrayObject.push(testObgect3); // субкатегория
                    }
                        break;

                    case 6: {

                        testObgect3.push({id: id_tr.split('_')[0]}); // Выбираем id субкатегории
                        //console.log(id_tr.split('_')[0]);
                        arrayObject.push(testObgect1); // arrayObject[null, подкатегория, субкатегория]
                        arrayObject.push(testObgect2); // arrayObject[null, null, субкатегория]
                        arrayObject.push(testObgect3); // субкатегория
                    }
                        break;
                }

            }

            console.log(arrayObject);
            return arrayObject;
        }


// Обработка нажатия на + списка (подкатегории, субкатегории)
        $(document).on('click.' + opts.url, 'table[id=' + opts.url + ']>' + '.spisok a', function (e) {
            e.preventDefault();
            // Проверяем какой симво при нажатии и устанавливаем соотвествующий
            var aClick = $(this);
            if (aClick.text() == "+") {
                aClick.html("&ndash;"); // минус
            } else {
                aClick.text('+');
            }
            var trStr = $(this).closest('tr');
            //Ищем ближайшую строку и получаем ее id
            var id_tr = $(this).closest('tr').attr('id');
            //Ищем ближайшую таблицу и получаем ее id
            var id_table = $(this).closest('table').attr('id');
            //Для строк конкретной таблицы с элементом data-tr-id=id_tr выполняем скрытие/открытие строк

            switch (testDataTableVendor(id_tr)) {
                case 2: { // Раскрытие категорий
                    $('#' + id_table + ' tr[data-tr-id $=' + id_tr + ']').filter(function (index) {
                        var flag = false;

                        //Пре нажатии + выводим все подкатегории и новую строку для добавления категории

                        if (testDataTableVendor($(this).attr('id')) == 4) flag = true; // Выбираем под категорию для открытия/закрытия
                        if (testDataTableVendor($(this).attr('id')) == 3) flag = true; // Выбираем новую строку категории открытия/закрытия
                        // Не раскрываем субкатегории при открытии категории (первое нажатие на +)
                        if ((testDataTableVendor($(this).attr('id')) == 6) && ($(this).css('display') == 'none')) {
                            flag = false;
                        }
                        // Открытая субкатегория, значит ее закрываем
                        if ((testDataTableVendor($(this).attr('id')) == 6) && ($(this).css('display') != 'none')) {
                            flag = true;
                        }
                        // Новая строка субкатегории
                        if ((testDataTableVendor($(this).attr('id')) == 5) && ($(this).css('display') != 'none')) flag = true;

                        return flag;
                    }).slideToggle(200);

                    // Переклчение знака "+" с минуса на плюс
                    if (aClick.text() == "+") {
                        //Выбираем все ссылки в подкатегориях
                        $('#' + id_table + ' tr[data-tr-id =' + id_tr + ']').find('a').each(function (val, ind) {
                            $(this).text('+');
                        });
                    }
                }
                    break;
                case 4: { // Раскрытие подкатегорий
                    $('#' + id_table + ' tr[data-tr-id=' + id_tr + ']').slideToggle(200);
                }
                    break;
            }


            // Для открытых строк производим пересчет высоты элементов textarea
            outerHeightTextArea();

        });


        // readOnlycateciry();

        // выводим субкатегорию в таблице и отправляем их на оформление
        function readOnlycateciry() {
            // Получаем имена всех таблиц которым необходимы субкатегрии
            var table2Category = $('table[data-sub-category=2]'); // получаем все таблицы с субкаегориями
            var table2CategoryId = []; // имена таблиц с субкатегориями
            table2Category.each(function (val, ind) {
                table2CategoryId.push($(this).attr('id'));
            });

            // Определяем все подкатегории в каждой таблице
            table2CategoryId.forEach(function (value, index) {
                //console.log('В таблице ' +value);
                //Выбираем в каждой таблицы все подкатегории как объект JQueru
                var countElemCategoru = $('table[id=' + value + '] tr').filter(function (i, elem) {
                    return testDataTableVendor($(elem).attr('id')) == 4; // 4- соотвествует подкатегории
                });

                // Если объекты есть х количество будет больше 0
                if (countElemCategoru.length > 0) {
                    decorElemCount(countElemCategoru); // Отправляем подкатегории на оформление
                }
                //console.log(countElemCategoru);
            });

        }

        function decorElemCount(arrayElem) {


            arrayElem.each(function (index, value) {
                //console.log('ДЕКОР');
                //console.log(this);
                // Выборка первой ячейки строки
                var tdElem = $(this).find('td').eq(0);
                // Оборачиваем текстовое поле в класс input_spisok
                tdElem.find('input').wrap('<div class="input_spisok"/>');
                // добавляем в div class=input_spisok первый элемент со знаком +
                tdElem.find('.input_spisok').prepend('<div class="spisok" id=""><a href="#">+</a></div>');
                // Оборачиваем все содержимое ячейки (div с class=input_spisok)
                tdElem.find('.input_spisok').wrap('<div class="content_spisok2"/>');

                // Добавляем строку с вводом нового значения
                // Тип id у строки id=new_so_456_458
                // new_so_ - признак, что это новое значение
                // 456 - подкатегория
                // 458 - категория

                $(this).after('<tr style="display: none;" data-tr-id=' + $(this).attr('id') + ' id=new_so_' + $(this).attr('id') + '>' +
                    '<td><div class="content_spisok_subtwo"><input class=ft name="name" placeholder="Значение..." data-sub-two-category="name"  id=new_name_' + $(this).attr('id') + ' type=text value=""/> </div></td>' +
                    '<td><textarea class=ft data-min-rows="1" name="desc" data-sub-two-category="desc" placeholder="Описание..." rows="1"' +
                    'id=new_desc_' + $(this).attr('id') + '></textarea></td>' +
                    '<td style="border: 0px" id=delete_' + $(this).attr('id') + '></td></tr>'
                );


            });
        }


        function error_remove(tab) {
            // Очищаем от всех ошибок
            $('#' + tab + ' tr[class=error]').each(function (index, value) {
                $(this).remove();
            });
        }

// Добавляем checkbox к строкам
        function insert_checbox(id_table) { // Идентификатор id без символа #
            var i = $('#' + id_table).find('tr').length; //количество строк таблицы включая шапку, скрытые и последнюю строку

            if ($('tr input[type=checkbox]', '#' + id_table).length == 0) { // выводим чекбокс, чтолько если его нет
                $('#' + id_table + ' tr').each(function (index, value) { //в цикле проходим по всем строкам
                    var testId = testDataTableVendor($(this).attr('id')); // Получаем id сущ. строки
                    if (index > 0 && index < (i - 1)) { // исключаем строку с шапкой и последнюю с предложением добавить строку
                        // Действия таблицы без категории
                        if (testId == 2) { // Категория
                            $('#' + id_table + ' td[id=' + $(this).attr('id') + ']').append("<div class='div_table_delete'></div>");
                            $('#' + id_table + ' td[id=' + $(this).attr('id') + '] div.div_table_delete').append("<input class='cehed_all_delete'  id='del_" + $(this).attr('id') + "' type=checkbox><label name=" + $(this).attr('id') + "-1 for='del_" + $(this).attr('id') + "'></label>");
                            $('#' + id_table + ' td[id=' + $(this).attr('id') + '] div.div_table_delete').css({"text-align": "left"});
                        }
                    }
                    if (testId == 4) { // Подкатегория
                        $('#' + id_table + ' tr[data-sub-cat=' + $(this).attr('data-sub-cat') + ']' + ' td[id=' + $(this).attr('data-sub-cat') + ']').append("<div class='div_table_delete'></div>");
                        $('#' + id_table + ' tr[data-sub-cat=' + $(this).attr('data-sub-cat') + '] ' + ' td[id=' + $(this).attr('data-sub-cat') + ']' + ' div.div_table_delete').append("<input class='cehed_all_delete'  id='del_" + $(this).attr('data-sub-cat') + "' type=checkbox><label name=" + $(this).attr('data-sub-cat') + "-1 for='del_" + $(this).attr('data-sub-cat') + "'></label>");
                        $('#' + id_table + ' tr[data-sub-cat=' + $(this).attr('data-sub-cat') + ']' + ' td[id=' + $(this).attr('data-sub-cat') + ']' + ' div.div_table_delete').css({"text-align": "left"});
                    }

                    if (testId == 6) { // Субкатегорий
                        $('#' + id_table + ' tr[data-sub-two-category=' + $(this).attr('data-sub-two-category') + ']' + ' td[id=' + $(this).attr('data-sub-two-category') + ']').append("<div class='div_table_delete'></div>");
                        $('#' + id_table + ' tr[data-sub-two-category=' + $(this).attr('data-sub-two-category') + '] ' + ' td[id=' + $(this).attr('data-sub-two-category') + ']' + ' div.div_table_delete').append("<input class='cehed_all_delete'  id='del_" + $(this).attr('data-sub-two-category') + "' type=checkbox><label name=" + $(this).attr('data-sub-two-category') + "-1 for='del_" + $(this).attr('data-sub-two-category') + "'></label>");
                        $('#' + id_table + ' tr[data-sub-two-category=' + $(this).attr('data-sub-two-category') + ']' + ' td[id=' + $(this).attr('data-sub-two-category') + ']' + ' div.div_table_delete').css({"text-align": "left"});
                    }

                });

            }


        }

        /*
        Функция вставляет ссылку со значком напротив чекбокса
        в качестве параметра принимает ссылку любой элемент содержащий
        атрибут id
        */

        function insert_lable_delete(t) {
            var table_id = $(t).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие
            var testId = testDataTableVendor($(t).attr('id')); // Получаем id сущ. строки
            console.log(testId + '  ' + $(t).attr('id'));
            if (testId == 2) { // Категория
                $('#' + table_id + ' td[id=' + $(t).attr('id') + '] div.div_table_delete').append('<a id=on_delete_vendor  href=#  name=' + $(t).attr('id') + '>' +
                    '<img src="../../resources/image/delete_str.png" width="20" \n' +
                    '  height="12" alt="Удалить категорию"></a>');
            }

            if (testId == 4) { // Подкатегория
                $('#' + table_id + ' tr[data-sub-cat=' + $(t).attr('data-sub-cat') + ']' + ' td[id=' + $(t).attr('data-sub-cat') + ']' + ' div.div_table_delete').append('<a id=on_delete_vendor  href=#  name=' + $(t).attr('data-sub-cat') + '>' +
                    '<img src="../../resources/image/delete_str.png" width="20" \n' +
                    '  height="12" alt="Удалить подкатегорию"></a>');
            }

            if (testId == 6) { // Субкатегория
                $('#' + table_id + ' tr[data-sub-two-category=' + $(t).attr('data-sub-two-category') + ']' + ' td[id=' + $(t).attr('data-sub-two-category') + ']' + ' div.div_table_delete').append('<a id=on_delete_vendor  href=#  name=' + $(t).attr('data-sub-two-category') + '>' +
                    '<img src="../../resources/image/delete_str.png" width="20" \n' +
                    '  height="12" alt="Удалить субкатегорию"></a>');
            }


        }


// Метод удаляет отмеченные строки таблицы
        function deleteAll_Id(s, tab_id_mouseenter) {  //s - массив удаляемых строк
            var token = $("meta[name='_csrf']").attr("content");
            var header = $("meta[name='_csrf_header']").attr("content");
            $.ajax({
                type: "POST",
                url: tab_id_mouseenter + "/delete/all",
                data: JSON.stringify(s),
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                async: false,
                beforeSend: function (xhr) {

                    xhr.setRequestHeader(header, token);
                },
                success: function (res) {

                    if (res) {
                        s.forEach(function (vend) { // Удаляем строки
                            $('#' + tab_id_mouseenter + ' tr[id=' + vend.id + ']').remove().hide(500); // удаляем категорию
                            $('#' + tab_id_mouseenter + ' tr[id=new_so_' + vend.id + ']').remove().hide(500); // удаляем пустую строку категории
                            if (tab_id_mouseenter == 'subcategory') {
                                $('#category  tr[id *=' + vend.id + '][data-tr-id]').remove().hide(500); // удаляем строки подкатегорий
                            }
                            if (tab_id_mouseenter == 'subtwocategory') {
                                $('#category  tr[id *=' + vend.id + '][data-tr-id]').remove().hide(500); // удаляем строки субкатегорий
                            }


                        })

                    }
                }
            });


        }

// пространство имен сообщений об ошибках

        var timeOut;
        if (!vokmar) var vokmar = {}
        if (!vokmar.error) {

            vokmar.error = {

                message: function (data, jobgect) { //data - текст ошибки jobgect - объект Jqueru
                    var table_id = $(jobgect).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие

                    var hel = $('#' + table_id + ' tr[id=' + jobgect.attr('id') + ']').height();
                    $('body').append('<div class=error id=data_td>' + data + '<div class=krest><a class=link_eror_krest href="#" id="del_er_vokmar_error">&times;</a></div></div>').fadeIn(1000);

                    var tesr = /^([a-z]{3}_[a-z]{4})[...]*/

                    if (/^([a-z]{3}_[a-z]{4})[...]*/.test(jobgect.attr('id'))) {

                        hel = $(jobgect).height();

                        $('#data_td').offset(({

                            top: $(jobgect).offset().top - 5 + hel + 10,
                            left: $(jobgect).offset().left + 10
                        }));
                    } else {

                        $(jobgect).closest('td').css({ // Оустанавливаем обводку ячейки
                            '-moz-box-shadow': 'inset 0 0 5px 0px red',
                            '-webkit-box-shadow': 'inset 0 0 5px 0px red',
                            'box-shadow': 'inset 0 0 5px 0px red'
                        });
                        vokmar.error.onclikd(jobgect);

                        $('#data_td').offset(({ // вывод сообщений для существующих строк
                            top: $('#' + table_id + ' tr[id=' + jobgect.attr('id') + ']').offset().top - 5 + hel + 10,
                            left: $('#' + table_id + ' tr[id=' + jobgect.attr('id') + ']').offset().left + 10
                        }));
                    }

                    vokmar.error.onclik();

                    // Установливаем задержку исчезновения сообщения
                    clearTimeout(timeOut);
                    timeOut = setTimeout(function () {
                        $('#data_td').fadeOut();
                    }, 10000);
                }, // конец message


                onclik: function f() {
                    $(document)
                        .on('click', '#del_er_vokmar_error', function (e) {
                            $("#data_td").remove();
                        });
                },

                onclikd: function f(e) {

                    $(document)
                        .on('keydown', 'input[id=' + e.attr('id') + '], textarea[id=' + e.attr('id') + ']', function (e) {
                            if ($(this).val().length > 0) {
                                $(this).closest('td').attr('style', ''); // Очищаем обводку ячейки
                                vokmar.error.remove();
                            }


                        });
                },
                remove: function f(e) {
                    $("#data_td").remove();
                }

            }


        }
    }
})(jQuery)



