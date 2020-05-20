package com.admin.zakaz.vendor.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class AdviceController {
    // Обработка страницы 404
    @ExceptionHandler(NoHandlerFoundException.class)
    public String handle(Exception ex) {
        return "error/page404";
    }

    @GetMapping("/403")
    public String error403() {
        return "error/page403";
    }


}
