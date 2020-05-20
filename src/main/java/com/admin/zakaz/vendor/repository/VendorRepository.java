package com.admin.zakaz.vendor.repository;


import com.admin.zakaz.vendor.entity.Vendor;
import org.springframework.data.repository.CrudRepository;

public interface VendorRepository extends CrudRepository<Vendor, Long> {

    @Override
    void deleteAll(Iterable<? extends Vendor> entities);
}
