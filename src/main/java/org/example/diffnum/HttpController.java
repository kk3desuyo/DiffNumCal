package org.example.diffnum;
import ch.qos.logback.core.model.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HttpController {

    @RequestMapping("/home")
    public String showHomePage(Model model) {
        return "html/home";  // templates/html/home.htmlへのビュー名を返す
    }

    @RequestMapping("/home/manualCal")
    public String showManualCalPage(Model model) {
        return "html/manual";  // templates/html/manual.htmlへのビュー名を返す
    }
}
