// Скрипт для обрабvarот формы входа через Ajax
$(document).ready(function () {

    $(window).resize(function () {
        errormsg(false);
    });


    var day = 0;
    // Нажатие на ссылку войти
    $(document).on("click", "a[id=login]", function f(e) {
        e.preventDefault();
        lofin();
    });
    // Выключение фона
    $(document).on('click', '.closeformregs', function (e) {
        $(".formregs").remove();
        menuclosdisable(false);
    });
    // Обработка нажатия кнопки входа
    $(document).on('click', 'input[id=loginfotm]', function (e) {
        console.log(day);
        openlogin();
        e.preventDefault();


    });

    // загрузка формы
    function lofin() {
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        $.ajax({
            type: "GET",
            url: "ajax",  //загружаем страницу регистраци
            beforeSend: function (xhr) {

                xhr.setRequestHeader(header, token);
            },
            success: function (res) {
                $("body").append("<div id='formregs'><a class='closeformregs' href='#'>&#10006;</a></div>");
                $("#formregs").addClass("formregs");
                $("#formregs").append(res);
                menuclosdisable(true);
            }

        });
    }

    // Обработка формы входа
    function openlogin() {

        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        var ob = {
            username: $('input[id=username]').val(),
            password: $('input[id=password]').val(),
            captha: $('input[id=captha]').val(),
        }

        console.log(ob);
        $.ajax({
            type: "POST",
            url: "login.html",
            data: ob,
            // contentType:"application/x-www-form-urlencoded",
            dataType: "json", //Тип возвращаемых данных строка адреса
            //async: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            success: function (res) {

                console.log("Флаг " + res.flag);
                console.log("Путь " + res.page);

                if (res.flag) {
                    console.log("Флаг " + res.flag);
                    console.log("Флаг " + res.exception);

                    errormsg(false);

                    $('.error').append(res.exception);
                    errormsg(true);
                } else {

                    menuclosdisable(true);
                    $(".formregs").remove();
                    location.href = res.page;

                }
            },
            error: function (jqxhr, status, errorMsg) {


                console.log("Статус: " + status + " Ошибка: " + errorMsg + "  Объект: " + jqxhr);
                console.log(jqxhr);
                console.log("Статус");
                console.log(status);
                console.log("Ошибка");
                console.log(errorMsg);

                $(".formregs").remove();
                menuclosdisable(false);
                location.href = "login.html";
            }
        });
    }

    function menuclosdisable(flaf) {
        if (flaf)
            $(".menus").hide();
        else
            $(".menus").show();
    }


    function errormsg(flagdata) {


        if (flagdata) {

            $('#formregs').append($('.error'));

            $('.error').offset(({
                top: $('.formreg').offset().top + 10,
                left: $('.formreg').offset().left + $('.formreg').width()
            })).show();
        } else {
            // Определяем текущии координаты
            var lelts = $('.error').offset().left;
            // Данная проверка при 0 значениях не добавляе координаты
            if (lelts > 0) {
                $('.error').offset(({top: 20, left: 50}));
                $('.error').empty();
                $('.error').hide();
            }
        }

    }


});