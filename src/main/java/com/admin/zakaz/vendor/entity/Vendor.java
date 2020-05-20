package com.admin.zakaz.vendor.entity;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Map;

@Entity
// Выбор всех элементов таблицы
@NamedQueries({@NamedQuery(name = Vendor.FIND_ALL, query = "SELECT cc FROM Vendor cc")})
@Table(name = "VENDORS")
public class Vendor implements Serializable {

    public static final String FIND_ALL = "Vendor.findByName";
    // Идентификатор поставщика в базе данных
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VENDOR_ID")
    private Long id;
    // Тип поставщика (без указания типа юридического лица)
    @Column(name = "VENDOR_NAME")
    @NotBlank(message = "Тип не может быть пустым")
    @Size(min = 2, max = 50, message = "Минимальное значение 2 знака,\n максимальное 50")
    private String name;
    @Column(name = "VENDOR_DESC")
    @Size(max = 150, message = "Максимальное количество знаков 150")
    private String desc;
    @Transient // не хранится в БД
    private boolean validated;
    // Хранится массив ошибок
    @Transient
    private Map<String, String> errorMessages;

    public Vendor() {
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




    /*
    validated - false в метаде Ajax будут выводится ошибки из карты ошибок
    errorMessages - карта ошибок
    */

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Map<String, String> getErrorMessages() {
        return errorMessages;
    }

    public void setErrorMessages(Map<String, String> errorMessages) {
        this.errorMessages = errorMessages;
    }

    public boolean isValidated() {
        return validated;
    }

    public void setValidated(boolean validated) {
        this.validated = validated;
    }
}
