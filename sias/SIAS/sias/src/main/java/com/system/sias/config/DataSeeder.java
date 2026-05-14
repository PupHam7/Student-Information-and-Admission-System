package com.system.sias.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        // This check prevents duplicate data if tables are already populated
        // You can add a repository check here if needed
        ResourceDatabasePopulator resourceDatabasePopulator = new ResourceDatabasePopulator(
                new ClassPathResource("seed.sql")
        );
        resourceDatabasePopulator.execute(dataSource);
        System.out.println("Database successfully seeded with Sections and Subjects.");
    }
}