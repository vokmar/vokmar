package com.admin.zakaz.vendor.repository;


import com.admin.zakaz.vendor.entity.SubCategoryVendor;
import com.admin.zakaz.vendor.entity.SubTwoCategoryVendor;
import org.springframework.data.repository.CrudRepository;


public interface SubTwoCategoryRepository extends CrudRepository<SubTwoCategoryVendor, Long> {

    @Override
    void deleteAll(Iterable<? extends SubTwoCategoryVendor> entities);


}
