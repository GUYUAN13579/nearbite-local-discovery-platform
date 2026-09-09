package com.nearbite;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.nearbite.mapper")
@SpringBootApplication
public class NearBiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(NearBiteApplication.class, args);
    }

}
