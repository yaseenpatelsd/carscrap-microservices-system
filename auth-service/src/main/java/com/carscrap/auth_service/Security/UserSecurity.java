package com.carscrap.auth_service.Security;


import com.carscrap.auth_service.Jwt.JwtFIlter;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.concurrent.Executor;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class UserSecurity {

    @Bean
    @Order(1)
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFIlter jwtFIlter)throws Exception{

        http
                .cors(cors -> {})   // 🔥 THIS LINE IS MISSING
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers("/auth/**"
                        ).permitAll()

                        .requestMatchers("/private/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()


                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/error"
                        ).permitAll()
                        .requestMatchers("/error","/error/**").permitAll()
                        .requestMatchers("/staff/**").hasAnyRole("SUPER_ADMIN","ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFIlter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
                )
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
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



