$(document).ready(function () {
    $('#egrulname').append(
        '<tr id="new_so">' +
        '<td><input id="new_name" placeholder="Тип юр. лица" class=ft  type=text value="" name="name"/>' +
        '<td><textarea id="new_desc" data-min-rows="1" data="elastic" placeholder="Описание типа" rows="1"  class=ft name="desc"></textarea></td>' +
        '<td style="border: 0px" id="delete"></td>' +
        '</tr>');

//**************Обработка увеличения и переноса в поле textarea*********************
    $(document)
        .on('input.textarea.ft', 'textarea.ft', function (e) {
            $(this).outerHeight(16).outerHeight(this.scrollHeight);
        });
    // Срабатывает при начальной загрузке таблицы
    $('#egrulname textarea').each(function (index, value) {
        $(this).outerHeight(16).outerHeight(this.scrollHeight);
    });
//**************************Заверщшение обработки переноса в поле textarea***********


    // удаление всех чекбоксов при вводе символов
    $(document).on('keydown input', 'input[class=ft], textarea[class=ft]', function () {
        delete_header_table(true); // удаление в шапке
        $('#egrulname tbody tr div.div_table_delete').remove(); // удаление в строках
    });


    var timeOut;
    var timeOut_table;

    // Поиск событий для вновь добавленных элементов
    $(function () {

        $(document).on('change', 'input[class=ft], textarea[class=ft]', function () { // не нажатое состояние
            delete_header_table(true); //При начале ввода данных очищием все чекбоксы
            clearTimeout(timeOut);
            var t = $(this);

            timeOut = setTimeout(function () {
                myfunc(t)
            }, 0);
        });
    });

    function myfunc(v) {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        var id_i = v.attr('id');
        //console.log("id в начале " + id_i);

        var name_i = $("input[name=name][id=" + v.attr('id') + "]").val();
        //console.log("Значение name в начале " + name_i);
        var desc = $("textarea[name=desc][id=" + v.attr('id') + "]").val();
        if (desc == undefined) { // В поле desc был введен текс=>name_i=null=>вводится поле name_i=>подхватываем текс в поле desc
            var desc = $("textarea[name=desc][id=new_desc]").val();
        }
        //console.log("Значение desc в начале " + desc);


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

        $.ajax({
            type: "POST",
            url: "vendajax",
            data: JSON.stringify(obj),
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            async: false,
            beforeSend: function (xhr) {

                xhr.setRequestHeader(header, token);
            },
            success: function (res) {
                if (res.validated) {
                    // Очищаем от всех ошибок
                    error_remove();
                    var val1 = "";
                    $.each(res.errorMessages, function (key, value) {
                        $("#data_td").remove();
                        val1 = val1 + value + '\r\n';
                    });

                    vokmar.error.message(val1, v);
                } else {
                    $("#data_td").remove();
                    if (id_i == undefined) { // Для новой записи

                        v.attr('id', res.id); // Для пля name=name для input
                        $("textarea[id=new_desc]").attr('id', res.id); // Для name=name_desc
                        $('#egrulname tr td[id=delete]').attr('id', res.id); // id для ячейки
                        $('#egrulname tr[id=new_so]').attr('id', res.id); // id для строки

                        // Очищаем все элементы которыми удаляют строки: чекбоксы, ссылки в строках и шапке, кроме самой шапки
                        // При добавлении вовой строки это нужно, чтобы появились сразу все чекбоксы и ссылки
                        $('#egrulname tr td[id]:not(#hed)').empty();
                        $('#egrulname thead tr a').empty();


                        // Очищаем от всех ошибок
                        error_remove();

                        // Временные id new  и  delete для их дальнейшей перезаписи
                        $('#egrulname').append(
                            '<tr id="new_so">' +
                            '<td><input id="new_name" placeholder="Тип юр. лица" class=ft  type=text value="" name="name"/>' +
                            '<td><textarea id="new_desc" placeholder="Описание типа" rows="1" class=ft name="desc"></textarea></td>' +
                            '<td style="border: 0px" id=delete></td>' +
                            '</tr>');


                    }
                }
            }
        });

    } //конец функции


    // Обработка вывода кнопки удалить и чекбоксов
    $(document).on({
            'mouseenter': function () {

                insert_checbox(); // При наведении на строку, вставляем чекбокс, за ним идет ссылка с картинкой
                if ($('#egrulname tr :checkbox:checked').length < 1) { // если выбран больше 1 checkbox, не выводим единичное удаление
                    insert_lable_delete(this);
                }
            },
            'mouseleave': function () {

                $('#egrulname tr td[id] a[id]').empty(); // Очищаем боковую картинку

            }
        },
        "tr"); // конец обработки события

    // Обработка событий таблицы
    $(document).on({
            'mouseenter': function () {
                timeOut_table = 0;
            },
            'mouseleave': function () {
                // Очищаем все элементы которыми удаляют строки: чекбоксы, ссылки в строках и шапке кроме самой шапки


                if ($('#egrulname tr :checkbox:checked').length < 1) {
                    delete_header_table(false);


                    clearTimeout(timeOut_table);
                    timeOut_table = setTimeout(function () {
                        delete_header_table(false);

                        $('#egrulname tbody tr div.div_table_delete').remove();

                    }, 500);
                }

            }
        },
        "table[id=egrulname]"); //Конец обработки


    // Обработка нажатия checkbox в шапке таблицы
    $(document).on('click', "#egrulname #del_all_header", function (e) {

        if ($(this).is(':checked')) { // если нажат
            $('#egrulname tbody input[type=checkbox]').prop('checked', true);
        } else { // если снят
            $('#egrulname tbody input[type=checkbox]').prop('checked', false);
        }
    });


// Обрабока нажатия чекбоксов в теле таблицы (кроме шапки)
    $(document).on('click', "#egrulname tr  input[type=checkbox]", function (e) {

            var col_ceh = 0; // общее количество heckbox у строк, кроме шапки
            $('#egrulname tbody tr input[type=checkbox]').each(function (index, value) {
                col_ceh = col_ceh + 1;
            });

            // Выбраны все чекбоксы
            if ($('#egrulname tbody tr :checkbox:checked').length == col_ceh) {
                $('#egrulname thead tr input[type=checkbox]').prop('checked', true);
            }

            // Выбрано несколько чекбоксов
            if ($('#egrulname tbody tr :checkbox:checked').length < col_ceh) {

                // Очистка шапки от элементов
                delete_header_table(true);


                //Вставляем в шапку ссылку на удаление нескольких строк
                $('#egrulname thead tr').append("<div class='div_table_delete'></div>");
                $('#egrulname thead tr div.div_table_delete').append("<input class='cehed_all_delete_a' id=del_all_header type=checkbox> <label  for=del_all_header></label>");
                $('#egrulname thead tr div.div_table_delete').append('<a id=on_delete_all_vendor href="#">' +
                    '<img src="../../resources/image/delete_str.png" width="20" \n' +
                    '  height="12" alt="Удалить"></a>');


            }
            // Если не выбрано ни одного чекбокса
            if ($('#egrulname  tr :checkbox:checked').length == 0) {
                // Очистка шапки от элементов
                delete_header_table(false);
                // добавляем боковую сылку на данную строку
                insert_lable_delete(this);
            }

            col_ceh = 0;


        }
    );

// Функция очищает
    function delete_header_table(flag) {

        $('#egrulname thead tr div.div_table_delete').remove();
        if (flag) {
            // Очищаем боковую ссылку удаления строк
            $('#egrulname tr td[id] a[id]').empty();

        }
    }


// Обработка нажатия на ссылку удаляющую несколько строк
    $(document).on("click", '#on_delete_all_vendor, #on_delete_vendor', function (e) {

        var checked = []; // массив удаляемых строк
        if ($('#egrulname tbody tr :checkbox:checked').length == 0) {
            checked.push({id: $(this).attr('name')}); // Нажатие на одиночную ссылку
        } else {
            $('#egrulname tbody tr :checkbox:checked').each(function () { //Создаем массив для удобства обработки
                checked.push({id: $(this).attr('id').slice(4)}); // Нажатие на массовую ссылку

            });
        }
        //console.log(checked);
        deleteAll_Id(checked);
        $('#egrulname thead tr input:checked').prop('checked', false);
        $('#egrulname thead tr input[type=checkbox]').remove(); // очищаем чекбокс в шапке
        $('#egrulname thead tr a').remove(); // очищаем ссылку в шапке
        vokmar.error.remove(); // при удалении строки(строк) очищаем все сообщения об ошибке, выделения ошибо остаются
    });

}); // Конец загрузки


