package ru.boq.vokmar.config;


import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableJpaRepositories(basePackages = {"ru", "secyriry", "com"})
@ComponentScan(basePackages = {"ru", "secyriry", "com"})
@EnableTransactionManagement
public class DaraServisConfig {

    @Bean
    public DataSource dataSource() {

        try {
            BasicDataSource dataSource = new BasicDataSource();
            dataSource.setUrl("jdbc:mysql://localhost:3306/mysqlo?" +
                    "useJDBCCompliantTimezoneShift=true" +
                    "&useLegacyDatetimeCode=false" +
                    "&serverTimezone=UTC" +
                    "&useSSL=false" +
                    "&useUnicode=true" +
                    "&connectionCollation=utf8_general_ci" +
                    "&characterSetResults=utf8" +
                    "&characterEncoding=utf-8");
            dataSource.setUsername("root");
            dataSource.setPassword("1vokmar2");
            dataSource.setInitialSize(5);

            dataSource.setMaxActive(10);

            return dataSource;

        } catch (Exception e) {
            System.out.print("Ошибка" + e);
            return null;
        }
    }

    @Bean
    public Properties hibernateProperties() {
        Properties hibernateProp = new Properties();
        hibernateProp.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
        hibernateProp.put("hibernate.hbm2ddl.auto", "update"); //create
        hibernateProp.put("hibernate.show_sql", true);
        hibernateProp.put("hibernate.max_fetch_depth", 3);
        hibernateProp.put("hibernate.jdbc.batch_size", 10);
        hibernateProp.put("hibernate.jdbc.fetch_size", 50);
        //Кодировка
        hibernateProp.put("hibernate.connection.characterEncoding", "utf8");
        hibernateProp.put("hibernate.connection.CharSet", "utf8");
        hibernateProp.put("hibernate.connection.useUnicode", true);

        return hibernateProp;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new JpaTransactionManager(entityManagerFactory());
    }

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }


    @Bean
    public EntityManagerFactory entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setPackagesToScan("ru", "secyriry", "com");
        factoryBean.setDataSource(dataSource());
        factoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        factoryBean.setJpaProperties(hibernateProperties());
        factoryBean.setJpaVendorAdapter(jpaVendorAdapter());
        factoryBean.afterPropertiesSet();
        return factoryBean.getNativeEntityManagerFactory();
    }


}
