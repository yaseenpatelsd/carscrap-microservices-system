package com.carscrap.auth_service.Jwt;

import com.carscrap.auth_service.Enum.Principle;
import com.carscrap.auth_service.Service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFIlter extends OncePerRequestFilter {

    private final JwtGenerator jwtGenerator;
    private final UserService userService;

    public JwtFIlter(JwtGenerator jwtGenerator, UserService userService) {
        this.jwtGenerator = jwtGenerator;
        this.userService = userService;
    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getRequestURI();

        return path.startsWith("/auth/")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars");
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }


        String authHeader=request.getHeader("Authorization");

        if (authHeader == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtGenerator.isValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }


        Claims claims= jwtGenerator.claims(token);
        Long userId = Long.valueOf(claims.getSubject());

        String username = claims.get("username",String.class);
        String role=claims.get("role").toString();

        UserDetails user = userService.loadUserByUsername(username);

        Principle principle=new Principle();
        principle.setId(userId);
        principle.setUsername(username);
        principle.setRole(role);


        if (username != null && SecurityContextHolder.getContext().getAuthentication()==null){

            UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(principle,null,user.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request,response);
    }
}

