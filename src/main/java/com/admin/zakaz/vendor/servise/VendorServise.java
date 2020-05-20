package com.admin.zakaz.vendor.servise;

import com.admin.zakaz.vendor.entity.Vendor;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface VendorServise {

    List<Vendor> findByName(); // выборка всех данных из таблицы Vendor

    Vendor getId(Long id); //  Получение id из таблицы Vendor

    void getCreateVokmar(Vendor vendor); // Обновление данных в БД

    Vendor getInsertVokmar(Vendor vendor); // Вставка новых даных в БД

    void getDeleteVokmar(long id); // Удаление записи из таблицы Vendorb

    boolean getDeleteAll_id(List<Vendor> vendors); // Удаляем список запесей по id=> 12,36,46,45...

}