function error_remove() {
    // Очищаем от всех ошибок
    $('#egrulname tr[class=error]').each(function (index, value) {
        $(this).remove();
    });
}

// Добавляем checkbox к строкам
function insert_checbox() {
    var i = $('#egrulname ').find('tr').length; //количество строк

    if ($('#egrulname tr input[type=checkbox]').length == 0) { // выводим чекбокс, чтолько если его нет
        $('#egrulname tr').each(function (index, value) { //в цикле проходим по всем строкам

            if (index > 0 && index < (i - 1)) { // исключаем строку с шапкой и послебнюю с предложением добавить строку

                $('#egrulname tr td[id=' + $(this).attr('id') + ']').append("<div class='div_table_delete'></div>");
                $('#egrulname tr td[id=' + $(this).attr('id') + '] div.div_table_delete').append("<input class='cehed_all_delete'  id='del_" + $(this).attr('id') + "' type=checkbox><label name=" + $(this).attr('id') + "-1 for='del_" + $(this).attr('id') + "'></label>");
                $('#egrulname tr td[id=' + $(this).attr('id') + '] div.div_table_delete').css({"text-align": "left"});

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
    $('#egrulname tr td[id=' + $(t).attr('id') + '] div.div_table_delete').append('<a id=on_delete_vendor  href=#  name=' + $(t).attr('id') + '>' +
        '<img src="../../resources/image/delete_str.png" width="20" \n' +
        '  height="12" alt="Удалить"></a>');


}


// Метод удаляет отмеченные строки таблицы
function deleteAll_Id(s) {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $.ajax({
        type: "POST",
        url: "delete/all",
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
                    $('#egrulname tr[id=' + vend.id + ']').remove().hide(1000);
                    //$('#egrulname tr[id='+vend.id+']').remove();

                })

            }
        }
    });


}

