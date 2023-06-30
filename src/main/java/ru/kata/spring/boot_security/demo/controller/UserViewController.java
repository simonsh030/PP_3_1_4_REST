package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@Controller
public class UserViewController {

    private final UserService userService;

    public UserViewController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String showUserPage(Model model, Principal principal) {
        model.addAttribute("user", userService.findUserByName(principal.getName()));
        return "user";
    }
}