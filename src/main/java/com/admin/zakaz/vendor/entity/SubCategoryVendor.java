package com.admin.zakaz.vendor.entity;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "SUBCAREGORYVENDOR")
public class SubCategoryVendor implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUBCATEGORY_ID")
    private Long id;
    @Column(name = "SUBCANTEGORY_NAME")
    @NotBlank(message = "Имя дополнительной подкатегории не может быть пустым")
    @Size(min = 4, max = 100, message = "Минимальное значение 4, максимальное 150 символов")
    private String name;
    @Column(name = "SUBCATEGORY_DESC")
    @Size(max = 150, message = "Максимальное количество 150 символов")
    private String desc;
    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.ALL}) //Загружаем подкатегории 2 сразу
    @JoinColumn(name = "SUBTWOCATEGORY_FK") // Имя соединительной таблицы
    private List<SubTwoCategoryVendor> subtwocategory;

    public SubCategoryVendor() {
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

    public List<SubTwoCategoryVendor> getSubtwocategory() {
        return subtwocategory;
    }

    public void setSubtwocategory(List<SubTwoCategoryVendor> subtwocategory) {
        this.subtwocategory = subtwocategory;
    }
}
