package org.example.diffnum;
import ch.qos.logback.core.model.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
