package com.CarScrap.Security;

import com.CarScrap.Jwt.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, JwtFilter jwtFilterChain) throws Exception {
        httpSecurity

                .cors(c->{})
                .csrf(c->c.disable())
                .authorizeHttpRequests(auth->auth
                        .requestMatchers("/car/**").hasRole("USER")
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers("/internal/**").permitAll()
                        .requestMatchers("/metal=price/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/error", "/error/**").permitAll()
                        .anyRequest().permitAll()
                )

                .addFilterBefore(jwtFilterChain, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}
