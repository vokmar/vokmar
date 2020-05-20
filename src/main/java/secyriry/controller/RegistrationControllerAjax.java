package secyriry.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import secyriry.authentication.AuthenticationManagers;
import secyriry.authentication.CustomAuthencationProvider;
import secyriry.service.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
Данный контроллер выполняет Ajax вход
 */

@Controller
public class RegistrationControllerAjax {

    @Autowired
    AuthenticationManagers authenticationManager;
    @Autowired
    CustomAuthencationProvider fghjk;
    @Autowired
    SecurityContextRepository repository;
    @Autowired
    RememberMeServices rememberMeServices;
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/ajax", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String registrationsqs(
            @RequestParam("username") String username,
            @RequestParam("password") String password, HttpServletRequest request, HttpServletResponse response) {
        boolean gt = true;
        try {
            // Проверка правильности введенных данных
            //userService.checkLoginPassword(username, password);

            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(username, password);

            Authentication auth = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            repository.saveContext(SecurityContextHolder.getContext(), request, response);
            rememberMeServices.loginSuccess(request, response, auth);
            fghjk.authenticate(auth);


        } catch (Exception ex) {
            return "{\"flag\":true,\"page\":\"login.html\",\"errors\":\"Имя пользователя или пароль не верные\"}";
        }

        return "{\"flag\":false,\"page\":\"admin\"}";

    }

}
