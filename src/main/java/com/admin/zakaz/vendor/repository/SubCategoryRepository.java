package com.admin.zakaz.vendor.repository;


import com.admin.zakaz.vendor.entity.SubCategoryVendor;
import org.springframework.data.repository.CrudRepository;


public interface SubCategoryRepository extends CrudRepository<SubCategoryVendor, Long> {

    @Override
    void deleteAll(Iterable<? extends SubCategoryVendor> entities);


}
