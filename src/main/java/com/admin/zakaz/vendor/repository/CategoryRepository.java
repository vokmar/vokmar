package com.admin.zakaz.vendor.repository;


import com.admin.zakaz.vendor.entity.СategoryVendor;
import org.springframework.data.repository.CrudRepository;


public interface CategoryRepository extends CrudRepository<СategoryVendor, Long> {

    @Override
    void deleteAll(Iterable<? extends СategoryVendor> entities);


}
