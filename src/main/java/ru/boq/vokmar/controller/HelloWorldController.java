package ru.boq.vokmar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


import secyriry.entity.User;

import secyriry.service.UserService;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.List;

@Controller
public class HelloWorldController {


    @Autowired
    private UserService us;


    @RequestMapping("/login.html")
    public String log(HttpSession session) {
        session.setAttribute("capha", "12356");
        return "login";
    }


    @RequestMapping("/login-error.html")
    public String loginError(Model model) {
        model.addAttribute("loginError", true);
        return "login";
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "index";
    }

    @RequestMapping(value = "/expired", method = RequestMethod.GET)
    public String sessionExpired() {
        return "login.html";
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/admin/user/users", method = RequestMethod.GET)
    public String userAll(Model model) {

        List<User> aluset = us.allUsers();
        model.addAttribute("user", aluset);
        return "admin/user/users";
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/accessdenied", method = RequestMethod.GET)
    public String errorAccessdenied() {
        return "error/accessdenied";
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/user/egrul/progect", method = RequestMethod.GET)
    public String userAllprodect() {

        return "user/egrul/progect";
    }

}
