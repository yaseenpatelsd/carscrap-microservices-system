package com.CarScrap.Booking_Service.FeignCommunication;

import com.CarScrap.Booking_Service.Util.FeightIntercepter;
import feign.Logger;
import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return new CustomErrorDecoder();
    }

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new FeightIntercepter();
    }

    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public feign.Retryer retryer() {
        return new feign.Retryer.Default(2000, 5000, 3);
    }
}