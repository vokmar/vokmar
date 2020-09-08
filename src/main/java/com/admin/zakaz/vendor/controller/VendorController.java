package com.admin.zakaz.vendor.controller;

import com.admin.zakaz.vendor.entity.SubCategoryVendor;
import com.admin.zakaz.vendor.entity.SubTwoCategoryVendor;
import com.admin.zakaz.vendor.entity.Vendor;
import com.admin.zakaz.vendor.entity.СategoryVendor;
import com.admin.zakaz.vendor.servise.CategoryServise;
import com.admin.zakaz.vendor.servise.CategorySqlServise;
import com.admin.zakaz.vendor.servise.VendorServise;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.codehaus.jettison.json.JSONObject;
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

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class VendorController {
    @Autowired
    private VendorServise sv;

    @Autowired
    private CategoryServise categoryS;


    /* Начальная загрузка
    таблица типа юридических лиц Vendor
    таблица категорий СategoryVendor

    * */
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/admin/egrul/vendor", method = RequestMethod.GET)
    public String ok(Model mu, HttpServletResponse response) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        List<СategoryVendor> catVendor = categoryS.findByName();
        String strVendor = objectMapper.writeValueAsString(catVendor);

        mu.addAttribute("vendor", sv.findByName()); // Получение всех записей и передача их в модель
        mu.addAttribute("category", catVendor);
        mu.addAttribute("catevend", strVendor);
        return "/admin/egrul/vendor";
    }

    // Добавление ноых позиций в таблицу типов юридических лиц
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/egrulname", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
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


    // Одиночное и массовое удаление записей из таблицы типов юридических лиц
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/egrulname/delete/all", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean Delete_ALL_Ajax(@RequestBody List<Vendor> vendors) {
        sv.getDeleteAll_id(vendors);
        return true;
    }

    // Создаем или изменяем категорию
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/category", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public СategoryVendor newСategoryAjax(@Valid @RequestBody СategoryVendor category, BindingResult bindingResult, Model model) {


        if (bindingResult.hasErrors()) {
            СategoryVendor categ = new СategoryVendor();
            // Формируем карту ошибок
            Map<String, String> errors3 = new HashMap<>();

            List<FieldError> errors1 = bindingResult.getFieldErrors();

            Integer i = 0;
            for (FieldError error : errors1) {
                errors3.put("" + i++, error.getDefaultMessage());
            }

            categ.setValidated(true);
            categ.setErrorMessages(errors3);
            return categ;
        }
        category.setValidated(false);
        return categoryS.getInsertСategory(category);
    }

    // Одиночное и массовое удаление записей из таблицы категорий
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/category/delete/all", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean Delete_ALL_Ajax_category(@RequestBody List<СategoryVendor> category) {
        categoryS.getDeleteAll_id(category);
        return true;
    }

    // Одиночное и массовое удаление записей из таблицы под категорий
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/subcategory/delete/all", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean Delete_ALL_Ajax_subCategory(@RequestBody List<SubCategoryVendor> category) {
        categoryS.getDeleteAll_idSub(category);
        return true;
    }

    // Одиночное и массовое удаление записей из таблицы под категорий
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/subtwocategory/delete/all", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean Delete_ALL_Ajax_subTwoCategory(@RequestBody List<SubTwoCategoryVendor> category) {
        categoryS.getDeleteAll_idSubTwo(category);
        return true;
    }

    // Контроллер взаимодействия с модулем JSQTable
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "admin/egrul/russ", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<СategoryVendor> dataObgect() {
        List<СategoryVendor> catVendor = categoryS.findByName();
        return catVendor;
    }



}