// пространство имен сообщений об ошибках
if (!vokmar) var vokmar = {}
if (!vokmar.error) {

    vokmar.error = {

        message: function (data, jobgect) { //data - текст ошибки jobgect - объект Jqueru


            var hel = $('tr[id=' + jobgect.attr('id') + ']').height();
            $('body').append('<div class=error id=data_td>' + data + '<div class=krest><a class=link_eror_krest href="#" id="del_er_vokmar_error">&times;</a></div></div>').fadeIn(1000);
            if (jobgect.attr('id') == "new_name" || jobgect.attr('id') == "new_desc") { // вывод сообщения для новой строки

                hel = $('tr[id=new_so]').height();

                $('#data_td').offset(({
                    top: $('tr[id=new_so]').offset().top - 5 + hel + 10,
                    left: $('tr[id=new_so]').offset().left + 10
                }));
            } else {

                $(jobgect).closest('td').css({ // Оустанавливаем обводку ячейки
                    '-moz-box-shadow': 'inset 0 0 5px 0px red',
                    '-webkit-box-shadow': 'inset 0 0 5px 0px red',
                    'box-shadow': 'inset 0 0 5px 0px red'
                });
                vokmar.error.onclikd(jobgect);
                $('#data_td').offset(({ // вывод сообщений для существующих строк
                    top: $('tr[id=' + jobgect.attr('id') + ']').offset().top - 5 + hel + 10,
                    left: $('tr[id=' + jobgect.attr('id') + ']').offset().left + 10
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
