// Скрипт для обработки формы входы метобом GET
//Дальнешая обработка формы ввода ведеся в файле lgin.js
$(document).ready(function () {
    $("#formregs").addClass("formregs");
    menuclosdisable(true); // скрываем меню

    function menuclosdisable(flaf) {
        if (flaf)
            $(".menus").hide();
        else
            $(".menus").show();
    }
});