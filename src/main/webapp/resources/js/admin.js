$(document).ready(function () {

    //прикрепляем клик по заголовкам acc-head
    $('#accordeons .acc-head').on('click', f_acc);


    function f_acc() {
//скрываем все кроме того, что должны открыть
        $('#accordeon .acc-body').not($(this).next()).slideUp(500);
// открываем или скрываем блок под заголовком, по которому кликнули
        $(this).next().slideToggle(500);
        // display: none; не позволяет пересчитывать height поэтому а аккордионе нужно вызывать при открытии вкладки
        // при таблица вне аккордиона, при загрузке таблицы
        outerHeightTextArea();

    }

    var table_name1 = "#egrulname";
    var table_name2 = "#category";
    var table_name = "#egrulname, #category";
    var table_name_on = "#egrulname tr, #category tr"; // Список всех таблиц на странице
    var table_name_on_click = "#egrulname tr input[type=checkbox], #category tr input[type=checkbox]";
// *************Добавление пустой строки для ввода********************


//*********** Завершение добавления пустой строки для ввода ************


//**************Обработка увеличения и переноса в поле textarea*********************
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


//**************************Заверщшение обработки переноса в поле textarea***********


    // удаление всех чекбоксов при вводе символов
    $(document).on('keydown input', 'input[class=ft], textarea[class=ft]', function () {
        var table_id = $(this).closest('table').attr("id");
        delete_header_table(true, table_id); // удаление в шапке

        $('#' + table_id + ' tbody tr div.div_table_delete').remove(); // удаление в строках

    });


    // Поиск событий для вновь добавленных элементов
    $(function () {

        $(document).on('change', 'input[class=ft], textarea[class=ft]', function () { // не нажатое состояние
            var table_id = $(this).closest('table').attr("id");
            delete_header_table(true, table_id); // удаление в шапке
            var t = $(this);
            myfunc(t);

        });
    });

    // Добавление и обновление записи таблицы
    function myfunc(v) {
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
        var resultUpdeteSubTwoCategoru = testNewSubTwoCategoru.exec(str);


        var category;

        // Обновляем значение категории
        if (resultCategoru != null) {
            category = eachCategory(table_id, v.attr('id'), false);
        }

        // Обрабатываем добавление новой строки подкатегории
        if (resultNewCategoru != null) { // null если не соответсвует тесту (не новая или изменяемая категория)
            // получаем объект категория + подкатегории включая новую строку
            console.log('НОВАЯ ПОДКАТЕГОрия');
            category = eachCategory(table_id, resultNewCategoru[1], true);

        }

        // Обрабатываем обновление строк подкатегории
        if (resultUpdeteSubCategoru != null) {

            category = eachCategory(table_id, resultUpdeteSubCategoru[2], false);

        }


        if (resultUpdeteSubTwoCategoru != null) {
            alert('Добавляем новую субкатегорию' + resultUpdeteSubTwoCategoru);
            //resultUpdeteSubTwoCategoru[2] - id категории
            category = eachCategory(table_id, resultUpdeteSubTwoCategoru[2], false);
        }


        console.log(category); // Идентичны

        return category;

    }

    /*
    Функция осуществляет выбор данных конкретной категории
    Возвращает объект состоящий из категории и подкатегорий
     */
    function eachCategory(table_id, Categoru_id, flag) {


        if (flag) { // Только для добавления новой строки
            // Выборка данных у новой строки
            // Формирование данных объекта в части subcategory: [{id:1}]....
            var id_new = undefined; // Используется для новой строки
            var name_new = $("#" + table_id + " input[name=name][id=new_name_" + Categoru_id + "]").val(); // Значение подкатегории name текущей строки v
            var desc_new = $("#" + table_id + " textarea[name=desc][id=new_desc_" + Categoru_id + "]").val(); // Значение подкатегории desc текущей строки v
            alert(name_new + " " + desc_new);
        }
        var category;

        // Получаем категорию, передаем любой объект имеющий нужный id
        console.log("Передаваемый id " + Categoru_id);
        category = dataNouCategoru($("#" + table_id + " tr[id=" + Categoru_id + "]"));
        console.log("Данные категории :");
        console.log(category);
        //Получаем все подкатегории фильтр _125; _659; - нижнее подчеркивание + id категории, кроме последней новой строки включая все input[type=text]
        // В данный массив будут включены также субкатегории
        var obgekt = $("#" + table_id + " input[id $=_" + Categoru_id + "]:not(:last):not(input[type !=text])");
        console.log("Данные под категории :");
        console.log(obgekt);


        var newCategory = []; // Массив подкатегорий в т.ч. новой строки
        var newSubTwoCategory = []; // Массив подкатегорий в т.ч. новой строки
        // Добавляем в массив подкатегорий все существующие строки
        if (obgekt.length != 0) {

            obgekt.each(function (index, value) { // проходим по всем существующим строкам и добавляем их в массив

                var ids = $(this).attr("id");
                var ig = testDataTableVendor(ids);
                console.log("тест " + ids);
                console.log(ig);
                if (ig == 4) {
                    console.log('Только подкатегория');
                    //console.log("Элемент "+index+" id:"+$(this).attr("id")+"  тип "+$(this).localName);
                    var obj = {
                        id: ids.split('_')[0],
                        name: $(this).val(),
                        desc: $("#" + table_id + " textarea[name=desc][id=" + ids + "]").val(),
                        validated: true,
                        errorMessages: null,
                        subtwocategory: undefined
                    }
                    console.log("Сохраняемая в массив подкатегория :");
                    console.log(obj);
                    newCategory.push(obj);
                }
                //Обработка новых строк субкатегорй
                if ($(this).data('sub-two-category') != undefined && $(this).val() != "") {
                    //console.log('Суб категория ');
                    var idsubcat = $(this).attr('id').split('_')[2];
                    var idsubtwo = idsubcat + '_' + $(this).attr('id').split('_')[3];
                    //console.log($(this).attr('id').split('_')[2]+'_'+$(this).attr('id').split('_')[3]);
                    var id_new1 = undefined; // Используется для новой строки
                    var name_new1 = $("#" + table_id + " input[name=name][id=new_name_" + idsubtwo + "]").val(); // Значение подкатегории name текущей строки v
                    var desc_new1 = $("#" + table_id + " textarea[name=desc][id=new_desc_" + idsubtwo + "]").val(); // Значение подкатегории desc текущей строки v

                    newSubTwoCategory.push({
                        id: id_new1,
                        name: name_new1,
                        desc: desc_new1,
                        validated: true,
                        errorMessages: null
                    })
                    // console.log('newSubTwoCategory');
                    console.log(newSubTwoCategory);

                    newCategory.forEach(function (value, index, arr) {
                        console.log(value.id);
                        if (value.id == idsubcat) {
                            if (value.subtwocategory == undefined) {
                                value.subtwocategory = newSubTwoCategory;
                            } else {
                                value.subtwocategory.push(newSubTwoCategory);
                            }


                        }

                    });


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
        var test7 = /^new_so_([0-9]+)_([0-9]+)$/;
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
            alert("Новая субкатегории");
            identificator = 5;
        }

        if (test6.test(id_data)) {
            //alert("Изменение субкатегории");
            identificator = 6;
        }

        return identificator;
    }

    // Выводим подкатегории и субкатегории
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


        if (catecory == 3) {
            //alert("Редактируем подкатегорию");
            var test0 = /^new_name_([0-9]+)$/;
            var id_cat = test0.exec($(v).attr("id"));
            var trObg = v.closest('tr'); //  Получаем строку относящуюся к полям ввода

            console.log("Объект с сервера: ")
            console.log(res);
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
                console.log('Отправляем на декорацию');
                decorElemCount(trObg);
            }


        }

        if (catecory == 5) {
            //alert('Обновляем значение субкатегории');
            console.log(res);
            // Из массива категорий выбираем те, у которых subtwocategory больше 0
            res.subcategory.forEach(function (value) {
                /*Меняем
                id и data-tr-id:  c new_so_459_45 и 459_45 на 14_459_45 и 14_459_45
                 */
                if (value.subtwocategory != null) {
                    //alert("Под категория "+value.name+" имеет "+value.subtwocategory.length+" субкатеогрию");

                    value.subtwocategory.forEach(function (values) {
                        alert('tr[id=new_so_' + value.id + '_' + res.id + ']' + ' #' + table_id);
                        // Меняем id строки
                        $('tr[id=new_so_' + value.id + '_' + res.id + ']', '#' + table_id).attr(
                            {
                                'id': values.id + '_' + value.id + '_' + res.id,
                                'data-tr-id': values.id + '_' + value.id + '_' + res.id
                            });
                        // Меняем id содержимого первой ячейки
                        $('[id=new_name_' + value.id + '_' + res.id + ']', '#' + table_id).attr({'id': values.id + '_' + value.id + '_' + res.id});

                        // Меняем id содержимого торой ячейки
                        $('[id=new_desc_' + value.id + '_' + res.id + ']', '#' + table_id).attr({'id': values.id + '_' + value.id + '_' + res.id});
                        // Меняем id содержимого последней ячейки (в ней хранится чекбокс на удаление)
                        $('[id=delete_' + value.id + '_' + res.id + ']', '#' + table_id).attr({'id': 'delete_' + values.id + '_' + value.id + '_' + res.id});

                    });
                }
            });
        }
    }


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


    // Обработка нажатия checkbox в шапке таблицы
    $(document).on('click', table_name1 + ' #del_all_header, ' + table_name2 + ' #del_all_header', function (e) {
        var tab_id_mouseenter = $(this).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие


        if ($(this).is(':checked')) { // если нажат
            $('#' + tab_id_mouseenter + ' tbody input[type=checkbox]').prop('checked', true);

        } else { // если снят
            $('#' + tab_id_mouseenter + ' tbody input[type=checkbox]').prop('checked', false);
        }
    });


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

// Функция очищает
    function delete_header_table(flag, tab_id_mouseenter) {

        $('#' + tab_id_mouseenter + ' thead tr div.div_table_delete').remove();
        if (flag) {
            // Очищаем боковую ссылку удаления строк
            $('#' + tab_id_mouseenter + ' tr td[id] a[id]').empty();

        }
    }

    $(document).on('click', '.cehed_all_delete', function () {
        if ($(this).is(':checked')) {
            //alert("установлен");
        } else {
            //alert("не установлен");
        }
    })


// Обработка нажатия на ссылку удаляющую несколько строк или одну строку
    $(document).on("click", '#on_delete_all_vendor, #on_delete_vendor', function (e) {
        var tab_id_mouseenter = $(this).closest('table').attr("id"); // Определяем id таблицы в которой проиошло событие

        var checked = []; // массив удаляемых категорий
        var checked1 = []; // массив удаляемых подкатегорий
        var checkboxData = []; // массив для хранения всех нажатых чекбоксов
        if ($('#' + tab_id_mouseenter + ' tbody tr :checkbox:checked').length == 0) { // Обработка щелчка по ссылке

            if (testDataTableVendor($(this).closest('tr').attr("id")) == 2) { // щелчек на удаление категории
                var arrData = hrefCategoryDelete(this, checkboxData);
                checked = arrData[0];
                console.log('Удаляемая категория ');
                console.log(checked); // Нажатие на одиночную ссылку для удаления категоиии и подкатегорий
                deleteAll_Id(checked, tab_id_mouseenter);
                if (arrData[1] != null && arrData[1].length > 0) {
                    checked1 = arrData[1];
                    console.log('Удаляемые под категория ');
                    console.log(checked1); // Нажатие на одиночную ссылку для удаления подкатегорий
                    deleteAll_Id(checked1, 'subcategory');
                }
            }
            if (testDataTableVendor($(this).closest('tr').attr("id")) == 4) { // щелчек на удалени подкатегории
                var arrData = hrefCategoryDelete(this, checkboxData);
                console.log('Входной массив');
                console.log(arrData);
                checked1 = arrData[1];
                console.log('Удаляемые под категория одиночная ');
                console.log(checked1); // Нажатие на одиночную ссылку для удаления подкатегорий
                deleteAll_Id(checked1, 'subcategory');
            }


        } else { // щелчек на чекбоксах
            $('#' + tab_id_mouseenter + ' tbody tr :checkbox:checked').each(function () { //Создаем массив для удобства обработки
                checkboxData.push($(this).closest('tr').attr("id")); // Собираем все id нажатых элементов строк в массив
            });
            var arrData = hrefCategoryDelete(this, checkboxData); // получаем массив из 2-х элементов

            console.log('Входной массив');
            console.log(arrData);

            // первый элемент 0 - категории
            if (arrData[0] != null && arrData[0].length > 0) { // Проверяем категорию
                checked = arrData[0];
                console.log('Удаляемые  категории ');
                console.log(checked); // Нажатие на одиночную ссылку для удаления подкатегорий
                deleteAll_Id(checked, tab_id_mouseenter);
            }
            // выторой элемент 1 - подкатегории
            if (arrData[1] != null && arrData[1].length > 0) { // Проверяем подкатегорию
                checked1 = arrData[1];
                console.log('Удаляемые под категория ');
                console.log(checked1); // Нажатие на одиночную ссылку для удаления подкатегорий

                deleteAll_Id(checked1, 'subcategory');
            }
        }
        //console.log(checked);

        $('#' + tab_id_mouseenter + ' thead tr input:checked').prop('checked', false);
        $('#' + tab_id_mouseenter + ' thead tr input[type=checkbox]').remove(); // очищаем чекбокс в шапке
        $('#' + tab_id_mouseenter + ' thead tr a').remove(); // очищаем ссылку в шапке

        vokmar.error.remove(); // при удалении строки(строк) очищаем все сообщения об ошибке, выделения ошибо остаются
    });

    // Обработка нажатия одиночной ссылки
    // Функция определяет у стрки является ли она категорией или подкатегорией
    // Возвращается или список удаляемых подкатегорий или вся категория со списокм удаляемых подкатегрий
    function hrefCategoryDelete(t, arrData) {  // t - ссылка на объект таблицы data - массив удаляемых категорий и подкатегорий
        var tab_id_mouseenter = $(t).closest('table').attr("id");
        //console.log('tab_id_mouseenter '+tab_id_mouseenter);
        var testObgect1 = []; // Категория
        var testObgect2 = []; // Подкатегория
        var arrayObject = []; // Общий массив для отправки
        // console.log(arrData.length);
        if (arrData.length > 0) { // Если массив >0 значит были выбраны чекбоксы
            console.log('arrData ' + arrData);

            arrData.forEach(function (elem) {
                console.log('эудаляемый элемент');
                console.log(elem);
                var testIds = testDataTableVendor(elem); // Может быть 2 значения: 2 - категория; 4 - подкатегоия
                console.log('тип удаляемого элемента');
                console.log(testIds);

                if (testIds == 4) { // элемент является подкатегорией
                    testObgect2.push({id: elem.split('_')[0]}); // Выбираем id подкатегории
                }

                if (testIds == 2) { // элемент является категорией
                    // Выбираем категорию и все его подкатегории
                    var dataObject = $('tr', '#' + tab_id_mouseenter).filter('[id $=' + elem + ']:not([id ^=new_so])');
                    testObgect1.push({id: elem}); // Сохраняем id категории

                    dataObject.each(function (index, value) { // Сохраняем все id подкатегорий
                        if ($(this).attr('id').split('_')[0] != elem) { // проверяем, чтобы неба выбрана категория
                            testObgect2.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id подкатегории
                        }
                    });
                }
            });

            arrayObject.push(testObgect1);
            arrayObject.push(testObgect2);

        } else { // иначе значит был щелчек на одиночной ссылки категори или подкатегории
            console.log('Одиночная ссылка');
            console.log('arrData ' + null);

            // Определение, что выбрано категория или подкатегория
            // Определяем тип id
            // 325 - категрия
            // 256_325 - подкатегория
            var id_tr = $(t).closest('tr').attr("id");
            var tab_id = id_tr; // Если выбрали категорию, будет 1 значение, если подкатеорию 2 значения 12_45
            // console.log('tab_id '+tab_id);
            var testId = testDataTableVendor(tab_id); // Может быть 2 значения: 2 - категория; 4 - подкатегоия
            console.log('testId ' + testId);

            if (testId == 4) { // Цель проверки - определение категории, чтобы можно было при щелчке на подкатегории выбрать все строки категории в т.ч. подкатегории
                tab_id = tab_id.split('_')[tab_id.split('_').length - 1]; // получаем последний элемент массива 12_45
            }
            // Выбираем категорию и все его подкатегории
            var dataObject = $('tr', '#' + tab_id_mouseenter).filter('[id $=' + tab_id + ']:not([id ^=new_so])');

            // Выбиракм строки


            switch (testId) { // проверяем, что удаляет пользователь
                case 2: {
                    testObgect1.push({id: id_tr}); // Сохраняем id категории

                    dataObject.each(function (index, value) {
                        if ($(this).attr('id').split('_')[0] != tab_id) {
                            testObgect2.push({id: $(this).attr('id').split('_')[0]}); // Выбираем id подкатегории
                        }
                    });
                    arrayObject.push(testObgect1);
                    arrayObject.push(testObgect2);


                }
                    break;
                case 4: {

                    arrayObject.push(testObgect1); // тут он всегда пустой
                    testObgect2.push({id: id_tr.split('_')[0]});
                    arrayObject.push(testObgect2); // Выбираем id подкатегории
                }
                    break;
            }

        }
        console.log(arrayObject);
        return arrayObject;
    }


// Обработка нажатия на + списка (подкатегории)
    $(document).on('click', '.spisok a', function (e) {
        e.preventDefault();
        // Проверяем какой симво при нажатии и устанавливаем соотвествующий
        if ($(this).text() == "+")
            $(this).html("&ndash;"); // минус
        else
            $(this).text('+');

        //Ищем ближайшую строку и получаем ее id
        var id_tr = $(this).closest('tr').attr('id');
        //Ищем ближайшую таблицу и получаем ее id
        var id_table = $(this).closest('table').attr('id');
        //Для строк конкретной таблицы с элементом data-tr-id=id_tr выполняем скрытие/открытие строк
        $('#' + id_table + ' tr[data-tr-id=' + id_tr + ']').slideToggle(200);
        // Для открытых строк производим пересчет высоты элементов textarea
        outerHeightTextArea();

    });

    readOnlycateciry();

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
                '<td><input class=ft name="name" placeholder="Новое значение...12" data-sub-two-category="name"  id=new_name_' + $(this).attr('id') + ' type=text value=""/> </td>' +
                '<td><textarea class=ft data-min-rows="1" name="desc" data-sub-two-category="desc" placeholder="Новое описание...12" rows="1"' +
                'id=new_desc_' + $(this).attr('id') + '></textarea></td>' +
                '<td style="border: 0px" id=delete_' + $(this).attr('id') + '></td></tr>'
            );


        });
    }


    // Модуль Jqueru загрузка субкатегорий в таблицу
    (function ($) {

        $.fn.dataCat = function () {
            var idtable = this.attr('id');
            // Получаем объект JSON содержащий все объекты загружаемой таблицы
            var objektJson = JSON.parse(datas);
            // Выполняем манипуляци, только если объект не пустой
            if (objektJson != null) {
                //КАТЕГОРИЯ
                objektJson.forEach(function (value) {
                    console.log(value.name);
                    if (value.subcategory != null) {
                        //ПОД КАТЕГОРИЯ
                        value.subcategory.forEach(function (value1) {
                            console.log(' -' + value1.name);
                            //СУБ КАТЕГОРИЯ
                            value1.subtwocategory.forEach(function (value2) {
                                console.log('  --' + value2.name);
                                insert(value.id, value1.id, value2);
                            });


                        });
                    }
                });

            }


            function insert(cat1, cat2, cat3) {
                alert(cat1 + ' ' + cat2 + ' ' + cat3);
                console.log($('#' + idtable).find('tr[id=new_so_' + cat2 + '_' + cat1 + ']'));
                $('#' + idtable).find('tr[id=new_so_' + cat2 + '_' + cat1 + ']').before('<tr style="display: none;" data-tr-id=' + cat2 + '_' + cat1 + ' id=' + cat3.id + '_' + cat2 + '_' + cat1 + ' >' +
                    '<td><input class=ft name="name" placeholder="Новое значение..." data-sub-two-category="name"  id=' + cat3.id + '_' + cat2 + '_' + cat1 + ' type=text value=' + cat3.name + ' /> </td>' +
                    '<td><textarea class=ft data-min-rows="1" name="desc" data-sub-two-category="desc" id=' + cat3.id + '_' + cat2 + '_' + cat1 + ' placeholder="Новое описание..." rows="1"' +
                    '></textarea></td>' +
                    '<td style="border: 0px" id=delete_' + cat3.id + '_' + cat2 + '_' + cat1 + '></td></tr>'
                );

            }

        } // Конец модуля

    })(jQuery)


    $(table_name2).dataCat();








}); // Конец загрузки


