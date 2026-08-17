# Getting Started

## Development
### Config JAVA_HOME
Add JAVA_HOME in system environment. 
Run `echo %JAVA_HOME%` to check value
(Project use JDK 17)

To start your application in the development profile, simply run:

    > mvnw
* [http://localhost:8085](http://localhost:8085)

Port default config in file [application.yaml]

    server.port: 8085
Or start with production profile, run:

    > mvnw -Pprod

Ctrl + C to stop
### Password encrypt
Password in table encrypted by `new BCryptPasswordEncoder().encode(password)`

    Ex: new BCryptPasswordEncoder().encode("admin")
    Output: $2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy

## Login with API
    http://localhost:8085/login

Example running on Windows command environment:

    curl -d "{\"username\": \"admin\", \"password\": \"admin\"}" ^
        -H "Content-Type: application/json" ^
        -X POST http://localhost:8085/login

Running on Linux or Git bash command:

    curl -d "{\"username\": \"admin\", \"password\": \"admin\"}" \
        -H "Content-Type: application/json" \
        -X POST http://localhost:8085/login

You can use "Postman" to run the test: `https://www.postman.com`

## Call other API
`Set Authorization: Bearer <token>` when calling request api

    Ex:
    curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InNlbGYiLCJleHAiOjE2NzcwMTI0MTgsImlhdCI6MTY3NjQzNjQxOH0.jlBId03AYp5gRn1aTY2YinWPzTIZzmSgMzXujlvpkIAmseH7TpL4FCfdJLvZFFtlLjN9Pe_AYfcMtdTwJLm_OA" \
        -X POST http://localhost:8085/test-auth
    
    Output: {"msg":"Token is valid"}

## Source code structure
#### Source code java
    /java
      /com.luvina.la
        /config
          /jwt
        /controller
        /dto (Contains DTO class, intermediate class that transfer data between payload and entity)
        /entity (Contains entity class, attribute mapping with table)
        /mapper
        /payload (Contains Request/Response class)
        /repository
        /service
          /impl

#### Resource file:
    /resources
      /config
        /application.yaml (common config file)
        /application-dev.yaml (config file for development environment)
        /application-prod.yaml (config file for production environment)
      /db
        /migration (contains sql script files for migrate database: V<version>__<description>.sql)
      /logback-spring.xml (config output log level for package)

### Flyway database migration enable/disable
    spring
      flyway:
        enabled: true

`enabled: true` auto execute sql script in file resources/db/migration/Vx__<description>.sql
SQL Script version information is managed in the `flyway_schema_history` table

### Reference Documentation

For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.7.4/maven-plugin/reference/html/)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#using.devtools)
* [Flyway Migration](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#howto.data-initialization.migration-tool.flyway)
* [Spring Configuration Processor](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#appendix.configuration-metadata.annotation-processor)
* [Spring Web](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#web)
* [Spring Data JPA](https://docs.spring.io/spring-boot/docs/2.7.4/reference/htmlsingle/#data.sql.jpa-and-spring-data)

### Guides

The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
* [MapStruct Mapper](https://www.tutorialspoint.com/mapstruct/mapstruct_basic_mapping.htm)

