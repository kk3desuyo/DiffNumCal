package org.example.diffnum;
import ch.qos.logback.core.model.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.*;

@Controller
public class HttpController {

    @RequestMapping(value = {"/home", "/"})
    public String showHomePage(Model model) {
        return "html/home";
    }
    @RequestMapping("/home/privacy-policy")
    public String showPrivacyPolicy(Model model) {
        return "html/privacy-policy";  // templates/html/home.htmlへのビュ
    }
    @RequestMapping("/home/manualCal")
    public String showManualCalPage(Model model) {
        return "html/manual";  // templates/html/manual.htmlへのビュー名を返す
    }

    @RequestMapping("/home/manualCal/how-to")
    public String showManualCalHowTo(Model model) {
        return "html/how-to";  // templates/html/manual.htmlへのビュー名を返す
    }

    //画像傾き補正のためのpython呼び出し

}

