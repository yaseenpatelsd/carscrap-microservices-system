package com.CarScrap.Booking_Service.Security;

import com.CarScrap.Booking_Service.Jwt.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.concurrent.Executor;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class Security {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws SecurityException {
        http
                .cors(c-> {})
                .csrf(c -> c.disable())
                .authorizeHttpRequests(auth -> auth
                        // public endpoints
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        .requestMatchers("/appointment/**").hasRole("USER")
                        .requestMatchers("/manage/appointment/**").hasAnyRole("SUPERADMIN", "ADMIN", "STAFF")
                        .requestMatchers("/error", "/error/**").permitAll()                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("Async-");
        executor.initialize();
        return executor;
    }
}
