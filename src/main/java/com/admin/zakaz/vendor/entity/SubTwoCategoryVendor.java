package com.admin.zakaz.vendor.entity;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "SUBTWOCAREGORYVENDOR")
public class SubTwoCategoryVendor implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUBTWOCAREGORYVENDOR_ID")
    private Long id;
    @Column(name = "SUBTWOCAREGORYVENDOR_NAME")
    @NotBlank(message = "Имя подкатегории не может быть пустым YU1")
    @Size(min = 4, max = 100, message = "Минимальное значение 4, максимальное 150 символов YU2")
    private String name;
    @Column(name = "SUBTWOCAREGORYVENDOR_DESC")
    @Size(max = 150, message = "Максимальное количество 150 символов YU7")
    private String desc;

    public SubTwoCategoryVendor() {
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
}
