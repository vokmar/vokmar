package com.admin.zakaz.vendor.controller;

import com.admin.zakaz.vendor.entity.Vendor;
import com.admin.zakaz.vendor.servise.VendorServise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class VendorController {
    @Autowired
    private VendorServise sv;

    // Начальная загрузка таблицы типа юридических лиц
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/admin/egrul/vendor", method = RequestMethod.GET)
    public String ok(Model mu) {
        Vendor venNev = new Vendor();
        //venNev.setId((long) 1); // Для нового объекта устнавливаем id=1, чтобы можно было выполнять валидацию объекта
        List<Vendor> df = sv.findByName(); // Получение всех записей и передача их в модель
        mu.addAttribute("vendor", df);
        mu.addAttribute("newvend", venNev);
        return "/admin/egrul/vendor";
    }

//    @RequestMapping(value = "/ok/egrul/edit")
//    public String edit(@RequestParam long id, @RequestParam long v, Model model) {
//        //ModelAndView mav = new ModelAndView("edit_customer");
//        Vendor vend = sv.getId(id);
//        model.addAttribute("stys", v);
//        model.addAttribute("vendor", vend);
//        return "edit_customer";
//    }

//   // @PreAuthorize("isAuthenticated()")
//    @RequestMapping(value = "user/egrul/vendor", method = RequestMethod.POST)
//    public String createVendor (@ModelAttribute("vendor") @Valid Vendor vend, BindingResult bindingResult, Model model){
//
//        if (bindingResult.hasErrors()) {
//            return "edit_customer";
//        }
//        Vendor nr = (Vendor) model.getAttribute("vendor");
//        sv.getCreateVokmar(nr);
//        return "/user/egrul/vendor";
//    }

//   // @PreAuthorize("isAuthenticated()")
//    @RequestMapping(value = "/vend.new", method = RequestMethod.POST)
//    public String newVendor (@ModelAttribute("newvend") @Valid Vendor vend, BindingResult bindingResult, Model model){
//        if (bindingResult.hasErrors()) {
//            return "redirect:/admin/egrul/vendor";
//        }
//        sv.getInsertVokmar(vend);
//        return "redirect:/admin/egrul/vendor";
//    }

    // Добавление ноых позиций в таблицу типов юридических лиц
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/vendajax", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Vendor newVendorAjax(@Valid @RequestBody Vendor vend, BindingResult bindingResult, Model model) {

        if (bindingResult.hasErrors()) {
            Vendor venNev = new Vendor();
            // Формируем карту ошибок
            Map<String, String> errors3 = new HashMap<>();

            List<FieldError> errors1 = bindingResult.getFieldErrors();

            Integer i = 0;
            for (FieldError error : errors1) {
                errors3.put("" + i++, error.getDefaultMessage());
            }

            venNev.setValidated(true);
            venNev.setErrorMessages(errors3);
            return venNev;
        }
        vend.setValidated(false);
        return sv.getInsertVokmar(vend);
    }

//    //@PreAuthorize("isAuthenticated()")
//    @RequestMapping(value = "edits")
//    @ResponseBody
//    public String editAjax(@RequestParam long id, @RequestParam long v, Model model) {
//        //ModelAndView mav = new ModelAndView("edit_customer");
//        Vendor vend = sv.getId(id);
//        model.addAttribute("stys", v);
//        model.addAttribute("vendor", vend);
//        return "edit_customer";
//    }


//
//   // @PreAuthorize("isAuthenticated()")
//    @RequestMapping(value = "user/egrul/delete", method = RequestMethod.GET)
//    public String Delete(@RequestParam long id, Model mu) {
//sv.getDeleteVokmar(id);
//        return "redirect:/ok";
//    }

    // Одиночное и массовое удаление записай из таблицы типов юридических лиц
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/delete/all", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean Delete_ALL_Ajax(@RequestBody List<Vendor> vendors) {

        sv.getDeleteAll_id(vendors);
        return true;
    }


}
