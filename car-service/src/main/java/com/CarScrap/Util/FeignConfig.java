package com.CarScrap.Util;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public feign.Retryer retryer() {
        return new feign.Retryer.Default(2000, 5000, 3);
    }
}
