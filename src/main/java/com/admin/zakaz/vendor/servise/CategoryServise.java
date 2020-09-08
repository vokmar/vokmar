package com.admin.zakaz.vendor.servise;

import com.admin.zakaz.vendor.entity.SubCategoryVendor;
import com.admin.zakaz.vendor.entity.SubTwoCategoryVendor;
import com.admin.zakaz.vendor.entity.СategoryVendor;

import java.util.List;

public interface CategoryServise {

    public List<СategoryVendor> findByName(); // выбираем все сущности

    СategoryVendor getInsertСategory(СategoryVendor category);

    boolean getDeleteAll_id(List<СategoryVendor> category); // Удаляем список запесей по id=> 12,36,46,45...

    boolean getDeleteAll_idSub(List<SubCategoryVendor> category); // Удаляем список запесей по id=> 12,36,46,45...

    boolean getDeleteAll_idSubTwo(List<SubTwoCategoryVendor> category); // Удаляем список запесей по id=> 12,36,46,45...



    СategoryVendor findId(long id);

}
