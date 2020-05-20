package com.admin.zakaz.vendor.entity;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "CAREGORYVENDOR")
public class СategoryVendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CATEGORY_ID")
    private Long id;
    @Column(name = "CANTEGORY_NAME")
    @NotBlank(message = "Имя категории не может быть пустым")
    @Size(min = 4, max = 150, message = "Минимальное значение 4, максимальное 150 символов")
    private String name;
    @Column(name = "CATEGORY_DESC")
    private String desc;

    public СategoryVendor() {
    }


}