function error_remove(tab) {
    // Очищаем от всех ошибок
    $('#' + tab + ' tr[class=error]').each(function (index, value) {
        $(this).remove();
    });
}

// Добавляем checkbox к строкам
function insert_checbox(id_table) { // Идентификатор id без символа #
    var i = $('#' + id_table).find('tr').length; //количество строк таблицы включая шапку, скрытые и последнюю строку
    //console.log("Количество строк таблицы "+i);

    if ($('#' + id_table + ' tr input[type=checkbox]').length == 0) { // выводим чекбокс, чтолько если его нет
        $('#' + id_table + ' tr').each(function (index, value) { //в цикле проходим по всем строкам


            if (index > 0 && index < (i - 1)) { // исключаем строку с шапкой и последнюю с предложением добавить строку

                // console.log("id для проверки "+$(this).filter(":not([id ^=new_so])").attr('id'));
                // Выбираем все строки кроме: последней и с id=new_so
                var test = (/^([0-9]+)|[a-z]*_*[0-9]*/.exec($(this).filter(":not([id=new_so])").attr('id')));
                var idcat;
                //console.log("Суб категории ");
                //console.log($(this).attr('data-sub-cat'));

                // Действия таблицы без категории
                if ($(this).attr('data-sub-cat') == undefined) {

                    $('#' + id_table + ' td[id=' + $(this).attr('id') + ']').append("<div class='div_table_delete'></div>");

                    $('#' + id_table + ' td[id=' + $(this).attr('id') + '] div.div_table_delete').append("<input class='cehed_all_delete'  id='del_" + $(this).attr('id') + "' type=checkbox><label name=" + $(this).attr('id') + "-1 for='del_" + $(this).attr('id') + "'></label>");

                    $('#' + id_table + ' td[id=' + $(this).attr('id') + '] div.div_table_delete').css({"text-align": "left"});
                }
            }
            // действие таблицы с категориями
            if ($(this).attr('data-sub-cat') > 0) {

                $('#' + id_table + ' tr[data-sub-cat=' + $(this).attr('data-sub-cat') + ']' + ' td[id=' + $(this).attr('data-sub-cat') + ']').append("<div class='div_table_delete'></div>");

                $('#' + id_table + ' tr[data-sub-cat=' + $(this).attr('data-sub-cat') + '] ' + ' td[id=' + $(this).attr('data-sub-cat') + ']' + ' div.div_table_delete').append("<input class='cehed_all_delete'  id='del_" + $(this).attr('data-sub-cat') + "' type=checkbox><label name=" + $(this).attr('data-sub-cat') + "-1 for='del_" + $(this).attr('data-sub-cat') + "'></label>");

                $('#' + id_table + ' tr[data-sub-cat=' + $(this).attr('data-sub-cat') + ']' + ' td[id=' + $(this).attr('data-sub-cat') + ']' + ' div.div_table_delete').css({"text-align": "left"});


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

    // 125 или delete за которым символ  _  после цифры     125_256  или del_125
    var test = (/^([0-9]+)|[a-z]*_*[0-9]*/.exec($(t).filter(":not([id=new_so])").attr('id')));
    //console.log('id переданной строки '+test[1]);

    if ($(t).attr('data-sub-cat') == undefined) {

        $('#' + table_id + ' td[id=' + $(t).attr('id') + '] div.div_table_delete').append('<a id=on_delete_vendor  href=#  name=' + $(t).attr('id') + '>' +
            '<img src="../../resources/image/delete_str.png" width="20" \n' +
            '  height="12" alt="Удалить"></a>');

    }


    if ($(t).attr('data-sub-cat') > 0) {
        //console.log("data-sub-cat");
        //console.log($(t).attr('data-sub-cat'));
        $('#' + table_id + ' tr[data-sub-cat=' + $(t).attr('data-sub-cat') + ']' + ' td[id=' + $(t).attr('data-sub-cat') + ']' + ' div.div_table_delete').append('<a id=on_delete_vendor  href=#  name=' + $(t).attr('data-sub-cat') + '>' +
            '<img src="../../resources/image/delete_str.png" width="20" \n' +
            '  height="12" alt="Удалить"></a>');

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
                    if (tab_id_mouseenter == 'subcategory')
                        $('#category  tr[id *=' + vend.id + '][data-tr-id]').remove().hide(500); // удаляем строки подкатегорий
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
