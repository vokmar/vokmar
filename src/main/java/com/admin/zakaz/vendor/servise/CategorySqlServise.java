package com.admin.zakaz.vendor.servise;

import com.admin.zakaz.vendor.entity.SubCategoryVendor;
import com.admin.zakaz.vendor.entity.SubTwoCategoryVendor;
import com.admin.zakaz.vendor.entity.СategoryVendor;
import com.admin.zakaz.vendor.repository.CategoryRepository;
import com.admin.zakaz.vendor.repository.SubCategoryRepository;
import com.admin.zakaz.vendor.repository.SubTwoCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Service
@Repository
@Transactional
public class CategorySqlServise implements CategoryServise {

    @PersistenceContext()
    private EntityManager em;

    @Autowired
    private CategoryRepository repositories;

    @Autowired
    private SubCategoryRepository repositoriesSub;

    @Autowired
    private SubTwoCategoryRepository repositoriesSubTwo;


    @Override
    public List<СategoryVendor> findByName() {
        TypedQuery<СategoryVendor> query = em.createNamedQuery(СategoryVendor.FIND_ALL, СategoryVendor.class);
        return query.getResultList();
    }

    @Override
    public СategoryVendor getInsertСategory(СategoryVendor category) {
           /*
        Для выполнения проверки даных не сохраненных в БД в представлении добавляется новая сущность с id=1
        чтобы сохранить сущность обнуляем id
         */
        if (category.getId() != null) {
            //em.persist(category);
            em.merge(category);
        } else {
            category.setId(null);
            em.persist(category);
        }

        return findId(category.getId());
    }

    @Override
    public boolean getDeleteAll_id(List<СategoryVendor> category) {
        repositories.deleteAll(category);
        return true;
    }

    @Override
    public boolean getDeleteAll_idSub(List<SubCategoryVendor> categorys) {
        repositoriesSub.deleteAll(categorys);
        return false;
    }

    @Override
    public boolean getDeleteAll_idSubTwo(List<SubTwoCategoryVendor> categorys) {
        repositoriesSubTwo.deleteAll(categorys);
        return false;
    }

    @Override
    public СategoryVendor findId(long id) {
        СategoryVendor fg = em.find(СategoryVendor.class, id);
        return fg;
    }
}
