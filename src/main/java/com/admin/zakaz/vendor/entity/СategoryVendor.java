package com.admin.zakaz.vendor.entity;


import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Entity
@NamedQueries({@NamedQuery(name = СategoryVendor.FIND_ALL, query = "SELECT cc FROM СategoryVendor cc")})
@Table(name = "CAREGORYVENDOR")
public class СategoryVendor implements Serializable {

    public static final String FIND_ALL = "СategoryVendor.findByName";


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CATEGORY_ID")
    private Long id;

    @Column(name = "CANTEGORY_NAME")
    @NotBlank(message = "Имя категории не может быть пустым")
    @Size(min = 4, max = 100, message = "Минимальное значение 4, максимальное 100 символов")
    private String name;

    @Column(name = "CATEGORY_DESC")
    //@Size(max = 150, message = "Максимальное количество 150 символов")
    private String desc;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.ALL}) //Загружаем подкатегории сразу
    @JoinColumn(name = "CAREGORYVENDOR_FK") // Имя соединительной таблицы
    @Valid // Необходимо для проверки данного объекта в контроллере
    private List<SubCategoryVendor> subcategory;
    @Transient // не хранится в БД
    private boolean validated;
    // Хранится массив ошибок
    @Transient
    private Map<String, String> errorMessages;

    public boolean isValidated() {
        return validated;
    }

    public void setValidated(boolean validated) {
        this.validated = validated;
    }

    public Map<String, String> getErrorMessages() {
        return errorMessages;
    }

    public void setErrorMessages(Map<String, String> errorMessages) {
        this.errorMessages = errorMessages;
    }

    public СategoryVendor() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<SubCategoryVendor> getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(List<SubCategoryVendor> subcategory) {
        this.subcategory = subcategory;
    }
}
