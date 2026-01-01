package com.example.EGA.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/test")
@CrossOrigin("*")
public class TestController {

    @GetMapping("/ping")
    public String ping(){
        return "Backend OK ✔️";
    }
}

