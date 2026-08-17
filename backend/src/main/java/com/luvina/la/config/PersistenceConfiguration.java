package com.luvina.la.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan({"com.luvina.la"})
@EntityScan("com.luvina.la.entity")
@EnableJpaRepositories("com.luvina.la.repository")
@ConfigurationProperties("spring.datasource")
public class PersistenceConfiguration extends HikariConfig {

    private final Environment env;

    PersistenceConfiguration(Environment env) {
        this.env = env;
    }

    @Bean
    DataSource dataSource() {
        this.setAutoCommit(false);
        return new HikariDataSource(this);
    }
}
