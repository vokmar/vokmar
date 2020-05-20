package com.admin.zakaz.vendor.servise;

import com.admin.zakaz.vendor.entity.Vendor;
import com.admin.zakaz.vendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;


@Service
@Repository
@Transactional
public class VendorSqlServise implements VendorServise {

    @Autowired
    VendorRepository repositories;
    @PersistenceContext()
    private EntityManager em;

    @Override // Выбор всех строк таблицы
    public List<Vendor> findByName() {
        TypedQuery<Vendor> query = em.createNamedQuery(Vendor.FIND_ALL, Vendor.class);
        return query.getResultList();
    }

    @Override // Поиск сущности по id
    public Vendor getId(Long id) {
        return em.find(Vendor.class, id);
    }

    @Override // Обновление сущности
    public void getCreateVokmar(Vendor vendor) {
        em.merge(vendor);
    }

    @Override // Вставка новой сущности
    public Vendor getInsertVokmar(Vendor v) {
        /*
        Для выполнения проверки даных не сохраненных в БД в представлении добавляется новая сущность с id=1
        чтобы сохранить сущность обнуляем id
         */

        if (v.getId() != null) {
            em.merge(v);
        } else {
            v.setId(null);
            em.persist(v);
        }


        return v;
    }

    @Override
    public void getDeleteVokmar(long id) {
        Vendor obg = em.find(Vendor.class, id);
        em.remove(obg);
    }

    @Override
    public boolean getDeleteAll_id(List<Vendor> vendors) {

        repositories.deleteAll(vendors);

        return true;
    }


}
